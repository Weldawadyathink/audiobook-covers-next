"use client";

import { api } from "@/trpc/react";
import { getBlurhashDataUrl } from "@/lib/blurhash";
import Image from "next/image";
import React from "react";
import { ImageCard } from "@/components/ImageCard";

export default function Page({ params }: { params: { imageId: string } }) {
  const image = api.cover.getCover.useQuery(params.imageId);
  const similar = api.cover.getSimilar.useQuery(params.imageId);

  return (
    <>
      <h1>Image {params.imageId}</h1>
      {image.status === "pending" && <span>Waiting for query</span>}
      {image.status === "error" && <span>404 Image not found</span>}

      <div className="relative m-8 aspect-square overflow-hidden rounded-3xl">
        {image.status === "success" && (
          <Image
            src={image.data.url}
            alt="Audiobook cover image"
            fill={true}
            placeholder="blur"
            priority={true}
            blurDataURL={getBlurhashDataUrl(image.data.blurhash)}
          />
        )}
      </div>

      <span>Similar Images</span>
      {similar.status === "pending" && <span>Waiting for query</span>}
      {similar.status === "error" && <span>404 Similar images not found</span>}
      {similar.status === "success" && (
        <div className="flex flex-wrap justify-center gap-6 p-12">
          {similar.data?.map((image) => (
            <ImageCard imageData={image} key={image.id} className="w-56" />
          ))}
        </div>
      )}
    </>
  );
}
