type TFile = {
  url: string;
  fileName: string;
  type: "image" | "video" | "audio" | "document";
  size?: number;
  duration?: number;
};

export default TFile;
