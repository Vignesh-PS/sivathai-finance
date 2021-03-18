import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import FamiliesModel from './families-form/families-model';

import { FamiliesFormComponent } from "./families-form/families-form.component";
import { CommonService } from "../../services/common.service";
import { WebService } from "../../services/web.service";
import { environment } from "../../../environments/environment";
import { FamiliesFormService } from "./families-form/families-form.service";

@Component({
  selector: "ngx-families",
  templateUrl: "./families.component.html",
  styleUrls: ["./families.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class FamiliesComponent implements OnInit {
  //tableSettings:any;
  tableSource: any[];
  base_url: string = environment.base_url;
  loading: boolean;
  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
    private formService: FamiliesFormService
  ) { }

  ngOnInit(): void {
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
      family_unique_id: {
        title: "Family No",
        type: "string"
      },
      family_head_name: {
        title: "Family Head",
        type: "string"
      },
      family_street_name: {
        title: "Street Name",
        type: "string"
      },
      family_no_of_members: {
        title: "No of members",
        type: "string"
      },
      family_tax_count: {
        title: "No of Tax",
        type: "string"
      }
    }
  };

  onCustomAction(event: any) :void{
    console.log(event);
  }

  selectRow(event: any) :void{
    const data = event.data
    const w = this.windowService.open(FamiliesFormComponent, {
      title: `View Families`,
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
    const w = this.windowService.open(FamiliesFormComponent, {
      title: `Add Family`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: new FamiliesModel(), action: 'add' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) :void {

    const data = event.data;

    const w = this.windowService.open(FamiliesFormComponent, {
      title: `Edit Family`,
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
      this.web.postData('deleteFamily/'+event.data.id, {})
        .then(res=>{
          if(res.status==200){
            this.getPageData();
            this.common.showToast('success', 'Success', res.error);
          }else{
            this.common.showToast('warning', 'Failed', res.error);
          }
        })
        .catch(err=>{
          this.common.showToast('danger', 'Error', 'Connection Error');
        })

    }

  }

  getPageData() :void{
    this.loading = true;
    this.web.getData('getFamilies').then(res=>{
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
