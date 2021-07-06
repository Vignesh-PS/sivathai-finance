import { Component, OnInit, Inject, ViewEncapsulation, TemplateRef } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { CollectionstreetfamilysFormService } from "./collection-streets-family.service";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { NbDialogService } from "@nebular/theme";

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
  collectionDetailsInfo:any = {};
  streetInfo:any = {};
  familyInfo:any = {};
  familyHeadInfo:any = {};
  creditInfo:any = [];
  taxAmount:number = 0;
  taxReceipt:any;
  tax_received:any;

  constructor(
    private formService: CollectionstreetfamilysFormService,
    public common: CommonService,
    private web: WebService,
    private route: ActivatedRoute,
    private date: DatePipe,
    private dialog: NbDialogService
  ) {

  }

  alertAmountRemove(tax:any){
    if(window.confirm('Are you sure to remove..?')){
      this.collectionDetailsInfo.detail_contributed -= tax.tax_amount;

      let contribut = {...this.collectionDetailsInfo, contribute: tax.id};
      console.log('contribute :>> ', contribut);

      this.web.postData('removeCollectionTaxes', contribut).then(res=>{
        this.fillPageInfo();
        if(res.status==200){
        }else{
          this.common.showToast('warning', 'No data', res.error);
        }
      })
      .catch(err=>{
        this.fillPageInfo();
        this.common.showToast('danger', 'Error', 'Connection Error');
      });
    }
  }

  addContribution(dialog:TemplateRef<any>){
    const d = this.dialog.open(dialog, {

    })

    d.onClose.pipe().subscribe(res=>{

    })

  }

  addTaxesAmount(dialog:any){

     console.log(this.tax_received);

    if(!this.taxReceipt || this.taxReceipt==''){
      this.common.showToast('warning', 'Warning', 'Enter a receipt no');
      return;
    }

    if(!this.tax_received || this.tax_received==''){
      this.common.showToast('warning', 'Warning', 'Choose a received date');
      return;
    }

    if(!this.taxAmount || this.taxAmount<1){
      this.common.showToast('warning', 'Warning', 'Invalid amount');
      return;
    }


    const data = {
      tax_collection_id: this.collectionId,
      tax_collection_detail_id: this.collectionDetailsInfo.id,
      tax_family_id: this.familyId,
      tax_amount: this.taxAmount,
      tax_received: this.tax_received.getTime(),
      tax_receipt: this.taxReceipt
    };

    // return;

    let contributeAmount = 0;
    this.creditInfo.forEach((x:any) => {
      contributeAmount += x.tax_amount;
    });

    contributeAmount += this.taxAmount;

    this.collectionDetailsInfo.detail_contributed = contributeAmount;

    let contribut = {...this.collectionDetailsInfo, contribute: data};
    console.log('contribute :>> ', contribut);

    this.web.postData('addCollectionTaxes', contribut).then(res=>{
      if(res.status==200){
        this.fillPageInfo();
        dialog.close();
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
    })
    .catch(err=>{
      this.common.showToast('danger', 'Error', 'Connection Error');
    })

    //  this.creditInfo.push(data);
    // this.taxesAmountSerial();
    // this.updateCollectionTaxes();

    this.taxAmount = 0;


  }

  changeClearStatus(stat:number){
    let status = stat;
    if(window.confirm('Are you sure to proceed..?')){
      let contribute = {...this.collectionDetailsInfo};
      contribute.detail_is_cleared = status;
      this.web.postData('updateClearStatus', contribute)
        .then(res=>{
          if(res.status=='200'){
            this.fillPageInfo();
            this.common.showToast('success', 'Success', res.error);
          }else{
            this.common.showToast('warning', 'Warning', res.error);
          }
        })
        .catch(err=>{
          this.common.showToast('danger', 'Error', 'Connection Error');
        })
    }
  }

  fillPageInfo(){
    this.web.getData(`getCollection/${this.collectionId}/${this.streetId}/${this.familyId}`)
    .then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.collectionInfo = res.collection;
        this.collectionDetailsInfo = res.data;
        this.streetInfo = res.street;
        this.familyInfo = res.family;
        this.familyHeadInfo = res.family_head;
        this.creditInfo = res.credit_info;
        this.taxesAmountSerial();
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

    this.loading = true;
    this.fillPageInfo();
  }


  taxesAmountSerial(){

    this.creditInfo = this.creditInfo.map((x, index)=>{
      x.sno = index + 1;
      return x;
    });

  }

  timeStamptoDate(str) {
    if(!str){
      return false;
    }

    let d = new Date(parseInt(str));
    // d = new Date();
    return d;
  }

  updateCollectionTaxes(){
    let contributeAmount = 0;
    this.creditInfo.forEach((x:any) => {
      contributeAmount += x.tax_amount;
    });

    this.collectionDetailsInfo.detail_contributed = contributeAmount;
    let contribut = {...this.collectionDetailsInfo, contribute: this.creditInfo};
    console.log('contribute :>> ', contribut);

    this.web.postData('updateCollectionTaxes', contribut).then(res=>{
      if(res.status==200){
        this.fillPageInfo();
      }
    })
    .catch(err=>{

    })

  }

  updateComments(){
    this.web.postData(`updateCollectionComments/${this.collectionDetailsInfo.id}`, this.collectionDetailsInfo)
    .catch(err=>{

    })
  }

}
