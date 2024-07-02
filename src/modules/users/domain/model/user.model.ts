import { IUserModelData, IUserUpdateDto } from '../interface/user.interface';
import { UserProfileImageModel } from './user-profile-image.model';

export class UserModel {
  private readonly id: IUserModelData['id'];
  private readonly snsAuthProvider: IUserModelData['snsAuthProvider'];
  private readonly snsId: IUserModelData['snsId'];
  private readonly createdAt: IUserModelData['createdAt'];
  private readonly updatedAt: IUserModelData['updatedAt'];
  private role: IUserModelData['role'];
  private name: IUserModelData['name'];
  private email: IUserModelData['email'];
  private phoneNumber: IUserModelData['phoneNumber'];
  private nickname: IUserModelData['nickname'];
  private gender: IUserModelData['gender'];
  private birth: IUserModelData['birth'];
  private belt: IUserModelData['belt'];
  private status: IUserModelData['status'];
  private profileImages?: UserProfileImageModel[];

  constructor(data: IUserModelData) {
    this.id = data.id;
    this.role = data.role;
    this.snsAuthProvider = data.snsAuthProvider;
    this.snsId = data.snsId;
    this.name = data.name;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.nickname = data.nickname;
    this.gender = data.gender;
    this.birth = data.birth;
    this.belt = data.belt;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.profileImages = data.profileImages?.map((profileImage) => new UserProfileImageModel(profileImage));
  }

  toData(): IUserModelData {
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
      profileImages: this.profileImages?.map((profileImage) => profileImage.toData()),
    };
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getGender() {
    return this.gender;
  }

  getBirth() {
    return this.birth;
  }

  getEmail() {
    return this.email;
  }

  updateProfile(dto: IUserUpdateDto) {
    if (dto.name) this.name = dto.name;
    if (dto.nickname) this.nickname = dto.nickname;
    if (dto.gender) this.gender = dto.gender;
    if (dto.birth) this.birth = dto.birth;
    if (dto.belt) this.belt = dto.belt;
  }

  updateProfileImage(profileImage: UserProfileImageModel) {
    if (!this.profileImages) throw new Error('ProfileImages is not initialized');
    this.profileImages.forEach((profileImage) => {
      profileImage.delete();
    });
    this.profileImages.push(profileImage);
  }

  deleteProfileImage() {
    if (!this.profileImages) throw new Error('ProfileImages is not initialized');
    this.profileImages.forEach((profileImage) => {
      profileImage.delete();
    });
  }
}
