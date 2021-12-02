import { EntityRepository, Repository } from "typeorm";
import { SurveysUser } from "../models/SurveyUser";

@EntityRepository(SurveysUser)
class SurveysUsersRepository extends Repository<SurveysUser> {
  
}

export { SurveysUsersRepository }