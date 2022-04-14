export interface BusTicketDTO {
  id: string;
  status: string;
}

export interface BusOrderDTO {
  created: Date;
  id: number;
  status: string;
  tickets: BusTicketDTO[];
}
