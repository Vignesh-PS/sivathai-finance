/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import CollectionsModel from './collections-model';

@Injectable({
  providedIn: 'root'
})
export class CollectionsFormService {

  constructor(private common: CommonService) {

  }


  //validations
  collectionsFormValidation(val: CollectionsModel) {
    const action = val.action == "add";
    console.log(action);
    if (val.collection_name == null || val.collection_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter collection name.');
      document.getElementById('collection_name').focus();
      return false;
    }  else  if (val.collection_year == null || val.collection_year == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter year.');
      document.getElementById('collection_year').focus();
      return false;
    }  else  if (val.collection_amount == null || val.collection_amount == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter amount.');
      document.getElementById('collection_amount').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
