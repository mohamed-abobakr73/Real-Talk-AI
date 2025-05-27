import { SpeechModel } from "assemblyai";
import assemblyAiClient from "../config/assemblyAiConfig";
import groqClient from "../config/groqConfig";
import GlobalError from "../utils/globalError";
import httpStatusText from "../utils/httpStatusText";
import {
  messageSuggestions,
  messageTranslate,
  searchMessages,
  summarizeConversation,
} from "../utils/prompts";

const responseError = (response: string | null, message: string) => {
  if (!response) {
    const error = new GlobalError(message, 400, httpStatusText.FAIL);
    throw error;
  }
};

const aiResponse = async (prompt: string) => {
  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return aiResponse;
  } catch (error) {
    throw error;
  }
};

const generateAiResponseService = async (type: string, data: any) => {
  try {
    let response: string | null = "";
    let prompt: string = "";
    switch (type) {
      case "summarize":
        prompt = summarizeConversation(data.conversation);
        response = await aiResponse(prompt);

        responseError(response, "Failed to generate summary");
        break;

      case "suggestions":
        prompt = messageSuggestions(data.message);
        response = await aiResponse(prompt);

        responseError(response, "Failed to generate suggestions");
        break;

      case "translate":
        prompt = messageTranslate(
          data.sourceLang,
          data.targetLang,
          data.message
        );
        response = await aiResponse(prompt);

        responseError(response, "Failed to translate message");
        break;

      case "search":
        prompt = searchMessages(data.conversation, data.searchQuery);
        response = await aiResponse(prompt);

        responseError(response, "Failed to search messages");
        break;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const speechToTextService = async (audio: any) => {
  try {
    const params = {
      audio: audio,
      speech_model: "slam-1" as SpeechModel,
    };

    const transcript = await assemblyAiClient.transcripts.transcribe(params);

    if (transcript.status === "error") {
      const error = new GlobalError(
        transcript.error!,
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    return transcript.text;
  } catch (error) {
    throw error;
  }
};

export default {
  generateAiResponseService,
  speechToTextService,
};
