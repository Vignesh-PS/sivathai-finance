import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { OldcollectionFamilyFormService } from "./oldcollection-family-form.service";
import { ActivatedRoute, Router } from "@angular/router";
import OldcollectionFamilyModel from "./oldcollection-family-model";
import { NbWindowRef, NB_WINDOW_CONTEXT } from "@nebular/theme";
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-oldcollection-streets-form",
  templateUrl: "./oldcollection-family-form.component.html",
  styleUrls: ["./oldcollection-family-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class OldcollectionFamilyFormComponent implements OnInit {
  dialogData: any;
  dialogAction: string;
  base_url: string = environment.base_url;
  loading: boolean = false;
  listFamilies:any = [];
  listOldCollections:any = [];
  listStreets:any = [];

  familyGroups: any[]=[];

  constructor(
    @Inject(NB_WINDOW_CONTEXT) context,
    private formService: OldcollectionFamilyFormService,
    public windowRef: NbWindowRef,
    public common: CommonService,
    private web: WebService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialogData = context.data;
    this.dialogAction = context.action;
    this.dialogData.action = context.action;
  }

  afterSelectFamily(id:number){
    console.log('id :>> ', id);
    let family = this.listFamilies.filter(x => x.id==id)[0];
    this.dialogData.old_detail_tax_count = family.family_tax_count;


    // console.log(family[0]);
  }

  closeWindow() {
    this.windowRef.close();
  }

  editRow(event: any) :void {

    const data = event.data;

  }

  fillPageInfo(){

    this.loading = true;
    this.web.getData('getFamilies').then(res=>{
      if(res.status=='200'){
        // this.tableSource = res.data;
        this.listStreets = res.streets;
        this.listFamilies = res.data;
        this.mappingData();
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
      })
      .then(res=>{
        this.web.getData('getOldcollection').then(res=>{
          this.loading = false;
          if(res.status=='200'){
            this.listOldCollections = res.data;
          }else{
            this.common.showToast('warning', 'No data', res.error);
          }
        })
          .catch(err=>{
            this.loading = false;
            this.common.showToast('danger', 'Error', 'Connection Error');
          })
      })
      .catch(err=>{
        this.loading = false;
        this.common.showToast('danger', 'Error', 'Connection Error');
      })



  }

  mappingData(){
    let groups = [];
    for(let streets of this.listStreets){
      var street:any = {};
      street.name = streets.street_name;
      street.id = streets.id;
      street.children = this.listFamilies.filter(x => x.family_street_id == streets.id);
      groups.push(street);
    }
    console.log('groups :>> ', groups);

    this.familyGroups = groups;
  }

  async ngOnInit() {

   this.fillPageInfo();

  }

  submitFormResults(){


  }

  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
