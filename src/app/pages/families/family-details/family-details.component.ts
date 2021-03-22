import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../services/common.service';
import { WebService } from '../../../services/web.service';
import { AddPeopleDetailsComponent } from './add-people-details/add-people-details.component';
import PeopleModel from './add-people-details/people-model';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {

  loading:boolean;

  familyDetails:any = {};
  familyMembers:any[] = [];

  familyId:string|number = '';

  constructor(private dialog: NbDialogService, private web: WebService, private common: CommonService, private route: ActivatedRoute) { }

  deletePeople(people:any){
    if(people.people_is_head=='yes'){
      this.common.showToast('warning', 'Warning', 'Family head can not be removed')
      return;
    }

    if(window.confirm('Are you sure to remove member from family..?')){
      this.loading = true;
      this.web.postData('deletePeople/'+people.id, {})
      .then(res=>{
          this.loading = false;
          if(res.status==200){
            this.fillPageInfo();
            this.common.showToast('success', 'Success', res.error);
          }else{
            this.common.showToast('warning', 'Failed', res.error);
          }
        })
        .catch(err=>{
          this.loading = false;
          this.common.showToast('danger', 'Error', 'Connection Error');
        });
    }
  }

  fillPageInfo(){
    this.loading = true;
    this.web.getData('getFamilyDetails/'+this.familyId).then(res=>{
      this.loading = false;
      if(res.status=='200'){
        this.familyDetails = res.data.family;
        this.familyMembers = res.data.members;
      }else{
        this.common.showToast('warning', 'Failed', res.error);
      }
    })
    .catch(err=>{
      this.loading = false;
      this.common.showToast('danger', 'Error', 'Connection Error');
    })
  }

  ngOnInit(): void {
    this.familyId = this.route.snapshot.params['familyId'];
    this.fillPageInfo();
  }


  openPeopleInfo(action:string, people:PeopleModel){

    people.people_family_id = this.familyId;
    const dialog = this.dialog.open(AddPeopleDetailsComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      context: {
        dialogData: people,
        dialogAction: action
      }
    });

    dialog.onClose.subscribe(dialogData=>{
      console.log('dialogData :>> ', dialogData);
      if(dialogData){
        this.fillPageInfo();
      }
    })

  }
}
