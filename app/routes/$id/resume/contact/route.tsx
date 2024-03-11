import FieldInput from "@/factory/FieldInput";
import { SubmitButton } from "@/factory/SubmitButton";
import { ValidatedForm } from "remix-validated-form";

export default function LinkPage() {
  return (
    <div className="container flex flex-col gap-3">
      <h2 className="text-3xl  py-2 mb-5">Contact Information</h2>

      <ValidatedForm className="flex flex-col gap-3 w-full">
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
        {/* <SubmitButton label="Update" /> */}
      </ValidatedForm>

      <div className="w-full">
        {/* <h2>Social Links</h2> */}

        <ValidatedForm className="">
          <div className="flex flex-col gap-3">
            <FieldInput
              placeholder="Share your Link"
              label="Project Links"
              name="email"
              type="email"
            />
            {/* <SubmitButton label="Add" /> */}
          </div>
        </ValidatedForm>
      </div>

      <div>
        <h2>Socials Links</h2>
      </div>
    </div>
  );
}
