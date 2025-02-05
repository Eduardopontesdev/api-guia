import express, { json } from "express";
import cors from 'cors';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000; // Usa a porta definida no ambiente ou 3000 como fallback

app.use(express.json());
app.use(cors());

app.post("/contatos", async (req, res) => {
  try {
    await prisma.contatos.create({
      data: {
        nome: req.body.nome,
        telefone: req.body.telefone,
        categoria: req.body.categoria,
        redesSociais: req.body.redesSociais || {},
        premium: req.body.premium || false,
        premiumUntil: req.body.premiumUntil || null,
      },
    });
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar contato" });
  }
});

app.put("/contatos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Converte o ID para número
    await prisma.contatos.update({
      where: {
        id: id,
      },
      data: {
        nome: req.body.nome,
        telefone: req.body.telefone,
        categoria: req.body.categoria,
        redesSociais: req.body.redesSociais || {},
        premium: req.body.premium,
        premiumUntil: req.body.premiumUntil,
      },
    });
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar contato" });
  }
});

app.delete('/contatos/:id', async (req, res) => {
  try {
    await prisma.contatos.delete({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar contato" });
  }
});

app.get("/contatos", async (req, res) => {
  try {
    let contatos = [];
    if (req.query.nome || req.query.telefone || req.query.categoria) {
      contatos = await prisma.contatos.findMany({
        where: {
          nome: req.query.nome,
          telefone: req.query.telefone,
          categoria: req.query.categoria
        }
      });
    } else {
      contatos = await prisma.contatos.findMany();
    }
    res.status(200).json(contatos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar contatos" });
  }
});


app.get("/categorias", async (req, res) => {
  try {
    const categorias = await prisma.contatos.findMany({
      select: {
        categoria: true,
      },
      orderBy: {
        categoria: 'asc',
      },
    });

    const categoriasUnicas = [...new Set(
      categorias
        .map((item) => item.categoria)
        .filter((categoria) => categoria !== null && categoria !== undefined)
    )];

    res.status(200).json(categoriasUnicas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

app.get('/', (req, res) => {
  res.json('Bem vindos a api guia Camocim!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});