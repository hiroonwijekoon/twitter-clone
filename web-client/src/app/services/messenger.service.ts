import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Tweet } from '../models/tweet';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  subjectTweet = new Subject<Tweet>();
  subjectUser = new Subject<User>();
  subjectAllUsers = new BehaviorSubject<User[]>([]);
  subjectTweets = new BehaviorSubject<Tweet[]>([]);
  subjectFollowers = new BehaviorSubject<string[]>([]);
  subjectFollowing = new BehaviorSubject<string[]>([]);
  subjectRefreshFollowList = new Subject<any>();

  constructor() {}

  //Handle Add Tweet
  sendTweetMsg(tweet: Tweet) {
    this.subjectTweet.next(tweet);
  }

  getTweetMsg() {
    return this.subjectTweet.asObservable();
  }

  //Handle Login Authentication
  sendGetUserSessionMsg(user: User) {
    return this.subjectUser.next(user);
  }

  getUserSessionMsg() {
    return this.subjectUser.asObservable();
  }

  //Save and retrieve all tweets
  saveAllTweets(tweets: Tweet[]) {
    this.subjectTweets.next(tweets);
  }

  retrieveAllTweets() {
    return this.subjectTweets.asObservable();
  }

  //Save and retireve all users
  saveAllUsers(users: User[]) {
    this.subjectAllUsers.next(users);
  }

  retrieveAllUsers() {
    return this.subjectAllUsers.asObservable();
  }
  //Save and retrieve followers
  saveFollowers(followers: string[]) {
    this.subjectFollowers.next(followers);
  }

  retrieveFollowers() {
    return this.subjectFollowers;
  }

  //Save and retrieve following
  saveFollowing(following: string[]) {
    this.subjectFollowing.next(following);
  }

  retrieveFollowing() {
    return this.subjectFollowing;
  }

  //Refresh followers and following
  setRefreshFollowers(data: any) {
    this.subjectRefreshFollowList.next(data);
  }

  getRefreshFollowers() {
    return this.subjectRefreshFollowList;
  }
}
