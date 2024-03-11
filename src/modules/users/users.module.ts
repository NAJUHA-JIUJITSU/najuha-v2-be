import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { UserUsersController } from 'src/modules/users/presentation/user-users.controller';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { UsersRepository } from '../../infrastructure/database/repositories/users.repository';

@Module({
  // imports: [TypeOrmModule.forFeature([UserEntity])],
  imports: [],
  controllers: [UserUsersController],
  providers: [UsersAppService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
