export type Destination = {
  id: number
  nickname: string
  destinationType: string
}

export type View = {
  id: number
  sourceId: number
  tableName: string
  columns: {
    id: number
    name: string
    dataType: string
  }[]
}

export type Source = {
  id: number
  nickname: string
  status: string
  sourceType: string
  schema: string
  database: string
}
