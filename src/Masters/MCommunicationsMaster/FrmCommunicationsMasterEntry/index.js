import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from "FrmGeneric/FrmValidations";


function FrmCommunicationsMasterEntry() {
  const validate = useRef();
  const { state } = useLocation();
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { communications_templatesID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  // useReff
  const combobox = useRef();
  const navigate = useNavigate()


  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/MCommunicationsMaster/FrmCommunicationsMasterList`)
    }
  }

  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  //Communications Master form Feilds


  const [communications_templates_id, setcommunicationstemplatesid] = useState(communications_templatesID);
  const [rb_communications_operation_type, setcommunicationsoperationtype] = useState("Email");
  const [txt_communications_templates_type, setcommunications_templates_type] = useState("");
  const [txt_communications_templates_description, setcommunications_templates_description] = useState("")
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')


  useEffect(async () => {
    await ActionType();
    if (communications_templatesID !== 0) {
      await FnCheckUpdateResponce();
    }
  }, [])


  const FnCheckUpdateResponce = async () => {
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmTemplatesCommunications/FnShowParticularRecordForUpdate/${communications_templatesID}/${COMPANY_ID}`)

      const updateRespose = await apiCall.json();
      const data = (updateRespose.data)
      if (data !== null && data !== "") {

        setcommunicationstemplatesid(communications_templatesID)
        setcommunicationsoperationtype(data.communications_operation)
        setcommunications_templates_type(data.communications_templates_type)
        setcommunications_templates_description(data.communications_templates_description)



        switch (data.is_active) {
          case true:
            document.querySelector('input[name="isCommunicationsTemplatesActive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isCommunicationsTemplatesActive"][value="0"]').checked = true;
            break;
        }

      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  // test case 2 shivanjali
  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')
        $('#btn_save').attr('disabled', false);
        $('#txt_communications_templates_type').attr('disabled', true)
        $('input[name="rb_communications_operation_type"]').attr('disabled', true);
        $('#btn_upload_doc').attr('disabled', false)
        break;

      case 'view':
        setActionType('(View)');
        $("input[type=radio]").attr('disabled', true);
        $('#btn_upload_doc').attr('disabled', true)
        $('#txt_communications_templates_type').attr('disabled', true)
        $('#txt_communications_templates_description').attr('disabled', true)
        await validate.current.readOnly("TempCommunicationsform");
        break;
      default:
        setActionType('(Creation)');
        break;
    }
  };


  const validateFields = () => {
    validate.current.validateFieldsOnChange('TempCommunicationsform')
  }
  const AddcommunicationsTemp = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("TempCommunicationsform");
      if (checkIsValidate === true) {
        var active;
        var activeValue = document.querySelector('input[name=isCommunicationsTemplatesActive]:checked').value
        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }

        var commnoperation = document.querySelector('input[name=rb_communications_operation_type]:checked').value
        setcommunicationsoperationtype(commnoperation);
        console.log("communications_operation: ", commnoperation);
        const data = {
          communications_templates_id: communications_templates_id,
          company_branch_id: COMPANY_BRANCH_ID,
          company_id: COMPANY_ID,
          communications_operation: rb_communications_operation_type,
          communications_templates_type: txt_communications_templates_type,
          communications_templates_description: txt_communications_templates_description,
          created_by: UserName,
          modified_by: communications_templates_id === 0 ? null : UserName,
          is_active: active
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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmTemplatesCommunications/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce.data);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          console.log("pcommunications_operation:", responce.data);
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
  }


  return (
    <>

      <ComboBox ref={combobox} />
      <FrmValidations ref={validate} />
      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'> Templates Communications{actionType}</label>
          </div>
          <form id="TempCommunicationsform">
            <div className="row erp_transporter_div">
              {/* First Collumn */}
              <div className="col-sm-6 erp_form_col_div">

                {/* Communications Operation Row */}
                <div className="row">
                  <div className="col-sm-4">
                    {/* test case 1 shivanjali */}
                    <Form.Label className="erp-form-label">Communications Type<span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck me-2"> <Form.Check id="rb_communications_operation_type" className="erp_radio_button" label="Email " type="radio" lbl="Email " value="Email" name="rb_communications_operation_type" checked={rb_communications_operation_type === "Email"} onClick={(e) => { setcommunicationsoperationtype('Email'); }} /> </div>
                      <div className="fCheck me-2"> <Form.Check id="rb_communications_operation_type1" className="erp_radio_button" label="Text Message " type="radio" lbl="Text Message " value="Text Message" name="rb_communications_operation_type" checked={rb_communications_operation_type === "Text Message"} onClick={(e) => { setcommunicationsoperationtype('Text Message') }} /> </div>
                      <div className="fCheck me-2"> <Form.Check id="rb_communications_operation_type2" className="erp_radio_button" label="Whatsapp " type="radio" lbl="Whatsapp " value="Whatsapp" name="rb_communications_operation_type" checked={rb_communications_operation_type === "Whatsapp"} onClick={(e) => { setcommunicationsoperationtype('Whatsapp') }} /> </div>
                      <div className="fCheck me-2"> <Form.Check id="rb_communications_operation_type3" className="erp_radio_button" label="Telegram " type="radio" lbl="Telegram " value="Telegram" name="rb_communications_operation_type" checked={rb_communications_operation_type === "Telegram"} onClick={(e) => { setcommunicationsoperationtype('Telegram') }} /> </div>

                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label"> Templates Name<span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field" id="txt_communications_templates_type" value={txt_communications_templates_type} onChange={e => { setcommunications_templates_type(e.target.value); validateFields(); }} maxLength="100" />
                    <MDTypography variant="button" id="error_txt_communications_templates_type" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                {/* CommunicationsTemplates Active Row */}
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
                          value="1"
                          name="isCommunicationsTemplatesActive"
                          defaultChecked

                        />
                      </div>
                      <div className="sCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="No"
                          value="0"
                          type="radio"
                          name="isCommunicationsTemplatesActive"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* second column */}
              <div className="col-sm-6 erp_form_col_div">

                {/* communications templates description Row */}
                <div className="row">
                  <div className="col-sm-4">
                    {/* test case 6 shivanjali */}
                    <Form.Label className="erp-form-label">Templates Desc<span className="required">*</span></Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control as="textarea" rows={8} className="erp_txt_area" id="txt_communications_templates_description" value={txt_communications_templates_description} onChange={e => { setcommunications_templates_description(e.target.value); validateFields(); }} maxlength="1000" />
                    <MDTypography variant="button" id="error_txt_communications_templates_description" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}> </MDTypography>
                  </div>
                </div>





              </div>
            </div>
          </form>

          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"

              onClick={() => {
                const path = compType === 'Register' ? '/Masters/MCommunicationsMaster/FrmCommunicationsMasterList/reg' : '/Masters/MCommunicationsMaster/FrmCommunicationsMasterList';
                navigate(path);
              }}

              variant="button"
              fontWeight="regular" >Back</MDButton>
            <MDButton type="submit" onClick={AddcommunicationsTemp} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

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

export default FrmCommunicationsMasterEntry
