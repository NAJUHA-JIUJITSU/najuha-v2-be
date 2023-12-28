import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    console.log(dto);
    return dto;
  }
}
