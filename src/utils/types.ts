

export interface TableData {
  id?: number;
  [key: string]: string | number | undefined;
}

interface Obj {
  [key: string]: string | undefined
}
export interface GeneralData {
  [key: string]: string | undefined | Obj;
}