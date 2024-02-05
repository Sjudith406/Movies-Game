import express from "express";
// import apiRoute from './routes/api.Route'

const app = express();
let scoreEnregistrer = 0;

app.use(express.static("../front/dist"));
app.post("/api/score", (req, res) => {
  const { score } = req.body;
  scoreEnregistrer = score;
  console.log("Score stocké est : ", score);
});

app.listen(3100, () => {
  console.log("server started");
});
