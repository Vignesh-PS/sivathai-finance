import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddPeopleDetailsComponent } from './add-people-details/add-people-details.component';
import PeopleModel from './add-people-details/people-model';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {

  loading:boolean;

  people : PeopleModel[] = [
    {
      id: 2,
      action: '',
      people_name: 'Devs',
      people_yob: '1995',
      people_gender: 'female',
      people_in_native: 'yes',
      people_other_address: '',
      people_is_head: 'no',
      people_contact: '123456789',
      people_family_id: 2,
      people_comments: 'Comments',
      people_updated: '1616181510427'
    },{
      id: 3,
      action: '',
      people_name: 'Udhaya',
      people_yob: '1998',
      people_gender: 'male',
      people_in_native: 'No',
      people_other_address: 'Mullakadu',
      people_is_head: 'no',
      people_contact: '123456789',
      people_family_id: 2,
      people_comments: 'Comments',
      people_updated: '1616181510427'
    },
  ]

  constructor(private dialog: NbDialogService) { }

  ngOnInit(): void {
  }


  openPeopleInfo(action:string, people:PeopleModel){
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
    })

  }
}
