import { ActionFunctionArgs, json } from "@remix-run/node";
import Anthropic from "@anthropic-ai/sdk";

export async function action({ request }: ActionFunctionArgs) {
  const formdata = await request.formData();

  console.log(formdata);

  switch (request.method) {
    case "POST": {
      const anthropic = new Anthropic({
        apiKey:
          "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",
      });

      const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 133,
        temperature: 0,
        system:
          "You are the AI resume generator, you need to add the autocompletation what user have been writing",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${formdata.get("prompt")}`,
              },
            ],
          },
        ],
      });

      return msg.content;
    }
    default: {
      throw new Error(`Invalid intent: ${request.method}`);
    }
  }
}
