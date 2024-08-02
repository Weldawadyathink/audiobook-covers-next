"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";
import { ImageCard } from "@/components/ImageCard";
import Tilt from "react-parallax-tilt";
import { getBlurhashUrl } from "@/lib/blurhash";

export default function Page({ params }: { params: { imageId: string } }) {
  const image = api.cover.getCover.useQuery(params.imageId);
  const similar = api.cover.getSimilar.useQuery(params.imageId);

  const maxAngle = 5;

  return (
    <>
      <h1 className="mx-6">{params.imageId}</h1>
      {image.status === "pending" && <span>Waiting for query</span>}
      {image.status === "error" && <span>404 Image not found</span>}
      <Tilt tiltMaxAngleX={maxAngle} tiltMaxAngleY={maxAngle}>
        <div className="relative m-8 aspect-square overflow-hidden rounded-3xl">
          {image.status === "success" && (
            <Image
              src={image.data.url}
              alt="Audiobook cover image"
              fill={true}
              placeholder="blur"
              priority={true}
              // TODO: See if this function runs a lot and memoize
              blurDataURL={getBlurhashUrl(image.data.blurhash)}
            />
          )}
        </div>
      </Tilt>

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
