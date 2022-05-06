export interface TicketBase{
  name: string,
  lastName: string,
  tithe: number,
  offering: number,
  treasurer: string | number
}
export interface Ticket extends TicketBase{
  id: number,
  status: number,
  createdAt: string,
  updatedAt: string,
  headquarter: string | number,
  country: string
}
