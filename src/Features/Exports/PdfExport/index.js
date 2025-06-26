import { React, forwardRef, useImperativeHandle } from "react"
import jsPDF from "jspdf";
import "jspdf-autotable";
import ConfigConstants from "assets/Constants/config-constant";
import html2pdf from 'html2pdf.js';



const PdfExport = forwardRef((props, ref) => {
    const configConstants = ConfigConstants();
    const { COMPANY_NAME, COMPANY_ADDRESS } = configConstants;

    useImperativeHandle(ref, () => ({
        async pdf(dataToExport, columnsToExport, reportName, pdfExpFilters) {
            debugger;
            // async pdf(jsonToExportPdf, reportName) {
            var dataValues = [];
            var appliedFilters = [];
            var companyAddress = COMPANY_ADDRESS

            const unit = "pt";
            const size = "A1";
            const orientation = "landscape";
            const doc = new jsPDF(orientation, unit, size);
            // const header = [columnsToExport];
            const header = [columnsToExport.map(obj => obj.Headers)];

            for (let i = 0; i < dataToExport.length; i++) {
                var crArray = new Array();
                for (let j = 0; j < columnsToExport.length; j++) {
                    var col = columnsToExport[j].accessor;
                    crArray.push(dataToExport[i][col]);
                }
                dataValues.push(crArray)
            }
            let content = {
                head: header,
                body: dataValues,
                columnWidth: 'wrap',
                tableLineColor: [189, 195, 199],
                tableLineWidth: 1,
                // theme: "border",
                bodyStyles: { lineColor: [189, 195, 199] },
                styles: { fontSize: 8, font: 'helvetica' },
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    padding: 0,
                },

            };

            let filtrObjKeys = Object.keys(pdfExpFilters);
            if (filtrObjKeys.length !== 0) {
                for (let objKey = 0; objKey < filtrObjKeys.length; objKey++) {
                    let key = filtrObjKeys[objKey];
                    let value = pdfExpFilters[filtrObjKeys[objKey]];
                    appliedFilters.push(key + " : " + value)
                }
                content['startY'] = 130 + filtrObjKeys.length * 20;
                console.log("startY", content)
            } else {
                content['startY'] = 130
            }

            var text = COMPANY_NAME,
                xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
            doc.text(text, xOffset, 50);
            doc.setFontSize(16);


            doc.text(companyAddress, xOffset - 300, 70)
            doc.text(reportName, xOffset, 90)

            doc.text(appliedFilters, 50, 100);
            doc.autoTable(content);
            doc.save(reportName + '.pdf')

        }
    }))
    return (<div> </div>)
})

export default PdfExport
