import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import CollectionStreetsModel from './collection-streets-form/collection-streets-model';

import { CollectionStreetsFormComponent } from "./collection-streets-form/collection-streets-form.component";
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
import { CollectionStreetsFormService } from "./collection-streets-form/collection-streets-form.service";
import { ActivatedRoute, Router } from "@angular/router";

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
  collectionId:string|number;
  collectionInfo:any = {
    collection_name: '',
    collection_year: ''
  };
  statsInfo:any = {};

  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    public common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: CollectionStreetsFormService
  ) { }

  ngOnInit() {
    this.collectionId = this.route.snapshot.params['collectionId'];
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
      all_families_counts: {
        title: 'Total Families',
        type: 'string',
        valuePrepareFunction: (column:null, row:any)=>{
          return row.all_families_count;
        }
      },
      contributed_count: {
        title: "Contributed",
        type: "string"
      },
      cleared_count: {
        title: 'Cleared',
        type: 'string'
      },
      all_families_count: {
        title: 'Pending (Families)',
        type: 'string',
        valuePrepareFunction: (col, row, event)=>{
          return row.all_families_count - row.cleared_count;
        }
      },
      collected_amount: {
        title: 'Collected Amount(Rs)',
        type: 'string',
        valuePrepareFunction: (data)=>{
          return !data? '0': this.common.currencyFormatter(data);
        }
      }
    }
  };

  editRow(event: any) :void {

    const data = event.data;

    this.router.navigate(['/list-collections', this.collectionId, data.id]);
  }


  getPageData() :void{
    this.loading = true;
    this.web.getData('getCollection/'+this.collectionId).then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.tableSource = res.data;
        this.collectionInfo = res.collection;
        this.statsInfo = res.stats;
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



}
