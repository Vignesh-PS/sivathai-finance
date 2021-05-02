/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import OldcollectionsModel from './oldcollections-model';

@Injectable({
  providedIn: 'root'
})
export class OldcollectionsFormService {

  constructor(private common: CommonService) {

  }


  //validations
  oldcollectionsFormValidation(val: OldcollectionsModel) {
    const action = val.action == "add";
    console.log(action);
    if (val.old_collection_name == null || val.old_collection_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter oldcollection name.');
      document.getElementById('oldcollection_name').focus();
      return false;
    }  else  if (val.old_collection_year == null || val.old_collection_year == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter year.');
      document.getElementById('oldcollection_year').focus();
      return false;
    }  else  if (val.old_collection_amount == null || val.old_collection_amount == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter amount.');
      document.getElementById('oldcollection_amount').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
