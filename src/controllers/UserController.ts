import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'

class UserController {
  async create(request:Request, response:Response) {
    const { name, email } = request.body

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório!'),
      email: yup.string().required('Email incorreto!')
    })

    // if (!(await schema.isValid(request.body))) {
    //   return response.status(400).json({
    //     error: 'Validation failed'
    //   })
    // }
    
    try {
      await schema.validate(request.body, { abortEarly: false }) // fazemos desta forma ao invés da anterior porque queremos ver todas as mensagens de error
    } catch (err) {
      throw new AppError(err)
      return response.status(400).json({ error: err }) // retorno que nunca acontecerá porque o throw jpa retorna automaticamente!
    }

    const usersRepository = getCustomRepository(UsersRepository)

    // SELECT * FROM users  WHERE email = "email"
    const userAlreadyExists = await usersRepository.findOne({
      email
    })

    if (userAlreadyExists) {
      throw new AppError('User already exists')
    }

    const user = usersRepository.create({
      name, email
    })

    await usersRepository.save(user)

    return response.status(201).json(user)
  }

}

export { UserController }