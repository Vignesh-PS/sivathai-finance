import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NbWindowService, NbWindowConfig } from "@nebular/theme";
import ListStreetsModel from './list-streets-form/list-streets-model';
import { environment} from './../../../environments/environment';
import { WebService } from './../../services/web.service';
import { CommonService } from './../../services/common.service';
import { ListStreetsFormComponent } from "./list-streets-form/list-streets-form.component";

@Component({
  selector: "ngx-listStreets",
  templateUrl: "./listStreets.component.html",
  styleUrls: ["./listStreets.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class ListStreetsComponent implements OnInit {
  //tableSettings:any;
  tableSource: ListStreetsModel[];
  base_url: string = environment.base_url;
  loading:boolean;
  constructor(
    private windowService: NbWindowService,
    private web: WebService,
    private common: CommonService,
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

      listStreets_status:{
        title: "Status",
        type: 'html',
        width: '30px',
        valuePrepareFunction:(data:any)=>{
          let active = data==1;
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
    let data = event.data
    let w = this.windowService.open(ListStreetsFormComponent, {
      title: `View ListStreets`,
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
    let w = this.windowService.open(ListStreetsFormComponent, {
      title: `Add ListStreets`,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context:  {data: new ListStreetsModel(), action: 'add'} ,
      windowClass: "formWindow",
    });

    w.onClose.pipe().subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  editRow(event: any) {

    let id = event.data.web_id;
    let data = event.data;

    let w = this.windowService.open(ListStreetsFormComponent, {
      title: `Edit ListStreets`,
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

  }

  // mappingTableData(val:any){
  //   this.tableSource = val;
  //   this.tableSourceTemp = JSON.parse(JSON.stringify(val));
  // }



}
