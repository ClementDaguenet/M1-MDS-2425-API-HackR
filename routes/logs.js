const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.get("/check-logs", async (req, res) => {
  if (localStorage.getItem("userRole") === "admin") {
    try {
      const sql = `SELECT user, action, date FROM logs limit ? offset ?`;
      db.all(sql, [10, 0], (err, logs) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Erreur d'authentification" });
        }
        res.status(200).json(logs);
      });
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-logs : all',
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
        .json({ message: "Erreur lors de la récupération des logs" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

router.get("/check-logs/users", async (req, res) => {
  if (localStorage.getItem("userRole") === "admin") {
    try {
      const sql = `SELECT action, date FROM logs WHERE user like ? limit ? offset ?`;
      db.all(sql, [`%${req.query.user}%`, 10, 0], (err, logs) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Erreur d'authentification" });
        }
        res.status(200).json(logs);
      });
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-logs/users : ${req.query.user}',
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
        .json({ message: "Erreur lors de la récupération des logs" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

router.get("/check-logs/actions", async (req, res) => {
  if (localStorage.getItem("userRole") === "admin") {
    try {
      const sql = `SELECT user, date FROM logs WHERE action like ? limit ? offset ?`;
      db.all(sql, [`%${req.query.action}%`, 10, 0], (err, logs) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Erreur d'authentification" });
        }
        res.status(200).json(logs);
      });
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-logs/actions : ${req.query.action}',
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
        .json({ message: "Erreur lors de la récupération des logs" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

router.get("/clear-logs", async (req, res) => {
  if (localStorage.getItem("userRole") === "admin") {
    try {
      const sql = `DELETE FROM logs`;
      db.all(sql, (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Erreur d'authentification" });
        }
      });
      res.status(200).json("Tous les logs ont été clear")
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors du clear des logs" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
