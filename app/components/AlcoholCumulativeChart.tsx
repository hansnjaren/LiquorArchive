import { Bar } from "react-chartjs-2";

export default function AlcoholCumulativeChart({
  labels,
  dailyByUnit,
  unit,
  loading = false,
}: {
  labels: string[];
  dailyByUnit: number[];
  unit: { name: string; label: string };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: `일별 섭취량 (${unit.name})`,
        data: dailyByUnit.map((v) => +v.toFixed(2)),
        backgroundColor: "rgba(37,99,235,0.6)",
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 핵심
    layout: { padding: 0 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `섭취량: ${ctx.parsed.y.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} ${unit.label}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "일" },
        ticks: {
          maxTicksLimit: 31,
        },
      },
      y: {
        title: { display: true, text: unit.label },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}
