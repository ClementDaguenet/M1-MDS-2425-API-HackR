const express = require("express");
const router = express.Router();
const axios = require("axios");

const hunterApiKey = "d97b5653697578e7e09aa204baa47288e3e7d761";

router.get("/check-email", async (req, res) => {
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
    res.send(output);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification de l'email" });
  }
});

module.exports = router;
