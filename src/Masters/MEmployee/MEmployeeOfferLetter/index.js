
import React, { useState, useEffect, useRef } from "react";
import DakshabhiLogo from 'assets/images/DakshabhiLogo.png';
import EmployeeLogo from 'assets/images/EmployeeLogo.png';
import ConfigConstants from "assets/Constants/config-constant";

const MEmployeeOfferLetter = ({ employeeId }) => {


    const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [workExperienceData, setWorkExperienceDetails] = useState([]);
    const [uploadImage, setImage] = useState();
    const configConstants = ConfigConstants();
    const { SHORT_COMPANY } = configConstants;
    const containerStyle = {
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        padding: "20px",
        maxWidth: "800px",
    };

    const headerStyle = {
        textAlign: "right",
    };

    const paragraphStyle = {
        margin: "10px 0",
        lineHeight: "1.6",
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
            let employeeEducationalDetails = apiResponse.EmployeesQualificationDetails ?? [];
            let employeeWorkExpDetails = apiResponse.EmployeeExperiencedetails ?? [];
            setEmployeeDataForPrint(employeeAllDetails);
            setEducationData(employeeEducationalDetails);
            setWorkExperienceDetails(employeeWorkExpDetails);
            console.log(employeeAllDetails)
            console.log(employeeEducationalDetails)
            console.log(employeeWorkExpDetails)
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
                        <div className="erp-invoice-print-label-lg" >Offer Letter</div>
                    </div>
                </div>
                <div className="col-sm-12" style={containerStyle}>
                    <div style={headerStyle}>
                        <p className="erp-invoice-print-label" style={{ marginRight: "15px" }}>{SHORT_COMPANY}/HR/</p>
                        <p className="erp-invoice-print-label" style={{ marginRight: "15px" }}>Date: {formatDate()}</p>
                    </div>

                    <div className="erp-invoice-print-label" >
                        <p className="erp-invoice-print-label"> To,</p>
                        <p className="erp-invoice-print-label" style={{ fontWeight: "700", color: "#881454" }}>{employeeDataForPrint.account_name1}</p>
                        <p className="erp-invoice-print-label" style={{ fontWeight: "700" }}>{employeeDataForPrint.current_address}.</p>
                        <p className="erp-invoice-print-label" style={{ fontWeight: "700" }}>{employeeDataForPrint.district_name}, {employeeDataForPrint.permanant_pincode}, {employeeDataForPrint.state_name}</p>
                        <br></br>
                        <p className="erp-invoice-print-label" style={{ fontWeight: "700" }}>Dear {employeeDataForPrint.salutation} {employeeDataForPrint.first_name},</p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            This has reference to your application for employment in our company
                            and the subsequent interview you had with us. We are pleased to offer
                            you an employment with us as a Company Secretary for our plant located
                            at Kadi at the terms agreed during our personal meeting. Your
                            probation period will be of six months from the date of joining.
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            Please note that this is an Offer Letter. The Company’s Appointment
                            Letter containing detailed terms and conditions of employment will be
                            issued to you on your joining the Company, which shall be binding on
                            you.
                        </p>

                        <p className="erp-invoice-print-label" style={paragraphStyle}>
                            Kindly confirm this arrangement and you are requested to join us
                            latest by {formatDate(employeeDataForPrint.date_joining)} along with a copy of the acceptance of
                            your resignation letter at the earliest.
                        </p>

                        <p className="erp-invoice-print-label">At the time of joining, we expect you to bring the following:</p>
                        <ul className="erp-invoice-print-label" style={ulStyle}>
                            <li className="erp-invoice-print-label">Resignation letter of the previous company</li>
                            <li>Relieving letter from your previous employer</li>
                            <li>Last Salary certificate from your employer</li>
                            <li>Experience Certificates</li>
                            <li>Copy of Testimonials of academic qualifications</li>
                            <li>2 Passport and 2 Stamp size Photographs</li>
                            <li>Copy of your PAN Card and Aadhar Card</li>
                            <li>Bank Details</li>
                        </ul>
                        <p className="erp-invoice-print-label">We look forward to a long and mutually rewarding relationship.</p>

                        <div style={{ marginTop: "50px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ textAlign: "left" }}>
                                    <p>With best wishes,</p>
                                    <p>For, <strong>{employeeDataForPrint.company_name}</strong></p>
                                    <p><strong>Authorised Signatory</strong></p>
                                </div>
                                <div style={{ textAlign: "right", marginRight: "15px" }}>
                                    <p>I accept and shall join on or before  ______________</p>
                                    <p><strong>{employeeDataForPrint.account_name1}</strong></p>
                                    <p>Dated ______________</p>
                                </div>
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

export default MEmployeeOfferLetter;
