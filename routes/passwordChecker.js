const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const fs = require("fs");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

const urlPasswords =
  "https://raw.githubusercontent.com/danielmiessler/SecLists/refs/heads/master/Passwords/Common-Credentials/10k-most-common.txt";
const pathPasswords = "./examples/temp.txt";

router.get("/check-password", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "dev" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      let found = false;
      let data = "";
      async function fetchData(url) {
        const { default: fetch } = await import("node-fetch");
        const response = await fetch(url);
        return await response.text();
      }
      data = await fetchData(urlPasswords);
      fs.writeFile(pathPasswords, data, (err) => {
        if (err) {
          console.error("Erreur lors du remplissage du fichier :", err);
        }
      });
      fs.readFile(pathPasswords, "utf8", (error, file) => {
        data = file;
        if (error) {
          console.error("Erreur de lecture du fichier :", error);
          return;
        }
      });
      const lignes = data.split(/\r?\n/);
      lignes.forEach((ligne) => {
        if (req.query.password === ligne) {
          found = true;
        }
      });
      res.status(200).send(
        found ? "Mot de passe beaucoup utilisé" : "Mot de passe peu utilisé"
      );
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-password : ${req.query.password}',
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
        .json({ message: "Erreur lors de la vérification du mot de passe" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
