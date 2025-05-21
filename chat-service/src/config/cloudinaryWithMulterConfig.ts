// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
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
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional transformation
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const cloudinaryUpload = multer({ storage });

export { cloudinaryUpload };
