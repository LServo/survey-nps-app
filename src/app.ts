import 'reflect-metadata' // é importante que seja o primeiro import!
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import  createConnection  from './database' // não precisa especificar o index, porque já é ele o importado por padrão em qualquer diretório seme specificação que seja passado
import { router } from './routes'
import { AppError } from './errors/AppError'

createConnection() // chama a função para reconhecer qual db usar
const app = express()
app.use(express.json()) // precisa ser passado antes do router
app.use(router)

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    message: 'Internal server error'
  })
})

export { app }