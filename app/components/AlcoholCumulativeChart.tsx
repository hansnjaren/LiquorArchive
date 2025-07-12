import { Line } from "react-chartjs-2";

export default function AlcoholCumulativeChart({
  daysInMonth,
  cumulativeByUnit,
  unit,
}: {
  daysInMonth: number;
  cumulativeByUnit: number[];
  unit: { name: string; label: string };
}) {
  const chartData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: `누적 섭취량 (${unit.name})`,
        data: cumulativeByUnit.map((v) => +v.toFixed(2)),
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        tension: 0,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `누적: ${context.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit.label}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "일" } },
      y: { title: { display: true, text: unit.label }, beginAtZero: true },
    },
  };

  return <Line data={chartData} options={chartOptions} height={220} />;
}
