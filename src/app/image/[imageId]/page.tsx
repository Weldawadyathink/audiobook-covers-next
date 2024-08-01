"use client";

import { api } from "@/trpc/react";
import { ImageCard } from "@/components/ImageCard";
import { getBlurhashDataUrl } from "@/lib/blurhash";
import Image from "next/image";
import React from "react";

export default function Page({ params }: { params: { imageId: string } }) {
  const { status, data } = api.cover.getCover.useQuery(params.imageId);
  return (
    <>
      <h1>Image {params.imageId}</h1>
      {status === "pending" && <span>Waiting for query</span>}
      {status === "error" && <span>404 Image not found</span>}
      {status === "success" && (
        <div className="relative m-8 aspect-square overflow-hidden rounded-3xl">
          <Image
            src={data.url}
            alt="Audiobook cover image"
            fill={true}
            placeholder="blur"
            blurDataURL={getBlurhashDataUrl(data.blurhash)}
          />
        </div>
      )}
    </>
  );
}
