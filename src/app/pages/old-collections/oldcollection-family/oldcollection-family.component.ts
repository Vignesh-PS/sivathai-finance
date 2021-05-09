import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import OldcollectionFamilyModel from './oldcollection-family-form/oldcollection-family-model';

import { OldcollectionFamilyFormComponent } from "./oldcollection-family-form/oldcollection-family-form.component";
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
import { OldcollectionFamilyFormService } from "./oldcollection-family-form/oldcollection-family-form.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-oldcollection-streets",
  templateUrl: "./oldcollection-family.component.html",
  styleUrls: ["./oldcollection-family.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class OldcollectionFamilyComponent implements OnInit {
  tableSource: any[];
  base_url: string = environment.base_url;
  loading: boolean;
  totalFamilies:number;
  listStreets:any = [];
  selectedStreet:string = '';
  tableSourceTemp:any = [];

  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    public common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: OldcollectionFamilyFormService
  ) { }

  ngOnInit() {
    this.getPageData();
  }

  tableSettings: any = {
    add: {
      addButtonContent: '<i class="fa fa-plus-circle"></i>'
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      //confirmDelete: true,
    },
    actions: {
      columnTitle: "Actions",
      add: true,
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
      family_unique_id: {
        title: "Family No",
        type: "string"
      },
      street_name: {
        title: 'Street Name',
        type: 'string'
      },
      people_name: {
        title: "Family Head",
        type: "string"
      },
      old_collection_count: {
        title: 'Pendings (Function Names)',
        type: 'html',
        valuePrepareFunction: (col:string, row:OldcollectionFamilyModel, event:any)=>{
          if(!col){
            return '<i class="fa fa-check-circle text-success"></i> &nbsp;All Cleared';
          }
          return `<i class="fa fa-exclamation-circle text-black-50"></i> &nbsp; ${row.old_collection_count} (${row.old_collection_names.length<80 ? row.old_collection_names: row.old_collection_names.substring(0, 80)+'...'})`;
        }
      }
    }
  };

  createRow(){
    const w = this.windowService.open(OldcollectionFamilyFormComponent, {
      title: `Add Collection`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: new OldcollectionFamilyModel(), action: 'add' },
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) :void {

    const w = this.windowService.open(OldcollectionFamilyFormComponent, {
      title: `View Family - ${event.data.people_name}`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: event.data, action: 'view' },
      windowClass: "formWindowPending",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
    // const data = event.data;

    // this.router.navigate(['/list-oldcollections', this.oldcollectionId, data.id]);
  }


  getPageData() :void{
    this.loading = true;
    this.web.getData('getOldCollectionDetails').then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.totalFamilies = res.families_count;
        this.listStreets = res.streets;
        // this.tableSource = res.data;
        this.tableSourceTemp = [...res.data];
        this.mappingTableData(this.selectedStreet);
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

  mappingTableData(street:any){
    let data = [...this.tableSourceTemp];
    if(street==null || street==''){
      this.tableSource = data;
      return;
    }

    this.tableSource = data.filter((x: any)=> x.old_detail_street_id==street);

  }

}
