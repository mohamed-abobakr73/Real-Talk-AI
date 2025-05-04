import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

const NODE_MAILER_USER = process.env.NODE_MAILER_USER;
const NODE_MAILER_PASS = process.env.NODE_MAILER_PASS;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASS,
  },
});

export default transporter;
