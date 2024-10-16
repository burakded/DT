import Editor from "@draft-js-plugins/editor";
import { ReactElement } from "react";

import "@draft-js-plugins/mention/lib/plugin.css";
import "draft-js/dist/Draft.css";

import { SuggestionRow } from "./components/SuggestionRow";
import { SuggestionsContainer } from "./components/SuggestionsContainer";
import { useMentionInput } from "./hooks/useMentionInput";

type MentionInputProps = {
  onSubmit: () => void;
  setMessage: (text: string) => void;
  message: string;
};
export const MentionInput = ({
  onSubmit,
  setMessage,
  message,
}: MentionInputProps): ReactElement => {
  const {
    mentionInputRef,
    MentionSuggestions,
    keyBindingFn,
    editorState,
    onOpenChange,
    onSearchChange,
    open,
    plugins,
    suggestions,
    onAddMention,
    handleEditorChange,
  } = useMentionInput({
    message,
    onSubmit,
    setMessage,
  });

  return (
    <div className="w-full" data-testid="chat-input">
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={handleEditorChange}
        plugins={plugins}
        ref={mentionInputRef}
        placeholder={"Write your messages"}
        keyBindingFn={keyBindingFn}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        popoverContainer={SuggestionsContainer}
        onAddMention={onAddMention}
        entryComponent={SuggestionRow}
      />
    </div>
  );
};
