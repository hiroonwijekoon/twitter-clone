export class User {
  id: string;
  email: string;
  verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;

  constructor(
    id = '0',
    email = '',
    verified = false,
    name = 'Twitter User',
    given_name = 'User',
    family_name = '',
    picture = 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png',
    locale = ''
  ) {
    this.id = id;
    this.email = email;
    this.verified = verified;
    this.name = name;
    this.given_name = given_name;
    this.family_name = family_name;
    this.picture = picture;
    this.locale = locale;
  }
}
