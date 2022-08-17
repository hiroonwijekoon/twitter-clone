import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-right-pane-user-item',
  templateUrl: './right-pane-user-item.component.html',
  styleUrls: ['./right-pane-user-item.component.css'],
})
export class RightPaneUserItemComponent implements OnInit {
  current_user!: User;
  @Input() user!: User;
  @Input() isFollowing: boolean = false;

  constructor(private userService: UserService, private msg: MessengerService) {}

  ngOnInit(): void {
    this.current_user = this.userService.getUserSessionData();
  }

  followUser() {
    const fd = new FormData();
    fd.append('following', this.user.id);
    this.userService.followUser(this.current_user.id, fd).subscribe(() => {
      if (this.isFollowing) {
        this.isFollowing = false;
      }
      if (!this.isFollowing) {
        this.isFollowing = true;
      }
      this.msg.setRefreshFollowers(true);
    });
  }

  //get pre-loaded user data using messenger service
  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.current_user = this.userService.getUserSessionData();
    });
  }
}
