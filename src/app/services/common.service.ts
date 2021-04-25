import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService
} from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  toaster_config: NbToastrConfig;

  toaster_destroyByClick = true;
  toaster_duration = 2000;
  toaster_hasIcon = true;
  toaster_position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  toaster_preventDuplicates = false;
  toaster_status: NbComponentStatus = 'primary';

  toaster_title = 'HI there!';
  toaster_content = `I'm cool toaster!`;

  toaster_positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];
  courseDetail:any = {};
  subcourseDetail:any = {};
  videoDetail:any={};
  userId:any={};
  private msgSource=new BehaviorSubject('alwaysOpen');
  private previousUrl=new BehaviorSubject('/');
  currentMessage=this.msgSource.asObservable();

  constructor(private toastrService: NbToastrService) { }

  changeMsg(msg:string):void{
    this.msgSource.next(msg);
  }

  currencyFormatter(number: any):any{
    var re = /^[1-9]\d*(\.\d+)?$/;

    if(re.test(number)==false){
      return 0;
    }
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
  }

  getMsg():any {
    return this.msgSource.getValue();
  }

  setPrevUrl(prevUrl:string):any{
    this.previousUrl.next(prevUrl);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getPrevUrl() {
    return this.previousUrl.getValue();
  }

  showToast(type: NbComponentStatus,
            title: string,
            body: string,
            duration:any=this.toaster_duration,
            position:NbGlobalPosition=this.toaster_position,
            has_icon:boolean=this.toaster_hasIcon,
            destroybyclick:boolean=this.toaster_destroyByClick,
            preventduplicates:boolean=this.toaster_preventDuplicates
  ):void {
    const config = {
      status: type,
      destroyByClick:destroybyclick,
      duration:duration,
      hasIcon: has_icon,
      position: position,
      preventDuplicates: preventduplicates,
    };
    const titleContent = title ? `${title}` : '';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

   validateMobileNumber(val: any):boolean {
    // var re= /^[\+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$;
     var re = /^(\+\d{1,3}[- ]?)?\d{10}$/i;
    // var re = /^((00|\+)[0-9]{2,5}|0)[1-9][0-9]{7,9}$/i;
    if (re.test(val)) {
      return true;
    } else {
      return false;
    }
  }

  validateEmail(email: string):boolean {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email) && email.indexOf(" ") == -1;
  }
}
