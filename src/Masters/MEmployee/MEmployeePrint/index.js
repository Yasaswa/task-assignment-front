
import React, { useState, useEffect, useRef } from "react";
import DakshabhiLogo from 'assets/images/DakshabhiLogo.png';
import EmployeeLogo from 'assets/images/EmployeeLogo.png';

const MEmployeePrint = ({ employeeId }) => {
    const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [workExperienceData, setWorkExperienceDetails] = useState([]);

    const [uploadImage, setImage] = useState();
    const boxStyle = {
        border: '1px solid #000',
        padding: '10px',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        width: '75%',
        fontWeight: '700'

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

            if (employeeAllDetails.encodedImage !== null) {
                setImage(`data:image/jpeg;base64,${employeeAllDetails.encodedImage}`)
            }
        } catch (error) {
            console.log("error", error)

        }
    }


    const formatDate = (dateString) => {
        if (!dateString) return ''; // Check if dateString is undefined or null
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const isImageAvailable = uploadImage !== undefined && uploadImage !== null && uploadImage !== '';

    const employeePrintHeader = (
        <>
            <div className="bordered border-1 px-0" style={{ pageBreakAfter: 'always' }}>
                <div className="col-sm-12 d-flex justify-content-between" style={{ height: '1.3in' }}>
                    <div className="col-sm-2 p-2">
                        <img src={DakshabhiLogo} alt="master card" width="170px" height="auto" mt={1} />
                    </div>
                    <div className="col-sm-8 text-center">
                        <div className='erp-invoice-print-label'>
                            <span className='erp-invoice-print-label-lg'>{employeeDataForPrint.company_name}</span><br />
                            <span className='erp-invoice-print-label-md'>({employeeDataForPrint.company_branch_name})</span>
                        </div>
                        <div className="erp-invoice-print-label-lg" >Employee Data Form</div>
                    </div>
                    <div className="col-sm-2 d-flex flex-column align-items-end">
                        {isImageAvailable ? (
                            <img
                                src={uploadImage}
                                className="card-img-top"
                                style={{ width: '130px', height: 'auto', borderRight: '1px solid #000', borderLeft: '1px solid #000' }}
                            />
                        ) : (
                            <img
                                src={EmployeeLogo}
                                alt="master card"
                                assName="card-img-top"
                                style={{ width: '135px', height: 'auto', borderRight: '1px solid #000', borderLeft: '1px solid #000' }}
                            />
                            // <img src={EmployeeLogo} alt="master card" width="135px" height="auto" mt={1} />
                        )}
                    </div>
                    {/* <div className="col-sm-2 d-flex flex-column align-items-end">
                        {isImageAvailable ? (
                            <img src={uploadImage} className="card-img-top" style={{ width: '130px', height: 'auto' }} />

                        ) : (
                            <img src={EmployeeLogo} alt="master card" width="135px" height="auto" mt={1} />
                        )}
                    </div> */}
                </div>

                <div className="row" style={{ padding: '0px 11px 15px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Company:</th>
                                                    <td className="erp-invoice-print-label  col-10">{employeeDataForPrint.company_name}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Department:</th>
                                                    <td className="erp-invoice-print-label col-10">{employeeDataForPrint.department_name}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name (Full):</th>
                                                    <td className="erp-invoice-print-label col-10">{employeeDataForPrint.employee_name}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Temporary Address:</th>
                                                    <td className="erp-invoice-print-label col-10">{employeeDataForPrint.current_address} </td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Permanent Address:</th>
                                                    <td className="erp-invoice-print-label col-10">{employeeDataForPrint.permanant_address}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ padding: '0px 11px 10px'}}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <thead>

                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Designation:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.designation_name}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Punch Code:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.machine_employee_code}</td>

                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Date of Birth:</th>
                                                    <td className="erp-invoice-print-label col-4"> {formatDate(employeeDataForPrint?.date_of_birth)} </td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Date Of Joining:</th>
                                                    <td className="erp-invoice-print-label col-4">{formatDate(employeeDataForPrint?.date_joining)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Contact Number:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.cell_no1}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Marital Status:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.marital_status}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Pan Card No:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.pan_no}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Aadhar Card No:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.aadhar_card_no}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Blood Group:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.blood_group}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Email Id:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.email_id1}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Emergency Contact Name:</th>
                                                    <td className="erp-invoice-print-label col-4"></td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Emergency Contact Num:</th>
                                                    <td className="erp-invoice-print-label col-4"></td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '5px',marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg">Educational Details:</dt>
                    </div>
                </div>

                <div className="row" style={{ padding: '0px 11px 10px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >
                                            <thead>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg  col-2" rowspan={2}>Qualification</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-2" rowspan={2}>Year</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-6" rowspan={2}>Board/University</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-2" rowspan={2}>Percentage(%)</th>
                                                </tr>

                                            </thead>

                                            <tbody>
                                                {educationData.length > 0 ? (
                                                    educationData.map((item, index) => (
                                                        <tr key={index} style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label">{item.qualification}</td>
                                                            <td className="erp-invoice-print-label">{item.passing_year}</td>
                                                            <td className="erp-invoice-print-label">{item.board_university}</td>
                                                            <td className="erp-invoice-print-label">{item.mark_percentage}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>

                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row" style={{ marginTop: '5px',marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg">Previous Employment:</dt>
                    </div>
                </div>

                <div className="row" style={{ padding: '0px 11px 12px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0 border-left-0 border-right-0" id='invoiceTable' >
                                            <thead>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Name of the Organisation</th>
                                                    <th className="erp-invoice-print-label-md-lg text-center col-3">Working Duration</th>
                                                    <th className="erp-invoice-print-label-md-lg text-center col-3">Position</th>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Last Salary</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {workExperienceData.length > 0 ? (
                                                    workExperienceData.map((item, index) => (
                                                        <tr key={index} style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label col-3">{item.previous_organisation}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.working_experience}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.desigantion}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.previous_salary}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>

                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                        </tr>

                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div>
            <div className="bordered border-bottom-0 px-0"> */}
              <div className="row" style={{marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg"  >Reference Details:</dt>
                    </div>
                </div>
                <div className="row" style={{ padding: '0px 11px 0px', marginBottom: '-2px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Reference person:</th>
                                                    <td className="erp-invoice-print-label col-10">{employeeDataForPrint.reference}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Occupation</th>
                                                    <td className="erp-invoice-print-label col-10"></td>
                                                </tr> */}
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Mobile Details:</th>
                                                    <td className="erp-invoice-print-label col-10"></td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 1st page complete */}
            <div className="bordered border-1 px-0">
                <div className="row" style={{ marginTop: '10px', marginBottom: '5px', marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg">Family Details:</dt>
                    </div>
                </div>
                <div className="row" style={{ padding: '0px 11px 10px'}}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >
                                            <thead>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg">
                                                        Relation
                                                    </th>
                                                    <th className="erp-invoice-print-label-md-lg text-center">
                                                        Name
                                                    </th>
                                                    <th className="erp-invoice-print-label-md-lg text-center">
                                                        Date of Birth
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Father</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.father_name}</td>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint?.father_dob)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Mother</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.mother_name}</td>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint?.mother_dob)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Spouse</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.spouse_name}</td>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint?.spouse_dob)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Son</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.son_name}</td>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint?.son_dob)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Daughter</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.daughter_name}</td>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint?.daughter_dob)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginTop: '5px', marginBottom: '5px', marginLeft: '-7px' }}>
                    <div className="col">
                        <dt className="erp-invoice-print-label-md-lg">(For Office Use Only)</dt>
                    </div>

                </div>
                <div className="row" style={{ padding: '0px 11px 15px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <thead>

                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Office/Shift Timing:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.shift_name} [{employeeDataForPrint.shift_start_end_time}]</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Weekly Off:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.weeklyoff_name}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Bank Account Details:</th>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Name of Bank:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.bank_name1}</td>
                                                    {/* <th className="erp-invoice-print-label-md-lg col-2">Name of Branch:</th>
                                                    <td className="erp-invoice-print-label col-4"></td> */}
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">Account Number:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.account_no1}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">IFSC Code:</th>
                                                    <td className="erp-invoice-print-label col-4">{employeeDataForPrint.ifsc_code1}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="row p-0 m-0">
                    <span className="erp-invoice-print-label" style={{ textDecoration: 'underline',fontWeight: 700 }}>General Agreed Terms</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>Not to wear uniform/apron-Rs.100/-Each Instance penalty</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>For not Wearing I-Card -Rs.50/-Each Instance penalty</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>Mobile is allowed for Authorised persons only (As per HOD instruction)</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>If delay for more than 15 minutes in shift time is observed thrice in a month,than in subsequent cases it will be considered a half day</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>Every employee of the Company needs to compulsorily obey the rules and regulations of the Company</span>

                    <span className="erp-invoice-print-label"style={{ fontWeight: 700 }}>The above terms and conditions have been well explained to me and I agree to the same.</span>

                    <div className="row">
                        <div className='col-6'>
                            <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>Documents to be submitted along with the form:-</span>
                        </div>

                        <div className='col-6'>
                            <span className="erp-invoice-print-label" style={boxStyle}>
                                SALARY :-{employeeDataForPrint.salary} /-
                            </span>
                        </div>
                    </div>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>(1) Employee Aadhar and Pan Card</span>

                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>(2) Passbook or check copy of employee bank account</span>


                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>(3) Employee passport size photographs -3 nos</span>
                    <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <div className='col-3'>
                            <dt className="erp-invoice-print-label-md-lg">Emp :-</dt>
                        </div>
                        <div className='col-3'>
                            <dt className="erp-invoice-print-label-md-lg">HR :-</dt>
                        </div>
                        <div className='col-3'>
                            <dt className="erp-invoice-print-label-md-lg">HOD :-</dt>
                        </div>
                        <div className='col-3'>
                            <dt className="erp-invoice-print-label-md-lg">MD :-</dt>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="m-0 p-0 hr-line" />
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

export default MEmployeePrint;
