import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import CollectionStreetsModel from './collection-streets-form/collection-streets-model';

import { CollectionStreetsFormComponent } from "./collection-streets-form/collection-streets-form.component";
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
import { CollectionStreetsFormService } from "./collection-streets-form/collection-streets-form.service";

@Component({
  selector: "app-collection-streets",
  templateUrl: "./collection-streets.component.html",
  styleUrls: ["./collection-streets.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class CollectionStreetsComponent implements OnInit {
  tableSource: any[];
  base_url: string = environment.base_url;
  loading: boolean;
  streetId:string|number;

  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
    private formService: CollectionStreetsFormService
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
      add: false,
      edit: true,
      delete: false,
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
      street_name: {
        title: "Street Name",
        type: "string"
      },
      street_families: {
        title: "No of families",
        type: "string"
      }
    }
  };

  onCustomAction(event: any) :void{
    console.log(event);
  }


  createRow() :void {
    const w = this.windowService.open(CollectionStreetsFormComponent, {
      title: `Add CollectionStreet`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: new CollectionStreetsModel(), action: 'add' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) :void {

    const data = event.data;

    const w = this.windowService.open(CollectionStreetsFormComponent, {
      title: `Edit CollectionStreet`,
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
      this.web.postData('deleteCollectionStreet/'+event.data.id, {})
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
    this.web.getData('getCollectionStreets').then(res=>{
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


  selectRow(event: any) :void{
    const data = event.data
    const w = this.windowService.open(CollectionStreetsFormComponent, {
      title: `View CollectionStreets`,
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

  // mappingTableData(val:any){
  //   this.tableSource = val;
  //   this.tableSourceTemp = JSON.parse(JSON.stringify(val));
  // }



}
