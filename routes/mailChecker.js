const express = require("express");
const router = express.Router();
const axios = require("axios");
const localStorage = require("localStorage");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

const hunterApiKey = "d97b5653697578e7e09aa204baa47288e3e7d761";

router.get("/check-email", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "secretariat"
  ) {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${req.query.email}&api_key=${hunterApiKey}`
      );
      const status = response.data.data.status;
      let output = "";
      if (status === "valid" || status === "accept_all") {
        output = "L'adresse mail existe";
      } else {
        output = "L'adresse mail n'existe pas";
      }
      res.status(200).send(output);
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-email : ${req.query.email}',
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
      res
        .status(500)
        .json({ message: "Erreur lors de la vérification de l'email" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
