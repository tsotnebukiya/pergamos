/* eslint-disable react/display-name */
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";
import type { BankFormData } from "pergamos/pages/dashboard/banks/create";
import Alert from "../UI/Alert";

interface InputProps<T extends FieldValues> {
  label: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  placeholder: string;
  type: string;
  errors: FieldErrors<T>;
}

const Input = <T extends FieldValues>({
  label,
  register,
  required,
  placeholder,
  type,
  errors,
}: InputProps<T>) => {
  const error = errors[label]?.message;
  return (
    <>
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>
      <div className=" mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 dark:bg-white/5 dark:ring-white/10 dark:focus-within:ring-indigo-500 sm:max-w-md">
        <input
          {...register(label, { required })}
          type={type}
          id={label}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-3  text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>

      {error && (
        <div className="mt-4 sm:max-w-md">
          <Alert text={error as string} type="error" />
        </div>
      )}
    </>
  );
};

export default Input;
