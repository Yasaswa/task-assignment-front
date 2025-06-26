import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDButton from 'components/MDButton';

// React Bootstrap imports
import { Table } from "react-bootstrap"

//File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { useNavigate } from 'react-router-dom';
import ConfigConstants from 'assets/Constants/config-constant';
import { CircularProgress } from '@material-ui/core';


function FrmTransporterAccessRightsEntry({ goBack, transporterId, transporterName, transporterVendorCode, compType, keyForViewUpdate }) {
  // Config Constant
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

  // Session storage data.
  const designationId = 177
  const userType = 'transporter';
  const [rowCount, setRowCount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  const comboBox = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataOnLoad = async () => {
      setIsLoading(true)
      await FnShowDesignationWiseFormAccessData();
      setIsLoading(false)
    }
    loadDataOnLoad()
  }, [])

  const FnShowDesignationWiseFormAccessData = async () => {
    try {
      let rowCount = 0;
      const getFormsApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesForms/FnShowAllActiveRecords/${parseInt(COMPANY_ID)}`)
      const responce = await getFormsApi.json();

      const getOldAceesDataByDesignationApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesFormsDesignationAccess/FnShowAllActiveRecords/${parseInt(designationId)}/${parseInt(COMPANY_ID)}`)
      let accessByDesignationResponce = await getOldAceesDataByDesignationApi.json();

      const getOldAceesByUserDataApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesFormsUserAccess/FnShowAllActiveRecords/${transporterVendorCode}/${parseInt(COMPANY_ID)}`);
      const oldAccessByUserResponce = await getOldAceesByUserDataApi.json();

      const formsList = responce
      if (formsList.length !== 0) {
        setRowCount(formsList.length);
        for (let formCount = 0; formCount < formsList.length; formCount++) {
          rowCount++;
          let newRecord = $(`<tr id="Record-tr-${rowCount}"></tr>`);
          $('#FormsTbl').append(newRecord);
          let createTd1 = $(`<span> ${formsList[formCount].parent_module_name} <input type="hidden" fieldKey='module_${formsList[formCount].parent_module_id}' value = '${formsList[formCount].parent_module_id}' id="parentModuleId-${rowCount}"/></span>`)
          let createTd2 = $(`<span> ${formsList[formCount].sub_module_name} <input type="hidden" fieldKey='subModule_${formsList[formCount].sub_module_id}' value = '${formsList[formCount].sub_module_id}' id="subModuleId-${rowCount}"/></span>`)
          let createTd3 = $(`<span> ${formsList[formCount].modules_forms_name} <input type="hidden" fieldKey='form_${formsList[formCount].modules_forms_id}' value = '${formsList[formCount].modules_forms_id}' id="formId-${rowCount}"/></span>`)
          let createTd4 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formAllAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="allAccessSwitch-' + rowCount + '" name="allAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd5 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formReadAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="readAccessSwitch-' + rowCount + '" name="readAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd6 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formAddAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="addAccessSwitch-' + rowCount + '" name="addAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd7 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formModifyAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="modifyAccessSwitch-' + rowCount + '" name="modifyAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd8 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formDeleteAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="deleteAccessSwitch-' + rowCount + '" name="deleteAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd9 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formApprovalAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="approvalAccessSwitch-' + rowCount + '" name="approvalAccessSwitch-' + rowCount + '" role="switch"/></div>')
          let createTd10 = $('<div class="form-check form-switch d-flex justify-content-center align-items-center"><input class="form-check-input formSpecialAccessSwitch switch" type="checkbox" key="' + rowCount + '" id="specialAccessSwitch-' + rowCount + '" name="specialAccessSwitch-' + rowCount + '" role="switch"/></div>')

          $('#Record-tr-' + rowCount).append($("<td>").append(createTd1));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd2));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd3));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd4));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd5));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd6));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd7));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd8));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd9));
          $('#Record-tr-' + rowCount).append($("<td>").append(createTd10));
          if (oldAccessByUserResponce.length > 0) {
            const oldFormAccessByUser = oldAccessByUserResponce.filter(formAccess => formAccess.modules_forms_id === formsList[formCount].modules_forms_id);
            if (oldFormAccessByUser.length > 0) {
              $('#allAccessSwitch-' + rowCount).prop('checked', oldFormAccessByUser[0].all_access);
              $("#readAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].read_access);
              $("#addAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].add_access);
              $("#modifyAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].modify_access);
              $("#deleteAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].delete_access);
              $("#approvalAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].approve_access);
              $("#specialAccessSwitch-" + rowCount).prop('checked', oldFormAccessByUser[0].special_access);
            }
          }
          if (accessByDesignationResponce.length > 0) {
            const oldFormAccessByDesignation = accessByDesignationResponce.filter(form => form.modules_forms_id === formsList[formCount].modules_forms_id);
            if (oldFormAccessByDesignation.length > 0) {
              $('#allAccessSwitch-' + rowCount).prop('checked', oldFormAccessByDesignation[0].all_access);
              $("#readAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].read_access);
              $("#addAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].add_access);
              $("#modifyAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].modify_access);
              $("#deleteAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].delete_access);
              $("#approvalAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].approve_access);
              $("#specialAccessSwitch-" + rowCount).prop('checked', oldFormAccessByDesignation[0].special_access);
            }
          }
        }
        FnManageHeadersSwitch();
        let keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');
        switch (keyForViewUpdate) {
          case 'update':
            break;

          case 'view':
            $('#saveBtn').attr('disabled', true)
            $("#FormsTbl").find("input,button,textarea,select").attr("disabled", "disabled");
            break;
        }
      }

      // Give all form access for particular form
      $('.formAllAccessSwitch').on('change', function () {
        const rowKey = $(this).attr('key');
        setPermissions("AllAccess", rowKey);
      });

      // for check partial access for particular form.
      $('.switch').change(function () {
        const rowKey = $(this).attr('key');
        if ($(this).hasClass("formAllAccessSwitch")) {
          setPermissions("AllAccess", rowKey);
        } else {
          setPermissions("PartialAccess", rowKey);
        }
        FnManageHeadersSwitch();
      });

    } catch (error) {
      console.log('error: ', error);
      navigate('/Error')

    }
  }

  const FnManageHeadersSwitch = async () => {
    $('#addAllFormsAccess').prop('checked', $('input:checkbox.formAddAccessSwitch:checked').length == $('input:checkbox.formAddAccessSwitch').length);
    $('#modifyAllFormsAccess').prop('checked', $('input:checkbox.formModifyAccessSwitch:checked').length == $('input:checkbox.formModifyAccessSwitch').length);
    $('#readAllFormsAccess').prop('checked', $('input:checkbox.formReadAccessSwitch:checked').length == $('input:checkbox.formReadAccessSwitch').length);
    $('#deleteAllFormsAccess').prop('checked', $('input:checkbox.formDeleteAccessSwitch:checked').length == $('input:checkbox.formDeleteAccessSwitch').length);
    $('#approveAllFormsAccess').prop('checked', $('input:checkbox.formApprovalAccessSwitch:checked').length == $('input:checkbox.formApprovalAccessSwitch').length);
    $('#specialAllFormsAccess').prop('checked', $('input:checkbox.formSpecialAccessSwitch:checked').length == $('input:checkbox.formSpecialAccessSwitch').length);
    $('#allformsAllAccess').prop('checked', $('input:checkbox.formAllAccessSwitch').length == $('input:checkbox.formAllAccessSwitch:checked').length);
    $('#allformsAllAccess').prop('checked', $('input:checkbox.headerSwitch:checked').length == $('input:checkbox.headerSwitch').length);
  }

  const setPermissions = async (switchType, rowKey) => {
    switch (switchType) {
      case "AllAccess":
        if ($('#allAccessSwitch-' + rowKey).is(":checked")) {
          $("#readAccessSwitch-" + rowKey).prop('checked', true);
          $("#addAccessSwitch-" + rowKey).prop('checked', true);
          $("#modifyAccessSwitch-" + rowKey).prop('checked', true);
          $("#deleteAccessSwitch-" + rowKey).prop('checked', true);
          $("#approvalAccessSwitch-" + rowKey).prop('checked', true);
          $("#specialAccessSwitch-" + rowKey).prop('checked', true);
        } else {
          $("#readAccessSwitch-" + rowKey).prop('checked', false);
          $("#addAccessSwitch-" + rowKey).prop('checked', false);
          $("#modifyAccessSwitch-" + rowKey).prop('checked', false);
          $("#deleteAccessSwitch-" + rowKey).prop('checked', false);
          $("#approvalAccessSwitch-" + rowKey).prop('checked', false);
          $("#specialAccessSwitch-" + rowKey).prop('checked', false);
        }
        break;
      case "PartialAccess":
        let readAccess = $('#readAccessSwitch-' + rowKey).is(":checked");
        let addAccess = $('#addAccessSwitch-' + rowKey).is(":checked");
        let modifyAccess = $('#modifyAccessSwitch-' + rowKey).is(":checked");
        let deleteAccess = $('#deleteAccessSwitch-' + rowKey).is(":checked");
        let approvalAccess = $('#approvalAccessSwitch-' + rowKey).is(":checked");
        let specialAccess = $('#specialAccessSwitch-' + rowKey).is(":checked");

        if (readAccess && addAccess && modifyAccess && deleteAccess && approvalAccess && specialAccess) {
          $("#allAccessSwitch-" + rowKey).prop('checked', true);
        } else {
          $("#allAccessSwitch-" + rowKey).prop('checked', false);
        }
        break;
    }
  }

  const setPermissionsForAllForms = async (accessType) => {
    switch (accessType) {
      case "allformsAllAccess":
        $(".switch").prop('checked', $('#allformsAllAccess').is(":checked"));
        break;
      case "addAllFormsAccess":
        $(".formAddAccessSwitch").prop('checked', $('#addAllFormsAccess').is(":checked"));
        break;
      case "modifyAllFormsAccess":
        $(".formModifyAccessSwitch").prop('checked', $('#modifyAllFormsAccess').is(":checked"));
        break;
      case "readAllFormsAccess":
        $(".formReadAccessSwitch").prop('checked', $('#readAllFormsAccess').is(":checked"));
        break;
      case "deleteAllFormsAccess":
        $(".formDeleteAccessSwitch").prop('checked', $('#deleteAllFormsAccess').is(":checked"));
        break;
      case "approveAllFormsAccess":
        $(".formApprovalAccessSwitch").prop('checked', $('#approveAllFormsAccess').is(":checked"));
        break;
      case "specialAllFormsAccess":
        $(".formSpecialAccessSwitch").prop('checked', $('#specialAllFormsAccess').is(":checked"));
        break;
    }
    for (let recordCount = 0; recordCount < $('#FormsTbl tbody tr').length; recordCount++) {
      const tableRow = $('#FormsTbl tbody tr').eq(recordCount);
      const addAccess = $(tableRow).find('.formAddAccessSwitch').is(":checked");
      const readAccess = $(tableRow).find('.formReadAccessSwitch').is(":checked");
      const modifyAccess = $(tableRow).find('.formModifyAccessSwitch').is(":checked");
      const deleteAccess = $(tableRow).find('.formDeleteAccessSwitch').is(":checked");
      const approvalAccess = $(tableRow).find('.formApprovalAccessSwitch').is(":checked");
      const specialAccess = $(tableRow).find('.formSpecialAccessSwitch').is(":checked");

      if (addAccess && readAccess && modifyAccess && deleteAccess && approvalAccess && specialAccess) {
        $('.formAllAccessSwitch').prop('checked', true);
      } else {
        $('.formAllAccessSwitch').prop('checked', false);
      }
    }
  }

  const constructAccessControl = (allAccess, readAccess, addAccess, modifyAccess, deleteAccess, approvalAccess, specialAccess) => {
    return `${allAccess ? "Y:" : "N:"}${readAccess ? "Y:" : "N:"}${addAccess ? "Y:" : "N:"}${modifyAccess ? "Y:" : "N:"}${deleteAccess ? "Y:" : "N:"}${approvalAccess ? "Y:" : "N:"}${specialAccess ? "Y" : "N"}`;
  };

  // For add user access entry.
  const addTransporterAccessEntryData = async () => {
    try {
      setIsLoading(true)
      let UserAccessJson = { 'userAcessRecords': [], 'commonIds': {} }

      const allFormAccessElementIds = ['allformsAllAccess', "readAllFormsAccess", "addAllFormsAccess", "modifyAllFormsAccess", "deleteAllFormsAccess", "approveAllFormsAccess", "specialAllFormsAccess"];
      let addAllFormOrNot = allFormAccessElementIds.some(element => $(`#${element}`).is(":checked"));

      for (let count = 1; count <= rowCount; count++) {
        const selectedModuleId = $('#parentModuleId-' + count).val()
        const selectedSubModuleId = $('#subModuleId-' + count).val();
        const selectedFormId = $('#formId-' + count).val();
        const allAccess = $('#allAccessSwitch-' + count).is(":checked");
        const readAccess = $('#readAccessSwitch-' + count).is(":checked");
        const addAccess = $('#addAccessSwitch-' + count).is(":checked");
        const modifyAccess = $('#modifyAccessSwitch-' + count).is(":checked");
        const deleteAccess = $('#deleteAccessSwitch-' + count).is(":checked");
        const approvalAccess = $('#approvalAccessSwitch-' + count).is(":checked");
        const specialAccess = $('#specialAccessSwitch-' + count).is(":checked");

        if (addAllFormOrNot || allAccess || readAccess || addAccess || modifyAccess || deleteAccess || approvalAccess || specialAccess) {
          const access_control = constructAccessControl(allAccess, readAccess, addAccess, modifyAccess, deleteAccess, approvalAccess, specialAccess);

          const acceesRecord = {
            company_id: parseInt(COMPANY_ID),
            company_branch_id: parseInt(COMPANY_BRANCH_ID),
            user_type: userType,
            user_id: transporterId,
            user_code: transporterVendorCode,
            module_id: parseInt(selectedModuleId),
            sub_module_id: parseInt(selectedSubModuleId),
            modules_forms_id: parseInt(selectedFormId),
            all_access: allAccess,
            read_access: readAccess,
            add_access: addAccess,
            modify_access: modifyAccess,
            delete_access: deleteAccess,
            approve_access: approvalAccess,
            special_access: specialAccess,
            access_control: access_control,
            created_by: UserName,
          };

          UserAccessJson['userAcessRecords'].push(acceesRecord);
        }
      }
      UserAccessJson['commonIds']['company_id'] = parseInt(COMPANY_ID);
      UserAccessJson['commonIds']['company_branch_id'] = parseInt(COMPANY_BRANCH_ID);
      UserAccessJson['commonIds']['user_id'] = transporterId;
      UserAccessJson['commonIds']['user_type'] = userType;

      console.log("UserAccessData: ", UserAccessJson)
      const formData = new FormData();
      formData.append(`UserAccessData`, JSON.stringify(UserAccessJson))
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesFormsUserAccess/FnAddUpdateRecord`, requestOptions)
      const resp = await apiCall.json()
      if (resp.success === '0') {
        setErrMsg(resp.error)
        setShowErrorMsgModal(true)
      } else {
        console.log("resp: ", resp)
        setSuccMsg(resp.message)
        setShowSuccessMsgModal(true)
      }

    } catch (error) {
      console.log('error: ', error);
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ComboBox ref={comboBox} />

      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress />
            <span>Loading...</span>
          </div>
        </div> : null}

      <div className='main_heding'>
        <label className='erp-form-label-lg main_heding'>Access Rights For Transporter: {transporterName} </label>
      </div>
      <div className='responsive' style={{ height: '300px', overflow: 'auto' }}>
        <Table className="erp_table" id="FormsTbl" bordered striped>
          <thead className='erp_table_head erp_table_th'>
            <tr>
              <th className='col-2'>Module</th>
              <th className='col-2'>Sub-Module</th>
              <th className='col-2'>Form</th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input switch" type="checkbox" role="switch" id="allformsAllAccess" onChange={e => setPermissionsForAllForms("allformsAllAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="allformsAllAccess" disabled={keyForViewUpdate === 'view'}> All</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="readAllFormsAccess" onChange={e => setPermissionsForAllForms("readAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="readAllFormsAccess"> Read</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="addAllFormsAccess" onChange={e => setPermissionsForAllForms("addAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="addAllFormsAccess"> Add</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="modifyAllFormsAccess" onChange={e => setPermissionsForAllForms("modifyAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="modifyAllFormsAccess"> Modify</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="deleteAllFormsAccess" onChange={e => setPermissionsForAllForms("deleteAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="deleteAllFormsAccess"> Delete</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="approveAllFormsAccess" onChange={e => setPermissionsForAllForms("approveAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="approveAllFormsAccess"> Approve</label></div> </th>
              <th className='text-center'><div class="form-switch justify-content-center"> <input class="form-check-input headerSwitch  switch" type="checkbox" role="switch" id="specialAllFormsAccess" onChange={e => setPermissionsForAllForms("specialAllFormsAccess")} disabled={keyForViewUpdate === 'view'} /> <label class="form-check-label ms-1" for="specialAllFormsAccess"> Special</label></div> </th>
            </tr>
          </thead>


          <tbody className="erp_table_td">

          </tbody>
        </Table>
      </div>
      <div className='text-center'>
        <MDButton type="button" onClick={() => goBack(transporterId)} className="erp-gb-button ms-2" variant="button"
          fontWeight="regular" >Back</MDButton>

        <MDButton type="button" onClick={() => addTransporterAccessEntryData()} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
          fontWeight="regular" >Save</MDButton>

        <MDButton type="button" className="erp-gb-button"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/TransporterListing/reg' : '/Masters/TransporterListing';
            navigate(path);
          }}
          variant="button"
          fontWeight="regular">Home</MDButton>
      </div>

      {/* Success Msg Popup */}
      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      {/* Error Msg Popup */}
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

    </>
  );
}

export default FrmTransporterAccessRightsEntry;
