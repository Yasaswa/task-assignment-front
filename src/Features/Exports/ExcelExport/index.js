import ConfigConstants from "assets/Constants/config-constant";
import { React, forwardRef, useImperativeHandle } from "react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
const ExcelExport = forwardRef((props, ref) => {

  const configConstants = ConfigConstants();
  const { COMPANY_ADDRESS, COMPANY_NAME } = configConstants;

  useImperativeHandle(ref, () => ({

    async excel(jsonToExportExcel, reportName) {
      debugger
      jsonToExportExcel['headings']['CompanyAddress'] = COMPANY_ADDRESS
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonToExportExcel),
      };
      const exporttoExcelApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/excelexport/FnExportToExcel`, requestOptions);

      if (!exporttoExcelApiCall.ok) {
        console.error("Export failed:", exporttoExcelApiCall.statusText);
        return;
      }

      const blob = await exporttoExcelApiCall.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    },

    //   exportToExcel(data, columns, reportName) {
    //     // Map data according to columns
    //     const mappedData = data.map(row => {
    //       const newRow = {};
    //       columns.forEach(col => {
    //         newRow[col.Headers] = row[col.accessor];
    //       });
    //       return newRow;
    //     });

    //     // Convert the mapped data to worksheet
    //     const worksheet = XLSX.utils.json_to_sheet(mappedData);

    //     // Create a new workbook and append the worksheet
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    //     // Generate Excel file
    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    //     // Create a blob object from the Excel file
    //     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    //     // Save the Excel file
    //     saveAs(blob, `${reportName}_${new Date().toISOString()}.xlsx`);
    //   }
    // }))


    exportToExcel(data, columns, reportName, selectedFilters) {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Helper function to get Excel column letters
      function getExcelColumnLetter(columnIndex) {
        let columnLetter = '';
        while (columnIndex >= 0) {
          columnLetter = String.fromCharCode(columnIndex % 26 + 65) + columnLetter;
          columnIndex = Math.floor(columnIndex / 26) - 1;
        }
        return columnLetter;
      }

      // Define header rows with merged cells and bold, centered text
      const startColumn = 'A'; // Start column letter
      const endColumn = getExcelColumnLetter(columns.length - 1); // Get last column letter based on columns.length

      // Merge and style first header row
      worksheet.mergeCells(`${startColumn}1:${endColumn}1`);
      worksheet.getCell('A1').value = COMPANY_NAME;
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').font = { bold: true, size: 15 };

      // Merge and style second header row
      worksheet.mergeCells(`${startColumn}2:${endColumn}2`);
      worksheet.getCell('A2').value = COMPANY_ADDRESS;
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A2').font = { bold: true, size: 14 };

      // Merge and style third header row
      worksheet.mergeCells(`${startColumn}3:${endColumn}3`);
      worksheet.getCell('A3').value = reportName;
      worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A3').font = { bold: true, size: 13 };

      // Start row counter
      let currentRow = 5;
      // Check for selected filters and add them to the sheet in two columns per row
      const maxFiltersPerRow = 2; // Two filters per row
      let currentColumn = 1; // Start from column A
      let fromDate = "N/A";
      let toDate = "N/A";
      let value = "N/A";
      if (selectedFilters && selectedFilters.length > 0) {
        selectedFilters.forEach((filter, index) => {
          const label = filter.label.trim();
          // valueSelectValue = `${document.getElementById(`values_${fieldvalue}_id_2`).value}`
          let operatorSelectValue = document.getElementById(`operators_${filter.id.trim()}_id`).value;
          if (filter.type === "D" && operatorSelectValue === '<>=') {
            const elementIdFrom = `values_${filter.id.trim()}_id`;
            const elementFrom = document.getElementById(elementIdFrom);
            fromDate = elementFrom ? elementFrom.value : "N/A";

            // Get "to" date value
            const elementIdTo = `values_${filter.id.trim()}_id_2`;
            const elementTo = document.getElementById(elementIdTo);
            toDate = elementTo ? elementTo.value : "N/A";

            value = `From Date: ${fromDate}, To Date: ${toDate}`;
          } else {
            // Fetch value from DOM dynamically
            const elementId = `values_${filter.id.trim()}_id`;
            const element = document.getElementById(elementId);
            value = element ? element.value : "N/A"; // Default to "N/A" if element not found
          }

          // Add filter with rich text styling (bold label, normal value)
          const startCell = `${String.fromCharCode(64 + currentColumn)}${currentRow}`;
          const endCell = `${String.fromCharCode(64 + currentColumn + 1)}${currentRow}`;
          worksheet.mergeCells(`${startCell}:${endCell}`);
          worksheet.getCell(startCell).value = {
            richText: [
              { text: `${label}: `, font: { bold: true, size: 11 } },
              { text: `${value}`, font: { bold: false, size: 10 } }
            ]
          };
          worksheet.getCell(startCell).alignment = { horizontal: 'left', vertical: 'middle' };

          // Move to the next column
          currentColumn += 2;

          // If we reach max filters per row, reset to the next row
          if (currentColumn > maxFiltersPerRow * 2) {
            currentRow++;
            currentColumn = 1;
          }
        });
      }
      // Add column headers dynamically at the current row
      const headerRow = worksheet.addRow(columns.map(col => col.Headers));
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };
      headerRow.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      currentRow++;

      // Add data rows dynamically, center-align, bold, and wrap text for data cells
      data.forEach(rowData => {
        const row = columns.map(col => rowData[col.accessor]);
        const dataRow = worksheet.addRow(row);

        dataRow.eachCell({ includeEmpty: true }, cell => { // includeEmpty: true applies to empty cells
          cell.alignment = { wrapText: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Adjust column widths with a max width cap
      const MAX_WIDTH = 50;
      columns.forEach((col, index) => {
        const maxColumnLength = Math.max(
          col.Headers.length,
          ...data.map(row => row[col.accessor]?.toString().length || 0)
        );

        worksheet.getColumn(index + 1).width = Math.min(maxColumnLength + 5, MAX_WIDTH);
      });
      // Generate and save the Excel file
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `${reportName}_${new Date().toISOString()}.xlsx`);
      });
    }
    // ,

    // exportToExceldata(data, columns, reportName, selectedFilters) {
    //   // Create a new workbook and worksheet
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("Sheet1");

    //   // Define header rows with merged cells and bold, centered text
    //   worksheet.mergeCells(`A1:${String.fromCharCode(65 + columns.length - 1)}1`);
    //   worksheet.getCell('A1').value = COMPANY_NAME;
    //   worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    //   worksheet.getCell('A1').font = { bold: true, size: 15 };

    //   worksheet.mergeCells(`A2:${String.fromCharCode(65 + columns.length - 1)}2`);
    //   worksheet.getCell('A2').value = COMPANY_ADDRESS;
    //   worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
    //   worksheet.getCell('A2').font = { bold: true, size: 14 };

    //   worksheet.mergeCells(`A3:${String.fromCharCode(65 + columns.length - 1)}3`);
    //   worksheet.getCell('A3').value = reportName;
    //   worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };
    //   worksheet.getCell('A3').font = { bold: true, size: 13 };

    //   // Start row counter
    //   let currentRow = 5;

    //   // Check for selected filters and add them to the sheet in two columns per row
    //   const maxFiltersPerRow = 2; // Two filters per row
    //   let currentColumn = 1; // Start from column A

    //   if (selectedFilters && selectedFilters.length > 0) {
    //     selectedFilters.forEach((filter, index) => {
    //       const label = filter.label.trim();

    //       // Fetch value from DOM dynamically
    //       const elementId = `values_${filter.id.trim()}_id`;
    //       const element = document.getElementById(elementId);
    //       const value = element ? element.value : "N/A"; // Default to "N/A" if element not found

    //       // Add filter with rich text styling (bold label, normal value)
    //       const startCell = `${String.fromCharCode(64 + currentColumn)}${currentRow}`;
    //       const endCell = `${String.fromCharCode(64 + currentColumn + 1)}${currentRow}`;
    //       worksheet.mergeCells(`${startCell}:${endCell}`);
    //       worksheet.getCell(startCell).value = {
    //         richText: [
    //           { text: `${label}: `, font: { bold: true, size: 11 } },
    //           { text: `${value}`, font: { bold: false, size: 10 } }
    //         ]
    //       };
    //       worksheet.getCell(startCell).alignment = { horizontal: 'left', vertical: 'middle' };

    //       // Move to the next column
    //       currentColumn += 2;

    //       // If we reach max filters per row, reset to the next row
    //       if (currentColumn > maxFiltersPerRow * 2) {
    //         currentRow++;
    //         currentColumn = 1;
    //       }
    //     });
    //   }

    //   // Add column headers dynamically at the current row
    //   const headerRow = worksheet.addRow(columns.map(col => col.Headers));
    //   headerRow.font = { bold: true };
    //   headerRow.alignment = { horizontal: 'center' };
    //   headerRow.eachCell(cell => {
    //     cell.border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' }
    //     };
    //   });
    //   currentRow++;
    //   const headers = columns.map(col => col.Headers);
    //   worksheet.addRow(headers).font = { bold: true };
    //   // Iterate through each category in the data object
    //   Object.keys(data).forEach(category => {
    //     // Check if rows is an array before using forEach
    //     if (Array.isArray(data[category].rows)) {
    //       // Add the category as a header
    //       const categoryName = category; // Category name used as header
    //       worksheet.addRow([categoryName]).font = { bold: true }; // Category name as bold header

    //       // Now add the headers for each product category


    //       // Loop through the rows of each category and add the data to the Excel sheet
    //       data[category].rows.forEach(rowData => {
    //         const row = columns.map(col => rowData[col.accessor]);  // Map row data to columns based on accessor
    //         const dataRow = worksheet.addRow(row);

    //         // Apply cell formatting (border, alignment, etc.)
    //         dataRow.eachCell(cell => {
    //           cell.alignment = { wrapText: true };
    //           cell.border = {
    //             top: { style: 'thin' },
    //             left: { style: 'thin' },
    //             bottom: { style: 'thin' },
    //             right: { style: 'thin' }
    //           };
    //         });
    //       });

    //       // Adjust column widths after adding all rows for this category
    //       const MAX_WIDTH = 50;
    //       columns.forEach((col, index) => {
    //         const maxColumnLength = Math.max(
    //           col.Headers.length,
    //           ...data[category].rows.map(row => row[col.accessor]?.toString().length || 0)
    //         );

    //         worksheet.getColumn(index + 1).width = Math.min(maxColumnLength + 5, MAX_WIDTH);
    //       });
    //     } else {
    //       console.error(`${category} rows is not an array.`);
    //     }
    //   });

    //   // Generate and save the Excel file
    //   workbook.xlsx.writeBuffer().then(buffer => {
    //     const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    //     saveAs(blob, `${reportName}_${new Date().toISOString()}.xlsx`);
    //   });
    // }

  }))
  return (<div> </div>)
})

export default ExcelExport
