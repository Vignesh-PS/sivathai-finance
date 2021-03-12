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
  menus: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/home'
    },
    {
      title: 'List Streets',
      link: '/list-streets',
      icon: 'person-outline',
    }
  ];


  toaster_status: NbComponentStatus = 'primary';

  constructor(private commonService:CommonService,
              private changeDetector:ChangeDetectorRef,
              private router:Router) {
    // this.adminid = localStorage.getItem('userLoggedIn');
    // console.log("jeni");
    // console.log(this.adminid);
    // // this.adminid = this.commonService.getGetuserid();
    this.commonService.currentMessage.subscribe(isShowHeaderFooter=>this.isShowHeaderFooter=isShowHeaderFooter);
    this.router.events.subscribe((event:any)=>{
      if(event instanceof NavigationStart){
        if(event.url=='/' || event.url=='/login'){
          this.commonService.changeMsg('hide');
          const admin = localStorage.getItem('userLoggedIn');
          if(admin!=null && admin !='' && admin!=undefined){
            // this.adminid = admin;
            // console.log(this.adminid);
            this.router.navigate(['/home']);
          }
        }else{
          const admin = localStorage.getItem('userLoggedIn');
          if(admin==null || admin ==''){
            this.router.navigate(['/login']);
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

        if(this.currentUrl=='/login' && event.url=='/home'){
          //console.log('curr:'+this.currentUrl+';forward:'+event.url);

        }
        this.commonService.setPrevUrl(this.currentUrl);
        this.currentUrl=event.url;
      }
      if(event instanceof NavigationError){

      }
    });
  }

  ngOnInit() {
    this.currentUrl=this.router.url;

    const admin = localStorage.getItem('userLoggedIn');
    if(admin==null || admin ==''){
      this.router.navigate(['/login']);
    }
  }




  // to prevent expression issue
  ngAfterViewChecked(): void {

    // const page = localStorage.getItem('currentPage');
    // if(page=='loginPage'){
    //   this.isShowHeaderFooter = false;
    // }else{
    //   this.isShowHeaderFooter = 'alwaysOpen';
    // }
  }
}
