import React, { useState, useEffect, useMemo, useRef } from "react";
import $ from 'jquery';
import Card from 'react-bootstrap/Card';
import FrmValidations from "FrmGeneric/FrmValidations";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import { Accordion, Table } from "react-bootstrap";

// import react icons
import { useNavigate, useLocation } from "react-router-dom";

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";

function MFMGeneralLedgerEntry() {
  const validate = useRef();
  const combobox = useRef();
  const { state } = useLocation();

  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { generalledgerId = 0, keyForViewUpdate, compType } = state || {}
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')


  // For navigate
  const navigate = useNavigate();

  // Add Product Type Form Fields
  const [general_ledger_id, setGeneralLedgerId] = useState(generalledgerId);
  const [txt_General_name, setGeneralLedgerName] = useState('');

  // Table data fields
  const [generalleaderData, setscheduleLeaderRecords] = useState([]);


  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    navigate(`/Masters/MFMGeneralLedgerListing/`);
  }

  useEffect(async () => {
    await ActionType();
    await showScheduleLeaderRecord();
    if (general_ledger_id !== 0) {
      await FnCheckUpdateResponce();
      await FnCheckparticularRecord();
    }
  }, [])


  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');


  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')
        $('#saveBtn').attr('disabled', false);
        $('#txt_General_name').attr('disabled', true);
        break;

      case 'view':
        setActionType('(View)');
        $("input[type=radio]").attr('disabled', true);
        $('#chkAllscheduleLeader').attr('disabled', true);
        await validate.current.readOnly("GeneralleadermasterId");
        break;
      default:
        setActionType('(Creation)');
        break;
    }
  };
  const showScheduleLeaderRecord = async () => {

    try {
      const showscheduleRecrdApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/scheduleledger/FnShowAllActiveRecords/${COMPANY_ID}`)
      const scheduleRecords = await showscheduleRecrdApiCall.json();
      if (scheduleRecords.data.content.length > 0) {
        setscheduleLeaderRecords(scheduleRecords.data.content)
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }



  function handleScheduleCheckbox(id) {
    $('input:checkbox[name="checkscheduleLeader"][value="' + id + '"]').attr('checked', false);
    const totalChkBoxes = document.querySelectorAll('input[name=checkscheduleLeader]').length;
    const totalChkBoxesChked = document.querySelectorAll('input[name=checkscheduleLeader]:checked').length;
    if (totalChkBoxes == totalChkBoxesChked) {

      document.getElementById('chkAllscheduleLeader').checked = true;
    } else if (totalChkBoxes > totalChkBoxesChked) {
      ;
      document.getElementById('chkAllscheduleLeader').checked = false;
    }
  }

  const FnCheckparticularRecord = async () => {
    try {

      const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmGeneralLedger/FnShowParticularRecords/${general_ledger_id}/${COMPANY_ID}`)
      const responce = await apicall.json()
      console.log("response error: ", responce);
      if (responce.length !== 0) {
        var GeneralLeaderCheckbox = document.getElementsByName('checkscheduleLeader');
        for (let i = 0; i < responce.content.length; i++) {
          for (var checkbox of GeneralLeaderCheckbox) {

            if (parseInt(checkbox.value) === responce.content[i].schedule_ledger_id) {
              if (keyForViewUpdate === 'update') {
                $('input:checkbox[name=checkscheduleLeader]').attr('disabled', false);
                $('input:checkbox[name="checkscheduleLeader"][value="' + responce.content[i].schedule_ledger_id + '"]').attr('checked', true);
              } else if (keyForViewUpdate === 'view') {
                $('input:checkbox[name=checkscheduleLeader]').attr('disabled', true);
                $('input:checkbox[name="checkscheduleLeader"][value="' + responce.content[i].schedule_ledger_id + '"]').attr('checked', true);
                $('#btn_save').attr('disabled', true);
              }
            }
          }

        }
      } else if (keyForViewUpdate === 'update') {
        $('input:checkbox[name=checkscheduleLeader]').attr('checked', false);
        $('input:checkbox[name=checkscheduleLeader]').attr('disabled', false);
      } else if (keyForViewUpdate === 'view') {
        $('input:checkbox[name=checkscheduleLeader]').attr('checked', false);
        $('input:checkbox[name=checkscheduleLeader]').attr('disabled', true);
        $('#btn_save').attr('disabled', true);
      }
      const totalChkBoxes = document.querySelectorAll('input[name=checkscheduleLeader]').length;
      const totalChkBoxesChked = document.querySelectorAll('input[name=checkscheduleLeader]:checked').length;
      if (totalChkBoxes == totalChkBoxesChked) {

        document.getElementById('chkAllscheduleLeader').checked = true;
      } else if (totalChkBoxes > totalChkBoxesChked) {

        document.getElementById('chkAllscheduleLeader').checked = false;
      }

    } catch (error) {
      console.log(error);
      navigate('/Error')
    }
  }



  const FnCheckUpdateResponce = async () => {
    try {
      if (general_ledger_id !== 0) {

        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmGeneralLedger/FnShowParticularRecordForUpdate/${generalledgerId}/${COMPANY_ID}`)
        const updateRes = await apiCall.json();

        let resp = (updateRes.data)
        setGeneralLedgerName(resp.general_ledger_name);
        $('#saveBtn').show();

        switch (resp.is_active) {
          case true:
            document.querySelector('input[name="isactive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isactive"][value="0"]').checked = true;
            break;

        }

      }
    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }




  function toggleScheduleLeaderChkBoxes(key) {

    switch (key) {
      case "chkAllscheduleLeader":
        const selectAll = document.getElementById('chkAllscheduleLeader').checked
        if (selectAll) {
          const scheduleLeaderChkBoxes = document.querySelectorAll('input[name=checkscheduleLeader]');
          for (var checkbox of scheduleLeaderChkBoxes) {
            checkbox.checked = true;
          }
        } else {
          const scheduleLeaderChkBoxes = document.querySelectorAll('input[name=checkscheduleLeader]:checked');
          for (var checkbox of scheduleLeaderChkBoxes) {
            checkbox.checked = false;
          }
        }
        break;
    }
  }

  const handleSubmit = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("GeneralleadermasterId");
      if (checkIsValidate === true) {
        var activeValue = document.querySelector('input[name=isactive]:checked').value;
        var active;

        switch (activeValue) {
          case '1': active = true; break;
          case '0': active = false; break;
        }
        let jsonObj = { "commonIds": {}, 'TransHeaderData': {}, 'TransDetailData': [] }
        $("input:checkbox[name=checkscheduleLeader]:checked").each(function () {
          let detailData = {
            company_id: COMPANY_ID,
            company_branch_id: COMPANY_BRANCH_ID,
            schedule_ledger_id: $(this).val(),
            created_by: UserName,
            modified_by: general_ledger_id === 0 ? null : UserName,
          }
          jsonObj.TransDetailData.push(detailData)
        });

        const data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          general_ledger_id: general_ledger_id,
          general_ledger_name: txt_General_name,
          created_by: UserName,
          modified_by: general_ledger_id === 0 ? null : UserName,
          is_active: active,
        };

        jsonObj.TransHeaderData = data
        jsonObj['commonIds']['company_id'] = parseInt(COMPANY_ID);
        jsonObj['commonIds']['company_branch_id'] = parseInt(COMPANY_BRANCH_ID);
        jsonObj['commonIds']['general_ledger_id'] = parseInt(general_ledger_id);

        var formData = new FormData();
        formData.append(`GeneralLedgerData`, JSON.stringify(jsonObj))

        const requestOptions = {
          method: 'POST',
          body: formData
        };

        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmGeneralLedger/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce);
        if (responce.success === '0') {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          const evitCache = combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          clearFormFields();

        }

      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  };

  const clearFormFields = () => {
    setGeneralLedgerId('');
    setGeneralLedgerName('');
    // for clear the bank checkboxes.
    const scheduleLeaderChkBoxes = document.querySelectorAll('input[name=checkBank]');
    for (var checkbox of scheduleLeaderChkBoxes) {
      checkbox.checked = false;
      document.getElementById("chkAllscheduleLeader").checked = false;
      document.getElementById("unChkAllscheduleLeader").checked = false;
    }

  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange('GeneralleadermasterId')
  }

  // test case 9 shivanjali
  const renderTermsTable = useMemo(() => {
    return <>
      {
        generalleaderData.length > 0
          ? <Table className="erp_table" id='erp-quotationterms-table' bordered striped>
            <thead className="erp_table_head">
              <tr>

                <th className={`erp_table_th`}>Action</th>
                <th className="erp_table_th">Schedule Ledger Name</th>
                <th className="erp_table_th">Report Side</th>
                <th className="erp_table_th">report Type</th>
                <th className="erp_table_th">report Sr No</th>

              </tr>
            </thead>
            <tbody>
              {
                generalleaderData.map((scheduleTerms, Index) =>
                  <tr rowIndex={Index}>

                    <td className="erp_table_td">
                      <input type="checkbox" className="checkQuotationTerms" name="checkscheduleLeader"

                        id={' checkscheduleId_' + scheduleTerms.schedule_ledger_id}

                        value={scheduleTerms.schedule_ledger_id}
                        onClick={() => handleScheduleCheckbox(scheduleTerms.schedule_ledger_id)}
                      />
                    </td>
                    <td className="erp_table_td">{scheduleTerms.schedule_ledger_name}</td>
                    <td className="erp_table_td">{scheduleTerms.report_side}</td>
                    <td className="erp_table_td">{scheduleTerms.report_type}</td>
                    <td className="erp_table_td">{scheduleTerms.report_sr_no}</td>



                  </tr>
                )

              }
            </tbody>
          </Table>

          : ""
      }
    </>
  }, [generalleaderData]);

  return (
    <>
      <FrmValidations ref={validate} />
      <ComboBox ref={combobox} />
      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>General Ledger{actionType}</label>
          </div>
          <div className="row erp_transporter_div">
            <form id="GeneralleadermasterId">
              <div className="col-sm-12 erp_filter_group-by-result">
                <div className='row'>
                  <div className='col-sm-2'>
                    <Form.Label className="erp-form-label">General Ledger name<span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_General_name" className="erp_input_field" value={txt_General_name} onChange={e => { setGeneralLedgerName(e.target.value); validateFields(); }} maxLength="500" />
                    <MDTypography variant="button" id="error_txt_General_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>

                  <div className="col-sm-2">
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


            </form>

          </div>


          {/* test case 2 */}
          <Accordion defaultActiveKey='0' id="schedulesAccordion">
            <Accordion.Item eventKey='0' id="schedulesAccordionItem">
              <Accordion.Header id="schedulesAccordionHeader" className="erp-form-label-md">Schedule Ledger Mapping</Accordion.Header>
              <Accordion.Body id="schedulesAccordionBody">
                <div className="row erp_transporter_div">
                  <div class="col">
                    <input type='checkbox' class="" id="chkAllscheduleLeader" onClick={(e) => toggleScheduleLeaderChkBoxes('chkAllscheduleLeader')} /> <label class="erp-form-label pb-1"> Select All </label>
                  </div>
                  <div className='row erp_table_scroll'>
                    {renderTermsTable}
                  </div>

                  <Card id="NoRcrdId" style={{ display: "none" }}>
                    <Card.Body>No records found...</Card.Body>
                  </Card>

                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>


          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"

              onClick={() => {
                const path = compType === 'Register' ? '/Masters/MFMGeneralLedgerListing/reg' : '/Masters/MFMGeneralLedgerListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular">Back</MDButton>
            <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>
          </div >
        </div>

        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


      </div>

    </>

  )

}

export default MFMGeneralLedgerEntry