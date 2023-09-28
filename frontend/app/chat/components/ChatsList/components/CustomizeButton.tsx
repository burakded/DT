import { useState } from "react";
import { BsFillSendFill, BsMagic } from "react-icons/bs"

import Button from "@/lib/components/ui/Button";
import { Modal } from "@/lib/components/ui/Modal"


export const CustomizeButton = (): JSX.Element => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    
    <>
    <Modal
      Trigger={
        <button 
          className="px-4 py-2 mx-4 my-1 border border-primary bg-white dark:bg-black hover:text-white hover:bg-primary shadow-lg rounded-lg flex items-center justify-center top-1 z-20"
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
      <textarea
        className="m-2 w-full bg-gray-50 dark:bg-gray-900 px-4 py-2 border rounded-md border-black/10 dark:border-white/25"
      />
      <Button 
        variant={"secondary"}
        className="px-4 py-2 m-auto text-xl flex justify-center align-center my-3 w-auto border border-primary bg-white dark:bg-black hover:text-white hover:bg-black shadow-lg rounded-lg flex items-center justify-center top-1 z-20"
      >
        <BsFillSendFill />&nbsp; <p>Send</p>
      </Button>
    </Modal>
  </>
  )
}