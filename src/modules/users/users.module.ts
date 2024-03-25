import { Module } from '@nestjs/common';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserUsersController],
  providers: [UsersAppService, UserRepository],
})
export class UsersModule {}
