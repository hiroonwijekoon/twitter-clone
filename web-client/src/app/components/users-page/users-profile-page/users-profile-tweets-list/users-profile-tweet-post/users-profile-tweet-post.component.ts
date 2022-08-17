import { Component, Input, OnInit } from '@angular/core';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-users-profile-tweet-post',
  templateUrl: './users-profile-tweet-post.component.html',
  styleUrls: ['./users-profile-tweet-post.component.css'],
})
export class UsersProfileTweetPostComponent implements OnInit {
  @Input() tweet!: Tweet;
  @Input() user!: User;
  d: Date;
  created: string;

  constructor() {}

  ngOnInit(): void {
    this.d = new Date(this.tweet.created);
    this.created = this.d.toLocaleString();
  }
}
