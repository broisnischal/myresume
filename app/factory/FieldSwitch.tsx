import { Switch } from "@/components/ui/switch";
import React, { forwardRef } from "react";
import { useField } from "remix-validated-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  type?: "button" | "reset" | "submit";
  value?: string;
  hideErrors?: boolean;
  "data-testid"?: string;
  form?: string;
  disabled?: boolean;
}

// eslint-disable-next-line react/display-name
const FieldSwitch = forwardRef(
  ({
    name,
    value,
    type,
    hideErrors: noErrors,
    "data-testid": dataTestId,
    form,
    disabled,
  }: InputProps) => {
    const { getInputProps, error } = useField(name, {
      formId: form,
      validationBehavior: {
        initial: "onSubmit",
        whenTouched: "onSubmit",
        whenSubmitted: "onChange",
      },
    });
    return (
      <div className="flex flex-col">
        <Switch
          data-testid={dataTestId}
          {...getInputProps({
            form,
            type,
            value,
            id: name,
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

export default FieldSwitch;
