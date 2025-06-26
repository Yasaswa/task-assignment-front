import React, { useLayoutEffect, useMemo } from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from "react-router-dom";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// React Icons
import { MdDelete, MdRefresh } from 'react-icons/md';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// React Bootstrap Imports
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Accordion, Table } from "react-bootstrap";

// import files
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import ComboBox from "Features/ComboBox";
import ConfigConstants from "assets/Constants/config-constant";
import FrmCity from "FrmGeneric/MCity/FrmCity";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmPaymentScheduleEntry from 'Masters/MPaymentSchedule/FrmPaymentScheduleEntry';
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import { CircularProgress } from '@mui/material';


export default function FrmAgentEntry({ goToNext, agentId = 0 }) {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

  const { state } = useLocation();
  const { agentID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  let expandedGlCodeCombo = false;
  const telephoneRegex = /^[0-9+\(\)#\.\s\/ext-]+$/;
  const regexNo = /^[0-9\b]+$/;


  // For Refs
  const validateNumberDateInput = useRef();
  const combobox = useRef();
  const validate = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // For navigate
  const navigate = useNavigate();

  // Option Box
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [GLCodesOption, setGLCodesOption] = useState([]);
  const [GLCodesCheckboxes, setGLCodesCheckboxes] = useState();
  const [totalSelectedGLCodeCheckboxes, setTotalSelectedGLCodeCheckboxes] = useState(0);
  const [PaymentTermOption, setPaymentTermOption] = useState([]);
  const [agentRegionOption, setAgentRegionOption] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [bankAccountTypeList, setBankAccountTypeList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);


  const [agent_id, setAgentId] = useState(agentID === 0 ? agentId : agentID)
  const [txt_agent_Name, setAgentName] = useState('');
  const [txt_agent_short_Name, setAgentShortName] = useState('');
  const [txt_agent_vendor_code, setAgentVendorCode] = useState('');
  const [txt_agent_Address1, setAgentAddress1] = useState('');
  const [txt_agent_Address2, setAgentAddress2] = useState('');
  const [txt_agent_Pincode, setAgentPincode] = useState('');
  const [cmb_agent_DistrictID, setAgentDistrictID] = useState('');
  const [cmb_agent_StateID, setAgentStateID] = useState('');
  const [cmb_agentCountryID, setAgentCountryID] = useState('');
  const [cmb_agent_CityID, setAgentCityID] = useState('');
  const [cmb_agent_Region, setAgentRegion] = useState('NA');
  const [txt_agent_PhoneNO, setAgentPhoneNo] = useState('');
  const [txt_agentCellNO, setAgentCellNo] = useState('');
  const [txt_agent_EmailID, setAgentEmail] = useState('');
  const [txt_agent_Website, setAgentWebsite] = useState('');
  const [txt_agent_GSTNO, setAgentGSTNO] = useState('');
  const [txt_agent_GSTDivision, setAgentGSTDivision] = useState('');
  const [txt_agent_GST_Range, setAgentGSTRange] = useState('');
  const [txt_agent_Pan_No, setAgentPanNo] = useState('');
  const [txt_agent_udyog_adhar_no, setAgentUdyogAdharNo] = useState('');
  const [txt_agent_vat_no, setAgentVatNO] = useState('');
  const [txt_agent_service_tax_no, setAgentServiceTaxNO] = useState('');
  const [txt_agent_excise_no, setAgentExciseNo] = useState('');
  const [txt_agent_cst_no, setAgentCSTNO] = useState('');
  const [txt_agent_bst_no, setAgentBSTNO] = useState('');
  const [cmb_agent_paymentTermID, setAgentPaymentTermID] = useState('');
  const [cmb_agent_gl_codes, setAgentGLCodes] = useState('');
  const [txt_agent_accounts_id, setAgentAcountsId] = useState('');
  const [txt_agent_block_remark, setAgentBlockRemark] = useState('');
  const [txt_agent_payment_blocked_remark, setAgentPaymentBlockedRemark] = useState('');
  const [txt_agent_rating, setAgentRating] = useState('');
  const [txt_agent_tally_id, setAgentTallyId] = useState('');
  const [txt_username, setUserName] = useState('');
  //changes by tushar
  const [txt_agent_std_percent, setagent_std_percent] = useState(0);

  const [txt_password, setPassword] = useState('');

  const [rb_is_active, setIsActive] = useState('true');

  const [actionLabel, setActionLabel] = useState('Save')
  const [actionType, setActionType] = useState('')

  // Agent contact states
  const [agentContactData, setAgentContactData] = useState([])
  const [rowCount, setRowCount] = useState(1)

  //hide and show password 
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordhideandshow = () => {
    setShowPassword(!showPassword);
  };

  // Agents bank States
  const [agentBankData, setAgentBankData] = useState([])
  const [cmb_agent_bank_account_type, setAgentBankAccountType] = useState('')
  const [cmb_bank_id, setBankId] = useState('')
  const [txt_agent_bank_branch_name, setAgentBankBranchName] = useState('')
  const [txt_agent_bank_account_no, setAgentBankAccountNo] = useState('')
  const [txt_agent_bank_ifsc_code, setAgentBankIfscCode] = useState('')
  const [txt_agent_bank_swift_code, setAgentBankSwiftCode] = useState('')
  const [txt_agent_bank_gst_no, setAgentBankGstNo] = useState('')
  const [cmb_currency_type, setCurrencyType] = useState('Rupees')
  const [txt_is_active, setAgentBankIsActive] = useState(true)

  //radio btn
  const [isAgentBlocked, setIsAgentBlocked] = useState(false);
  const [isAgentPaymentBlocked, setIsAgentPaymentBlocked] = useState(false);

  const [modalHeaderName, setHeaderName] = useState('')
  const [showAddRecModal, setShowAddRecModal] = useState(false);

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => { setShowSuccessMsgModal(false); navigate('/Masters/AgentListing'); }
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Error Msg HANDLING
  // const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const usernameRef = useRef();

  const handleCloseErrModal = () => {
    if (errMsg === "User Name is already exist!") {
      setShowErrorMsgModal(false);
      usernameRef.current.focus();
    } else {
      setShowErrorMsgModal(false);
    }
  }



  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const functionCall = async () => {
      setIsLoading(true)
      await ActionType()
      await FillComobos();
      if (agent_id !== 0) {
        await FnCheckUpdateResponce();
      }
      setIsLoading(false)
    }
    functionCall()
  }, []);

  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modify)');
        setActionLabel('Update');
        $('#shortNameId').attr('disabled', true);
        $('#txt_agent_Name').attr('disabled', true);
        break;
      case 'view':
        setActionType('(View)');
        await validate.current.readOnly("agentFormId");
        await validate.current.readOnly("bankForm");
        $("input[type=radio]").attr('disabled', true);
        break;
      default:
        setActionType('(Create)');
        break;
    }

  };

  const FillComobos = async () => {
    debugger
    try {
      if (combobox.current) {
        if (agent_id === 0) {
          await generateAgentCode();
        }

        combobox.current.fillMasterData("cmv_country", "", "").then((cmv_countryList) => {
          setCountryOptions(cmv_countryList);
          // Set the default Country India.
          const defaultCountry = cmv_countryList.find(country => country.field_name === "India");
          setAgentCountryID(defaultCountry.field_id);

          combobox.current.fillMasterData("cmv_state", "country_id", defaultCountry.field_id).then((getStateList) => {
            setStateOptions(getStateList);
            // Set the default State Maharashtra.
            const defaultState = getStateList.find(state => state.field_name === "Maharashtra");
            setAgentStateID(defaultState.field_id);

            // Load the district options.
            combobox.current.fillMasterData("cmv_district", "state_id", defaultState.field_id).then((getDistrictList) => {
              setDistrictOptions(getDistrictList);
            })
          })
        })

        combobox.current.fillMasterData("fmv_general_ledger", "", "").then((fmv_general_ledgerList) => {
          setGLCodesOption(fmv_general_ledgerList)
        })
        combobox.current.fillComboBox("PaymentTermDays").then((paymentTermDays) => {
          setPaymentTermOption(paymentTermDays)
        })
        combobox.current.fillComboBox("Regions").then((regionList) => {
          setAgentRegionOption(regionList)
        })


        combobox.current.fillComboBox("BankAccountsType").then((bankAccountTypeList) => {
          setBankAccountTypeList(bankAccountTypeList)
        })

        combobox.current.fillMasterData("cmv_designation", "", "").then((designationList) => {
          setDesignationOptions(designationList)
        })

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name'];
        globalQuery.table = "cmv_banks_List";
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        combobox.current.fillFiltersCombo(globalQuery)
          .then(bankList => {
            setBankList(bankList);
          });

        // combobox.current.fillMasterData("cmv_banks_List", "", "").then((bankList) => {
        //   setBankList(bankList)
        // })

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name'];
        globalQuery.table = "fmv_currency";
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        combobox.current.fillFiltersCombo(globalQuery)
          .then(currencyList => {
            setCurrencyTypeList(currencyList)
          });

        // combobox.current.fillMasterData("fmv_currency", "", "").then((currencyList) => {
        //   setCurrencyTypeList(currencyList)
        // })
      }

      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      setCountryCodeOptions(respCountryCode)

    } catch (error) {
      console.log('error: ', error)
      navigate('/Error')
    }
  }

  const FnCheckUpdateResponce = async () => {
    debugger
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/agent/FnShowParticularRecord/${COMPANY_ID}/${agent_id}`)
      const response = await apiCall.json();
      const agentDetails = response.agentDetails
      const agentBankDetails = response.agentBankDetails
      const agentContactDetails = response.agentContactDetails
      //changes by tushar (added agent_std_percent)
      const { agent_name, agent_short_name, agent_vendor_code, agent_address1, agent_address2,
        agent_city_id, agent_pincode, agent_district_id, agent_state_id, agent_country_id,
        agent_region, agent_phone_no, agent_cell_no, agent_EmailId, agent_website, agent_gst_no,
        agent_gst_division, agent_gst_range, agent_pan_no, agent_udyog_adhar_no, agent_vat_no,
        agent_service_tax_no, agent_excise_no, agent_cst_no, agent_bst_no, agent_payment_term_id,
        agent_gl_codes, agent_accounts_id, agent_blocked, agent_blocked_remark, agent_payment_blocked,
        agent_payment_blocked_remark, agent_ratings, agent_tally_id, username, password, is_active, agent_std_percent } = agentDetails;

      setAgentCountryID(agent_country_id);
      await FnCombosOnChange('Country')
      setAgentStateID(agent_state_id);
      await FnCombosOnChange('State')
      setAgentDistrictID(agent_district_id);
      await FnCombosOnChange('District')
      setAgentName(agent_name);
      setAgentShortName(agent_short_name);
      setAgentVendorCode(agent_vendor_code);
      setAgentAddress1(agent_address1);
      setAgentAddress2(agent_address2);
      setAgentPincode(agent_pincode);
      setAgentCityID(agent_city_id);
      setAgentRegion(agent_region);
      setAgentPhoneNo(agent_phone_no);
      setAgentCellNo(agent_cell_no);
      setAgentEmail(agent_EmailId);
      setAgentWebsite(agent_website);
      setAgentGSTNO(agent_gst_no);
      setAgentGSTDivision(agent_gst_division);
      setAgentGSTRange(agent_gst_range);
      setAgentPanNo(agent_pan_no);
      setAgentUdyogAdharNo(agent_udyog_adhar_no);
      setAgentVatNO(agent_vat_no);
      setAgentServiceTaxNO(agent_service_tax_no);
      setAgentExciseNo(agent_excise_no);
      setAgentCSTNO(agent_cst_no);
      setAgentBSTNO(agent_bst_no);
      setAgentPaymentTermID(agent_payment_term_id);
      setAgentGLCodes(agent_gl_codes);
      // Set the total selected GL-Codes Count.
      if (agent_gl_codes) { // This checks if agent_gl_codes is not null or undefined
        setTotalSelectedGLCodeCheckboxes(agent_gl_codes.split(':').length);
      } else {
        setTotalSelectedGLCodeCheckboxes(0); // Or handle the case where agent_gl_codes is empty/null
      }
      // if (agent_gl_codes !== '') {
      //   setTotalSelectedGLCodeCheckboxes(agent_gl_codes.split(':').length);
      // }
      setAgentAcountsId(agent_accounts_id);
      setAgentBlockRemark(agent_blocked_remark);
      setAgentPaymentBlockedRemark(agent_payment_blocked_remark);
      setAgentRating(agent_ratings);
      setAgentTallyId(agent_tally_id);
      setUserName(username)
      setPassword(password)
      setIsAgentBlocked(agent_blocked)
      setIsAgentPaymentBlocked(agent_payment_blocked)
      setIsActive(is_active.toString())
      //changes by tushar
      setagent_std_percent(agent_std_percent)
      // Set Agent Bank & contact data
      setAgentBankData(agentBankDetails)
      if (agentContactDetails.length === 0) {
        const updatedAgentContactData = [...agentContactData];  // Create a copy of the array
        updatedAgentContactData[0] = { ...contactBlankObject }; // Set values of 0th index to the contactBlankObject
        setAgentContactData(updatedAgentContactData);
      } else {
        setAgentContactData(agentContactDetails)
      }

    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }

  const FnCombosOnChange = async (key) => {
    switch (key) {
      case 'Country':
        const getCountryId = document.getElementById('countryId').value;
        setAgentCountryID(getCountryId)
        if (getCountryId !== '') {
          $('#error_countryId').hide();
          var stateList = await combobox.current.fillMasterData("cmv_state", "country_id", getCountryId)
          setStateOptions(stateList)
          setDistrictOptions([])
          setCityOptions([])
          setAgentStateID('')
          setAgentDistrictID('')
          setAgentCityID('')

        } else {
          setStateOptions([])
          setDistrictOptions([])
          setCityOptions([])
          setAgentStateID('')
          setAgentDistrictID('')
          setAgentCityID('')
        }

        break;
      case 'State':
        const getStateId = document.getElementById('stateId').value;
        setAgentStateID(getStateId)
        if (getStateId !== '') {
          $('#error_stateId').hide();
          var districtList = await combobox.current.fillMasterData("cmv_district", "state_id", getStateId)
          setDistrictOptions(districtList)
          setAgentDistrictID('')
          setCityOptions([])
          setAgentCityID('')
        } else {
          setDistrictOptions([])
          setAgentDistrictID('')
          setCityOptions([])
          setAgentCityID('')
        }
        break;
      case 'District':
        const getDistrictId = document.getElementById('districtId').value;
        setAgentDistrictID(getDistrictId)
        if (getDistrictId !== '') {
          $('#error_districtId').hide();
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: getDistrictId });
          let cityList = await combobox.current.removeCatcheFillCombo(globalQuery);
          setCityOptions(cityList);
          // var cityList = await combobox.current.fillMasterData("cmv_city", "district_id", getDistrictId)
          // setCityOptions(cityList)
          setAgentCityID('')
        } else {
          setCityOptions([])
          setAgentCityID('')
        }
        break;

      case 'City':
        const propertyValCity = document.getElementById('cityId').value;

        if (propertyValCity === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('City')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }
        else {
          setAgentCityID(propertyValCity);
          // Set the pincode from the city list.
          const selectedCity = cityOptions.find(city => city.field_id === parseInt(propertyValCity));
          setAgentPincode(selectedCity.city_pincode);

          if (propertyValCity !== "") { $('#error_cityId').hide(); }
        }
        break;
      case 'fmv_general_ledger':
        const generalLeadgers = document.getElementById('suppBranchGLCodesId').value;
        setAgentGLCodes(generalLeadgers)
        $('#error_suppBranchGLCodesId').hide();
        if (generalLeadgers === '0') {
          const newTab = window.open('/Masters/MFMGeneralLedgerEntry', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }
        break;
      case 'PaymentTermDays':
        const paymentTermDays = document.getElementById('supplierPaymentTermID').value;
        setAgentPaymentTermID(paymentTermDays)
        $('#error_supplierPaymentTermID').hide();
        if (paymentTermDays === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Payment Terms')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }

        break;
      case 'Regions':
        const Region = document.getElementById('customerRegionID').value;
        setAgentRegion(Region)
        $('#error_customerRegionID').hide();
        break;
      default:
        break;
    }
  }

  const FnValidateForm = async () => {
    const checkIsValidate = await validate.current.validateForm("agentFormId");
    if (!checkIsValidate) {
      return false;
    }
    // let agentContactValid = true;
    // const tableRows = document.querySelectorAll('#agentContactTbl tbody tr');
    // tableRows.forEach(row => {
    //   const agentContactName = row.querySelector('input[id^="agent_contact_person_"]').value;
    //   if (agentContactName === '') {
    //     row.querySelector('input[id^="agent_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
    //     row.querySelector('input[id^="agent_contact_person_"]').focus();
    //     agentContactValid = false;
    //     return;
    //   } else {
    //     delete row.querySelector('input[id^="agent_contact_person_"]').parentElement.dataset.tip;
    //   }

    //   const agentContactNo = row.querySelector('input[id^="agent_contact_no_"]').value;
    //   if (agentContactNo === "") {
    //     row.querySelector('input[id^="agent_contact_no_"]').parentElement.dataset.tip = 'Please fill this Field...!';
    //     row.querySelector('input[id^="agent_contact_no_"]').focus();
    //     agentContactValid = false;
    //     return;
    //     // } else {
    //   } else if (agentContactNo !== "") {
    //     if (agentContactNo.length < 10) {
    //       // If length is less than 10, set validation to false
    //       row.querySelector('input[id^="agent_contact_no_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
    //       row.querySelector('input[id^="agent_contact_no_"]').focus();
    //       return agentContactValid = false;
    //     }
    //   }

    //   const agentAlternateContactNo = row.querySelector('input[id^="agent_alternate_contact_"]').value;
    //   if (agentAlternateContactNo !== "") {
    //     if (agentAlternateContactNo.length < 10) {
    //       row.querySelector('input[id^="agent_alternate_contact_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
    //       row.querySelector('input[id^="agent_alternate_contact_"]').focus();
    //       return agentContactValid = false;
    //     }
    //   }

    //   const agentEmailId = row.querySelector('input[id^="agent_email_id_"]').value;
    //   if (agentEmailId === "") {
    //     row.querySelector('input[id^="agent_email_id_"]').parentElement.dataset.tip = 'Please fill this Field...!';
    //     row.querySelector('input[id^="agent_email_id_"]').focus();
    //     agentContactValid = false;
    //     return;
    //   } else if (agentEmailId !== "") {
    //     if (!validateNumberDateInput.current.validateEmail(agentEmailId)) {
    //       row.querySelector('input[id^="agent_email_id_"]').parentElement.dataset.tip = 'Please fill this Field...!';
    //       row.querySelector('input[id^="agent_email_id_"]').focus();
    //       return agentContactValid = false;
    //     }
    //   }
    // })
    // return agentContactValid;
    return true;
  }


  const FnAddAgentDetails = async () => {
    debugger
    try {
      setIsLoading(true)
      let checkIsValidate = false;
      checkIsValidate = await FnValidateForm()

      const json = { 'TransAgent': {}, 'TransAgentContactData': [], 'TransAgentBankData': [], 'commonIds': { 'company_id': COMPANY_ID, 'agent_id': agent_id } }
      if (checkIsValidate) {
        const data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          agent_id: agent_id,
          created_by: UserName,
          modified_by: agent_id === 0 ? null : UserName,
          agent_name: txt_agent_Name,
          agent_short_name: txt_agent_short_Name,
          agent_gl_codes: cmb_agent_gl_codes,
          agent_accounts_id: txt_agent_accounts_id,
          agent_vendor_code: txt_agent_vendor_code,
          agent_address1: txt_agent_Address1,
          agent_address2: txt_agent_Address2,
          agent_pincode: txt_agent_Pincode,
          agent_city_id: cmb_agent_CityID,
          agent_district_id: cmb_agent_DistrictID,
          agent_state_id: cmb_agent_StateID,
          agent_country_id: cmb_agentCountryID,
          agent_region: cmb_agent_Region,
          agent_phone_no: txt_agent_PhoneNO,
          agent_cell_no: txt_agentCellNO,
          agent_EmailId: txt_agent_EmailID,
          agent_website: txt_agent_Website.trim() === '' ? 'NA' : txt_agent_Website.trim(),
          agent_gst_no: txt_agent_GSTNO,
          agent_gst_division: txt_agent_GSTDivision,
          agent_gst_range: txt_agent_GST_Range,
          agent_pan_no: txt_agent_Pan_No,
          agent_udyog_adhar_no: txt_agent_udyog_adhar_no,
          agent_vat_no: txt_agent_vat_no,
          agent_service_tax_no: txt_agent_service_tax_no,
          agent_excise_no: txt_agent_excise_no,
          agent_cst_no: txt_agent_cst_no,
          agent_bst_no: txt_agent_bst_no,
          agent_blocked_remark: txt_agent_block_remark,
          agent_payment_blocked_remark: txt_agent_payment_blocked_remark,
          agent_ratings: txt_agent_rating,
          agent_tally_id: txt_agent_tally_id,
          username: txt_username,
          password: txt_password,
          is_active: rb_is_active,
          agent_payment_blocked: isAgentPaymentBlocked,
          agent_blocked: isAgentBlocked,
          agent_payment_term_id: cmb_agent_paymentTermID === '' ? 152 : cmb_agent_paymentTermID,
          //changes by tushar
          agent_std_percent: txt_agent_std_percent,
        };
        // 'TransAgent': {}, 'TransAgentContactData': [], 'TransAgentBankData': [] 
        json.TransAgent = data
        json.TransAgentContactData = agentContactData
        json.TransAgentBankData = agentBankData

        const formData = new FormData()
        formData.append('TransAgentData', JSON.stringify(json))

        const forwardData = {
          method: 'POST',
          body: formData,
        }
        const agentApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/agent/FnAddUpdateRecord`, forwardData)
        const response = await agentApiCall.json();

        if (response.success === '0') {
          setErrMsg(response.error)
          setShowErrorMsgModal(true)
        } else {
          setAgentId(response.data.agent_id)
          const evitCache = await combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(response.message)
          setShowSuccessMsgModal(true)
        }

      }
    } catch (error) {
      console.log("error", error);
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }

  }

  // Form Validation. 
  const validateFields = (event) => {
    if (event.target.type === 'email' && !validateNumberDateInput.current.validateEmail(event.target.value)) {
      $(`#error_${event.target.id}`).text('Please enter valid email!...')
      $(`#error_${event.target.id}`).show()
    } else {
      $(`#error_${event.target.id}`).hide()
    }
    validate.current.validateFieldsOnChange("agentFormId")
  }

  const validateWebSite = (obj) => {
    var validateWebSite = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (obj.value === "" || validateWebSite.test(obj.value)) {
      $("#error_webSite").hide();
    } else if (obj.value !== "" && !validateWebSite.test(obj.value)) {
      $("#error_webSite").text("Please enter valid url!...");
      $("#error_webSite").show();
    }
  }

  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {
      case 'City':
        if (cmb_agent_DistrictID !== '' && cmb_agent_DistrictID !== undefined) {
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: cmb_agent_DistrictID });
          combobox.current.removeCatcheFillCombo(globalQuery).then((cityList) => {
            setCityOptions(cityList);
          })

          // var UpdatedcityList = await combobox.current.fillMasterData("cmv_city", "district_id", cmb_agent_DistrictID)
          // setCityOptions(UpdatedcityList)
        }
        setShowAddRecModal(false);
        break;

      case 'Payment Terms':
        combobox.current.fillComboBox("PaymentTermDays").then((paymentTermDays) => {
          setPaymentTermOption(paymentTermDays)
        })
        break;
      default:
        break;
    }
    setShowAddRecModal(false);
    sessionStorage.removeItem('dataAddedByCombo')
    setTimeout(() => {
      $(".erp_top_Form").css({ "padding-top": "0px" });
    }, 200)

  }

  const displayRecordComponent = () => {
    switch (modalHeaderName) {
      case 'City':
        return <FrmCity btn_disabled={true} />;
      case 'Payment Terms':
        return <FrmPaymentScheduleEntry btn_disabled={true} />;
      default:
        return null;
    }
  }

  // const FnRefreshbtn = async (key) => {
  //   switch (key) {
  //     case 'GLCodes':
  //       const fmv_general_ledgerList = await combobox.current.fillMasterData("fmv_general_ledger", "", "")
  //       setGLCodesOption(fmv_general_ledgerList)
  //       break;
  //     default:
  //       break;
  //   }

  // }

  //------------------- Agent Contact Functionality --------------------------------------- //
  const setRowCountAndAddRow = () => {

    const lastRowIndex = agentContactData.length - 1;
    const lastRowContactPerson = agentContactData[lastRowIndex].agent_contact_person;
    if (lastRowContactPerson !== '') {
      setRowCount(rowCount + 1);
    } else {
      const tableRows = document.querySelectorAll('#agentContactTbl tbody tr');
      tableRows.forEach(row => {
        const bankContactName = row.querySelector('input[id^="agent_contact_person_"]').value;
        if (bankContactName === '') {
          row.querySelector('input[id^="agent_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
          row.querySelector('input[id^="agent_contact_person_"]').focus();
          return;
        } else {
          delete row.querySelector('input[id^="agent_contact_person_"]').parentElement.dataset.tip;
        }
      }
      )
    }
  };





  const FnUpdateAgentContactTblRows = (rowData, event) => {
    let eventId = document.getElementById(event.target.id);
    let clickedColName = event.target.getAttribute('Headers');
    let enteredValue = event.target.value;

    switch (clickedColName) {
      case 'agent_contact_person':
        rowData[clickedColName] = enteredValue;
        if (enteredValue !== '')
          delete document.querySelector('input[id^="agent_contact_person_"]').parentElement.dataset.tip;
        break;
      case 'agent_designation':
      case 'agent_contact_no':
      case 'agent_alternate_contact':
        rowData[clickedColName] = enteredValue;
        if (enteredValue.length >= 10) {
          delete eventId.parentElement.dataset.tip;
        }
        break;

      case 'agent_email_id':
      case 'agent_alternate_EmailId':
        rowData[clickedColName] = enteredValue;
        // let agentMailInp = document.querySelector(eventId);
        if (!validateNumberDateInput.current.validateEmail(enteredValue)) {
          eventId.parentElement.dataset.tip = 'Please enter valid mail...!';
        } else {
          delete eventId.parentElement.dataset.tip;
        }
        if (event._reactName === 'onBlur' && enteredValue === '') {
          delete eventId.parentElement.dataset.tip;
        }
        break;
    }

    const agentContactDetails = [...agentContactData]
    const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
    agentContactDetails[arrayIndex] = rowData
    setAgentContactData(agentContactDetails);
  }

  const removeFirstRow = (indexToRemove) => {
    if (indexToRemove !== 0) {
      const updatedAgentContactData = agentContactData.filter((item, index) => index !== indexToRemove);
      setAgentContactData(updatedAgentContactData)
    } else {
      const updatedAgentContactData = [...agentContactData];  // Create a copy of the array
      updatedAgentContactData[0] = { ...contactBlankObject }; // Set values of 0th index to the contactBlankObject
      setAgentContactData(updatedAgentContactData);
    }
  }

  const contactBlankObject = {
    company_id: COMPANY_ID,
    company_branch_id: COMPANY_BRANCH_ID,
    agent_contact_id: 0,
    agent_id: 0,
    agent_contact_person: '',
    agent_designation: '',
    agent_contact_no: '',
    agent_email_id: '',
    agent_alternate_contact: '',
    agent_alternate_EmailId: '',
    created_by: UserName,
  }

  useLayoutEffect(() => {
    const getExistingAgentContactData = [...agentContactData]
    getExistingAgentContactData.push(contactBlankObject)
    setAgentContactData(getExistingAgentContactData)
  }, [rowCount])

  const renderAgentContactTable = useMemo(() => {
    return <Table id='agentContactTbl' className={`erp_table ${agentContactData.length !== 0 ? 'display' : 'd-none'}`} responsive bordered striped>
      <thead className="erp_table_head">
        <tr>
          <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
          <th className="erp_table_th">Contact Person</th>
          <th className="erp_table_th">Designation	</th>
          <th className="erp_table_th">Contact no</th>
          <th className="erp_table_th">Alternate Contact</th>
          <th className="erp_table_th">Email</th>
          <th className="erp_table_th">Alternate Email</th>
        </tr>
      </thead>
      <tbody>
        {agentContactData.map((item, index) =>
          <tr rowindex={index} className="sticky-column">
            <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
              <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
              <IoAddCircleOutline className='erp_trAdd_icon' onClick={setRowCountAndAddRow} />
              {/* <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> */}

              {/* {
                index === 0 ? <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> : null
              } */}
            </td>
            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" className="erp_input_field mb-0"
                      id={`agent_contact_person_${index}`} value={item.agent_contact_person}
                      onChange={(e) => { FnUpdateAgentContactTblRows(item, e); }} Headers='agent_contact_person' />
                  </>
                  : item.agent_contact_person
              }
            </td>

            {/* <td className='erp_table_td'>
              <select className="form-select form-select-sm mb-0" value={item.agent_designation} {...(keyForViewUpdate === 'view' ? { disabled: 'disabled' } : {})}
                onChange={(e) => { FnUpdateAgentContactTblRows(item, e); }} id={`agent_designation_${index}`} Headers='agent_designation' >
                <option value=''>Select</option>
                {designationOptions.map(item => <option value={item.field_name}>{item.field_name}</option>)}
              </select>
            </td> */}

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`agent_designation_${index}`} className="erp_input_field mb-0"
                      value={item.agent_designation} Headers='agent_designation' maxLength="10"
                      onChange={(e) => { FnUpdateAgentContactTblRows(item, e); }} />
                  </>
                  : item.agent_designation
              }
            </td>


            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`agent_contact_no_${index}`} className="erp_input_field mb-0"
                      value={item.agent_contact_no} Headers='agent_contact_no' maxLength="10"
                      onChange={(e) => {
                        if (validateNumberDateInput.current.isInteger(e.target.value)) {
                          FnUpdateAgentContactTblRows(item, e);
                        }
                      }} />
                  </>
                  : item.agent_contact_no
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`agent_alternate_contact_${index}`} className="erp_input_field mb-0"
                      value={item.agent_alternate_contact} Headers='agent_alternate_contact' maxLength="10"
                      onChange={(e) => {
                        if (validateNumberDateInput.current.isInteger(e.target.value)) {
                          FnUpdateAgentContactTblRows(item, e);
                        }
                      }} />
                  </>
                  : item.agent_alternate_contact
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="email" id={`agent_email_id_${index}`} className="erp_input_field mb-0" value={item.agent_email_id} Headers='agent_email_id'
                      onChange={(e) => { FnUpdateAgentContactTblRows(item, e); }} onBlur={(e) => { FnUpdateAgentContactTblRows(item, e); }}
                    />
                  </>
                  : item.agent_email_id
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="email" id={`agent_alternate_EmailId_${index}`} className="erp_input_field mb-0"
                      value={item.agent_alternate_EmailId} Headers='agent_alternate_EmailId'
                      onChange={(e) => { FnUpdateAgentContactTblRows(item, e); }} onBlur={(e) => { FnUpdateAgentContactTblRows(item, e); }}
                    /></>
                  : item.agent_alternate_EmailId
              }
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  }, [agentContactData, designationOptions])

  //------------------- Agent Contact Functionality Ends --------------------------------------- //

  //------------------- Agent Bank Functionality  --------------------------------------- //

  const renderAgentBanks = useMemo(() => {
    return <>
      {agentBankData.length !== 0 ?
        <Table className="erp_table" responsive bordered striped>
          <thead className="erp_table_head">
            <tr>
              {/* text-center */}
              <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
              <th className="erp_table_th">Sr. No</th>
              <th className="erp_table_th">Account Type</th>
              <th className="erp_table_th">Bank Name</th>
              <th className="erp_table_th">Branch Name</th>
              <th className="erp_table_th">Account No</th>
              <th className="erp_table_th">IFSC No</th>
              <th className="erp_table_th">Swift Code</th>
              <th className="erp_table_th">GST No</th>
              <th className="erp_table_th">Currency Type</th>
            </tr>
          </thead>
          <tbody>
            {agentBankData?.map((bankItem, index) =>
              <tr rowindex={index}>
                <td className={`erp_table_td ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> <MdDelete className="erp-delete-btn" onClick={() => deleteBank(index)} /></td>
                <td className="erp_table_td">{index + 1}</td>
                <td className="erp_table_td">{bankItem.agent_bank_account_type}</td>
                <td className="erp_table_td">{bankItem.agent_bank_name}</td>
                <td className="erp_table_td">{bankItem.agent_bank_branch_name}</td>
                <td className="erp_table_td">{bankItem.agent_bank_account_no}</td>
                <td className="erp_table_td">{bankItem.agent_bank_ifsc_code}</td>
                <td className="erp_table_td">{bankItem.agent_bank_swift_code}</td>
                <td className="erp_table_td ">{bankItem.agent_bank_gst_no}</td>
                <td className="erp_table_td ">{bankItem.currency_type}</td>
              </tr>
            )
            }
          </tbody>
        </Table>
        : null}</>
  }, [agentBankData])

  const deleteBank = (indexToRemove) => {
    const updatedagentBankData = agentBankData.filter((item, index) => index !== indexToRemove);
    setAgentBankData(updatedagentBankData);
  }

  const validateBankFields = () => {
    validate.current.validateFieldsOnChange("bankForm")
  }

  const FnAddAgentBank = async () => {
    const checkIsBankValidate = await validate.current.validateForm("bankForm");
    if (checkIsBankValidate) {
      const bankData = {
        company_id: COMPANY_ID,
        company_branch_id: COMPANY_BRANCH_ID,
        agent_bank_id: 0,
        agent_id: 0,
        bank_id: cmb_bank_id,
        agent_bank_name: $("#cmb_bank_id option:selected").text(),
        agent_bank_branch_name: txt_agent_bank_branch_name,
        agent_bank_account_type: cmb_agent_bank_account_type,
        agent_bank_account_no: txt_agent_bank_account_no,
        agent_bank_ifsc_code: txt_agent_bank_ifsc_code,
        agent_bank_swift_code: txt_agent_bank_swift_code,
        agent_bank_gst_no: txt_agent_bank_gst_no,
        currency_type: cmb_currency_type,
        // agent_bank_gl_codes: cmb_agent_gl_codes,
        // agent_bank_accounts_id: txt_agent_accounts_id,
        is_active: txt_is_active,
        created_by: UserName,
      }

      const isDuplicate = agentBankData.some((item) => item.agent_bank_name === bankData.agent_bank_name && item.agent_bank_account_type === bankData.agent_bank_account_type);

      if (!isDuplicate) {
        setBankId('')
        setAgentBankBranchName('');
        setAgentBankBranchName('');
        setAgentBankAccountType('');
        setAgentBankAccountNo('')
        setAgentBankIfscCode('');
        setAgentBankSwiftCode('');
        setAgentBankGstNo('');
        setCurrencyType('Rupees')
        setAgentAcountsId('');
        setAgentBankIsActive(true)

        // set Bank data in array
        setAgentBankData((prevArray) => [...prevArray, bankData]);
      } else {
        $('#error_cmb_bank_id').text('This Bank already exists...!').show();
      }
    }
  }
  //------------------- Agent Bank Functionality Ends  --------------------------------------- //


  //------------------- Agent vendor-code Functionality  --------------------------------------- //
  const generateAgentCode = async () => {
    const data = {
      tblName: 'cm_agent', fieldName: 'agent_vendor_code', Length: 5, company_id: COMPANY_ID,
    };
    const formData = new FormData();
    formData.append(`data`, JSON.stringify(data))
    const requestOptions = { method: 'POST', body: formData };
    try {
      const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/agent/FnGenerateCode/${COMPANY_ID}`, requestOptions)
      const resp = await fetchResponse.text();
      console.log("GenerateTAuto Api: ", resp)
      if (resp) {
        setAgentVendorCode('A-' + resp);
        setUserName('A-' + resp);
        return 'A-' + resp;
      }
    } catch (error) {
      console.error(error);
      navigate('/Error')
    }
  }

  //------------------- Agent vendor-code Functionality Ends  --------------------------------------- //

  //------------------- Agent GL Functionality  --------------------------------------- //
  useEffect(() => {
    $(document).on('mouseup', function (e) {
      let container = $("#gl_code_ul");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
  }, []);

  const FnShowGlCodes = async () => {
    debugger
    if (GLCodesOption.length > 0) {
      await FnCreateGLCodesChks();

      // Also check the already checked checkboxes.
      if (cmb_agent_gl_codes !== '') {
        const glCodeIds = cmb_agent_gl_codes.split(':');
        glCodeIds.forEach(function (contactId, index) {
          $('#glCodeCheckBox_' + glCodeIds[index]).prop('checked', true);
        });
        FnToggleCheckBoxes('PartiallyCheckGLCode');
      }

      let checkBoxesContainer = document.getElementById("gl_code_ul");
      if (!expandedGlCodeCombo) {
        checkBoxesContainer.style.display = "block";
        expandedGlCodeCombo = true;

      } else {
        checkBoxesContainer.style.display = "none";
        expandedGlCodeCombo = false;
      }

      $('.gl_code_checkboxes').on('input blur', function (e) {
        FnGetSelectedGLCodesIds();
      });

    }
  }

  const FnCreateGLCodesChks = async () => {
    if (GLCodesOption.length !== 0) {
      let checkboxes = GLCodesOption.map((item, index) => {
        if (index === 0) {
          return (
            <>
              <li className="item gl_code_checkboxes">
                <span className="checkbox">
                  <input type="checkbox" id="CheckAllGLCodes" value={index} className="erp_radio_button"
                    onChange={(event) => FnToggleCheckBoxes('CheckAllGLCodes')} {...(keyForViewUpdate === "view" ? { disabled: true } : {})} />
                </span>
                <span className="item-text">All</span>
              </li>
              <li className="item gl_code_checkboxes">
                <span className="checkbox">
                  <input type="checkbox" name="glCodeCheckBox" value={item.field_id} {...(keyForViewUpdate === "view" ? { disabled: true } : {})}
                    id={`glCodeCheckBox_${item.field_id}`} className="erp_radio_button glCodeCheckBox" onChange={(event) => FnToggleCheckBoxes('PartiallyCheckGLCode')}
                  />
                </span>
                <span className="item-text">{item.field_name}</span>
              </li>
            </>
          );
        }
        return (
          <li className="item gl_code_checkboxes">
            <span className="checkbox">
              <input type="checkbox" name="glCodeCheckBox" value={item.field_id} id={`glCodeCheckBox_${item.field_id}`} {...(keyForViewUpdate === "view" ? { disabled: true } : {})}
                className="erp_radio_button glCodeCheckBox" onChange={(event) => FnToggleCheckBoxes('PartiallyCheckGLCode')}
              />
            </span>
            <span className="item-text">{item.field_name}</span>
          </li>
        );
      });
      setGLCodesCheckboxes(checkboxes);
    }
  }

  const FnGetSelectedGLCodesIds = () => {
    let selectedGLCodes = '';
    const checkboxes = $('.glCodeCheckBox:checked');
    checkboxes.each(function () {
      if ($(this).val() !== '0' && $(this).val() !== '') {
        selectedGLCodes += $(this).val() + ":";
      }
    });
    setAgentGLCodes(selectedGLCodes.replace(/:$/, ''));
    return selectedGLCodes.replace(/:$/, '');
  }

  const FnToggleCheckBoxes = (checkboxType) => {
    switch (checkboxType) {
      case "CheckAllGLCodes":
        $('.glCodeCheckBox').prop('checked', $('#CheckAllGLCodes').is(":checked"));
        setTotalSelectedGLCodeCheckboxes($('input:checkbox.glCodeCheckBox:checked').length);
        break;

      case 'PartiallyCheckGLCode':
        $('#CheckAllGLCodes').prop('checked', $('input:checkbox.glCodeCheckBox:checked').length === $('input:checkbox.glCodeCheckBox').length);
        setTotalSelectedGLCodeCheckboxes($('input:checkbox.glCodeCheckBox:checked').length);
        break;

      default:
        break;
    }
  }

  //------------------- Agent GL Functionality Ends --------------------------------------- //



  return (
    <>
      <ComboBox ref={combobox} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <FrmValidations ref={validate} />
      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress />
            <span>Loading...</span>
          </div>
        </div> : null}
      <form id='agentFormId'>
        <div className='row'>
          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Name<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_agent_Name" className="erp_input_field" value={txt_agent_Name} onChange={e => { setAgentName(e.target.value); validateFields(e) }} maxLength="255" />
                <MDTypography variant="button" id="error_txt_agent_Name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">  Short Name </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="shortNameId" className="erp_input_field" value={txt_agent_short_Name} onChange={e => { setAgentShortName(e.target.value.toUpperCase()); validateFields(e) }} maxLength="4" optional="optional" />
                <MDTypography variant="button" id="error_shortNameId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Vendor Code</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="branchVendorId" className="erp_input_field" value={txt_agent_vendor_code} onChange={e => { setAgentVendorCode(e.target.value); validateFields(e) }} maxLength="255" optional="optional" />
                <MDTypography variant="button" id="error_branchVendorId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Address1<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} id="branchAddr1" className="erp_txt_area" value={txt_agent_Address1} onChange={e => { setAgentAddress1(e.target.value); validateFields(e) }} maxlength="500" />
                <MDTypography variant="button" id="error_branchAddr1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Address2</Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} id="branchAddr2" className="erp_txt_area" value={txt_agent_Address2} onChange={e => { setAgentAddress2(e.target.value); }} maxlength="500" optional="optional" />
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Pincode<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field number" id="pinCode" value={txt_agent_Pincode} onChange={e => {
                  if (validateNumberDateInput.current.isInteger(e.target.value)) {
                    setAgentPincode(e.target.value)
                  }; validateFields(e)
                }}
                  maxLength="6" disabled />
                <MDTypography variant="button" id="error_pinCode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Country<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select size="sm" id="countryId" className="form-select form-select-sm" value={cmb_agentCountryID} onChange={() => FnCombosOnChange("Country")}>
                  <option value="">Select</option>
                  {countryOptions?.map(country => (
                    <option value={country.field_id}>{country.field_name}</option>

                  ))}

                </select>
                <MDTypography variant="button" id="error_countryId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">State<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select size="sm" id="stateId" className="form-select form-select-sm" value={cmb_agent_StateID} onChange={() => FnCombosOnChange("State")}>
                  <option value="">Select</option>
                  {stateOptions?.map(state => (
                    <option value={state.field_id}>{state.field_name}</option>

                  ))}

                </select>
                <MDTypography variant="button" id="error_stateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">District<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select size="sm" id="districtId" className="form-select form-select-sm" value={cmb_agent_DistrictID} onChange={() => FnCombosOnChange("District")}>
                  <option value="">Select</option>
                  {districtOptions?.map(district => (
                    <option value={district.field_id}>{district.field_name}</option>

                  ))}

                </select>
                <MDTypography variant="button" id="error_districtId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">City<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select id="cityId" value={cmb_agent_CityID} className="form-select form-select-sm" onChange={() => FnCombosOnChange("City")}>
                  <option value="">Select</option>
                  <option value="0">Add New Record +</option>
                  {cityOptions?.map(city => (
                    <option value={city.field_id}>{city.field_name}</option>

                  ))}
                </select>
                <MDTypography variant="button" id="error_cityId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Region</Form.Label>
              </div>
              <div className='col'>
                <select size='sm' id='customerRegionID' className='form-select form-select-sm' value={cmb_agent_Region} onChange={() => FnCombosOnChange('Regions')} maxlength="255" optional="optional">
                  {
                    agentRegionOption?.map(supplierRegion => (
                      <option value={supplierRegion.field_name}>{supplierRegion.field_name}</option>
                    ))
                  }
                </select>
                <MDTypography variant="button" id="error_customerRegionID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Phone NO.</Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='phoneCntryId' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (<option value={option}>{option}</option>))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="phoneNo" value={txt_agent_PhoneNO} onChange={e => {
                    // if (validateNumberDateInput.current.isInteger(e.target.value)) { setAgentPhoneNo(e.target.value) }; 
                    if (telephoneRegex.test(e.target.value) || e.target.value === '') { setAgentPhoneNo(e.target.value) }
                    validateFields(e);
                  }} maxLength="20" optional="optional" />
                </span>
              </div>
            </div>
          </div>

          {/* 2 nd Column */}
          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Cell NO.<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='cellCntryId' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (<option value={option}>{option}</option>))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="cellNo" value={txt_agentCellNO} onChange={e => {
                    // if (validateNumberDateInput.current.isInteger(e.target.value)) { setAgentCellNo(e.target.value) }; 
                    if (regexNo.test(e.target.value) || e.target.value === '') { setAgentCellNo(e.target.value) }
                    validateFields(e)
                  }} maxLength="10" />
                </span>
                <MDTypography variant="button" id="error_cellNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Email<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="email" id="email" className="erp_input_field" value={txt_agent_EmailID} onChange={e => { setAgentEmail(e.target.value); validateFields(e) }} maxLength="50" />
                <MDTypography variant="button" id="error_email" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Website</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="webSite" className="erp_input_field " value={txt_agent_Website} onChange={e => { setAgentWebsite(e.target.value); validateWebSite(e.target) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_webSite" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">GST NO.
                  {/* <span className="required">*</span> */}
                </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="gstNo" className="erp_input_field" value={txt_agent_GSTNO} onChange={e => { setAgentGSTNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_gstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">GST Division</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='gstDivision' className="erp_input_field" value={txt_agent_GSTDivision} onChange={e => { setAgentGSTDivision(e.target.value); validateFields(e) }} maxLength="500" optional="optional" />
                <MDTypography variant="button" id="error_gstDivision" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">GST Range</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="gstDivisionRange" className="erp_input_field optional" value={txt_agent_GST_Range} onChange={e => { setAgentGSTRange(e.target.value); validateFields(e) }} maxLength="500" optional="optional" />
                <MDTypography variant="button" id="error_gstDivisionRange" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">PAN NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="panNo" className="erp_input_field" value={txt_agent_Pan_No} onChange={e => { setAgentPanNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="10" optional="optional"/>
                <MDTypography variant="button" id="error_panNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Udyog Aadhar NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='UdyogAdharNo' className="erp_input_field " value={txt_agent_udyog_adhar_no} onChange={e => { setAgentUdyogAdharNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="12" optional="optional" />
                <MDTypography variant="button" id="error_UdyogAdharNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">VAT NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='VatNo' className="erp_input_field " value={txt_agent_vat_no} onChange={e => { setAgentVatNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_VatNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Service Tax NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='taxNo' className="erp_input_field optional" value={txt_agent_service_tax_no} onChange={e => { setAgentServiceTaxNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="15" optional="optional" />
                <MDTypography variant="button" id="error_taxNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Excise NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='exciseNo' className="erp_input_field " value={txt_agent_excise_no} onChange={e => { setAgentExciseNo(e.target.value.split(' ').join('').toUpperCase());; validateFields(e) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_exciseNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label"> CST NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='cstNo' className="erp_input_field" value={txt_agent_cst_no} onChange={e => { setAgentCSTNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_cstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

          </div>

          {/* 3rd Column */}
          <div className='col-sm-4 erp_form_col_div'>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label"> BST NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='bstNo' className="erp_input_field " value={txt_agent_bst_no} onChange={e => { setAgentBSTNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                <MDTypography variant="button" id="error_bstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Payment Term</Form.Label>
              </div>
              <div className='col'>
                <select id='supplierPaymentTermID' className='form-select form-select-sm' value={cmb_agent_paymentTermID} onChange={() => FnCombosOnChange('PaymentTermDays')} optional="optional">
                  <option value=''>Select</option>
                  <option value="0">Add New Record+</option>

                  {PaymentTermOption?.map(PaymentTermId => (
                    <option value={PaymentTermId.field_id}>{PaymentTermId.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_supplierPaymentTermID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row mb-1'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Rating</Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} id='branchRating' className="erp_txt_area optional" value={txt_agent_rating} onChange={e => { setAgentRating(e.target.value); validateFields(e) }} maxLength="255" optional="optional" />
                <MDTypography variant="button" id="error_branchRating" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4 col-12'>
                <Form.Label className="erp-form-label">GL Codes</Form.Label>
              </div>
              {/* <div className='col-sm-7 col-10'> */}
              <div className='col '>

                {/* <select id='suppBranchGLCodesId' className='form-select form-select-sm ' value={cmb_agent_gl_codes} onChange={() => FnCombosOnChange('fmv_general_ledger')} optional="optional">
                  <option value=''>Select </option>
                  <option value="0">Add New Record+</option>
                  {
                    GLCodesOption?.map(GLCodes => (
                      <option value={GLCodes.field_name}>{GLCodes.field_name}</option>
                    ))
                  }
                </select> */}
                <div className="select-btn" onClick={() => { FnShowGlCodes() }} optional='optional'>
                  <span className="form-select form-select-sm" id="">
                    {totalSelectedGLCodeCheckboxes !== 0 ? totalSelectedGLCodeCheckboxes + ' Selected GL Codes ' : 'Select GL Code'}
                  </span>
                </div>
                <ul className="list-items" id="gl_code_ul">
                  {GLCodesCheckboxes}
                </ul>
                <MDTypography variant="button" id="error_suppBranchGLCodesIdd" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
              {/* <div className="col-sm-1 col-2">
                <Tooltip title="Refresh" placement="top">
                  <MDTypography>
                    <MdRefresh onClick={() => FnRefreshbtn("GLCodes")} style={{ color: 'black' }} />
                  </MDTypography>
                </Tooltip>
              </div> */}
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">A/C. ID</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='branchAccountId' className="erp_input_field optional" value={txt_agent_accounts_id} onChange={e => { setAgentAcountsId(e.target.value); validateFields(e) }} maxLength="500" optional="optional" />
                <MDTypography variant="button" id="error_branchAccountId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Agent Blocked</Form.Label>
              </div>

              <div className="col">
                <div className="erp_form_radio">
                  <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="isAgentBlocked" checked={isAgentBlocked} onChange={(e) => { setIsAgentBlocked(true); validateFields(e); }} optional="optional" /> </div>
                  <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="isAgentBlocked" checked={!isAgentBlocked} onChange={(e) => { setIsAgentBlocked(false); validateFields(e); }} optional="optional" /> </div>
                </div>
              </div>

            </div>

            {
              isAgentBlocked ?
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Blocked Remark  <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control as="textarea" rows={1} className={`erp_txt_area ${isAgentBlocked === true ? '' : 'optional'} `} id="blockRemarkId" value={txt_agent_block_remark} onChange={e => { setAgentBlockRemark(e.target.value); validateFields(e) }} maxlength="500" {...(isAgentBlocked === false ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} />
                    <MDTypography variant="button" id="error_blockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div> : null
            }

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Payment Blocked</Form.Label>
              </div>

              <div className="col">
                <div className="erp_form_radio">
                  <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="isAgentPaymentBlocked" checked={isAgentPaymentBlocked} onChange={(e) => { setIsAgentPaymentBlocked(true); validateFields(e); }} optional="optional" /> </div>
                  <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="isAgentPaymentBlocked" checked={!isAgentPaymentBlocked} onChange={(e) => { setIsAgentPaymentBlocked(false); validateFields(e); }} optional="optional" /> </div>
                </div>
              </div>

            </div>

            {
              isAgentPaymentBlocked ?
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Payment Blocked Remark <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control as="textarea" rows={1} className={`erp_txt_area ${isAgentPaymentBlocked === true ? '' : 'optional'} `} id="paymentblockRemarkId" value={txt_agent_payment_blocked_remark} onChange={e => { setAgentPaymentBlockedRemark(e.target.value); validateFields(e) }} maxlength="500" {...(isAgentPaymentBlocked === false ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} />
                    <MDTypography variant="button" id="error_paymentblockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div> : null
            }



            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Tally ID</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='tallyId' className="erp_input_field" value={txt_agent_tally_id} onChange={e => { setAgentTallyId(e.target.value); validateFields(e) }} maxLength="200" optional="optional" />
                <MDTypography variant="button" id="error_tallyId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            {/* <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">UserName <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_username" value={txt_username} onInput={(e) => { setUserName(e.target.value.trim()); }} maxlength="200" optional="optional" ref={usernameRef} />
                <MDTypography variant="button" id="error_txt_username" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div> */}

            {/* {
              keyForViewUpdate === "update" || keyForViewUpdate === "view" ?
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Password <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Control type="text" className="erp_input_field number" id="txt_password" value={txt_password} onInput={(e) => { setPassword(e.target.value.trim()); }} maxlength="50" optional="optional" />
                    <MDTypography variant="button" id="error_txt_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                : null
            } */}

            {/* {
              keyForViewUpdate === "update" || keyForViewUpdate === "view" ?
                <div className='row'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Password <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col-sm-8'>
                    <div className="input-group">
                      <Form.Control type={showPassword ? 'text' : 'password'} className="erp_input_field number" id="txt_password" value={txt_password} onInput={(e) => { setPassword(e.target.value.trim()); }} maxLength="50" {...(keyForViewUpdate === 'view' ? { disabled: 'disabled' } : {})} />
                      <span className="input-group-text" id="basic-addon2">
                        {showPassword ? (<AiFillEye onClick={togglePasswordhideandshow} />) : (<AiFillEyeInvisible onClick={togglePasswordhideandshow} />)}
                      </span>
                    </div>
                    <MDTypography variant="button" id="error_txt_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                : ""
            } */}

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Agent Std (%)<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <Form.Control
                  type="number" id="txt_agent_std_percent" className="erp_input_field text-end"
                  value={txt_agent_std_percent} onChange={(e) => { const inputValue = e.target.value; if (validateNumberDateInput.current.percentValidate(inputValue)) { setagent_std_percent(inputValue); } validateFields(e); }} maxLength="5" />
                <MDTypography variant="button" id="error_txt_agent_std_percent" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Is Active</Form.Label>
              </div>
              <div className="col">
                <div className="erp_form_radio">
                  <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="rb_is_active" checked={rb_is_active === "true"} onClick={() => setIsActive("true")} /> </div>
                  <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="rb_is_active" checked={rb_is_active === "false"} onClick={() => setIsActive("false")} /> </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </form>

      <Accordion defaultActiveKey="0" className="mt-3">
        <Accordion.Item eventKey={0}>
          <Accordion.Header className="erp-form-label-md">Banks Information</Accordion.Header>
          <Accordion.Body>

            <form id="bankForm">
              <div className={`row ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
                <div className="col-sm-6 erp_form_col_div">
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">A/C. Type<span className="required">*</span></Form.Label>
                    </div>
                    <div className="col">
                      <select size="sm" id="cmb_agent_bank_account_type" className="form-select form-select-sm erp_input_field" value={cmb_agent_bank_account_type} onChange={(e) => { setAgentBankAccountType(e.target.value); validateBankFields() }}>
                        <option value="">Select</option>
                        {bankAccountTypeList?.map(bankAcc => (
                          <option value={bankAcc.field_name}>{bankAcc.field_name}</option>

                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_agent_bank_account_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>

                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank Name<span className="required">*</span></Form.Label>
                    </div>

                    <div className="col">
                      <select size="sm" id="cmb_bank_id" className="form-select form-select-sm erp_input_field" value={cmb_bank_id} onChange={(e) => { setBankId(e.target.value);; validateBankFields() }}>
                        <option value="">Select</option>
                        {bankList?.map(bankName => (
                          <option value={bankName.field_id}>{bankName.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_bank_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Branch Name<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="txt_agent_bank_branch_name" value={txt_agent_bank_branch_name} onChange={e => { setAgentBankBranchName(e.target.value); validateBankFields() }} maxLength="255" />
                      <MDTypography variant="button" id="error_txt_agent_bank_branch_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank A/C. NO.<span className="required">*</span></Form.Label>
                    </div>

                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="txt_agent_bank_account_no" value={txt_agent_bank_account_no} onChange={(e) => {
                        if (validateNumberDateInput.current.isInteger(e.target.value)) {
                          setAgentBankAccountNo(e.target.value)
                        }; validateBankFields();
                      }} maxLength="17" />
                      <MDTypography variant="button" id="error_txt_agent_bank_account_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">IFSC NO.<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="txt_agent_bank_ifsc_code" value={txt_agent_bank_ifsc_code} onChange={e => { setAgentBankIfscCode(e.target.value.split(' ').join('').toUpperCase()); validateBankFields() }} maxLength="11" />
                      <MDTypography variant="button" id="error_txt_agent_bank_ifsc_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>
                </div>


                {/* Second column  */}

                <div className="col-sm-6 erp_form_col_div">
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Swift Code</Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="txt_agent_bank_swift_code" value={txt_agent_bank_swift_code} onChange={e => { setAgentBankSwiftCode(e.target.value); }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_txt_agent_bank_swift_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">GST NO.</Form.Label>
                    </div>

                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="txt_agent_bank_gst_no" value={txt_agent_bank_gst_no} onChange={e => { setAgentBankGstNo(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_txt_agent_bank_gst_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Currency Type</Form.Label>
                    </div>

                    <div className='col'>
                      <select size="sm" id="cmb_currency_type" className="form-select form-select-sm" value={cmb_currency_type} onChange={(e) => setCurrencyType(e.target.value)} optional='optional'>
                        {currencyTypeList?.map(option => (
                          <option value={option.field_name}>{option.field_name}</option>
                        ))}

                      </select>
                      <MDTypography variant="button" id="error_cmb_currency_type" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}  >
                      </MDTypography>
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Is Active</Form.Label>
                    </div>

                    <div className="col">
                      <Form>
                        <div className="erp_form_radio">
                          <div className="fCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="Yes"
                              type="radio"
                              value="true" checked={txt_is_active === true} onClick={() => { setAgentBankIsActive(true); }}
                              name="isBankActive"
                              defaultChecked
                            />
                          </div>
                          <div className="sCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="No"
                              value="false" checked={txt_is_active === false} onClick={() => { setAgentBankIsActive(false); }}
                              type="radio"
                              name="isBankActive"
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div >
              <div className="text-center my-2">
                <MDButton type="button" onClick={FnAddAgentBank} className={`btn erp-gb-button ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular">Add Bank</MDButton>
              </div>
            </form >

            {renderAgentBanks}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="0" className="mt-3">
        <Accordion.Item eventKey="1">
          <Accordion.Header className="erp-form-label-md">Agent Contact Details</Accordion.Header>
          <Accordion.Body className="p-0">
            <div className="mt-10">
              <>
                {renderAgentContactTable}
              </>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className='text-center mb-5 mt-3'>
        <MDButton type="button" className="erp-gb-button" variant="button" fontWeight="regular"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/AgentListing/reg' : '/Masters/AgentListing';
            navigate(path);
          }} >Back</MDButton>
        <MDButton type="button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" onClick={FnAddAgentDetails}
          fontWeight="regular">{actionLabel}</MDButton>
        <MDButton className={`erp-gb-button ms-2 ${agent_id === 0 ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={() => goToNext(agent_id, txt_agent_vendor_code, txt_agent_Name, keyForViewUpdate)}>
          Next
        </MDButton>

      </div>

      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      {/* Add new Record Popup */}
      {showAddRecModal ? <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
        <Modal.Body className='erp_city_modal_body'>
          <div className='row'>
            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
          </div>
          {displayRecordComponent()}
        </Modal.Body>
      </Modal > : null}


    </>
  )
}
