// Dependencies
import { useState, useEffect } from 'react';
import api from '../utils/api';

const useVoucherTypes = () => {
  const [voucherTypes, setVoucherTypes] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchVoucherTypes = async () => {
      const { data } = await api.VoucherTypes.GetAll(controller.signal);
      if (!controller.signal.aborted) {
        const formatted = data.map((vt) => ({
          value: vt.Cod_TipoComprobante,
          label: vt.Nom_TipoComprobante,
        }));
        setVoucherTypes(formatted);
      }
    };

    fetchVoucherTypes();
    return () => {
      controller.abort();
    };
  }, []);

  return { voucherTypes };
};

export default useVoucherTypes;
