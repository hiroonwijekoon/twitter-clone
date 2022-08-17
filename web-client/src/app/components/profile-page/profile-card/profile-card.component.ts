import { Component, OnInit } from '@angular/core';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit {
  user!: User;
  numOfTweets: string = '0';
  numOfFollowers: string = '0';
  numOfFollowing: string = '0';
  constructor(private userService: UserService, private msg: MessengerService) {}

  ngOnInit(): void {
    this.loadUser();
    this.user = this.userService.getUserSessionData();
    this.loadTweets();
    this.loadFollowers();
    this.loadFollowing();
  }

  //get pre-loaded tweets from messenger service and set number of tweets from user
  loadTweets() {
    this.msg.retrieveAllTweets().subscribe((tweets: Tweet[]) => {
      tweets = tweets.filter((tweet) => tweet.user_id === this.user.id);
      this.numOfTweets = tweets.length.toString();
    });
  }

  //get pre-loaded user data using messenger service
  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.user = this.userService.getUserSessionData();
    });
  }

  //get number of followers
  loadFollowers() {
    this.userService.getFollowers(this.user.id).subscribe((followers) => {
      this.numOfFollowers = followers.length.toString();
    });
  }

  //get number of following
  loadFollowing() {
    this.userService.getFollowing(this.user.id).subscribe((following) => {
      this.numOfFollowing = following.length.toString();
    });
  }
}
