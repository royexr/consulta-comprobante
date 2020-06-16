// Dependencies
import { useState, useEffect } from 'react';

// Resources
import api from '../utils/api';

const useEntities = (currentCompany, bookCode) => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEntities = async (cc, bc) => {
      if (cc !== undefined && cc.length > 0) {
        const { data } = await api.Voucher.GetEntities(cc, bc, controller.signal);
        if (!controller.signal.aborted) {
          if (data !== undefined) {
            const formatted = data.entities.map((entity) => (
              `${entity.docNumber}-${entity.name}`
            ));
            setEntities(formatted);
          }
        }
      }
    };

    fetchEntities(currentCompany, bookCode);
    return function cleanup() {
      controller.abort();
    };
  }, [currentCompany, bookCode]);

  return { entities };
};

export default useEntities;
