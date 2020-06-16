// Dependencies
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Resources
import { Chart } from 'primereact/chart';
import api from '../../utils/api';
import months from '../../utils/months';

const Dashboard = ({ currentCompany }) => {
  const [labels, setLabels] = useState([]);
  const [salesT, setSalesT] = useState([]);
  const [purchasesT, setPurchasesT] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async (cc) => {
      if (cc !== undefined && cc.length > 0) {
        const res = await api.Voucher.ReadReport(cc, controller.signal);
        if (!(res instanceof TypeError) && !controller.signal.aborted) {
          const sales = []; const purchases = []; const rLabels = [];
          for (let i = 0; i < 12; i += 1) {
            const aux = res.data.filter((ri) => new Date(ri.date).getUTCMonth() === i);
            if (aux.length === 1) {
              sales.push(aux[0].sales);
              purchases.push(aux[0].purchases);
            } else {
              sales.push(0);
              purchases.push(0);
            }
            rLabels.push(`${months[i]} - ${new Date(Date.now()).getFullYear()}`);
          }
          setLabels(rLabels);
          setSalesT(sales);
          setPurchasesT(purchases);
        }
      }
    };

    fetchData(currentCompany);
    return () => {
      controller.abort();
    };
  }, [currentCompany]);

  const lineStylesData = {
    responsive: true,
    labels,
    datasets: [
      {
        label: 'Compras',
        data: purchasesT,
        fill: false,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 153, 153, 0.5)',
      },
      {
        label: 'Ventas',
        data: salesT,
        fill: false,
        borderColor: '#0000ff',
        backgroundColor: 'rgba(153, 153, 255, 0.5)',
      },
    ],
  };

  return (
    <>
      <div className="jumbotron p-col-12">
        <div className="p-grid p-dir-col">
          <hgroup className="heading p-col-12 p-col-align-center">
            <h1 className="title text--center">Escritorio</h1>
          </hgroup>
          <div className="chart p-col-12 p-lg-10 p-col-align-center">
            <Chart type="line" data={lineStylesData} />
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  currentCompany: PropTypes.string.isRequired,
};

export default Dashboard;
