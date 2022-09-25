import React, { FC, useEffect, useState } from "react";
import ImageLoader, { ImgProps } from "./ImageLoader";

import styles from "./index.module.scss";

const numberOfImgLoad = 3;

const Upload: FC = () => {
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [resultFiles, setResultFiles] = useState<ImgProps[]>([]);
  const [loadingQueue, setLoadingQueue] = useState<string[]>([]);

  const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!!files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setInputFiles((prev) => [...prev, file]);
      }
    }
  };

  useEffect(() => {
    if (!!inputFiles) {
      clearResultFile();
      setLoadingQueue(
        inputFiles.slice(0, numberOfImgLoad).map((file) => file.name)
      );
    }
  }, [inputFiles]);

  useEffect(() => {
    const popLoadingQueue = loadingQueue.filter(
      (filename) => !resultFiles.some((item) => item.name === filename)
    );
    if (inputFiles.length !== resultFiles.length) {
      // add filename to loading queue
      setLoadingQueue(() => [
        ...popLoadingQueue,
        ...inputFiles
          .filter(
            (file) =>
              !resultFiles.some((item) => item.name === file.name) &&
              !popLoadingQueue.some((filename) => filename === file.name)
          )
          .slice(0, numberOfImgLoad - popLoadingQueue.length)
          .map((file) => file.name),
      ]);
    } else setLoadingQueue(popLoadingQueue);
    console.log(
      [
        ...popLoadingQueue,
        ...inputFiles
          .filter(
            (file) =>
              !resultFiles.some((item) => item.name === file.name) &&
              !popLoadingQueue.some((filename) => filename === file.name)
          )
          .slice(0, numberOfImgLoad - popLoadingQueue.length)
          .map((file) => file.name),
      ],
      resultFiles
    );
  }, [resultFiles]);

  const clearResultFile = () => setResultFiles([]);

  return (
    <section>
      <header className={styles.header}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputFiles}
        />
      </header>
      <main className={styles.gallery}>
        {inputFiles.map((file, index) => (
          <ImageLoader
            key={index}
            inputFile={file}
            loadingQueue={loadingQueue}
            setResultFiles={setResultFiles}
          />
        ))}
      </main>
    </section>
  );
};

export default Upload;
