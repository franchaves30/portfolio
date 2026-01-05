/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

export const runtime = "edge";
export const preferredRegion = ["iad1"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title");
  const description = searchParams.get("description");

  const imageData = await fetch(
    new URL("./background.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const geistSemibold = await fetch(
    new URL("../../assets/geist-semibold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full bg-black relative items-center justify-center"
        style={{ fontFamily: 'geist' }}
      >
        {/* Background Image */}
        <img
          src={imageData as any}
          alt="background"
          tw="absolute inset-0 w-full h-full object-cover"
        />

        {/* Optional Title/Description Overlay - Only show if provided */}
        {(title || description) && (
          <div tw="flex flex-col relative z-10 w-[80%] items-start justify-center">
            {title && (
              <div
                tw="text-zinc-50 tracking-tight leading-[1.1] mb-4"
                style={{
                  textWrap: "balance",
                  fontWeight: 600,
                  fontSize: 80,
                  letterSpacing: "-0.05em",
                  textShadow: "0 4px 12px rgba(0,0,0,0.5)"
                }}
              >
                {title}
              </div>
            )}
            {description && (
              <div
                tw="text-[32px] font-medium text-zinc-300"
                style={{
                  textWrap: "balance",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                }}
              >
                {description}
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts: [
        {
          name: "geist",
          data: geistSemibold,
          style: "normal",
        },
      ],
    }
  );
}
