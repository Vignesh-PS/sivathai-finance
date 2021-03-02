import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from './../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loading:boolean;
  loginForm: any = {
    'username': '',
    'user_password': '',
  }

  constructor(private readonly sidebarService: NbSidebarService,
    private common: CommonService,
    private router: Router) {

      localStorage.setItem('currentPage', 'loginPage');
  }

  ngOnInit(): void {
    const admin = localStorage.getItem('userLoggedIn');
    if(admin!=null && admin !=''){
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.loginForm.username == null || this.loginForm.username == '') {
      this.common.showToast('warning', 'Missing field', 'Enter username');
    } else if (this.loginForm.user_password == null || this.loginForm.user_password == '') {
      this.common.showToast('warning', 'Missing field', 'Enter password');
    } else if(this.loginForm.username!='Sivathai' || this.loginForm.user_password!='2021') {
      this.common.showToast('warning', 'Missing field', 'Password/Username is incorrect');
    }else{
      this.router.navigate(['/home']);
      localStorage.setItem('userLoggedIn', 'true');
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }
}
