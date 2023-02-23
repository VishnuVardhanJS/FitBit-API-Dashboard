import React, { useState, useEffect } from 'react';
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
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};



function Chart() {

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const [Sleep, setSleep] = useState({});

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];



  useEffect(() => {
    fetch(`http://localhost:5000/sleep`).then(
      response => response.json()
    ).then(data => setSleep(data))

  }, []);

  // console.log(Sleep["sleep"][0])

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return <Line options={options} data={data} />;
}


export default Chart;