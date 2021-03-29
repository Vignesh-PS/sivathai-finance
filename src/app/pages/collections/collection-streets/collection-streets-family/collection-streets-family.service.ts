/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import CollectionstreetfamilysModel from './collection-streets-family-model';

@Injectable({
  providedIn: 'root'
})
export class CollectionstreetfamilysFormService {

  constructor(private common: CommonService) {

  }


  //validations
  collectionstreetfamilysFormValidation(val: CollectionstreetfamilysModel) {
    const action = val.action == "add";
    console.log(action);
    if (val.collectionstreetfamily_name == null || val.collectionstreetfamily_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter collectionstreetfamily name.');
      document.getElementById('collectionstreetfamily_name').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
