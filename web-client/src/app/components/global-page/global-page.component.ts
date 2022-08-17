import { Component, OnInit } from '@angular/core';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';

@Component({
  selector: 'app-global-page',
  templateUrl: './global-page.component.html',
  styleUrls: ['./global-page.component.css'],
})
export class GlobalPageComponent implements OnInit {
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
