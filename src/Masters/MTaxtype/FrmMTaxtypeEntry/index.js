import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from "react-router-dom";
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';


// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from 'FrmGeneric/FrmValidations';

export default function FrmMTaxtypeEntry() {
  const validate = useRef();
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName } = configConstants;

  const { state } = useLocation();
  const { taxtypeID = 0, keyForViewUpdate, compType } = state || {}

  var activeValue = '';
  const child = useRef();


  // For navigate
  const navigate = useNavigate();

  // Add Taxtype Form Fields
  const [taxtype_id, setTaxtypeId] = useState(taxtypeID);
  const [txt_taxtype_name, setTaxtypeName] = useState('');
  const [txt_taxtype_short_name, setTaxtypeShortName] = useState('');
  const [is_active, setIsActive] = useState(true);



  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem("dataAddedByCombo") !== "dataAddedByCombo") {
      navigate(`/Masters/TaxtypeListing`);
    }

  }
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');


  useEffect(() => {
    const loadDataOnload = async () => {
      if (taxtype_id !== 0)
        await FnCheckUpdateResponce();
      await ActionType();
    }
    loadDataOnload()

  }, [])
  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modify)');
        setActionLabel('Update')
        $("input[type=radio]").attr('disabled', false);
        $('#txt_taxtype_name').attr('disabled', true);

        break;

      case 'view':
        $('#taxtypeFormId input[type="radio"]').prop('disabled', true);
        setActionType('(View)');
        await validate.current.readOnly("taxtypeFormId");
        $("input[type=radio]").attr('disabled', true);
        break;
      default:
        setActionType('(Create)');
        break;
    }
  };
  const handleSubmit = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("taxtypeFormId");;
      if (checkIsValidate === true) {
        var calculationtype;

        activeValue = document.querySelector('input[name=iscalulationType]:checked').value

        switch (activeValue) {
          case 'Mannual': calculationtype = "Mannual"; break;
          case 'Auto': calculationtype = "Auto"; break;

        }

        const data = {
          company_id: COMPANY_ID,
          taxtype_id: taxtypeID,
          created_by: UserName,
          modified_by: taxtypeID === 0 ? null : UserName,
          taxtype_name: txt_taxtype_name,
          taxtype_short_name: txt_taxtype_short_name,
          calculation_type: calculationtype,
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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/taxtype/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json();

        console.log("response error: ", responce);
        if (responce.success === "0") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          const evitCache = child.current.evitCache();
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
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/taxtype/FnShowParticularRecordForUpdate/${taxtype_id}`)
      const updateRes = await apiCall.json();

      let resp = JSON.parse(updateRes.data)
      setTaxtypeId(resp.taxtype_id)
      setTaxtypeName(resp.taxtype_name);
      setTaxtypeShortName(resp.taxtype_short_name);
      setIsActive(resp.is_active)

      switch (resp.calculation_type) {
        case 'Mannual':
          document.querySelector('input[name="iscalulationType"][value="Mannual"]').checked = "Mannual";
          break;
        case 'Auto':
          document.querySelector('input[name="iscalulationType"][value="Auto"]').checked = "Auto";
          break;
      }
      const validateFields = () => {
        validate.current.validateFieldsOnChange('taxtypeFormId')

      }

    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }




  return (
    <>
      <ComboBox ref={child} />
      <FrmValidations ref={validate} />


      {/* test case 1  shivanjali */}
      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg text-center'>Taxtype Information{actionType}</label>
          </div>
          <form id="taxtypeFormId">
            <div className="row erp_transporter_div text-start">

              {/* first row */}
              {/* test case 4 shivanjali 3/1/24*/}
              <div className="col-sm-6 erp_filter_group-by-result">
                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Taxtype Name<span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_taxtype_name" className="erp_input_field" value={txt_taxtype_name} onChange={e => { setTaxtypeName(e.target.value); }} maxLength="255" />
                    <MDTypography variant="button" id="error_txt_taxtype_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label"> Short Name</Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_short_name" className="erp_input_field" value={txt_taxtype_short_name} onChange={e => { setTaxtypeShortName(e.target.value.toUpperCase()); }} maxLength="4" optional="optional" />
                    <MDTypography variant="button" id="error_txt_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

              </div>

              {/* second row */}

              <div className="col-sm-6 erp_filter_group-by-result">
                <div className="row">
                  <div className="col-sm-3">
                    <Form.Label className="erp-form-label">Calculation Type</Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="Mannual"
                          type="radio"
                          value="Mannual"
                          name="iscalulationType"
                          defaultChecked
                        />
                      </div>
                      <div className="sCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="Auto"
                          value="Auto"
                          type="radio"
                          name="iscalulationType"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* test case 2 shivanjali */}
                <div className="row">
                  <div className="col-sm-3">
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
          </form>
          {/* test case 5 shivanjali */}
          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"
              onClick={() => {
                const path = compType === 'Register' ? '/Masters/TaxtypeListing/reg' : '/Masters/TaxtypeListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular">Back</MDButton>

            <MDButton type="submit" onClick={handleSubmit} id="saveBtn" variant="button"
              fontWeight="regular" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>{actionLabel}</MDButton>
          </div>
        </div >
      </div>

      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
    </>


  )



}
