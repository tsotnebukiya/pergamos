import Notify from "pergamos/components/overlays/Toast";
import { useState } from "react";
import toast from "react-hot-toast";

const useImageHandler = () => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / (1024 * 1024); // size in MB
      const fileType = file.type;

      if (
        (fileType === "image/png" || fileType === "image/jpeg") &&
        fileSizeMB <= 0.5
      ) {
        setFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
      } else {
        toast.custom((t) => (
          <Notify
            t={t}
            type="error"
            text="Only IMG/JPEG type files under 0.5MB"
          />
        ));
      }
    }
  };

  return { file, preview, handleFileChange, setFile, setPreview };
};

export default useImageHandler;
