const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/send-email", async (req, res) => {
  const recipient = req.query.recipient;
  const subject = req.query.subject;
  const body = req.query.body;
  const times = req.query.times;
  const sender = "archibald.mydigitalschoolfake@gmail.com";
  const pwd = "ArchibaldMDS5@";

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: sender,
      pass: pwd,
    },
  });

  const mailOptions = {
    from: sender,
    to: recipient,
    subject: subject,
    text: body,
  };
  console.log(sender);
  console.log(recipient);
  console.log(subject);
  console.log(body);
  console.log(times);

  function sendEmail() {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email envoyé : " + info.response);
      }
    });
  }
//   for (let i = 0; i <= times; i++) {
    sendEmail();
    res.send("Email envoyé");
//   }
});

module.exports = router;
