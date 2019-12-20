import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { Subject } from 'rxjs';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = {username: '', password: ''};
  constructor(private router: Router, private toastService: ToastService) {
  }

  ngOnInit() {

  }

  login(user: IUser) {
    console.log('from login user: ', user);
    const defaultUser: IUser = {username: 'nick', password: 'nick123'};
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        this.router.navigate(['cart', user]);
      } else {
        this.toastService.showToast('warning', 2000, 
        'Login validation failed (username and/or password not matching default user credentials)');
      }
    } else {
      this.toastService.showToast('warning', 2000, 'Login validation failed (username and/or password not specified)');
    }
  }

}
