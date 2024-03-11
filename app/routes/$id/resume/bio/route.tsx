import { Form } from "@remix-run/react";
import { Editor } from "novel";

export default function CreateResume() {
  return (
    <div>
      <h1>Your Bio</h1>

      <Form method="post" action="/api/generate">
        <Editor
          defaultValue={{
            type: "doc",
            content: [],
          }}
        />
      </Form>
    </div>
  );
}
