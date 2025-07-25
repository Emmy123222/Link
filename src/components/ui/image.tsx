"use client"

import NextImage, { ImageProps as NextImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getBlurDataUrl, getOptimizedImageUrl } from "@/lib/utils/image"

interface ImageProps extends Omit<NextImageProps, "onLoadingComplete" | "src"> {
  wrapperClassName?: string
  src: string
  optimize?: boolean
  width?: number
}

export function Image({
  className,
  wrapperClassName,
  alt,
  src,
  optimize = true,
  width,
  height,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const imageSrc = optimize ? getOptimizedImageUrl(src, width) : src
  const blurDataUrl = getBlurDataUrl(src)

  return (
    <div className={cn("overflow-hidden", wrapperClassName)}>
      <NextImage
        className={cn(
          "duration-700 ease-in-out",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        alt={alt}
        src={imageSrc}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        {...props}
      />
    </div>
  )
} 