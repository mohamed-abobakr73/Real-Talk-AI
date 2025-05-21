import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "image",
        "video",
        "audio",
        "document",
        "pdf",
        "mp3",
        "mp4",
        "mov",
        "wav",
        "jpg",
        "jpeg",
        "png",
        "gif",
      ],
      required: true,
    },
    size: { type: Number },
    duration: { type: Number },
    uploadedBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("File", fileSchema);
