// Resources
import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import api from '../../../utils/api';

const Users = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [isDeleting, setDeleting] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showMessages, renderMessages] = useMessages();

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      const res = await api.User.GetAllWithCompanies(controller.signal);
      if (!(res instanceof TypeError) && !controller.signal.aborted) {
        const formatted = res.data.map((u) => {
          const aux = { ...u };
          const { _id } = u;
          aux.email = _id.email;
          aux.status = 'CORRECTO';
          aux.socialReasons = '';
          aux.tradenames = '';
          if (aux.companies !== undefined && aux.companies.length > 0) {
            const disabledC = aux.companies.filter((c) => c.isEnabled === false);
            if (disabledC.length > 0) {
              aux.status = 'PENDIENTE';
            }
          }
          if (aux.companiesInfo !== undefined && aux.companiesInfo.length > 0) {
            for (let i = 0; i < aux.companiesInfo.length; i += 1) {
              const companyInfo = aux.companiesInfo[i];
              aux.socialReasons = aux.socialReasons.concat(companyInfo.RazonSocial);
              aux.tradenames = aux.tradenames.concat(companyInfo.Nom_Comercial);
              if (i < aux.companiesInfo.length - 1) {
                aux.socialReasons = aux.socialReasons.concat(', ');
                aux.tradenames = aux.tradenames.concat(', ');
              }
            }
          }
          if (aux.entitiesInfo !== undefined && aux.entitiesInfo.length > 0) {
            aux.tradenames = aux.tradenames.concat(aux.entitiesInfo[0].Nom_Cliente);
          }
          return aux;
        });
        setUsers(formatted);
      }
    };

    fetchUsers();
    return () => {
      controller.abort();
    };
  }, []);

  const deleteUser = async (rowData) => {
    setDeleting(true);
    const res = await api.User.Delete(rowData.email);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      setDeleting(false);
    } else {
      switch (res.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se elimino el usuario');
          setUsers(users.filter((u) => u.email !== rowData.email));
          setDeleting(false);
          break;
        default:
          showMessages('error', 'Error!', 'No se ah podido eliminar al usuario');
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
          history.push(`${path}/edit/${rowData.email}`);
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
        onClick={() => { deleteUser(rowData); }}
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
          label="Agregar usuario"
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
        users.length > 0 && (
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
            value={users}
          >
            <Column
              field="email"
              header="Correo electronico"
            />
            <Column
              field="name"
              header="Nombre"
            />
            <Column
              body={(rowData) => (
                rowData.status === 'PENDIENTE'
                  ? <span className="badge badge--warn">PENDIENTE</span>
                  : <span className="badge badge--success">CORRECTO</span>
              )}
              field="status"
              header="Estado"
              style={{ textAlign: 'center' }}
            />
            <Column
              header="Razones sociales"
              field="socialReasons"
            />
            <Column
              header="Nombres comerciales"
              field="tradenames"
            />
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

export default Users;
