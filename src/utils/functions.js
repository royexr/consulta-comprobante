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
        if (aux[key] !== '') {
          const auxArray = aux[key].split('-');
          query = query.concat(`&${key}=${auxArray[0]}`);
        }
        break;
      case 'seriesNumbers':
        if (aux[key] !== '') {
          const auxArray = aux[key].split('-');
          query = query.concat(`&serie=${auxArray[0]}`);
          query = query.concat(`&number=${auxArray[1]}`);
        }
        break;
      default:
        if (aux[key] !== '') {
          query = query.concat(`&${key}=${aux[key]}`);
        }
        break;
    }
  }
  return query;
}

export { createGetQuery, currentMonthRange };
