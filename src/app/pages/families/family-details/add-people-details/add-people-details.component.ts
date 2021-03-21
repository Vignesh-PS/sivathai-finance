import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { WebService } from '../../../../services/web.service';
import PeopleModel from './people-model';

@Component({
  selector: 'app-add-people-details',
  templateUrl: './add-people-details.component.html',
  styleUrls: ['./add-people-details.component.scss']
})
export class AddPeopleDetailsComponent implements OnInit {

  dialogData: any;
  dialogAction: string;
  base_url: string = environment.base_url;
  loading: boolean = false;


  constructor(private common: CommonService, private web: WebService, private route: ActivatedRoute, private dialogRef: NbDialogRef<any>) { }

  closeWindow(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.dialogData = new PeopleModel(this.dialogData);
    console.log('this.action :>> ', this.dialogAction);
    console.log('this.data :>> ', this.dialogData);
    // this.dialogData = new PeopleModel(this.data);
  }

  peopleFormValidation(val:PeopleModel){

    if (val.people_name == null || val.people_name == '') {
      this.common.showToast('warning', 'Missing Fields', 'Enter Name.');
      document.getElementById('people_name').focus();
      return false;
    }   else if (val.people_gender == null || val.people_gender == '') {
      this.common.showToast('warning', 'Missing Fields', 'Choose Gender.');
      document.getElementById('people_gender').focus();
      return false;
    }   else if (val.people_in_native == null || val.people_in_native == '') {
      this.common.showToast('warning', 'Missing Fields', 'Choose people in native or not.');
      document.getElementById('people_in_native').focus();
      return false;
    } else {
      return true;
    }


    return false;
  }

  submitFormResults() {
    console.log(this.dialogData);
    const confirm = this.peopleFormValidation(this.dialogData);
    console.log(confirm);
    if (confirm) {
      //this.dialogRef.close(this.dialogData);

      //return;

      const action = this.dialogAction;
      if (action == 'add') {
        this.loading = true;
        this.web.postData('peopleAdd', this.dialogData).then(res => {
          this.loading = false;
          if (res.status == '200') {
            this.dialogRef.close(true);
            this.common.showToast('success', 'Success', res.error);
          } else {
            this.common.showToast('warning', 'Warning', res.error);
          }
        })
        .catch(err => {
          this.loading = false;
          this.common.showToast('danger', 'Error', 'Connection Error');
        });
      } else {

        if(this.dialogData.people_is_head=='yes'){
          this.dialogData.people_family_id = '';
        }
        this.loading = true;
        this.web.postData('updatePeople/' + this.dialogData.id, this.dialogData).then(res => {
          this.loading = false;
          if (res.status == '200') {
            this.dialogRef.close(true);
            this.common.showToast('success', 'Success', res.error);
          } else {
            this.common.showToast('warning', 'Warning', res.error);
          }
        })
        .catch(err => {
            this.loading = false;
            this.common.showToast('danger', 'Error', 'Connection Error');
          });
      }
    } else {
      this.loading = false;
    }
  }


  timeStamptoDate(str: number): Date {
    const d = new Date(str);
    return d;
  }

}
