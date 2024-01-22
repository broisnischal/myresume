import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { forwardRef } from "react";
import { useField } from "remix-validated-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  value?: string;
  hideErrors?: boolean;
  placeholder?: string;
  "data-testid"?: string;
  form?: string;
  disabled?: boolean;
}

// eslint-disable-next-line react/display-name
const FieldInput = forwardRef(
  (
    {
      name,
      label,
      type = "text",
      value,
      placeholder,
      hideErrors: noErrors,
      "data-testid": dataTestId,
      form,
      disabled,
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { getInputProps, error } = useField(name, {
      formId: form,
      validationBehavior: {
        initial: "onSubmit",
        whenTouched: "onSubmit",
        whenSubmitted: "onChange",
      },
    });
    const actualValue = value ?? (type === "checkbox" ? "on" : undefined);
    return (
      <div>
        <Label htmlFor={name} className="">
          {label}
        </Label>
        <Input
          data-testid={dataTestId}
          {...getInputProps({
            form,
            type,
            placeholder,
            ref,
            id: name,
            value: actualValue,
            disabled,
          })}
        />
        {error && !noErrors && (
          <span className="text-red-400 text-[14px]">{error}</span>
        )}
      </div>
    );
  }
);

export default FieldInput;
