import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";


passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

            try {
                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { mesaage: "No email found" })
                }

                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.RIDER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }

                return done(null, user)


            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)
 



/*  
{
  "success": false,
  "message": "Unknown authentication strategy \"google\"",
  "err": {

  },
  "stack": "Error: Unknown authentication strategy \"google\"\n    at attempt (F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\node_modules\\passport\\lib\\middleware\\authenticate.js:193:39)\n    at authenticate (F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\node_modules\\passport\\lib\\middleware\\authenticate.js:379:7)\n    at F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\src\\app\\modules\\auth\\auth.route.ts:15:68\n    at Generator.next (\u003Canonymous\u003E)\n    at F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\src\\app\\modules\\auth\\auth.route.ts:8:71\n    at new Promise (\u003Canonymous\u003E)\n    at __awaiter (F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\src\\app\\modules\\auth\\auth.route.ts:4:12)\n    at F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\src\\app\\modules\\auth\\auth.route.ts:14:81\n    at Layer.handleRequest (F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (F:\\Level-2\\Mission-05-Be An Industry Standard\\Backend-PH-Tour-Managemnet-Parvez\\node_modules\\router\\lib\\route.js:157:13)"
}
*/

// To solve the above error we need to setup serializeUser and deserializeUser


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})