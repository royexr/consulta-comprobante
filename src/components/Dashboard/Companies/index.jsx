// Resources
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import api from '../../../utils/api';
import { isEmptyObject } from '../../../utils';

const Companies = ({ userToken }) => {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async (uT) => {
    if (!isEmptyObject(uT)) {
      const { data } = await api.User.GetCompanies(uT._id.email);
      const formatted = [];
      for (let i = 0; i < data[0].companies.length; i += 1) {
        const r = data[0].companies[i];
        const aux = data[0].companiesInfo.filter((d) => d.RUC === r.number);
        aux[0].isEnabled = r.isEnabled;
        formatted.push(aux[0]);
      }
      setCompanies(formatted);
    }
  };

  useEffect(() => {
    fetchCompanies(userToken);
  }, [userToken]);

  return (
    <>
      {/* <hgroup className="heading p-col-12 p-col-align-center">
        <h1 className="title">Empresas</h1>
      </hgroup> */}
      {
        companies.length !== 0 && (
          <>
            <DataTable
              alwaysShowPaginator={false}
              className="p-col-12"
              columnResizeMode="fit"
              footer={(
                <div className="p-clearfix">
                  <Button
                    label="Solicitar nueva empresa"
                    icon="pi pi-plus"
                  />
                </div>
              )}
              rows={5}
              rowsPerPageOptions={[5, 10, 15]}
              paginator
              responsive
              removableSort
              sortMode="multiple"
              value={companies}
            >
              <Column field="RUC" header="RUC" />
              <Column field="Nom_Comercial" header="Nombre comercial" />
              <Column field="RazonSocial" header="Razón social" />
              <Column field="Cod_Ubigeo" header="Ubigeo" />
              <Column
                body={(rowData) => (
                  <a
                    href={`http://${rowData.Web}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {rowData.Web}
                  </a>
                )}
                header="Página web"
              />
              <Column
                body={(rowData) => (rowData.isEnabled ? 'SI' : 'NO')}
                header="Habilitado"
              />
            </DataTable>
          </>
        )
      }
    </>
  );
};

Companies.propTypes = {
  userToken: PropTypes.shape({
    _id: PropTypes.object,
    isEnabled: PropTypes.bool,
    password: PropTypes.string,
    type: PropTypes.number,
  }).isRequired,
};

export default Companies;
