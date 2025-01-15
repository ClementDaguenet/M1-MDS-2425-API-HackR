const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const axios = require('axios');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.get("/generate-password", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "dev" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      const response = await axios.get(
        "https://www.random.org/strings/?num=1&len=15&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain"
      );
      res.status(200).json(`Mot de passe sécurisé généré : ${response.data.replace("\n","")}`);
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'generate-password : ${response.data.replace("\n","")}',
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
        .json({ message: "Erreur lors de la génération du mot de passe" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
