
export interface TicketBase{
  id?: number,
  status?: number,
  name: string,
  lastName: string,
  description?: string,
  amount: number,
  type: string,
  digital: number,
  treasurer: string | number
}
export interface Ticket extends TicketBase{
  createdAt: string,
  updatedAt: string,
  headquarter: string | number,
  country: string
}

export interface CashClosingAmounts{
  totalIngress: number;
  headquarterTreasure: number;
  headquarterTithe: number;
  headquarterGain: number;
  pastorService: number;
  pastorTithe: number;
  pastorGain: number;
}

export interface CashClosingInfo{
  cashClosingAmounts: CashClosingAmounts;
  cashClosingTickets: TicketBase[];
}

export interface Report extends CashClosingAmounts{
  id?: number;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tickets: number[];
  treasurer: number | string;
  headquarter: number | string;
}

