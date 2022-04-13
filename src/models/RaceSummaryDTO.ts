export interface SeatDTO {
  code: string;
  name: string;
  type: string;
}

export interface RaceSummaryDTO {
  seats: SeatDTO[];
}
