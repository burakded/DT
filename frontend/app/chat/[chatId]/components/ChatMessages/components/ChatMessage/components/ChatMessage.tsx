import { useFeature } from "@growthbook/growthbook-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 
import { UIpropertyProps } from "@/app/chat/[chatId]/types";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  speaker: string;
  text: string;
  brainName?: string;
  promptName?: string;
  ui: UIpropertyProps;
};

export const ChatMessage = React.forwardRef(
  (
    { speaker, text, brainName, promptName, ui }: ChatMessageProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isNewUxOn = useFeature("new-ux").on;
    const isUserSpeaker = speaker === "user";
    const containerClasses = cn(
      "py-3 px-5 w-fit ",
      isUserSpeaker
        ? `bg-opacity-60 items-start`
        : "bg-opacity-60 items-end",
      "dark:bg-gray-800 rounded-3xl flex flex-col overflow-hidden scroll-pb-32"
    );

    const containerWrapperClasses = cn(
      "flex flex-col",
      isUserSpeaker ? "items-end" : "items-start"
    );

    const markdownClasses = cn(
      "prose prose-sm",
      isUserSpeaker ? `text-[${ui.UserFontSize}px]` : `text-[${ui.AIFontSize}px]`,
      "dark:prose-invert"
    );

    return (
      <div className={containerWrapperClasses}>
        <div
          ref={ref}
          style={{
            backgroundColor: isUserSpeaker ? ui.UserBgColor : ui.AIBgColor,
            color: isUserSpeaker ? ui.UserFontColor : ui.AIFontColor,
          }}
          className={containerClasses}
        >
          {isNewUxOn && (
            <span
              data-testid="brain-prompt-tags"
              className="text-gray-400 mb-1"
            >
              @{brainName ?? "-"} #{promptName ?? "-"}
            </span>
          )}
          <div
            data-testid="chat-message-text"
            style={{
              userSelect: "text",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                fontSize: isUserSpeaker ? ui.UserFontSize : ui.AIFontSize,
              }}
            >
              {isUserSpeaker ? (
                text
              ) : (
                <ReactMarkdown
                  className={markdownClasses}
                  remarkPlugins={[remarkGfm]} 
                >
                  {text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
