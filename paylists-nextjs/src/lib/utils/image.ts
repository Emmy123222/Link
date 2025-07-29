export const getImageUrl = (path: string) => {
  return `${path}`
}

export const getOptimizedImageUrl = (path: string, width: number = 800) => {
  const url = getImageUrl(path)
  return `${url}?width=${width}&quality=80`
}

export const getBlurDataUrl = (path: string) => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="#E5E7EB"/>
    </svg>`
  ).toString('base64')}`
} 