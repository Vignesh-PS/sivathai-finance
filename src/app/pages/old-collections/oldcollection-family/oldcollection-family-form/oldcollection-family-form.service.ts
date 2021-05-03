/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import OldcollectionFamilyModel from './oldcollection-family-model';

@Injectable({
  providedIn: 'root'
})
export class OldcollectionFamilyFormService {

  constructor(private common: CommonService) {

  }

  collectionFormValidation(val:any){
    if(val.old_detail_family_id==null || val.old_detail_family_id==''){
      this.common.showToast('warning', 'Warning', 'Choose family');

      return false;
    }else if(val.old_detail_collection_id==null || val.old_detail_collection_id==''){
      this.common.showToast('warning', 'Warning', 'Choose collection');
      return false;
    }else if(val.old_detail_tax_count==null || val.old_detail_tax_count==''){
      this.common.showToast('warning', 'Warning', 'Enter Tax Count');
      return false;
    }else if(val.old_detail_amount==null || val.old_detail_amount==''){
      this.common.showToast('warning', 'Warning', 'Enter Amount');
      return false;
    }else {
      return true;
    }

  }


}
