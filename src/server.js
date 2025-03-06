"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
app_1.app.listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT)
}).then(function () {
    console.log("O servidor está rodando");
});
