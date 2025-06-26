import React, { useState, useEffect, useRef } from "react";
import DakshabhiLogo from 'assets/images/DakshabhiLogo.png';

const MRelievingLetter = ({ employeeId }) => {

    const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
    const containerStyle = {
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        padding: "20px",
        maxWidth: "800px",
    };

    const headerStyle = {
        textAlign: "Right",
    };

    const paragraphStyle = {
        margin: "10px 0",
        lineHeight: "1.3",
    };

    const ulStyle = {
        marginLeft: "20px",
    };

    useEffect(() => {
        const loadDataOnload = async () => {
            try {
                await FnCheckUpdateResponce();
            } catch (error) {
                console.error(error);
            }
        }
        loadDataOnload()
    }, [])

    const formatDate = (dateInput) => {
        // Check if dateInput is provided, otherwise use the current date
        const date = dateInput ? new Date(dateInput) : new Date();

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/FnShowSalaryAndWorkProfileRecords/${employeeId}`)
            const apiResponse = await apiCall.json();
            let employeeAllDetails = apiResponse.EmployeeMasterRecords;
            setEmployeeDataForPrint(employeeAllDetails)
            console.log(employeeAllDetails)
        } catch (error) {
            console.log("error", error)
        }
    }

    const employeePrintHeader = (
        <>
            <div className="bordered border-1 px-0" style={{ pageBreakAfter: 'always' }}>
                <div className="col-sm-9 d-flex justify-content-between" style={{ height: '1.3in', paddingTop: '1em' }}>
                    <div className="col-sm-2 p-2">
                        <img src={DakshabhiLogo} alt="master card" width="170px" height="auto" mt={1} />
                    </div>
                    <div className="col-sm-8 text-center">
                        <div className='erp-invoice-print-label'>
                            <span className='erp-invoice-print-label-lg'>{employeeDataForPrint.company_name}</span><br />
                            <span className='erp-invoice-print-label-md'>{employeeDataForPrint.company_branch_name}</span>
                        </div>
                        <div className="erp-invoice-print-label-lg" >Experience Letter</div>
                    </div>
                </div>
                <div className="col-sm-12" style={containerStyle}>
                    <div style={headerStyle}>
                        <p className="erp-invoice-print-label" style={{ marginRight: "15px" }}>Date: {formatDate()}</p>
                    </div>
                    <br />

                    <div className="erp-invoice-print-label" >

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            Dear <span style={{ color: "#881454", fontWeight: "700" }}>{employeeDataForPrint.account_name1} </span> ,
                        </p>

                        <p></p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            This is to certify that you were employed with {employeeDataForPrint.company_name}  at the Kadi Location and hereby relieved from your services on {employeeDataForPrint.date_exit ? formatDate(employeeDataForPrint.date_exit) : <span style={{ whiteSpace: "pre" }}>    -         </span>}
                        </p>

                        <p></p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            He was associated with us as a {employeeDataForPrint.designation_name} at our Kadi Plant from {formatDate(employeeDataForPrint.date_joining)} to {employeeDataForPrint.date_exit ? formatDate(employeeDataForPrint.date_exit) : <span style={{ whiteSpace: "pre" }}>    -         </span>}
                        </p>

                        <p></p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            Your Service record is as follows :
                        </p>

                        <p></p>

                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                           
                            <tbody>
                                <tr>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Employee Code</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{employeeDataForPrint.old_employee_code}
                                     &nbsp; ({employeeDataForPrint.employee_code})
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Designation</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {employeeDataForPrint.designation_name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date Of Joining</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {formatDate(employeeDataForPrint.date_joining)}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date Of Relieving</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {employeeDataForPrint.date_exit
                                            ? formatDate(employeeDataForPrint.date_exit)
                                            : <span style={{ whiteSpace: "pre" }}>    -         </span>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <p></p>
                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            This certificate is issued to him upon his request for record purposes.
                        </p>

                       

                        <p className="erp-invoice-print-label" style={paragraphStyle}>Thank you for your contribution to {employeeDataForPrint.company_name} and wishing you the best! </p>
                        <br />
                        <div style={{ marginTop: "2rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ textAlign: "left" }}>

                                    <p><strong>For {employeeDataForPrint.company_name}</strong></p>
                                    <br />
                                    <p><strong>Authorised Signatory</strong></p>

                                </div>
                            </div>
                            <div style={{ marginTop: "2rem" }}>
                                <p style={{ margin: "0px" }}>Place :-</p>
                                <p>Date :- {formatDate()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (

        <>
            <style>
                {`
                .erp-invoice-print-label-md-lg,
                .erp_invoice_table_td,
                .erp-invoice-print-label {
                    font-size: 13px;
                }
                `}
            </style>
            <div className="">
                <div className="row">
                    <div className="col-12">
                        <div className="container-invoice py-3">
                            <div id="content">
                                <div className="invoice p-0">
                                    <div className="row" style={{ padding: '0px 15px 0px' }}>
                                        {employeePrintHeader}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MRelievingLetter;
