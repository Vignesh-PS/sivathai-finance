import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbMenuItem, NbToastrService} from '@nebular/theme';
import {CommonService} from './services/common.service';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit,AfterViewChecked {
  isShowHeaderFooter:any="alwaysOpen";
  currentUrl:string="";adminid:any;
  title = 'nbadmin1';
  menus: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/home'
    },
    {
      title: 'Admin Users Management',
      link: '/admin',
      icon: 'person-outline',
    },
    {
      title: 'Students Management',
      link: '/students',
      icon: 'person-outline',
    },
    {
      title: 'Promocodes Management',
      link: '/promocodes',
      icon: 'pantone-outline',
    },
    {
      title: 'Plans Management',
      link: '/plans',
      icon: 'speaker-outline',
    },
    {
      title: 'Courses',
      link: '/courses',
      icon: 'square-outline',
    },

    {
      title: 'Contact Management',
      icon: 'phone-call-outline',
      link: '/contact',
    },
    {
      title: 'Banner Management',
      icon: 'edit-2-outline',
      link: '/homepage',
    },
    {
      title: 'Content Management',
      icon: 'square-outline',
      link: '/content',
    },
    {
      title: 'FAQ Management',
      icon: 'edit-2-outline',
      link: '/faq',
    },
    {
      title: 'Week Course Management',
      icon: 'speaker-outline',
      link: '/week_course',
    },
    {
      title: 'Site Settings',
      icon: 'home-outline',
      link: '/site',
    },

    // {
    //   title: 'Settings',
    //   icon: { icon: 'settings-2-outline', pack: 'eva' },
    //   children: [
    //     {
    //       title: 'Change Password',
    //       link: '/changepassword',
    //     }
    //     ]
    // },
    // {
    //   title: 'Logout',
    //   icon: 'unlock-outline',
    //   link: '/login',
    // },
  ];


  toaster_status: NbComponentStatus = 'primary';

  constructor(private commonService:CommonService,
              private changeDetector:ChangeDetectorRef,
              private router:Router) {
    this.adminid = localStorage.getItem('divinkAdminId');
    console.log("jeni");
    console.log(this.adminid);
    // this.adminid = this.commonService.getGetuserid();
    this.commonService.currentMessage.subscribe(isShowHeaderFooter=>this.isShowHeaderFooter=isShowHeaderFooter);
    // @ts-ignore
      this.router.events.subscribe((event:Event)=>{
        this.adminid = localStorage.getItem('divinkAdminId');
        console.log("router");
      if(event instanceof NavigationStart){
        if(event.url=='/' || event.url=='/login'){
          this.commonService.changeMsg('hide');
          let admin = localStorage.getItem('divinkAdminId');
          if(admin!=null && admin !='' && admin!=undefined){
            // this.adminid = admin;
            // console.log(this.adminid);
            this.router.navigate(['/home']);
          }
        }else{
          let admin = localStorage.getItem('divinkAdminId');
          if(admin==null || admin ==''){
            this.router.navigate(['/home']);
          }
        }
      }
      if(event instanceof NavigationEnd){
        //console.log("url2:"+event,event.url);
        if(event.url=='/' || event.url=='/login'){
          this.commonService.changeMsg('hide');
        }
        else{
          this.commonService.changeMsg('alwaysOpen');
        }

        if(this.currentUrl=='/login' && event.url=='/dashboard'){
          //console.log('curr:'+this.currentUrl+';forward:'+event.url);

        }
        this.commonService.setPrevUrl(this.currentUrl);
        this.currentUrl=event.url;
      }
      if(event instanceof NavigationError){

      }
    });
    this.router.events.subscribe(url=>{
      //console.log("url:"+url);
    });
  }

  ngOnInit() {
    this.currentUrl=this.router.url;

    let admin = localStorage.getItem('divinkAdminId');
    if(admin==null || admin ==''){
      this.router.navigate(['/home']);
    }
  }




  // to prevent expression issue
  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
