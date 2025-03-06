import { app } from "./app"
import { config } from "dotenv"
config()

app.listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT)
}).then(() => {
    console.log("O servidor está rodando em: http://localhost:" + process.env.PORT)
    console.log("http://localhost:" + process.env.PORT + "/usuarios")
    console.log("http://localhost:" + process.env.PORT + "/posts")
})