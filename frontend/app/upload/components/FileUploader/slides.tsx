import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@/lib/components/ui/Button";
import Card from "@/lib/components/ui/Card";

import FileComponent from "./components/FileComponent";
import { useFileUploader } from "./hooks/useFileUploader";

type SlidesProps = {
  setIsModalOpen: (value: boolean) => void;
}

export const Slides = ({ setIsModalOpen }: SlidesProps): JSX.Element => {

  const {
    getInputProps,
    getRootProps,
    isDragActive,
    isPending,
    open,
    uploadAllFiles,
    files,
    setFiles,
  } = useFileUploader();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useTranslation(["translation", "upload"]);
  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const slideTitles = [
    "Quadrant 1. Personal information",
    "Quadrant 2. Professional information",
    "Quadrant 3. Thought Leadership",
    "Quadrant 4. Legacy"
  ];
  const slidesContent = (): JSX.Element => {
    return (
      <section
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full gap-10 px-6 py-3 outline-none"
      >
        <div className="flex flex-col items-center w-full max-w-3xl gap-5 sm:flex-row">
          <div className="flex-1 w-full">
            <Card className="flex items-center justify-center h-52">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center w-full max-w-sm gap-5 p-6 text-center">
                {isDragActive ? (
                  <p className="text-blue-600">{t("drop", { ns: "upload" })}</p>
                ) : (
                  <button
                    onClick={open}
                    className="h-full transition-opacity opacity-50 cursor-pointer hover:opacity-100 hover:underline"
                  >
                    {t("dragAndDrop", { ns: "upload" })}
                  </button>
                )}
              </div>
            </Card>
          </div>

          {files.length > 0 && (
            <div className="flex-1 w-full">
              <Card className="py-3 overflow-y-auto h-52">
                {files.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {files.map((file) => (
                      <FileComponent
                        key={`${file.name} ${file.size}`}
                        file={file}
                        setFiles={setFiles}
                      />
                    ))}
                  </AnimatePresence>
                ) : null}
              </Card>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center mb-6">
          <Button isLoading={isPending} onClick={() => void uploadAllFiles()}>
            {isPending === true ? t("uploadingButton") : t("uploadButton")}
          </Button>
        </div>
      </section>
    );
  };
  const lastUploadContent = (): JSX.Element => {
    return (
      <section
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full gap-10 px-6 py-3 outline-none"
      >
        <div className="flex flex-col items-center w-full max-w-3xl gap-5 sm:flex-row">
          <div className="flex-1 w-full">
            <Card className="flex items-center justify-center h-52">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center w-full max-w-sm gap-5 p-6 text-center">
                {isDragActive ? (
                  <p className="text-blue-600">{t("drop", { ns: "upload" })}</p>
                ) : (
                  <button
                    onClick={open}
                    className="h-full transition-opacity opacity-50 cursor-pointer hover:opacity-100 hover:underline"
                  >
                    {t("dragAndDrop", { ns: "upload" })}
                  </button>
                )}
              </div>
            </Card>
          </div>

          {files.length > 0 && (
            <div className="flex-1 w-full">
              <Card className="py-3 overflow-y-auto h-52">
                {files.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {files.map((file) => (
                      <FileComponent
                        key={`${file.name} ${file.size}`}
                        file={file}
                        setFiles={setFiles}
                      />
                    ))}
                  </AnimatePresence>
                ) : null}
              </Card>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center mb-6">
          <Button isLoading={isPending} onClick={() => void uploadAllFiles()}>
            {isPending === true ? t("uploadingButton") : t("uploadButton")}
          </Button>
        </div>
      </section>
    );
  };

  const contents: JSX.Element[] = [
    slidesContent(),
    slidesContent(),
    slidesContent(),
    lastUploadContent(),
  ]

  const handleFinishClick = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (isPending === false) {
      setSelectedIndex((prev) => prev + 1);
    }
  }, [isPending])

  return (
    <>
      <section>
        <Carousel
          selectedItem={selectedIndex}
          onChange={handleSelect}
          showStatus={false}
          showThumbs={false}
          showArrows={false}
          showIndicators={false}
        >
          {
            slideTitles.map((title, index) => (
              <div key={index}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-[10%]">
                      <Image
                        src={`/brains/quadrant${index + 1}.png`}
                        alt="Quadrant Logic"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div>
                      <p>Quadrant Logic</p>
                    </div>
                  </div>
                  <div>
                    <a>{title}</a>
                  </div>
                {contents[index]}
              </div>
            ))
          }
        </Carousel>
      </section>
      <div className="flex justify-between mt-4">
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => { setSelectedIndex((prev) => prev - 1) }}
          disabled={files.length !== 0 || isPending === true}
        >
          Prev
        </button>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => {
            if (selectedIndex === 3) {
              handleFinishClick();
            } else {
              setSelectedIndex((next) => next + 1);
            }
          }}
          disabled={files.length !== 0 || isPending === true}
        >
          {selectedIndex === 3 ? "Finish" : "Next"}
        </button>
      </div>
    </>
  );
};