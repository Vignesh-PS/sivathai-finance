import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
// import CollectionstreetfamilysModel from "./list-collectionstreetfamilys-model";
import { CollectionstreetfamilysFormService } from "./collection-streets-family.service";

@Component({
  selector: "app-collection-street-family",
  templateUrl: "./collection-streets-family.component.html",
  styleUrls: ["./collection-streets-family.component.scss"],
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
export class CollectionstreetfamilyComponent implements OnInit {
  base_url: string = environment.base_url;
  loading: boolean = false;


  constructor(
    private formService: CollectionstreetfamilysFormService,
    private common: CommonService,
    private web: WebService
  ) {

  }


  closeWindow() {
  }


  async ngOnInit() {

  }

  submitFormResults() {
    // const confirm = this.formService.collectionstreetfamilysFormValidation(this.dialogData);
    // console.log(confirm);
    // if (confirm) {

    //   const action = this.dialogAction;
    //   if (action == 'add') {
    //     this.loading = true;
    //     this.web.postData('collectionstreetfamilyAdd', this.dialogData).then(res => {
    //       this.loading = false;
    //       if (res.status == '200') {
    //         this.closeWindow();
    //         this.common.showToast('success', 'Success', res.error);
    //       } else {
    //         this.common.showToast('warning', 'Warning', res.error);
    //       }
    //     })
    //       .catch(err => {
    //         this.loading = false;
    //         this.common.showToast('danger', 'Error', 'Connection Error');
    //       });
    //     } else {
    //     this.loading = true;
    //     this.web.postData('updateCollectionstreetfamily/' + this.dialogData.id, this.dialogData).then(res => {
    //       this.loading = false;
    //       if (res.status == '200') {
    //         this.closeWindow();
    //         this.common.showToast('success', 'Success', res.error);
    //       } else {
    //         this.common.showToast('warning', 'Warning', res.error);
    //       }
    //     })
    //     .catch(err => {
    //         this.loading = false;
    //         this.common.showToast('danger', 'Error', 'Connection Error');
    //       });
    //   }
    // } else {
    //   this.loading = false;
    // }
  }


  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
