/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import StreetsModel from './list-streets-model';

@Injectable({
  providedIn: 'root'
})
export class StreetsFormService {

  constructor(private common: CommonService) {

  }


  //validations
  streetsFormValidation(val: StreetsModel) {
    const action = val.action == "add";
    console.log(action);
    if (val.street_name == null || val.street_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter street name.');
      document.getElementById('street_name').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
