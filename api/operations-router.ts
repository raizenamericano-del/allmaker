import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { operations, fileHistory, analytics } from "@db/schema";
import { desc } from "drizzle-orm";

export const operationsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(operations).orderBy(desc(operations.createdAt)).limit(100);
  }),

  create: publicQuery
    .input(
      z.object({
        tool: z.string().min(1),
        operationType: z.string().min(1),
        fileName: z.string().optional(),
        fileSize: z.string().optional(),
        status: z.enum(["success", "error", "processing"]).default("success"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(operations).values({
        tool: input.tool,
        operationType: input.operationType,
        fileName: input.fileName,
        fileSize: input.fileSize,
        status: input.status,
      });
      return { ok: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const ops = await db.select().from(operations);
    const totalOps = ops.length;
    const successOps = ops.filter((o) => o.status === "success").length;
    const errorOps = ops.filter((o) => o.status === "error").length;
    return { totalOps, successOps, errorOps };
  }),
});

export const fileHistoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(fileHistory).orderBy(desc(fileHistory.createdAt)).limit(100);
  }),

  create: publicQuery
    .input(
      z.object({
        originalName: z.string().min(1),
        toolUsed: z.string().min(1),
        fileSize: z.string().optional(),
        mimeType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(fileHistory).values(input);
      return { ok: true };
    }),
});

export const analyticsRouter = createRouter({
  track: publicQuery
    .input(z.object({ tool: z.string().min(1), action: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(analytics).values(input);
      return { ok: true };
    }),
});
