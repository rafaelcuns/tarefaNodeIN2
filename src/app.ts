import fastify from "fastify";
import { appRoutes } from "./http/routes";
import fastifyCors from '@fastify/cors';

export const app = fastify()

app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})

app.register(appRoutes)