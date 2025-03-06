import { FastifyInstance } from "fastify";
import { atualizarUsuario, criarUsuario, deletarUsuario, entrar, listarUsuario, mostrarPerfil, pegarUsuarios } from './controllers/usuarios'
import { atualizarPost, criarPost, deletarPost, listarPost, listarPostUsuario, pegarPosts } from "./controllers/posts";
import { verifyJWT } from "./middlewares/verify-jwt";

export function appRoutes(app: FastifyInstance) {
    app.post('/usuarios', criarUsuario) // Password digest e e-mail igual
    app.post('/posts', criarPost)
    app.get('/usuarios', pegarUsuarios)
    app.get('/posts', pegarPosts)
    app.delete('/usuarios/:id', deletarUsuario)
    app.delete('/posts/:id', deletarPost)
    app.patch('/usuarios/:id', atualizarUsuario)
    app.patch('/posts/:id', atualizarPost)
    app.get('/usuarios/:id', listarUsuario)
    app.get('/posts/:id', listarPost)
    app.get('/posts/usuario/:id', listarPostUsuario)
    app.post('/entrar', entrar)

    // Autenticado

    app.get('/perfil', {onRequest: [verifyJWT]}, mostrarPerfil)
}