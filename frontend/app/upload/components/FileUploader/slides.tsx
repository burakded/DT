import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@/lib/components/ui/Button";
import Card from "@/lib/components/ui/Card";

import FileComponent from "./components/FileComponent";
import { useFileUploader } from "./hooks/useFileUploader";


export const Slides = (): JSX.Element => {

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
        className="w-full outline-none flex flex-col gap-10 items-center justify-center px-6 py-3"
      >
        <div className="flex flex-col sm:flex-row max-w-3xl w-full items-center gap-5">
          <div className="flex-1 w-full">
            <Card className="h-52 flex justify-center items-center">
              <input {...getInputProps()} />
              <div className="text-center p-6 max-w-sm w-full flex flex-col gap-5 items-center">
                {isDragActive ? (
                  <p className="text-blue-600">{t("drop", { ns: "upload" })}</p>
                ) : (
                  <button
                    onClick={open}
                    className="opacity-50 h-full cursor-pointer hover:opacity-100 hover:underline transition-opacity"
                  >
                    {t("dragAndDrop", { ns: "upload" })}
                  </button>
                )}
              </div>
            </Card>
          </div>

          {files.length > 0 && (
            <div className="flex-1 w-full">
              <Card className="h-52 py-3 overflow-y-auto">
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
            {isPending ? t("uploadingButton") : t("uploadButton")}
          </Button>
        </div>
      </section>
    );
  };
  const uploadContent = (): JSX.Element => {
    return (
      <section
        {...getRootProps()}
        className="w-full outline-none flex flex-col gap-10 items-center justify-center px-6 py-3"
      >
        <div className="flex flex-col sm:flex-row max-w-3xl w-full items-center gap-5">
          <div className="flex-1 w-full">
            <Card className="h-52 flex justify-center items-center">
              <input {...getInputProps()} />
              <div className="text-center p-6 max-w-sm w-full flex flex-col gap-5 items-center">
                {isDragActive ? (
                  <p className="text-blue-600">{t("drop", { ns: "upload" })}</p>
                ) : (
                  <button
                    onClick={open}
                    className="opacity-50 h-full cursor-pointer hover:opacity-100 hover:underline transition-opacity"
                  >
                    {t("dragAndDrop", { ns: "upload" })}
                  </button>
                )}
              </div>
            </Card>
          </div>

          {files.length > 0 && (
            <div className="flex-1 w-full">
              <Card className="h-52 py-3 overflow-y-auto">
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
            {isPending ? t("uploadingButton") : t("uploadButton")}
          </Button>
        </div>
      </section>
    );
  };

  const contents: JSX.Element[] = [
    slidesContent(),
    uploadContent(),
    uploadContent(),
    uploadContent(),
  ]

  useEffect(() => {
    if (!isPending && selectedIndex !== 0) {
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
                <a>{title}</a>
                {contents[index]}
              </div>
            ))
          }
        </Carousel>
      </section>
      <div className="flex justify-between mt-4">
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => { setSelectedIndex((prev) => prev - 1) }}
          disabled={files.length !== 0}
        >
          Prev
        </button>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => { setSelectedIndex((next) => next + 1) }}
          disabled={files.length !== 0}
        >
          Next
        </button>
      </div>
    </>
  );
};