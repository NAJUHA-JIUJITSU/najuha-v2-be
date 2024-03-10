import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infra/database/entities/user.entity';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersService } from 'src/modules/users/application/users.service';
import { UsersRepository } from '../../infra/database/repositories/users.repository';

@Module({
  // imports: [TypeOrmModule.forFeature([UserEntity])],
  imports: [],
  controllers: [UserUsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
