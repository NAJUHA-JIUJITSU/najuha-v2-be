import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserTable } from '../../infrastructure/database/tables/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTable])],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserRepository],
})
export class UsersModule {}
