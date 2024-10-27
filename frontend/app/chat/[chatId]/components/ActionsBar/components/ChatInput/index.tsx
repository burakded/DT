"use client";
import { useTranslation } from "react-i18next";

import Button from "@/lib/components/ui/Button";

import { ChatBar } from "./components/ChatBar/ChatBar";
import { ConfigModal } from "./components/ConfigModal";
import { MicButton } from "./components/MicButton/MicButton";
import { useChatInput } from "./hooks/useChatInput";
import { useContext } from "react";
import { ChatContext } from "@/lib/context/ChatProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

export const ChatInput = (): JSX.Element => {
  const { setMessage, submitQuestion, chatId, generatingAnswer, message } =
    useChatInput();
  const { t } = useTranslation(["chat"]);
  const chatContext = useContext(ChatContext);
  const history = chatContext?.history;
  const textToSpeech =  async () =>{
    if (history)
    {
    const lastMessageText = history.length > 0 ? history[history.length - 1].assistant : null;
    
    if(lastMessageText)
      {
    try {
      const responseSpeech = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/elevenlabs/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({text: lastMessageText,brainName:history[history.length-1].brain_name}),
          cache: "no-cache",
        }
      );
      if (!responseSpeech.ok) {
        throw new Error();
    }
    const speechBlob = await responseSpeech.blob() 
    const audioUrl = URL.createObjectURL(speechBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  }
  
  
  catch (error){
    console.error('Error fetching speech:', error);
  }
}
}
  }

  return (
    <form
      data-testid="chat-input-form"
      onSubmit={(e) => {
        e.preventDefault();
        submitQuestion();
      }}
      className="sticky flex items-star bottom-0 bg-white dark:bg-black w-full justify-center gap-2 z-20"
    >
      <div className="flex flex-1 flex-col items-center">
        <ChatBar
          message={message}
          setMessage={setMessage}
          onSubmit={submitQuestion}
        />
      </div>

      <div className="flex flex-row items-end">
        <Button
          className="px-3 py-2 sm:px-4 sm:py-2"
          type="submit"
          isLoading={generatingAnswer}
          data-testid="submit-button"
        >
          {generatingAnswer
            ? t("thinking", { ns: "chat" })
            : t("chat", { ns: "chat" })}
        </Button>
        {
                        history && history.length>0?
                        <button
              type="button"
              disabled={generatingAnswer}
              onClick={textToSpeech}
              className="text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors px-3 py-2 sm:px-4 sm:py-2 cursor-pointer ml-4"
            >

                <FontAwesomeIcon icon={faVolumeUp} />

            </button>

            :
            <></>
        }
        <div className="flex items-center">
          <MicButton setMessage={setMessage} />
          <ConfigModal chatId={chatId} />
        </div>
      </div>
    </form>
  );
};
