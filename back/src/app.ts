import express from "express";
// import apiRoute from './routes/api.Route'

const app = express();

app.use(express.static("../front/dist"));
app.post("/api/score", (req, res) => {
  console.log("ok");
});

app.listen(3100, () => {
  console.log("server started");
});
