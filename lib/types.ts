export type Destination = {
  id: number
  nickname: string
  warehouse: string
  destinationType: "SNOWFLAKE" | "REDSHIFT" | "PROVISIONED_S3"
  status: "REACHABLE" | "UNREACHABLE"
}

export type View = {
  id: number
  sourceId: number
  tableName: string
  columns: {
    id: number
    name: string
    dataType: string
    isPrimaryKey: boolean
    isLastModified: boolean
    isTenantColumn: boolean
  }[]
}

export type Source = {
  id: number
  nickname: string
  status: "REACHABLE" | "UNREACHABLE"
  sourceType:
    | "POSTGRES"
    | "MYSQL"
    | "MARIADB"
    | "COCKROACHDB"
    | "REDSHIFT"
    | "SNOWFLAKE"
    | "BIGQUERY"
    | "MSSQL"
  schema: string
  database: string
}
