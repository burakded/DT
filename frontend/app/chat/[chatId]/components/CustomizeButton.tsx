import { useEffect, useState } from "react";
import { BsFillSendFill, BsMagic } from "react-icons/bs"

import Button from "@/lib/components/ui/Button";
import { Modal } from "@/lib/components/ui/Modal"
import { useFetch } from "@/lib/hooks";


export const CustomizeButton = ({ brainId } : { brainId: string }): JSX.Element => {

  const { fetchInstance } = useFetch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");

  const handleSend = async () => { 
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      };
      const requestBody = { base_prompt: textValue }; 
      const body = JSON.stringify(requestBody);
      const response = await fetchInstance.put(
        `brains/base-prompt/${brainId}`,
        body,
        headers,
      );
    } catch (error) {
      console.log(error);
    }
  }

  const showBaseprompt = async () => {
    try {
      const response = await fetchInstance.get(
        `brains/base-prompt/${brainId}/`
      );
      const responseData = await response.json();
      setTextValue(responseData.prompt)
    } catch (error) {
      setTextValue("")
      console.log(error);
    }
  }

  const handleTextChange = (event: any) => {
    setTextValue(event.target.value);
  }

  return (
    
    <>
    <Modal
      Trigger={
        <button 
          className="z-20 flex items-center justify-center px-3 py-1.5 bg-white border rounded-lg shadow-lg border-primary dark:bg-black hover:text-white hover:bg-primary top-1"
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
        onClick={handleSend}
      >
        <BsFillSendFill />&nbsp; <p>Send</p>
      </Button>
    </Modal>
  </>
  )
}