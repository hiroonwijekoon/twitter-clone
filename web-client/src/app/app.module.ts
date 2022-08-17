import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { LeftNavComponent } from './components/shared/left-nav/left-nav.component';
import { FeedComponent } from './components/home-page/feed/feed.component';
import { RightPaneComponent } from './components/shared/right-pane/right-pane.component';
import { TweetBoxComponent } from './components/home-page/tweet-box/tweet-box.component';
import { TweetsListComponent } from './components/home-page/tweets-list/tweets-list.component';
import { TweetPostComponent } from './components/home-page/tweet-post/tweet-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { UsersListComponent } from './components/users-page/users-list/users-list.component';
import { UserItemComponent } from './components/users-page/user-item/user-item.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ProfileCardComponent } from './components/profile-page/profile-card/profile-card.component';
import { ProfileTweetsListComponent } from './components/profile-page/profile-tweets-list/profile-tweets-list.component';
import { ProfileTweetPostComponent } from './components/profile-page/profile-tweets-list/profile-tweet-post/profile-tweet-post.component';
import { MessengerService } from './services/messenger.service';
import { UsersProfilePageComponent } from './components/users-page/users-profile-page/users-profile-page.component';
import { UsersProfileCardComponent } from './components/users-page/users-profile-page/users-profile-card/users-profile-card.component';
import { UsersProfileTweetsListComponent } from './components/users-page/users-profile-page/users-profile-tweets-list/users-profile-tweets-list.component';
import { UsersProfileTweetPostComponent } from './components/users-page/users-profile-page/users-profile-tweets-list/users-profile-tweet-post/users-profile-tweet-post.component';
import { GlobalPageComponent } from './components/global-page/global-page.component';
import { GlobalFeedComponent } from './components/global-page/global-feed/global-feed.component';
import { RightPaneUserItemComponent } from './components/shared/right-pane/right-pane-user-item/right-pane-user-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LeftNavComponent,
    FeedComponent,
    RightPaneComponent,
    TweetBoxComponent,
    TweetsListComponent,
    TweetPostComponent,
    LoginPageComponent,
    UsersPageComponent,
    UsersListComponent,
    UserItemComponent,
    ProfilePageComponent,
    ProfileCardComponent,
    ProfileTweetsListComponent,
    ProfileTweetPostComponent,
    UsersProfilePageComponent,
    UsersProfileCardComponent,
    UsersProfileTweetsListComponent,
    UsersProfileTweetPostComponent,
    GlobalPageComponent,
    GlobalFeedComponent,
    RightPaneUserItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule],
  providers: [MessengerService, AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
