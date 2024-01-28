import FieldInput from "@/factory/FieldInput";
import { SubmitButton } from "@/factory/SubmitButton";
import { ValidatedForm } from "remix-validated-form";

export default function LinkPage() {
  return (
    <div className="container ">
      <h2 className="text-3xl  py-2 mb-5">Contact Information</h2>

      <ValidatedForm className="flex flex-col gap-3 w-1/2">
        <FieldInput
          placeholder="Enter your email"
          label="Email"
          name="email"
          type="email"
        />
        <FieldInput
          placeholder="Enter your phone"
          label="Phone"
          name="phone"
          type="phone"
        />
        <FieldInput
          placeholder="Enter your address"
          label="Address"
          name="address"
          type="address"
        />
        <FieldInput
          placeholder="Enter your username"
          label="Username"
          name="address"
          type="address"
        />
        <FieldInput
          placeholder="Your website (optional)"
          label="Website"
          name="website"
          type="website"
        />
        <SubmitButton label="Update" />
      </ValidatedForm>
    </div>
  );
}
