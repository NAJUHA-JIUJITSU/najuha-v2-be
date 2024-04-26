import { IUser } from '../interface/user.interface';

export class UserModel {
  private readonly id: IUser['id'];
  private readonly snsAuthProvider: IUser['snsAuthProvider'];
  private readonly snsId: IUser['snsId'];
  private role: IUser['role'];
  private name: IUser['name'];
  private email: IUser['email'];
  private phoneNumber: IUser['phoneNumber'];
  private nickname: IUser['nickname'];
  private gender: IUser['gender'];
  private birth: IUser['birth'];
  private belt: IUser['belt'];
  private profileImageUrlKey: IUser['profileImageUrlKey'];
  private status: IUser['status'];
  private readonly createdAt: IUser['createdAt'];
  private readonly updatedAt: IUser['updatedAt'];

  constructor(entity: IUser) {
    this.id = entity.id;
    this.role = entity.role;
    this.snsAuthProvider = entity.snsAuthProvider;
    this.snsId = entity.snsId;
    this.name = entity.name;
    this.email = entity.email;
    this.phoneNumber = entity.phoneNumber;
    this.nickname = entity.nickname;
    this.gender = entity.gender;
    this.birth = entity.birth;
    this.belt = entity.belt;
    this.profileImageUrlKey = entity.profileImageUrlKey;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  toEntity(): IUser {
    return {
      id: this.id,
      role: this.role,
      snsAuthProvider: this.snsAuthProvider,
      snsId: this.snsId,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      nickname: this.nickname,
      gender: this.gender,
      birth: this.birth,
      belt: this.belt,
      profileImageUrlKey: this.profileImageUrlKey,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getId() {
    return this.id;
  }
}
