const invoicesFields = {
  FechaEmision: 'FECHA DE EMISIÓN',
  FechaVencimiento: 'FECHA DE VENCIMIENTO',
  Nro_Ticketera: 'TICKET SUNAT',
  Cod_TipoOperacion: 'TIPO',
  Serie: 'SERIE',
  Numero: 'NÚMERO',
  Cod_TipoDoc: 'TIPO DE DOCUMENTO',
  Doc_Cliente: 'NÚMERO DE DOCUMENTO',
  Nom_Cliente: 'RAZON SOCIAL O APELLIDOS Y NOMBRES',
  // Cod_Periodo: 'Periodo',
  // Glosa: 'Glosa',
  // Flag_Anulado: 'Anulado',
  // Flag_Despachado: 'Despachado',
  Impuesto: 'IGV',
  Total: 'TOTAL',
  Cod_Moneda: 'MONEDA',
  // Cod_EstadoComprobante: 'Estado',
};

const voucherCodes = {
  FE: '01',
  BE: '03',
  NCE: '07',
  NDE: '08',
  GRE: '09',
};

const igvTypes = {
  Gravada: '10',
  Exonerada: ['20', '40'],
  Inafecta: '30',
  Gratuita: ['10', '12', '13', '14', '15', '16', '31', '32', '33', '34', '35', '36'],
};

export { igvTypes, invoicesFields, voucherCodes };
