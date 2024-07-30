import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { runSingleClip } from "@/shared/clip";

export const coverRouter = createTRPCRouter({
  getTextEmbedding: publicProcedure
    .input(z.string().trim().min(1))
    .query(async ({ input }) => {
      console.log(`Running replicate with ${input}`);
      return await runSingleClip(input);
    }),
});
