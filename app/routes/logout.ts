import authenticator from "@/utils/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";

export default async function action({ request }: ActionFunctionArgs) {
  const formdata = await request.formData();

  const intent = formdata.get("_intent");

  console.log(intent);

  console.log("logout");

  switch (intent) {
    case "logout": {
      return await authenticator.logout(request, {
        redirectTo: "/",
      });
    }
    default: {
      throw new Error(`Invalid intent: ${intent}`);
    }
  }
}
