import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryDisplay: text("salary_display"),
  jobType: text("job_type").notNull().default("full-time"),
  category: text("category").notNull(),
  verificationStatus: text("verification_status").notNull().default("pending"),
  verificationNotes: text("verification_notes"),
  verificationScore: integer("verification_score"),
  applyWhatsapp: text("apply_whatsapp"),
  applyEmail: text("apply_email"),
  applyUrl: text("apply_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  companyId: integer("company_id"),
  companyName: text("company_name").notNull(),
  companyLogo: text("company_logo"),
  isVerifiedEmployer: boolean("is_verified_employer").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  verificationStatus: true,
  verificationNotes: true,
  verificationScore: true,
  isFeatured: true,
});
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
