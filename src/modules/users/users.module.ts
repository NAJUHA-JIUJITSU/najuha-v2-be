import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { UserEntityFactory } from './domain/user-entity.factory';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserEntityFactory],
})
export class UsersModule {}
