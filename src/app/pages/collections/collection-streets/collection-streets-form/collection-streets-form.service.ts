/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import CollectionStreetsModel from './collection-streets-model';

@Injectable({
  providedIn: 'root'
})
export class CollectionStreetsFormService {

  constructor(private common: CommonService) {

  }


  //validations
  collectionstreetsFormValidation(val: CollectionStreetsModel) {
    const action = val.action == "add";



    return false;
  }

}
