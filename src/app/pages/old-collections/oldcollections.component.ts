import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import OldcollectionsModel from './oldcollections-form/oldcollections-model';

import { OldcollectionsFormComponent } from "./oldcollections-form/oldcollections-form.component";
import { CommonService } from "../../services/common.service";
import { WebService } from "../../services/web.service";
import { environment } from "../../../environments/environment";
import { OldcollectionsFormService } from "./oldcollections-form/oldcollections-form.service";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-oldcollections",
  templateUrl: "./oldcollections.component.html",
  styleUrls: ["./oldcollections.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class OldcollectionsComponent implements OnInit {
  //tableSettings:any;
  tableSource: any[];
  base_url: string = environment.base_url;
  loading: boolean;
  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
    private router: Router,
    private formService: OldcollectionsFormService
  ) { }

  ngOnInit() {
    this.getPageData();
  }

  tableSettings: any = {
    add: {
      addButtonContent: '<i class="fa fa-plus-circle"></i>'
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
      old_collection_name: {
        title: "Collection Name",
        type: "string"
      },
      old_collection_year: {
        title: "Year",
        type: "string"
      },
      old_collection_amount: {
        title: 'Amount for 1 tax',
        type: 'string',
        valuePrepareFunction: (data)=>{
          return this.common.currencyFormatter(data);
        }
      }
    }
  };

  onCustomAction(event: any) :void{
    console.log(event);
  }

  createRow() :void {
    const w = this.windowService.open(OldcollectionsFormComponent, {
      title: `Add Collection`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: new OldcollectionsModel(), action: 'add' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) :void {

    const data = event.data;

    const w = this.windowService.open(OldcollectionsFormComponent, {
      title: `Edit Collection`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: data, action: 'edit' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  deleteRow(event: any) :void{
    console.log(event);
    if (window.confirm('Are you sure you want to delete..?')) {
      this.loading = true;
      this.web.postData('deleteOldcollection/'+event.data.id, {})
      .then(res=>{
          this.loading = false;
          if(res.status==200){
            this.getPageData();
            this.common.showToast('success', 'Success', res.error);
          }else{
            this.common.showToast('warning', 'Failed', res.error);
          }
        })
        .catch(err=>{
          this.loading = false;
          this.common.showToast('danger', 'Error', 'Connection Error');
        });

    }

  }

  getPageData() :void{
    this.loading = true;
    this.web.getData('getOldcollection').then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.tableSource = res.data;
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
    })
      .catch(err=>{
        this.loading = false;
        this.common.showToast('danger', 'Error', 'Connection Error');
      })
    //this.loading = false;
  }

  // mappingTableData(val:any){
  //   this.tableSource = val;
  //   this.tableSourceTemp = JSON.parse(JSON.stringify(val));
  // }



}
