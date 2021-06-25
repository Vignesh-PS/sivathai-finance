import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { NbComponentStatus, NbMenuItem } from '@nebular/theme';
import { CommonService } from './services/common.service';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ElectronService } from './core/services';
import { WebService } from './services/web.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isShowHeaderFooter: any = "alwaysOpen";
  currentUrl: string = ""; adminid: any;
  menus: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/home'
    },
    {
      title: 'Streets',
      link: '/list-streets',
      icon: 'grid-outline',
    },
    {
      title: 'Families',
      link: '/list-families',
      icon: 'person-outline',
    },
    {
      title: 'All Collections',
      link: '/list-collections',
      icon: 'briefcase-outline',
    },
    {
      title: 'Old Accounts',
      icon: 'clipboard-outline',
      children: [
        {
          title: 'All Accounts',
          link: '/list-collections-old'
        },{
          title: 'All Families',
          link: '/list-families-old'
        }
      ]
    }
  ];


  toaster_status: NbComponentStatus = 'primary';

  constructor(private commonService: CommonService,
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    private electronService: ElectronService,
    private web: WebService,
    private router: Router) {

    this.commonService.currentMessage.subscribe(isShowHeaderFooter => this.isShowHeaderFooter = isShowHeaderFooter);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url == '/' || event.url == '/login') {
          this.commonService.changeMsg('hide');
          const admin = localStorage.getItem('userLoggedIn');
          if (admin != null && admin != '' && admin != undefined) {
            // this.adminid = admin;
            // console.log(this.adminid);
            this.router.navigate(['/home']);
          }
        } else {
          const admin = localStorage.getItem('userLoggedIn');
          if (admin == null || admin == '') {
            this.router.navigate(['/login']);
          }
        }
      }
      if (event instanceof NavigationEnd) {
        //console.log("url2:"+event,event.url);
        if (event.url == '/' || event.url == '/login') {
          this.commonService.changeMsg('hide');
        }
        else {
          this.commonService.changeMsg('alwaysOpen');
        }

        if (this.currentUrl == '/login' && event.url == '/home') {
          //console.log('curr:'+this.currentUrl+';forward:'+event.url);

        }
        this.commonService.setPrevUrl(this.currentUrl);
        this.currentUrl = event.url;
      }
      if (event instanceof NavigationError) {

      }
    });

    // this.runElectronRenderer();
  }

  runElectronRenderer() {
    // Async message handler
    this.electronService.ipcRenderer.on('switch-ng-page', (event, arg) => {

      switch (arg) {
        case 'all-streets':
          this.zone.run(() => {
            this.router.navigate(['/list-streets']);
          });
          break;
        case 'all-families':
          this.zone.run(() => {
            this.router.navigate(['/list-families']);
          });
          break;
        case 'all-collections':
          this.zone.run(() => {
            this.router.navigate(['/list-collections']);
          });
          break;
        case 'import-database':
          this.importDatabase();
          break;
      }

      if(typeof(arg)=="object"){
        this.handleMessage(arg);
      }
      //this.electronService.ipcRenderer.send('open-error-dialog');
    })
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    const admin = localStorage.getItem('userLoggedIn');
    if (admin == null || admin == '') {
      this.router.navigate(['/login']);
    }
  }

  handleMessage(arg){
        let msgType = arg.type;
        if(msgType=='message'){
          // this.commonService.showToast('info', 'Message',arg.message);
          alert(arg.message);
        }
  }

  importDatabase(){
    this.web.postData('destroyDB', {}).then(res=>{
      if(res.status=='200'){
        this.electronService.ipcRenderer.send('ipc-renderer', 'db-connection-destroyed')
      }
    })
    .catch(err=>{

    });
  }

}
