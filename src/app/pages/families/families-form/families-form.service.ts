/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import FamiliesModel from './families-model';

@Injectable({
  providedIn: 'root'
})
export class FamiliesFormService {

  constructor(private common: CommonService) {

  }


  //validations
  familiesFormValidation(val: FamiliesModel) {
    const action = val.action == "add";
    console.log(action);
    // if (val.family_name == null || val.family_name == '') {
    //   this.common.showToast('warning', 'Missing Fields', 'Enter family name.');
    //   document.getElementById('family_name').focus();
    //   return false;
    // }  else {
    //   return true;
    // }

    return false;
  }

}
