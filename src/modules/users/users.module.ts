import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { UserRepository } from '../../infrastructure/database/repository/user.repository';

@Module({
  controllers: [UserUsersController],
  providers: [UsersAppService, UserRepository],
})
export class UsersModule {}
