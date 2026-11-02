import { action, app, page, query, route } from "@wasp.sh/spec"
import { Root } from "./src/site/Root" with { type: "ref" }
import { HomePage } from "./src/site/pages" with { type: "ref" }
import { AnimalsPage } from "./src/site/pages" with { type: "ref" }
import { AdoptFosterPage } from "./src/site/pages" with { type: "ref" }
import { SurrenderPage } from "./src/site/pages" with { type: "ref" }
import { VolunteerPage } from "./src/site/pages" with { type: "ref" }
import { WaysToGivePage } from "./src/site/pages" with { type: "ref" }
import { SuccessesPage } from "./src/site/pages" with { type: "ref" }
import { AboutPage } from "./src/site/pages" with { type: "ref" }
import { ContactPage } from "./src/site/pages" with { type: "ref" }
import { LoginPage } from "./src/auth/LoginPage" with { type: "ref" }
import { SignupPage } from "./src/auth/SignupPage" with { type: "ref" }
import { ProfilePage } from "./src/auth/ProfilePage" with { type: "ref" }
import { onBeforeSignup, userSignupFields } from "./src/auth/authConfig" with { type: "ref" }
import {
  changeOwnPassword,
  getOwnProfile,
  updateOwnProfile,
  uploadOwnProfileImage,
} from "./src/auth/profileOperations" with { type: "ref" }

export default app({
  name: "PetRescueByJudy",
  wasp: { version: "^0.26.0" },
  title: "Pet Rescue by Judy Portal",
  client: {
    rootComponent: Root,
  },
  auth: {
    userEntity: "User",
    methods: {
      usernameAndPassword: { userSignupFields },
    },
    onBeforeSignup,
    onAuthSucceededRedirectTo: "/",
    onAuthFailedRedirectTo: "/login",
  },
  spec: [
    route("LoginRoute", "/login", page(LoginPage), { prerender: true }),
    route("SignupRoute", "/signup", page(SignupPage), { prerender: true }),
    route("RootRoute", "/", page(HomePage), { prerender: true }),
    route("AnimalsRoute", "/animals", page(AnimalsPage), { prerender: true }),
    route("AdoptFosterRoute", "/adopt-foster", page(AdoptFosterPage), { prerender: true }),
    route("SurrenderRoute", "/surrender", page(SurrenderPage), { prerender: true }),
    route("VolunteerRoute", "/volunteer", page(VolunteerPage), { prerender: true }),
    route("WaysToGiveRoute", "/ways-to-give", page(WaysToGivePage), { prerender: true }),
    route("SuccessesRoute", "/successes", page(SuccessesPage), { prerender: true }),
    route("AboutRoute", "/about", page(AboutPage), { prerender: true }),
    route("ContactRoute", "/contact", page(ContactPage), { prerender: true }),
    route("ProfileRoute", "/profile", page(ProfilePage, { authRequired: true })),
    query(getOwnProfile, { entities: ["User", "ProfileImage"] }),
    action(updateOwnProfile, { entities: ["User"] }),
    action(changeOwnPassword, { entities: ["User"] }),
    action(uploadOwnProfileImage, { entities: ["User", "ProfileImage"] }),
  ],
})
