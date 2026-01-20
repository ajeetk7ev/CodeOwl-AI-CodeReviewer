import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function
    ) {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
         user = await User.create({
  githubId: profile.id,
  name: profile.displayName || profile.username,
  email: profile.emails?.[0]?.value,
  avatar: profile.photos?.[0]?.value,
  githubToken: accessToken,
});
        } else {
          user.lastLogin = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
