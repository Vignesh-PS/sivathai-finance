import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { WebService } from "../../../../services/web.service";
import { environment } from "../../../../../environments/environment";
import { CollectionStreetsFormService } from "./collection-streets-form.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-collection-streets-form",
  templateUrl: "./collection-streets-form.component.html",
  styleUrls: ["./collection-streets-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CollectionStreetsFormComponent implements OnInit {
  base_url: string = environment.base_url;
  loading: boolean = false;
  fetchingStatus: boolean = false;
  collectionId:string|number;
  streetId:string|number;


  constructor(
    private formService: CollectionStreetsFormService,
    private common: CommonService,
    private web: WebService,
    private route: ActivatedRoute
  ) {

  }



  async ngOnInit() {
    this.collectionId = this.route.snapshot.params['collectionId'];
    this.streetId = this.route.snapshot.params['streetId'];
  }




  timeStamptoDate(str: number): Date {
    const d = new Date(str * 1000);
    return d;
  }



}
