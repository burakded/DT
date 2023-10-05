import { ChangeEvent, useState } from "react";
import { BsFillSendFill, BsMagic } from "react-icons/bs"

import Button from "@/lib/components/ui/Button";
import { Modal } from "@/lib/components/ui/Modal"
import { useFetch } from "@/lib/hooks";


export const CustomizeButton = ({ brainId }: { brainId: string }): JSX.Element => {

  const { fetchInstance } = useFetch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");

  const handleSend = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const requestBody = { base_prompt: textValue };
      const body = JSON.stringify(requestBody);
      await fetchInstance.put(
        `/brains/base-prompt/${brainId}`,
        body,
        headers,
      ).then(() => { setIsModalOpen(false); }).catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  }

  // Wrap handleSend in a closure to provide a void return value
  const handleSendWrapper = () => {
    handleSend().then(() => { return; }).catch((e) => console.log(e));
  };

  const showBaseprompt = async () => {
    try {  
      const response = await fetchInstance.get(
        `/brains/base-prompt/${brainId}/`
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const responseData: any = await response.json();
      if ('prompt' in responseData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        setTextValue(responseData.prompt);
      } else {
        // Handle the case where `prompt` property is not present
        setTextValue("");
      }
    } catch (error) {
      setTextValue("")
      console.log(error);
    }
  }

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  }

  return (
    <>
      <Modal
        Trigger={
          <button
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-white transition-colors bg-black border border-black rounded-md outline-none disabled:opacity-80 focus:ring ring-primary/10 dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 sm:px-4 sm:py-2"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={showBaseprompt}
          >
            <BsMagic />Customize
          </button>
        }
        title={"Customize your brain"}
        desc={"Edit base prompt here"}
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        CloseTrigger={<div />}
      >
        <textarea value={textValue} onChange={handleTextChange}
          className="w-full px-4 py-2 m-2 border rounded-md bg-gray-50 dark:bg-gray-900 border-black/10 dark:border-white/25"
        />
        <Button
          variant={"secondary"}
          className="z-20 flex items-center justify-center w-auto px-4 py-2 m-auto my-3 text-xl bg-white border rounded-lg shadow-lg align-center border-primary dark:bg-black hover:text-white hover:bg-black top-1"
          onClick={handleSendWrapper}
        >
          <BsFillSendFill />&nbsp; <p>Send</p>
        </Button>
      </Modal>
    </>
  )
}