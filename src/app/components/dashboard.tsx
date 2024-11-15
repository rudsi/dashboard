'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from "../../dashboard.module.css";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataRow {
  pm2_3: number;
  co: number;
  nh3: number;
  temperature: number;
  humidity: number;
}

interface DashboardProps {
  csvFilePath: string;
}

const Dashboard: React.FC<DashboardProps> = ({ csvFilePath }) => {
  const [data, setData] = useState<DataRow[]>([]);

  useEffect(() => {
    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvData => {
        const parsedData = Papa.parse<DataRow>(csvData, {
          header: true,
          dynamicTyping: true,
        });
        setData(parsedData.data as DataRow[]);
      });
  }, [csvFilePath]);

  if (data.length === 0) return <p>Loading...</p>;

  const getChartData = (label: string, dataset: number[], color: string) => ({
    labels: data.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label,
        data: dataset,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  });

  const pmData = data.map(row => row.pm2_5);
  const coData = data.map(row => row.co);
  const nh3Data = data.map(row => row.nh3);
  const temperatureData = data.map(row => row.temperature);
  const humidityData = data.map(row => row.humidity);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Environmental Data Dashboard</h1>

      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h2>Temperature (°C)</h2>
          <Line data={getChartData("Temperature (°C)", temperatureData, 'rgb(255, 99, 132)')} />
        </div>

        <div className={styles.chartBox}>
          <h2>Humidity (%)</h2>
          <Line data={getChartData("Humidity (%)", humidityData, 'rgb(54, 162, 235)')} />
        </div>

        <div className={styles.chartBox}>
          <h2>PM2.5 (µg/m³)</h2>
          <Line data={getChartData("PM2.5 (µg/m³)", pmData, 'rgb(75, 192, 192)')} />
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h2>CO (ppm)</h2>
          <Line data={getChartData("CO (ppm)", coData, 'rgb(255, 206, 86)')} />
        </div>

        <div className={styles.chartBox}>
          <h2>NH3 (ppm)</h2>
          <Line data={getChartData("NH3 (ppm)", nh3Data, 'rgb(153, 102, 255)')} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
