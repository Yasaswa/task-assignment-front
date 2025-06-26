import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// File Imports
import FrmValidations from 'FrmGeneric/FrmValidations';

import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from 'assets/Constants/config-constant';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import ComboBox from 'Features/ComboBox';
import { Update } from '@mui/icons-material';

export default function FrmPaymentTermsEntry({ btn_disabled = false}) {
  let activeValue = '';
  //changes by ujjwala on 8/1/2024 case 
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName } = configConstants;
  const { state } = useLocation();
  const { paymentTermsID = 0, keyForViewUpdate, compType = 'Masters' } = state || {}
  // For navigate
  const navigate = useNavigate();
  const ValidateNumberDayInput = useRef();
  const validate = useRef();
  const combobox = useRef();

  // Add Product Type Form Fields
  const [payment_terms_id, setPayment_terms_id] = useState(paymentTermsID);

  const [payment_terms_type_flag, setPaymentTermsType] = useState('All');
  const [txt_payment_terms_name, setPaymentTermsName] = useState('');
  const [txt_payment_terms_days, setPaymentTermsDay] = useState('');
  const [txt_payment_terms_grace_days, setPaymentTermsGraceDay] = useState('');
  const [txt_remark, setRemark] = useState('');
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/FrmPaymentTermsListing`);
    }
  }
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  useEffect(() => {
    const loadDataOnload = async () => {
      await ActionType()
      if (paymentTermsID !== 0) {
        await FnCheckUpdateResponce()
      }
    }
    loadDataOnload()
  }, [])


  const handleSubmit = async () => {
    debugger
    try {
      const checkIsValidate = await validate.current.validateForm("paymentTermsFormId");
      if (checkIsValidate === true) {
        let active;
        activeValue = document.querySelector('input[name=isactive]:checked').value

        switch (activeValue) {
          case '1': active = true; break;
          case '0': active = false; break;

        }
        const data = {
          company_id: COMPANY_ID,
          payment_terms_id: payment_terms_id,
          created_by: UserName,
          modified_by: payment_terms_id === 0 ? null : UserName,
          payment_terms_type: payment_terms_type_flag,
          payment_terms_name: txt_payment_terms_name,
          payment_terms_days: txt_payment_terms_days,
          payment_terms_grace_days: txt_payment_terms_grace_days,
          remark: txt_remark,
          is_active: active,
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
        debugger
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/paymentterms/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce);
        if (responce.success === "0") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)
        } else {
          sessionStorage.setItem("paymentTermsID", responce.data.payment_terms_id)
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
  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')
        $('#txt_payment_terms_name').attr('disabled', true)

        break;
      case 'view':
        setActionType('(View)');
        await validate.current.readOnly("paymentTermsFormId");
        $("input[type=radio]").attr('disabled', true);
        break;
      default:
        setActionType('(Creation)');
        break;
    }

  };

  const FnCheckUpdateResponce = async () => {
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/paymentterms/FnShowParticularRecordForUpdate/${payment_terms_id}`)
      const resp = await apiCall.json();
      setPayment_terms_id(resp.data.payment_terms_id);
      setPaymentTermsType(resp.data.payment_terms_type);
      setPaymentTermsName(resp.data.payment_terms_name);
      setPaymentTermsDay(resp.data.payment_terms_days);
      setPaymentTermsGraceDay(resp.data.payment_terms_grace_days);
      setRemark(resp.data.remark);
      $('#saveBtn').show();

      switch (resp.data.is_active) {
        case true:
          document.querySelector('input[name="isactive"][value="1"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="isactive"][value="0"]').checked = true;
          break;
      }


    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange('paymentTermsFormId')
  }

  return (
    <>
      <ComboBox ref={combobox} />
      <FrmValidations ref={validate} />
      <ValidateNumberDateInput ref={ValidateNumberDayInput} />
      <div className='erp_top_Form'>
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg text-center'>Payment Terms {actionType} </label>
          </div>
          <form id="paymentTermsFormId">
            <div className="row erp_transporter_div">
              {/* first row */}
              <div className="col-sm-6">
                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Payment Terms Type : <span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check className="erp_radio_button" label="All" type="radio" value="All" name="paymentTeramsType" checked={payment_terms_type_flag === "All"} onChange={(e) => { setPaymentTermsType(e.target.value) }} disabled={keyForViewUpdate === 'update'} />
                      </div>
                      <div className="sCheck">
                        <Form.Check className="erp_radio_button" label="Purchase" value="Purchase" type="radio" name="paymentTeramsType" checked={payment_terms_type_flag === "Purchase"} onChange={(e) => { setPaymentTermsType(e.target.value) }} disabled={keyForViewUpdate === 'update'} />
                      </div>
                      <div className="sCheck">
                        <Form.Check className="erp_radio_button" label="Sales" value="Sales" type="radio" name="paymentTeramsType" checked={payment_terms_type_flag === "Sales"} onChange={(e) => { setPaymentTermsType(e.target.value) }} disabled={keyForViewUpdate === 'update'} />
                      </div>
                    </div>
                  </div>

                </div>
                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label"> Name : <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_payment_terms_name" className="erp_input_field" value={txt_payment_terms_name} onChange={e => { setPaymentTermsName(e.target.value); validateFields(); }} maxLength="255" />
                    <MDTypography variant="button" id="error_txt_payment_terms_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Pay.Terms Day : <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_payment_terms_days" className="erp_input_field text-end" value={txt_payment_terms_days}
                      onChange={e => {
                        if (ValidateNumberDayInput.current.isInteger(e.target.value)) {
                          setPaymentTermsDay(e.target.value.split('.').join(''));
                        }; validateFields();
                      }} maxLength="20" />
                    <MDTypography variant="button" id="error_txt_payment_terms_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
              </div>
              {/* second row */}
              <div className="col-sm-6">
                <div className="row">
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Grace Days : <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_payment_terms_grace_days" className="erp_input_field text-end" value={txt_payment_terms_grace_days}
                      onChange={e => {
                        if (ValidateNumberDayInput.current.isInteger(e.target.value)) {
                          setPaymentTermsGraceDay(e.target.value.split('.').join(''));
                        }; validateFields();
                      }}

                      maxLength="20" />
                    <MDTypography variant="button" id="error_txt_payment_terms_grace_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>


                </div>
                <div className="row">
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label"> Remark : </Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control as="textarea" id="txt_remark" className="erp_input_field" value={txt_remark} onChange={e => { setRemark(e.target.value); validateFields(); }} optional="optional" maxLength="255" />
                    <MDTypography variant="button" id="error_txt_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3">
                    <Form.Label className="erp-form-label">Is active : </Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="Yes"
                          type="radio"
                          value="1"
                          name="isactive"
                          defaultChecked
                        />
                      </div>
                      <div className="sCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="No"
                          value="0"
                          type="radio"
                          name="isactive"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </form>
          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"

              onClick={() => {
                const path = compType === 'Register' ? '/Masters/FrmPaymentTermsListing/reg' : '/Masters/FrmPaymentTermsListing';
                navigate(path);
              }}
              variant="button" disabled={btn_disabled ? true : false}
              fontWeight="regular">Back</MDButton>
            <MDButton type="submit" onClick={handleSubmit} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

          </div >


        </div>

        {/* Success Msg Popup */}
        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
        {/* Error Msg Popup */}
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      </ div>


    </>
  )

}