// components/Charts/GraficoLinhaEvolucao.tsx
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface EvolucaoDia {
  dateLabel: string; // ex: 10/11
  income: number;
  expense: number;
}

interface GraficoLinhaEvolucaoProps {
  data: EvolucaoDia[];
}

const GraficoLinhaEvolucao: React.FC<GraficoLinhaEvolucaoProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-sm text-text-muted">
        <p>Sem movimentações suficientes para montar a linha do tempo.</p>
        <p className="text-xs mt-1">
          Assim que houver transações em dias diferentes, a evolução aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="dateLabel" />
          <YAxis tickFormatter={(v) => formatCurrency(Number(v))} />
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Dia: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Entradas"
            stroke="#22C55E"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Saídas"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoLinhaEvolucao;