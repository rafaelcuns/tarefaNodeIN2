import fastify from "fastify";
import { appRoutes } from "./http/routes";
import fastifyCors from '@fastify/cors';
import { config } from "dotenv"
import fastifyJwt from "@fastify/jwt";
config()

export const app = fastify()

app.register(fastifyJwt, {
    secret: String(process.env.JWT_SECRET)
})

app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})

app.register(appRoutes)