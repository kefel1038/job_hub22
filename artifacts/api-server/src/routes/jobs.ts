import { Router, type IRouter } from "express";
import { eq, ilike, and, gte, lte, sql } from "drizzle-orm";
import { db, jobsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import {
  ListJobsQueryParams,
  CreateJobBody,
  GetJobParams,
  GetJobResponse,
  UpdateJobParams,
  UpdateJobBody,
  UpdateJobResponse,
  DeleteJobParams,
  VerifyJobParams,
  VerifyJobResponse,
  ListJobsResponse,
  GetFeaturedJobsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs", async (req, res): Promise<void> => {
  const params = ListJobsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { category, location, verificationStatus, search, salaryMin, salaryMax } = params.data;

  const conditions = [];
  if (category) conditions.push(eq(jobsTable.category, category));
  if (location) conditions.push(ilike(jobsTable.location, `%${location}%`));
  if (verificationStatus) conditions.push(eq(jobsTable.verificationStatus, verificationStatus));
  if (search) {
    conditions.push(
      sql`(${ilike(jobsTable.title, `%${search}%`)} OR ${ilike(jobsTable.description, `%${search}%`)} OR ${ilike(jobsTable.companyName, `%${search}%`)})`
    );
  }
  if (salaryMin != null) conditions.push(gte(jobsTable.salaryMin, salaryMin));
  if (salaryMax != null) conditions.push(lte(jobsTable.salaryMax, salaryMax));

  const jobs = await db
    .select()
    .from(jobsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(jobsTable.createdAt);

  res.json(ListJobsResponse.parse(serializeDates(jobs)));
});

router.post("/jobs", async (req, res): Promise<void> => {
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [job] = await db
    .insert(jobsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(GetJobResponse.parse(serializeDates(job)));
});

router.get("/jobs/featured", async (_req, res): Promise<void> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.isFeatured, true), eq(jobsTable.verificationStatus, "verified")))
    .orderBy(jobsTable.createdAt)
    .limit(6);

  res.json(GetFeaturedJobsResponse.parse(serializeDates(jobs)));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, params.data.id));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  await db
    .update(jobsTable)
    .set({ viewCount: job.viewCount + 1 })
    .where(eq(jobsTable.id, params.data.id));

  res.json(GetJobResponse.parse(serializeDates({ ...job, viewCount: job.viewCount + 1 })));
});

router.patch("/jobs/:id", async (req, res): Promise<void> => {
  const params = UpdateJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [job] = await db
    .update(jobsTable)
    .set(parsed.data)
    .where(eq(jobsTable.id, params.data.id))
    .returning();

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json(UpdateJobResponse.parse(serializeDates(job)));
});

router.delete("/jobs/:id", async (req, res): Promise<void> => {
  const params = DeleteJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [job] = await db
    .delete(jobsTable)
    .where(eq(jobsTable.id, params.data.id))
    .returning();

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/jobs/:id/verify", async (req, res): Promise<void> => {
  const params = VerifyJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const flags: string[] = [];
  let score = 100;

  const desc = (existing.description || "").toLowerCase();
  const title = (existing.title || "").toLowerCase();
  const email = (existing.applyEmail || "").toLowerCase();

  if (email.includes("@gmail.com") || email.includes("@yahoo.com") || email.includes("@hotmail.com")) {
    flags.push("Uses personal email domain (not company email)");
    score -= 25;
  }
  if (!existing.salaryMin && !existing.salaryDisplay) {
    flags.push("No salary information provided");
    score -= 10;
  }
  if (desc.includes("urgent") && desc.includes("immediately")) {
    flags.push("Suspicious urgency language detected");
    score -= 15;
  }
  if (desc.length < 100) {
    flags.push("Job description is very short and lacks detail");
    score -= 20;
  }
  if (!existing.companyId && !existing.applyUrl && !existing.applyEmail && !existing.applyWhatsapp) {
    flags.push("No company profile or application contact method provided");
    score -= 30;
  }
  if (title.includes("earn") || title.includes("make money") || title.includes("work from home fast")) {
    flags.push("Title contains suspicious money-making language");
    score -= 30;
  }
  if (existing.salaryMin && existing.salaryMin > 50000) {
    flags.push("Unusually high salary — please verify with company");
    score -= 10;
  }

  const clampedScore = Math.max(0, Math.min(100, score));

  let verificationStatus: string;
  let notes: string;
  if (clampedScore >= 75) {
    verificationStatus = "verified";
    notes = flags.length === 0 ? "Job passed all verification checks." : `Minor issues found: ${flags.join(". ")}`;
  } else if (clampedScore >= 40) {
    verificationStatus = "risky";
    notes = `Proceed with caution: ${flags.join(". ")}`;
  } else {
    verificationStatus = "fake";
    notes = `High risk — likely fraudulent: ${flags.join(". ")}`;
  }

  const [updated] = await db
    .update(jobsTable)
    .set({ verificationStatus, verificationNotes: notes, verificationScore: clampedScore })
    .where(eq(jobsTable.id, params.data.id))
    .returning();

  res.json(VerifyJobResponse.parse(serializeDates(updated)));
});

export default router;
