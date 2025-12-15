export interface NotaFiscalDashboardItem {
  id: string;

  ordemServico: string;
  numeroNF: string;
  dataNF: string;

  tipoDeVenda: string;

  valorNF: string; // formatado "1.234,56"
  valorNFFloat: number; // para cálculo

  numOSFranquia?: string;
  numNFFranquia?: string;
  valorFranquia?: string;

  dealerCode: string;
  pecas: {
    id: string;
    codigo: string;
    valor: string;
    valorFloat: number;
  }[];
}

export interface DashboardData {
  items: NotaFiscalDashboardItem[];
  totalValue: number;
  averageValue: number;
  count: number;
}

export interface NotaFiscalDB {
  id: string;
  ordem_servico: string;
  numero_nf: string;
  data_nf: string;
  valor_nf: number;
  tipo_de_venda: string;
  num_os_franquia: string | null;
  num_nf_franquia: string | null;
  valor_franquia: number | null;
  dealer_code: string;

  nf_pecas?: {
    id: string;
    codigo: string;
    valor: number;
  }[];
}
