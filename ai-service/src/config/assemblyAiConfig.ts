import { AssemblyAI } from "assemblyai";
import { configDotenv } from "dotenv";

configDotenv();

const ASSEMBLY_AI_API_KEY = process.env.ASSEMBLY_AI_API_KEY!;

const assemblyAiClient = new AssemblyAI({ apiKey: ASSEMBLY_AI_API_KEY });

export default assemblyAiClient;
