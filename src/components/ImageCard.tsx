import Image from "next/image";
import type { ImageData } from "@/server/api/routers/cover";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styles from "@/styles/FlipCard.module.css";
import useDownloader from "react-use-downloader";
import Link from "next/link";
import { getBlurhashDataUrl } from "@/lib/blurhash";

export function ImageCard(props: {
  imageData: ImageData;
  currentFlippedCardId?: string | undefined;
  onFlip?: ((isFlipped: boolean, imageData: ImageData) => void) | undefined;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const { download } = useDownloader();

  if (
    props.currentFlippedCardId !== undefined &&
    props.currentFlippedCardId !== props.imageData.id &&
    isFlipped
  ) {
    setTimeout(() => setIsFlipped(false), 250);
    // setIsFlipped(false);
  }

  function flip() {
    console.log("Running flip onClick");
    if (props.onFlip !== undefined) {
      props.onFlip(!isFlipped, props.imageData);
    }
    setIsFlipped(!isFlipped);
  }

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    void download(props.imageData.url, "download.png");
  }

  return (
    <div
      // Clickable area
      className="aspect-square w-56 cursor-pointer duration-500 ease-in-out hover:scale-110"
      onClick={flip}
    >
      <div
        // Flipping div
        className={cn(
          "h-full w-full",
          "transform-style-3d transform duration-700 ease-in-out",
          isFlipped ? "rotate-y-180" : "",
          styles.card,
        )}
      >
        <div
          // Front of card
          className={cn(
            "backface-hidden absolute h-full w-full overflow-hidden rounded-3xl",
          )}
        >
          <Image
            src={props.imageData.url}
            className="object-contain"
            alt="Audiobook cover image"
            fill={true}
            placeholder="blur"
            blurDataURL={getBlurhashDataUrl(props.imageData.blurhash)}
          />
        </div>

        <div
          // Back of card
          className={cn(
            "backface-hidden absolute h-full w-full overflow-hidden rounded-3xl bg-stone-700",
            "rotate-y-180 transform-style-3d transform",
            "flex flex-col items-center justify-center gap-3",
          )}
        >
          <Button className="w-36 rounded-3xl" asChild>
            <Link href={`/image/${props.imageData.id}`}>Image Page</Link>
          </Button>

          <Button className="w-36 rounded-3xl" asChild>
            <Link href="https://reddit.com/r/audiobookcovers" target="_blank">
              Source
            </Link>
          </Button>

          <Button className="w-36 rounded-3xl" onClick={handleDownload}>
            Download
          </Button>

          <Button className="w-36 rounded-3xl" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
