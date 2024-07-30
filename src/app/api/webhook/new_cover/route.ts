import type { NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";
import { env } from "@/env";
import { blurHashEncode } from "@/shared/blurHash";
import Replicate from "replicate";
import { image } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

interface SupabaseWebhookPayload {
  type: string;
  table: string;
  record: {
    id: string;
    extension: string;
  };
  schema: string;
  old_record: string;
}

interface ClipReturnObject {
  input: string;
  embedding: Array<number>;
}

async function indexFile(id: string, extension: string) {
  const url = `https://f001.backblazeb2.com/file/com-audiobookcovers/original/${id}.${extension}`;

  const replicate = new Replicate({
    auth: env.REPLICATE_API_TOKEN,
  });

  const replicatePromise = replicate.run(
    "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
    {
      input: {
        inputs: url,
      },
    },
  );

  const hash = await blurHashEncode(url);

  const replicateResult = (await replicatePromise) as Array<ClipReturnObject>;

  await db
    .update(image)
    // @ts-expect-error replicate will always return a result
    .set({ embedding: replicateResult[0].embedding, hash: hash })
    .where(eq(image.id, id));

  console.log(`Inserted embedding and blurhash for ${id}`);
}

export async function POST(req: NextRequest) {
  const json = (await req.json()) as SupabaseWebhookPayload;
  console.log(["Received webhook for new cover", json]);
  waitUntil(indexFile(json.record.id, json.record.extension));
  return new Response("Success!", {
    status: 200,
  });
}
