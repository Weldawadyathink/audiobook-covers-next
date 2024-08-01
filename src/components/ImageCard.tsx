import type { ImageData } from "@/server/api/routers/cover";
import Image from "next/image";
import { getBlurhashDataUrl } from "@/lib/blurhash";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

export function ImageCard(props: { imageData: ImageData; className?: string }) {
  const maxAngle = 15;
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <Tilt
      scale={1.3}
      transitionSpeed={900}
      tiltMaxAngleX={maxAngle}
      tiltMaxAngleY={maxAngle}
      onEnter={() => setIsHovered(true)}
      onLeave={() => setIsHovered(false)}
      className={isHovered ? "z-10" : "z-0"}
    >
      <div
        className={cn(
          "relative aspect-square cursor-pointer overflow-hidden rounded-3xl",
          props.className,
        )}
      >
        <Link href={`/image/${props.imageData.id}`}>
          <Image
            src={props.imageData.url}
            alt="Audiobook cover image"
            fill={true}
            placeholder="blur"
            blurDataURL={getBlurhashDataUrl(props.imageData.blurhash)}
          />
        </Link>
      </div>
    </Tilt>
  );
}
