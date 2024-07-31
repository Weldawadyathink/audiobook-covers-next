"use client";

import { api } from "@/trpc/react";
import { ImageCard } from "@/components/ImageCard";
import { useState } from "react";
import type { ImageData } from "@/server/api/routers/cover";

export function RandomView() {
  const n = 10;

  const images = api.cover.getRandom.useQuery({ n: n });

  const [flippedId, setFlippedId] = useState<string>("none");

  function handleCardFlip(newState: boolean, imageData: ImageData) {
    if (newState) {
      setFlippedId(imageData.id);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-12">
      {images.data?.map((image) => (
        <ImageCard
          imageData={image}
          key={image.id}
          currentFlippedCardId={flippedId}
          onFlip={handleCardFlip}
        />
      ))}
    </div>
  );
}
