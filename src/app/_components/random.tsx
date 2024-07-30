"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import { getBlurhashDataUrl } from "@/lib/blurhashDecode";

export function RandomView() {
  const n = 10;

  const images = api.cover.getRandom.useQuery({ n: n });

  return (
    <>
      {images.data?.map((image) => (
        <Image
          key={image.id}
          src={image.url}
          alt="Alt Text Here"
          width={200}
          height={200}
          placeholder="blur"
          blurDataURL={getBlurhashDataUrl(image.blurhash)}
        />
      ))}
    </>
  );
}
