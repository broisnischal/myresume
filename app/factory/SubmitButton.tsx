import { Button } from "@/components/ui/button";
import { useIsSubmitting, useIsValid } from "remix-validated-form";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  label?: string;
  submittingLabel?: string;
  disableWhenInvalid?: boolean;
  form?: string;
  name?: string;
  variant?: "default" | "destructive" | "outline" | "link" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  value?: string;
  "data-testid"?: string;
  formMethod?: string;
}

export const SubmitButton = ({
  label = "Submit",
  submittingLabel = "Submitting...",
  disableWhenInvalid,
  form,
  name,
  value,
  "data-testid": dataTestid,
  formMethod,
  variant,
  size,
}: Props) => {
  const isSubmitting = useIsSubmitting(form);
  const isValid = useIsValid(form);
  return (
    <Button
      variant={variant || "default"}
      size={size}
      type="submit"
      disabled={disableWhenInvalid ? isSubmitting || !isValid : isSubmitting}
      name={name}
      value={value}
      form={form}
      data-testid={dataTestid}
      formMethod={formMethod}
    >
      {isSubmitting ? submittingLabel : label}
    </Button>
  );
};
