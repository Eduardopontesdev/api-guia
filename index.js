import express, { json } from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use(cors())

const port = process.env.PORT || 9001;

app.post("/contatos", async (req, res) => {
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
});

app.put("/contatos/:id", async (req, res) => {
  await prisma.contatos.update({
    where: {
      id: req.params.id,
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
});

app.delete('/contatos/:id', async (req, res) => {

  await prisma.contatos.delete({
    where: {
      id: req.params.id
    }

    
  })
  res.status(200).json({ Message: "Usuário deletado com sucesso!"});
})

app.get("/contatos", async (req, res) => {

let contatos = []

if(req.query) {
contatos = await prisma.contatos.findMany({
  where: {
    nome: req.query.nome,
    telefone: req.query.telefone,
    categoria: req.query.categoria
  }
})
} else {

  const contatos = await prisma.contatos.findMany();
}
  res.status(200).json(contatos);
});

app.get("/categorias", async (req, res) => {

  const categorias = await prisma.contatos.findMany({
    select: {
      categoria: true,
    },
    orderBy: {
      categoria: 'asc', // Ordena as categorias em ordem alfabética
    },
  });
  

  // Extrai apenas os valores das categorias, filtra valores nulos ou undefined e remove duplicatas
  const categoriasUnicas = [...new Set(
    categorias
      .map((item) => item.categoria) // Extrai o campo categoria
      .filter((categoria) => categoria !== null && categoria !== undefined) // Filtra valores inválidos
  )];
  
  res.status(200).json(categoriasUnicas);
  });

  app.get("/", (req, res) => {
    return res.json({ Message: "Bem vindos a api guia Camocim!"})
  })

app.listen(port);
