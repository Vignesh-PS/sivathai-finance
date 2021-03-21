import { Component, OnInit, Inject, ViewEncapsulation, } from "@angular/core";
import { NbWindowRef, NB_WINDOW_CONTEXT } from "@nebular/theme";
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
import { FamiliesFormService } from "./families-form.service";
import FamiliesModel from "./families-model";

@Component({
  selector: "ngx-families-form",
  templateUrl: "./families-form.component.html",
  styleUrls: ["./families-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FamiliesFormComponent implements OnInit {
  familyId:number;
  dialogData: FamiliesModel = new FamiliesModel();
  dialogAction: string;
  base_url: string = environment.base_url;
  loading: boolean = false;
  fetchingStatus: boolean = false;
  listStreets:any = [];


  constructor(
    @Inject(NB_WINDOW_CONTEXT) context,
    public windowRef: NbWindowRef,
    private formService: FamiliesFormService,
    private common: CommonService,
    private web: WebService
  ) {
    //this.dialogData = context.data;
    this.familyId = context.data.id;
    this.dialogAction = context.action;
    this.dialogData.action = context.action;
  }

  checkUniqueIdExists(){
    if(this.dialogAction=='edit'){
      return false;
    }
    this.web.postData('checkUniqueExists', {uniqueId: this.dialogData.family_unique_id, family: this.familyId || ''})
    .then(res=>{
      if(res.status=='200'){
        if(res.data.length!=0){
          this.common.showToast('warning', 'Warning', res.error);
        }
      }
    })
    .catch(err=>{
      this.common.showToast('danger', 'Error', 'Connection Error');
    })
  }


  closeWindow() {
    this.windowRef.close();
  }

  fillPageInfo(){
    this.getAllStreets();

    if(!this.familyId){
      return;
    }
    this.web.getData('getFamily/'+this.familyId).then(res=>{
      if(res.status=='200'){
        this.dialogData = res.data;
      }else{
        this.common.showToast('warning', 'Warning', res.error);
        this.closeWindow();
      }
    })
    .catch(err=>{
      this.common.showToast('danger', 'Error', 'Connection Error');
    });

  }

  getAllStreets(){
    this.web.getData('getStreets').then(res=>{
      if(res.status=='200'){
        this.listStreets = res.data;
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
    })
      .catch(err=>{
        this.common.showToast('danger', 'Error', 'Connection Error');
      })
  }


  async ngOnInit() {

    this.fillPageInfo();
  }

  submitFormResults() {
    console.log(this.dialogData);
    const confirm = this.formService.familiesFormValidation(this.dialogData);
    console.log(confirm);
    if (confirm) {

      const action = this.dialogAction;
      if (action == 'add') {
        this.loading = true;
        this.web.postData('familyAdd', this.dialogData).then(res => {
          this.loading = false;
          if (res.status == '200') {
            this.closeWindow();
            this.common.showToast('success', 'Success', res.error);
          } else {
            this.common.showToast('warning', 'Warning', res.error);
          }
        })
          .catch(err => {
            this.loading = false;
            this.common.showToast('danger', 'Error', 'Connection Error');
          });
        } else {
        this.loading = true;
        this.web.postData('updateFamily/' + this.dialogData.id, this.dialogData).then(res => {
          this.loading = false;
          if (res.status == '200') {
            this.closeWindow();
            this.common.showToast('success', 'Success', res.error);
          } else {
            this.common.showToast('warning', 'Warning', res.error);
          }
        })
        .catch(err => {
            this.loading = false;
            this.common.showToast('danger', 'Error', 'Connection Error');
          });
      }
    } else {
      this.loading = false;
    }
  }


  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
