import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { MessengerService } from './services/messenger.service';
import { TweetService } from './services/tweet.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Twitter';
  user: User = new User();

  constructor(
    private userService: UserService,
    private router: Router,
    private msg: MessengerService,
    private tweetService: TweetService
  ) {
    this.authenticateUser();
    this.loadTweets();
    this.handleSubscription();
    this.loadAllUsers();
    this.refreshFollowList();
  }

  ngOnInit(): void {}

  authenticateUser() {
    this.userService.authenticateUser().subscribe(
      () => {
        console.log(localStorage.getItem('current_user'));
        var user_json = localStorage.getItem('current_user');
        var current_user = user_json !== null ? JSON.parse(user_json) : new User();
        this.msg.sendGetUserSessionMsg(current_user);
        //Get followers
        this.loadFollowers(current_user.id);
        //Get following
        this.loadFollowing(current_user.id);
        this.user = current_user;
        return current_user;
      },
      (err) => {
        console.log(err);
        this.router.navigate(['/login']);
      }
    );
  }

  //load tweets into the messenger service on page load
  loadTweets() {
    this.tweetService.getAllTweets().subscribe((tweets) => {
      this.msg.saveAllTweets(tweets);
    });
  }

  //re-load tweets if there are new changes
  handleSubscription() {
    this.msg.getTweetMsg().subscribe(() => {
      this.loadTweets();
    });
  }

  //load all users and save in messenger service
  loadAllUsers() {
    this.userService.getAllUsers().subscribe((users) => {
      this.msg.saveAllUsers(users);
    });
  }

  //load followers
  loadFollowers(user_id: string) {
    this.userService.getFollowers(user_id).subscribe((result) => {
      this.msg.saveFollowers(result);
    });
  }

  //load following
  loadFollowing(user_id: string) {
    this.userService.getFollowing(user_id).subscribe((result) => {
      this.msg.saveFollowing(result);
    });
  }

  //Refresh follow list if there is a change in data
  refreshFollowList() {
    this.msg.getRefreshFollowers().subscribe(() => {
      this.loadFollowers(this.user.id);
      this.loadFollowing(this.user.id);
    });
  }
}
