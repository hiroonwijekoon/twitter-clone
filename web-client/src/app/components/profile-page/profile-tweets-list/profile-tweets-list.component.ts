import { Component, OnInit } from '@angular/core';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-tweets-list',
  templateUrl: './profile-tweets-list.component.html',
  styleUrls: ['./profile-tweets-list.component.css'],
})
export class ProfileTweetsListComponent implements OnInit {
  tweetsList: Tweet[] = [];
  user!: User;

  constructor(private msg: MessengerService, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserSessionData();
    this.loadUser();
    this.loadTweets();
  }

  //get pre-loaded tweets from messenger service and set number of tweets from user
  loadTweets() {
    this.msg.retrieveAllTweets().subscribe((tweets: Tweet[]) => {
      tweets = tweets.filter((tweet) => tweet.user_id === this.user.id);
      tweets = tweets.sort((a, b) => b.id - a.id);
      this.tweetsList = tweets;
    });
  }

  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.user = this.userService.getUserSessionData();
    });
  }
}
