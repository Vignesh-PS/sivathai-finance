import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { CommonService } from '../../../services/common.service';
import { WebService } from '../../../services/web.service';
import { ReportService } from '../report-service.service';
import htmlToPdfmake from 'html-to-pdfmake';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-oldpendings',
  templateUrl: './oldpendings.component.html',
  styleUrls: ['./oldpendings.component.scss']
})
export class OldpendingsComponent implements OnInit {
  loading:boolean;
  tableSource: any = [];
  exportMenus:any = [
    {
      title: 'Pdf',
      attr: 'pdf'
    },{
      title: 'Excel',
      attr: 'xlsx'
    }
  ];
  selectedReport:string='All Families';

  menuSubscription:Subscription;

  constructor(private web: WebService, public common: CommonService, private activatedRoute: ActivatedRoute, private nbMenuService: NbMenuService, private reportService: ReportService) { }

  fillPageInfo(){
    this.loading = true;
    this.web.getData(`reportsPendingOld`).then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.tableSource = [...res.streets];
      }else{
        this.tableSource = [];
        this.common.showToast('warning', 'Warning', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Error');
    });


  this.menuSubscription = this.nbMenuService.onItemClick().pipe().subscribe((res:any)=>{
      // console.log('res :>> ', res);
      if(res.item.attr=='pdf'){
        this.generatePdf();
      }else if(res.item.attr=='xlsx'){
        this.generateXlsx();
      }
    })
  }

  generatePdf(){
   let report = this.reportService.generateOldReportHTML(this.tableSource);

    var html = htmlToPdfmake(report);
    const documentDefinition:any = { content: html,  styles:{
      clr:{ // we define the class called "red"
        color:'red'
      },
      changemargin:{
        marginTop: 8,
        marginBottom: 0
      }
    }
    ,
    pageSize: 'A4',
    pageMargins: [ 40, 60, 40, 60 ]
   };
    pdfMake.createPdf(documentDefinition).download('Old Pendings - '+new Date())+'.pdf';

  }

  generateXlsx(){
     this.reportService.generateOldReportExcel( this.tableSource);
  }

  ngOnInit(): void {
    this.fillPageInfo();

    // console.log('pdfMake :>> ', pdfMake);
  }

  ngOnDestroy(){
    this.menuSubscription.unsubscribe();
  }

}
