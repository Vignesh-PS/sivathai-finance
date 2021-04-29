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
  selector: 'app-pendings',
  templateUrl: './pendings.component.html',
  styleUrls: ['./pendings.component.scss']
})
export class PendingsComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;


  loading:boolean;
  tableSource: any = [];
  tableSourceTemp: any = [];
  collectionInfo: any = {};
  collectionId:any;
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
    this.web.getData(`reportsPending/${this.collectionId}`).then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.tableSourceTemp = [...res.data];
        this.collectionInfo = res.collection;
        this.mappingData(this.selectedReport);
      }else{
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
   this.collectionInfo.type = this.selectedReport;
   let report = this.reportService.generateReportHTML(this.collectionInfo, this.tableSource);

  //  console.log(report);

    var html = htmlToPdfmake(report);
    const documentDefinition:any = { content: html,  styles:{
      clr:{ // we define the class called "red"
        color:'red'
      },

    }
    ,
    pageSize: 'A4',
    pageMargins: [ 40, 60, 40, 60 ]
   };
    pdfMake.createPdf(documentDefinition).download(this.collectionInfo.collection_name+' - '+ this.selectedReport+' - '+new Date())+'.pdf';

  }

  generateXlsx(){
    this.collectionInfo.type = this.selectedReport;

    this.reportService.generateReportExcel(this.collectionInfo, this.tableSource);

  }

  mappingData(type:string){

    let collectionPendings = [];
  let mappedData = this.tableSourceTemp.map((street)=>{
    if(type=='Pending'){
      collectionPendings = street.collections.filter(x => x.detail_is_cleared!=1);
    }else if(type=='Completed'){
      collectionPendings = street.collections.filter(x => x.detail_is_cleared==1);
    }else{
      collectionPendings = street.collections;
    }

    let streetConvert = {
        id: street.id,
        street_name: street.street_name,
        total_contribute_count: street.total_contribute_count,
        total_cleared_count: street.total_cleared_count,
        total_amount: street.total_amount,
        total_families: street.total_families,
        collections: collectionPendings
    }
    return streetConvert;
  });

  this.tableSource = mappedData;

  }

  ngOnInit(): void {
    this.collectionId = this.activatedRoute.snapshot.params['collectionId'];
    this.fillPageInfo();

    // console.log('pdfMake :>> ', pdfMake);
  }

  ngOnDestroy(){
    this.menuSubscription.unsubscribe();
  }

}
