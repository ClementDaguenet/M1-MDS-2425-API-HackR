const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const axios = require("axios");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.get("/check-domain", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      const options = {
        method: "GET",
        url: `https://api.securitytrails.com/v1/domain/${req.query.domain}/subdomains?children_only=false&include_inactive=true`,
        headers: {
          accept: "application/json",
          APIKEY: "99UWTpY-x113htf_FRLfJ-WcwIRgxk8s",
        },
      };
      const subdomainList = {subdomains : []};
      await axios.request(options).then(function (response) {
        const subdomains = response.data.subdomains;
        subdomains.forEach((subdomain) => {
          subdomainList.subdomains.push(subdomain);
        });
      });
      res.json(subdomainList);
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'check-domain : ${req.query.domain}',
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
        .json({ message: "Erreur lors de la recherche du nom de domaine" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
