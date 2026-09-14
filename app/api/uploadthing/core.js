import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  testimonialImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({
      url: file.ufsUrl || file.url,
    })),
  testimonialVideo: f({
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({
      url: file.ufsUrl || file.url,
    })),
};
