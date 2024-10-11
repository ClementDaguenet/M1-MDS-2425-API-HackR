const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const { faker } = require("@faker-js/faker");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

router.get("/generate-identity", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      let sex = faker.person.sexType();
      let firstName = `${faker.person.firstName(sex)}`;
      let lastName = `${faker.person.lastName()}`;
      let name = firstName + " " + lastName;
      let person = `${name} ${sex == "male" ? "né" : "née"} le ${faker.date
        .birthdate()
        .toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })} `;
      person += `est ${sex == "male" ? "un homme" : "une femme"} `;
      person += `que l'on peut contacter via ${faker.internet.email({ firstName, lastName })}`;
      res.json(person);
      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'generate-identity : ${name}',
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
        .json({ message: "Erreur lors de la génération de l'identité" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
