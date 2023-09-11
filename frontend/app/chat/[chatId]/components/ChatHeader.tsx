import { useTranslation } from "react-i18next";

import { ShareBrainInChatPage } from "@/lib/components/ShareBrain";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

export const ChatHeader = (): JSX.Element => {
  const { t } = useTranslation(["chat"]);
  const { history } = useChatContext();
  const { userId, currentBrain } =
    useBrainContext();

  if (history.length !== 0) {
    return (
      <div className="flex items-center justify-center w-full relative">
        <h1 className="text-3xl font-bold text-center">
          Chat with your Digital Twin 
        </h1>
        <ShareBrainInChatPage brainId={currentBrain?.id ?? "00-00-00-00-00"} name={currentBrain?.name ?? ""} userId={userId}/>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full relative">
      <h1 className="text-3xl font-bold text-center">
        Chat with your Digital Twin
        <br />
        {t("empty_brain_title_prefix")}{" "}
        <span className="text-purple-500">{t("brain")}</span>{" "}
        {t("empty_brain_title_suffix")}
      </h1>
      <ShareBrainInChatPage brainId={currentBrain?.id ?? "00-00-00-00-00"} name={currentBrain?.name ?? ""} userId={userId}/>
    </div>
  );
};
