import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Receives darkMode so we can swap chart colours dynamically
const SpeedChart = ({ darkMode }) => {
  const labels = [
    '18:28', '18:30', '18:31', '18:33', '18:35',
    '18:37', '18:39', '18:42', '18:44', '18:46',
    '18:48', '18:50', '18:51', '18:52', '18:53',
  ];

  const lineColor     = darkMode ? '#F97316' : '#EF4444'; // orange in dark, red in light
  const gridColor     = darkMode ? '#1E2D45' : '#F3F4F6';
  const tickColor     = darkMode ? '#94A3B8' : '#9CA3AF';
  const legendColor   = darkMode ? '#94A3B8' : '#6B7280';
  const bgColor       = darkMode ? 'rgba(249,115,22,0.08)' : 'rgba(239,68,68,0.06)';

  const data = {
    labels,
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: [24870, 24650, 24870, 24870, 24650, 24870, 24870, 24650,
               24870, 24870, 24650, 24870, 25010, 24500, 24864],
        borderColor:            lineColor,
        backgroundColor:        bgColor,
        pointBackgroundColor:   lineColor,
        borderWidth:  2,
        tension:      0.15,
        pointRadius:  2.5,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: false,
          boxWidth:  36,
          boxHeight: 3,
          color:     legendColor,
          font: { size: 11 },
          padding: 8,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#161D2E' : '#fff',
        titleColor:      darkMode ? '#fff' : '#1F2937',
        bodyColor:       darkMode ? '#94A3B8' : '#6B7280',
        borderColor:     darkMode ? '#1E2D45' : '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: 24500,
        max: 25100,
        ticks: {
          stepSize: 100,
          color: tickColor,
          font: { size: 10 },
        },
        grid: { color: gridColor },
        border: { color: 'transparent' },
      },
      x: {
        ticks: {
          color: tickColor,
          font: { size: 9 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: gridColor },
        border: { color: 'transparent' },
      },
    },
  };

  return (
    <div className="dashboard-card flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 dark:text-white">ISS Speed Trend</h2>
      <div className="flex-1 w-full relative min-h-[280px]">
        <Line key={darkMode ? 'dark' : 'light'} options={options} data={data} />
      </div>
    </div>
  );
};

export default SpeedChart;
