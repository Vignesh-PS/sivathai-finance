import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';


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
                  <tr><td >${index+1}</td><td >${tableRow['family_unique_id']}</td><td >${tableRow['family_head_name']}</td><td >${this.currencyFormatter(tableRow['tax_amount'])} (${tableRow['tax_detail']})</td><td >${tableRow['detail_contributed'] ? `${this.currencyFormatter(tableRow['detail_contributed'])} / ${tableRow['detail_is_cleared']==1?'C':'P'}` : '0 / P'}</td><td ><br ><br ></td></tr>
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


  generateReportExcel(collection:any, data:any){
    let workbook = new Workbook();


    for (let streetRow of data){

      streetRow.collections = streetRow.collections.map((x:any, i:number) => {
        let y = {...x};
        y.sno = i+1;
        return y;
      });

      let worksheet = workbook.addWorksheet(streetRow['street_name']);
      worksheet.columns = [
        { header: 'S.No', key: 'sno', width: 10 },
        { header: 'Family No', key: 'family_unique_id', width: 10 },
        { header: 'Name', key: 'family_head_name', width: 25 },
        { header: 'Tax Amount', key: 'tax_detail', width: 25 },
        { header: 'Collected Amount', key: 'detail_contributed', width: 20 },
        { header: 'Comments', key: 'comment', width: 50 },
      ];

      worksheet.addRows(streetRow.collections);

      const zerothRow = worksheet.getRow(1);

      zerothRow.getCell(9).value = 'Street';
      zerothRow.getCell(9).style =  {font: {bold:true}};
      zerothRow.getCell(10).value =  streetRow['street_name'];
      zerothRow.eachCell((cell, index)=>{
        if(index<10){
          cell.style = {font: {bold:true}}
        }
      });

      const firstRow = worksheet.getRow(2);
      firstRow.getCell(9).value = 'Collected Amount';
      firstRow.getCell(9).style =  {font: {bold:true}};
      firstRow.getCell(10).value = this.currencyFormatter(streetRow['total_amount']);

      const secondRow = worksheet.getRow(3);
      secondRow.getCell(9).value = 'Total Families';
      secondRow.getCell(9).style =  {font: {bold:true}};
      secondRow.getCell(10).value = streetRow['total_families'];

      const thirdRow = worksheet.getRow(4);
      thirdRow.getCell(9).value = 'Cleared';
      thirdRow.getCell(9).style =  {font: {bold:true}};
      thirdRow.getCell(10).value = streetRow['total_cleared_count'];

      const fourthRow = worksheet.getRow(5);
      fourthRow.getCell(9).value = 'Pending';
      fourthRow.getCell(9).style =  {font: {bold:true}};
      fourthRow.getCell(10).value = (streetRow['total_families'] && streetRow['total_cleared_count']) ? (streetRow['total_families'] - streetRow['total_cleared_count']) : streetRow['total_families'];

      const statColumn = worksheet.getColumn('I');
      statColumn.width = 25;

      worksheet.eachRow(row=>{
        row.height = 14;
      })
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, collection.collection_name+' - '+ collection.type+' - '+new Date()+'.xlsx');
    })
  }
}
