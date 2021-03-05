import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import ListStreetsModel from './list-streets-model';

@Injectable({
  providedIn: 'root'
})
export class ListStreetsFormService {
  private formData: any = {}
  constructor(private common: CommonService) { }

  setFormData(val: any) {
    this.formData = val;
    console.log(this.getFormData());
  }

  getFormData() {
    return this.formData;
  }

  async listStreetsFormValidation(val: ListStreetsModel):Promise<boolean> {
    let action = val.action=="add";
    console.log(action);
 if(val.user_name==null || val.user_name==''){
      this.common.showToast('warning', 'Missing Fields', 'Enter User Login Name.')
      document.getElementById('lname').focus();
      return false;
 }else if(action && val.user_password==null || val.user_password==''){
      this.common.showToast('warning', 'Missing Fields', 'Enter password.')
      document.getElementById('pass').focus();
      return false;
    } else if(action && val.user_password.length<6){
      this.common.showToast('warning', 'Need more characters', 'Password should have 6 characters.')
      document.getElementById('pass').focus();
      return false;
    } else if(action && val.user_password!=val.user_cpassword){
      this.common.showToast('warning', 'Mismatching fields', 'Confirm password mismatched.')
      document.getElementById('cpass').focus();
      return false;
    } else {
      return true;
    }

    return false;
  }

}
