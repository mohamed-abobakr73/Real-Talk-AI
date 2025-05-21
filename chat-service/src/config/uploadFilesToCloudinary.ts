import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import streamifier from "streamifier";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

const streamUpload = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Real-Talk",
        resource_type: "auto",
        allowed_formats: [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "pdf",
          "mp4",
          "mp3",
          "wav",
          "mov",
        ],
        public_id: `${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export { streamUpload };
