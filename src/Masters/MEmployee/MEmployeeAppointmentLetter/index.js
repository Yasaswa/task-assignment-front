import React, { useEffect, useState, useRef } from "react";
import ConfigConstants from "assets/Constants/config-constant";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
import DakshabhiLogo from "assets/images/DakshabhiLogo.png";

const MEmployeeAppointmentLetter = ({ employeeId }) => {
  const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
  const [employeeEarningsData, setEmployeeEarningData] = useState({});
  const [employeeDeductionsData, setEmployeeDeductionData] = useState([]);
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  // const [employee_id, setEmployee_id] = useState(props.employeeID);
  const [earningData, setEarningData] = useState([]);
  const [deductionData, setDeductionData] = useState([]);
  const navigate = useNavigate();
  const [txt_ctc, setCTC] = useState("");
  const frmValidation = useRef();

  // const [selectedEmployeeType, setSelectedEmployeeType] = useState(null);

  const validateNumberDateInput = useRef();
  const [txt_salary, setSalary] = useState("");
  const [cmb_designation_id, setDesignationId] = useState("");
  const { state } = useLocation();
  let { keyForViewUpdate = "Add", compType = "Masters" } = state || {};

  useEffect(() => {
    const loadDataOnload = async () => {
      try {
        await FnShowEarningAndDeductionRecrd();
      } catch (error) {
        console.error(error);
      }
    };
    loadDataOnload();
  }, []);

  const formatDate = (dateInput) => {
    const date = dateInput ? new Date(dateInput) : new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Earning And Deduction Section
  const FnShowEarningAndDeductionRecrd = async () => {
    debugger;
    try {
      const earnHeadDataApiCall = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/designation/FnShowEarningAndDeductionRecords/${COMPANY_ID}`
      );
      const { EarningMappingRecords, DeductionMappingRecords } =
        await earnHeadDataApiCall.json();
      if (employeeId !== 0) {
        await FnCheckUpdateResponce(
          EarningMappingRecords,
          DeductionMappingRecords
        );
      } else {
        setEarningData(EarningMappingRecords);
        setDeductionData(DeductionMappingRecords);
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    }
  };

  const FnCheckUpdateResponce = async (earningHeadData, deductionHeadData) => {
    debugger;
    try {
      const apiCall = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/employees/FnShowSalaryAndWorkProfileRecords/${employeeId}`
      );

      const apiResponse = await apiCall.json();
      let employeeAllDetails = apiResponse.EmployeeMasterRecords;
      let employee_earnings_data = apiResponse.EarningMappingRecords;
      let employee_deductions_data = apiResponse.DeductionMappingRecords;
      let employee_salary_data = apiResponse.EmployeeSalaryRecords;
      setEmployeeDataForPrint(employeeAllDetails);

      setCTC(employee_salary_data.ctc);
      setEmployeeEarningData(employee_earnings_data);
      setEmployeeDeductionData(employee_deductions_data);
      console.log(employeeAllDetails);
      console.log(employee_deductions_data);
      console.log(employee_earnings_data);

      updateEarningRecords(earningHeadData, employee_earnings_data);
      updateDeductionRecords(deductionHeadData, employee_deductions_data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateEarningRecords = (earningHeadData, ExistingEarningRecords) => {
    debugger;
    // Set earning head formula & calculation value
    if (ExistingEarningRecords.length !== 0) {
      let updatedEarningHeadData = earningHeadData.map((rowData) => {
        const correspondingMapRecord = ExistingEarningRecords.find(
          (mapRecord) => mapRecord.earning_heads_id === rowData.earning_heads_id
        );
        if (correspondingMapRecord) {
          // If a matching mapRecord is found, update calculation_value and formula
          return {
            ...rowData,
            calculation_value: correspondingMapRecord.calculation_value,
            formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
            // effective_date: correspondingMapRecord.effective_date,
          };
        }

        // If no matching mapRecord is found, return the original rowData
        return rowData;
      });
      setEarningData(updatedEarningHeadData);
    }
  };

  const updateDeductionRecords = (
    deductionHeadData,
    ExistingDeductionRecords
  ) => {
    debugger;
    // Set deduction head formula & calculation value
    if (ExistingDeductionRecords.length !== 0) {
      let updatedDeductionHeadData = deductionHeadData.map((rowData) => {
        const correspondingMapRecord = ExistingDeductionRecords.find(
          (mapRecord) =>
            mapRecord.deduction_heads_id === rowData.deduction_heads_id
        );

        if (correspondingMapRecord) {
          // If a matching mapRecord is found, update calculation_value and formula
          return {
            ...rowData,
            calculation_value: correspondingMapRecord.calculation_value,
            formula: correspondingMapRecord.formula || "", // Replace with the appropriate field from mapRecord
            // effective_date: correspondingMapRecord.effective_date,
          };
        }

        return rowData;
      });

      setDeductionData(updatedDeductionHeadData);
    }
  };

  const bonus = () => {
    const foundItem = earningData.find(
      (item) => item.earning_head_short_name === "GRS"
    );
    return foundItem ? foundItem.calculation_value / 12 : 0;
  };

  const grossSalary = () => {
    const foundItem = earningData.find(
      (item) => item.earning_head_short_name === "GRS"
    );
    return foundItem ? foundItem.calculation_value : 0;
  };

  const pfContributionFromCompany = () => {
    const foundItem = deductionData.find(
      (item) => item.deduction_head_short_name === "PF"
    );
    return foundItem ? foundItem.calculation_value : 0;
  };

  const gratuity = () => {
    const foundItem = earningData.find(
      (item) => item.earning_head_short_name === "BSC"
    );
    return foundItem ? foundItem.calculation_value * 4.81 / 100 : 0;
  };

  const totalDeductions = deductionData.reduce((sum, item) => {
    return sum + (item.calculation_value || 0);
  }, 0);






  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", margin: "20px", color: "#333" }}
    >
      <div
        className="container"
        style={{
          pageBreakAfter: "always",
          maxWidth: "1000px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          lineHeight: "1.6",
        }}
      >
        <div
          className="col-sm-9 d-flex justify-content-between"
          style={{ height: "1.3in", paddingTop: "1em" }}
        >
          <div className="col-sm-2 p-2">
            <img
              src={DakshabhiLogo}
              alt="master card"
              width="170px"
              height="auto"
              mt={1}
            />
          </div>
          <div className="col-sm-8 text-center">
            <div className="erp-invoice-print-label">
              <span className='erp-invoice-print-label-lg'>{employeeDataForPrint.company_name}</span><br />
              <span className='erp-invoice-print-label-md'>{employeeDataForPrint.company_branch_name}</span>
            </div>
            <div className="erp-invoice-print-label-lg">Appointment Letter</div>
          </div>
        </div>

        <div
          className="date"
          style={{ fontSize: "14px", textAlign: "right", marginBottom: "20px" }}
        >
          Date: {formatDate()}
        </div>
        <br />

        <div
          className="address"
          style={{ fontSize: "14px", marginBottom: "20px" }}
        >
          To,
          <br />
          Mr/Mrs./Miss. <strong>{employeeDataForPrint?.employee_name}</strong>
          <br />
          Address:- <strong>{employeeDataForPrint?.current_address}</strong>
          <br />
          Dear: <strong>{employeeDataForPrint?.employee_name}</strong>
        </div>
        <br />
        <div
          className="content"
          style={{
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <strong>Subject: Appointment Letter</strong>
        </div>
        <br />
        <div>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            With reference to our offer letter dated {formatDate}, we have the
            pleasure of appointing you as{" "}
            {employeeDataForPrint?.designation_name}
            in our organization. Besides what the designation the management and
            is assigned to you from time to time. The terms and conditions of
            your employment are as follows:
          </p>
        </div>

        <div className="terms" style={{ marginTop: "20px" }}>
          <h3 style={{ fontSize: "1.2em", textDecoration: "underline" }}>
            Terms and Conditions
          </h3>
          <br />
          <ol
            style={{
              fontSize: "14px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <li>
              <strong>Remuneration:</strong>
              <br />
              Your compensation will be as per Annexure ‘A’ enclosed herewith.
              The same will be subject to statutory deductions and government
              regulations in force from time to time. You will not be entitled
              to any other benefit/payment except what is stated in Annexure
              ‘A’. Your compensation is strictly confidential and you should not
              divulge any details of your compensation to anyone. If you still
              need to discuss for any reason, please contact HR / undersigned
              only.
            </li>
            <br />
            <li>
              <strong>Place of Work:</strong>
              <br />
              Your work-place will be presently based at Pashupati Campus ,
              Balasar , Kadi-Detroj Road, Kadi. Your appointment is governed by
              the rules and regulations applicable to the other employees of
              your category. At the discretion of the company, you may be posted
              or transferred to any client place / office/branch/location or any
              of our associate companies at any time in any part of India and
              abroad, either presently existing or as may come in existence in
              future.
            </li>
            <br />

            <li>
              <strong>Date of Joining:</strong>
              <br />
              Your date of joining the company’s services and commencement of
              employment is <br />
              {employeeDataForPrint?.date_joining}
            </li>
            <br />

            <li>
              <strong>Probation:</strong>
              <br />
              You will be on probation for a period of six months from the date
              of joining you duties. The probation period may be extended or
              reduced at the sole discretion of the management. You will not
              assume yourself to have been confirmed in the employment of the
              company until the same is intimated to you in writing. During
              probation your services may be terminated by either party giving
              written notice of 15-days as English Calendar month or
              compensation in lieu thereof.
            </li>
            <br />

            <li>
              <strong>Termination Of Employment:</strong>
              <br />
              After confirmation of your services, the employer-employee
              relationship can be terminated by either party upon giving a
              written notice of 30 days as English calendar month or payment in
              lieu thereof. For the purpose of this clause, payment in lieu of
              notice would include the monthly salary. <br />
              Future increment in your remuneration will not be automatic and
              shall depend upon your performance and be at the discretion of the
              company.
              <br />
              You will undergo periodic medical examination as per requirements
              of the company at the company’s cost by any Doctor/ Panel of
              Doctors nominated by the company. If after the examination, the
              company is of the opinion that continuance of your services is not
              desirable or that you are incapable of discharging your duties
              satisfactorily the company reserves the right to terminate your
              services on medical grounds.
            </li>
            <br />

            <li>
              <strong>Other Agreements:</strong>
              <br />
              Nothing contained in this appointment agreement shall terminate,
              revoke or diminish Employee /Executive's obligations or the
              Company's and/or its Affiliates' rights and remedies under law or
              any agreements relating to trade secrets, confidential
              information, non-competition and intellectual property which
              Employee /Executive has executed in the past or may execute in the
              future or contemporaneously with this appointment.
            </li>
            <br />

            <li>
              <strong>Alternative Employment:</strong>
              <br />
              During the period of employment with us, you shall not accept any
              other assignment in any capacity without the written consent of
              the Management and you shall carry out the management’s orders and
              instructions and do your best to promote our company’s interest
              and business.
            </li>
            <br />

            <li>
              <strong>Business Expense:</strong>
              <br />
              The Company shall reimburse business expenses incur on account of
              the company’s work and/or on traveling /conveyance. Such payment
              shall be reimbursed against supporting documents and will be
              govern as per HR Policy published in the company time to time.
            </li>
            <br />

            <li>
              <strong>confidentiality:</strong>
              <br />
              You shall observe secrecy and shall neither during the tenure of
              your services nor after superannuation /separation divulge and/or
              disclose either directly or indirectly to any person / firm /
              company any information or documents which comes to your attention
              / knowledge in the course of your employment and you shall
              strictly adhere to this “confidentiality clause”. The Management
              views the compensation offered to you as an extremely confidential
              matter and any leakage of the same shall be viewed as a serious
              breach of this confidence at your level.
            </li>
            <br />

            <li>
              <strong>Intellectual Property:</strong>
              <br />
              During the course of your employment if you conceive any new or
              advanced method of improving processes / formula/systems/methods
              etc. in relation to the business/operations of the company, such
              developments will be fully communicated to the company and will be
              and remain the sole right/property of the company.
            </li>
            <br />

            <li>
              <strong>Copyrights:</strong>
              <br />
              You Agree that all rights in and to any copyrightable material
              including but not limited to computer program / report/ research
              /database/client profile report which you may originate pursuant
              to a connection with business of the company and which are not
              expressly released by the company in writing, shall be sole and
              exclusive property of the company its successors, assigns or other
              representatives.
            </li>
            <br />

            <li>
              <strong>Misconduct:</strong>
              <br />
              The company shall be at liberty to terminate your employment
              without any notice or compensation if, any time during the period
              of employment if you are found guilty of any act of disobedience,
              indiscipline, insubordination, incivility, insobriety,
              unauthorized absence, dishonesty, fraud or any other serious
              misconduct or neglect or incompetence in the discharge of your
              duties or breach of any stipulation in this appointment letter or
              company’s norms or as per model standing order or HR policy or if
              you become incapacitated or are adjudged insolvent beyond compound
              with your creditors. Company is governed by Model Standing Order
              for any misconduct
            </li>
            <br />

            <li>
              <strong>Absenteism:</strong>
              <br />
              You are entitled for leave with pay as per the rules of the
              company and the rules or any amendments thereto and rules framed
              by the company that may be in force from time to time. The
              granting of leave will depend upon the exigencies of work and will
              be at the sole discretion of the company. You shall not at any
              time absent yourself from your work without prior consent of the
              company in writing. In the event that you fail to attend to your
              duties for a period of 10 (ten) consecutive days, without any
              valid reason or without prior approval of the management, the
              company shall be entitled to terminate your employment without
              notice or compensation.
            </li>
            <br />

            <li>
              That for the purpose of clause Nos. 9, 10 and 11, the company’s
              opinion as to whether any of the events mentioned therein have
              occurred shall be final and binding and you shall not be entitled
              to question the same on any ground.
            </li>
            <br />

            <li>
              <strong>Past Details:</strong>
              <br />
              In case any declaration given or furnished by you to the company
              proves to be false or if you are found to have will fully
              suppressed any material information, you will be liable to removal
              from service without any notice, without any prejudice to the
              right of the company to initiate suitable disciplinary action
              against you.
            </li>
            <br />

            <li>
              <strong>Residential Address:</strong>
              <br />
              You will provide complete and correct information as to your
              residence address, phone numbers etc. In case you are away from
              the said address (except on office duty) for more than seven days
              , You will inform in writing the company or HR about any change in
              your residence address and family status at the earliest. On
              failing to do so, all communication intended to be served on you
              would be sent to your last address as per our records and this
              shall be deemed to be sufficient service of communication to you.
            </li>
            <br />

            <li>
              <strong>Working Hour, Holidays And Leave:</strong>
              <br />
              You will observe the working hours, holidays and leave rules as
              per the service rules/ Company HR policies applicable to your
              category of employees time to time.
            </li>
            <br />

            <li>
              <strong>Prohibition Of Double Employment:</strong>
              <br />
              All the Shops and Establishments Acts and the Factories Act
              prohibit double employment by an employee. As such, an employee is
              not expected to accept any part-time employment and therefore a
              condition to this effect be incorporated that the employee will be
              prohibited to accept any employment either for remuneration or
              otherwise.
            </li>
            <br />

            <li>
              <strong>Retirement:</strong>
              <br />
              You shall retire from the services of the company on completing
              the age of 60 (Sixty Only) years. At its discretion, the company
              may extend your services beyond the above age.
            </li>
            <br />

            <li>
              <strong>Governing Law:</strong>
              <br />
              This appointment and the employment relationship created by it
              shall be governed by laws of the Republic of India. In case of any
              dispute arising out of your employment the Courts, Tribunals
              and/or authorities at Ahmedabad only shall have exclusive
              jurisdiction to entertain and decide such disputes. The parties
              hereby consent to jurisdiction of Ahmedabad for the purpose of any
              litigation relating to this appointment and agree that any
              litigation by or involving them relating to this Agreement shall
              be conducted in the courts of Ahmedabad. Please signify your
              acceptance of the terms and conditions stipulated above by signing
              on the duplicate copy of this letter.
            </li>
          </ol>
        </div>
        <br />
        <div>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Please signify your acceptance of the terms and conditions
            stipulated above by signing on the duplicate copy of this letter.
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Thanking you,
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Yours Faithfully,
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
              fontWeight: "bold",
            }}
          >
            For, Pashupati Cotspin Ltd
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
              fontWeight: "bold  ",
            }}
          >
            Authorized Signatory
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            I have read & understood the aforesaid terms of my appointment
            letter & accept the same without any reservations.
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
              fontWeight: "bold",
            }}
          >
            Name of Employee: {employeeDataForPrint?.employee_name}
          </p>
          <p
            style={{
              fontSize: "14px",
              padding: "10px 0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Acceptance Date & Signature: ________________________________
          </p>
        </div>
        <br />
        <div>
          <h2
            style={{
              marginTop: "12px",
              fontSize: "14px",
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Annexure - A
          </h2>
          <br />
          <p style={{ fontSize: "14px", lineHeight: 0.5 }}>
            <strong>Name: {employeeDataForPrint?.employee_name}</strong>
          </p>
          <p style={{ fontSize: "14px", lineHeight: 0.5 }}>
            <strong>
              Designation: {employeeDataForPrint?.designation_name}
            </strong>
          </p>
          <p style={{ fontSize: "14px", lineHeight: 0.5 }}>
            <strong>Department: {employeeDataForPrint?.department_name}</strong>
          </p>
          <p style={{ fontSize: "14px", lineHeight: 1.5 }}>
            Your Gross Remuneration (CTC) is Rs.<strong>{txt_ctc}</strong>/- per
            annum, which includes all direct and indirect benefits attached to
            your position including Annual / Retiral.A detailed break-up of your
            remuneration package has been outlined:
          </p>

          <table class="table table-bordered" style={{ fontSize: "14px" }}>
            <thead>
              <tr>
                <th
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid black",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Compensation Structure
                </th>
              </tr>

              <tr>
                <th
                  colSpan="2"
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Particulars
                </th>
                <td
                  rowSpan="1"
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Amount
                </td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Earnings
                </th>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Monthly
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  Yearly
                </td>
              </tr>
            </thead>
            <tbody>

              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Basic Salary
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "BSC"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Dearness Allowance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "DA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  HRA
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "HRA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Conveyance Allowance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "CA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Special Allowance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "SA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Other Allowance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "OA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Incentive Allowance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "IA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Arrear Paid
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "AP"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Attend Allow
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "AA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Night Allow
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    earningData.find(
                      (item) => item.earning_head_short_name === "NA"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Gross Salary   (A)
                </th>
                <td style={{ fontWeight: "bold", border: "1px solid #000", padding: "3px" }}>
                  {grossSalary()}
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  Deductions
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                ></td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                ></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  PF
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "PF"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Professional Tax
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "PT"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  TDS
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "TDS"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>

              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Arrear Deduct
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "AD"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Advance
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "ADV"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Fine
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "FN"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  E-PF1
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "PF1"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  E-PF2
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "PF2"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Income Tax
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "ITax"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Light Bill
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "LB"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Canteen
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "CC"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Vander Canteen
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "VC"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  House Rent
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "HR"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Other Deduct
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {
                    deductionData.find(
                      (item) => item.deduction_head_short_name === "OD"
                    )?.calculation_value
                  }
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>

              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",

                  }}
                >
                  Total Deductions (B)
                </td>
                <td
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                > {totalDeductions}</td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                ></td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",

                  }}
                >
                  Take home (A-B)
                </td>
                <td
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                > {grossSalary() - totalDeductions}</td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                ></td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  Company Contribution
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                ></td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                ></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  PF Contribution Employer Share (12% X Basic )
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {pfContributionFromCompany()}
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Gratuity * ( 4.81% of Basic )
                  As per payment of Gratuity Act

                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {gratuity()}
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    fontWeight: "normal",
                    border: "1px solid #000",
                    padding: "3px",
                  }}
                >
                  Bonus
                </th>
                <td style={{ border: "1px solid #000", padding: "3px" }}>
                  {bonus()}
                </td>
                <td style={{ border: "1px solid #000", padding: "3px" }}></td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",

                  }}
                >
                  Total Contribution by Company (D)
                </td>
                <td
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                > {pfContributionFromCompany()+gratuity()+bonus()}</td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",

                  }}
                ></td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #000",
                    padding: "5px",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  Cost To Company (CTC)  (A+D)
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                >{grossSalary() + pfContributionFromCompany() + gratuity() + bonus()}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px",
                    backgroundColor: "#e0e0e0",
                  }}
                ></td>
              </tr>

            </tbody>
          </table>
        </div>

        <div>
          <p style={{ fontSize: "14px", lineHeight: 1.5 }}>
            *Your salary is strictly confidential in nature. You are advice not
            to discuss your salary details with any employee other than your HOD
            and HR. <br />
            ** This compensation Package is subject to personal Income Tax as
            per the Rules in force and you are responsible for due compliance.
            The company will deduct Tax at source as per rules in force from
            time to time.
          </p>

          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            ADDITIONAL POINTS TO NOTE :
          </p>

          <ol style={{ fontSize: "14px", lineHeight: 1.5, marginLeft: "20px" }}>
            <li>
              <strong>Medical Expenses:</strong>
              Medical expenses (domiciliary) for self and dependents. If
              insufficient supporting bills/receipts are provided appropriate
              tax will be deducted.
            </li>
            <li>
              <strong>Gratuity </strong>
              The eligibility of this benefit is only on or after rendering
              continuous 5 years of services in Pashupati Cotspin Ltd,
              calculated as: [(last monthly basic salary / 26) x 30 x numbers of
              years of service].
            </li>
            <li>
              <strong>Group Mediclaim </strong>
              Coverage under Group Mediclaim Policy with coverage limit of
              Rs.1,00,000/- for the employee and family members i.e. Spouse and
              maximum up to Two Children as per policy.
            </li>
            <li>
              <strong>Group PA Policy </strong>
              Coverage under Group Personal Accident Policy with coverage limit
              of Rs.1,00,000/- for the self.
            </li>
            <li>
              <strong>N.A. is “Not Applicable”</strong>
            </li>
          </ol>
        </div>
        <div
          className="footer"
          style={{
            fontSize: "14px",
            marginTop: "40px",
            marginLeft: "20px",
            fontWeight: "bold",
          }}
        >
          <p>
            For, Pashupati Cotspin Ltd
            <br />
            Authorized Signatory
          </p>
        </div>
        <div>
          <p style={{ fontSize: "14px", lineHeight: 1.5, marginLeft: "20px" }}>
            I have read & understood the aforesaid terms -
            <strong>{employeeDataForPrint?.employee_name}</strong>
            <p style={{ marginLeft: "300px" }}>(Employee Name & Signature)</p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MEmployeeAppointmentLetter;
