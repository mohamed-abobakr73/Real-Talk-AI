import { configDotenv } from "dotenv";
import Groq from "groq-sdk";

configDotenv();

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const groqClient = new Groq({
  apiKey: GROQ_API_KEY,
});

export default groqClient;
