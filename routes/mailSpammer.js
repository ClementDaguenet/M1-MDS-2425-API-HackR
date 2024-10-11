const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const localStorage = require("localStorage");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.get("/send-email", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "secretariat"
  ) {
    const recipient = req.query.recipient;
    const subject = req.query.subject;
    const body = req.query.body;
    const times = req.query.times;
    const sender = "archibald.mydigitalschoolfake@gmail.com";
    const pwd = "tqqp btaq epfd afet";

    const transporter = nodemailer.createTransport({
      service: "gmail",
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
    console.log(`De : ${sender}`);
    console.log(`À : ${recipient}`);
    console.log(subject);
    console.log(body);

    for (let i = 1; i <= times; i++) {
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email envoyé : " + info.response);
        }
      });
    }
    if (times == 1) {
      res.send(`${times} email envoyé`);
    } else {
      res.send(`${times} emails envoyés`);
    }
    const now = new Date();
    db.run(`
      INSERT INTO logs (user, action, date) VALUES
        ('${localStorage.getItem("username")}',
        'send-email : to: ${recipient} x${times}fois',
        '${now.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}')
    `);
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
