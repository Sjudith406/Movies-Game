"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
route.get('/', (req, res) => {
    const user = req.cookies;
    res.json({ message: `votre requête est passée GET ! bonjour: ${user}` });
});
route.post('/', (req, res) => {
    const user = req.cookies;
    res.json({ message: `votre requête est passée POST ! bonjour: ${user}` });
});
exports.default = route;
