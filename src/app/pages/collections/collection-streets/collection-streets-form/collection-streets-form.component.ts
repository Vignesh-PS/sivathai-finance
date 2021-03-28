import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { CollectionStreetsFormService } from "./collection-streets-form.service";
import { ActivatedRoute } from "@angular/router";
import CollectionStreetsModel from "./collection-streets-model";

@Component({
  selector: "app-collection-streets-form",
  templateUrl: "./collection-streets-form.component.html",
  styleUrls: ["./collection-streets-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CollectionStreetsFormComponent implements OnInit {
  base_url: string = environment.base_url;
  loading: boolean = false;
  collectionId:string|number;
  streetId:string|number;
  tableSource:CollectionStreetsModel[] = [];
  tableSourceTemp:CollectionStreetsModel[] = [];
  statsInfo:any = {};
  collectionInfo:any = {};
  streetInfo:any = {};
  selectedList:string = '';

  constructor(
    private formService: CollectionStreetsFormService,
    public common: CommonService,
    private web: WebService,
    private route: ActivatedRoute
  ) {

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
    },
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: true,
      delete: false,
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
        title: "Name",
        type: "string"
      },
      tax_detail: {
        title: 'Tax Amount',
        type: 'string',
        // valuePrepareFunction:(colum:number, row:CollectionStreetsModel, ev:any)=>{
        //   return row.family_tax_count + ' x ' + row.
        // }
      },
      detail_contributed: {
        title: 'Collected Amount(Rs)',
        type: 'string',
        valuePrepareFunction: (data)=>{
          return !data? '0': this.common.currencyFormatter(data);
        }
      },
      members_count: {
        title: 'Members',
        type: 'string'
      }
    }
  };

  editRow(event: any) :void {

    const data = event.data;

    // this.router.navigate(['/list-collections', this.collectionId, data.id]);
  }

  fillPageInfo(){
    this.loading = true;
    this.web.getData(`getCollection/${this.collectionId}/${this.streetId}`)
    .then(res=>{
      this.loading = false;
      if(res.status=='200'){
        // this.tableSource = res.data;
        this.tableSourceTemp = [...res.data];
        this.mappingData('total');
        this.collectionInfo = res.collection;
        this.streetInfo = res.street;
        this.statsInfo = res.collection_stats;
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Error');
    })
  }

  mappingData(type:string){
    if(this.selectedList==type){
      return;
    }
    this.loading = true;

    let data = [...this.tableSourceTemp];
    switch (type) {
      case 'total':
        this.tableSource = [...data];
        break;
      case 'contributed':
        this.tableSource = data.filter(x=> x.detail_is_cleared==0);
        break
      case 'cleared':
        this.tableSource = data.filter(x=> x.detail_is_cleared==1);
        break;
      case 'pending':
        this.tableSource = data.filter(x=> (x.detail_is_cleared!=1));
        break;
      default:
        this.tableSource = [...data];
        break;
    }

    setTimeout(() => {
      this.loading = false;
    }, 800);

    this.selectedList = type;
  }

  async ngOnInit() {
    this.collectionId = this.route.snapshot.params['collectionId'];
    this.streetId = this.route.snapshot.params['streetId'];

   this.fillPageInfo();

  }




  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
