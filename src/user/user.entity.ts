export class UserEntity {
  /**
   * user id.
   *
   * @maxLength 36
   * @format uuid
   */
  id: string;

  /**
   * user name.
   *
   * @minLength 1
   * @maxLength 150
   */
  name: string;

  /**
   * user email.
   *
   * @maxLength 150
   * @format email
   */
  email: string;
}
