import React from "react";
import {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import PhoneInputWithCountrySelect from "react-phone-number-input";

type FormInputProps = {
  name: string;
  label: string;
  inputType?: string;
  placeholder?: string;
  options?: RegisterOptions<any, string> | undefined;
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  value?: any;
  errors: FieldErrors<any>;
  className?: string;
};

const FormInput = ({
  name,
  label,
  register,
  placeholder,
  options,
  errors,
  value,
  setValue,
  className,
  inputType = "text",
}: FormInputProps) => {
  const handleInputType = () => {
    switch (inputType) {
      case "text":
        return (
          <div
            className={`px-4 py-3 w-full border-2 border-input-border rounded-md bg-input-bg ${className}`}
          >
            <input
              {...register(name, options)}
              placeholder={placeholder}
              className="bg-transparent outline-none border-none w-full"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex-start gap-3">
            <input {...register(name, options)} type="checkbox" />{" "}
            <p className="text-xs text-text-secondary">
              I consent to my details processed in line with the{" "}
              <span className="underline">privacy policy</span>
            </p>
          </div>
        );

      case "textarea":
        return (
          <div
            className={`px-4 py-3 w-full h-full border-2 border-input-border rounded-md bg-input-bg ${className}`}
          >
            <textarea
              {...register(name, options)}
              rows={7}
              name={name}
              className="bg-transparent outline-none border-none w-full"
            />
          </div>
        );

      case "phone":
        return (
          <div
            className={`px-4 py-3 w-full border-2 border-input-border rounded-md bg-input-bg ${className}`}
          >
            <PhoneInputWithCountrySelect
              className={`bg-transparent outline-none font-montserrat w-full font-semibold `}
              defaultCountry="AE"
              placeholder={placeholder}
              value={value}
              {...register(name, options)}
              onChange={(e) => setValue!(name, e, { shouldValidate: true })}
            />
          </div>
        );

      default:
        return (
          <div className="px-4 py-3 w-full border-2 border-input-border rounded-md bg-input-bg">
            <input
              {...register(name, options)}
              placeholder={placeholder}
              className={`bg-transparent outline-none border-none w-full ${className}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex-start items-start flex-col w-full">
      {inputType !== "checkbox" && (
        <label className="text-base" id={name}>
          {label}
        </label>
      )}
      {handleInputType()}
      {errors && errors[name] && (
        <span className="text-red-500 text-sm">
          {String(errors[name].message)}
        </span>
      )}
    </div>
  );
};

export default FormInput;
