import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { NbWindowRef, NB_WINDOW_CONTEXT } from "@nebular/theme";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonService } from "../../../services/common.service";
import { WebService } from "../../../services/web.service";
import { environment } from "../../../../environments/environment";
// import StreetsModel from "./list-streets-model";
import { StreetsFormService } from "./list-streets-form.service";

@Component({
  selector: "ngx-streets-form",
  templateUrl: "./list-streets-form.component.html",
  styleUrls: ["./list-streets-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 1 }))
      ])
    ]
    )
  ]
})
export class StreetsFormComponent implements OnInit {
  dialogData: any;
  dialogAction: string;
  base_url: string = environment.base_url;
  loading: boolean = false;
  fetchingStatus: boolean = false;


  constructor(
    @Inject(NB_WINDOW_CONTEXT) context,
    public windowRef: NbWindowRef,
    private formService: StreetsFormService,
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


  async ngOnInit() {

  }

  submitFormResults() {
    console.log(this.dialogData);
    const confirm = this.formService.streetsFormValidation(this.dialogData);
    console.log(confirm);
    if (confirm) {

      const action = this.dialogAction;
      if (action == 'add') {
        this.loading = true;
        this.web.postData('streetAdd', this.dialogData).then(res => {
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
        this.web.postData('updateStreet/' + this.dialogData.id, this.dialogData).then(res => {
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
