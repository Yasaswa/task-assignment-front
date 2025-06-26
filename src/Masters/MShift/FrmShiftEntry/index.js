import React, { useState, useEffect, useRef } from "react";

import $ from 'jquery';
import { useNavigate, useLocation } from "react-router-dom";


// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import ConfigConstants from "assets/Constants/config-constant";

// Material Dashboard 2 PRO React components

import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";


// File Imports
import ComboBox from "Features/ComboBox";
import FrmValidations from "FrmGeneric/FrmValidations";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";



function FrmShiftEntry(props) {
  const { state } = useLocation();
  const { shiftId = 0, keyForViewUpdate, compType } = state || {};

  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName, COMPANY_BRANCH_ID } = configConstants;

  //combo 
  const [employeeTypeGroupOptions, setEmployyeTypeGroupOptions] = useState([])

  //  Form Fields
  const [cmb_employee_type_id, setEmployeeTypeId] = useState()
  const [txt_shift_name, setShiftName] = useState('');
  const [txt_grace_early_time, setGraceEarlyTime] = useState('');
  const [txt_grace_late_time_id, setGraceLateTime] = useState('');
  const [dt_start_time, setStartTime] = useState('');
  const [dt_end_time, setEndTime] = useState('');
  const [dt_ot_start_time, setOtStartTime] = useState('');
  const [txt_halfday_hours_id, setHalfDayHours] = useState('');
  const [txt_fullfday_hours_id, setFullDayHours] = useState('');
  const [txt_shift_grace_hours_min_id, setShiftGraceHoursMin] = useState('');
  const [txt_shift_grace_hours_max_id, setShiftGraceHoursMax] = useState('');
  const [chk_auto_rotate_flag, setAutoRotateFlag] = useState(false);
  const [chk_two_day_shift, setTwoDayShift] = useState(false);
  const [chk_isactive, setIsActive] = useState(true);
  const [actionType, setActionType] = useState('')

  // Error Msg HANDLING

  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    navigate(`/Masters/FrmShiftListing`)
  }

  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');


  const comboDataAPiCall = useRef();
  const validate = useRef();

  // For navigate
  const navigate = useNavigate();

  useEffect(() => {
    const functionCall = async () => {
      await ActionType();
      await fillComobos();
      if (shiftId !== 0) {
        await FnCheckUpdateResponce();
      }
    }
    functionCall()

  }, [])

  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        break;
      case 'view':
        setActionType('(View)');
        break;
      default:
        setActionType('(Creation)');
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      let checkIsValidate = false;

      checkIsValidate = await validate.current.validateForm("shiftNameId");
      if (!checkIsValidate) { return false }
      let validate_Date = validate_time();
      if (checkIsValidate === true && validate_Date === true) {
        if (shiftId === '' || shiftId === null) { shiftId = 0 }

        const data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          employee_type_group: cmb_employee_type_id,
          shift_id: shiftId,
          created_by: UserName,
          modified_by: shiftId === 0 ? null : UserName,
          shift_name: txt_shift_name,
          start_time: dt_start_time,
          end_time: dt_end_time,
          ot_start_time: dt_ot_start_time,
          grace_early_time: txt_grace_early_time,
          grace_late_time: txt_grace_late_time_id,
          halfday_hours: txt_halfday_hours_id,
          fullday_hours: txt_fullfday_hours_id,
          shift_grace_hours_min: txt_shift_grace_hours_min_id,
          shift_grace_hours_max: txt_shift_grace_hours_max_id,
          auto_rotate_flag: chk_auto_rotate_flag,
          two_day_shift: chk_two_day_shift,
          is_active: chk_isactive,


        };
        console.log(data);
        const requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/shift/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          const evitCache = comboDataAPiCall.current.evitCache();
          console.log(evitCache);
          var data1 = responce.data
          console.log("shiftData", data1);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          // sessionStorage.removeItem("shiftID");
          // sessionStorage.setItem("shiftId", data1.shift_id)
          await FnCheckUpdateResponce();

        }

      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  };
  const validate_time = () => {
    debugger
    let dt_start_time = $('#dt_start_time').val();
    let dt_end_time = $('#dt_end_time').val();
    let isValid = true; // Flag to track overall validity

    // Validate start time
    if (dt_start_time === '') {
      $('#error_dt_start_time').text('Please Fill The Start Time').show();
      isValid = false;
      return false;
    } else {
      $('#error_dt_start_time').hide();
    }

    // Validate end time
    if (dt_end_time === '') {
      $('#error_dt_end_time').text('Please Fill The End Time').show();
      isValid = false;
      return false;

    } else {
      $('#error_dt_end_time').hide();
    }

    return isValid;
  };


  const FnCheckUpdateResponce = async () => {
    try {

      if (shiftId !== "undefined" && shiftId !== '' && shiftId !== null) {
        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/shift/FnShowParticularRecordForUpdate/${shiftId}`)
        const updateRes = await apiCall.json();

        const resp = updateRes.data;
        if (resp !== null && resp !== "") {
          await fillComobos();
          setEmployeeTypeId(resp.employee_type_group);
          setShiftName(resp.shift_name);
          setStartTime(resp.start_time);
          setEndTime(resp.end_time);
          setOtStartTime(resp.ot_start_time);
          setGraceEarlyTime(resp.grace_early_time);
          setGraceLateTime(resp.grace_late_time);
          setHalfDayHours(resp.halfday_hours);
          setFullDayHours(resp.fullday_hours);
          setAutoRotateFlag(resp.auto_rotate_flag);
          setTwoDayShift(resp.two_day_shift);
          setShiftGraceHoursMin(resp.shift_grace_hours_min);
          setShiftGraceHoursMax(resp.shift_grace_hours_max);
          setIsActive(resp.is_active);


          // var keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');

          switch (keyForViewUpdate) {
            case 'view':
              await validate.current.readOnly("shiftNameId");
              $("input[type=radio]").attr('disabled', true);
              $('#dt_start_time').attr('disabled', true);
              $('#dt_end_time').attr('disabled', true);
              $('#dt_ot_start_time').attr('disabled', true);
              break;
            case 'update':
              $('#cmb_employee_type_id').attr('disabled', true);
              $('#btn_save').attr('disabled', false);
              $('#txt_shift_name').attr('disabled', true);
              break;

          }
        }


      }
      else {
        await fillComobos();
      }

    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }


  const fillComobos = async () => {
    comboDataAPiCall.current.fillMasterData("amv_properties", "properties_master_name", "EmployeeTypeGroup").then((productTypeApiCall) => {
      setEmployyeTypeGroupOptions(productTypeApiCall)
    })


  }
  const comboOnChange = async (key) => {
    switch (key) {
      case 'shiftType':
        var productTpVal = document.getElementById('cmb_employee_type_id').value;
        setEmployeeTypeId(productTpVal)
        if (productTpVal !== "") {
          $('#error_cmb_employee_type_id').hide();
        }

    }


  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange('shiftNameId')
  }

  // const validatedatetimeFields = () => {
  //   debugger;
  //   const startDateTime = document.getElementById('dt_start_time').value;
  //   const endDateTime = document.getElementById('dt_end_time').value;
  //   const otStartDateTime = document.getElementById('dt_ot_start_time').value;

  //   if (startDateTime !== "") {
  //     validateFields();
  //     if (endDateTime !== "") {
  //       const startDateTimeObj = new Date(startDateTime);
  //       const endDateTimeObj = new Date(endDateTime);

  //       if (startDateTimeObj >= endDateTimeObj) {
  //         $(`#error_dt_end_time`).text(`End Date time should be greater than Start Date Time `);
  //         $(`#error_dt_end_time`).show();
  //         return; // Exit function if endDateTime is not valid
  //       } else {
  //         $(`#error_dt_end_time`).hide();
  //       }

  //       if (otStartDateTime !== "") {
  //         const otStartDateTimeObj = new Date(otStartDateTime);

  //         // Calculate the date for comparison
  //         const comparisonDate = endDateTimeObj.getHours() === 0 && endDateTimeObj.getMinutes() === 0 ?
  //           new Date(endDateTimeObj.getFullYear(), endDateTimeObj.getMonth(), endDateTimeObj.getDate() + 1) :
  //           endDateTimeObj;

  //         // Adding 1 hour to endDateTimeObj
  //         const oneHourAfterEnd = new Date(endDateTimeObj);
  //         oneHourAfterEnd.setHours(oneHourAfterEnd.getHours() + 1);

  //         if (otStartDateTimeObj < oneHourAfterEnd || otStartDateTimeObj.getDate() !== comparisonDate.getDate()) {
  //           $(`#error_dt_ot_start_time`).text(`OT Start Time should be on the same date as the End Time and at least 1 hour after.`);
  //           $(`#error_dt_ot_start_time`).show();
  //         } else {
  //           $(`#error_dt_ot_start_time`).hide();
  //         }
  //       }
  //     }
  //   }
  // };

  // const validatedatetimeFields = () => {
  //   debugger;
  //   const startDateTime = document.getElementById('dt_start_time').value;
  //   const endDateTime = document.getElementById('dt_end_time').value;

  //   if (startDateTime !== "") {
  //     validateFields();
  //     if (endDateTime !== "") {
  //       // Compare the times as strings
  //       if (startDateTime >= endDateTime) {
  //         $(`#error_dt_end_time`).text(`End time should be greater than Start Time`);
  //         $(`#error_dt_end_time`).show();
  //         return; // Exit function if endDateTime is not valid
  //       } else {
  //         $(`#error_dt_end_time`).hide();
  //       }
  //     }
  //   }
  // };



  const validateNo = (key) => {
    debugger
    const numCheck = /^[0-9]*\.?[0-9]*$/;

    switch (key) {

      case 'GraceEarlyTime':
        var GraceEarlyTime = $('#txt_grace_early_time').val();
        if (numCheck.test(GraceEarlyTime)) {
          setGraceEarlyTime(GraceEarlyTime)
        }

        break;

      case 'GraceLastTime':
        var GraceLastTime = $('#txt_grace_late_time_id').val();
        if (numCheck.test(GraceLastTime)) {
          setGraceLateTime(GraceLastTime)
        }
        break;

      case 'HalfDayHOurs':
        var HalfDayHOurs = $('#txt_halfday_hours_id').val();
        if (numCheck.test(HalfDayHOurs)) {
          setHalfDayHours(HalfDayHOurs)
        }
        break;

      case 'FullDayHours':
        var FullDayHours = $('#txt_fullfday_hours_id').val();
        if (numCheck.test(FullDayHours)) {
          setFullDayHours(FullDayHours)
        }
        break;

      case 'ShiftHoursGraceMin':
        var ShiftHoursGraceMin = $('#txt_shift_grace_hours_min_id').val();
        if (numCheck.test(ShiftHoursGraceMin)) {
          setShiftGraceHoursMin(ShiftHoursGraceMin)
        }

        break;

      case 'ShiftHoursGraceMax':
        var ShiftHoursGraceMax = $('#txt_shift_grace_hours_max_id').val();
        if (numCheck.test(ShiftHoursGraceMax)) {
          setShiftGraceHoursMax(ShiftHoursGraceMax)
        }
        break;
      default:

    }
  }




  return (
    <>
      <ComboBox ref={comboDataAPiCall} />
      <FrmValidations ref={validate} />

      <div className='erp_top_Form'>
        <div className='card p-1'>

          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>Shift {actionType}  </label>
          </div>

          <form id="shiftNameId">
            <div className='row erp_transporter_div'>

              {/* //first column */}
              <div className="col-sm-6 erp_form_col_div">
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Employee Type Group <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <select id="cmb_employee_type_id" className="form-select form-select-sm" value={cmb_employee_type_id} onChange={() => comboOnChange('shiftType')}>
                      <option value="">Select</option>
                      {/* <option value="0">Add New Record+</option> */}
                      {employeeTypeGroupOptions?.map(shiftType => (
                        <option value={shiftType.field_name}>{shiftType.field_name}</option>

                      ))}

                    </select>
                    <MDTypography variant="button" id="error_cmb_employee_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Shift Name <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_shift_name" className="erp_input_field" value={txt_shift_name} onChange={e => { setShiftName(e.target.value); validateFields() }} maxLength="100" />
                    <MDTypography variant="button" id="error_txt_shift_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Start Time <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="time" id="dt_start_time" className="erp_input_field" value={dt_start_time} onChange={e => { setStartTime(e.target.value); validate_time(); }} />
                    <MDTypography variant="button" id="error_dt_start_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">End Time <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="time" id="dt_end_time" className="erp_input_field" value={dt_end_time} onChange={e => { setEndTime(e.target.value);; validate_time(); }} />
                    <MDTypography variant="button" id="error_dt_end_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">OT Start Time</Form.Label>
                  </div>
                  <div className="col">
                    {/* <Form.Control type="datetime-local" id="dt_ot_start_time" className="erp_input_field optional" value={dt_ot_start_time} onChange={e => { setOtStartTime(e.target.value); validatedatetimeFields(); }} optional="optional" /> */}
                    <Form.Control type="time" id="dt_ot_start_time" className="erp_input_field optional" value={dt_ot_start_time} onChange={e => { setOtStartTime(e.target.value); }} optional="optional" />
                    <MDTypography variant="button" id="error_dt_ot_start_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Grace Early Time </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id="txt_grace_early_time" className="erp_input_field  text-end" value={txt_grace_early_time} onChange={e => { validateNo('GraceEarlyTime'); validateFields() }} maxLength="10" optional="optional" />
                    <MDTypography variant="button" id="error_txt_grace_early_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                    </MDTypography>
                  </div>
                </div>

                <div className='row'>
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Grace Late Time </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id='txt_grace_late_time_id' className="erp_input_field  text-end" value={txt_grace_late_time_id} onChange={e => { validateNo('GraceLastTime'); }} maxLength="10" optional='optional' />
                    <MDTypography variant="button" id="error_txt_grace_late_time_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

              </div>

              {/* second column */}
              <div className="col-sm-6 erp_form_col_div">

                <div className='row'>
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Half-day Hrs.</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id='txt_halfday_hours_id' className="erp_input_field  text-end" value={txt_halfday_hours_id} onChange={e => { validateNo('HalfDayHOurs'); }} maxLength="10" optional='optional' />
                    <MDTypography variant="button" id="error_txt_halfday_hours_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>


                <div className='row'>
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label"> Full-day Hrs. </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id='txt_fullfday_hours_id' className="erp_input_field  text-end" value={txt_fullfday_hours_id} onChange={e => { validateNo('FullDayHours'); }} maxLength="10" optional='optional' />
                    <MDTypography variant="button" id="error_txt_fullfday_hours_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Auto Rotate</Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_auto_rotate_flag" checked={chk_auto_rotate_flag === true} onClick={() => { setAutoRotateFlag(true); validateFields(); }} /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="chk_auto_rotate_flag" checked={chk_auto_rotate_flag === false} onClick={() => { setAutoRotateFlag(false); validateFields(); }} /> </div>
                    </div>


                  </div>
                </div>


                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Two Day Shift   </Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_two_day_shift" checked={chk_two_day_shift === true} onClick={() => { setTwoDayShift(true); validateFields(); }} /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="chk_two_day_shift" checked={chk_two_day_shift === false} onClick={() => { setTwoDayShift(false); validateFields(); }} /> </div>
                    </div>


                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Min.Grace Hrs. </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id="txt_shift_grace_hours_min_id" className="erp_input_field  text-end" value={txt_shift_grace_hours_min_id} onChange={e => { validateNo('ShiftHoursGraceMin'); }} maxLength="10" optional="optional" />
                    <MDTypography variant="button" id="error_txt_shift_grace_hours_min_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                    </MDTypography>
                  </div>
                </div>


                <div className='row'>
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Max. Grace Hrs. </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id='txt_shift_grace_hours_max_id' className="erp_input_field  text-end" value={txt_shift_grace_hours_max_id} onChange={e => { validateNo('ShiftHoursGraceMax'); }} maxLength="10" optional='optional' />
                    <MDTypography variant="button" id="error_txt_shift_grace_hours_max_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>



                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">is Active   </Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_isactive" checked={chk_isactive === true} onClick={() => { setIsActive(true); validateFields(); }} optional='optional' /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="chk_isactive" checked={chk_isactive === false} onClick={() => { setIsActive(false); validateFields(); }} optional='optional' /> </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </form>
          <div className="card-footer py-0 text-center">
            {/* onClick={updateCustomer}  */}
            <MDButton type="button" className="erp-gb-button"
              onClick={() => {
                const path = compType === 'Register' ? '/Masters/FrmShiftListing/reg' : '/Masters/FrmShiftListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular" disabled={props.btn_disabled ? true : false}
            >Back</MDButton>

            {keyForViewUpdate !== 'view' ? (
              <MDButton type="button" id="btn_save" onClick={handleSubmit} className="erp-gb-button erp_MLeft_btn" variant="button"
                fontWeight="regular">save</MDButton>
            ) : null}

          </div >
        </div>
      </div>


      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

    </>
  )
}

export default FrmShiftEntry
