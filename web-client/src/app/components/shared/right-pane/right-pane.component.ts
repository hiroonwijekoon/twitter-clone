import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.css'],
})
export class RightPaneComponent implements OnInit {
  usersList: User[] = [];
  currentUser!: User;
  current_user_id = '0';
  followingList: string[] = [];
  constructor(private userService: UserService, private msg: MessengerService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUserSessionData();
    this.loadCurrentUser();
    this.loadUsers();
    this.loadFollowingList();
  }

  //get pre-loaded user data using messenger service
  loadCurrentUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.currentUser = this.userService.getUserSessionData();
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((users) => {
      this.usersList = users;
    });
  }

  loadFollowingList() {
    this.msg.retrieveFollowing().subscribe((result) => {
      this.followingList = result;
    });
  }
}
