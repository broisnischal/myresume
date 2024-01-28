import { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);

  switch (request.method) {
    case "POST": {
      console.log(request.body);

      return null;
    }
    default: {
      throw new Error(`Invalid intent: ${request.method}`);
    }
  }
}
