import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { WebService } from '../../services/web.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading:boolean;
  dashboardInfo:any = {};

  constructor(private router: Router, private common: CommonService, private web: WebService) { }

  fillPageInfo(){
    this.loading = true;
    this.web.getData('dashboardInfo').then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.dashboardInfo = res.data;
      }else{
        this.common.showToast('warning', 'Warning', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Error');
    })
  }

  ngOnInit(): void {
    this.fillPageInfo();
  }

}
