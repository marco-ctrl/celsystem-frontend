// src/chartjs-config.ts
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, ArcElement, PieController } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
);