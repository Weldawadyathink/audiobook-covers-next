import type { ImageData } from "@/server/api/routers/cover";
import Image from "next/image";
import { getBlurhashDataUrl } from "@/lib/blurhash";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ImageCard(props: { imageData: ImageData; className?: string }) {
  return (
    <Link
      href={`/image/${props.imageData.id}`}
      className={cn(
        "relative aspect-square cursor-pointer overflow-hidden rounded-3xl duration-500 ease-in-out hover:scale-110",
        props.className,
      )}
    >
      <Image
        src={props.imageData.url}
        alt="Audiobook cover image"
        fill={true}
        placeholder="blur"
        blurDataURL={getBlurhashDataUrl(props.imageData.blurhash)}
      />
    </Link>
  );
}
