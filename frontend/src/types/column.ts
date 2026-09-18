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

export type ProjectData = {
  Id: string,
  OwnerId: string,
  Name: string,
  Columns: ColumnData[],
}

export type ColumnForm = {
  cardContent: string,
  columnId: string,
}
