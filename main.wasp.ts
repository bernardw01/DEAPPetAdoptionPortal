import { action, app, page, query, route } from "@wasp.sh/spec"
import { MainPage } from "./src/MainPage" with { type: "ref" }
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
  name: "WaspAiStarter",
  wasp: { version: "^0.26.0" },
  title: "Wasp AI Starter",
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
    route("LoginRoute", "/login", page(LoginPage)),
    route("SignupRoute", "/signup", page(SignupPage)),
    route("RootRoute", "/", page(MainPage, { authRequired: true })),
    route("ProfileRoute", "/profile", page(ProfilePage, { authRequired: true })),
    query(getOwnProfile, { entities: ["User", "ProfileImage"] }),
    action(updateOwnProfile, { entities: ["User"] }),
    action(changeOwnPassword, { entities: ["User"] }),
    action(uploadOwnProfileImage, { entities: ["User", "ProfileImage"] }),
  ],
})

