import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";


function FrmBankListEntry(props) {

  const validate = useRef();
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { state } = useLocation();
  const { bankId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  const combobox = useRef();
  const navigate = useNavigate()

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // success Msg HANDLING
  // test case 2 shivanjali
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/MBankList/FrmBankListListing`)
    }
  }

  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');



  //Banklist Feilds
  const [txt_bank_id, setbank_id] = useState(bankId)
  const [txt_bank_name, setbank_name] = useState("")
  const [txt_bank_shortName, setbank_shortName] = useState("")
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')

  useEffect(async () => {
    await FnCheckUpdateResponce();
    await ActionType();
  }, [])

  const validateFields = () => {
    validate.current.validateFieldsOnChange('banklistingform')
  }

  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')
        $("input[type=radio]").attr('disabled', false);
        $('#btn_save').attr('disabled', false);
        $('#btn_upload_doc').attr('disabled', false);
        $('#txt_bank_name').attr('disabled', true);
        $('#txt_bank_shortName').attr('disabled', true);
        break;

      case 'view':
        setActionType('(View)');
        $("input[type=radio]").attr('disabled', true);
        $('#btn_upload_doc').attr('disabled', true)
        $('#txt_bank_name').attr('disabled', true)
        $('#txt_bank_shortName').attr('disabled', true)
        await validate.current.readOnly("banklistingform");
        break;
      default:
        setActionType('(Creation)');
        break;
    }
  }

  const addBanklistEntry = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("banklistingform");
      if (checkIsValidate === true) {
        var active;
        var activeValue = document.querySelector('input[name=isbankActive]:checked').value
        switch (activeValue) {
          case 'false': active = false; break;
          case 'true': active = true; break;
        }

        const data = {
          company_branch_id: COMPANY_BRANCH_ID,
          company_id: COMPANY_ID,
          bank_id: txt_bank_id,
          created_by: UserName,
          modified_by: txt_bank_id === 0 ? null : UserName,
          bank_name: txt_bank_name,
          bank_short_name: txt_bank_shortName,
          created_by: UserName,
          modified_by: txt_bank_id === 0 ? null : UserName,
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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmBanksList/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce.data);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          console.log("BankId", responce.data);
          const evitCache = await combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          await FnCheckUpdateResponce();
        }

      }
    } catch (error) {
      console.log("error: ", error);
      navigate('/Error')
    }
  };
  const FnCheckUpdateResponce = async () => {
    try {
      if (bankId !== "undefined" && bankId !== '' && bankId !== null) {
        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmBanksList/FnShowParticularRecordForUpdate/${bankId}/${COMPANY_ID}`)

        const updateRespose = await apiCall.json();
        const data = (updateRespose.data)
        if (data !== null && data !== "") {
          setbank_id(bankId)
          setbank_name(data.bank_name)
          setbank_shortName(data.bank_short_name)

          switch (data.is_active) {
            case true:
              document.querySelector('input[name="isbankActive"][value="true"]').checked = true;
              break;
            case false:
              document.querySelector('input[name="isbankActive"][value="false"]').checked = true;
              break;
          }


        }
      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }


  return (
    <>
      <ComboBox ref={combobox} />
      <FrmValidations ref={validate} />
      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'> Bank List{actionType}</label>
          </div>

          <form id="banklistingform">
            <div className="row erp_transporter_div">
              <div className="col-sm-6 erp_form_col_div">

                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Bank Name<span className="required">*</span></Form.Label>
                  </div>

                  <div className="col">
                    <Form.Control type="text" className="erp_input_field" id="txt_bank_name" value={txt_bank_name} onChange={e => { setbank_name(e.target.value); validateFields(); }} maxLength="255" />
                    <MDTypography variant="button" id="error_txt_bank_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>



              </div>
              {/* test case 4 shivanjali */}
              {/* second column */}
              <div className="col-sm-6 erp_form_col_div">
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Bank Short Name<span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" id="txt_bank_shortName" className="erp_input_field" value={txt_bank_shortName} onChange={(e) => { setbank_shortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="4" />
                    <MDTypography variant="button" id="error_txt_bank_shortName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Is Active</Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="Yes"
                          type="radio"
                          value="true"
                          name="isbankActive"
                          defaultChecked

                        />
                      </div>
                      <div className="sCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="No"
                          value="false"
                          type="radio"
                          name="isbankActive"

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
                const path = compType === 'Register' ? '/Masters/MBankList/FrmBankListListing/reg' : '/Masters/MBankList/FrmBankListListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
            <MDButton type="submit" onClick={addBanklistEntry} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

          </div >

        </div>


        {/* Success Msg Popup */}
        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

        {/* Error Msg Popup */}
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      </div >

    </>
  )
}

export default FrmBankListEntry
