import { configDotenv } from "dotenv";
import { Request } from "express";
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

configDotenv();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALL_BACK_URL = process.env.GOOGLE_CALL_BACK_URL!;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user?: any) => void
    ) => {
      try {
        const user = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          username: profile.displayName ?? null,
          picture: profile.photos?.[0]?.value ?? null,
        };

        return done(null, user); // successful
      } catch (err) {
        return done(err); // error occurred
      }
    }
  )
);
