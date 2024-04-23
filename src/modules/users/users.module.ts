import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { UserEntityFactory } from './domain/user-entity.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserRepository, UserEntityFactory],
})
export class UsersModule {}
