import { IUserProfileImage } from '../interface/user-profile-image.interface';
import { IUser } from '../interface/user.interface';

export interface IUserModelData {
  id: IUser['id'];
  role: IUser['role'];
  snsAuthProvider: IUser['snsAuthProvider'];
  snsId: IUser['snsId'];
  name: IUser['name'];
  email: IUser['email'];
  phoneNumber: IUser['phoneNumber'];
  nickname: IUser['nickname'];
  gender: IUser['gender'];
  birth: IUser['birth'];
  belt: IUser['belt'];
  status: IUser['status'];
  createdAt: IUser['createdAt'];
  updatedAt: IUser['updatedAt'];
  profileImages: IUser['profileImages'];
}

export class UserModel {
  private readonly id: IUserModelData['id'];
  private readonly snsAuthProvider: IUserModelData['snsAuthProvider'];
  private readonly snsId: IUserModelData['snsId'];
  private role: IUserModelData['role'];
  private name: IUserModelData['name'];
  private email: IUserModelData['email'];
  private phoneNumber: IUserModelData['phoneNumber'];
  private nickname: IUserModelData['nickname'];
  private gender: IUserModelData['gender'];
  private birth: IUserModelData['birth'];
  private belt: IUserModelData['belt'];
  private status: IUserModelData['status'];
  private profileImages: IUserModelData['profileImages'];
  private readonly createdAt: IUserModelData['createdAt'];
  private readonly updatedAt: IUserModelData['updatedAt'];

  constructor(entity: IUserModelData) {
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
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.profileImages = entity.profileImages || [];
  }

  toEntity(): IUserModelData {
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
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      profileImages: this.profileImages,
    };
  }

  getId() {
    return this.id;
  }

  updateProfileImage(profileImage: IUserProfileImage) {
    this.profileImages.forEach((profileImage) => {
      profileImage.deletedAt = new Date();
    });
    this.profileImages.push(profileImage);
  }

  deleteProfileImage() {
    this.profileImages.forEach((profileImage) => {
      profileImage.deletedAt = new Date();
    });
  }
}
