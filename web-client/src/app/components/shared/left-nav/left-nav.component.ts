import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css'],
})
export class LeftNavComponent implements OnInit {
  user!: User;
  constructor(private userService: UserService, private router: Router, private msg: MessengerService) {}

  ngOnInit(): void {
    this.loadUser();
    this.user = this.userService.getUserSessionData();
  }

  logOutUser() {
    this.userService.logOutUser().subscribe(() => {
      localStorage.removeItem('current_user');
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }

  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.user = this.userService.getUserSessionData();
    });
  }
}
