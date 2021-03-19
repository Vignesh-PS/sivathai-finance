import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {NbMenuService, NbSidebarService} from '@nebular/theme';
import {CommonService} from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy  {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;


  currentTheme = 'default';

  userMenu = [
    { title: 'Change Password',attr: 'changepassword', },
    { title: 'Log out', attr: "Log out" }
    ];
user_name:any={};
  created_by: string;
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private commonService:CommonService, private router: Router) {
  }
  changeTheme(themeName: string) {
    //this.themeService.changeTheme(themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit() {
    this.user_name = "Sivathai Admin";
    // console.log( this.dialogData.created_by);
    this.menuService.onItemClick().subscribe(res=>{
      if(res.item.title=='Log out'){
        if(window.confirm('Are you sure to logout..?')){
          localStorage.removeItem('userLoggedIn');
          this.commonService.showToast('success', 'Success', 'Logout Successfully');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 800);
        }
      }
    })
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    //this.layoutService.changeLayoutSize();

    return false;
  }
}
