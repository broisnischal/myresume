import { Editor } from "novel";

export default function CreateResume() {
  return (
    <div>
      <h1>Your Bio</h1>

      <Editor
        defaultValue={{
          type: "doc",
          content: [],
        }}
      />
    </div>
  );
}
