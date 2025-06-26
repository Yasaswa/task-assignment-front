import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from 'jquery';

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// File imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";


function FrmHSNSAC(props) {
  const validate = useRef();
  const combobox = useRef();
  const validateNumberDateInput = useRef();


  const { state } = useLocation();
  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName } = configConstants;
  const { hsnSacId = 0, keyForViewUpdate, compType = 'Masters'} = state || {}
  

  //  Form Fields
  const [hsn_sac_id, setHsnSacId] = useState(hsnSacId)
  const [txt_hsn_sac_code, setHsnSacCode] = useState('');
  const [txt_hsn_sac_description, sethsnSacDesp] = useState('');
  const [txt_hsn_sac_rate, setHsnSacRate] = useState(0);
  const [is_active, setIsActive] = useState(true);
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    if (sessionStorage.getItem("dataAddedByCombo") !== "dataAddedByCombo") {
      navigate(`/Masters/HSNSACListing`);
    }
    setShowSuccessMsgModal(false);
  };
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  const navigate = useNavigate();

  useEffect(async () => {
    await FnCheckUpdateResponce();
    await ActionType();
  }, [])

  const addHsnSac = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("HsnSacFormId");;
      if (checkIsValidate === true) {
        var hsnsacval;
        var exampted;

        var hsnsactypeVal = document.querySelector('input[name=isHsnSacType]:checked').value

        switch (hsnsactypeVal) {
          case 'HSN': hsnsacval = 'HSN'; break;
          case 'SAC': hsnsacval = 'SAC'; break;
        }
        var isExamptedVal = document.querySelector('input[name=isExampted]:checked').value

        switch (isExamptedVal) {
          case '0': exampted = 0; break;
          case '1': exampted = 1; break;
        }


        const data = {
          company_id: COMPANY_ID,
          hsn_sac_id: hsn_sac_id,
          hsn_sac_type: hsnsacval,
          hsn_sac_code: txt_hsn_sac_code,
          hsn_sac_description: txt_hsn_sac_description,
          hsn_sac_rate: txt_hsn_sac_rate,
          is_exampted: exampted,
          created_by: UserName,
          modified_by: hsn_sac_id === 0 ? null : UserName,
          is_active: is_active,

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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/hsnsac/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce.data);

        if (responce.success === "0") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          console.log("hsnSacId", responce.data);
          const evitCache = combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);

        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  };

  const FnCheckUpdateResponce = async () => {
    try {
      if (hsnSacId !== 0) {
        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/hsnsac/FnShowParticularRecordForUpdate/${hsnSacId}`)
        const updateRes = await apiCall.json();
        const data = JSON.parse(updateRes.data)
        if (data !== null && data !== "") {
          setHsnSacId(hsnSacId)
          setHsnSacCode(data.hsn_sac_code);
          sethsnSacDesp(data.hsn_sac_description);
          setHsnSacRate(data.hsn_sac_rate);
          setIsActive(data.is_active)

          switch (data.hsn_sac_type) {
            case true:
              document.querySelector('input[name="isHsnSacType"][value="HSN"]').checked = true;
              break;
            case false:
              document.querySelector('input[name="isHsnSacType"][value="SAC"]').checked = true;
              break;
          }
          switch (data.is_exampted) {
            case true:
              document.querySelector('input[name="isExampted"][value="1"]').checked = true;
              break;
            case false:
              document.querySelector('input[name="isExampted"][value="0"]').checked = true;
              break;
          }

        }

      }

    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }


  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        //if else for Add or Update
        if(!props.addNewProd){
        setActionType('(Modify)');
        setActionLabel('Update')
        $('#txt_hsn_sac_code').attr('disabled', true);
        }
        else{
        setActionType('(Creation)');
        setActionLabel('Add')
        }
        break;
      case 'view':
        setActionType('(View)');
        await validate.current.readOnly("HsnSacFormId");
        $("input[type=radio]").attr('disabled', true);
        $('#btn_save').attr('disabled', true);
        break;
      default:
        setActionType('(Creation)');
        setActionLabel('Add')
        break;
    }
  };



  const validateFields = () => {
    validate.current.validateFieldsOnChange('HsnSacFormId')
  }



  const validateNo = (key) => {
    const numCheck = /^[0-9]*\.?[0-9]*$/;
    const regexNo = /^[0-9]*\.[0-9]{5}$/
    var dot = '.';

    switch (key) {
      case 'HsnSacRate':
        var hsnRate = $('#txt_hsn_sac_Rate').val();
        if (!regexNo.test(hsnRate) && hsnRate.length <= 14 || hsnRate.indexOf(dot) === 14) {
          if (numCheck.test(hsnRate)) {
            setHsnSacRate(hsnRate)
          }

        }
        break;
    }
  }
  return (
    <>
      <FrmValidations ref={validate} />
      <ComboBox ref={combobox}/>
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      {/* test  case 6 shivanjali */}

      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>HSN-SAC Information{actionType}</label>
          </div>

          <form id="HsnSacFormId">
            <div className="row erp_transporter_div text-start">
              {/* //first column */}
              <div className="col-sm-6 erp_form_col_div">
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">HSN-SAC Type</Form.Label>
                  </div>
                  <div className="col">
                    <Form>
                      <div className="erp_form_radio">
                        <div className="fCheck">
                          <Form.Check
                            className="erp_radio_button"
                            label="HSN"
                            type="radio"
                            value="HSN"
                            name="isHsnSacType"
                            defaultChecked

                          />
                        </div>
                        <div className="sCheck">
                          <Form.Check
                            className="erp_radio_button"
                            label="SAC"
                            value="SAC"
                            type="radio"
                            name="isHsnSacType"

                          />
                        </div>
                      </div>
                    </Form>
                  </div>

                </div>
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">HSN-SAC Code<span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_hsn_sac_code" className="erp_input_field" value={txt_hsn_sac_code} onChange={e => { setHsnSacCode(e.target.value); validateFields(); }} maxLength="255" />
                    <MDTypography variant="button" id="error_txt_hsn_sac_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">HSN-SAC Description</Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control as="textarea" rows={1} id="txt_hsn_sac_desc" className="erp_txt_area" value={txt_hsn_sac_description} onChange={e => { sethsnSacDesp(e.target.value); }} maxlength="1000" optional="optional" />
                    <MDTypography variant="button" id="error_txt_hsn_sac_desc" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

              </div>

              {/* second */}
              <div className="col-sm-6 erp_form_col_div">

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Is Exampted</Form.Label>
                  </div>
                  <div className="col">
                    <Form>

                      <div className="erp_form_radio">
                        <div className="fCheck">
                          <Form.Check
                            className="erp_radio_button"
                            label="YES"
                            type="radio"
                            value="1"
                            name="isExampted"


                          />
                        </div>
                        <div className="sCheck">
                          <Form.Check
                            className="erp_radio_button"
                            label="No"
                            value="0"
                            type="radio"
                            name="isExampted"
                            defaultChecked

                          />
                        </div>
                      </div>
                    </Form>
                  </div>

                </div>

                {/* test case 3 shivanjali */}
                <div className='row'>
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">HSN-SAC Rate</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id='txt_hsn_sac_Rate' className="erp_input_field text-end" value={txt_hsn_sac_rate} onChange={e => { validateNo('HsnSacRate'); }} maxLength="19" optional='optional' />
                    <MDTypography variant="button" id="error_txt_hsn_sac_Rate" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>

                </div>
                {/* test 5 shivanjali */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Is Active</Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="is_active" checked={is_active === true} onClick={() => { setIsActive(true); }} /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="is_active" checked={is_active === false} onClick={() => { setIsActive(false); }} /> </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form >
          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"
              onClick={() => {
                const path = compType === 'Register' ? '/Masters/HSNSACListing/reg' : '/Masters/HSNSACListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular" disabled={props.btn_disabled ? true : false} >Back</MDButton>
            <MDButton type="submit" onClick={addHsnSac} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

          </div>

        </div>


        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      </div>
    </>
  )
}

export default FrmHSNSAC
