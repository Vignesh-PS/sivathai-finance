import { Component, OnInit, Inject, ViewEncapsulation, TemplateRef } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { OldcollectionFamilyFormService } from "./oldcollection-family-form.service";
import { ActivatedRoute, Router } from "@angular/router";
import OldcollectionFamilyModel from "./oldcollection-family-model";
import { NbDialogService, NbWindowRef, NB_WINDOW_CONTEXT } from "@nebular/theme";
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
  flipped:boolean;

  familyInfo:any = {};
  familyPendings:any = [];
  familyTaxes:any = [];

  selectedCollection:any = {};
  taxAmount:number;

  constructor(
    @Inject(NB_WINDOW_CONTEXT) context,
    private formService: OldcollectionFamilyFormService,
    public windowRef: NbWindowRef,
    public common: CommonService,
    private web: WebService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: NbDialogService
  ) {
    this.dialogData = context.data;
    this.dialogAction = context.action;
    this.dialogData.action = context.action;
  }


  addContribution(dialog:TemplateRef<any>, oldCol:any){
    this.selectedCollection = oldCol;
    const d = this.dialog.open(dialog, {

    })

    d.onClose.pipe().subscribe(res=>{

    })

  }

  addTaxesAmount(dialog:any){

    if(!this.taxAmount || this.taxAmount<1){
      this.common.showToast('warning', 'Warning', 'Invalid amount');
      return;
    }

    const data = {
      old_tax_collection_id: this.selectedCollection.collection_id,
      old_tax_collection_detail_id: this.selectedCollection.old_detail_collection_id,
      old_tax_family_id: this.familyInfo.id,
      old_tax_amount: this.taxAmount
    };

    this.selectedCollection.old_detail_contributed += this.taxAmount;

    let contribut = {...this.selectedCollection, contribute: data};
    console.log('contribute :>> ', contribut);

    this.web.postData('addOldCollectionTaxes', contribut).then(res=>{
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

    this.taxAmount = 0;


  }

  afterSelectFamily(id:number){
    console.log('id :>> ', id);
    let family = this.listFamilies.filter(x => x.id==id)[0];
    this.dialogData.old_detail_tax_count = family.family_tax_count;
    this.dialogData.old_detail_street_id = family.family_street_id;
    // this.dialogData.old_detail_amount = this.dialogData.old_detail_tax_count * oldCollection.old_collection_amount;
    // console.log(family[0]);
  }

  afterSelectCollection(id:number){
    let oldCollection  = this.listOldCollections.filter(x => x.id==id)[0];
    this.dialogData.old_detail_amount = this.dialogData.old_detail_tax_count * oldCollection.old_collection_amount;


  }

  alertAmountRemove(tax:any){
    if(window.confirm('Are you sure to remove..?')){
      // this.collectionDetailsInfo.detail_contributed -= tax.tax_amount;

      // let contribut = {...this.collectionDetailsInfo, contribute: tax.id};
      // console.log('contribute :>> ', contribut);

      // this.web.postData('removeCollectionTaxesOld', contribut).then(res=>{
      //   this.fillPageInfo();
      //   if(res.status==200){
      //   }else{
      //     this.common.showToast('warning', 'No data', res.error);
      //   }
      // })
      // .catch(err=>{
      //   this.fillPageInfo();
      //   this.common.showToast('danger', 'Error', 'Connection Error');
      // });
    }
  }

  closeWindow() {
    this.windowRef.close();
  }

  editRow(event: any) :void {

    const data = event.data;

  }

  fillPageInfo(){
    if(this.dialogAction=='add' || this.dialogAction=='edit'){
      this.forAddCollection();
    }else{
      this.forViewCollection();
    }

  }

  forAddCollection(){
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

  forViewCollection(){
    this.loading = true;
    this.web.getData(`getOldCollectionDetails/${this.dialogData.old_detail_family_id}`).then(res=>{
      console.log('res :>> ', res);
      this.loading = false;
      if(res.status=='200'){
        this.familyInfo = res.family;
        this.familyPendings = res.collections;
        this.familyTaxes = res.taxes;
      }else{
        this.common.showToast('warning', 'No data', res.error);
      }
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

    console.log('this.dialogData :>> ', this.dialogData);

    // return;

    let confirm = this.formService.collectionFormValidation(this.dialogData);
    if(!confirm){
      return;
    }

    this.loading = true;
    this.web.postData('oldCollectionEntry', this.dialogData).then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.common.showToast('success', 'Success', res.error);
        this.closeWindow();
      }else{
        this.common.showToast('warning', 'Warning', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Errror');
    });

  }

  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
