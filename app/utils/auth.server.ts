import { Authenticator } from "remix-auth";
import { sessionStorage } from "./auth.session.server";
import gitHubStrategy from "./provider/github.server";

const authenticator = new Authenticator(sessionStorage);

authenticator.use(gitHubStrategy, "github");

export default authenticator;
