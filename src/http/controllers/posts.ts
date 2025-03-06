import { FastifyReply, FastifyRequest } from "fastify"
import {z} from "zod"
import {prisma} from "@/src/lib/prisma"

export async function criarPost(request: FastifyRequest, reply: FastifyReply) {
    const postSchema = z.object({
        titulo: z.string(),
        conteudo: z.string()
    })

    const { conteudo, titulo } = postSchema.parse(request.body)

    await prisma.post.create({
        data: {
            conteudo,
            titulo,
            criado_em: new Date(),
            id_usuario: Number(request.user.sub)
        }
    })

    return reply.status(201).send("Post adicionado")
}

export async function pegarPosts(request: FastifyRequest, reply: FastifyReply) {
    const post = await prisma.post.findMany();
    reply.send(post);
}

export async function deletarPost(request: FastifyRequest, reply: FastifyReply) { // Cascade
    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);

    // const post = prisma.post.findUnique({
    //     where: {
    //         id
    //     }
    // })

    // if (post.id_usuario !== Number(request.user.sub)) {
    //     return reply.status(403).send("Não é permitido apagar posts de outros usuários");
    // }

    const delet = await prisma.post.delete({
        where: {
            id: id
        }
    })
    reply.status(204).send(delet)
}

export async function atualizarPost(request: FastifyRequest, reply: FastifyReply) {
    const postSchema = z.object({
        conteudo: z.string().optional(),
        criado_em: z.string().datetime().optional(),
        id_usuario: z.number().optional()
    })

    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);

    const dadosAtualizacao = postSchema.parse(request.body);
    const usuarioAtualizado = await prisma.post.update({
      where: {
        id: id,
      },
      data: dadosAtualizacao,
    });

    reply.send(usuarioAtualizado);
}

export async function listarPost(request: FastifyRequest, reply: FastifyReply) {
    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const id = parseInt(idString, 10);
    
    const post = await prisma.post.findFirst({
        where: {
            id: id
        }
    });
    reply.send(post);
}

export async function listarPostUsuario(request: FastifyRequest, reply: FastifyReply) {
    const { id: idString } = z.object({id: z.string()}).parse(request.params)
    const idUsuario = parseInt(idString, 10);

    const posts = await prisma.$queryRaw`SELECT * FROM 'Post' WHERE "id_usuario" = ${idUsuario}`

    return reply.status(200).send(posts)
}