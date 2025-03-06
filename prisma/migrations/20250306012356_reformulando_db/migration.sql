-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conteudo" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "Post_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "criado_em" DATETIME NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,
    CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comentario_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Like" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "criado_em" DATETIME NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_comentario" INTEGER NOT NULL,
    CONSTRAINT "Like_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "Comentario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
