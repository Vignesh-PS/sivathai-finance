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


    if (val.family_head_name == null || val.family_head_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter family head name.');
      document.getElementById('family_head_name').focus();
      return false;
    }  else if (val.family_head_gender == null || val.family_head_gender == '') {
      this.common.showToast('warning', 'Missing Fields', 'Choose gender.');
      document.getElementById('family_head_gender').focus();
      return false;
    }  else if (val.family_unique_id == null || val.family_unique_id == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter family no.');
      document.getElementById('family_unique_id').focus();
      return false;
    } else if (val.family_tax_count == null || val.family_tax_count == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter tax count.');
      document.getElementById('family_tax_count').focus();
      return false;
    } else if (val.family_street_id == null || val.family_street_id == '') {
      this.common.showToast('warning', 'Missing Fields', 'Choose street name.');
      document.getElementById('family_street_id').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
