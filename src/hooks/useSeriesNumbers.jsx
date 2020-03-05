// Dependencies
import { useState, useEffect } from 'react';
import api from '../utils/api';

const useSeriesNumbers = (currentCompany, bookCode) => {
  const [seriesNumbers, setSeriesNumbers] = useState([]);

  const fetchSeriesNumbers = async (cc, bc) => {
    if (cc !== undefined && cc.length > 0) {
      const { data } = await api.Voucher.GetSeriesNumbers(cc, bc);
      const formatted = data.seriesNumbers.map((sn) => ({
        value: `${sn.serie}-${sn.number}`,
        label: `${sn.serie}-${sn.number}`,
      }));
      setSeriesNumbers(formatted);
    }
  };

  useEffect(() => {
    fetchSeriesNumbers(currentCompany, bookCode);
  }, [currentCompany, bookCode]);

  return { seriesNumbers };
};

export default useSeriesNumbers;
