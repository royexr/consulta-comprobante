// Dependencies
import React from 'react';

// Resources
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const lineStylesData = {
    labels: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    datasets: [
      {
        label: 'Compras',
        data: [65, 59, 80, 81, 56, 55, 40, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 153, 153, 0.5)',
      },
      {
        label: 'Ventas',
        data: [28, 48, 40, 19, 86, 27, 90, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: '#0000ff',
        backgroundColor: 'rgba(153, 153, 255, 0.5)',
      },
    ],
  };

  return (
    <>
      <div className="jumbotron p-col-12">
        <div className="p-grid p-dir-row">
          <hgroup className="heading p-col-12 p-col-align-center">
            <h1 className="title title--centered">Dashboard</h1>
          </hgroup>
          <div className="actions p-col-12 p-md-4 p-col-align-center">
            <div className="p-grid p-dir-col p-nogutter">
              <div className="m-bottom-15 p-col-6 p-col-align-center">
                <Link to="/purchases">Compras</Link>
              </div>
              <div className="m-bottom-15 p-col-6 p-col-align-center">
                <Link to="/invoices">Ventas</Link>
              </div>
              <div className="m-bottom-15 p-col-6 p-col-align-center">
                <Link to="/configuration">Configuración</Link>
              </div>
            </div>
          </div>
          <div className="chart p-col-12 p-md-8 p-col-align-center">
            <Chart type="line" data={lineStylesData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
