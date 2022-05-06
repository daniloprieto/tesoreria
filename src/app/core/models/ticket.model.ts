export interface TicketBase{
  id?: number,
  name: string,
  lastName: string,
  amount: number,
  type: string,
  digital: number,
  treasurer: string | number
}
export interface Ticket extends TicketBase{
  status: number,
  createdAt: string,
  updatedAt: string,
  headquarter: string | number,
  country: string
}
