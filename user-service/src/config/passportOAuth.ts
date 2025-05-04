import { configDotenv } from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Request } from "express";
import passport, { Profile } from "passport";

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
    async (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user?: any) => void
    ) => {
      try {
        request.profile = profile;
        return done(null, profile); // successful
      } catch (err) {
        return done(err); // error occurred
      }
    }
  )
);
