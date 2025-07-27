import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils"
import { getDefaultImageUrl, ImageEntityType } from "@/utils/imageUtils"
import { useState } from "react"

interface AvatarProps {
  src?: string | null;
  name: string;
  width: number;
  height: number;
  className?: string;
  entityType?: ImageEntityType;
}

export const Avatar = ({ 
  src, 
  name, 
  width, 
  height, 
  className, 
  entityType = 'user'
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const defaultImageSrc = getDefaultImageUrl(entityType);
  
  // Determine what image to show
  const imageToShow = src && !imageError ? src : defaultImageSrc;
  const isDefaultImage = !src || imageError;
  
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100", className)}>
      <Image
        src={imageToShow}
        alt={isDefaultImage ? `Default ${entityType} avatar` : name}
        fill
        className={cn(
          "object-cover",
          isDefaultImage ? "p-2 opacity-60" : ""
        )}
        onError={() => {
          if (!imageError && src) {
            setImageError(true);
          }
        }}
      />
    </div>
  )
}