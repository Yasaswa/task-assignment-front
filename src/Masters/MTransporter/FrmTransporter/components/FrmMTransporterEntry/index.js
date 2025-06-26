import MDBox from 'components/MDBox'
import React, { useMemo } from 'react'
import { useState, useEffect, useRef, forwardRef } from "react";
import { useLayoutEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// import files
import ComboBox from "Features/ComboBox";
import FrmCity from "FrmGeneric/MCity/FrmCity";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";

// React Bootstrap imports
import { Table } from "react-bootstrap"
import { MdDelete } from "react-icons/md";

// import React icons
import { IoAddCircleOutline } from "react-icons/io5"
import { IoRemoveCircleOutline } from "react-icons/io5"
import Accordion from "react-bootstrap/Accordion";

// React Bootstrap Imports
import Form from 'react-bootstrap/Form';
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import Tooltip from "@mui/material/Tooltip";
import { MdRefresh } from 'react-icons/md';
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"

import ConfigConstants from "assets/Constants/config-constant";
import FrmPaymentTermsEntry from 'Masters/MPaymentTerms/FrmPaymentTermsEntry';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Transporter({ goToNext, transporter_id }) {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  let expandedGlCodeCombo = false;

  var { state } = useLocation();
  const { transporterId = transporter_id, keyForViewUpdate, compType } = state || {}

  // For navigate
  const navigate = useNavigate();

  const combobox = useRef();
  const validationRef = useRef();
  const validateNumberDateInput = useRef();

  //hide and show password 
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordhideandshow = () => {
    setShowPassword(!showPassword);
  };

  const [TransporterName, setTransporterName] = useState('');
  const [ShortName, setShortName] = useState('');
  const [TransporterVendorCode, setTransporterVendorCode] = useState('');
  const [TransporterAddress1, setTransporterAddress1] = useState('');
  const [TransporterAddress2, setTransporterAddress2] = useState('');
  const [city, setCity] = useState('');
  const [Pincode, setPincode] = useState('');
  const [states, setState] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [State_name, setStateName] = useState('');
  const [city_name, setCityName] = useState('');
  const [TransportarRegionId, setTransportarRegionId] = useState('NA');
  const [PhoneNo, setPhoneNo] = useState('');
  const [TransporterCellNo, setTransporterCellNo] = useState('');
  const [EmailId, setEmailId] = useState('');
  const [Website, setWebsite] = useState('');
  const [GSTNO, setGSTNO] = useState('');
  const [gstDivision, setGstDivision] = useState('');
  const [GSTDivisionRange, setGSTDivisionRange] = useState('');
  const [PanNo, setPanNo] = useState('');
  const [UdyogAdharNo, setUdyogAdharNo] = useState('');
  const [ServiceTaxNo, setServiceTaxNo] = useState('');
  const [TransportarPaymentTerm, setTransportarPaymentTerm] = useState('');
  const [TransportarGLCodesId, setTransportarGLCodesId] = useState('');
  const [AccountsId, setAccountsId] = useState('');
  const [TransporterBlockedRemark, setTransporterBlockedRemark] = useState('');
  const [PaymentBlockedRemark, setPaymentBlockedRemark] = useState('');
  const [TransporterRating, setTransporterRating] = useState('');
  const [TallyId, setTallyId] = useState('');
  const [txt_username, setUserName] = useState('');
  const [txt_password, setPassword] = useState('');
  const [is_activeTransporter, setIsActiveTransporter] = useState(true);
  const [is_transporterBlock, setIsTransporterBlock] = useState(false);
  const [is_transporterPaymentBlock, setIsTransporterPaymentBlock] = useState(false);

  // select box field
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [GLCodes, setGLCodes] = useState([]);
  const [GLCodesCheckboxes, setGLCodesCheckboxes] = useState();
  const [totalSelectedGLCodeCheckboxes, setTotalSelectedGLCodeCheckboxes] = useState(0);
  const [PaymentTermId, setPaymentTermId] = useState([]);
  const [TransporterRegion, setTransporterRegion] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);

  const [isBlockedActive, setisBlockedActive] = useState('0');
  const [isPaymentBlockedActive, setisPaymentBlockedActive] = useState('0');

  //Transport Contact entry
  //Option box 
  const [rowCount, setRowCount] = useState(1)
  const [transporterContactData, settransporterContactData] = useState([])
  const [designationOptions, setDesignationOptions] = useState([]);

  //Bank Entry
  // ADD Bank Feilds
  const [accountType, setAccountType] = useState([]);
  const [bankName, setBankName] = useState([]);
  const [bankBranchName, setBankBranchName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankIfscNo, setBankIfscNo] = useState('');
  const [bankSwiftCode, setBankSwiftCode] = useState('');
  const [bankGstNo, setBankGStNo] = useState('');
  const [is_bankActive, setIsBankActive] = useState(true);

  //table Feilds
  const [dataBank, setBankData] = useState([]);

  // Option Box
  const [currencyTypeOption, setCurrencyTypeOption] = useState([]);

  const [bankAccountTypeOption, setBankAccountTypeOption] = useState([]);
  const [bankNameOptionList, setBankNameOptionList] = useState([]);


  const [disabled, setDisabled] = useState(false)

  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const usernameRef = useRef();

  const handleCloseErrModal = () => {
    if (errMsg === "User Name is already exist!") {
      setShowErrorMsgModal(false);
      usernameRef.current.focus();
    } else {
      setShowErrorMsgModal(false);
    }
  }

  // Success Msg HANDLING 
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [modalHeaderName, setHeaderName] = useState('')

  const transporterContactEmptyObj = {
    company_id: parseInt(COMPANY_ID),
    company_branch_id: parseInt(COMPANY_BRANCH_ID),
    transporter_id: 0,
    transporter_contact_person: '',
    transporter_designation: '',
    transporter_contact_no: '',
    transporter_email_id: '',
    transporter_alternate_contact: '',
    transporter_alternate_EmailId: ''
  }

  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    // 
    switch (modalHeaderName) {

      case 'Payment Terms':
        combobox.current.fillComboBox("PaymentTermDays").then((paymentTermDays) => {
          setPaymentTermId(paymentTermDays)
        })

        break;

      case 'City':
        if (district !== '' && district !== undefined) {
          resetGlobalQuery();
          globalQuery.columns = ["field_id", "field_name", 'city_pincode'];
          globalQuery.table = "cmv_city";
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: district });
          combobox.current.removeCatcheFillCombo(globalQuery).then((propertyList2) => {
            setCityOptions(propertyList2)
          })

        }
        setShowAddRecModal(false);
        break;
      default:
        break;
    }
    setShowAddRecModal(false);
    sessionStorage.removeItem('dataAddedByCombo')
    setTimeout(() => { $(".erp_top_Form").css({ "padding-top": "0px" }); }, 200)
  }

  const displayRecordComponent = () => {
    switch (modalHeaderName) {
      case 'Payment Terms':
        return <FrmPaymentTermsEntry btn_disabled={true} />;

      case 'City':
        return <FrmCity btn_disabled={true} />;

      default:
        return null;
    }
  }

  useEffect(() => {
    const loadDataOnload = async () => {
      await FillComobos();
      await FnFetchCountryCode();
      if (transporterId !== 0) {
        await FnCheckUpdateResponce();
      } else {
        await generateVendorCode();
      }
    }
    loadDataOnload()
  }, []);


  const FnCheckUpdateResponce = async () => {
    debugger
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/transporter/FnShowAllRecords/${transporterId}/${COMPANY_ID}`);
      const apiCallResponce = await apiCall.json();
      let transporterRecords = apiCallResponce.transporterRecords;
      let transporterContactRecords = apiCallResponce.transporterContactRecords;
      let transporterBankRecords = apiCallResponce.transporterBankRecords;


      //Transporter Records
      setTransporterName(transporterRecords.transporter_name)
      sessionStorage.setItem("transporterName", transporterRecords.transporter_name);
      setCountry(transporterRecords.transporter_country_id)
      await addRecordInProperty('Country')
      setState(transporterRecords.transporter_state_id)
      await addRecordInProperty('State')
      setDistrict(transporterRecords.transporter_district_id)
      await addRecordInProperty('District')
      setCity(transporterRecords.transporter_city_id)
      setShortName(transporterRecords.transporter_short_name)
      setTransporterVendorCode(transporterRecords.transporter_vendor_code)
      setTransporterAddress1(transporterRecords.transporter_address1)
      setTransporterAddress2(transporterRecords.transporter_address2)
      setPincode(transporterRecords.transporter_pincode)
      setStateName(transporterRecords.State_name);
      setCityName(transporterRecords.city_name);
      setPhoneNo(transporterRecords.transporter_phone_no)
      setTransporterCellNo(transporterRecords.transporter_cell_no)
      setEmailId(transporterRecords.transporter_EmailId)
      setWebsite(transporterRecords.transporter_website)
      setGSTNO(transporterRecords.transporter_gst_no)
      setGstDivision(transporterRecords.transporter_gst_division)
      setGSTDivisionRange(transporterRecords.transporter_gst_range)
      setPanNo(transporterRecords.transporter_pan_no)
      setUdyogAdharNo(transporterRecords.transporter_udyog_adhar_no)
      setServiceTaxNo(transporterRecords.transporter_service_tax_no)
      setAccountsId(transporterRecords.transporter_accounts_id)
      setTransporterBlockedRemark(transporterRecords.transporter_blocked_remark)
      setPaymentBlockedRemark(transporterRecords.transporter_payment_blocked_remark)
      setTransporterRating(transporterRecords.transporter_ratings)
      setTallyId(transporterRecords.transporter_tally_id)
      setTransportarGLCodesId(transporterRecords.transporter_gl_codes)
      // Set the total selected GL-Codes Count.
      if (transporterRecords.transporter_gl_codes !== '') {
        setTotalSelectedGLCodeCheckboxes(transporterRecords.transporter_gl_codes.split(':').length);
      }
      setTransportarPaymentTerm(transporterRecords.transporter_payment_term_id)
      setTransportarRegionId(transporterRecords.transporter_region)
      setUserName(transporterRecords.username);
      setPassword(transporterRecords.password);
      setIsActiveTransporter(transporterRecords.is_active)
      setIsTransporterBlock(transporterRecords.transporter_blocked)
      setIsTransporterPaymentBlock(transporterRecords.transporter_payment_blocked)


      //Contact Records
      if (transporterContactRecords.length !== 0) {
        settransporterContactData(transporterContactRecords)
      } else {
        const getExistingTransporterContactData = [...transporterContactData]
        getExistingTransporterContactData.push(contactBlankObject)
        settransporterContactData(getExistingTransporterContactData)
      }

      switch (transporterRecords.is_active) {
        case true:
          document.querySelector('input[name="isTransporterActive"][value="true"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="isTransporterActive"][value="false"]').checked = true;
          break;
        default: break;
      }

      //Bank Records 
      setBankData(transporterBankRecords);

      switch (keyForViewUpdate) {
        case 'update':
          $("input[type=radio]").attr('disabled', false);
          $("#transporterName").attr('disabled', true)
          $("#transporterShortName").attr('disabled', true)
          break;
        case 'view':
          $("input[type=radio]").attr('disabled', true);
          $("#saveBtn").attr('disabled', true)
          // $("#txt_password").hide();
          addReadOnlyAttr();
          break;
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const FillComobos = async () => {
    // 
    try {
      var controlName = ["cmv_country", "fmv_general_ledger", "PaymentTermDays", "Regions"]
      if (combobox.current) {
        combobox.current.fillMasterData("cmv_country", "", "").then((cmv_countryList) => {
          setCountryOptions(cmv_countryList);
          // Set the default Country India.
          const defaultCountry = cmv_countryList.find(country => country.field_name === "India");
          setCountry(defaultCountry.field_id);

          combobox.current.fillMasterData("cmv_state", "country_id", defaultCountry.field_id).then((getStateList) => {
            setStateOptions(getStateList);
            // Set the default State Maharashtra.
            const defaultState = getStateList.find(state => state.field_name === "Maharashtra");
            setState(defaultState.field_id);

            // Load the district options.
            combobox.current.fillMasterData("cmv_district", "state_id", defaultState.field_id).then((getDistrictList) => {
              setDistrictOptions(getDistrictList);
            })
          })
        })

        combobox.current.fillMasterData(controlName[1], "is_delete", "0").then((fmv_general_ledgerList) => {
          setGLCodes(fmv_general_ledgerList)
        })
        combobox.current.fillComboBox(controlName[2]).then((paymentTermDays) => {
          setPaymentTermId(paymentTermDays)
        })
        combobox.current.fillComboBox(controlName[3]).then((regionList) => {
          setTransporterRegion(regionList)
        })
      }

      //Bank starts Here
      const controlNameForBank = ["BankAccountsType", "fmv_general_ledger", "cmv_employee_summary", "fmv_currency", "cmv_banks_List"];
      if (combobox.current) {
        combobox.current.fillComboBox(controlNameForBank[0]).then((propertyList1) => {
          setBankAccountTypeOption(propertyList1)
        })

        combobox.current.fillMasterData(controlNameForBank[3], "", "").then((vCurrencyType) => {
          setCurrencyTypeOption(vCurrencyType)
        })

        combobox.current.fillMasterData(controlNameForBank[4], "", "").then((propertyList3) => {
          setBankNameOptionList(propertyList3)
        })
      }

      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      console.log("apiCallCountryCodeList: ", respCountryCode)
      setCountryCodeOptions(respCountryCode)
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const addRecordInProperty = async (key) => {
    // 
    switch (key) {
      case 'Country':
        const getCountryId = document.getElementById('countryId').value;
        setCountry(getCountryId)
        if (getCountryId !== '') {
          $('#error_countryId').hide();
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name']
          globalQuery.table = "cmv_state"
          globalQuery.conditions.push({ field: "country_id", operator: "=", value: getCountryId });
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      //    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          const stateList = await combobox.current.fillFiltersCombo(globalQuery)
          setStateOptions(stateList)
          setState('');
          setDistrictOptions([])
          setCityOptions([])
          setDistrict('')
          setCityName('')
        } else {
          setStateOptions([]);
          setDistrictOptions([])
          setCityOptions([]);
          setState('');
          setDistrict('');
          setCity('');
        }
        break;
      case 'State':
        const getStateId = document.getElementById('stateId').value;
        setState(getStateId)
        if (getStateId !== '') {
          $('#error_stateId').hide();
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name']
          globalQuery.table = "cmv_district"
          globalQuery.conditions.push({ field: "state_id", operator: "=", value: getStateId });
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
     //     globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });

          const districtList = await combobox.current.fillFiltersCombo(globalQuery)
          setDistrictOptions(districtList)
          setDistrict('')
          setCityName('')
          setCityOptions([])
        } else {
          setDistrictOptions([])
          setCityOptions([]);
          setDistrict('');
          setCityName('')
        }
        break;
      case 'District':
        const getDistrictId = document.getElementById('districtId').value;
        setDistrict(getDistrictId)
        if (getDistrictId === "") {
          setCityOptions([])
          setCityName('')
        } else {
          $('#error_districtId').hide();
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: getDistrictId });
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
          // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          const cityList = await combobox.current.fillFiltersCombo(globalQuery)

          setCityOptions([])
          setCityOptions(cityList)
          setCityName('')
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
        } else {
          setCity(propertyValCity)
          const selectedCity = cityOptions.find(city => city.field_id === parseInt(propertyValCity));
          setPincode(selectedCity.city_pincode);
          $('#error_cityId').hide();
        }
        break;
      case 'fmv_general_ledger':
        const generalLeadgers = document.getElementById('transporterGLCodesId').value;
        setTransportarGLCodesId(generalLeadgers)
        $('#error_transporterGLCodesId').hide();
        if (generalLeadgers === '0') {
          const newTab = window.open('/Masters/MFMGeneralLedgerEntry', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }
        break;
      case 'PaymentTermDays':
        const paymentTermDays = document.getElementById('transporterPaymentTermID').value;
        setTransportarPaymentTerm(paymentTermDays)
        $('#error_transporterPaymentTermID').hide();

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
        const Region = document.getElementById('transporterRegionID').value;
        setTransportarRegionId(Region)
        $('#error_transporterRegionID').hide();
        break
    }
  }

  const FnAddTransporter = async () => {
    debugger
    try {

      let checkIsValidate = false;
      checkIsValidate = await validate();
      if (!checkIsValidate) { return false }
      if (checkIsValidate == true) {
        var jsonData = {
          'TransporterData': {}, 'BankData': [], 'ContactData': [], 'commonIds': { 'company_id': COMPANY_ID, 'transporter_id': transporterId }
        }
        const transporterData = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          transporter_id: transporterId,
          created_by: UserName,
          modified_by: transporterId === 0 ? null : UserName,
          transporter_name: TransporterName,
          transporter_short_name: ShortName,
          transporter_vendor_code: TransporterVendorCode,
          transporter_address1: TransporterAddress1,
          transporter_address2: TransporterAddress2,
          transporter_city_id: city,
          transporter_pincode: Pincode,
          transporter_state_id: states,
          transporter_district_id: district,
          transporter_country_id: country,
          transporter_region: TransportarRegionId,
          transporter_phone_no: PhoneNo,
          transporter_cell_no: TransporterCellNo,
          transporter_EmailId: EmailId,
          transporter_website: Website.trim() === '' ? 'NA' : Website.trim(),
          transporter_gst_no: GSTNO,
          transporter_gst_division: gstDivision,
          transporter_gst_range: GSTDivisionRange,
          transporter_pan_no: PanNo,
          transporter_udyog_adhar_no: UdyogAdharNo,
          transporter_service_tax_no: ServiceTaxNo,
          transporter_payment_term_id: TransportarPaymentTerm === '' ? 152 : TransportarPaymentTerm,
          transporter_gl_codes: TransportarGLCodesId,
          transporter_accounts_id: AccountsId,
          transporter_blocked_remark: TransporterBlockedRemark,
          transporter_payment_blocked_remark: PaymentBlockedRemark,
          transporter_ratings: TransporterRating,
          transporter_tally_id: TallyId,
          transporter_payment_blocked: is_transporterPaymentBlock,
          transporter_blocked: is_transporterBlock,
          username: txt_username,
          password: txt_password,
          is_active: is_activeTransporter,
        };
        jsonData.TransporterData = transporterData;

        //For Bank Information
        jsonData.BankData = dataBank

        //Contact Data
        jsonData.ContactData = transporterContactData


        const formData = new FormData();
        formData.append(`TransporterData`, JSON.stringify(jsonData))
        const requestOptions = {
          method: 'POST',
          body: formData
        };

        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/transporter/FnAddUpdateRecord`, requestOptions)
        const responce = await apiCall.json();
        console.log("response error: ", responce.data);
        if (responce.success === 0) {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)
        } else {
          const evitCache = combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message);
          setShowSuccessMsgModal(true);
        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  };


  // validation field
  const validate = async () => {
    const checkIsValidate = await validationRef.current.validateForm('tranporter_form');
    if (!checkIsValidate) {
      return false;
    }
    let transporterContactValid = true;
    const tableRows = document.querySelectorAll('#transporterContactTbl tbody tr');
    tableRows.forEach(row => {
      const agentContactName = row.querySelector('input[id^="transporter_contact_person_"]').value;
      if (agentContactName === '') {
        row.querySelector('input[id^="transporter_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
        row.querySelector('input[id^="transporter_contact_person_"]').focus();
        transporterContactValid = false;
        return;
      } else {
        delete row.querySelector('input[id^="transporter_contact_person_"]').parentElement.dataset.tip;
      }

      const transporterContactNo = row.querySelector('input[id^="transporter_contact_no_"]').value;
      if (transporterContactNo === '') {
        row.querySelector('input[id^="transporter_contact_no_"]').parentElement.dataset.tip = 'Please fill this Field...!';
        row.querySelector('input[id^="transporter_contact_no_"]').focus();
        transporterContactValid = false;
        return;
      } else if (transporterContactNo !== '') {
        if (transporterContactNo.length < 10) {
          row.querySelector('input[id^="transporter_contact_no_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
          row.querySelector('input[id^="transporter_contact_no_"]').focus();
          return transporterContactValid = false;
        }
      }
      const AlternateContactNo = row.querySelector('input[id^="transporter_alternate_contact_"]').value;
      if (AlternateContactNo !== "") {
        if (AlternateContactNo.length < 10) {
          row.querySelector('input[id^="transporter_alternate_contact_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
          row.querySelector('input[id^="transporter_alternate_contact_"]').focus();
          return transporterContactValid = false;
        }
      }

      const transporterEmailId = row.querySelector('input[id^="transporter_email_id_"]').value;
      if (transporterEmailId === '') {
        row.querySelector('input[id^="transporter_email_id_"]').parentElement.dataset.tip = 'Please fill this Field...!';
        row.querySelector('input[id^="transporter_email_id_"]').focus();
        return transporterContactValid = false;
      } else if (transporterEmailId !== '') {
        if (!validateNumberDateInput.current.validateEmail(transporterEmailId)) {
          row.querySelector('input[id^="transporter_email_id_"]').parentElement.dataset.tip = 'Please enter a valid email ...!';
          row.querySelector('input[id^="transporter_email_id_"]').focus();
          return transporterContactValid = false;
        }
      }

      const transporteralternateEmailId = row.querySelector('input[id^="transporter_alternate_EmailId_"]').value;
      if (transporteralternateEmailId !== '') {
        if (!validateNumberDateInput.current.validateEmail(transporteralternateEmailId)) {
          row.querySelector('input[id^="transporter_alternate_EmailId_"]').parentElement.dataset.tip = 'Please enter a valid email ...!';
          row.querySelector('input[id^="transporter_alternate_EmailId_"]').focus();
          return transporterContactValid = false;
        }
      }

    })

    // if (transporterContactData.length === 1 && transporterContactData[0].transporter_contact_person === '') {
    //   transporterContactValid = true;
    // }
    return transporterContactValid;
  }

  const validateBankForm = () => {
    return validationRef.current.validateForm('bankform');
  }
  const validateFields = (event) => {
    if (event.target.type === 'email' && !validateNumberDateInput.current.validateEmail(event.target.value) && event.target.value !== '') {
      $(`#error_${event.target.id}`).text('Please enter valid email!...')
      $(`#error_${event.target.id}`).show()
    } else {
      $(`#error_${event.target.id}`).hide()
    }
    return validationRef.current.validateFieldsOnChange('tranporter_form');
  }
  const validateBankFields = () => {
    return validationRef.current.validateFieldsOnChange('bankform');
  }
  const addReadOnlyAttr = () => {
    return validationRef.current.readOnly('tranporter_form');
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

  const validateNo = (noKey) => {
    const regexNo = /^[0-9\b]+$/;
    const value = noKey.target.value
    const telephoneRegex = /^[0-9+\(\)#\.\s\/ext-]+$/;
    switch (noKey.target.id) {
      case 'pinCode':
        if (regexNo.test(value) || value === '') {
          setPincode(value)
        }
        break;
      case 'phoneNo':
        if (telephoneRegex.test(value) || value === '') {
          setPhoneNo(value)
        }
        break;
      case 'cellNo':
        if (regexNo.test(value) || value === '') {
          setTransporterCellNo(value)
          // setUserName(value);
        }
        break;
    }
  }

  const FnRefreshbtn = async (key) => {
    switch (key) {
      case 'GLCodes':
        combobox.current.fillMasterData("fmv_general_ledger", "is_delete", "0").then((fmv_general_ledgerList) => {
          setGLCodes(fmv_general_ledgerList)
        })

        break;
      default:
        break;
    }
  }

  //------------------------------------Transporter Contact Entry starts here-------------------//
  const fnsetRowCountAndAddRow = () => {
    debugger;
    const lastRowIndex = transporterContactData.length - 1;
    const lastRowContactPerson = transporterContactData[lastRowIndex].transporter_contact_person;
    if (lastRowContactPerson !== '') {
      setRowCount(rowCount + 1);
    } else {
      const tableRows = document.querySelectorAll('#transporterContactTbl tbody tr');
      tableRows.forEach(row => {
        const transporterContactName = row.querySelector('input[id^="transporter_contact_person_"]').value;
        if (transporterContactName === '') {
          row.querySelector('input[id^="transporter_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
          row.querySelector('input[id^="transporter_contact_person_"]').focus();
          return;
        } else {
          delete row.querySelector('input[id^="transporter_contact_person_"]').parentElement.dataset.tip;
        }
      }
      )
    }
  };





  const FnFetchCountryCode = async () => {
    try {
      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      setCountryCodeOptions(respCountryCode)
      localStorage.setItem("countryCodes", JSON.stringify(respCountryCode))

      var masterList = await combobox.current.fillMasterData("cmv_designation", "", "")
      setDesignationOptions(masterList)
      localStorage.setItem("designations", JSON.stringify(masterList))
    } catch (error) {
      console.log(error)
      navigate('/Error')
    }
  }

  const FnUpdateTransporterContactTblRows = (rowData, event) => {

    let eventId = document.getElementById(event.target.id);
    let clickedColName = event.target.getAttribute('Headers');
    let enteredValue = event.target.value;

    switch (clickedColName) {
      case 'transporter_contact_person':
      case 'transporter_designation':

        rowData[clickedColName] = enteredValue;
        if (enteredValue !== '')
          delete document.querySelector('input[id^="transporter_contact_person_"]').parentElement.dataset.tip;
        break;
      case 'transporter_contact_no':
      case 'transporter_alternate_contact':
        rowData[clickedColName] = enteredValue;
        if (enteredValue.length >= 10) {
          delete eventId.parentElement.dataset.tip;
        }
        break;

      case 'transporter_email_id':
      case 'transporter_alternate_EmailId':
        rowData[clickedColName] = enteredValue;
        let transporterMailInp = document.getElementById(event.target.id);
        if (!validateNumberDateInput.current.validateEmail(enteredValue)) {
          transporterMailInp.parentElement.dataset.tip = 'Please enter valid Mail...!';
        } else {
          delete transporterMailInp.parentElement.dataset.tip;
        }
        if (event._reactName === 'onBlur' && enteredValue === '') {
          delete eventId.parentElement.dataset.tip;
        }
        break;
    }

    const transporterContactDetails = [...transporterContactData]
    const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
    transporterContactDetails[arrayIndex] = rowData
    settransporterContactData(transporterContactDetails);
  }

  const contactBlankObject = {
    company_id: COMPANY_ID,
    company_branch_id: COMPANY_BRANCH_ID,
    transporter_contact_id: 0,
    transporter_id: 0,
    transporter_contact_person: '',
    transporter_designation: '',
    transporter_contact_no: '',
    transporter_email_id: '',
    transporter_alternate_contact: '',
    transporter_alternate_EmailId: '',
    created_by: UserName,
    deleted_by: transporterId === 0 ? null : UserName,
  }

  useLayoutEffect(() => {
    const getExistingTransporterContactData = [...transporterContactData]
    getExistingTransporterContactData.push(contactBlankObject)
    settransporterContactData(getExistingTransporterContactData)
  }, [rowCount])

  const renderTransporterContactTable = useMemo(() => {

    return <Table id='transporterContactTbl' className={`erp_table `} responsive bordered striped>
      <thead className="erp_table_head">
        <tr>
          <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>Action</th>
          <th className="erp_table_th">Contact Person</th>
          <th className="erp_table_th">Designation	</th>
          <th className="erp_table_th">Contact no</th>
          <th className="erp_table_th">Alternate Contact</th>
          <th className="erp_table_th">Email</th>
          <th className="erp_table_th">Alternate Email</th>
        </tr>
      </thead>
      <tbody>
        {transporterContactData.map((item, index) =>
          <tr rowindex={index} className="sticky-column">
            <td className={`erp_table_td ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
              <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
              {/* <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} />   */}
              <IoAddCircleOutline className='erp_trAdd_icon' onClick={fnsetRowCountAndAddRow} />

              {/* {
                index === 0 ? <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> : null
              } */}
            </td>
            <td className='erp_table_td'>
              <input type="text"
                className="erp_input_field mb-0 text-start"
                id={`transporter_contact_person_${index}`}
                value={item.transporter_contact_person}
                onChange={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                Headers='transporter_contact_person' disabled={keyForViewUpdate === 'view'}
              />
            </td>

            <td className='erp_table_td'>
              <input type="text"
                className="erp_input_field mb-0 text-start"
                id={`transporter_designation_${index}`}
                value={item.transporter_designation}
                onChange={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                Headers='transporter_designation' disabled={keyForViewUpdate === 'view'}
              />
            </td>

            <td className='erp_table_td'>
              <input type="text"
                id={`transporter_contact_no_${index}`}
                className="erp_input_field mb-0 text-start"
                value={item.transporter_contact_no}
                onChange={(e) => {
                  if (validateNumberDateInput.current.isInteger(e.target.value)) {
                    FnUpdateTransporterContactTblRows(item, e);
                  }
                }}
                Headers='transporter_contact_no'
                maxLength="10" disabled={keyForViewUpdate === 'view'} />
            </td>


            <td className='erp_table_td'>
              <input type="text"
                id={`transporter_alternate_contact_${index}`}
                className="erp_input_field mb-0 text-start"
                value={item.transporter_alternate_contact}
                onChange={(e) => {
                  if (validateNumberDateInput.current.isInteger(e.target.value)) {
                    FnUpdateTransporterContactTblRows(item, e);
                  }
                }}
                Headers='transporter_alternate_contact'
                maxLength="10"
                disabled={keyForViewUpdate === 'view'} />
            </td>

            <td className='erp_table_td'>
              <input type="email"
                id={`transporter_email_id_${index}`}
                className="erp_input_field mb-0 text-start"
                value={item.transporter_email_id}
                onChange={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                onBlur={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                disabled={keyForViewUpdate === 'view'} Headers='transporter_email_id' />
            </td>

            <td className='erp_table_td'>
              <input type="email"
                id={`transporter_alternate_EmailId_${index}`}
                className="erp_input_field mb-0 text-start"
                value={item.transporter_alternate_EmailId}
                onChange={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                onBlur={(e) => { FnUpdateTransporterContactTblRows(item, e); }}
                disabled={keyForViewUpdate === 'view'} Headers='transporter_alternate_EmailId' />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  }, [transporterContactData])

  const removeFirstRow = (indexToRemove) => {
    if (indexToRemove !== 0) {
      const updatedTransporterContactData = transporterContactData.filter((item, index) => index !== indexToRemove);
      settransporterContactData(updatedTransporterContactData)
    } else {
      const updatedTransporterContactData = [...transporterContactData];  // Create a copy of the array
      updatedTransporterContactData[0] = { ...contactBlankObject }; // Set values of 0th index to the contactBlankObject
      settransporterContactData(updatedTransporterContactData);
    }
  }


  //-----------------------------------------Bank Entry Starts Here-------------------------------------------//
  const FnAddBank = async () => {

    const checkIsBankValidate = await validateBankForm();
    if (checkIsBankValidate == true) {
      // $('#error_bankNameId').text('This Bank already exits!').hide();
      const contactData = {
        company_id: COMPANY_ID,
        company_branch_id: COMPANY_BRANCH_ID,
        bank_id: $('#bankNameId').val(),
        transporter_bank_account_type: $('#accountTypeId').val(),
        transporter_bank_name: $('#bankNameId option:selected').text(),
        transporter_bank_branch_name: bankBranchName,
        transporter_bank_account_no: $('#bankAccountNo').val(),
        transporter_bank_ifsc_code: bankIfscNo,
        transporter_bank_swift_code: bankSwiftCode,
        transporter_bank_gst_no: bankGstNo,
        currency_type: $('#currencyType').val(),
        is_active: is_bankActive,
        created_by: UserName,
        // modified_by: transporterId === 0 ? null : UserName,
      }

      const isDuplicate = dataBank.some((item) => item.transporter_bank_name === contactData.transporter_bank_name && item.transporter_bank_account_type === contactData.transporter_bank_account_type);
      if (!isDuplicate) {
        $('#accountTypeId').val('')
        $('#bankBranchName').val('');
        $('#bankNameId').val('');
        $('#bankAccountNo').val('');
        $('#bankIfscNo').val('');
        $('#bankSwiftCode').val('');
        $('#bankGstNo').val('');
        $('#currencyType').val('');
        setBankData((prevArray) => [...prevArray, contactData]);
      } else {
        $('#error_bankNameId').text('This Bank already exits!').show();
        // setInterval(function () {
        //   $('#error_bankNameId').text('This Bank already exits!').hide();
        // }, 3000);
      }
    }
  }

  const renderTransporterBanks = useMemo(() => {

    return <>
      <hr className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} />
      {dataBank.length !== 0 ?
        <Table className="erp_table" responsive bordered striped>
          <thead className="erp_table_head">
            <tr>

              <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>Action</th>
              <th className="erp_table_th" style={{ width: '40px' }}>Sr. No</th>
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
            {dataBank?.map((bankItem, index) =>
              <tr rowindex={index}>
                <td className={`erp_table_td ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> <MdDelete className={`erp-delete-btn ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => deleteBank(index)} /></td>
                <td className="erp_table_td">{index + 1}</td>
                <td className="erp_table_td" >{bankItem.transporter_bank_account_type}</td>
                <td className="erp_table_td" >{bankItem.transporter_bank_name}</td>
                <td className="erp_table_td" >{bankItem.transporter_bank_branch_name}</td>
                <td className="erp_table_td" >{bankItem.transporter_bank_account_no}</td>
                <td className="erp_table_td" >{bankItem.transporter_bank_ifsc_code}</td>
                <td className="erp_table_td">{bankItem.transporter_bank_swift_code}</td>
                <td className="erp_table_td">{bankItem.transporter_bank_gst_no}</td>
                <td className="erp_table_td">{bankItem.currency_type}</td>
              </tr>
            )
            }
          </tbody>
        </Table> : null}</>

  }, [dataBank])

  const deleteBank = (indexToRemove) => {
    const updatedDataBank = dataBank.filter((item, index) => index !== indexToRemove);
    setBankData(updatedDataBank);
  }

  //------------------- Agent vendor-code Functionality  --------------------------------------- //
  const generateVendorCode = async () => {
    const data = {
      tblName: 'cm_transporter', fieldName: 'transporter_vendor_code', Length: 5, company_id: COMPANY_ID,
    };
    const formData = new FormData();
    formData.append(`data`, JSON.stringify(data))
    const requestOptions = { method: 'POST', body: formData };
    try {
      const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/agent/FnGenerateCode/${COMPANY_ID}`, requestOptions)
      const resp = await fetchResponse.text();
      console.log("GenerateTAuto Api: ", resp)
      if (resp) {
        setTransporterVendorCode('T-' + resp);
        setUserName('T-' + resp);
        return 'T-' + resp;
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
    if (GLCodes.length > 0) {
      await FnCreateGLCodesChks();

      // Also check the already checked checkboxes.
      if (TransportarGLCodesId !== '') {
        const glCodeIds = TransportarGLCodesId.split(':');
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
    if (GLCodes.length !== 0) {
      let checkboxes = GLCodes.map((item, index) => {
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
    setTransportarGLCodesId(selectedGLCodes.replace(/:$/, ''));
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
    <MDBox>
      <ComboBox ref={combobox} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <FrmValidations ref={validationRef} />
      <form id='tranporter_form'>
        <div className='row erp_transporter_div' >
          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Name<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterName' className="erp_input_field" value={TransporterName} onChange={e => { setTransporterName(e.target.value); validateFields(e) }} maxlength="255" />
                <MDTypography variant="button" id="error_transporterName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Short Name </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterShortName' className="erp_input_field" value={ShortName} onChange={e => { setShortName(e.target.value.toUpperCase()); validateFields(e) }} maxlength="5" optional="optional" />
                <MDTypography variant="button" id="error_transporterShortName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Vendor Code</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterVendorCode' className="erp_input_field optional" value={TransporterVendorCode} onChange={e => { setTransporterVendorCode(e.target.value); validateFields(e) }} maxlength="255" optional="optional" />
                <MDTypography variant="button" id="error_transporterVendorCode" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Address 1<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} className="erp_txt_area" id="transporterAdd1" value={TransporterAddress1} onChange={e => { setTransporterAddress1(e.target.value); validateFields(e) }} maxlength="500" />
                <MDTypography variant="button" id="error_transporterAdd1" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Address 2</Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} className="erp_txt_area optional" id="transporterAdd2" value={TransporterAddress2} onChange={e => { setTransporterAddress2(e.target.value); validateFields(e) }} maxlength="500" optional="optional" />
                <MDTypography variant="button" id="error_transporterAdd2" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Pincode<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" value={Pincode} onChange={e => { validateNo(e); validateFields(e) }} id="pinCode" maxlength="6" disabled />
                <MDTypography variant="button" id="error_pinCode" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Country<span className="required">*</span> </Form.Label>
              </div>
              <div className='col'>
                <Form.Select size="sm" id="countryId" className='erp_input_field' value={country} onChange={() => addRecordInProperty("Country")}>
                  <option value="">Select</option>
                  {countryOptions?.map(country => (
                    <option value={country.field_id}>{country.field_name}</option>
                  ))}
                </Form.Select>
                <MDTypography variant="button" id="error_countryId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">State<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Select size="sm" id="stateId" className='erp_input_field' value={states} onChange={() => addRecordInProperty("State")} >
                  <option value="">Select</option>
                  {stateOptions?.map(state => (
                    <option value={state.field_id}>{state.field_name}</option>
                  ))}
                </Form.Select>
                <MDTypography variant="button" id="error_stateId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">District<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Select size="sm" id="districtId" className='erp_input_field' value={district} onChange={() => addRecordInProperty("District")}>
                  <option value="">Select</option>
                  {districtOptions?.map(district => (
                    <option value={district.field_id}>{district.field_name}</option>
                  ))}
                </Form.Select>
                <MDTypography variant="button" id="error_districtId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>

            </div>
            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">City<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select size="sm" id="cityId" value={city} className="form-select form-select-sm erp_input_field" onChange={() => addRecordInProperty("City")}>
                  <option value="">Select</option>
                  <option value="0">Add New Record +</option>
                  {cityOptions?.map(city => (
                    <option value={city.field_id}>{city.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cityId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Region<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Select size='sm' id='transporterRegionID' className='erp_input_field' value={TransportarRegionId} onChange={() => addRecordInProperty('Regions')} maxlength="255">
                  {TransporterRegion?.map(TransporterRegion => (
                    <option value={TransporterRegion.field_name}>{TransporterRegion.field_name}</option>
                  ))}
                </Form.Select>
                <MDTypography variant="button" id="error_transporterRegionID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

          </div>
          {/* second column */}
          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Phone NO.</Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='phoneCntryId' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="phoneNo" value={PhoneNo}
                    onChange={e => { validateNo(e); validateFields(e) }} optional='optional' maxLength="20" />
                </span>
                <MDTypography variant="button" id="error_phoneNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Cell NO.<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='cellCntryId' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="cellNo" value={TransporterCellNo} onChange={e => { validateNo(e); validateFields(e) }} maxLength="10" />
                </span>
                <MDTypography variant="button" id="error_cellNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Email ID<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="email" id="email" className="erp_input_field" value={EmailId} onChange={e => { setEmailId(e.target.value); validateFields(e); }} maxLength="50" />
                <MDTypography variant="button" id="error_email" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Website</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterWebsite' className="erp_input_field optional" value={Website} onChange={e => { setWebsite(e.target.value); validateWebSite(e.target); }} maxLength="50" optional='optional' />
                <MDTypography variant="button" id="error_transporterWebsite" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">GST NO.<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="gstNo" value={GSTNO} onChange={e => { setGSTNO(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="15" />
                <MDTypography variant="button" id="error_gstNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">GST Division</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporteGstDivision' className="erp_input_field optional" value={gstDivision} onChange={e => { setGstDivision(e.target.value); validateFields(e) }} maxLength="500" optional='optional' />
                <MDTypography variant="button" id="error_transporteGstDivision" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">GST Range</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field optional" id="gstDivisionRange" value={GSTDivisionRange} onChange={e => { setGSTDivisionRange(e.target.value); validateFields(e) }} maxLength="500" optional='optional' />
                <MDTypography variant="button" id="error_gstDivisionRange" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">PAN NO.<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="panNo" value={PanNo} onChange={e => { setPanNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="10" />
                <MDTypography variant="button" id="error_panNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Udyog Aadhar NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterUdyogAdharNo' optional='optional' className="erp_input_field" value={UdyogAdharNo} onChange={e => { setUdyogAdharNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="12" disabled={keyForViewUpdate === 'view' ? true : false} />
                <MDTypography variant="button" id="error_transporterUdyogAdharNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Service Tax NO.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterServiceTaxNo' className="erp_input_field optional" value={ServiceTaxNo} onChange={e => { setServiceTaxNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional='optional' />
                <MDTypography variant="button" id="error_transporterServiceTaxNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Payment Term</Form.Label>
              </div>
              <div className='col'>
                <Form.Select id='transporterPaymentTermID' className='erp_input_field optional' value={TransportarPaymentTerm} optional='optional' onChange={() => addRecordInProperty('PaymentTermDays')}>
                  <option value='' >Select</option>
                  <option value="0">Add New Record+</option>
                  {PaymentTermId?.map(PaymentTermId => (
                    <option value={PaymentTermId.field_id}>{PaymentTermId.field_name}</option>))
                  }
                </Form.Select>
                <MDTypography variant="button" id="error_transporterPaymentTermID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
          </div>

          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">GL Codes</Form.Label>
              </div>
              <div className='col'>
                {/* <Form.Select id='transporterGLCodesId' className='erp_input_field optional' value={TransportarGLCodesId} optional='optional' onChange={() => addRecordInProperty('fmv_general_ledger')}>
                  <option value=''>Select</option>
                  <option value="0">Add New Record+</option>
                  {GLCodes?.map(GLCodes => (
                    <option value={GLCodes.field_name}>{GLCodes.field_name}</option>))
                  }
                </Form.Select> */}
                <div className="select-btn" onClick={() => { FnShowGlCodes() }} optional='optional'>
                  <span className="form-select form-select-sm" id="">
                    {totalSelectedGLCodeCheckboxes !== 0 ? totalSelectedGLCodeCheckboxes + ' Selected GL Codes ' : 'Select GL Code'}
                  </span>
                </div>
                <ul className="list-items" id="gl_code_ul">
                  {GLCodesCheckboxes}
                </ul>
                <MDTypography variant="button" id="error_transporterGLCodesId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
              {/* <div className="col-sm-1 ">
                <Tooltip title="Refresh" placement="top">
                  <MDTypography className="erp-view-btn" >
                    <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("GLCodes")} style={{ color: 'black' }} />
                  </MDTypography>
                </Tooltip>
              </div> */}
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Transporter A/C. ID</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterAccountsId' className="erp_input_field optional" value={AccountsId} onChange={e => { setAccountsId(e.target.value); validateFields(e) }} maxLength="255" optional='optional' />
                <MDTypography variant="button" id="error_transporterAccountsId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Transporter Blocked</Form.Label>
              </div>
              <div className="col">
                <div className="erp_form_radio">
                  <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" checked={is_transporterBlock === true} onClick={() => { setIsTransporterBlock(true); }} name="isBlockedActive" optional="optional" /> </div>
                  <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" checked={is_transporterBlock === false} onClick={() => { setIsTransporterBlock(false); }} name="isBlockedActive" optional="optional" /> </div>
                </div>
              </div>
            </div>


            {is_transporterBlock === true ?
              <div className='row'>
                <div className='col-sm-5'>
                  <Form.Label className="erp-form-label">Transporter Blocked Remark {isBlockedActive === '1' ? <span className="required">*</span> : ''} </Form.Label>
                </div>
                <div className='col'>
                  <Form.Control as="textarea" rows={1} className={`erp_txt_area ${isBlockedActive === '1' ? '' : 'optional'} `} id="blockRemarkId" value={TransporterBlockedRemark} onChange={e => { setTransporterBlockedRemark(e.target.value); validateFields(e) }}   {...(isBlockedActive === '0' ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} maxLength="255" />
                  <MDTypography variant="button" id="error_blockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                  </MDTypography>
                </div>
              </div> : null}

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Transporter Payment Blocked</Form.Label>
              </div>
              <div className="col">
                <div className="erp_form_radio">
                  <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" checked={is_transporterPaymentBlock === true} onClick={() => { setIsTransporterPaymentBlock(true); }} name="isPaymentBlockedActive" optional="optional" /> </div>
                  <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" checked={is_transporterPaymentBlock === false} onClick={() => { setIsTransporterPaymentBlock(false); }} name="isPaymentBlockedActive" optional="optional" /> </div>
                </div>
              </div>
            </div>

            {is_transporterPaymentBlock === true ?
              <div className='row'>
                <div className='col-sm-5'>
                  <Form.Label className="erp-form-label">Transporter Payment Blocked Remark  {isPaymentBlockedActive === '1' ? <span className="required">*</span> : ''}   </Form.Label>
                </div>
                <div className='col'>
                  <Form.Control as="textarea" rows={1} className={`erp_txt_area ${isPaymentBlockedActive === '1' ? '' : 'optional'} `} id="paymentBlockRemarkId" value={PaymentBlockedRemark} onChange={e => { setPaymentBlockedRemark(e.target.value); validateFields(e) }} {...(isPaymentBlockedActive === '0' ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} maxlength="255" />
                  <MDTypography variant="button" id="error_paymentBlockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                  </MDTypography>
                </div>
              </div> : null}

            <div className='row mb-1'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label"> Rating<span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" id='transporterRating' className="erp_input_field" value={TransporterRating} onChange={e => { setTransporterRating(e.target.value); validateFields(e) }} maxlength="255" />
                <MDTypography variant="button" id="error_transporterRating" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Tally ID</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='transporterTallyId' className="erp_input_field optional" value={TallyId} onChange={e => { setTallyId(e.target.value); validateFields(e) }} maxlength="50" optional='optional' />
                <MDTypography variant="button" id="error_transporterTallyId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">UserName <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_username" value={txt_username} onInput={(e) => { setUserName(e.target.value.trim()); }} maxlength="200" optional="optional" ref={usernameRef} />
                <MDTypography variant="button" id="error_txt_username" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            {/* <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Password <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field number" id="txt_password" value={txt_password} onInput={(e) => { setPassword(e.target.value.trim()); }} maxlength="50" optional="optional" />
                <MDTypography variant="button" id="error_txt_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div> */}
            {
              keyForViewUpdate === "update" || keyForViewUpdate === "view" ?
                <div className='row'>
                  <div className='col-sm-5'>
                    <Form.Label className="erp-form-label">Password <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col-sm-7'>
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
            }

            <div className='row'>
              <div className='col-sm-5'>
                <Form.Label className="erp-form-label">Is Active</Form.Label>
              </div>
              <div className='col'>
                <div className="erp_form_radio">
                  <div className="fCheck">
                    <Form.Check
                      className="erp_radio_button"
                      label="Yes"
                      type="radio"
                      value="true" checked={is_activeTransporter === true} onClick={() => { setIsActiveTransporter(true); }}
                      name="isTransporterActive"
                      defaultChecked
                    />
                  </div>
                  <div className="sCheck">
                    <Form.Check
                      className="erp_radio_button"
                      label="No"
                      value="false" checked={is_activeTransporter === false} onClick={() => { setIsActiveTransporter(false); }}
                      type="radio"
                      name="isTransporterActive"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Contact Information Accordian */}
      <Accordion defaultActiveKey="0" >
        <Accordion.Item eventKey={0}>
          <Accordion.Header className="erp-form-label-md">Contact Information</Accordion.Header>
          <Accordion.Body>
            <div className="mt-10">
              <>
                {renderTransporterContactTable}
              </>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />

      {/* Bank Information Accordian */}
      <Accordion defaultActiveKey="0" >
        <Accordion.Item eventKey={0}>
          <Accordion.Header className="erp-form-label-md">Banks Information</Accordion.Header>
          <Accordion.Body>
            <form id="bankform" className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
              <div className="row">
                <div className="col-sm-6 erp_form_col_div">
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">A/C. Type<span className="required">*</span></Form.Label>
                    </div>

                    <div className="col">
                      <select size="sm" id="accountTypeId" className="form-select form-select-sm erp_input_field" onChange={() => { addRecordInProperty('BankAccountsType'); validateBankFields() }}>
                        <option value="">Select</option>
                        {bankAccountTypeOption?.map(bankAcc => (
                          <option value={bankAcc.field_name}>{bankAcc.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_accountTypeId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank Name<span className="required">*</span></Form.Label>
                    </div>
                    <div className="col">
                      <select size="sm" id="bankNameId" className="form-select form-select-sm erp_input_field" onChange={() => { addRecordInProperty('cmv_banks_List'); validateBankFields() }}>
                        <option value="">Select</option>
                        {bankNameOptionList?.map(bankName => (
                          <option value={bankName.field_id}>{bankName.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_bankNameId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Branch Name<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="bankBranchName"
                        // onInput={(e) => {
                        //   let sanitizedValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        //   e.target.value = sanitizedValue;
                        // }}
                        onChange={e => { setBankBranchName(e.target.value); validateBankFields() }} maxLength="255" />
                      <MDTypography variant="button" id="error_bankBranchName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank A/C. NO.<span className="required">*</span></Form.Label>
                    </div>

                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="bankAccountNo"
                        onChange={(e) => {
                          if (validateNumberDateInput.current.isInteger(e.target.value)) {
                            setBankAccountNo(e.target.value)
                          }; validateBankFields();
                        }} maxLength="17"
                      // onInput={(e) => {
                      //   let parsedValue = parseInt(e.target.value);
                      //   if (isNaN(parsedValue)) {
                      //     e.target.value = '';
                      //   } else { e.target.value = Math.max(0, parsedValue).toString().slice(0, 15); }
                      // }}
                      // onChange={(e) => { validateNo(e); validateBankFields(); }}
                      />
                      <MDTypography variant="button" id="error_bankAccountNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">IFSC NO.<span className="required">*</span></Form.Label>
                    </div>

                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="bankIfscNo" value={bankIfscNo}
                        onChange={e => { setBankIfscNo(e.target.value.split(' ').join('').toUpperCase()); validateBankFields() }}                         // onInput={(e) => {
                        //   const enteredValue = e.target.value;
                        //   const isValid = /^[A-Z0-9]*$/.test(enteredValue);
                        //   if (!isValid) {
                        //     document.getElementById('error_bankIfscNo').innerText = 'Please Enter Capital letters';
                        //   } else {
                        //     validateBankFields();
                        //   }
                        // }}
                        maxLength="11" />
                      <MDTypography variant="button" id="error_bankIfscNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
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
                      <Form.Control type="text" className="erp_input_field" id="bankSwiftCode" onChange={e => { setBankSwiftCode(e.target.value); validateFields(e) }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_bankSwiftCode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">GST NO.</Form.Label>
                    </div>

                    <div className='col'>
                      <Form.Control type="text" className="erp_input_field" id="bankGstNo" onChange={e => { setBankGStNo(e.target.value); validateFields(e) }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_bankGstNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Currency Type</Form.Label>
                    </div>

                    <div className='col'>
                      <select size="sm" id="currencyType" className="form-select form-select-sm" onChange={() => addRecordInProperty('fmv_currency')} optional='optional'>
                        {currencyTypeOption?.map(option => (
                          <option value={option.field_name}>{option.field_name}</option>
                        ))}

                      </select>
                      <MDTypography variant="button" id="error_currencyType" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}  >
                      </MDTypography>
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Bank Active</Form.Label>
                    </div>

                    <div className="col">
                      <Form>
                        <div className="erp_form_radio">
                          <div className="fCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="Yes"
                              type="radio"
                              value="true" checked={is_bankActive === true} onClick={() => { setIsBankActive(true); }}
                              name="isBankActive"
                              defaultChecked
                            />
                          </div>
                          <div className="sCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="No"
                              value="false" checked={is_bankActive === false} onClick={() => { setIsBankActive(false); }}
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
              <div className="erp_frm_Btns">
                <MDButton type="button" onClick={FnAddBank} id="saveBtn" className="erp-gb-button ms-2" variant="button" fontWeight="regular">Add</MDButton>
              </div>
            </form >
            {renderTransporterBanks}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />
      <div className='text-center mb-5 mt-3'>
        <MDButton type="button" className="erp-gb-button"

          onClick={() => {
            const path = compType === 'Register' ? '/Masters/TransporterListing/reg' : '/Masters/TransporterListing';
            navigate(path);
          }}

          variant="button"
          fontWeight="regular">Home</MDButton>
        <MDButton type="submit" onClick={FnAddTransporter} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular">save</MDButton>
        <MDButton type="button" onClick={() => goToNext(transporterId, TransporterName, TransporterVendorCode)} className={`erp-gb-button ms-2 ${transporterId === 0 ? 'd-none' : 'display'}`} variant="button"
          fontWeight="regular" >Next</MDButton>
      </div >

      {/* Add new Record Popup */}
      {/* <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
        <Modal.Header>
          <Modal.Title className='erp_modal_title'>{modalHeaderName}</Modal.Title>
          <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
        </Modal.Header>
        <Modal.Body className='erp_city_modal_body'>
          {displayRecordComponent()}
        </Modal.Body>
        <Modal.Footer>
          <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
            fontWeight="regular">Close</MDButton>
        </Modal.Footer>
      </Modal > */}
      {/* Add new Record Popup */}
      {showAddRecModal ? <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
        <Modal.Body className='erp_city_modal_body'>
          <div className='row'>
            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
          </div>
          {displayRecordComponent()}
        </Modal.Body>
      </Modal > : null}

      {/* Success Msg Popup */}
      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      {/* Error Msg Popup */}
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
    </MDBox>
  );
}
export default Transporter;

