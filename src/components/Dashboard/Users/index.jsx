// Resources
import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import api from '../../../utils/api';

const Users = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [isDeleting, setDeleting] = useState(false);
  const [showMessages, renderMessages] = useMessages();

  const fetchUsers = async () => {
    const { data } = await api.User.GetAll();
    const formatted = data.map((u) => {
      const aux = { ...u };
      const { _id } = u;
      aux.email = _id.email;
      return aux;
    });
    setUsers(formatted);
  };

  useEffect(() => {
    fetchUsers();
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
          showMessages('success', 'Muy bien!', 'Se borro el usuario');
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
            rows={5}
            rowClassName={() => ({ 'table-row': true })}
            rowsPerPageOptions={[5, 10, 15]}
            paginator
            responsive
            removableSort
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
              style={{ width: '30%' }}
            />
            <Column
              field="cellphone"
              header="Telefono"
            />
            <Column
              body={(rowData) => {
                switch (rowData.type) {
                  case 1:
                    return 'Cliente';
                  case 2:
                    return 'Admin';
                  default:
                    return 'SAdmin';
                }
              }}
              header="Tipo"
              style={{ width: '10%' }}
            />
            <Column
              body={actionTemplate}
              header="Acciones"
              style={{ width: '12%' }}
            />
          </DataTable>
        )
      }
    </div>
  );
};

export default Users;
