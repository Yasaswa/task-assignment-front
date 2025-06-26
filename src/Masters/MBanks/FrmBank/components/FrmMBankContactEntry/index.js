import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery';
import { useLocation, useNavigate } from 'react-router-dom';

// Material Dashboard 2 PRO React components
import MDButton from 'components/MDButton';

// React Bootstrap imports
import { Table } from "react-bootstrap"

// import React icons
import { IoAddCircleOutline } from "react-icons/io5"
import { IoRemoveCircleOutline } from "react-icons/io5"

//File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from 'assets/Constants/config-constant';


const FrmMBankContactEntry = (props) => {
  //changes by ujjwala on 10/1/2024
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { state } = useLocation();
  const { bankID, bankName, keyForViewUpdate,compType } = state || {}

  //Option box 
  const [bank_id, setBankId] = useState(bankID);
  const [bank_name, setBankName] = useState(bankName);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  // 
  const [rowCount, setRowCount] = useState();
  const comboBox = useRef();

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // For navigate
  const navigate = useNavigate();

  useEffect(() => {
    const functionCall = async () => {
      await FnFetchCountryCode();
      await FnShowBankContactRecords();
    }
    functionCall()
  }, [])

  const FnCheckKey = async (rowCount) => {
    if (keyForViewUpdate !== "undefined" && keyForViewUpdate !== '' && keyForViewUpdate !== null) {
      switch (keyForViewUpdate) {
        case 'view':
          addReadOnlyAttr(rowCount)
          break;
      }

    }
  }

  const FnFetchCountryCode = async () => {
    try {
      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      setCountryCodeOptions(respCountryCode)
      localStorage.setItem("countryCodes", JSON.stringify(respCountryCode))

      var masterList = await comboBox.current.fillMasterData("cmv_designation", "", "")
      setDesignationOptions(masterList)
      localStorage.setItem("designations", JSON.stringify(masterList))
    } catch (error) {
      console.log(error)
      navigate('/Error')
    }
  }

  const FnShowBankContactRecords = async () => {
    try {
      var count = 0;
      const TContactDataApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/bankcontacts/FnShowParticularRecordForUpdate/${bankID}/${COMPANY_ID}`)
      const responce = await TContactDataApiCall.json();

      if (responce.length !== 0) {
        sessionStorage.setItem('onloadDataFillup', 'start')
        for (let BContactIndex = 0; BContactIndex < responce.length; BContactIndex++) {
          count++;
          await addTableRow(count);
          $('#BContactPersonID-' + count).val(responce[BContactIndex].bank_contact_person);
          $('#designationList-' + count).val(responce[BContactIndex].designation);
          $('#BContactNoID-' + count).val(responce[BContactIndex].contact_no);
          $('#BEmail-' + count).val(responce[BContactIndex].email_id);
          $('#BAlternateContact-' + count).val(responce[BContactIndex].alternate_contact);
          $('#BAlternateEmail-' + count).val(responce[BContactIndex].alternate_EmailId)

        }
        setRowCount(count)
        sessionStorage.removeItem('onloadDataFillup');
      } else {
        sessionStorage.setItem('onloadDataFillup', 'start')
        count++;
        await addTableRow(count);
        setRowCount(count)
        sessionStorage.removeItem('onloadDataFillup')
      }
      await FnCheckKey(count)
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  const updateCountState = () => {
    if (keyForViewUpdate !== "view") {
      var count = rowCount + 1;
      addTableRow(count);
      setRowCount(rowCount + 1)
    }
  }

  const addTableRow = async (rowCount) => {
    var respCountryCode;
    var masterList;
    if (sessionStorage.getItem('onloadDataFillup') === 'start') {
      respCountryCode = JSON.parse(localStorage.getItem("countryCodes"))
      masterList = JSON.parse(localStorage.getItem("designations"))
    } else {
      localStorage.removeItem("countryCodes")
      localStorage.removeItem("designations")
    }

    if (rowCount !== 1) {
      let newRow = $(`<tr id="BContactEntry-tr-${rowCount}"></tr>`);
      let secondLastRow = $("#BContactEntryTable tr").eq(-1);
      newRow.insertBefore(secondLastRow);
      $('#BContactEntry-tr-' + rowCount).append($("<td>").append('<span class="RemoveTrBtn"  id="RemoveTrBtn-' + rowCount + '" name=' + rowCount + ' value=' + rowCount + '><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="erp_trRemove_icon"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 256H176"></path></svg></span>'))
    }

    const createTd1 = $('<span><input type="text" class="erp_input_field" id="BContactPersonID-' + rowCount + '" maxLength="255"/></span>')
    const createTd2 = $('<select id="designationList-' + rowCount + '"> <option value="">Select</option> </select>').addClass("form-select form-select-sm operatorSelect erp_operator_val erp_form_control ")
    const createTd3 = $('<span class="erp_phone"><select size="sm" id="BContactCntryId-' + rowCount + '" class="form-select-phone BCntryCodes-' + rowCount + '"></select><input type="text" id="BContactNoID-' + rowCount + '" class="erp_input_field erp_phn_border inputphoneno "   maxLength="10"/></span>')
    const createTd4 = $('<span class="erp_phone"><select size="sm" id="BAlternateContactId-' + rowCount + '" class="form-select-phone BCntryCodes-' + rowCount + '"></select><input type="text"  id="BAlternateContact-' + rowCount + '" class= "erp_input_field  erp_phn_border  inputphoneno "  maxLength="10"/></span>')
    const createTd5 = $('<input type="email" class="emailInput" id="BEmail-' + rowCount + '" maxLength="50"/>').addClass("erp_input_field")
    const createTd6 = $('<input type="email" class="emailInput" id="BAlternateEmail-' + rowCount + '" maxLength="50"/>').addClass("erp_input_field")
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd1));
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd2));
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd3));
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd4));
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd5));
    $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd6));


    if (sessionStorage.getItem('onloadDataFillup') === 'start') {
      for (let masterListIndex = 0; masterListIndex < masterList.length; masterListIndex++) {
        $('#designationList-' + rowCount).append("<option value='" + masterList[masterListIndex].field_name + "'> " + masterList[masterListIndex].field_name + "</option>");
      }
      for (let countryCodeIndex = 0; countryCodeIndex < respCountryCode.length; countryCodeIndex++) {
        $('.BCntryCodes-' + rowCount + '').append("<option value='" + respCountryCode[countryCodeIndex] + "'> " + respCountryCode[countryCodeIndex] + "</option>");
      }
    } else {

      for (let masterListIndex = 0; masterListIndex < designationOptions.length; masterListIndex++) {
        $('#designationList-' + rowCount).append("<option value='" + designationOptions[masterListIndex].field_name + "'> " + designationOptions[masterListIndex].field_name + "</option>");
      }
      for (let countryCodeIndex = 0; countryCodeIndex < countryCodeOptions.length; countryCodeIndex++) {
        $('.BCntryCodes-' + rowCount + '').append("<option value='" + countryCodeOptions[countryCodeIndex] + "'> " + countryCodeOptions[countryCodeIndex] + "</option>");
      }
    }


    $('body').on('click', '.RemoveTrBtn', function () {
      if (keyForViewUpdate != "view") {
        var $tr = $(this).closest('tr');
        $tr.remove();
      }
    });

    // validate email field.
    $('.emailInput').on('blur', function () {
      var validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!validateEmail.test(this.value)) {
        if (this.value.trim() === '') {
          delete this.parentElement.dataset.tip;
        } else {
          this.parentElement.dataset.tip = 'Please enter valid email !...';
        }
      } else {
        delete this.parentElement.dataset.tip;
      }
    });

    // validate phone number.
    $('.inputphoneno').on('input', function () {
      debugger;
      $(this).val(function (index, value) {
        return value.replace(/\D/g, '');
      });
    });
  }


  const addTransContactEntryData = async () => {
    debugger;
    const checkIsValidated = validateRows();
    if (checkIsValidated === true) {
      var BContactJson = { 'BContactJsons': [], 'commonIds': {} }
      for (let count = 1; count <= rowCount; count++) {
        var rowIsPresent = document.getElementById("BContactEntry-tr-" + count);
        if (rowIsPresent !== null) {
          const contact = $('#BContactPersonID-' + count).val();
          if (contact !== '') {
            const designation = $('#designationList-' + count).val();
            const contactNo = $('#BContactNoID-' + count).val();
            const BContactEmail = $('#BEmail-' + count).val();
            const BAltrContact = $('#BAlternateContact-' + count).val();
            const BAltrEmail = $('#BAlternateEmail-' + count).val();

            const BContactJsonData = {
              company_id: COMPANY_ID,
              company_branch_id: COMPANY_BRANCH_ID,
              bank_id: bank_id,
              bank_contact_person: contact,
              designation: designation,
              contact_no: contactNo,
              email_id: BContactEmail,
              alternate_contact: BAltrContact,
              alternate_EmailId: BAltrEmail,
              created_by: UserName,
              modified_by: bank_id === null ? null : UserName,
            }
            console.log('tr-', count, " : ", contact + designation + contactNo + BContactEmail + BAltrContact + BAltrEmail)
            BContactJson['BContactJsons'].push(BContactJsonData)

          }
        }

      }
      BContactJson['commonIds']['bank_id'] = bank_id
      BContactJson['commonIds']['company_id'] = COMPANY_ID

      console.log("BContactJson: ", BContactJson)

      const BContactGridData = JSON.stringify(BContactJson)
      const formData = new FormData();
      formData.append(`BContactGridData`, BContactGridData)
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/bankcontacts/FnAddUpdateRecord`, requestOptions)
      const resp = await apiCall.json()
      if (resp.success === '0') {
        setErrMsg(resp.error)
        setShowErrorMsgModal(true)
      } else {
        console.log("resp: ", resp)
       
        setSuccMsg(resp.message)
        setShowSuccessMsgModal(true)
      }
    }
  }

  const validateRows = () => {
    var validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regexNo = /^[0-9\b]+$/;

    for (let count = 1; count <= rowCount; count++) {

      var rowIsPresent = document.getElementById("BContactEntry-tr-" + count);
      if (rowIsPresent !== null) {
        const contactNo = $('#BContactNoID-' + count).val();

        const inp3 = document.querySelector('#BContactNoID-' + count);
        if (contactNo !== '' && (!regexNo.test(contactNo) || contactNo.length < 10)) {
          inp3.parentElement.dataset.tip = 'Please enter valid number !...';
          return false;
        } else {
          delete inp3.parentElement.dataset.tip;
        }

        const BAltrContact = $('#BAlternateContact-' + count).val();

        const inp4 = document.querySelector('#BAlternateContact-' + count);
        if (BAltrContact !== '' && (!regexNo.test(BAltrContact) || BAltrContact.length < 10)) {
          inp4.parentElement.dataset.tip = 'Please enter valid number !...';
          return false;
        } else {
          delete inp4.parentElement.dataset.tip;
        }

        const BContactEmail = $('#BEmail-' + count).val();

        const inp1 = document.querySelector('#BEmail-' + count);
        if (BContactEmail !== '' && !validateEmail.test(BContactEmail)) {
          inp1.parentElement.dataset.tip = 'Please enter valid email !...';
          return false;
        } else {
          delete inp1.parentElement.dataset.tip;
        }

        const BAltrEmail = $('#BAlternateEmail-' + count).val();

        const inp2 = document.querySelector('#BAlternateEmail-' + count);
        if (BAltrEmail !== '' && !validateEmail.test(BAltrEmail)) {
          inp2.parentElement.dataset.tip = 'Please enter valid email !...';
          return false;
        } else {
          delete inp2.parentElement.dataset.tip;
        }

      }

    }

    return true;
  }

  const removeFirstRow = () => {
    if (keyForViewUpdate !== "view") {
      $('#BContactPersonID-' + 1).val("");
      $('#designationList-' + 1).val("");
      $('#BContactNoID-' + 1).val("");
      $('#BEmail-' + 1).val("");
      $('#BAlternateContact-' + 1).val("");
      $('#BAlternateEmail-' + 1).val("");
    }
  }

  const addReadOnlyAttr = (rowCount) => {
    $("#BContactEntryTable").find("input,button,textarea,select").attr("disabled", true);
    $("#BContactEntryTable").find("input,button,textarea,select").attr("readonly", true);
    $('.disableClass').prop('disabled', true)
  }

  return (
    <>
      <ComboBox ref={comboBox} />
      <div className='main_heding'>
        <label className='erp-form-label-lg main_heding'> {bankName} </label>
      </div>
      <Table className="erp_table" id="BContactEntryTable" responsive bordered striped>
        <thead className='erp_table_head erp_table_th'>
          <tr>
            <th>Action</th>
            <th>Bank Contact Person</th>
            <th>Designation	</th>
            <th>Contact no</th>
            <th>Alternate Contact</th>
            <th>Email</th>
            <th>Alternate Email</th>
          </tr>
        </thead>

        <tbody className="erp_table_td">

          <tr id="BContactEntry-tr-1">
            <td><IoRemoveCircleOutline className='erp_trRemove_icon disableClass' onClick={() => removeFirstRow()} /> <IoAddCircleOutline className='erp_trAdd_icon disableClass' onClick={() => updateCountState()} /></td>
          </tr>
        </tbody>


      </Table>
      <div className='erp_frm_Btns'>
        <MDButton className="erp-gb-button erp_MLeft_btn"
        
        onClick={() => {
          const path = compType === 'Register' ? '/Masters/BankListing/reg' : '/Masters/BankListing';
          navigate(path);
      }} 
        variant="button" fontWeight="regular"> Home </MDButton>
        <MDButton type="button" onClick={props.goBack} className="erp-gb-button erp_MLeft_btn" variant="button" fontWeight="regular" >Back</MDButton> &nbsp;
        <MDButton type="button" onClick={() => addTransContactEntryData()} className={`erp-gb-button ${keyForViewUpdate === 'view'? 'd-none': 'display'}`} variant="button" fontWeight="regular" >Save</MDButton>
      </div>


      {/* Success Msg Popup */}
      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

      {/* Error Msg Popup */}
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
    </>
  )
}

export default FrmMBankContactEntry
