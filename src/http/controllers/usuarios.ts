import { FastifyReply, FastifyRequest } from "fastify"
import {string, z} from "zod"
import {prisma} from "@/src/lib/prisma"
import { compare, hash } from "bcryptjs"

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

    if (id !== Number(request.user.sub)) {
        return reply.status(403).send("Não é permitido apagar outros usuários")
    }

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

export async function entrar(request: FastifyRequest, reply: FastifyReply) {
    const loginSchema = z.object({
        email: z.string().email(),
        senha: z.string()
    })
    const { email, senha } = loginSchema.parse(request.body)
    
    const usuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    })
    // const usuario = await prisma.$executeRaw`SELECT * FROM 'Usuario' WHERE "email" = ${email}`
    if (!usuario) {
        return reply.status(404).send("Usuário não encontrado")
    }

    const senhasIguais = await compare(senha, usuario.senha)
    if (!senhasIguais) {
        return reply.status(401).send("Senha incorreta")
    }

    const token = await reply.jwtSign({}, {
        sign: {
            sub: String(usuario.id)
        }
    })

    const refreshToken = await reply.jwtSign({}, {
        sign: {
             sub: String(usuario.id),
             expiresIn: '7d'
        }
   })

    return reply.status(200).send({ token })
}

export async function mostrarPerfil(request: FastifyRequest, reply: FastifyReply) {
    const usuario = await prisma.usuario.findFirst({
        where: {
            id: Number(request.user.sub)
        }
    })

    return reply.status(200).send({
        usuario: {
            ...usuario,
            senha: undefined
        }
    })
}