"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import apiRoute from './routes/api.Route'
const app = (0, express_1.default)();
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(express_1.default.static("../front/dist"));
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
