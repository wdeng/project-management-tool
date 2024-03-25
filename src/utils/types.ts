

export interface TableData {
  id?: number;
  [key: string]: string | number | undefined;
}

export interface GeneralData {
  [key: string]: string | undefined | any;
}