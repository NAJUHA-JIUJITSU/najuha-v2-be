import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  //   /**
  //    * u-3-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
  //    * - RoleLevel: USER
  //    *
  //    * @tag u-3 users
  //    * @returns created user info
  //    */
  //   @RoleLevels(RoleLevel.USER)
  //   @TypedRoute.Post('/')
  //   async postUser(@TypedBody() dto: CreateUserReqDto): Promise<ResponseForm<UserEntity>> {
  //     const user = await this. UsersAppService.createUser(dto);
  //     return createResponseForm(user);
  //   }
}
