// Dependencies
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Resources
import { Chart } from 'primereact/chart';
import api from '../../utils/api';
import months from '../../utils/months';

const Dashboard = ({ currentCompany }) => {
  const [labels, setLabels] = useState([]);
  const [salesT, setSalesT] = useState([]);
  const [purchasesT, setPurchasesT] = useState([]);

  const fetchData = async (cc) => {
    if (cc !== undefined && cc.length > 0) {
      const report = (await api.Voucher.ReadReport(cc)).data;
      const sales = []; const purchases = [];
      for (let i = 0; i < report.length; i += 1) {
        const e = report[i];
        sales.push(e.sales);
        purchases.push(e.purchases);
      }
      const rLabels = report.map((item) => (
        `${months[item._id.month - 1]} - ${item._id.year}`
      ));
      setLabels(rLabels.reverse());
      setSalesT(sales.reverse());
      setPurchasesT(purchases.reverse());
    }
  };

  useEffect(() => {
    fetchData(currentCompany);
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
        <div className="p-grid p-dir-row">
          <hgroup className="heading p-col-12 p-col-align-center">
            <h1 className="title title--centered">Escritorio</h1>
          </hgroup>
          {/* <div className="actions p-col-12 p-md-4 p-col-align-center">
            <div className="p-grid p-dir-col p-nogutter">
              <div className="mb-15 p-col-6 p-col-align-center">
                <Link to="/purchases">Compras</Link>
              </div>
              <div className="mb-15 p-col-6 p-col-align-center">
                <Link to="/sales">Ventas</Link>
              </div>
              <div className="mb-15 p-col-6 p-col-align-center">
                <Link to="/configuration">Configuración</Link>
              </div>
            </div>
          </div> */}
          <div className="chart p-col-12 p-col-align-center">
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
