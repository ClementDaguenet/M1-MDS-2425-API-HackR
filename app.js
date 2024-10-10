const express = require("express");
const app = express();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const localStorage = require("localStorage");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    role TEXT
  )
`);
console.log("Succès de connexion à la BDD");
// db.run(`
//   INSERT INTO users (email, password, role) VALUES
//     ('archibald@gmail.com', 'password123', 'admin'),
//     ('geraldine@gmail.com', 'mot_de_passe', 'secretariat'),
//     ('kevin@gmail.com', 'kevinlebg', 'dev'),
//     ('jean-titouan@gmail.com', '$ùp€r_môt_d€_pà$$€', 'hacker')
// `);
// admin -> accède à tout | secretariat -> accede aux fonctions de mail | dev -> accede aux fonctions de mdp | hacker -> accede a tout sauf mail

const port = 61159;
var userRole = "dev";
const secretKey = crypto.randomBytes(32).toString("hex");
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = localStorage.getItem("authToken");
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/users", async (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Erreur lors de la récupération des utilisateurs");
    } else {
      res.json(rows);
    }
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.query;
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [username], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Erreur d'authentification" });
    }
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
    const token = jwt.sign({ user: username }, secretKey, { expiresIn: "3h" });
    userRole = user.role;
    res.json({ token });
    localStorage.removeItem("authToken");
    localStorage.setItem("authToken", token);
    console.log(`L'utilisateur ${user.email} vient de se connecter, son rôle est ${user.role}.`)
  });
});

// checker le userRole dans la route sinon roles useless
if (userRole === "admin" || userRole === "secretariat") {
  const mailCheckerRouter = require("./routes/mailChecker");
  app.use("/", authenticateToken, mailCheckerRouter);
} else {
  console.log("Vous n'êtes pas autorisés à utiliser cette fonctionnalité !");
}

if (userRole === "admin" || userRole === "secretariat") {
  const mailSpammerRouter = require("./routes/mailSpammer");
  app.use("/", authenticateToken, mailSpammerRouter);
} else {
  console.log("Vous n'êtes pas autorisés à utiliser cette fonctionnalité !");
}

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
