import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import StreetsModel from './list-streets-form/list-streets-model';

import { StreetsFormComponent } from "./list-streets-form/list-streets-form.component";
import { CommonService } from "../../services/common.service";
import { WebService } from "../../services/web.service";
import { environment } from "../../../environments/environment";
import { StreetsFormService } from "./list-streets-form/list-streets-form.service";

@Component({
  selector: "ngx-streets",
  templateUrl: "./list-streets.component.html",
  styleUrls: ["./list-streets.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class StreetsComponent implements OnInit {
  //tableSettings:any;
  tableSource: any[];
  base_url: string = environment.base_url;
  loading:boolean;
  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
    private formService: StreetsFormService
  ) {}

  tableSettings: any = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>'
    },
    edit: {
      editButtonContent: '<i class="fa fa-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      //confirmDelete: true,
    },
    actions: {
      columnTitle: "Actions",
      add: true,
      edit: true,
      delete: true,
      //   custom: [
      //   { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
      // ],
      position: "right",
    },
    sort: true,
    mode: "external",
    pager: {
      perPage: 15
    },
    columns: {
      user_name: {
        title: "User Name",
        type: "string",

      },

      streets_status:{
        title: "Status",
        type: 'html',
        width: '30px',
        valuePrepareFunction:(data:any)=>{
          const active = data==1;
          return active?'<i class="far fa-check-circle check"></i>': '<i class="far fa-times-circle times"></i>';
        }
      }
    },
  };

  ngOnInit(): void {

    this.getPageData();
  }

  onCustomAction(event: any) {
    console.log(event);
  }

  selectRow(event: any) {
    const data = event.data
    const w = this.windowService.open(StreetsFormComponent, {
      title: `View Streets`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context:  {data: data, action: 'view'} ,
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      //this.ngOnInit();
    });
  }

  createRow() {
    const w = this.windowService.open(StreetsFormComponent, {
      title: `Add Street`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context:  {data: new StreetsModel(), action: 'add'} ,
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) {

    const id = event.data.web_id;
    const data = event.data;

    const w = this.windowService.open(StreetsFormComponent, {
      title: `Edit Street`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context:  {data: data, action: 'edit'} ,
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  deleteRow(event: any) {
    console.log(event);
    if (window.confirm('Are you sure you want to delete..?')) {


    }

  }

  getPageData() {
    this.loading = true;
    this.tableSource = this.formService.getStreets();
    this.loading = false;
  }

  // mappingTableData(val:any){
  //   this.tableSource = val;
  //   this.tableSourceTemp = JSON.parse(JSON.stringify(val));
  // }



}
