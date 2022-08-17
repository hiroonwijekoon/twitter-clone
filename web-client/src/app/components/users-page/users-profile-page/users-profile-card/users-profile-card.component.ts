import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-profile-card',
  templateUrl: './users-profile-card.component.html',
  styleUrls: ['./users-profile-card.component.css'],
})
export class UsersProfileCardComponent implements OnInit {
  user!: User;
  user_id: string = '0';
  numOfTweets: string = '0';
  numOfFollowing: string = '0';
  numOfFollowers: string = '0';
  constructor(private userService: UserService, private msg: MessengerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getUserID();
    this.loadUserData();
    this.loadTweets();
    this.loadFollowers();
    this.loadFollowing();
  }

  //load parameter router link parameters
  getUserID() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.user_id = params.get('user_id').toString();
    });
  }
  //get pre-loaded tweets from messenger service and set number of tweets from user
  loadTweets() {
    this.msg.retrieveAllTweets().subscribe((tweets: Tweet[]) => {
      tweets = tweets.filter((tweet) => tweet.user_id === this.user_id);
      this.numOfTweets = tweets.length.toString();
    });
  }

  //load selected user data
  loadUserData() {
    this.userService.getSingleUser(this.user_id).subscribe((user_data) => {
      this.user = user_data;
    });
  }

  //get number of followers
  loadFollowers() {
    this.userService.getFollowers(this.user_id).subscribe((followers) => {
      this.numOfFollowers = followers.length.toString();
    });
  }

  //get number of following
  loadFollowing() {
    this.userService.getFollowing(this.user_id).subscribe((following) => {
      this.numOfFollowing = following.length.toString();
    });
  }
}
