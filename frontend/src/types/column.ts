export type CardData = {
  Id: string;
  Content: string;
  ColumnId: string;
}

export type ColumnData = {
  Id: string;
  Name: string;
  Cards: CardData[];
}

