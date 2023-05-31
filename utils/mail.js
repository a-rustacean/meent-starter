const nodemailer = require("nodemailer");
const nodify = require("./nodify");
const render = require("./render");
const users = require("../models/users");

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

/**
 *
 * @param {string} to to
 * @param {string} subject subject
 * @param {string} html html
 * @param {Function=} cb callback
 * @param {Object} [attachments=[]] attachments
 * @returns {Promise<SMTPTransport.SentMessageInfo>}
 */
function sendMail(to, subject, html, cb, attachments = []) {
  return nodify(
    new Promise((resolve, reject) => {
      transport.sendMail(
        {
          to,
          subject,
          html,
          from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_AUTH_USER}>`,
          attachments,
        },
        (error, info) => {
          if (error) return reject(error);
          resolve(info);
        }
      );
    }),
    cb
  );
}

/**
 *
 * @param {users} user user
 * @param {string} verifyEmailToken token
 * @param {Function=} cb callback
 * @returns {Promise<SMTPTransport.SentMessageInfo>}
 */
function sendVerifyEmail(user, verifyEmailToken, cb) {
  return nodify(
    new Promise(async (resolve, reject) => {
      const html = await render(
        "verifyEmail",
        {
          user,
          env: process.env,
          verifyEmailToken,
        },
        { views: "templates" }
      );
      sendMail(user.email, "Verify your email", html, undefined, [
        {
          filename: "logo.png",
          path: process.env.APP_URL + "/logo.png",
          cid: "logo",
        },
      ])
        .then((info) => resolve(info))
        .catch((error) => {
          reject(error);
        });
    }),
    cb
  );
}

/**
 *
 * @param {users} user user
 * @param {string} resetPasswordToken token
 * @param {Function=} cb callback
 * @returns {Promise<SMTPTransport.SentMessageInfo>}
 */
function sendResetPasswordEmail(user, resetPasswordToken, cb) {
  return nodify(
    new Promise(async (resolve, reject) => {
      const html = await render(
        "resetPassword",
        {
          user,
          env: process.env,
          resetPasswordToken,
        },
        { views: "templates" }
      );
      sendMail(user.email, "Reset your password", html, undefined, [
        {
          filename: "logo.png",
          path: process.env.APP_URL + "/logo.png",
          cid: "logo",
        },
      ])
        .then((info) => resolve(info))
        .catch((error) => {
          reject(error);
        });
    }),
    cb
  );
}

module.exports = { sendMail, sendVerifyEmail, sendResetPasswordEmail };
