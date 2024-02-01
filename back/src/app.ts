import express from "express";
// import apiRoute from './routes/api.Route'

const app = express();

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(express.static("../front/dist"));
// app.use('/', (req, res, next) => res.send('hello world'))
// app.use('/', express.static('../../front/dist'))

// app.use((req, res, next) => {
//     if (req.headers.user) {
//         req.cookies = req.headers.user
//         return next()
//     }
//     return res.end('wesh degage !')
// })

// app.use('/api', apiRoute)

app.listen(3100, () => {
  console.log("server started");
});
