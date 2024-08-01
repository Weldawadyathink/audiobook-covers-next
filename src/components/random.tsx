"use client";

import { api } from "@/trpc/react";
import { ImageCard } from "@/components/ImageCard";

export function RandomView() {
  const n = 10;

  const images = api.cover.getRandom.useQuery({ n: n });

  return (
    <div className="flex flex-wrap justify-center gap-6 p-12">
      {images.data?.map((image) => (
        <ImageCard imageData={image} key={image.id} className="w-56" />
      ))}
    </div>
  );
}
