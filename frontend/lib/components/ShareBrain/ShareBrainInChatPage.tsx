/* eslint-disable max-lines */
"use client";

import copy from "copy-to-clipboard";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { ImUserPlus } from "react-icons/im";
import { MdContentCopy, MdContentPaste, MdShare } from "react-icons/md";

// import { BrainUsers } from "@/lib/components/BrainUsers/BrainUsers";
// import { UserToInvite } from "@/lib/components/UserToInvite";
import Button from "@/lib/components/ui/Button";
import { Modal } from "@/lib/components/ui/Modal";
import { useToast } from "@/lib/hooks";
import { useShareBrain } from "@/lib/hooks/useShareBrain";

type ShareBrainModalProps = {
  brainId: UUID;
  name: string;
  userId: string;
};

export const ShareBrainInChatPage = ({
  brainId,
  name,
  userId
}: ShareBrainModalProps): JSX.Element => {
  const {
    brainShareLink,
    setIsShareModalOpen,
    isShareModalOpen,
  } = useShareBrain(brainId, userId);
  const { publish } = useToast();
  const { t } = useTranslation(["translation", "brain"]);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyShareLink = () => {
    // writeText function to copy or write data to clipboard
    copy(brainShareLink);
    // invoked if the data is copied
    setIsCopied(true);
    publish({
      text: "Copied to clipboard",
      variant: "success",
    });
  };

  useEffect(() => {
    setIsCopied(false);
  }, [isShareModalOpen])

  return (
    <Modal
      Trigger={
        <Button
          className="absolute right-0 gap-x-10 group-hover:visible hover:text-red-500 transition-[colors,opacity] p-1"
          onClick={() => void 0}
          variant={"tertiary"}
          data-testId="share-brain-button"
        >
          {/* <MdShare className="text-xl w-20 h-20 " /> */}
          <p className="text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors px-3 py-2 sm:px-4 sm:py-2">Share</p>
        </Button>
      }
      CloseTrigger={<div />}
      title={t("shareBrain", { name, ns: "brain" })}
      isOpen={isShareModalOpen}
      setOpen={setIsShareModalOpen}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // void inviteUsers();
        }}
      >
        <div>
          <div className="flex flex-row my-5 align-center">
            <div className="flex flex-row flex-1 p-3 bg-gray-100 border-b border-gray-200 rounded dark:border-gray-700 justify-space-between align-center">
              <div className="flex flex-1 overflow-hidden">
                <p className="flex-1 color-gray-500">{brainShareLink}</p>
              </div>
              <Button
                type="button"
                onClick={handleCopyShareLink}
              >
                {isCopied ? <MdContentPaste /> : <MdContentCopy />}
              </Button>
            </div>
          </div>
          <p className="pb-[25px]">Please share this link with others so that they can also use this brain.</p>
          <div className="bg-gray-100 h-0.5 mb-5 border-gray-200 dark:border-gray-700" />

          {/* {roleAssignations.map((roleAssignation, index) => (
            <UserToInvite
              key={roleAssignation.id}
              onChange={updateRoleAssignation(index)}
              removeCurrentInvitation={removeRoleAssignation(index)}
              roleAssignation={roleAssignation}
            />
          ))}
          <Button
            className="my-5"
            onClick={addNewRoleAssignationRole}
            disabled={sendingInvitation || !canAddNewRow}
            data-testid="add-new-row-role-button"
          >
            <ImUserPlus />
          </Button> */}
        </div>

        <div className="flex flex-row justify-end mb-3">
          <Button
            // isLoading={sendingInvitation}
            // disabled={roleAssignations.length === 0}
            onClick={() => setIsShareModalOpen(false)}
            type="button"
          >
            OK
          </Button>
        </div>
      </form>
      {/* <div className="bg-gray-100 h-0.5 mb-5 border-gray-200 dark:border-gray-700" />
      <p className="text-lg font-bold">
        {t("shareBrainUsers", { ns: "brain" })}
      </p>
      <BrainUsers brainId={brainId} /> */}
    </Modal>
  );
};
