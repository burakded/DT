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
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";


export const ChatInput = (): JSX.Element => {
  const { currentBrainId } =
    useBrainContext();
  const { setMessage, submitQuestion, chatId, generatingAnswer, message } = useChatInput();
  const { t } = useTranslation(["chat"]);
  const chatContext = useContext(ChatContext);
  const history = chatContext?.history;

  const textToSpeech = async () => {
    if (history && history.length > 0) {
      const lastMessageText = history[history.length - 1]?.assistant;

      if (lastMessageText) {
        try {
          const responseSpeech = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/elevenlabs/text-to-speech`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: lastMessageText, brainId: currentBrainId }),
              cache: "no-cache",
            }
          );

          if (!responseSpeech.ok) {
            throw new Error('Network response was not ok');
          }

          const speechBlob = await responseSpeech.blob();
          const audioUrl = URL.createObjectURL(speechBlob);
          const audio = new Audio(audioUrl);

          try {
            await audio.play(); // Handle potential errors from play()
          } catch (playbackError) {
            console.error('Error during audio playback:', playbackError);
          }
        } catch (error) {
          console.error('Error fetching speech:', error);
        }
      }
    }
  };

  // Create a separate function for the button click event
  const handleTextToSpeechClick = async () => {
    try {
      await textToSpeech();
    } catch (error) {
      console.error('Error during text-to-speech execution:', error);
    }
  };

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
        
        {history && history.length > 0 ? (
          <button
            type="button"
            disabled={generatingAnswer}
            onClick={() => {
              handleTextToSpeechClick().catch((error) =>
                console.error("Error during text-to-speech execution:", error)
              );
            }}
            className="text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors px-3 py-2 sm:px-4 sm:py-2 cursor-pointer ml-4"
          >
            <FontAwesomeIcon icon={faVolumeUp} />
          </button>
        ) : null}

        <div className="flex items-center">
          <MicButton setMessage={setMessage} />
          <ConfigModal chatId={chatId} />
        </div>
      </div>
    </form>
  );
};
