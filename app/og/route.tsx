/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

export const runtime = "edge";
export const preferredRegion = ["iad1"];

export async function GET(request: Request) {
  const imageData = await fetch(
    new URL("./background.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full bg-black relative items-center justify-center"
      >
        {/* Background Image */}
        <img
          src={imageData as any}
          alt="background"
          tw="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  );
}
