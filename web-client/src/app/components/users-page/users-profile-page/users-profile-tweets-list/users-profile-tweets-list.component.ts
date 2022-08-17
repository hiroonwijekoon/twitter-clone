import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-profile-tweets-list',
  templateUrl: './users-profile-tweets-list.component.html',
  styleUrls: ['./users-profile-tweets-list.component.css'],
})
export class UsersProfileTweetsListComponent implements OnInit {
  user!: User;
  tweetsList!: Tweet[];
  user_id: string = '0';
  constructor(private userService: UserService, private msg: MessengerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getUserID();
    this.loadUserData();
    this.loadTweets();
  }

  //load parameter router link parameters
  getUserID() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.user_id = params.get('user_id').toString();
    });
  }

  //load selected user data
  loadUserData() {
    this.userService.getSingleUser(this.user_id).subscribe((user_data) => {
      this.user = user_data;
    });
  }

  //get pre-loaded tweets from messenger service sort by user
  loadTweets() {
    this.msg.retrieveAllTweets().subscribe((tweets: Tweet[]) => {
      tweets = tweets.filter((tweet) => tweet.user_id === this.user_id);
      tweets = tweets.sort((a, b) => b.id - a.id);
      this.tweetsList = tweets;
    });
  }
}
