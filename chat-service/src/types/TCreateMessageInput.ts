import TMessage from "./TMessage";
import TFile from "./TFile";

// Reuse TMessage and override the 'files' property
type TCreateMessageInput = Omit<TMessage, "files"> & {
  files?: TFile[];
};

export default TCreateMessageInput;
