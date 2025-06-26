import React, { useState, useEffect, useRef } from "react";
import DakshabhiLogo from 'assets/images/DakshabhiLogo.png';

const MExperienceLetter = ({ employeeId }) => {

    const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
    const containerStyle = {
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        padding: "20px",
        maxWidth: "800px",
    };

    const headerStyle = {
        textAlign: "left",
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
                            This is to certify that <span style={{ color: "#881454", fontWeight: "700" }}>{employeeDataForPrint.account_name1}{/* [{employeeDataForPrint.old_employee_code}] [{employeeDataForPrint.employee_code}] */}
                            </span> was employed with our organization at the Kadi Location.
                        </p>
                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            He was associated with us as a {employeeDataForPrint.designation_name} at our Kadi Plant from {formatDate(employeeDataForPrint.date_joining)} to {employeeDataForPrint.date_exit ? formatDate(employeeDataForPrint.date_exit):<span style={{whiteSpace:"pre"}}>    -    -     </span>}
                        </p>
                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            His Gross monthly salary is Rs {employeeDataForPrint.salary}/-
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            He was relieved from his duties at the close of office hours on {formatDate(employeeDataForPrint.date_exit)}
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            During his tenure with us, he demonstrated sincerity, hard work, punctuality, and good character.
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            This certificate is issued to him upon his request for record purposes.
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>We look forward to a long and mutually rewarding relationship.</p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>Wishing him all the best in his future endeavors.</p>
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

export default MExperienceLetter;
