import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

type TipoMovimentacao = "ENTRADA" | "SAIDA";

interface Movimentacao {
  id: number;
  codigoProduto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  descricao: string;
  estoqueFinal: number;
}

const dados: { estoque: Produto[] } = {
  estoque: [
    { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
    { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 },
    { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
    { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
    { codigoProduto: 105, descricaoProduto: "Marcador de Texto Amarelo", estoque: 90 },
  ],
};

const produtos = new Map(dados.estoque.map((p) => [p.codigoProduto, p]));
const historico: Movimentacao[] = [];
let proximoId = 1;

function movimentar(
  codigoProduto: number,
  tipo: TipoMovimentacao,
  quantidade: number,
  descricao: string
): Movimentacao {
  const produto = produtos.get(codigoProduto);
  if (!produto) throw new Error(`Produto ${codigoProduto} não encontrado.`);
  if (!Number.isInteger(quantidade) || quantidade <= 0)
    throw new Error("Quantidade deve ser um inteiro positivo.");
  if (!descricao.trim()) throw new Error("Informe uma descrição da movimentação.");
  if (tipo === "SAIDA" && quantidade > produto.estoque)
    throw new Error(
      `Estoque insuficiente de "${produto.descricaoProduto}": disponível ${produto.estoque}.`
    );

  produto.estoque += tipo === "ENTRADA" ? quantidade : -quantidade;

  const mov: Movimentacao = {
    id: proximoId++,
    codigoProduto,
    tipo,
    quantidade,
    descricao: descricao.trim(),
    estoqueFinal: produto.estoque,
  };
  historico.push(mov);
  return mov;
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log("Produtos:");
  for (const p of produtos.values())
    console.log(`  ${p.codigoProduto} - ${p.descricaoProduto} (estoque: ${p.estoque})`);

  while (true) {
    console.log("\n--- Nova movimentação (Enter no código para sair) ---");
    const cod = (await rl.question("Código do produto: ")).trim();
    if (!cod) break;

    const tipoRaw = (await rl.question("Tipo [E]ntrada / [S]aída: ")).trim().toUpperCase();
    const tipo: TipoMovimentacao | null =
      tipoRaw.startsWith("E") ? "ENTRADA" : tipoRaw.startsWith("S") ? "SAIDA" : null;
    if (!tipo) {
      console.log("Tipo inválido.");
      continue;
    }

    const qtd = Number(await rl.question("Quantidade: "));
    const desc = await rl.question("Descrição (ex: Compra, Venda, Devolução, Perda): ");

    try {
      const m = movimentar(Number(cod), tipo, qtd, desc);
      const p = produtos.get(m.codigoProduto)!;
      console.log(
        `\nMovimentação #${m.id} (${m.tipo} - ${m.descricao}) registrada.\n` +
          `Estoque final de "${p.descricaoProduto}": ${m.estoqueFinal}`
      );
    } catch (e) {
      console.log(`Erro: ${(e as Error).message}`);
    }
  }

  rl.close();
  console.log("\nHistórico:");
  console.table(historico);
}

main();
