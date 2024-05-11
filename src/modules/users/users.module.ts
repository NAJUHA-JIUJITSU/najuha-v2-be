import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { UserFactory } from './domain/user.factory';
import { DatabaseModule } from 'src//database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserFactory],
})
export class UsersModule {}
