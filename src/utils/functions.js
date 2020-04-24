function currentMonthRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { firstDay, lastDay };
}

function createGetQuery(bookCode, companyCode, values) {
  const aux = { ...values };
  let query = `bookCode=${bookCode}&companyCode=${companyCode}`;
  const vKeys = Object.keys(aux);
  for (let i = 0; i < vKeys.length; i += 1) {
    const key = vKeys[i];
    switch (key) {
      case 'clientDoc':
        if (aux[key] !== '' && aux[key] !== null) {
          const auxArray = aux[key].split('-');
          query = query.concat(`&${key}=${auxArray[0]}`);
        }
        break;
      default:
        if (aux[key] !== '' && aux[key] !== null) {
          query = query.concat(`&${key}=${aux[key]}`);
        }
        break;
    }
  }
  return query;
}

function objectToQuery(object) {
  const aux = { ...object };
  let query = '';
  const auxKeys = Object.keys(aux);
  for (let i = 0; i < auxKeys.length; i += 1) {
    const key = auxKeys[i];
    query = query.concat(`${key}=${aux[key]}`);
    if (i < auxKeys.length - 1) {
      query = query.concat('&');
    }
  }

  return query;
}

export { createGetQuery, currentMonthRange, objectToQuery };
