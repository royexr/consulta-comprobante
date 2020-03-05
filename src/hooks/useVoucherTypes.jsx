// Dependencies
import { useState, useEffect } from 'react';
import api from '../utils/api';

const useVoucherTypes = () => {
  const [voucherTypes, setVoucherTypes] = useState([]);

  const fetchVoucherTypes = async () => {
    const { data } = await api.VoucherTypes.GetAll();
    const formatted = data.map((vt) => ({
      value: vt.Cod_TipoComprobante,
      label: vt.Nom_TipoComprobante,
    }));
    setVoucherTypes(formatted);
  };

  useEffect(() => {
    fetchVoucherTypes();
  }, []);

  return { voucherTypes };
};

export default useVoucherTypes;
