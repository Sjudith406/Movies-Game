import express from "express";
const app = express();

app.use((req, res) => {
  res.json({ message: "votre requête est passée !" });
});
export default app;
