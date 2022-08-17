import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  current_user!: User;
  constructor(private tweetService: TweetService, private msg: MessengerService) {}

  ngOnInit(): void {
    this.loadTweets();
  }

  //load tweets into the messenger service on page load
  loadTweets() {
    this.tweetService.getAllTweets().subscribe((tweets) => {
      this.msg.saveAllTweets(tweets);
    });
  }
}
