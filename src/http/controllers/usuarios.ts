import { FastifyReply, FastifyRequest } from "fastify"
import {z} from "zod"
import {prisma} from "@/src/lib/prisma"
import { hash } from "bcryptjs"

export async function criarUsuario(request: FastifyRequest, reply: FastifyReply) {
    const usuarioSchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        senha: z.string(),
        foto: z.string()
    })

    const { nome, email, senha, foto } = usuarioSchema.parse(request.body)

    const mesmoEmailDeUsuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    })
    if (mesmoEmailDeUsuario) {
        return reply.send(409).send('E-mail já cadastrado')
    }

    const senhaCriptografada = await hash(senha, 6)
    const usuarioCriado = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaCriptografada,
            foto
        }
    })
    if (usuarioCriado) {
        return reply.status(201).send("Usuário criado")
    }
    
}

export async function pegarUsuarios(request: FastifyRequest, reply: FastifyReply) {
    const usuarios = await prisma.usuario.findMany();
    reply.send(usuarios);
}

export async function deletarUsuario(request: FastifyRequest, reply: FastifyReply) { // Cascade
    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);
    const delet = await prisma.usuario.delete({
        where: {
            id: id
        }
    })
    reply.status(204).send(delet)
}

export async function atualizarUsuario(request: FastifyRequest, reply: FastifyReply) {
    const usuarioSchema = z.object({
        nome: z.string().optional(),
        email: z.string().email().optional(),
        senha: z.string().optional(),
        foto: z.string().optional()
    })

    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);

    const dadosAtualizacao = usuarioSchema.parse(request.body);
    const usuarioAtualizado = await prisma.usuario.update({
      where: {
        id: id,
      },
      data: dadosAtualizacao,
    });

    reply.send(usuarioAtualizado);
}

export async function listarUsuario(request: FastifyRequest, reply: FastifyReply) {
    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);
    
    const usuario = await prisma.usuario.findFirst({
        where: {
            id: id
        }
    });
    reply.send(usuario);
}