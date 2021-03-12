import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { NbWindowRef, NB_WINDOW_CONTEXT } from "@nebular/theme";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
import ListStreetsModel from "./list-streets-model";
import { ListStreetsFormService } from "./list-streets-form.service";

@Component({
  selector: "ngx-listStreets-form",
  templateUrl: "./list-streets-form.component.html",
  styleUrls: ["./list-streets-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 1}))
        ])
      ]
    )
  ]
})
export class ListStreetsFormComponent implements OnInit {
  dialogData: ListStreetsModel;
  dialogAction:string;
  base_url:string = environment.base_url;
  loading:boolean = false;
  fetchingStatus:boolean = false;


  constructor(
    @Inject(NB_WINDOW_CONTEXT) context,
    public windowRef: NbWindowRef,
    private formService: ListStreetsFormService,
    private common: CommonService,
    private web: WebService
  ) {
    this.dialogData = context.data;
    this.dialogAction = context.action;
    this.dialogData.action = context.action;
  }


  closeWindow() {
    this.windowRef.close();
  }


  firstLetterCapitalize(data:string){
    let a = data.split('').map((x,i)=>{if(i==0){x = x.toUpperCase();}return x;}).join('')
    return a;
  }


  async ngOnInit(): Promise<void> {

    console.log(this.dialogData);
    this.dialogData.listStreets_status = this.dialogData.listStreets_status == 1 ;
    if(this.dialogAction=='add'){
      this.dialogData.type='2';
    }

  }

  async submitFormResults(){
    console.log(this.dialogData);
    let confirm = await this.formService.listStreetsFormValidation(this.dialogData);
    console.log(confirm);
    if(confirm){
      this.loading = true;
      this.dialogData.listStreets_status == this.dialogData.listStreets_status ? 1 : 0;
       this.dialogData.type='2';

    }else{
      this.loading = false;
    }
  }


  timeStamptoDate(str:number){
    let d = new Date(str*1000);
    return d;
  }



}
