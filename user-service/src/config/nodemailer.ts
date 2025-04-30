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

async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <mohamedabobakr04@gmail.com>', // sender address
    to: "mohamedabobakr045@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
export default transporter;
