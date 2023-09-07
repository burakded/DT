import { useState } from "react";

import { useChat } from "@/app/share-brain/[chatId]/hooks/useChat";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const { addQuestion, generatingAnswer, chatId } = useChat();

  const submitQuestion = () => {
    if (!generatingAnswer) {
      void addQuestion(message, userId, () => setMessage(""));
    }
  };

  return {
    message,
    setMessage,
    setUserId,
    submitQuestion,
    generatingAnswer,
    chatId,
  };
};
