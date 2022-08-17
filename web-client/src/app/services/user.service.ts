import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { AuthenticateUserUrl, GoogleOAuthLoginUrl, LogoutUserUrl, UsersURL } from '../config/api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  subject = new Subject<User>();
  current_user!: User;
  constructor(private http: HttpClient, private router: Router) {}

  redirectGoogleLogin() {
    window.location.href = GoogleOAuthLoginUrl;
  }

  authenticateUser(): Observable<User> {
    return this.http.get<User>(AuthenticateUserUrl).pipe(
      map((User) => {
        //Save user session data to local storage
        localStorage.setItem('current_user', JSON.stringify(User));
        return User;
      })
    );
  }

  getUserSessionData() {
    var user_json = localStorage.getItem('current_user');
    this.current_user = user_json !== null ? JSON.parse(user_json) : new User();
    return this.current_user;
  }

  logOutUser() {
    return this.http.get(LogoutUserUrl);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(UsersURL);
  }

  getSingleUser(user_id: string) {
    return this.http.get<User>(UsersURL + '/' + user_id);
  }
  getFollowers(user_id: string) {
    return this.http.get<string[]>(UsersURL + '/' + user_id + '/followers');
  }

  getFollowing(user_id: string) {
    return this.http.get<string[]>(UsersURL + '/' + user_id + '/following');
  }

  followUser(user_id: string, data: any) {
    return this.http.post<any>(UsersURL + '/' + user_id + '/following', data);
  }
}
