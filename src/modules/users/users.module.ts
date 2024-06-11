import { Module } from '@nestjs/common';
import { UserUsersController } from './presentation/user-users.controller';
import { UsersAppService } from './application/users.app.service';
import { UserFactory } from './domain/user.factory';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserFactory],
})
export class UsersModule {}
