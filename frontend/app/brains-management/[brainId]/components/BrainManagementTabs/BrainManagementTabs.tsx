import { Content, List, Root } from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";
import Button from "@/lib/components/ui/Button";
import { BrainTabTrigger, PeopleTab } from "./components";
import ConfirmationDeleteModal from "./components/Modals/ConfirmationDeleteModal";
import { SettingsTab } from "./components/SettingsTab/SettingsTab";
import { useBrainManagementTabs } from "./hooks/useBrainManagementTabs";
import { useEffect, useState } from "react";

interface ElevenLabsVoice {
  brain_id: string;
  name: string;
  voice_id: string;
}

interface BrainDataResponse {
  data: ElevenLabsVoice[]; // Assuming the API returns an array of voices
}

export const BrainManagementTabs = (): JSX.Element => {
  const { t } = useTranslation(["translation", "config", "delete_brain"]);
  const {
    selectedTab,
    setSelectedTab,
    brainId,
    handleDeleteBrain,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  } = useBrainManagementTabs();
  const [selectedElevenLabsvoice, setSelectedElevenLabsvoice] = useState<ElevenLabsVoice | null>(null);

  useEffect(() => {
    const fetchBrainData = async () => {
      if (brainId) {
        try {
          await getBrainData(brainId);
        } catch (error) {
          console.error("Error fetching brain data:", error);
        }
      }
    };

    void fetchBrainData();
  }, [brainId]);

  async function getBrainData(brainId: string): Promise<BrainDataResponse | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/elevenlabs/brain/${brainId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch brain data: ${response.statusText}`);
      }

      const data: BrainDataResponse = await response.json() as BrainDataResponse;
      setSelectedElevenLabsvoice(data.data[0]);
      return data;
    } catch (error) {
      console.error("Error fetching brain data:", error);
      return null;
    }
  }

  if (brainId === undefined) {
    return <div />;
  }

  return (
    <Root
      className="shadow-md min-h-[50%] dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-black border border-black/10 dark:border-white/25 p-4 pt-10"
      defaultValue="settings"
    >
      <List className="flex justify-between" aria-label={t("subtitle", { ns: "config" })}>
        <BrainTabTrigger
          selected={selectedTab === "settings"}
          label={t("settings", { ns: "config" })}
          value="settings"
          onChange={setSelectedTab}
        />
        <BrainTabTrigger
          selected={selectedTab === "people"}
          label={t("people", { ns: "config" })}
          value="people"
          onChange={setSelectedTab}
        />
        <BrainTabTrigger
          selected={selectedTab === "knowledge"}
          label={t("knowledge", { ns: "config" })}
          value="knowledge"
          onChange={setSelectedTab}
        />
      </List>

      <div className="p-20 pt-5">
        <Content value="settings">
          <SettingsTab brainId={brainId} selectedElevenLabsvoice={selectedElevenLabsvoice} />
        </Content>
        <Content value="people">
          <PeopleTab brainId={brainId} />
        </Content>
        <Content value="knowledge">
          <p>{t("comingSoon")}</p>
        </Content>
      </div>
      <div className="flex justify-center">
        <Button
          className="px-20 py-2 bg-red-500 text-white rounded-md"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          {t("deleteButton", { ns: "delete_brain" })}
        </Button>
      </div>
      <ConfirmationDeleteModal
        isOpen={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDelete={handleDeleteBrain}
      />
    </Root>
  );
};
