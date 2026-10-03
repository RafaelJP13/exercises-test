interface Venda {
  vendedor: string;
  valor: number;
}

const dados: { vendas: Venda[] } = {
  vendas: [
    { vendedor: "João Silva", valor: 1200.5 },
    { vendedor: "João Silva", valor: 950.75 },
    { vendedor: "João Silva", valor: 1800.0 },
    { vendedor: "João Silva", valor: 1400.3 },
    { vendedor: "João Silva", valor: 1100.9 },
    { vendedor: "João Silva", valor: 1550.0 },
    { vendedor: "João Silva", valor: 1700.8 },
    { vendedor: "João Silva", valor: 250.3 },
    { vendedor: "João Silva", valor: 480.75 },
    { vendedor: "João Silva", valor: 320.4 },

    { vendedor: "Maria Souza", valor: 2100.4 },
    { vendedor: "Maria Souza", valor: 1350.6 },
    { vendedor: "Maria Souza", valor: 950.2 },
    { vendedor: "Maria Souza", valor: 1600.75 },
    { vendedor: "Maria Souza", valor: 1750.0 },
    { vendedor: "Maria Souza", valor: 1450.9 },
    { vendedor: "Maria Souza", valor: 400.5 },
    { vendedor: "Maria Souza", valor: 180.2 },
    { vendedor: "Maria Souza", valor: 90.75 },

    { vendedor: "Carlos Oliveira", valor: 800.5 },
    { vendedor: "Carlos Oliveira", valor: 1200.0 },
    { vendedor: "Carlos Oliveira", valor: 1950.3 },
    { vendedor: "Carlos Oliveira", valor: 1750.8 },
    { vendedor: "Carlos Oliveira", valor: 1300.6 },
    { vendedor: "Carlos Oliveira", valor: 300.4 },
    { vendedor: "Carlos Oliveira", valor: 500.0 },
    { vendedor: "Carlos Oliveira", valor: 125.75 },

    { vendedor: "Ana Lima", valor: 1000.0 },
    { vendedor: "Ana Lima", valor: 1100.5 },
    { vendedor: "Ana Lima", valor: 1250.75 },
    { vendedor: "Ana Lima", valor: 1400.2 },
    { vendedor: "Ana Lima", valor: 1550.9 },
    { vendedor: "Ana Lima", valor: 1650.0 },
    { vendedor: "Ana Lima", valor: 75.3 },
    { vendedor: "Ana Lima", valor: 420.9 },
    { vendedor: "Ana Lima", valor: 315.4 },
  ],
};

// Regra por venda: < 100 => 0% | 100 a < 500 => 1% | >= 500 => 5%
function calcularComissao(valor: number): number {
  if (valor < 100) return 0;
  if (valor < 500) return valor * 0.01;
  return valor * 0.05;
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Soma as comissões sem arredondar e arredonda só o total de cada vendedor
const comissoes = new Map<string, number>();
for (const { vendedor, valor } of dados.vendas) {
  comissoes.set(vendedor, (comissoes.get(vendedor) ?? 0) + calcularComissao(valor));
}

for (const [vendedor, total] of comissoes) {
  console.log(`${vendedor.padEnd(18)} ${brl(Math.round(total * 100) / 100)}`);
}
