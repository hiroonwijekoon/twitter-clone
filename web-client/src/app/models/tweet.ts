export class Tweet {
  id: number;
  user_id: string;
  content: string;
  image: string;
  created: string;

  constructor(id = 0, user_id = '0', content = 'No Content', image = '', created = d.getUTCDate) {
    this.id = id;
    this.user_id = user_id;
    this.content = content;
    this.image = image;
    this.created = created.toString();
  }
}

var d = new Date();
