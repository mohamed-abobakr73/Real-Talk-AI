import { configDotenv } from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as GithubStartegy } from "passport-github2";
import { Request } from "express";
import passport, { Profile } from "passport";

configDotenv();

// Google Config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALL_BACK_URL = process.env.GOOGLE_CALL_BACK_URL!;

// Github Config
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;

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

passport.use(
  new GithubStartegy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user?: any) => void
    ) => {
      try {
        req.profile = profile;
        return done(null, profile); // successful
      } catch (err) {
        return done(err); // error occurred
      }
    }
  )
);
