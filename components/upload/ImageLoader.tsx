import { Box, Skeleton } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export type ImgProps = {
  name: string;
  src: string;
};

interface Props {
  inputFile: File;
  loadingQueue: string[];
  setResultFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

const ImageLoader: FC<Props> = (props) => {
  const { inputFile, loadingQueue, setResultFiles } = props;

  const [hasUploaded, setHasUploaded] = useState(false);
  const [localResultFile, setLocalResultFile] = useState<ImgProps>();

  const loadImageFromFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async function (e) {
        if (reader.result) {
          const result = {
            name: file.name,
            src: reader.result,
          };
          resolve(result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!hasUploaded && loadingQueue.some((file) => file === inputFile.name)) {
      setHasUploaded(true);
      doUpload(inputFile);
    }
  }, [loadingQueue]);

  const doUpload = async (inputFile: File) => {
    // load file
    const file = await loadImageFromFile(inputFile);
    // add to result file
    setLocalResultFile(file as ImgProps);
    setResultFiles((prev) => [...prev, file]);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {!!localResultFile ? (
        <img src={localResultFile.src} width="300" />
      ) : (
        <Skeleton
          variant="rectangular"
          width={300}
          height={200}
          animation={loadingQueue.includes(inputFile.name) ? "wave" : false}
        />
      )}

      <span>
        {inputFile.name}
        {loadingQueue.includes(inputFile.name) && (
          <CircularProgress size={16} sx={{ ml: 2 }} />
        )}
      </span>
    </Box>
  );
};

export default ImageLoader;
