import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.css'],
})
export class TweetsListComponent implements OnInit {
  user: User = new User();
  tweetsList: Tweet[] = [];
  followingList: string[] = [];
  constructor(private msg: MessengerService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadFollowingList();
    this.loadTweets();
    this.tweetsList = this.sortTweets();
    console.log(this.followingList);
  }

  //load tweets from pre-loaded data
  loadTweets() {
    this.msg.retrieveAllTweets().subscribe((tweets: Tweet[]) => {
      this.tweetsList = tweets;
      this.tweetsList = this.sortTweets();
    });
  }

  //sort tweets
  sortTweets() {
    var res = this.tweetsList.sort((a, b) => b.id - a.id);
    return res;
  }

  loadFollowingList() {
    this.msg.retrieveFollowing().subscribe((result) => {
      this.followingList = result;
      this.followingList.push(this.user.id);
    });
  }

  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.user = this.userService.getUserSessionData();
    });
  }
}
