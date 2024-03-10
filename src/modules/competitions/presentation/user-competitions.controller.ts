import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infra/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsService } from '../application/competitions.service';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  //   /**
  //    * u-3-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
  //    * - RoleLevel: USER
  //    *
  //    * @tag u-3 users
  //    * @returns created user info
  //    */
  //   @RoleLevels(RoleLevel.USER)
  //   @TypedRoute.Post('/')
  //   async postUser(@TypedBody() dto: CreateUserDto): Promise<ResponseForm<UserEntity>> {
  //     const user = await this.usersService.createUser(dto);
  //     return createResponseForm(user);
  //   }
}
