import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';

@Module({
  controllers: [UserUsersController],
  providers: [UsersAppService],
})
export class UsersModule {}
