import { Request, Response } from "express";
import { resolve } from 'path'
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body

    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const userAlreadyExists = await usersRepository.findOne({
      email
    })

    if (!userAlreadyExists) {
      throw new AppError('User does not exists')
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id
    })

    if (!surveyAlreadyExists) {
      throw new AppError('Survey does not exists')
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {user_id: userAlreadyExists.id, value: null}, // desta forma é um AND
      // [{user_id: userAlreadyExists.id},{value: null}] => Desta forma seria um OR
      relations: [
        'user',
        'survey'
      ]
    })

    const variables = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id
      await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists)
    }

    // Salvar informações na tabela surveys_users
    const surveysUsers = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    })
    
    await surveysUsersRepository.save(surveysUsers)
    variables.id = surveysUsers.id

    await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)

    return response.json(surveysUsers)
  }
}

export { SendMailController }