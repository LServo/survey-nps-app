import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {
  const defaulOptions = await getConnectionOptions() // com isso teremos todas as configurações dentro do ormconfig.json

  return createConnection(
    Object.assign(defaulOptions, {
      database: 
       process.env.NODE_ENV === 'test' 
        ? './src/database/database.test.sqlite' 
        : defaulOptions.database
    })
  )
}