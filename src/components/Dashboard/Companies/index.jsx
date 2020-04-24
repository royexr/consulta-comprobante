// Resources
import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import config from '../../../config';

const Companies = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [companies, setCompanies] = useState([]);
  const [isDeleting, setDeleting] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showMessages, renderMessages] = useMessages();

  const fetchCompanies = async () => {
    const { data } = await api.Company.ReadAll();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (rowData) => {
    setDeleting(true);
    const res = await api.Company.Delete(rowData.RUC);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      setDeleting(false);
    } else {
      switch (res.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se elimino la empresa');
          setCompanies(companies.filter((c) => c.RUC !== rowData.RUC));
          setDeleting(false);
          break;
        default:
          showMessages('error', 'Error!', 'No se ah podido eliminar la empresa');
          setDeleting(false);
          break;
      }
    }
  };

  const actionTemplate = (rowData) => (
    <>
      <Button
        className="p-button-rounded"
        disabled={isDeleting}
        icon="pi pi-pencil"
        onClick={() => {
          history.push(`${path}/edit/${rowData.RUC}`);
        }}
        style={{
          fontSize: '10px',
          marginRight: '0.5rem',
        }}
        type="button"
      />
      <Button
        className="p-button-rounded p-button-danger"
        disabled={isDeleting}
        icon="pi pi-trash"
        onClick={() => { deleteCompany(rowData); }}
        style={{
          fontSize: '10px',
        }}
        type="button"
      />
    </>
  );

  const headerTemplate = (
    <div style={{ textAlign: 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }} />
      <InputText
        onInput={(e) => {
          setGlobalFilter(e.target.value);
        }}
        placeholder="Busqueda global"
        size="20"
        type="search"
      />
    </div>
  );

  return (
    <div className="p-grid p-dir-col">
      <div className="p-col-10 p-sm-5 p-md-4 p-lg-3 p-col-align-center">
        <Button
          className="button"
          disabled={isDeleting}
          icon="pi pi-plus"
          label="Agregar Empresa"
          onClick={() => {
            history.push(`${path}/new`);
          }}
        />
      </div>
      {
        isDeleting && (
          <div className="mb-15 p-col-align-center">
            <ProgressSpinner
              strokeWidth="6"
              style={{
                width: '2rem',
                height: '2rem',
              }}
            />
          </div>
        )
      }
      <div className="p-col-12 p-col-align-center">
        {renderMessages()}
      </div>
      {
        companies.length > 0 && (
          <DataTable
            alwaysShowPaginator={false}
            className="p-col-12"
            columnResizeMode="fit"
            emptyMessage="No se encontraron registros"
            globalFilter={globalFilter}
            header={headerTemplate}
            paginator
            removableSort
            responsive
            rows={5}
            rowClassName={() => ({ 'table-row': true })}
            rowsPerPageOptions={[5, 10, 15]}
            sortMode="multiple"
            value={companies}
          >
            <Column field="RUC" header="RUC" style={{ textAlign: 'center' }} />
            <Column field="RazonSocial" header="Razón social" />
            <Column field="Nom_Comercial" header="Nombre comercial" />
            <Column
              body={actionTemplate}
              header="Acciones"
              style={{ width: '12%', textAlign: 'center' }}
            />
          </DataTable>
        )
      }
    </div>
  );
};

export default Companies;
