type TFile = {
  url: string;
  fileName: string;
  type:
    | "image"
    | "video"
    | "audio"
    | "document"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "pdf"
    | "mp3"
    | "mp4"
    | "mov"
    | "wav"
    | "jpg"
    | "jpeg"
    | "png"
    | "gif";
  size?: number;
  uploadedBy: string;
  duration?: number;
};

export default TFile;
