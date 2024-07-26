import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import Replicate from "replicate";

interface ClipReturnObject {
  input: string;
  embedding: Array<number>;
}

export const coverRouter = createTRPCRouter({
  getTextEmbedding: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
      const [output] = (await replicate.run(
        "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
        {
          input: {
            inputs: input,
          },
        },
      )) as Array<ClipReturnObject>;
      return output;
    }),
});
