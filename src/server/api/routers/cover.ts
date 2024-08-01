import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { runSingleClip } from "@/server/utils/clip";
import { db } from "@/server/db";
import { image } from "@/server/db/schema";
import { cosineDistance, eq, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export interface ImageData {
  id: string;
  url: string;
  blurhash: string;
}

// Function to generate output type from db result
function generateImageData(dbData: {
  id: string;
  extension: string | null;
  blurhash: string | null;
}): ImageData {
  const url = `https://f001.backblazeb2.com/file/com-audiobookcovers/original/${dbData.id}.${dbData.extension}`;
  return {
    id: dbData.id,
    url: url,
    blurhash: dbData.blurhash!,
  };
}

export const coverRouter = createTRPCRouter({
  getCover: publicProcedure
    .input(z.string().trim())
    .query(async ({ input }): Promise<ImageData> => {
      const [result] = await db
        .select({
          id: image.id,
          extension: image.extension,
          blurhash: image.blurhash,
        })
        .from(image)
        .where(eq(image.id, input))
        .limit(1);
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return generateImageData(result);
    }),
  getSimilar: publicProcedure
    .input(z.string().trim())
    .query(async ({ input }): Promise<Array<ImageData>> => {
      const [targetImage] = await db
        .select({
          id: image.id,
          embedding: image.embedding,
        })
        .from(image)
        .where(eq(image.id, input))
        .limit(1);
      if (!targetImage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const dbResult = await db
        .select({
          id: image.id,
          extension: image.extension,
          blurhash: image.blurhash,
          cosineSimilarity: cosineDistance(
            image.embedding,
            targetImage.embedding!,
          ),
        })
        .from(image)
        .where(ne(image.id, targetImage.id))
        .orderBy(cosineDistance(image.embedding, targetImage.embedding!))
        .limit(10);
      console.log(dbResult);
      return dbResult.map(generateImageData);
    }),
  getTextEmbedding: publicProcedure
    .input(z.string().trim().min(1))
    .query(async ({ input }) => {
      console.log(`Running replicate with ${input}`);
      return await runSingleClip(input);
    }),
  getRandom: publicProcedure
    .input(z.object({ n: z.number().int() }))
    .query(async ({ input }): Promise<Array<ImageData>> => {
      // If this query gets too slow, switch to TABLESAMPLE
      const dbResult = await db
        .select({
          id: image.id,
          extension: image.extension,
          blurhash: image.blurhash,
        })
        .from(image)
        .orderBy(sql`random()`)
        .limit(input.n);
      return dbResult.map(generateImageData);
    }),
});
