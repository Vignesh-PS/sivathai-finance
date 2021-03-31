import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { CollectionstreetfamilysFormService } from "./collection-streets-family.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-collection-street-family",
  templateUrl: "./collection-streets-family.component.html",
  styleUrls: ["./collection-streets-family.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CollectionstreetfamilyComponent implements OnInit {
  base_url: string = environment.base_url;
  loading: boolean = false;

  collectionId:any;
  streetId:any;
  familyId:any;

  collectionInfo:any = {};
  streetInfo:any = {};
  familyInfo:any = {};

  constructor(
    private formService: CollectionstreetfamilysFormService,
    private common: CommonService,
    private web: WebService,
    private route: ActivatedRoute
  ) {

  }


  closeWindow() {
  }

  fillPageInfo(){
    this.loading = true;
    this.web.getData(`getCollection/${this.collectionId}/${this.streetId}/${this.familyId}`)
    .then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.collectionInfo = res.collection;
        this.streetInfo = res.street;
        this.familyInfo = res.family;
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Error');
    })
  }


  async ngOnInit() {
    this.collectionId = this.route.snapshot.params['collectionId'];
    this.streetId = this.route.snapshot.params['streetId'];
    this.familyId = this.route.snapshot.params['familyId'];

    this.fillPageInfo();
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
