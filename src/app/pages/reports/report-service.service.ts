import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }


  currencyFormatter(number: any):any{
    var re = /^[1-9]\d*(\.\d+)?$/;

    if(re.test(number)==false){
      return 0;
    }
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
  }

  generateReportHTML(collection:any ,data:any){

    let topHtml = `<!DOCTYPE html>
    <html lang="en">
    <body>
      <h3>${collection.collection_name} : ${collection.collection_year}</h3>
      <h4>${collection.type} Report</h4>
      <h5 style="margin-bottom: 1.5rem;">600/per tax</h5>`;

      let bodyHtml = '';

      for(let row of data){
        let tableHead = `<div style="margin-bottom: 2.5rem">
        <table>
          <tr style="margin-bottom: 1rem; border: none;">
            <td> Street / Collected Amount <br ><b >${row['street_name']} / ${this.currencyFormatter(row['total_amount'])}</b></td>
            <td> Total Families <br ><b > ${row['total_families']}</b></td><td> Cleared <br ><b >${row['total_cleared_count']}</b></td>
            <td> Pending <br ><b >${(row['total_families'] && row['total_cleared_count']) ? (row['total_families'] - row['total_cleared_count']) : row['total_families']}</b></td>
          </tr>
        </table>`;
        let needTable = '';

          let tableBody = '';
          if(row['collections'].length>0){

            needTable = `<table  style="width: 100%;">
            <thead>
              <th style="text-align: left">S.No</th>
              <th style="text-align: left">Family No</th>
              <th style="text-align: left">Name</th>
              <th style="text-align: left">Tax Amount</th>
              <th style="text-align: left">Collected Amount</th>
              <th style="text-align: left">Comments</th>
            </thead>
            <tbody>`

              row['collections'].forEach((tableRow:any, index:number) => {
                let tableBodyTemp = `
                  <tr><td >${index+1}</td><td >${tableRow['family_unique_id']}</td><td >${tableRow['family_head_name']}</td><td >${this.currencyFormatter(tableRow['tax_amount'])} (${tableRow['tax_detail']})</td><td >${tableRow['detail_contributed'] ? this.currencyFormatter(tableRow['detail_contributed']) : '0'}</td><td ><br ><br ></td></tr>
                `;
                tableBody += tableBodyTemp;
              });

          }else{
              tableBody =`<p style="background: #f0f0f0;">No Families</p>`;
          }


          let tableFooter = `</tbody></table></div><hr>`;

          bodyHtml += tableHead + needTable + tableBody + tableFooter;
      }

      let bottomHtml = `</body></html>`;


      return topHtml + bodyHtml + bottomHtml;
  }

}
