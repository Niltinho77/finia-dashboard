// components/Charts/GraficoPizzaGastos.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface CategoriaGasto {
  category: string;
  amount: number;
  // isto atende o tipo que o Recharts espera (ChartDataInput)
  [key: string]: string | number;
}

interface GraficoPizzaGastosProps {
  data: CategoriaGasto[];
}

const COLORS = ["#4CAF78", "#22C55E", "#0EA5E9", "#F59E0B", "#EF4444", "#8B5CF6"];

const GraficoPizzaGastos: React.FC<GraficoPizzaGastosProps> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.amount, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-sm text-text-muted">
        <p>Sem dados de gastos para exibir o gráfico.</p>
        <p className="text-xs mt-1">
          Registre algumas transações de saída para ver a distribuição por categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Categoria: ${label}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoPizzaGastos;