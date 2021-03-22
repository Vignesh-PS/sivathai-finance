import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import CollectionsModel from './collections-form/collections-model';

import { CollectionsFormComponent } from "./collections-form/collections-form.component";
import { CommonService } from "../../services/common.service";
import { WebService } from "../../services/web.service";
import { environment } from "../../../environments/environment";
import { CollectionsFormService } from "./collections-form/collections-form.service";

@Component({
  selector: "ngx-collections",
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class CollectionsComponent implements OnInit {
  //tableSettings:any;
  tableSource: any[];
  base_url: string = environment.base_url;
  loading: boolean;
  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
    private formService: CollectionsFormService
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
      collection_name: {
        title: "Collection Name",
        type: "string"
      },
      collection_year: {
        title: "Year",
        type: "string"
      },
      collection_amount: {
        title: 'Amount for 1 tax',
        type: 'string'
      }
    }
  };

  onCustomAction(event: any) :void{
    console.log(event);
  }

  selectRow(event: any) :void{
    const data = event.data
    const w = this.windowService.open(CollectionsFormComponent, {
      title: `View Collections`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: data, action: 'view' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      //this.ngOnInit();
    });
  }

  createRow() :void {
    const w = this.windowService.open(CollectionsFormComponent, {
      title: `Add Collection`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: new CollectionsModel(), action: 'add' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) :void {

    const data = event.data;

    const w = this.windowService.open(CollectionsFormComponent, {
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
      this.web.postData('deleteCollection/'+event.data.id, {})
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
    this.web.getData('getCollection').then(res=>{
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
