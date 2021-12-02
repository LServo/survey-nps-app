import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/**
 * Route Params => Parâmetros que compõem a rote
 * Query Params => Parâmetros opcionais, para busca e paginação por exemplo
 * Funcionam no formato key=value
 */

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params
    const { u } = request.query

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveysUsersRepository.findOne({
      id: String(u)
    })

    if (!surveysUsers) {
      throw new AppError('Survey does not exists')
    }

    surveysUsers.value = Number(value)

    await surveysUsersRepository.save(surveysUsers)

    return response.json(surveysUsers)
  }
}

export { AnswerController }