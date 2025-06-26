import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { Accordion } from "react-bootstrap";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Card from 'react-bootstrap/Card';

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// import react icons
import { useNavigate, useLocation } from "react-router-dom";


// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ConfigConstants from "assets/Constants/config-constant";
import { DatatableWithId } from 'components/DataTable';
import ComboBox from 'Features/ComboBox';



function MFMScheduleLedgerEntry() {
  const validate = useRef();
  const combobox = useRef();

  const { state } = useLocation();
  const configConstants = ConfigConstants();

  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { scheduleLedgerId = 0, keyForViewUpdate, compType } = state || {}



  // For navigate
  const navigate = useNavigate();

  // Add schedule Type Form Fields

  const [schedule_ledger_id, setScheduleLedgerId] = useState(scheduleLedgerId);
  const [txt_Schedule_name, setScheduleLedgerName] = useState('');
  const [txt_Report_Sr_No, setReport_Sr_No] = useState('');
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')


  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    navigate(`/Masters/MFMScheduleLedgerListing/`);
  }


  useEffect(async () => {
    await ActionType();
    if (scheduleLedgerId == '') {
      FnAddReportNumber();
    }
    await FnCheckUpdateResponce();
    await showGeneralLeaderRecords();

  }, [])


  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');


  const FnCheckUpdateResponce = async () => {
    debugger
    try {
      if (scheduleLedgerId !== 0) {
        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/scheduleledger/FnShowParticularRecordForUpdate/${scheduleLedgerId}/${COMPANY_ID}`)
        const updateRes = await apiCall.json();
        let resp = (updateRes.data)

        setScheduleLedgerName(resp.schedule_ledger_name);
        setReport_Sr_No(resp.report_sr_no);

        document.querySelector(`input[name="report_side"][value="${resp.report_side}"]`).checked = true;
        document.querySelector(`input[name="report_type"][value="${resp.report_type}"]`).checked = true;

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


  //test case 2 shivanjali
  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')
        $('input[type=text]').attr('disabled', true);
        $('#txt_Schedule_name').attr('disabled', true);
        break;
      case 'view':
        setActionType('(View)');
        $("input[type=radio]").attr('disabled', true);
        await validate.current.readOnly("scheduleleadermasterId");
        break;
      default:
        setActionType('(Creation)');
        break;

    }
  };


  const FnAddReportNumber = async () => {
    try {
      const reportTypeElement = document.querySelector('input[name=report_type]:checked');
      const reportTypeValue = reportTypeElement.value;

      const reportSideElement = document.querySelector('input[name=report_side]:checked');
      const reportSideValue = reportSideElement.value;

      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/scheduleledger/FnShowScheduleLedgerSrNo/${reportSideValue}/${reportTypeValue}/${COMPANY_ID}`)
      const updateRes = await apiCall.json();
      let resp = (updateRes.data)
      setReport_Sr_No('')
      setReport_Sr_No(resp + 1);
    } catch (error) {
      navigate('/Error')

    }

  }


  const handleSubmit = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("scheduleleadermasterId");;
      if (checkIsValidate === true) {
        var activeValue = document.querySelector('input[name=isactive]:checked').value;
        var active;

        switch (activeValue) {
          case '1': active = true; break;
          case '0': active = false; break;
        }

        const reportTypeElement = document.querySelector('input[name=report_type]:checked');
        const reportTypeValue = reportTypeElement.value;

        const reportSideElement = document.querySelector('input[name=report_side]:checked');
        const reportSideValue = reportSideElement.value;

        const data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          schedule_ledger_id: schedule_ledger_id,
          created_by: UserName,
          modified_by: scheduleLedgerId === 0 ? null : UserName,
          report_sr_no: txt_Report_Sr_No,
          schedule_ledger_name: txt_Schedule_name,
          is_active: active,
          report_type: reportTypeValue,
          report_side: reportSideValue,
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
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/scheduleledger/FnAddUpdateRecord`, requestOptions)
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
    setScheduleLedgerId('');
    setScheduleLedgerName('');
    setReport_Sr_No('');
  }

  // Table Data Fields
  const [data, setGeneralLeaderData] = useState([]);
  const [columns, setColumns] = useState([]);
  var columnHeads;

  {/* test case 8 shivanjali */ }
  const showGeneralLeaderRecords = async () => {
    if (keyForViewUpdate == "update" || keyForViewUpdate == "view") {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/slglmapping/FnShowParticularRecord/${schedule_ledger_id}/${COMPANY_ID}`);
      const responce = await res.json();
      if (responce.content.length > 0) {
        let column = [];
        columnHeads = Object.keys(responce.content[0]);
        for (let colKey = 0; colKey < columnHeads.length; colKey++) {

          if (!columnHeads[colKey].includes('_id') && !columnHeads[colKey].includes('company_') && !columnHeads[colKey].includes('_id') && !columnHeads[colKey].includes('is_') && !columnHeads[colKey].includes('_on') && !columnHeads[colKey].includes('_by')) {
            column.push({ Headers: columnHeads[colKey], accessor: columnHeads[colKey] });
          }

        }
        setColumns(column)
        setGeneralLeaderData(responce.content)
      } else {
        setColumns([]);
        setGeneralLeaderData([])
      }
    }
    else {
      setColumns([]);
      setGeneralLeaderData([])
    }
  }
  const validateFields = () => {
    validate.current.validateFieldsOnChange('scheduleleadermasterId')
  }


  return (
    <>

      <FrmValidations ref={validate} />
      <ComboBox ref={combobox} />
      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>Schedule Ledger{actionType}</label>
          </div>
          <form id="scheduleleadermasterId">
            <div className="row erp_transporter_div text-start">

              {/* first row */}


              <div className="col-sm-6 erp_filter_group-by-result">

                <div className='row'>
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Ledger Name<span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_Schedule_name" className="erp_input_field" value={txt_Schedule_name} onChange={e => { setScheduleLedgerName(e.target.value); validateFields(); }} maxLength="500" />
                    <MDTypography variant="button" id="error_txt_Schedule_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>



                <div className="row">
                  <div className="col-sm-3">
                    <Form.Label className="erp-form-label">Report Side </Form.Label>
                  </div>
                  <div className='col'>
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check onClick={() => { FnAddReportNumber() }} className="erp_radio_button" label="Credit" type="radio" value="C" name="report_side" defaultChecked />
                      </div>
                      <div className="sCheck" >
                        <Form.Check onClick={() => { FnAddReportNumber() }} className="erp_radio_button" label="Debit" value="D" type="radio" name="report_side" />
                      </div>
                    </div>

                  </div>

                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <Form.Label className="erp-form-label">Report Type</Form.Label>
                  </div>
                  <div className='col'>
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check onClick={() => { FnAddReportNumber() }} className="erp_radio_button" label="Balance Sheet" type="radio" value="B" name="report_type" defaultChecked />
                      </div>
                      <div className="sCheck">
                        <Form.Check onClick={() => { FnAddReportNumber() }} className="erp_radio_button" label="Profit & loss Accounts" value="P" type="radio" name="report_type" />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
              {/* second row */}

              <div className="col-sm-6 erp_filter_group-by-result">
                <div className="row">
                  <div className='col-sm-3'>
                    <Form.Label className="erp-form-label">Report Sr No.<span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" id="txt_report_sr_no" className="erp_input_field" value={txt_Report_Sr_No} onChange={e => { setReport_Sr_No(e.target.value); validateFields(); FnAddReportNumber(); }} maxLength="255" />
                    <MDTypography variant="button" id="error_txt_report_sr_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                {/* test case 1 shivanjali */}
                <div className="row">
                  <div className="col-sm-3">
                    <Form.Label className="erp-form-label">Is Active</Form.Label>
                  </div>
                  <div className="col">
                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check className="erp_radio_button" label="Yes" type="radio" value="1" name="isactive" defaultChecked />
                      </div>
                      <div className="sCheck">
                        <Form.Check className="erp_radio_button" label="No" value="0" type="radio" name="isactive" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </form>


          {/* test case 3 and 7 shivanjali */}
          {keyForViewUpdate !== 'Add' ? <Accordion defaultActiveKey='0' id="schedulesAccordion">
            <Accordion.Item eventKey='0' id="schedulesAccordionItem">
              <Accordion.Header id="schedulesAccordionHeader" className="erp-form-label-md">General Ledger Mapping</Accordion.Header>
              <Accordion.Body id="schedulesAccordionBody">
                <div className="row erp_transporter_div">
                  {data.length === 0 ?
                    <Card id="NoRcrdId">
                      <Card.Body>No records found...</Card.Body>
                    </Card> :
                    <div className='erp_table_scroll'>
                      <DatatableWithId data={data} columns={columns} tableId="schdule_ledger_id" />
                    </div>
                  }
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion> : null}



          <div className="card-footer py-0 text-center">
            <MDButton type="button" className="erp-gb-button"
              onClick={() => {
                const path = compType === 'Register' ? '/Masters/MFMScheduleLedgerListing/reg' : '/Masters/MFMScheduleLedgerListing';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular">Back</MDButton>
            <MDButton type="submit" onClick={handleSubmit} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

          </div>
        </div>
      </div>


      {/* Success Msg Popup */}
      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      {/* Error Msg Popup */}
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />




    </>

  )
}

export default MFMScheduleLedgerEntry