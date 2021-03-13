import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import StreetsModel from './list-streets-model';

@Injectable({
  providedIn: 'root'
})
export class StreetsFormService {
  private formData: any = {}
  constructor(private common: CommonService) { }

  getStreets() {
    const streets = [
      {
        street_name: 'Easy Samy Koil Street',
        id: 1,
        street_updated: '123'
      },{
        street_name: 'Easy Samy Koil Street',
        id: 3,
        street_updated: '123'
      },{
        street_name: 'Easy Samy Koil Street',
        id: 2,
        street_updated: '123'
      }
    ];

    return streets;
  }



  //validations
  async streetsFormValidation(val: StreetsModel): Promise<boolean> {
    let action = val.action == "add";
    console.log(action);
    if (val.street_name == null || val.street_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter User Login Name.')
      document.getElementById('street_name').focus();
      return false;
    }  else {
      return true;
    }

    return false;
  }

}
