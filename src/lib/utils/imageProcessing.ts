export const getImagesFromContent = async (content: string) => {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...content.matchAll(regex)];
  return matches.map((match) => match[1]);
};

export const uploadImage = async (base64Data: string) => {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = base64Data;
  });

  canvas.width = img.width;
  canvas.height = img.height;

  ctx?.drawImage(img, 0, 0);

  const jpgBase64 = canvas.toDataURL("image/jpeg", 0.8);

  const response = await fetch(jpgBase64);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Error uploading image");
  }

  const { url } = await uploadResponse.json();
  return url;
};

export const processContentWithImages = async (content: string) => {
  // Get all base64 images
  const images = await getImagesFromContent(content);
  let processedContent = content;

  // Upload each image and replace URLs in the content
  for (const base64Url of images) {
    if (base64Url.startsWith("data:image")) {
      const fileUrl = await uploadImage(base64Url);
      processedContent = processedContent.replace(base64Url, fileUrl);
    }
  }

  return processedContent;
};
