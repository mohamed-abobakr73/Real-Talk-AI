const summarizeConversation = (conversation: string) => {
  return `Summarize the following chat conversation in a few sentences, capturing the key points, decisions, and tone. Be concise and clear.
Conversation:
${conversation}`;
};

const messageSuggestions = (message: string) => {
  return `Based on the following message, suggest 3 appropriate replies that are natural, friendly, and context-aware:.
Message:
${message}
Suggested Response:`;
};

const messageTranslate = (
  sourceLang: string,
  targetLang: string,
  message: string
) => {
  return `Translate the following message from ${sourceLang} to ${targetLang}. Keep the tone and context intact.
Message:
${message}`;
};

const searchMessages = (conversation: string, searchQuery: string) => {
  return `Search the following chat history for messages related to: ${searchQuery}.
Chat History:
${conversation}
Return only the most relevant messages or summaries that match the query.`;
};

export {
  summarizeConversation,
  messageSuggestions,
  messageTranslate,
  searchMessages,
};
