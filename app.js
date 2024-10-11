const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const localStorage = require("localStorage");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT,password TEXT,role TEXT);`);
db.run(`CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT,user TEXT,action TEXT,date TEXT);`);
// db.run(`INSERT INTO users (email, password, role) VALUES('archibald@gmail.com', 'password123', 'admin'),('geraldine@gmail.com', 'mot_de_passe', 'secretariat'),('kevin@gmail.com', 'kevinlebg', 'dev'),('jean-titouan@gmail.com', '$ùp€r_môt_d€_pà$$€', 'hacker')`);
// admin -> accède à tout | secretariat -> accede aux fonctions de mail | dev -> accede aux fonctions de mdp | hacker -> accede a tout sauf mail
console.log("Succès de connexion à la BDD");

const port = 61159;
app.use(express.json());

var userRole = "temp";
const secretKey = crypto.randomBytes(32).toString("hex");

const authenticateToken = (req, res, next) => {
  const token = localStorage.getItem("authToken");
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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
    localStorage.removeItem("authToken");
    localStorage.setItem("authToken", token);
    localStorage.removeItem("username");
    localStorage.setItem("username", username);
    localStorage.removeItem("userRole");
    localStorage.setItem("userRole", userRole);
    res.json("Vous êtes connecté");
    console.log(`${user.email} (${user.role}) vient de se connecter`);
    const now = new Date();
    db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'connection : ${username}',
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
  });
});

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

const logsRouter = require("./routes/logs");
app.use("/", authenticateToken, logsRouter);

const mailCheckerRouter = require("./routes/mailChecker");
app.use("/", authenticateToken, mailCheckerRouter);

const mailSpammerRouter = require("./routes/mailSpammer");
app.use("/", authenticateToken, mailSpammerRouter);

const passwordCheckerRouter = require("./routes/passwordChecker");
app.use("/", authenticateToken, passwordCheckerRouter);

const passwordGeneratorRouter = require("./routes/passwordGenerator");
app.use("/", authenticateToken, passwordGeneratorRouter);

const identityGeneratorRouter = require("./routes/identityGenerator");
app.use("/", authenticateToken, identityGeneratorRouter);

const domainCheckerRouter = require("./routes/domainChecker");
app.use("/", authenticateToken, domainCheckerRouter);

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
