import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';

//React Bootstrap components
import { Card, Table } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ConfigConstants from "assets/Constants/config-constant";
import MDButton from "components/MDButton";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import MDTypography from "components/MDTypography";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ComboBox from "Features/ComboBox";
import DatePicker from 'react-datepicker';
import { CircularProgress } from "@mui/material";


function FrmLeavesEntry() {

  const today = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName } = configConstants;

  const { state } = useLocation();
  const { keyForViewUpdate } = state || {}

  // UseRefs
  const navigate = useNavigate();
  const validate = useRef();
  const frmValidation = useRef();
  const combobox = useRef();
  const comboDataAPiCall = useRef();
  const validateNumberPercentInput = useRef();

  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState("");

  const [leavesDetails, setLeavesDetailsData] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [cmb_financialyear, setfinancialyear] = useState();

  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [cmb_employee_type, setEmployeeType] = useState([]);
  const [chk_isactive, setIsActive] = useState(true);
  const [effective_date, setEffectiveDate] = useState(today);
  // Loader
  const [isLoading, setIsLoading] = useState(false);

  //Error Msg
  const handleCloseErrModal = () => { setShowErrorMsgModal(false) };


  useEffect(async () => {
    await fillCombos();
  }, [])

  const validateErrorMsgs = () => {
    frmValidation.current.validateFieldsOnChange('leavesDetailsFormId')

  }

  const fillCombos = async () => {
    try {
      resetGlobalQuery();
      globalQuery.columns = ["field_id", "field_name", "short_name"]
      globalQuery.table = "amv_financial_year";
      const finanicalyear = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
      setFinancialYear(finanicalyear)

      const employeeTypesApiCall = await combobox.current.fillComboBox('EmployeeType');
      setEmployeeTypeOptions(employeeTypesApiCall);
    } catch (error) {
      console.log("error: ", error);

    }
  }

  const FnShowLeavesDetailsRecrd = async () => {
    debugger
    try {
      setIsLoading(true)
      const employee_type = document.getElementById('cmb_employee_type').value
      const financial_year = document.getElementById('cmb_financialyear').value
      if (financial_year !== "" && employee_type !== "") {
        resetGlobalQuery();
        globalQuery.columns = ['E.employee_code', 'E.employee_name', 'ML.leave_type_name', 'ML.leave_type_code',
          `IFNULL((select IFNULL(LB1.opening_balance,0) from hm_leaves_balance LB1 where LB1.employee_code = E.employee_code and LB1.is_delete =0 and LB1.leave_type_id  = ML.leave_type_id  and LB1.financial_year =${financial_year} limit 1),0) as opening_balance`,
          `IFNULL((select IFNULL(LB2.leaves_earned,0) from hm_leaves_balance  LB2 where LB2.employee_code =E.employee_code and LB2.is_delete =0 and LB2.leave_type_id  = ML.leave_type_id  and LB2.financial_year = ${financial_year} limit 1),0) as leaves_earned`,
          `IFNULL((select IFNULL(LB2.leaves_taken,0) from hm_leaves_balance  LB2 where LB2.employee_code =E.employee_code and LB2.is_delete =0 and LB2.leave_type_id  = ML.leave_type_id  and LB2.financial_year = ${financial_year} limit 1),0) as leaves_taken`,
          `IFNULL((select IFNULL(LB4.leaves_adjusted,0) from hm_leaves_balance  LB4 where LB4.employee_code =E.employee_code and LB4.is_delete =0 and LB4.leave_type_id  = ML.leave_type_id  and LB4.financial_year = ${financial_year} limit 1),0) as leaves_adjusted`,
          `IFNULL((select IFNULL(LB3.closing_balance,0) from hm_leaves_balance  LB3 where LB3.employee_code =E.employee_code  and LB3.is_delete =0 and LB3.leave_type_id  = ML.leave_type_id  and LB3.financial_year =${financial_year} limit 1),0) as closing_balance`,
          `IFNULL((select IFNULL(LB5.effective_date,0) from hm_leaves_balance  LB5 where LB5.employee_code =E.employee_code  and LB5.is_delete =0 and LB5.leave_type_id  = ML.leave_type_id  and LB5.financial_year =${financial_year} limit 1),0) as effective_date`,
          'ML.leave_type_id', 'E.employee_id', 'E.employee_type',
        ];
        globalQuery.table = "cm_employee E";
        globalQuery.joins = [{
          "table": "hm_leave_type ML",
          "type": "cross",
          "on": [
            {
              "left": "ML.leave_type_paid_flag",
              "right": "'Paid'"
            },

          ]
        }
        ]
        globalQuery.conditions.push({ field: "E.is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "E.is_active", operator: "=", value: 1 });
        globalQuery.conditions.push({ field: "E.company_id", operator: "=", value: COMPANY_ID });
        globalQuery.conditions.push({ field: "ML.is_delete", operator: "=", value: 0 });
        // globalQuery.conditions.push({ field: "ML.leave_type_id", operator: "IN", values: ['1', '2'] });
        globalQuery.conditions.push({ field: "E.employee_type", operator: "=", value: document.getElementById('cmb_employee_type').value });

        globalQuery.orderBy = ['E.employee_code asc', 'ML.leave_type_code Asc']

        const getLeavesDetails = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);
        console.log('getLeavesDetails: ', getLeavesDetails);
        setLeavesDetailsData(getLeavesDetails)
        setEffectiveDate(getLeavesDetails[0].effective_date);
        if (getLeavesDetails[0].effective_date === '0') {
          setEffectiveDate(today());
        }
        // setLeavesDetailsData(getLeavesDetails)
      } else {
        await frmValidation.current.validateForm("leavesDetailsFormId");
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("error: ", error)
    }
  }
  $(document).on('click', '.erp_input_field_table_txt.remove0', function () {
    if ($(this).val() === "0") {
      $(this).val("")
    }
  });
  $(document).on('mouseup mousedown', function (e) {
    let inputBoxes = $(".erp_input_field_table_txt.remove0");
    inputBoxes.each(function () {
      if ($(this).val() === "") {
        $(this).val("0");
      }
    });
  });
  //Fn for render Leaves Details static table 
  const renderLeavesDetailsTable = useMemo(() => {
    return <>
      {leavesDetails.length !== 0 ? (
        <Table id='leavesDetails-table' className="erp_table" bordered striped >
          <thead className="erp_table_head">
            <tr>
              <th className="erp_table_th col-1">Employee Code </th>
              <th className="erp_table_th col-2">Employee Name </th>
              <th className="erp_table_th col-2">LeaveType Desc </th>
              <th className="erp_table_th col-1">Opening Balance</th>
              <th className="erp_table_th col-1">Leaves Earned</th>
              <th className="erp_table_th col-1">Leaves Taken</th>
              <th className="erp_table_th col-1">Leaves Adjusted</th>
              <th className="erp_table_th col-1">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {
              leavesDetails.map((leavesItem, Index) =>
                <tr payTermItemIndex={Index} rowIndex={Index}>
                  <td className="erp_table_td col-1">{leavesItem.employee_code}</td>
                  <td className="erp_table_td col-2">{leavesItem.employee_name}</td>
                  <td className="erp_table_td col-2">{leavesItem.leave_type_name}</td>
                  <td className="erp_table_td col-1">{leavesItem.opening_balance}</td>
                  <td className="erp_table_td col-1">{leavesItem.leaves_earned}</td>
                  <td className="erp_table_td col-1">{leavesItem.leaves_taken}</td>
                  <td className="erp_table_td col-1">
                    <input type="text" className="erp_input_field_table_txt remove0 mb-0  text-end" value={leavesItem.leaves_adjusted} id={"leaves_adjusted_" + leavesItem.leave_type_id}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^-?\d*\.?\d{0,4}$/.test(inputValue)) {
                          updateLeavesDetailsTblData(leavesItem, e);
                        }
                      }}
                      onBlur={(e) => { updateLeavesDetailsTblData(leavesItem, e); }}
                      Headers='leaves_adjusted' disabled={keyForViewUpdate === 'view'} maxLength="19" pattern="-?\d*\.?\d{0,4}" />
                  </td>

                  <td className="erp_table_td col-1">{leavesItem.closing_balance}</td>

                </tr>
              )
            }
          </tbody>
        </Table>
      ) : null}
    </>
  }, [leavesDetails]);


  const leavesDetailsData = async () => {
    const checkIsValidate = await frmValidation.current.validateForm("leavesDetailsFormId");
    if (checkIsValidate) {
      let json = { 'LeavesBalanceData': [], 'commonIds': {} }
      try {
        if (await FnValidateLeavesDetails()) {
          for (let leaves = 0; leaves < leavesDetails.length; leaves++) {
            const leavesDetailsAllData = {
              company_id: COMPANY_ID,
              leave_type_id: leavesDetails[leaves].leave_type_id,
              employee_code: leavesDetails[leaves].employee_code,
              opening_balance: leavesDetails[leaves].opening_balance,
              leaves_earned: leavesDetails[leaves].leaves_earned,
              leaves_taken: leavesDetails[leaves].leaves_taken,
              closing_balance: leavesDetails[leaves].closing_balance,
              leaves_adjusted: leavesDetails[leaves].leaves_adjusted,
              effective_date: effective_date,
              created_by: UserName,
              employee_type: cmb_employee_type,
              financial_year: cmb_financialyear,
              is_active: chk_isactive,
            }
            json.LeavesBalanceData.push(leavesDetailsAllData);
          }
          json.commonIds.employee_type = cmb_employee_type
          json.commonIds.financial_year = cmb_financialyear
          json.commonIds.company_id = COMPANY_ID

          const formData = new FormData();
          formData.append(`HmLeavesBalanceData`, JSON.stringify(json))
          const requestOptions = {
            method: 'POST',
            body: formData
          };
          const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmLeavesBalance/FnAddUpdateRecord`, requestOptions)
          const resp = await apiCall.json()
          console.log(resp);
          if (resp.success === '0') {

            setErrMsg(resp.error)
            setShowErrorMsgModal(true)
          } else {
            setfinancialyear('');
            setEmployeeType('');
            setEffectiveDate(today);
            setLeavesDetailsData([]);
            setIsActive(true);
            console.log("resp: ", resp)
            setSuccMsg(resp.message)
            setShowSuccessMsgModal(true)
          }
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
  }
  const updateLeavesDetailsTblData = (currentLeavesDetails, e) => {
    let clickedColName = e.target.getAttribute('Headers');
    delete e.target.parentElement.dataset.tip;

    switch (clickedColName) {

      case 'leaves_adjusted':
        currentLeavesDetails[clickedColName] = e.target.value
        // if (!currentLeavesDetails.leaves_adjusted) { 
        //   currentLeavesDetails.leaves_adjusted = 0;
        // }
        // Calculate closing balance
        const closing_balance = currentLeavesDetails.opening_balance + currentLeavesDetails.leaves_earned - currentLeavesDetails.leaves_taken + parseFloat(currentLeavesDetails.leaves_adjusted);
        currentLeavesDetails.closing_balance = closing_balance;
        console.log(closing_balance);
        break;
      default:
        break;
    }
    // update the Leaves Details  table data.
    const updateLeavesDetails = [...leavesDetails]
    const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
    updateLeavesDetails[pmtTermIndexInArray] = currentLeavesDetails;
    setLeavesDetailsData(updateLeavesDetails);

  }

  const FnValidateLeavesDetails = async () => {
    let selectedLeaves = $('#leavesDetails-table tbody tr .erp_input_field_table_txt')

    let leaves = true;
    selectedLeaves.each(function () {
      let currentTblRow = $(this.parentElement.parentElement)
      let leavesValue = currentTblRow.find('input[id^="leaves_adjusted_"]').val();
      if (leavesValue === '') {
        $(currentTblRow.find('input[id^="leaves_adjusted_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
        $(currentTblRow.find('input[id^="leaves_adjusted_"]'))[0].focus();
        return leaves = false;
      }
    });
    return leaves;
  }

  const handleDateChange = (key, date) => {
    debugger
    switch (key) {

      case 'effective_date':
        const effective_date = document.getElementById('effective_date').value;

        if (effective_date !== '') {
          $('#error_effective_date').hide();
          setEffectiveDate(date);
        }
        break;

      default:
        break;
    }
  }

  return (
    <>
      <ComboBox ref={comboDataAPiCall} />
      <ComboBox ref={combobox} />
      <FrmValidations ref={validate} />
      <ValidateNumberDateInput ref={validateNumberPercentInput} />
      <FrmValidations ref={frmValidation} />
      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress color="primary" />
            <span id="spinner_text" className="text-dark">Loading...</span>
          </div>
        </div> :
        null}
      <div>
        <div className="erp_top_Form">
          <div className='card p-1'>
            <div className='card-header text-center py-0'>
              <label className='erp-form-label-lg text-center'>Leaves Balance</label>
            </div>
            <form id='leavesDetailsFormId'>
              <div className="row erp_transporter_div ">
                <div className="col-sm-6 erp_form_col_div">
                  <div className="row">

                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                    </div>
                    <div className="col">
                      <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { FnShowLeavesDetailsRecrd(); setEmployeeType(e.target.value); validateErrorMsgs() }} maxLength="255">
                        <option value="" disabled>Select</option>
                        {employeeTypeOptions?.map(employeeTypes => (
                          <option value={employeeTypes.field_name}>{employeeTypes.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className="col-sm-12 erp_form_col_div">
                    <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">Financial year <span className="required">*</span></Form.Label>
                      </div>
                      <div className="col">
                        <select
                          className="form-select form-select-sm" id="cmb_financialyear" value={cmb_financialyear} onChange={(e) => { FnShowLeavesDetailsRecrd(); setfinancialyear(e.target.value); validateErrorMsgs(); }}>
                          <option value="" selected>Select / Financial year</option>
                          {financialYear?.map(finalyear => (
                            <option value={finalyear.short_name}> {finalyear.field_name} </option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_financialyear" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                  </div>
                </div>
                {/* second column */}
                <div className="col-sm-6 erp_form_col_div">
                  <div className="col-sm-12 erp_form_col_div">
                    {/* <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> Effective Date </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="date" id="effective_date" className="erp_input_field" value={effective_date} onChange={e => { setEffectiveDate(e.target.value); }} optional="optional" />
                        <MDTypography variant="button" id="error_effective_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                        </MDTypography>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> Effective Date</Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker selected={effective_date} id="effective_date" onChange={(date) => {
                          handleDateChange('effective_date', date);

                        }}
                          dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" />
                        <MDTypography variant="button" id="error_effective_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Is Active</Form.Label>
                    </div>
                    <div className="col">
                      <div className="erp_form_radio">
                        <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive} onClick={() => { setIsActive(true); }} /> </div>
                        <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={!chk_isactive} onClick={() => { setIsActive(false); }} /> </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="row col-12">
              {/* <div class="col-12 col-lg-12 " style={{ minHeight: "500px;", height: '400px', overflowY: 'auto' }}>
                <div>
                  {renderLeavesDetailsTable}
                </div>
              </div> */}
              <div className="col-12 col-lg-12" style={{ minHeight: "500px", height: '400px', overflowY: 'auto' }}>
                <div>
                  <hr />
                  {leavesDetails.length === 0 ? (
                    <>
                      <Card id="NoRcrdId">
                        <Card.Body>No records found...</Card.Body>
                      </Card>
                    </>
                  ) : (
                    <>
                      {renderLeavesDetailsTable}
                    </>
                  )}
                   <div className="text-center py-0 mb-5">
                {leavesDetails.length !== 0 && (
                  <MDButton type="submit" onClick={() => leavesDetailsData()} className={`erp-gb-button ms-2`} variant="button"
                    fontWeight="regular">Save</MDButton>
                )}
                <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { navigate(`/DashBoard`) }} variant="button"
                  fontWeight="regular">Exit</MDButton>
              </div >
                </div>
              </div>
             
              {/* Success Msg Popup */}
              <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
              {/* Error Msg Popup */}
              <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FrmLeavesEntry;