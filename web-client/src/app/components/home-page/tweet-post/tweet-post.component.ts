import { Component, Input, OnInit } from '@angular/core';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tweet-post',
  templateUrl: './tweet-post.component.html',
  styleUrls: ['./tweet-post.component.css'],
})
export class TweetPostComponent implements OnInit {
  @Input() tweet!: Tweet;
  user = new User();
  d: Date;
  created: string;

  constructor(private tweetService: TweetService, private userService: UserService, private msg: MessengerService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.d = new Date(this.tweet.created);
    this.created = this.d.toLocaleString();
  }

  //retirve user data by filtering all users from pre-loaded data in messenger service
  loadUserData() {
    this.msg.retrieveAllUsers().subscribe((users) => {
      this.user = users.filter((i) => i.id == this.tweet.user_id)[0];
    });
  }
}
