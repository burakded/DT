/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-lines */

import { UUID } from "crypto";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

import Button from "@/lib/components/ui/Button";
import { Divider } from "@/lib/components/ui/Divider";
import Field from "@/lib/components/ui/Field";
import { TextArea } from "@/lib/components/ui/TextArea";
import {
  paidModels,
} from "@/lib/context/BrainConfigProvider/types";
import { defineMaxTokens } from "@/lib/helpers/defineMaxTokens";

// import { PublicPrompts } from "./components/PublicPrompts/PublicPrompts";
import { useSettingsTab } from "./hooks/useSettingsTab";
import { useState,useEffect } from 'react';
import { useFetch, useToast } from "@/lib/hooks";
interface Voice {
  name: string;
  voice_id: string;
}

type SettingsTabProps = {
  brainId: UUID;
  selectedElevenLabsvoice: {
    brain_id: string;
    name: string;
    voice_id: string;
  };
};

export const SettingsTab = ({ brainId, selectedElevenLabsvoice }: SettingsTabProps): JSX.Element => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const { fetchInstance } = useFetch();
  const [selectedElevenLabsvoice1, setSelectedElevenLabsvoice] = useState({ brain_id: '', name: '', voice_id: '' });
  const {
    handleSubmit,
    register,
    temperature,
    maxTokens,
    model,
    setAsDefaultBrainHandler,
    isSettingAsDefault,
    isUpdating,
    isDefaultBrain,
    formRef,
    promptId,
    getValues,
    // pickPublicPrompt,
    removeBrainPrompt,
  } = useSettingsTab({ brainId });
  const [elevenLabsVoices, setElevenLabsVoices] = useState<Voice[]>([]);
  useEffect(()  => {
    const fetchVoices = async () => {
      await elevenLabsVoicesList();
    };
    if(selectedElevenLabsvoice.name!="")
    fetchVoices();
  }, [selectedElevenLabsvoice]);

  const elevenLabsVoicesList = async (
  ): Promise<void> => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/elevenlabs/voices`, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
      setElevenLabsVoices(data.voices)
     
          register("voices", { value: selectedElevenLabsvoice.voice_id || "" });
          register("voicesName", {value: selectedElevenLabsvoice.name || " "})
          setSelectedElevenLabsvoice({
            brain_id: selectedElevenLabsvoice.brain_id,
            name: selectedElevenLabsvoice.name,
            voice_id: selectedElevenLabsvoice.voice_id || "",
          });
        
      
    } catch (error) {
      console.log(error)
      }
    }

    const handleVoiceSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedVoiceName = event.target.value;
      const selectedVoiceId = event.target.options[event.target.selectedIndex].getAttribute('data-voiceid');
    
      register("voices", { value: selectedVoiceId || "" });
      register("voicesName", { value: selectedVoiceName || "" });
      setSelectedElevenLabsvoice({
        brain_id: selectedElevenLabsvoice.brain_id,
        name: event.target.value,
        voice_id: selectedVoiceId || "",
      });
    };


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(true);
      }}
      className="my-10 mb-0 flex flex-col items-center gap-2"
      ref={formRef}
    >
      <div className="flex flex-row flex-1 justify-between w-full">
        <div>
          <Field
            label={ t("brainName", { ns: "brain" })}
            placeholder={t("brainNamePlaceholder", { ns: "brain" })}
            autoComplete="off"
            className="flex-1"
            {...register("name")}
          />
        </div>
        <div className="mt-4">
          {isDefaultBrain ? (
            <div className="border rounded-lg border-dashed border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:bg-black dark:focus:bg-white dark dark focus:text-white dark:focus:text-black transition-colors py-2 px-4 shadow-none">
              {t("defaultBrain", { ns: "brain" })}
            </div>
          ) : (
            <Button
              variant={"secondary"}
              isLoading={isSettingAsDefault}
              onClick={() => void setAsDefaultBrainHandler()}
              type="button"
            >
              {t("setDefaultBrain", { ns: "brain" })}
            </Button>
          )}
        </div>
      </div>
      <TextArea
        label={t("brainDescription", { ns: "brain" })}
        placeholder={t("brainDescriptionPlaceholder", { ns: "brain" })}
        autoComplete="off"
        className="flex-1 m-3"
        {...register("description")}
      />
      <Divider text={t("modelSection", { ns: "config" })} />
      <Field
        label={t("openAiKeyLabel", { ns: "config" })}
        placeholder={t("openAiKeyPlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        {...register("openAiKey")}
      />
      <fieldset className="w-full flex flex-col mt-2">
        <label className="flex-1 text-sm" htmlFor="model">
          {t("modelLabel", { ns: "config" })}
        </label>
        <select
          id="model"
          {...register("model")}
          className="px-5 py-2 dark:bg-gray-700 bg-gray-200 rounded-md"
          onChange={() => {
            void handleSubmit(false); // Trigger form submission
          }}
        >
          {paidModels.map(
            (availableModel) => (
              <option value={availableModel} key={availableModel}>
                {availableModel}
              </option>
            )
          )}
        </select>
      </fieldset>
      <fieldset className="w-full flex flex-col">
          <label className="flex-1 text-sm" htmlFor="voicesName">
            ElevenLabs Voices
          </label>
          <select
            id="voicesName"
            {...register("voicesName")}
            value={selectedElevenLabsvoice1.name || ""}
            onChange={(e) => handleVoiceSelect(e)}
            className="px-5 py-2 dark:bg-gray-700 bg-gray-200 rounded-md"
          >
            {elevenLabsVoices.map((voice) => (
              <option value={voice.name} key={voice.voice_id} data-voiceid={voice.voice_id}>
                {voice.name}
              </option>
            ))}
          </select>
        </fieldset>
      <fieldset className="w-full flex mt-4">
        <label className="flex-1" htmlFor="temp">
          {t("temperature", { ns: "config" })}: {temperature}
        </label>
        <input
          id="temp"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={temperature}
          {...register("temperature")}
        />
      </fieldset>
      <fieldset className="w-full flex mt-4">
        <label className="flex-1" htmlFor="tokens">
          {t("maxTokens", { ns: "config" })}: {maxTokens}
        </label>
        <input
          type="range"
          min="10"
          max={defineMaxTokens(model)}
          value={maxTokens}
          {...register("maxTokens")}
        />
      </fieldset>
      {/* <Divider text={t("customPromptSection", { ns: "config" })} />
      <PublicPrompts onSelect={pickPublicPrompt} />
      <Field
        label={t("promptName", { ns: "config" })}
        placeholder={t("promptNamePlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        {...register("prompt.title")}
      />
      <TextArea
        label={t("promptContent", { ns: "config" })}
        placeholder={t("promptContentPlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        {...register("prompt.content")}
      /> */}
      {promptId !== "" && (
        <Button disabled={isUpdating} onClick={() => void removeBrainPrompt()}>
          {t("removePrompt", { ns: "config" })}
        </Button>
      )}
      <div className="flex flex-row justify-end flex-1 w-full mt-8">
        {isUpdating && <FaSpinner className="animate-spin" />}
        {isUpdating && (
          <span className="ml-2 text-sm">
            {t("updatingBrainSettings", { ns: "config" })}
          </span>
        )}
      </div>
    </form>
  );
};
