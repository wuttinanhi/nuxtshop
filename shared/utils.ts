export function getImageURL(imageURL?: string) {
  if (!imageURL) {
    return "https://dummyjson.com/image/500/f5f5f5";
  }

  // if imageURL starts with "SELFHOST_" then route to /api/public/{imageURL}
  if (imageURL.startsWith("SELFHOST_")) {
    return `/api/public/${imageURL}`;
  }

  return imageURL;
}
