import { IUserModelData, IUserUpdateDto } from '../interface/user.interface';
import { UserProfileImageModel } from './user-profile-image.model';

export class UserModel {
  private readonly _id: IUserModelData['id'];
  private readonly _snsAuthProvider: IUserModelData['snsAuthProvider'];
  private readonly _snsId: IUserModelData['snsId'];
  private readonly _createdAt: IUserModelData['createdAt'];
  private readonly _updatedAt: IUserModelData['updatedAt'];
  private _role: IUserModelData['role'];
  private _name: IUserModelData['name'];
  private _email: IUserModelData['email'];
  private _phoneNumber: IUserModelData['phoneNumber'];
  private _nickname: IUserModelData['nickname'];
  private _gender: IUserModelData['gender'];
  private _birth: IUserModelData['birth'];
  private _belt: IUserModelData['belt'];
  private _status: IUserModelData['status'];
  private _profileImages?: UserProfileImageModel[];

  constructor(data: IUserModelData) {
    this._id = data.id;
    this._role = data.role;
    this._snsAuthProvider = data.snsAuthProvider;
    this._snsId = data.snsId;
    this._name = data.name;
    this._email = data.email;
    this._phoneNumber = data.phoneNumber;
    this._nickname = data.nickname;
    this._gender = data.gender;
    this._birth = data.birth;
    this._belt = data.belt;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._profileImages = data.profileImages?.map((profileImage) => new UserProfileImageModel(profileImage));
  }

  toData(): IUserModelData {
    return {
      id: this._id,
      role: this._role,
      snsAuthProvider: this._snsAuthProvider,
      snsId: this._snsId,
      name: this._name,
      email: this._email,
      phoneNumber: this._phoneNumber,
      nickname: this._nickname,
      gender: this._gender,
      birth: this._birth,
      belt: this._belt,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      profileImages: this._profileImages?.map((profileImage) => profileImage.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get snsAuthProvider() {
    return this._snsAuthProvider;
  }

  get snsId() {
    return this._snsId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get phoneNumber() {
    return this._phoneNumber;
  }

  get nickname() {
    return this._nickname;
  }

  get gender() {
    return this._gender;
  }

  get birth() {
    return this._birth;
  }

  get belt() {
    return this._belt;
  }

  get status() {
    return this._status;
  }

  get profileImages() {
    return this._profileImages;
  }

  updateProfile(dto: IUserUpdateDto) {
    if (dto.name) this._name = dto.name;
    if (dto.nickname) this._nickname = dto.nickname;
    if (dto.gender) this._gender = dto.gender;
    if (dto.birth) this._birth = dto.birth;
    if (dto.belt) this._belt = dto.belt;
  }

  updateProfileImage(profileImage: UserProfileImageModel) {
    if (!this._profileImages) throw new Error('ProfileImages is not initialized');
    this._profileImages.forEach((image) => {
      image.delete();
    });
    this._profileImages.push(profileImage);
  }

  deleteProfileImage() {
    if (!this._profileImages) throw new Error('ProfileImages is not initialized');
    this._profileImages.forEach((profileImage) => {
      profileImage.delete();
    });
  }
}
