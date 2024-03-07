import { Authenticator } from "remix-auth";
import { sessionStorage } from "./auth.session.server";
import gitHubStrategy from "./provider/github.server";
import { linkedInStratedy } from "./provider/linked.server";

const authenticator = new Authenticator(sessionStorage);

authenticator.use(gitHubStrategy, "github");
authenticator.use(linkedInStratedy, "linkedin");

export default authenticator;
