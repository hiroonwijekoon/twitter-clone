import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tweet-box',
  templateUrl: './tweet-box.component.html',
  styleUrls: ['./tweet-box.component.css'],
})
export class TweetBoxComponent implements OnInit {
  errorMessage = null;
  tweetForm!: FormGroup;
  date!: Date;
  user!: User;
  filePath = '';
  selectedFile: File = null;

  constructor(
    private builder: FormBuilder,
    private tweetService: TweetService,
    private userService: UserService,
    private msg: MessengerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUser();
    this.user = this.userService.getUserSessionData();
  }

  buildForm() {
    this.tweetForm = this.builder.group({
      content: ['', Validators.required],
      img: [null],
      file: [''],
    });
  }

  sendTweet() {
    //Transforming data into multipart/form-data type
    const fd = new FormData();
    fd.append('user_id', this.user.id);
    fd.append('content', this.tweetForm.value.content);
    if (this.selectedFile != null) {
      fd.append('file', this.selectedFile, this.selectedFile.name);
    } else {
      fd.append('file', '');
    }

    this.tweetService.addTweet(fd).subscribe((result) => {
      this.msg.sendTweetMsg(result);
      this.clearTweetBox();
    });
  }

  clearTweetBox() {
    this.selectedFile = null;
    this.filePath = '';
    this.tweetForm.reset();
  }

  loadUser() {
    this.msg.getUserSessionMsg().subscribe(() => {
      this.user = this.userService.getUserSessionData();
    });
  }

  imagePreview(e) {
    const file = (e.target as HTMLInputElement).files[0];

    this.tweetForm.patchValue({
      img: file,
    });

    this.selectedFile = <File>e.target.files[0];

    this.tweetForm.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.filePath = '';
    this.tweetForm.value.img = null;
    this.tweetForm.value.filename = '';
    this.selectedFile = null;
  }
}
