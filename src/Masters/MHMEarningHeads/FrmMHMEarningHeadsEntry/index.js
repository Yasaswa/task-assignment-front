import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from "react-router-dom";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import GenerateMaterialId from "FrmGeneric/GenerateMaterialId/GenerateMaterialId";

function FrmMHMEarningHeadsEntry() {

  // var updateData = JSON.parse(sessionStorage.getItem('earning_headsID'));

  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { state } = useLocation();
  const { earning_headsIDs = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  // useReff
  const navigate = useNavigate()
  const comboDataAPiCall = useRef();
  const validate = useRef();
  const validateNumberDateInput = useRef();
  const generateMaterialIdAPiCall = useRef();


  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/MHMEarningHeads/MHMEarningHeadsListing`)
    }
  }

  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  //MHMEarningHeads form Feilds   
  const [txt_earning_head_version, setearningheadversion] = useState('1')
  const [txt_earning_heads_id, setearningheadsid] = useState(0)
  const [chk_Calculationtype, setCalculationtype] = useState("Amount")
  const [txt_earning_head_name, setearningheadname] = useState("")
  const [txt_earning_type, setearningtype] = useState("")
  const [txt_earning_head_short_name, setearningheadshortname] = useState("")
  const [txt_head_position, setheadposition] = useState("")
  const [txt_calculation_value, setcalculationvalue] = useState("")
  const [txt_remark, setremark] = useState("")
  const [txt_Formula, setFormula] = useState("")
  const [txt_earning_code, setEarningCode] = useState("")

  // cmb
  const [cmb_salary_parameter1, setsalaryparameter1] = useState("")
  const [cmb_salary_parameter2, setsalaryparameter2] = useState("")
  const [cmb_salary_parameter3, setsalaryparameter3] = useState("")
  const [cmb_salary_parameter4, setsalaryparameter4] = useState("")
  const [cmb_salary_parameter5, setsalaryparameter5] = useState("")
  const [cmb_salary_parameter6, setsalaryparameter6] = useState("")
  const [cmb_salary_parameter7, setsalaryparameter7] = useState("")
  const [cmb_salary_parameter8, setsalaryparameter8] = useState("")
  const [cmb_salary_parameter9, setsalaryparameter9] = useState("")
  const [cmb_salary_parameter10, setsalaryparameter10] = useState("")

  //combo options
  const [salaryParameterList, setSalaryParameterList] = useState([])
  const [disableSalaryParameters, setDisableSalaryParameters] = useState(true);

  const [actionType, setActionType] = useState('')



  // Handler for radio button change
  const handleCalculationTypeChange = (type) => {
    setCalculationtype(type);
    setDisableSalaryParameters(type === 'Amount');

    // Clear all saved values when "Amount" is selected
    if (type === 'Amount') {
      setsalaryparameter1('');
      setsalaryparameter2('');
      setsalaryparameter3('');
      setsalaryparameter4('');
      setsalaryparameter5('');
      setsalaryparameter6('');
      setsalaryparameter7('');
      setsalaryparameter8('');
      setsalaryparameter9('');
      setsalaryparameter10('');
      setFormula('');
    } else if (type === 'Formula') {
      setcalculationvalue('');
    }
  };



  useEffect(async () => {
    await fillComobos();
    if (earning_headsIDs !== 0) {
      await FnCheckUpdateResponce();
    }
    if (earning_headsIDs === 0) {
      await FnGenerateMaterialId();
    }
    await ActionType()
  }, [])

  const FnGenerateMaterialId = async () => {
    const autoNoApiCall = await generateMaterialIdAPiCall.current.GenerateCode("hm_earning_heads", "earning_code", '', '', 'E', "4");
    setEarningCode(autoNoApiCall);
    return autoNoApiCall;
  }

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

  const validateFields = () => {
    validate.current.validateFieldsOnChange('earningheadsformid')
  }


  const fillComobos = async () => {
    try {
      const salaryParametersList = await comboDataAPiCall.current.fillMasterData("hmv_earning_deduction_heads", "", "");
      setSalaryParameterList(salaryParametersList);

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const addearningheads = async () => {
    debugger
    try {
      let checkIsValidate = await validate.current.validateForm("earningheadsformid");
      if (chk_Calculationtype === "Formula") {
        let salaryFormula = $('#txt_Formula').val().toLowerCase().trim();


        // Add validation to check if the formula contains disallowed parameters
        // const allowedParameters = Array.from({ length: 10 }, (_, i) => `p${i + 1}`); // Generate p1 to p10
        // if (!allowedParameters.every(param => salaryFormula.includes(param))) {
        //   $('#error_txt_Formula').text('Invalid or missing parameters in the formula.');
        //   $('#error_txt_Formula').show();
        // } else if (allowedParameters.every(param => !salaryFormula.includes(param))) {
        //   $('#error_txt_Formula').text('Invalid formula.');
        //   $('#error_txt_Formula').show();
        //   return false;
        // }

        let parameterCmbValue;
        if (salaryFormula !== '') {
          $('#error_txt_Formula').hide();
          for (let parameterCount = 1; parameterCount <= 10; parameterCount++) {
            $(`#error_cmb_salary_parameter${parameterCount}`).hide();
            let parameter = `p${parameterCount}`;
            let comboValue = $(`#cmb_salary_parameter${parameterCount}`).val();
            if (salaryFormula.includes(parameter) && $(`#cmb_salary_parameter${parameterCount}`).val() === '') {
              $(`#error_cmb_salary_parameter${parameterCount}`).text('This parameter is added in the formula but you not selected...!');
              $(`#error_cmb_salary_parameter${parameterCount}`).show();
              return false;
            } else if (comboValue !== '' && !salaryFormula.includes(parameter)) {
              $(`#error_cmb_salary_parameter${parameterCount}`).text(`You've selected ${parameter}, but it's not used in the formula.`);
              $(`#error_cmb_salary_parameter${parameterCount}`).show();
              return false;
            }
          }
        }
        else {
          $('#error_txt_Formula').text("Please insert the salary formula.");
          $('#error_txt_Formula').show();
          return;
        }
      }


      if (checkIsValidate === true) {
        var active;
        var activeValue = document.querySelector('input[name=isearningheadsActive]:checked').value
        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }

        var Calculationtype = document.querySelector('input[name=chk_Calculationtype]:checked').value
        setCalculationtype(Calculationtype);
        console.log("Calculationtype: ", Calculationtype);
        const data = {
          company_branch_id: COMPANY_BRANCH_ID,
          company_id: COMPANY_ID,
          earning_heads_id: txt_earning_heads_id,
          earning_head_name: txt_earning_head_name,
          earning_type: txt_earning_type,
          earning_head_short_name: txt_earning_head_short_name.trim(),
          head_position: txt_head_position,
          calculation_type: chk_Calculationtype,
          calculation_value: txt_calculation_value,
          salary_parameter1: cmb_salary_parameter1,
          salary_parameter1: cmb_salary_parameter1,
          salary_parameter2: cmb_salary_parameter2,
          salary_parameter3: cmb_salary_parameter3,
          salary_parameter4: cmb_salary_parameter4,
          salary_parameter5: cmb_salary_parameter5,
          salary_parameter6: cmb_salary_parameter6,
          salary_parameter7: cmb_salary_parameter7,
          salary_parameter8: cmb_salary_parameter8,
          salary_parameter9: cmb_salary_parameter9,
          salary_parameter10: cmb_salary_parameter10,
          earning_head_version: txt_earning_head_version,
          formula: txt_Formula,
          remark: txt_remark,
          is_active: active,
          created_by: UserName,
          modified_by: earning_headsIDs === 0 ? null : UserName,
          earning_code: txt_earning_code,

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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmEarningHeads/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce.data);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          const evitCache = await comboDataAPiCall.current.evitCache();
          console.log(evitCache);
          console.log("earning_heads_id", responce.data);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          // await FnCheckUpdateResponce();
        }

      }
    } catch (error) {
      console.log("error: ", error);
      navigate('/Error')
    }
  }


  {/* Function for fetch details for view or edit */ }
  const FnCheckUpdateResponce = async () => {
    debugger
    try {
      // if (earning_headsIDs !== "undefined" && earning_headsIDs !== '' && earning_headsIDs !== null) {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmEarningHeads/FnShowParticularRecordForUpdate/${earning_headsIDs}/${COMPANY_ID}`)
      const updateRes = await apiCall.json();
      const data = updateRes.data
      if (data !== null && data !== "") {
        setearningheadversion(data.earning_head_version)
        setearningheadsid(data.earning_heads_id)
        setearningheadname(data.earning_head_name)
        setCalculationtype(data.calculation_type)
        setearningtype(data.earning_type)
        setearningheadshortname(data.earning_head_short_name)
        setheadposition(data.head_position)
        setcalculationvalue(data.calculation_value)
        setremark(data.remark)
        setFormula(data.formula)
        setsalaryparameter1(data.salary_parameter1)
        setsalaryparameter2(data.salary_parameter2)
        setsalaryparameter3(data.salary_parameter3)
        setsalaryparameter4(data.salary_parameter4)
        setsalaryparameter5(data.salary_parameter5)
        setsalaryparameter6(data.salary_parameter6)
        setsalaryparameter7(data.salary_parameter7)
        setsalaryparameter8(data.salary_parameter8)
        setsalaryparameter9(data.salary_parameter9)
        setsalaryparameter10(data.salary_parameter10)
        setEarningCode(data.earning_code)

        switch (data.calculation_type) {
          case true:
            document.querySelector('input[name="chk_Calculationtype"][value="Amount"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="chk_Calculationtype"][value="Formula"]').checked = true;
            break;
        }

        switch (data.is_active) {
          case true:
            document.querySelector('input[name="isearningheadsActive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isearningheadsActive"][value="0"]').checked = true;
            break;
        }

        // var keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');
        switch (keyForViewUpdate) {
          case 'update':
            // $("input[type=radio]").attr('disabled', true);
            $('#txt_earning_head_short_name').attr('disabled', true);
            $('#chk_CalculationtypeFormula').attr('disabled', true);
            $('#chk_CalculationtypeAmt').attr('disabled', true);
            $('#btn_save').attr('disabled', false);
            $('#txt_earning_head_name').attr('disabled', true);
            if (data.calculation_type !== 'Amount') {
              await validate.current.removeReadOnlyAttr("earningheadsformid");
            }
            break;
          case 'view':
            await validate.current.readOnly("earningheadsformid");
            $("input[type=radio]").attr('disabled', true);
            break;
        }
        // }

      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  const validateNo = (noKey) => {
    const regexNo = /^[0-9\b]+$/;
    const value = noKey.target.value
    switch (noKey.target.id) {
      case 'txt_head_position':
        if (regexNo.test(value) || value === '') {
          setheadposition(value)
        }
        break;

    }

  }


  const validateString = (input) => {
    if (input.includes('p')) {
      input = input.toUpperCase();
    }

    if (input === '' || /[/\-%+\\=*]/.test(input[0])) {
      ///Setting value as '' if input is 0 or ''
      setFormula('');
      return false;
    } else {
      const pattern = /^[(){}/%+\-*=P<>.!\d\s]+$/;
      if (!pattern.test(input)) {
        //Doesn't allow other than these characters
        return false;
      }

      for (let i = 0; i < input.length - 1; i++) {
        if (((input[i]) === 'P' && (input[i + 1]) === '0') || ((input[i]) === 'P' && (input[i + 1]) === 'P') || (/\d/.test(input[i]) && (input[i + 1]) === 'P')) {
          ///Doesn't allow 'p0' or any numerical value with 'p' or Consecutive two P's
          return false;
        }

        // Check in between 'p1' and 'p10'.
        if (input[i] === 'P' && !isNaN(input[i + 1]) && !isNaN(input[i + 2])) {
          const num1 = (input[i + 1]);
          const num2 = (input[i + 2]);
          const tot = num1 + num2;
          if (parseInt(tot) > 10 || parseInt(tot) === 0 || (num1 === '0' && parseInt(tot) < 10)) {
            return false; // Two consecutive numbers are greater than 10(Doesn't allow other than p11 & so on...)
          }
        }

        if ((input[i]) === 'P' && isNaN(input[i + 1])) {
          return false; ////Not allowing P with other than 1-10
        }

        ///Validating not to enter 3 consecutive !<>=
        const specialpatterns = ['!', '<', '>', '='];
        const possiblePatterns = ['!=', '<=', '>='];
        if (specialpatterns.includes(input[i])) {
          const pattern1 = input[i];
          const pattern2 = input[i + 1];
          if (specialpatterns.includes(pattern2)) {
            if (pattern1 === pattern2) {
              return false;
            }
            if (specialpatterns.includes(input[i + 2])) {
              return false;
            }
            const req_pattern = pattern1 + pattern2;
            if (!possiblePatterns.includes(req_pattern)) {
              return false;
            }
          }
        }

        // Check for consecutive accepted characters
        const acceptedCharacters = '{}/=+-*%.';
        if (acceptedCharacters.includes(input[i]) && acceptedCharacters.includes(input[i + 1])) {
          return false; // Two consecutive accepted characters are not allowed
        }
      }

      setFormula(input);
      return true;
    }
  }



  return (
    <>
      <ComboBox ref={comboDataAPiCall} />
      <FrmValidations ref={validate} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <GenerateMaterialId ref={generateMaterialIdAPiCall} />

      <div className='erp_top_Form'>
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>Earning Heads {actionType}</label>
          </div>
          <form id="earningheadsformid">
            <div className="row erp_transporter_div">
              {/* First Collumn */}
              <div className="col-sm-6 erp_form_col_div">
                {/*Earning Head Name Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Earning Head Name <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <Form.Control type="text" className="erp_input_field" id="txt_earning_head_name" value={txt_earning_head_name} onChange={e => { setearningheadname(e.target.value); validateFields(); }} maxLength="500" />
                    <MDTypography variant="button" id="error_txt_earning_head_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>

                  <div className="col-sm-2">
                    <Form.Control type="text" id='txt_earning_head_version' className="erp_input_field" value={txt_earning_head_version} onChange={(e) => { setearningheadversion(e.target.value); validateFields(); }} disabled />
                    <MDTypography variant="button" id="error_txt_earning_head_version" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Earning Head Code <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col-sm-8 mb-3">
                    <Form.Control type="text" className="erp_input_field" id="txt_earning_code" value={txt_earning_code} maxLength="100" disabled />
                    <MDTypography variant="button" id="error_txt_earning_code" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                {/* Earning Type Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Earning Type </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field" id="txt_earning_type" value={txt_earning_type} onChange={e => { setearningtype(e.target.value); validateFields(); }} maxLength="255" optional='optional' />
                    <MDTypography variant="button" id="error_txt_earning_type" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>



                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Calculation Type <span className="required">*</span> </Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck me-2"> <Form.Check className="erp_radio_button" id="chk_CalculationtypeAmt" label="Amount" type="radio" lbl="Amount" value="Amount" name="chk_Calculationtype" checked={chk_Calculationtype === "Amount"} onChange={() => handleCalculationTypeChange('Amount')} onClick={() => setCalculationtype("Amount")} disabled={keyForViewUpdate === 'view'} /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" id="chk_CalculationtypeFormula" label="Formula" type="radio" lbl="Formula" value="Formula" name="chk_Calculationtype" checked={chk_Calculationtype === "Formula"} onChange={() => handleCalculationTypeChange('Formula')} onClick={() => setCalculationtype("Formula")} disabled={keyForViewUpdate === 'view'} /> </div>
                    </div>
                  </div>
                </div>


                {/* Salary parameter 1 Row */}

                {
                  chk_Calculationtype === "Formula" ?
                    <>     <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 1 <span style={{ color: '#52E919' }}>(EP1)</span> </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter1" className="form-select form-select-sm" value={cmb_salary_parameter1} onChange={(e) => { setsalaryparameter1(e.target.value); }} disabled={disableSalaryParameters} optional='optional'    >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter1 => (
                            <option value={salaryparameter1.field_id}>{salaryparameter1.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> </> : ""

                }



                {/* Salary parameter 2 Row */}
                {
                  chk_Calculationtype === "Formula" ?
                    <>     <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 2 <span style={{ color: '#52E919' }}>(EP2)</span>  </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter2" className="form-select form-select-sm" value={cmb_salary_parameter2} onChange={(e) => { setsalaryparameter2(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter2 => (
                            <option value={salaryparameter2.field_id}>{salaryparameter2.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> </> : ""

                }




                {/* Salary parameter 3 Row */}

                {
                  chk_Calculationtype === "Formula" ?
                    <>   <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param  3 <span style={{ color: '#52E919' }}>(EP3)</span> </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter3" className="form-select form-select-sm" value={cmb_salary_parameter3} onChange={(e) => { setsalaryparameter3(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter3 => (
                            <option value={salaryparameter3.field_id}>{salaryparameter3.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter3" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> </> : ""

                }


                {
                  chk_Calculationtype === "Formula" ?
                    <>
                      <div className='row'>
                        <div className='col-sm-4'>
                          <Form.Label className="erp-form-label">Salary param 4  <span style={{ color: '#52E919' }}>(EP4)</span>  </Form.Label>
                        </div>
                        <div className='col'>
                          <select id="cmb_salary_parameter4" className="form-select form-select-sm" value={cmb_salary_parameter4} onChange={(e) => { setsalaryparameter4(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                            <option value="">Select</option>
                            {salaryParameterList?.map(salaryparameter4 => (
                              <option value={salaryparameter4.field_id}>{salaryparameter4.field_name}</option>
                            ))}
                          </select>
                          <MDTypography variant="button" id="error_cmb_salary_parameter4" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                          </MDTypography>
                        </div>
                      </div> </> : ""

                }



                {/* Salary parameter 5 Row */}

                {
                  chk_Calculationtype === "Formula" ?
                    <><div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 5 <span style={{ color: '#52E919' }}>(EP5)</span>  </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter5" className="form-select form-select-sm" value={cmb_salary_parameter5} onChange={(e) => { setsalaryparameter5(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'    >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter5 => (
                            <option value={salaryparameter5.field_id}>{salaryparameter5.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter5" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    </> : ""

                }

                {/* head_position  row */}
                {
                  chk_Calculationtype === "Formula" ?
                    <> <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">Formula {chk_Calculationtype === "Formula" ? <span className="required">*</span> : ''}    </Form.Label>
                        <Form.Label class="MuiTypography-root MuiTypography-button erp-form-label-md-lg css-tidaut-MuiTypography-root" style={{ color: '#52E919' }}>(Use Salary parameter Gross as P1, Basic as P2 for creation Formula) <span ></span></Form.Label>
                      </div>
                      <div className="col-sm-8">
                        <Form.Control as="textarea" rows={3} className="erp_txt_area" id="txt_Formula" value={txt_Formula} onChange={e => { validateString(e.target.value); validateFields(); }} maxLength="255" optional={chk_Calculationtype === 'Formula' ? '' : 'optional'} />
                        <MDTypography variant="button" id="error_txt_Formula" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                    </> : ""
                }
              </div>



              {/* second column */}
              <div className="col-sm-6 erp_form_col_div">

                {/* earning_head_short_name  row */}

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Earning Head Short Name <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id="txt_earning_head_short_name" className="erp_input_field" value={txt_earning_head_short_name} onChange={(e) => { setearningheadshortname(e.target.value.toUpperCase()); validateFields(); }} maxLength="20" />
                    <MDTypography variant="button" id="error_txt_earning_head_short_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                    </MDTypography>
                  </div>
                </div>

                {/* head_position  row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Head Position <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field text-end" id="txt_head_position" value={txt_head_position} onChange={e => { validateNo(e); validateFields() }} maxLength="11" />
                    <MDTypography variant="button" id="error_txt_head_position" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                {/* Calculation value Row */}

                {
                  chk_Calculationtype === "Amount" ?
                    <>
                      <div className="row">
                        <div className="col-sm-4">
                          <Form.Label className="erp-form-label">Calculation value {chk_Calculationtype === 'Amount' ? <span className="required">*</span> : ''}</Form.Label>
                        </div>
                        <div className="col">
                          <Form.Control type="text" className="erp_input_field text-end" id="txt_calculation_value" value={txt_calculation_value} onChange={e => { setcalculationvalue(validateNumberDateInput.current.decimalNumber((e.target.value).toString(), 4)); validateFields(); }} maxLength="11" />
                          <MDTypography variant="button" id="error_txt_calculation_value" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                          </MDTypography>
                        </div>
                      </div>
                    </> : ""

                }




                {
                  chk_Calculationtype === "Formula" ?
                    <> <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 6 <span style={{ color: '#52E919' }}>(EP6)</span>  </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter6" className="form-select form-select-sm" value={cmb_salary_parameter6} onChange={(e) => { setsalaryparameter6(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter6 => (
                            <option value={salaryparameter6.field_id}>{salaryparameter6.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter6" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                    </> : ""

                }

                {/* Salary parameter 7 Row */}

                {
                  chk_Calculationtype === "Formula" ?
                    <>
                      <div className='row'>
                        <div className='col-sm-4'>
                          <Form.Label className="erp-form-label">Salary param 7  <span style={{ color: '#52E919' }}>(EP7)</span> </Form.Label>
                        </div>
                        <div className='col'>

                          <select id="cmb_salary_parameter7" className="form-select form-select-sm" value={cmb_salary_parameter7} onChange={(e) => { setsalaryparameter7(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'    >
                            <option value="">Select</option>
                            {salaryParameterList?.map(salaryparameter7 => (
                              <option value={salaryparameter7.field_id}>{salaryparameter7.field_name}</option>
                            ))}
                          </select>
                          <MDTypography variant="button" id="error_cmb_salary_parameter7" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                          </MDTypography>
                        </div>
                      </div>
                    </> : ""

                }

                {
                  chk_Calculationtype === "Formula" ?
                    <>        <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 8 <span style={{ color: '#52E919' }}>(EP8)</span>   </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter8" className="form-select form-select-sm" value={cmb_salary_parameter8} onChange={(e) => { setsalaryparameter8(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter8 => (
                            <option value={salaryparameter8.field_id}>{salaryparameter8.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter8" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div></> : ""

                }


                {/* Salary parameter 9 Row */}
                {
                  chk_Calculationtype === "Formula" ?
                    <> <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Salary param 9  <span style={{ color: '#52E919' }}>(EP9)</span>  </Form.Label>
                      </div>
                      <div className='col'>
                        <select id="cmb_salary_parameter9" className="form-select form-select-sm" value={cmb_salary_parameter9} onChange={(e) => { setsalaryparameter9(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'   >
                          <option value="">Select</option>
                          {salaryParameterList?.map(salaryparameter9 => (
                            <option value={salaryparameter9.field_id}>{salaryparameter9.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_salary_parameter9" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> </> : ""

                }



                {
                  chk_Calculationtype === "Formula" ?
                    <>
                      <div className='row'>
                        <div className='col-sm-4'>
                          <Form.Label className="erp-form-label">Salary param 10 <span style={{ color: '#52E919' }}>(EP10)</span>  </Form.Label>
                        </div>
                        <div className='col'>
                          <select id="cmb_salary_parameter10" className="form-select form-select-sm" value={cmb_salary_parameter10} onChange={(e) => { setsalaryparameter10(e.target.value); validateFields(); }} disabled={disableSalaryParameters} optional='optional'  >
                            <option value="">Select</option>
                            {salaryParameterList?.map(salaryparameter10 => (
                              <option value={salaryparameter10.field_id}>{salaryparameter10.field_name}</option>
                            ))}
                          </select>
                          <MDTypography variant="button" id="error_cmb_salary_parameter10" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                          </MDTypography>
                        </div>
                      </div>
                    </> : ""

                }


                {/* Remark Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Remark </Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control as="textarea" rows={1} className="erp_txt_area" id="txt_remark" value={txt_remark} onChange={e => { setremark(e.target.value); }} maxLength="255" optional='optional' />

                  </div>
                </div>



                {/* Earning Head Active Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Earning Head Active</Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check className="erp_radio_button" label="Yes" type="radio" value="1" name="isearningheadsActive" defaultChecked />
                      </div>
                      <div className="sCheck">
                        <Form.Check className="erp_radio_button" label="No" value="0" type="radio" name="isearningheadsActive" />
                      </div>

                    </div>
                  </div>
                </div>

              </div>


            </div>
          </form>

          <div className="card-footer pb-4 text-center">
            <MDButton type="button" className="erp-gb-button"

              onClick={() => {
                const path = compType === 'Register' ? '/Masters/MHMEarningHeads/MHMEarningHeadsListing/reg' : '/Masters/MHMEarningHeads/MHMEarningHeadsListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular" >Back</MDButton>

            {keyForViewUpdate !== 'view' ? (
              <MDButton type="submit" onClick={addearningheads} id="btn_save" className="erp-gb-button erp_MLeft_btn" variant="button"
                fontWeight="regular">save</MDButton>
            ) : null}
          </div >
        </div>
        {/* Success Msg Popup */}
        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

        {/* Error Msg Popup */}
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      </div>

    </>
  )
}

export default FrmMHMEarningHeadsEntry
