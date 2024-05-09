import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ulid } from 'ulid';

export class UserDummyBuilder {
  private user: Partial<IUser> = {};

  constructor() {
    this.user.id = ulid();
    this.user.role = 'ADMIN';
    this.user.snsAuthProvider = 'KAKAO';
    this.user.snsId = ulid();
    this.user.name = 'AdminName';
    this.user.email = 'admin@gmail.com';
    this.user.phoneNumber = '01012345678';
    this.user.nickname = 'AdminNickname';
    this.user.gender = 'MALE';
    this.user.birth = '19980101';
    this.user.belt = '화이트';
    this.user.profileImageUrlKey = null;
    this.user.status = 'ACTIVE';
    this.user.createdAt = new Date();
    this.user.updatedAt = new Date();
  }

  public setId(id: string): this {
    this.user.id = id;
    return this;
  }

  public setRole(role: IUser['role']): this {
    this.user.role = role;
    return this;
  }

  public setSnsAuthProvider(provider: IUser['snsAuthProvider']): this {
    this.user.snsAuthProvider = provider;
    return this;
  }

  public setSnsId(snsId: string): this {
    this.user.snsId = snsId;
    return this;
  }

  public setName(name: string): this {
    this.user.name = name;
    return this;
  }

  public setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  public setPhoneNumber(phoneNumber: string): this {
    this.user.phoneNumber = phoneNumber;
    return this;
  }

  public setNickname(nickname: string): this {
    this.user.nickname = nickname;
    return this;
  }

  public setGender(gender: IUser['gender']): this {
    this.user.gender = gender;
    return this;
  }

  public setBirth(birth: string): this {
    this.user.birth = birth;
    return this;
  }

  public setBelt(belt: IUser['belt']): this {
    this.user.belt = belt;
    return this;
  }

  public setProfileImageUrlKey(url: string | null): this {
    this.user.profileImageUrlKey = url;
    return this;
  }

  public setStatus(status: IUser['status']): this {
    this.user.status = status;
    return this;
  }

  public setCreatedAt(date: Date): this {
    this.user.createdAt = date;
    return this;
  }

  public setUpdatedAt(date: Date): this {
    this.user.updatedAt = date;
    return this;
  }

  public build(): IUser {
    return this.user as IUser;
  }
}
