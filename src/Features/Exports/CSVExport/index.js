import { React, forwardRef, useImperativeHandle } from "react"

const CSVExport = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({

        async csv(dataExport, columnExport, reportName) {
            debugger
            var columns = [];
            for (let keys of columnExport) {
                columns.push(keys.Headers)
            };

            let csvHeader = columns.join(',') + '\n'; // header row
            let csvBody = dataExport.map(row => Object.values(row).map(value => sanitizeCSVValue(value)).join(',')).join('\n');

            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
            hiddenElement.target = '_blank';
            hiddenElement.download = reportName + '.csv';
            hiddenElement.click();
        }

    }));


    function sanitizeCSVValue(value) {
        // Remove escape sequences from the value
        // return String(value).replace(/[\r\n]+/g, ' ');
        return String(value).replace(/[\r\n]+/g, ' ').replace(/%/g, '%25');

    }
    return (<div> </div>)
})

export default CSVExport
