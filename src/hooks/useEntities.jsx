// Dependencies
import { useState, useEffect } from 'react';

// Resources
import api from '../utils/api';

const useEntities = (currentCompany, bookCode) => {
  const [entities, setEntities] = useState([]);

  const fetchEntities = async (cc, bc) => {
    if (cc !== undefined && cc.length > 0) {
      const { data } = await api.Voucher.GetEntities(cc, bc);
      const formatted = data.entities.map((entity) => (
        // {
        //   value: entity.docNumber,
        //   label: `${entity.docNumber}-${entity.name}`,
        // }
        `${entity.docNumber}-${entity.name}`
      ));
      setEntities(formatted);
    }
  };

  useEffect(() => {
    fetchEntities(currentCompany, bookCode);
  }, [currentCompany, bookCode]);

  return { entities };
};

export default useEntities;
