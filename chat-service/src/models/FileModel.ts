import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio", "document"],
      required: true,
    },
    size: { type: Number },
    duration: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("File", fileSchema);
