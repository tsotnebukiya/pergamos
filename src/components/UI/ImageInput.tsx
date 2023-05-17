import { PhotoIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import ButtonStyle from "./ButtonStyle";
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
} from "react-hook-form";
import type { BankFormData } from "pergamos/pages/dashboard/banks/create";
import useImageHandler from "pergamos/hooks/ImageUploadHook";
import Alert from "./Alert";

interface ImageInputProps<T extends FieldValues> {
  label: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

const ImageInput = <T extends FieldValues>({
  label,
  register,
  required,
  setValue,
  errors,
}: ImageInputProps<T>) => {
  const { file, preview, handleFileChange, setFile, setPreview } =
    useImageHandler();
  const inputField = register(label, { required });
  const error = errors[label]?.message;
  return (
    <>
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        Logo
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25 sm:max-w-md">
        <div className="text-center">
          {file && preview ? (
            <Image
              src={preview}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          ) : (
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500"
              aria-hidden="true"
            />
          )}
          {file && preview && (
            <button
              className="mt-6"
              type="button"
              onClick={() => {
                setFile(undefined);
                setPreview(undefined);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setValue(label, undefined as any);
              }}
            >
              <ButtonStyle text="Remove" type="secondary" />
            </button>
          )}

          <div>
            <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600 dark:text-gray-400">
              <label
                htmlFor={label}
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-gray-900 dark:text-white  dark:hover:text-indigo-500"
              >
                {!file && <span>Upload a file</span>}
                <input
                  disabled={file ? true : false}
                  id={label}
                  {...inputField}
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    void inputField.onChange(e);
                    handleFileChange(e);
                  }}
                />
              </label>
              {!file && <p className="pl-1">or drag and drop</p>}
            </div>
            {!file && (
              <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                PNG, JPG to 1MB
              </p>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 sm:max-w-md">
          <Alert text={error as string} type="error" />
        </div>
      )}
    </>
  );
};

export default ImageInput;
