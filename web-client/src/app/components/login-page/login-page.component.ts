import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    localStorage.removeItem('current_user');
    localStorage.clear();
  }

  redirectGoogleLogin() {
    this.userService.redirectGoogleLogin();
  }
}
