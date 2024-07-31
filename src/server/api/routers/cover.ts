import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { runSingleClip } from "@/server/utils/clip";
import { db } from "@/server/db";
import { image } from "@/server/db/schema";

export interface ImageData {
  id: string;
  url: string;
  blurhash: string;
}

export const coverRouter = createTRPCRouter({
  getTextEmbedding: publicProcedure
    .input(z.string().trim().min(1))
    .query(async ({ input }) => {
      console.log(`Running replicate with ${input}`);
      return await runSingleClip(input);
    }),
  getRandom: publicProcedure
    .input(z.object({ n: z.number().int() }))
    .query(async ({ input }): Promise<Array<ImageData>> => {
      const dbResult = await db
        .select({
          id: image.id,
          extension: image.extension,
          blurhash: image.blurhash,
        })
        .from(image)
        .limit(input.n);
      return dbResult.map((image) => {
        const url = `https://f001.backblazeb2.com/file/com-audiobookcovers/original/${image.id}.${image.extension}`;
        return {
          id: image.id,
          url: url,
          blurhash: image.blurhash!,
        };
      });
    }),
});
