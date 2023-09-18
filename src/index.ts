import { Elysia, t } from "elysia";
import {
  addEmailAddress,
  deleteEmailAddress,
  getAllEmailAddresses,
  getSpecificFromEmail,
  getSpecificFromName,
} from "./database";
import validator from "validator";
import isEmail from "validator/lib/isEmail";

const app = new Elysia()
  .get("/", () => getAllEmailAddresses())
  .post(
    "/subscribe",
    ({ body }) => {
      // Validate email
      if (!validator.isEmail(body.email)) {
        throw new Error("You must provide a valid email");
        // Validate length of name
      } else if (!validator.isLength(body.fullName, { min: 1 })) {
        throw new Error("Name must be at least 1 character");
      }
      addEmailAddress(body.email, body.fullName);
      return body;
    },
    {
      body: t.Object({
        email: t.String(),
        fullName: t.String(),
      }),
    }
  )
  .get("/specific-email", ({ query }) => {
    const term = String(query.term);
    if (!query.term || term.length <= 0) {
      throw new Error('Query parameter: "term" is required');
    }
    return getSpecificFromEmail(term);
  })
  .get("/specific-name", ({ query }) => {
    const term = String(query.term);
    if ("ÆæØøÅå".includes(term)) {
      throw new Error(`Search term cannot include [Æ,Ø,Å]`);
    }
    if (!query.term || term.length <= 0) {
      throw new Error('Query parameter: "term" is required');
    }
    return getSpecificFromName(term);
  })
  .delete("/unsubscribe/:mail", ({ params }) => {
    if (!isEmail(params.mail)) {
      throw new Error("You must provide a valid email address");
    }
    const deleted = deleteEmailAddress(params.mail);
    if (deleted) return "Email address deleted";
    else return "Email address not found";
  })

  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
