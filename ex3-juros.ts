const TAXA_DIARIA = 0.025; // 2,5% ao dia (juros simples)
const MS_DIA = 24 * 60 * 60 * 1000;

// Aceita "YYYY-MM-DD" ou "DD/MM/YYYY"
function parseData(texto: string): Date {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  const [a, m, d] = iso
    ? [iso[1], iso[2], iso[3]]
    : br
      ? [br[3], br[2], br[1]]
      : [];
  if (!a) throw new Error(`Data inválida: "${texto}" (use YYYY-MM-DD ou DD/MM/YYYY)`);
  return new Date(Date.UTC(Number(a), Number(m) - 1, Number(d)));
}

function hojeUTC(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

function calcularJuros(valor: number, vencimento: Date, hoje = hojeUTC()) {
  const diasAtraso = Math.max(0, Math.round((hoje.getTime() - vencimento.getTime()) / MS_DIA));
  const juros = Math.round(valor * TAXA_DIARIA * diasAtraso * 100) / 100;
  return { diasAtraso, juros, total: Math.round((valor + juros) * 100) / 100 };
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const [valorArg, dataArg] = process.argv.slice(2);
if (!valorArg || !dataArg) {
  console.log("Uso: npx tsx ex3-juros.ts <valor> <vencimento>");
  console.log("Ex.: npx tsx ex3-juros.ts 1000 2026-09-20");
  process.exit(1);
}

const valor = Number(valorArg.replace(",", "."));
if (!Number.isFinite(valor) || valor <= 0) throw new Error("Valor inválido.");

const { diasAtraso, juros, total } = calcularJuros(valor, parseData(dataArg));

console.log(`Valor original: ${brl(valor)}`);
console.log(`Dias em atraso: ${diasAtraso}`);
console.log(`Juros (2,5% ao dia): ${brl(juros)}`);
console.log(`Total a pagar: ${brl(total)}`);
