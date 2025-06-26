import { React, forwardRef, useImperativeHandle } from "react"

const JsonExport = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({

        async json(dataToExport, reportName) {
            debugger;
            const fileName = reportName;
            const json = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const href = URL.createObjectURL(blob);

            // create "a" HTLM element with href to file
            const link = document.createElement("a");
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);

        }
    }))
    return (<div> </div>)
})

export default JsonExport
