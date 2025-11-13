// components/Charts/GraficoBarrasCategorias.tsx
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface CategoriaComparativo {
  category: string;
  current: number;
  previous: number;
}

interface GraficoBarrasCategoriasProps {
  data: CategoriaComparativo[];
}

const GraficoBarrasCategorias: React.FC<GraficoBarrasCategoriasProps> = ({
  data,
}) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-sm text-text-muted">
        <p>Sem dados suficientes para comparação entre meses.</p>
        <p className="text-xs mt-1">
          Quando houver gastos em dois meses diferentes, a comparação aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(v) => formatCurrency(Number(v))} />
          <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
          <Legend />
          <Bar dataKey="current" name="Mês atual" fill="#4CAF78" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="previous"
            name="Mês anterior"
            fill="#0EA5E9"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarrasCategorias;