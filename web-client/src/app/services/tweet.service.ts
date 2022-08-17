import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SaveImagesURL, TweetUrl } from '../config/api';
import { Tweet } from '../models/tweet';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  subject = new Subject<Tweet>();

  constructor(private http: HttpClient) {}

  addTweet(data: any) {
    return this.http.post<any>(TweetUrl, data);
  }

  updateTweet(id: number, data: any) {
    return this.http.put<any>(TweetUrl + '/' + id, data);
  }

  getAllTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(TweetUrl);
  }

  deleteTweet(id: number) {
    return this.http.delete<any>(TweetUrl + '/' + id);
  }

  addImage(data: any) {
    return this.http.post<any>(SaveImagesURL, data);
  }
}
