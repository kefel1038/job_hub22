import { Router, type IRouter } from "express";
import { count, eq, sql, gte } from "drizzle-orm";
import { db, jobsTable, companiesTable, applicationsTable } from "@workspace/db";
import {
  GetDashboardStatsResponse,
  GetCategoryStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const [totalJobsResult] = await db.select({ count: count() }).from(jobsTable);
  const [verifiedJobsResult] = await db
    .select({ count: count() })
    .from(jobsTable)
    .where(eq(jobsTable.verificationStatus, "verified"));
  const [activeCompaniesResult] = await db.select({ count: count() }).from(companiesTable);
  const [totalApplicationsResult] = await db.select({ count: count() }).from(applicationsTable);
  const [pendingVerificationsResult] = await db
    .select({ count: count() })
    .from(jobsTable)
    .where(eq(jobsTable.verificationStatus, "pending"));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [recentJobsResult] = await db
    .select({ count: count() })
    .from(jobsTable)
    .where(gte(jobsTable.createdAt, thirtyDaysAgo));

  const stats = {
    totalJobs: totalJobsResult.count,
    verifiedJobs: verifiedJobsResult.count,
    activeCompanies: activeCompaniesResult.count,
    totalApplications: totalApplicationsResult.count,
    pendingVerifications: pendingVerificationsResult.count,
    recentJobsCount: recentJobsResult.count,
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

router.get("/stats/categories", async (_req, res): Promise<void> => {
  const results = await db
    .select({
      category: jobsTable.category,
      count: sql<number>`cast(count(*) as integer)`,
    })
    .from(jobsTable)
    .groupBy(jobsTable.category)
    .orderBy(sql`count(*) desc`);

  res.json(GetCategoryStatsResponse.parse(results));
});

export default router;
