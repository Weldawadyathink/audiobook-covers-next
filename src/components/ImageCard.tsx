import type { ImageData } from "@/server/api/routers/cover";
import Image from "next/image";
import { useBlurhashUrl } from "@/lib/blurhash";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
// import { extractColors } from "extract-colors";

export function ImageCard(props: { imageData: ImageData; className?: string }) {
  const maxAngle = 15;
  const [isHovered, setIsHovered] = useState(false);

  const blurhashUrl = useBlurhashUrl(props.imageData.blurhash);

  // const colors = extractColors(getBlurhashUrl(props.imageData.blurhash));
  // console.log(colors);
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
            blurDataURL={blurhashUrl}
          />
        </Link>
      </div>
    </Tilt>
  );
}
