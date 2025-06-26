import MDBox from 'components/MDBox';
import React, { useState, useRef, useEffect, useMemo } from 'react'
import $ from 'jquery';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from 'react-icons/md';

// import files
import ComboBox from "Features/ComboBox";
import FrmCity from "FrmGeneric/MCity/FrmCity";

// React Bootstrap Imports
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// import files
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import { MdRefresh } from 'react-icons/md';
import FrmValidations from 'FrmGeneric/FrmValidations';
import FrmPaymentTermsEntry from 'Masters/MPaymentTerms/FrmPaymentTermsEntry';
import FrmBankListEntry from 'Masters/MBankList/FrmBankListEntry';
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import { Accordion, Table } from "react-bootstrap";
import { CircularProgress } from '@mui/material';

const Contractor = () => {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  let expandedGlCodeCombo = false;


  const { state } = useLocation();
  const { contractorID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  // var contractorID = sessionStorage.getItem('contractorID');
  const combobox = useRef();
  const validate = useRef();
  const validateNumberDateInput = useRef();


  // For navigate
  const navigate = useNavigate();
  const [actionType, setActionType] = useState('(Creation)')



  const [contractor_id, setContractorId] = useState(contractorID)
  const [ContractorName, setContractorName] = useState('');
  const [ContractorShortName, setContractorShortName] = useState('');
  const [ContractorVendorCode, setContractorVendorCode] = useState('');
  const [ContractorAddress1, setContractorAddress1] = useState('');
  const [ContractorAddress2, setContractorAddress2] = useState('');
  const [city, setCity] = useState('');
  const [Pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('');
  const [StateId, setState] = useState('');
  const [country, setCountry] = useState('');
  const [ContractorPhoneNo, setContractorPhoneNo] = useState('');
  const [ContractorCellNo, setContractorCellNo] = useState('');
  const [ContractorEmail, setContractorEmail] = useState('');
  const [ContractorWebSite, setContractorWebsite] = useState('');
  const [ContractorGSTNo, setContractorGSTNo] = useState('');
  const [ContractorPanNo, setContractorPanNo] = useState('');
  const [UdyogAdharNo, setUdyogAdharNo] = useState('');
  const [ContractorVatNo, setContractorVatNo] = useState('');
  const [ServiceTaxNo, setServiceTaxNo] = useState('');
  const [ContractorExciseNo, setContractorExciseNo] = useState('');
  const [ContractorCstNo, setContractorCstNo] = useState('');
  const [ContractorBstNo, setContractorBstNo] = useState('');
  const [ContractorBankId, setContractorBankId] = useState('');
  const [BankAccountType, setBankAccountType] = useState('')
  const [BankAccountNo, setBankAccountNo] = useState('');
  const [BankIfscCode, setBankIfscCode] = useState('');
  const [ContractorPaymentTerm, setContractorPaymentTerm] = useState('');
  const [ContractorGLCodes, setContractorGLCodes] = useState('');
  const [ContractorAccountsId, setContractorAccountsId] = useState('');
  const [ContractorBlocked, setContractorBlocked] = useState(false);
  const [ContractorBlockedRemark, setContractorBlockedRemark] = useState('');
  const [ContractorPaymentBlocked, setContractorPaymentBlocked] = useState(false);
  const [ContractorPaymentBlockedRemark, setContractorPaymentBlockedRemark] = useState('');
  const [ContractorRating, setContractorRating] = useState('');
  const [ContractorTallyId, setContractorTallyId] = useState('');

  // select box field
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [GLCodes, setGLCodes] = useState([]);
  const [GLCodesCheckboxes, setGLCodesCheckboxes] = useState();
  const [totalSelectedGLCodeCheckboxes, setTotalSelectedGLCodeCheckboxes] = useState(0);
  const [PaymentTermId, setPaymentTermId] = useState([]);
  const [BankIdName, setBankIdName] = useState([]);
  const [bankAccountTypeOption, setBankAccountTypeOption] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);

  const [bankAccountTypeList, setBankAccountTypeList] = useState([]);


  // contractors bank States
  const [contractorBankData, setcontractorBankData] = useState([])
  const [cmb_contractor_bank_account_type, setContractorBankAccountType] = useState('')
  const [cmb_bank_id, setBankId] = useState('')
  const [txt_contractor_bank_branch_name, setContractorBankBranchName] = useState('')
  const [txt_contrator_bank_account_no, setContractorBankAccountNo] = useState('')
  const [txt_contractor_bank_ifsc_code, setContractotBankIfscCode] = useState('')
  const [txt_contractor_bank_swift_code, setContractorBankSwiftCode] = useState('')
  const [txt_contractor_bank_gst_no, setContractorBankGstNo] = useState('')
  const [cmb_currency_type, setCurrencyType] = useState('Rupees')
  const [txt_is_active, setContractorBankIsActive] = useState(true)
  const [bankList, setBankList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);


  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/ContractorListing`)
    }
  }
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    FillComobos();
    generateVendorCode();
    if (contractorID !== 0) {
      FnCheckUpdateResponceContractor();
    }
  }, []);

  // Add new record for city .....

  const [showAddRecModal, setShowAddRecModal] = useState(false);
  // to add new records in combo box 
  const [modalHeaderName, setHeaderName] = useState('')


  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {

      case 'City':
        if (district !== '' && district !== undefined) {
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: district });
          let cityList = await combobox.current.removeCatcheFillCombo(globalQuery);
          setCityOptions(cityList);
          // var propertyList2 = await combobox.current.fillMasterData("cmv_city", "district_id", district)
          // setCityOptions(propertyList2)
        }
        setShowAddRecModal(false);
        break;

      case 'BankList':
        let getBanksList = await combobox.current.fillMasterData("cmv_banks_List", "is_delete", '0')
        setBankIdName(getBanksList);
        break;

      case 'Payment Terms':
        var paymentTermDays = await combobox.current.fillComboBox("PaymentTermDays")
        setPaymentTermId(paymentTermDays)
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
      case 'City':
        return <FrmCity btn_disabled={true} />;

      case 'BankList':
        return <FrmBankListEntry btn_disabled={true} />;

      case 'Payment Terms':
        return <FrmPaymentTermsEntry btn_disabled={true} />;

      default:
        return null;
    }
  }



  const addRecordInProperty = async (key) => {
    switch (key) {
      case 'Country':
        const getCountryId = document.getElementById('countryId').value;
        setCountry(getCountryId)
        if (getCountryId !== '') {
          $('#error_countryId').hide();
          var stateList = await combobox.current.fillMasterData("cmv_state", "country_id", getCountryId)
          setStateOptions([])
          setStateOptions(stateList)
          setState('')
          setDistrict('')
          setCity('')

        } else {
          setStateOptions([]);
          setDistrictOptions([]);
          setCityOptions([]);
          setState('')
          setDistrict('')
          setCity('')
        }

        break;
      case 'State':
        const getStateId = document.getElementById('StateId').value;
        setState(getStateId)
        if (getStateId !== '') {
          $('#error_stateId').hide();
          var districtList = await combobox.current.fillMasterData("cmv_district", "state_id", getStateId)
          setDistrictOptions([])
          setDistrictOptions(districtList)
          setDistrict('')
          setCityOptions([]);
          setCity('')

        } else {
          setCityOptions([]);
          setState('')
          setDistrict('')
          setCity('')
        }

        break;
      case 'District':
        const getDistrictId = document.getElementById('districtId').value;
        setDistrict(getDistrictId)
        if (getDistrictId !== '') {
          $('#error_districtId').hide();
          // var cityList = await combobox.current.fillMasterData("cmv_city", "district_id", getDistrictId)
          // setCityOptions([])
          // setCityOptions(cityList)
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: getDistrictId });
          let cityList = await combobox.current.removeCatcheFillCombo(globalQuery);
          setCityOptions(cityList);
          setCity('')
        } else {
          setCityOptions([]);
          setCity('')
        }
        break;
      case 'City':
        const propertyValCity = document.getElementById('cityId').value;
        setCity(propertyValCity)
        if (propertyValCity === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('City')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }
        else {
          setCity(propertyValCity)
          const selectedCity = cityOptions.find(city => city.field_id === parseInt(propertyValCity));
          setPincode(selectedCity.city_pincode);
          $('#error_cityId').hide();
        }
        break;


      case 'fmv_general_ledger':
        const generalLeadgers = document.getElementById('cotractorGLCodesId').value;
        setContractorGLCodes(generalLeadgers)
        $('#error_cotractorGLCodesId').hide();
        if (generalLeadgers === '0') {
          const newTab = window.open('/Masters/MFMGeneralLedgerEntry', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }
        break;
      case 'PaymentTermDays':
        const paymentTermDays = document.getElementById('contractorPaymentTermID').value;
        setContractorPaymentTerm(paymentTermDays)
        $('#error_contractorPaymentTermID').hide();
        if (paymentTermDays === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Payment Terms')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }


        break;
      case 'BankAccountsType':
        var accountTypeSelect = document.getElementById('accountTypeId').value;

        setBankAccountType(accountTypeSelect)
        $('#error_accountTypeId').hide();
        break;

      case 'BankIdName':
        const bankName = document.getElementById('ContractorBankId').value;
        setContractorBankId(bankName);

        $('#error_contractorBankID').hide();
        if (bankName === '0') {
          setHeaderName('BankList');
          setShowAddRecModal(true);
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100);
          // const newTab = window.open('/Masters/Bank', '_blank');
          // if (newTab) {
          //   newTab.focus();
          // }
        }
    }
  }
  const FillComobos = async () => {
     var controlName = ["cmv_country", "fmv_general_ledger", "PaymentTermDays", "BankAccountsType", 'cmv_banks_List']
    if (combobox.current) {

      combobox.current.fillMasterData(controlName[0], "", "").then((cmv_countryList) => {
        setCountryOptions(cmv_countryList)
        // Set the default Country India.
        const defaultCountry = cmv_countryList.find(country => country.field_name === "India");
        setCountry(defaultCountry.field_id);
        // Load the State options.
        combobox.current.fillMasterData("cmv_state", "country_id", defaultCountry.field_id).then((getStateList) => {
          setStateOptions(getStateList);
          // Set the default State Maharashtra.
          const defaultState = getStateList.find(state => state.field_name === "Maharashtra");
          setState(defaultState.field_id);

          combobox.current.fillMasterData("cmv_district", "state_id", defaultState.field_id).then((getDistrictList) => {
            setDistrictOptions(getDistrictList);
          })
        })
      })
      combobox.current.fillMasterData(controlName[1], "", "").then((fmv_general_ledgerList) => {
        setGLCodes(fmv_general_ledgerList)
      })
      combobox.current.fillComboBox(controlName[2]).then((paymentTermDays) => {
        setPaymentTermId(paymentTermDays)
      })
      combobox.current.fillComboBox(controlName[3]).then((bankAccountType) => {
        setBankAccountTypeOption(bankAccountType)
      })
      combobox.current.fillMasterData(controlName[4], "", "").then((bankNameId) => {
        setBankIdName(bankNameId)
      })

      combobox.current.fillMasterData("cmv_banks_List", "", "").then((bankList) => {
        setBankList(bankList)
      })
      combobox.current.fillMasterData("fmv_currency", "", "").then((currencyList) => {
        setCurrencyTypeList(currencyList)
      })
      combobox.current.fillComboBox("BankAccountsType").then((bankAccountTypeList) => {
        setBankAccountTypeList(bankAccountTypeList)
      })
    }
    const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
    const respCountryCode = await apiCallCountryCodeList.json();
    console.log("apiCallCountryCodeList: ", respCountryCode)
    setCountryCodeOptions(respCountryCode)
  }

  var activeValue;




  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   let checkIsValidate = await validate.current.validateForm("contractorFormId");
  //   if (checkIsValidate == true) {
  //     if (contractorID === '' || contractorID === null) { contractorID = 0 }
  //     var active;
  //     activeValue = document.querySelector('input[name=isContractorActive]:checked').value
  //     switch (activeValue) {
  //       case '0': active = false; break;
  //       case '1': active = true; break;
  //     }
  //     const json = { 'TransContractor': {}, 'TransContractorBankData': [], 'commonIds': { 'company_id': COMPANY_ID, 'Contractor_id': contractor_id } }

  //     const data = {
  //       company_id: COMPANY_ID,
  //       company_branch_id: COMPANY_BRANCH_ID,
  //       contractor_id: contractorID,
  //       created_by: UserName,
  //       modified_by: contractorID === 0 || contractorID === undefined ? null : UserName,
  //       contractor_name: ContractorName,
  //       contractor_short_name: ContractorShortName.trim(),
  //       contractor_vendor_code: ContractorVendorCode,
  //       contractor_address1: ContractorAddress1,
  //       contractor_address2: ContractorAddress2,
  //       contractor_city_id: city,
  //       contractor_pincode: Pincode,
  //       contractor_district_id: district,
  //       contractor_state_id: StateId,
  //       contractor_country_id: country,
  //       contractor_phone_no: ContractorPhoneNo,
  //       contractor_cell_no: ContractorCellNo,
  //       contractor_EmailId: ContractorEmail,
  //       contractor_website: ContractorWebSite.trim() === '' ? 'NA' : ContractorWebSite.trim(),
  //       contractor_gst_no: ContractorGSTNo,
  //       contractor_pan_no: ContractorPanNo,
  //       contractor_udyog_adhar_no: UdyogAdharNo,
  //       contractor_vat_no: ContractorVatNo,
  //       contractor_service_tax_no: ServiceTaxNo,
  //       contractor_excise_no: ContractorExciseNo,
  //       contractor_cst_no: ContractorCstNo,
  //       contractor_bst_no: ContractorBstNo,
  //       contractor_bank_id: ContractorBankId,
  //       contractor_bank_account_type: BankAccountType,
  //       contractor_bank_account_no: BankAccountNo,
  //       contractor_bank_ifsc_code: BankIfscCode,
  //       contractor_payment_term_id: ContractorPaymentTerm === '' ? 152 : ContractorPaymentTerm,
  //       contractor_gl_codes: ContractorGLCodes,
  //       contractor_accounts_id: ContractorAccountsId,
  //       contractor_blocked: ContractorBlocked,
  //       contractor_blocked_remark: ContractorBlockedRemark,
  //       contractor_payment_blocked: ContractorPaymentBlocked,
  //       contractor_payment_blocked_remark: ContractorPaymentBlockedRemark,
  //       contractor_ratings: ContractorRating,
  //       contractor_tally_id: ContractorTallyId,
  //       is_active: active,


  //     }
  //     json.TransContractor = data
  //     json.TransContractorBankData = contractorBankData
  //     console.log(data)

  //     const formData = new FormData();
  //     formData.append(`TransContractorData`, JSON.stringify(data))

  //     fetch(`${process.env.REACT_APP_BASE_URL}/api/contractor/FnAddUpdateRecord`, {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     }).then((responce) => {
  //       responce.json().then((responce) => {
  //         console.log(responce);
  //         console.log("response error: ", responce.data);
  //         if (responce.error !== "") {
  //           console.log("response error: ", responce.error);
  //           setErrMsg(responce.error)
  //           setShowErrorMsgModal(true)

  //         } else {
  //           var data = JSON.stringify(responce.data)
  //           sessionStorage.setItem("contractorID", data.contractor_id);
  //           console.log("contractorID", data.contractor_id);
  //           const evitCache = combobox.current.evitCache();
  //           console.log(evitCache);
  //           clearFormFields();
  //           setSuccMsg(responce.message);
  //           setShowSuccessMsgModal(true);
  //         }
  //       }).catch(error => {
  //         console.error('Error!', error);
  //         navigate('/Error')
  //       });
  //     })

  //   }

  // }

  const handleSubmit = async () => {
     try {
      setIsLoading(true)
      let checkIsValidate = false;
      checkIsValidate = await validate.current.validateForm("contractorFormId");

      const json = { 'TransContractorData': {}, 'TransContractorBankData': [], 'commonIds': { 'company_id': COMPANY_ID, 'contractor_id': contractorID } }
      if (checkIsValidate) {
        var active;
        activeValue = document.querySelector('input[name=isContractorActive]:checked').value
        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }
        const data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          contractor_id: contractorID,
          created_by: UserName,
          modified_by: contractorID === 0 || contractorID === undefined ? null : UserName,
          contractor_name: ContractorName,
          contractor_short_name: ContractorShortName.trim(),
          contractor_vendor_code: ContractorVendorCode,
          contractor_address1: ContractorAddress1,
          contractor_address2: ContractorAddress2,
          contractor_city_id: city,
          contractor_pincode: Pincode,
          contractor_district_id: district,
          contractor_state_id: StateId,
          contractor_country_id: country,
          contractor_phone_no: ContractorPhoneNo,
          contractor_cell_no: ContractorCellNo,
          contractor_EmailId: ContractorEmail,
          contractor_website: ContractorWebSite.trim() === '' ? 'NA' : ContractorWebSite.trim(),
          contractor_gst_no: ContractorGSTNo,
          contractor_pan_no: ContractorPanNo,
          contractor_udyog_adhar_no: UdyogAdharNo,
          contractor_vat_no: ContractorVatNo,
          contractor_service_tax_no: ServiceTaxNo,
          contractor_excise_no: ContractorExciseNo,
          contractor_cst_no: ContractorCstNo,
          contractor_bst_no: ContractorBstNo,
          contractor_bank_id: ContractorBankId,
          contractor_bank_account_type: BankAccountType,
          contractor_bank_account_no: BankAccountNo,
          contractor_bank_ifsc_code: BankIfscCode,
          contractor_payment_term_id: ContractorPaymentTerm === '' ? 152 : ContractorPaymentTerm,
          contractor_gl_codes: ContractorGLCodes,
          contractor_accounts_id: ContractorAccountsId,
          contractor_blocked: ContractorBlocked,
          contractor_blocked_remark: ContractorBlockedRemark,
          contractor_payment_blocked: ContractorPaymentBlocked,
          contractor_payment_blocked_remark: ContractorPaymentBlockedRemark,
          contractor_ratings: ContractorRating,
          contractor_tally_id: ContractorTallyId,
          is_active: active,
        }
        json.TransContractorData = data
        // json.TransContractorBankData = contractorBankData
        for (let contractorBankDataIndex = 0; contractorBankDataIndex < contractorBankData.length; contractorBankDataIndex++) {
          const contractorBankDataElement = contractorBankData[contractorBankDataIndex];
          var contractorJson = {}

          contractorJson['company_id'] = COMPANY_ID
          contractorJson['company_branch_id'] = COMPANY_BRANCH_ID
          contractorJson['contractor_bank_id'] = contractorBankDataElement.contractor_bank_id
          contractorJson['contractor_id'] = contractorBankDataElement.contractor_id
          contractorJson['bank_id'] = contractorBankDataElement.bank_id
          contractorJson['contractor_bank_name'] = contractorBankDataElement.contractor_bank_name
          contractorJson['contractor_bank_gl_codes'] = contractorBankDataElement.contractor_bank_gl_codes
          contractorJson['contractor_bank_accounts_id'] = contractorBankDataElement.contractor_bank_accounts_id
          contractorJson['contractor_bank_gst_no'] = contractorBankDataElement.contractor_bank_gst_no
          contractorJson['contractor_bank_branch_name'] = contractorBankDataElement.contractor_bank_branch_name
          contractorJson['contractor_bank_account_type'] = contractorBankDataElement.contractor_bank_account_type
          contractorJson['contractor_bank_account_no'] = contractorBankDataElement.contractor_bank_account_no
          contractorJson['contractor_bank_ifsc_code'] = contractorBankDataElement.contractor_bank_ifsc_code
          contractorJson['contractor_bank_swift_code'] = contractorBankDataElement.contractor_bank_swift_code
          contractorJson['currency_type'] = contractorBankDataElement.currency_type

          json.TransContractorBankData.push(contractorJson)
        }

        console.log("json Data", json);
        const formData = new FormData()
        formData.append('TransContractorDetailData', JSON.stringify(json))

        const forwardData = {
          method: 'POST',
          body: formData,
        }
        const contractorApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contractor/FnAddUpdateRecord`, forwardData)
        const response = await contractorApiCall.json();

        if (response.success === '0') {
          setErrMsg(response.error)
          setShowErrorMsgModal(true)
        } else {
          const evitCache = await combobox.current.evitCache();
          console.log(evitCache);
          clearFormFields();
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




  const clearFormFields = () => {
    setContractorName('');
    setContractorShortName('');
    setContractorVendorCode('');
    setContractorAddress1('');
    setContractorAddress2('');
    setCity('');
    setPincode('');
    setDistrict('');
    setState('');
    setCountry('');
    setContractorPhoneNo('');
    setContractorCellNo('');
    setContractorEmail('');
    setContractorWebsite('');
    setContractorGSTNo('');
    setContractorPanNo('');
    setUdyogAdharNo('');
    setContractorVatNo('');
    setServiceTaxNo('');
    setContractorExciseNo('');
    setContractorCstNo('');
    setContractorBstNo('');
    setContractorBankId('');
    setBankAccountType('');
    setBankAccountNo('');
    setBankIfscCode('');
    setContractorPaymentTerm('');
    setContractorGLCodes('');
    setContractorAccountsId('');
    setContractorBlocked('');
    setContractorBlockedRemark('');
    setContractorPaymentBlocked('');
    setContractorPaymentBlockedRemark('');
    setContractorRating('');
    setContractorTallyId('');

  }

  const FnCheckUpdateResponceContractor = async () => {
     setActionType(keyForViewUpdate === 'update' ? '(Modification)' : keyForViewUpdate === 'view' ? '(View)' : '(Creation)');
    try {
      if (contractor_id !== "undefined" && contractor_id !== '' && contractor_id !== null) {
        const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contractor/FnShowParticularRecord/${COMPANY_ID}/${contractor_id}`)
        const updateRes = await apiCall.json();

        setcontractorBankData(updateRes.contractorBankDetails);

        var stateList = await combobox.current.fillMasterData("cmv_state", "country_id", JSON.stringify(updateRes.contractorDetails.contractor_country_id))
        setStateOptions([])
        setStateOptions(stateList)

        var districtList = await combobox.current.fillMasterData("cmv_district", "state_id", JSON.stringify(updateRes.contractorDetails.contractor_state_id))
        setDistrictOptions([])
        setDistrictOptions(districtList)

        // var cityList = await combobox.current.fillMasterData("cmv_city", "district_id", JSON.stringify(updateRes.data.contractor_district_id))
        // setCityOptions([])
        // setCityOptions(cityList)
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
        globalQuery.table = "cmv_city"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
        globalQuery.conditions.push({ field: "district_id", operator: "=", value: updateRes.contractorDetails.contractor_district_id });
        let cityList = await combobox.current.removeCatcheFillCombo(globalQuery);
        setCityOptions(cityList);

        // contractorID = sessionStorage.setItem('contractorID', updateRes.data.contractor_id)
        setContractorId(contractorID)
        setContractorName(updateRes.contractorDetails.contractor_name)
        setContractorShortName(updateRes.contractorDetails.contractor_short_name)
        setContractorVendorCode(updateRes.contractorDetails.contractor_vendor_code)
        setContractorAddress1(updateRes.contractorDetails.contractor_address1)
        setContractorAddress2(updateRes.contractorDetails.contractor_address2)
        setCountry(updateRes.contractorDetails.contractor_country_id)
        setState(updateRes.contractorDetails.contractor_state_id)
        setDistrict(updateRes.contractorDetails.contractor_district_id)
        setCity(updateRes.contractorDetails.contractor_city_id)
        setPincode(updateRes.contractorDetails.contractor_pincode)
        setContractorPhoneNo(updateRes.contractorDetails.contractor_phone_no)
        setContractorCellNo(updateRes.contractorDetails.contractor_cell_no)
        setContractorEmail(updateRes.contractorDetails.contractor_EmailId)
        setContractorWebsite(updateRes.contractorDetails.contractor_website)
        // setContractorGSTNo(updateRes.data.contractor_gst_no)
        setContractorPanNo(updateRes.contractorDetails.contractor_pan_no)
        setUdyogAdharNo(updateRes.contractorDetails.contractor_udyog_adhar_no)
        setContractorVatNo(updateRes.contractorDetails.contractor_vat_no)
        setServiceTaxNo(updateRes.contractorDetails.contractor_service_tax_no)
        setContractorExciseNo(updateRes.contractorDetails.contractor_excise_no)
        setContractorCstNo(updateRes.contractorDetails.contractor_cst_no)
        setContractorBstNo(updateRes.contractorDetails.contractor_bst_no)
        // setContractorBankId(updateRes.data.contractor_bank_id)
        // setBankAccountType(updateRes.data.contractor_bank_account_type)
        // setBankAccountNo(updateRes.data.contractor_bank_account_no)
        setBankIfscCode(updateRes.contractorDetails.contractor_bank_ifsc_code)
        setContractorPaymentTerm(updateRes.contractorDetails.contractor_payment_term_id)
        setContractorGLCodes(updateRes.contractorDetails.contractor_gl_codes)
        if (updateRes.contractorDetails.contractor_gl_codes !== '') {
          setTotalSelectedGLCodeCheckboxes(updateRes.contractorDetails.contractor_gl_codes.split(':').length);
        }
        setContractorAccountsId(updateRes.contractorDetails.contractor_accounts_id)
        if (updateRes.contractorDetails.contractor_blocked === 1) {
          setContractorBlocked(true);
        } else {
          setContractorBlocked(false);
        }
        // setContractorBlocked(updateRes.data.contractor_blocked  ) 
        setContractorBlockedRemark(updateRes.contractorDetails.contractor_blocked_remark)
        if (updateRes.contractorDetails.contractor_payment_blocked === 1) {
          setContractorPaymentBlocked(true);
        } else {
          setContractorPaymentBlocked(false);
        }
        // setContractorPaymentBlocked(updateRes.data.contractor_payment_blocked)
        setContractorPaymentBlockedRemark(updateRes.contractorDetails.contractor_payment_blocked_remark)
        setContractorRating(updateRes.contractorDetails.contractor_ratings)
        setContractorTallyId(updateRes.contractorDetails.contractor_tally_id)
        // updateRes.data.is_active
        switch (updateRes.contractorDetails.is_active) {
          case true:
            document.querySelector('input[name="isContractorActive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isContractorActive"][value="0"]').checked = true;
            break;
          default: break;
        }

        // var keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');

        switch (keyForViewUpdate) {
          case 'update':
            $('#contractorName').attr('disabled', true)
            $('#contractorShortName').attr('disabled', true)
            // setActionType('(Modification)');
            break;
          case 'view':
            await validate.current.readOnly("contractorFormId");
            $("input[type=radio]").attr('disabled', true);
            // setActionType('(View)');
            break;
        }

      }

    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }





  const validateFields = (event) => {
    if (event.target.type === 'email' && !validateNumberDateInput.current.validateEmail(event.target.value) && event.target.value !== '') {
      $(`#error_${event.target.id}`).text('Please enter valid email!...')
      $(`#error_${event.target.id}`).show()
    } else {
      $(`#error_${event.target.id}`).hide()
    }
    validate.current.validateFieldsOnChange('contractorFormId')
  }

  const validateNo = (noKey) => {
    const regexNo = /^[0-9\b]+$/;
    const telephoneRegex = /^[0-9+\(\)#\.\s\/ext-]+$/;
    var accNo = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
    const value = noKey.target.value
    switch (noKey.target.id) {
      case 'BankAccountNo':
        if (noKey.target.value !== '' || accNo.test(noKey.target.value)) {
          if (noKey.target.value === 'NaN') {
            setBankAccountNo("")
          } else {
            setBankAccountNo(noKey.target.value)
          }
        }
        break;

      case 'pinCode':
        if (regexNo.test(value) || value === '') {
          setPincode(value)
        }
        break;

      case 'phoneNo':
        if (telephoneRegex.test(value) || value === '') {
          setContractorPhoneNo(value)
        }
        break;

      case 'cellNo':
        if (regexNo.test(value) || value === '') {
          setContractorCellNo(value)
        }
        break;

    }

  }
  const validateWebSite = (obj) => {
    var validateWebSite = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (obj.value === "" || validateWebSite.test(obj.value)) {
      $("#error_contractorWebsite").hide();
    } else if (obj.value !== "" && !validateWebSite.test(obj.value)) {
      $("#error_contractorWebsite").text("Please enter valid url!...");
      $("#error_contractorWebsite").show();
    }


  }


  const FnRefreshbtn = async (key) => {

    switch (key) {

      case 'GLCodes':
        var fmv_general_ledgerList = await combobox.current.fillMasterData("fmv_general_ledger", "", "")
        setGLCodes(fmv_general_ledgerList)
        break;

      case 'BankName':
        var bankNameId = await combobox.current.fillMasterData("cmv_banks_List", "", "")
        setBankIdName(bankNameId)
        break;


      default:
        break;

    }

  }

  // Handler for radio button change
  const handleBlockedTypeChange = (type) => {
    // Clear all saved values when "Amount" is selected
    if (type === 'false') {
      setContractorBlockedRemark('')
    }
  };

  // Handler for radio button change
  const handlePaymentBlockedTypeChange = (type) => {
    if (type === 'false') {
      setContractorPaymentBlockedRemark('')
    }
  };


  //------------------- Agent vendor-code Functionality  --------------------------------------- //
  const generateVendorCode = async () => {
    const data = {
      tblName: 'cm_contractor', fieldName: 'contractor_vendor_code', Length: 5, company_id: COMPANY_ID,
    };
    const formData = new FormData();
    formData.append(`data`, JSON.stringify(data))
    const requestOptions = { method: 'POST', body: formData };
    try {
      const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/agent/FnGenerateCode/${COMPANY_ID}`, requestOptions)
      const resp = await fetchResponse.text();
      console.log("GenerateTAuto Api: ", resp)
      if (resp) {
        setContractorVendorCode('C-' + resp);
        return 'C-' + resp;
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
      if (ContractorGLCodes !== '') {
        const glCodeIds = ContractorGLCodes.split(':');
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
    setContractorGLCodes(selectedGLCodes.replace(/:$/, ''));
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
  //------------------- Agent Bank Functionality  --------------------------------------- //

  const renderContractorBanks = useMemo(() => {
    return <>
      {contractorBankData.length !== 0 ?
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
            {contractorBankData?.map((bankItem, index) =>
              <tr rowindex={index}>
                <td className={`erp_table_td ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> <MdDelete className="erp-delete-btn" onClick={() => deleteBank(index)} /></td>
                <td className="erp_table_td">{index + 1}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_account_type}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_name}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_branch_name}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_account_no}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_ifsc_code}</td>
                <td className="erp_table_td">{bankItem.contractor_bank_swift_code}</td>
                <td className="erp_table_td ">{bankItem.contractor_bank_gst_no}</td>
                <td className="erp_table_td ">{bankItem.currency_type}</td>
              </tr>
            )
            }
          </tbody>
        </Table>
        : null}</>
  }, [contractorBankData])

  const deleteBank = (indexToRemove) => {
    const updatedcontractorBankData = contractorBankData.filter((item, index) => index !== indexToRemove);
    setcontractorBankData(updatedcontractorBankData);
  }

  const validateBankFields = () => {
    validate.current.validateFieldsOnChange("bankForm")
  }

  const FnAddContractorBank = async () => {
    const checkIsBankValidate = await validate.current.validateForm("bankForm");
    if (checkIsBankValidate) {
      const bankData = {
        company_id: COMPANY_ID,
        company_branch_id: COMPANY_BRANCH_ID,
        contractor_bank_id: 0,
        contractor_id: 0,
        bank_id: cmb_bank_id,
        contractor_bank_name: $("#cmb_bank_id option:selected").text(),
        contractor_bank_branch_name: txt_contractor_bank_branch_name,
        contractor_bank_account_type: cmb_contractor_bank_account_type,
        contractor_bank_account_no: txt_contrator_bank_account_no,
        contractor_bank_ifsc_code: txt_contractor_bank_ifsc_code,
        contractor_bank_swift_code: txt_contractor_bank_swift_code,
        contractor_bank_gst_no: txt_contractor_bank_gst_no,
        currency_type: cmb_currency_type,
        // agent_bank_gl_codes: cmb_agent_gl_codes,
        is_active: txt_is_active,
        created_by: UserName,
      }

      const isDuplicate = contractorBankData.some((item) => item.contractor_bank_name === bankData.contractor_bank_name && item.contractor_bank_account_type === bankData.contractor_bank_account_type);

      if (!isDuplicate) {
        setBankId('')
        setContractorBankBranchName('');
        setContractorBankAccountType('');
        setContractorBankAccountNo('')
        setContractotBankIfscCode('');
        setContractorBankSwiftCode('');
        // setContractorGSTNo('');
        setContractorBankGstNo('')
        setCurrencyType('Rupees')
        setContractorId('');
        setContractorBankIsActive(true)

        // set Bank data in array
        setcontractorBankData((prevArray) => [...prevArray, bankData]);
      } else {
        $('#error_cmb_bank_id').text('This Bank already exists...!').show();
      }
    }
  }
  //------------------- Contractor Bank Functionality Ends  --------------------------------------- //





  return (
    <>
      <FrmValidations ref={validate} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <DashboardLayout>
        <MDBox>
          <ComboBox ref={combobox} />
          {isLoading ?
            <div className="spinner-overlay"  >
              <div className="spinner-container">
                <CircularProgress />
                <span>Loading...</span>
              </div>
            </div> : null}
          <div className='card p-1'>
            <div className='card-header text-center py-1'>
              <label className='erp-form-label-lg text-center'> Contractor Information {actionType}</label>
            </div>
            <form id="contractorFormId">
              <div className='row erp_transporter_div'>
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label"> Name <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorName' className="erp_input_field" value={ContractorName} onChange={e => { setContractorName(e.target.value); validateFields(e) }} maxlength="255" />
                      <MDTypography variant="button" id="error_contractorName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label"> Short Name </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorShortName' className="erp_input_field" value={ContractorShortName} onChange={e => { setContractorShortName(e.target.value.toUpperCase()); validateFields(e) }} maxlength="5" optional="optional" />
                      <MDTypography variant="button" id="error_contractorShortName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label"> Vendor Code </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorVendorCode' className="erp_input_field " value={ContractorVendorCode} onChange={e => { setContractorVendorCode(e.target.value); validateFields(e) }} maxlength="255" optional="optional" />
                      <MDTypography variant="button" id="error_contractorVendorCode" className="erp_validation e" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label"> Address 1 <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control as="textarea" rows={1} className="erp_txt_area" id="contractorAdd1" value={ContractorAddress1} onChange={e => { setContractorAddress1(e.target.value); validateFields(e) }} maxlength="500" />
                      <MDTypography variant="button" id="error_contractorAdd1" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">  Address 2 </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control as="textarea" rows={1} className="erp_txt_area " id="contractorAdd2" value={ContractorAddress2} onChange={e => { setContractorAddress2(e.target.value); validateFields(e) }} maxlength="500" optional="optional" />
                      <MDTypography variant="button" id="error_contractorAdd2" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Country <span className="required">*</span> </Form.Label>
                    </div>
                    <div className='col-sm-8'>
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
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">State <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Select size="sm" id="StateId" className='erp_input_field' value={StateId} onChange={() => addRecordInProperty("State")} >
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
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">District <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
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
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">City <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
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
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Pincode <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" className="erp_input_field" id="pinCode" value={Pincode} onChange={e => { validateNo(e); validateFields(e) }} maxlength="6" disabled />
                      <MDTypography variant="button" id="error_pinCode" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                </div>
                {/* second column */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Phone NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <span className='erp_phone' >
                        <select size="sm" id='phoneCntryId' className='form-select-phone'>
                          {countryCodeOptions?.map(option => (
                            <option value={option}>{option}</option>

                          ))}
                        </select>

                        <Form.Control type="text" className="erp_input_field erp_phn_border" id="phoneNo" value={ContractorPhoneNo} onChange={e => { validateNo(e); validateFields(e) }} maxLength="20" optional="optional" />

                      </span>
                      <MDTypography variant="button" id="error_phoneNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">   Cell NO.<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <span className='erp_phone' >
                        <select size="sm" id='cellCntryId' className='form-select-phone'>
                          {countryCodeOptions?.map(option => (
                            <option value={option}>{option}</option>
                          ))}
                        </select>
                        <Form.Control type="text" className="erp_input_field erp_phn_border" id="cellNo" value={ContractorCellNo} onChange={e => { validateNo(e); validateFields(e) }} maxLength="10" />

                      </span>
                      <MDTypography variant="button" id="error_cellNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Email ID <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="email" id="email" className="erp_input_field" value={ContractorEmail} onChange={e => { setContractorEmail(e.target.value); validateFields(e); }} maxLength="50" />
                      <MDTypography variant="button" id="error_email" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Website </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorWebsite' className="erp_input_field" value={ContractorWebSite} onChange={e => { setContractorWebsite(e.target.value); validateWebSite(e.target); }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorWebsite" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  {/* <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">GST NO. <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" className="erp_input_field" id="gstNo" value={ContractorGSTNo} onChange={e => { setContractorGSTNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="15" />
                      <MDTypography variant="button" id="error_gstNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">PAN NO.<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" className="erp_input_field" id="panNo" value={ContractorPanNo} onChange={e => { setContractorPanNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="10" />
                      <MDTypography variant="button" id="error_panNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Udyog Aadhar NO.</Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorUdyogAdharNo' className="erp_input_field" value={UdyogAdharNo} onChange={e => { setUdyogAdharNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorUdyogAdharNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">VAT NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" className="erp_input_field" id="vatNo" value={ContractorVatNo} onChange={e => { setContractorVatNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_vatNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Service Tax NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorServiceTaxNo' className="erp_input_field" value={ServiceTaxNo} onChange={e => { setServiceTaxNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorServiceTaxNo" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Excise NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorExciseNo' className="erp_input_field" value={ContractorExciseNo} onChange={e => { setContractorExciseNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorExciseNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">CST NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorCSTNo' className="erp_input_field" value={ContractorCstNo} onChange={e => { setContractorCstNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorCSTNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  {/* ................... */}
                  {/* <div className="row">
                    <div className='col-sm-4 col-12'>
                      <Form.Label className="erp-form-label">Bank Name <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8 col-10'>
                      <select id="ContractorBankId" value={ContractorBankId} className="form-select form-select-sm erp_input_field" onChange={(e) => { addRecordInProperty("BankIdName"); validateFields(e); }}>
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {BankIdName?.map(contractorBank => (
                          <option value={contractorBank.field_id}>{contractorBank.field_name}</option>

                        ))}
                      </select>
                      <MDTypography variant="button" id="error_ContractorBankId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                      </MDTypography>
                    </div> */}
                  {/* <div className="col-sm-1 col-2">
                      <Tooltip title="Refresh" placement="top">
                        <MDTypography>
                          <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("BankName"); }} style={{ color: 'black' }} />
                        </MDTypography>
                      </Tooltip>
                    </div> */}
                  {/* </div> */}




                  {/* ........................... */}
                  {/* <div className='row'>
                  <div className='col-sm-5'>
                    <Form.Label className="erp-form-label">Bank Name </Form.Label>
                  </div>
                  <div className='col'>
                    <Form.Select size='sm' id='contractorBankID' className='erp_input_field' value={ContractorBankId} onChange={() => addRecordInProperty('BankIdName')} optional="optional">
                      <option value="" >Select</option>
                      <option value="0">Add New Record+</option>
                      {
                        BankIdName?.map(contractorBank => (
                          <option value={contractorBank.field_id}>{contractorBank.field_name}</option>
                        ))
                      }
                    </Form.Select>
                    <MDTypography variant="button" id="error_contractorBankID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                  <div className="col-sm-1 ">
                    <Tooltip title="Refresh" placement="top">
                      <MDTypography className="erp-view-btn" >
                        <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("BankName")} style={{ color: 'black' }} />
                      </MDTypography>
                    </Tooltip>
                  </div>
                </div> */}



                  {/* <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank Account Type </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <select size="sm" id="accountTypeId" value={BankAccountType} className="form-select form-select-sm erp_input_field" onChange={() => addRecordInProperty('BankAccountsType')} optional="optional">
                        <option value="">Select</option>
                        {bankAccountTypeOption?.map(bankAcc => (
                          <option value={bankAcc.field_name}>{bankAcc.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_accountTypeId" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}
                </div>
                {/* Third Column */}
                <div className='col-sm-4 erp_form_col_div'>
                  {/* <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank A/C. NO.</Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" className="erp_input_field" id="bankAccountNo" value={BankAccountNo} onChange={e => { setBankAccountNo(e.target.value); validateNo(e); validateFields(e) }} optional="optional" maxLength="17" />
                      <MDTypography variant="button" id="error_bankAccountNO" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bank IFSC code </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='bankIfscCode' className="erp_input_field" value={BankIfscCode} onChange={e => { setBankIfscCode(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="11" optional="optional" />
                      <MDTypography variant="button" id="error_bankIfscCode" className="erp_validation " fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}


                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">BST NO. </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorBSTNo' className="erp_input_field" value={ContractorBstNo} onChange={e => { setContractorBstNo(e.target.value.split(' ').join('').toUpperCase()); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorBSTNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Payment Term</Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Select size='sm' id='contractorPaymentTermID' className='erp_input_field' value={ContractorPaymentTerm} onChange={() => addRecordInProperty('PaymentTermDays')} optional="optional">
                        <option value=''>Select</option>
                        <option value="0">Add New Record+</option>
                        {
                          PaymentTermId?.map(paymentTerm => (
                            <option value={paymentTerm.field_id}>{paymentTerm.field_name}</option>
                          ))
                        }
                      </Form.Select>
                      <MDTypography variant="button" id="error_contractorPaymentTermID" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4 col-12'>
                      <Form.Label className="erp-form-label"> GL Codes</Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      {/* <Form.Select size='sm' id='cotractorGLCodesId' className='erp_input_field' value={ContractorGLCodes} onChange={() => addRecordInProperty('fmv_general_ledger')} optional="optional">
                        <option value=''>Select</option>
                        <option value="0">Add New Record+</option>
                        { GLCodes?.map(GLCodes => ( <option value={GLCodes.field_name}>{GLCodes.field_name}</option>)) }
                      </Form.Select> */}
                      <div className="select-btn" onClick={() => { FnShowGlCodes() }} optional='optional'>
                        <span className="form-select form-select-sm" id="">
                          {totalSelectedGLCodeCheckboxes !== 0 ? totalSelectedGLCodeCheckboxes + ' Selected GL Codes ' : 'Select GL Code'}
                        </span>
                      </div>
                      <ul className="list-items" id="gl_code_ul">
                        {GLCodesCheckboxes}
                      </ul>

                      <MDTypography variant="button" id="error_cotractorGLCodesId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                    {/* <div className="col-sm-1 col-2">
                      <Tooltip title="Refresh" placement="top">
                        <MDTypography>
                          <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("GLCodes"); }} style={{ color: 'black' }} />
                        </MDTypography>
                      </Tooltip>
                    </div> */}
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">  A/C. ID</Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='contractorAccoutnsId' className="erp_input_field" value={ContractorAccountsId} onChange={e => { setContractorAccountsId(e.target.value); validateFields(e) }} maxLength="50" optional="optional" />
                      <MDTypography variant="button" id="error_contractorAccoutnsId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">  Blocked </Form.Label>
                    </div>
                    <div className="col-sm-8">
                      <div className="erp_form_radio">
                        <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" checked={ContractorBlocked === true} onChange={() => handleBlockedTypeChange('true')} onClick={() => { setContractorBlocked(true); }} name="ContractorBlocked" optional="optional" /> </div>
                        <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" checked={ContractorBlocked === false} onChange={() => handleBlockedTypeChange('false')} onClick={() => { setContractorBlocked(false); }} name="ContractorBlocked" optional="optional" /> </div>
                        {/* <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="1" name="isBlockedActive" checked={isBlockedActive === "1"} onChange={() => handleBlockedTypeChange('1')} onClick={() => setisBlockedActive('1')} optional="optional" /> </div> */}
                        {/* <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="0" name="isBlockedActive" checked={isBlockedActive === "0"} onChange={() => handleBlockedTypeChange('0')} onClick={() => setisBlockedActive('0')} optional="optional" defaultChecked /> </div> */}
                      </div>
                    </div>
                  </div>


                  {
                    ContractorBlocked === true ?
                      <>
                        <div className='row'>
                          <div className='col-sm-4'>
                            <Form.Label className="erp-form-label">  Blocked Remark {ContractorBlocked === true ? <span className="required">*</span> : ''} </Form.Label>
                          </div>
                          <div className='col-sm-8'>
                            <Form.Control as="textarea" rows={1} className={`erp_txt_area ${ContractorBlocked === "true" ? '' : 'optional'} `} id="blockRemarkId" value={ContractorBlockedRemark} onChange={e => { setContractorBlockedRemark(e.target.value); validateFields(e) }} maxlength="255" {...(ContractorBlocked === "false" ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} />
                            <MDTypography variant="button" id="error_blockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                            </MDTypography>
                          </div>
                        </div>
                      </> : ""

                  }


                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">  Payment Blocked </Form.Label>
                    </div>
                    <div className="col-sm-8">
                      <div className="erp_form_radio">
                        <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" checked={ContractorPaymentBlocked === true} onChange={() => handlePaymentBlockedTypeChange('true')} onClick={() => { setContractorPaymentBlocked(true); }} name="ContractorPaymentBlocked" optional="optional" /> </div>
                        <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" checked={ContractorPaymentBlocked === false} onChange={() => handlePaymentBlockedTypeChange('false')} onClick={() => { setContractorPaymentBlocked(false); }} name="ContractorPaymentBlocked" optional="optional" /> </div>

                        {/*  <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="1" name="isPaymentBlockedActive" checked={isPaymentBlockedActive === "1"} onChange={() => handlePaymentBlockedTypeChange('1')} onClick={() => setisPaymentBlockedActive('1')} optional="optional" /> </div>
                        <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="0" name="isPaymentBlockedActive" checked={isPaymentBlockedActive === "0"} onChange={() => handlePaymentBlockedTypeChange('0')} onClick={() => setisPaymentBlockedActive('0')} optional="optional" defaultChecked /> </div> */}
                      </div>
                    </div>
                  </div>



                  {
                    ContractorPaymentBlocked === true ?
                      <>
                        <div className='row'>
                          <div className='col-sm-4'>
                            <Form.Label className="erp-form-label">Payment Blocked Remark {ContractorPaymentBlocked === true ? <span className="required">*</span> : ''} </Form.Label>
                          </div>
                          <div className='col-sm-8'>
                            <Form.Control as="textarea" rows={1} className={`erp_txt_area ${ContractorPaymentBlocked === "true" ? '' : 'optional'} `} id="paymentBlockRemarkId" value={ContractorPaymentBlockedRemark} onChange={e => { setContractorPaymentBlockedRemark(e.target.value); validateFields(e) }} maxlength="255"   {...(ContractorPaymentBlocked === "false" ? { optional: 'optional' } : {})} {...(keyForViewUpdate === 'view' ? { readOnly: true } : {})} />
                            <MDTypography variant="button" id="error_paymentBlockRemarkId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                            </MDTypography>
                          </div>
                        </div>
                      </> : ""

                  }
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">  Rating <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control as="textarea" rows={1} id='contractorRating' className="erp_txt_area" value={ContractorRating} onChange={e => { setContractorRating(e.target.value); validateFields(e) }} maxlength="255" />
                      <MDTypography variant="button" id="error_contractorRating" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Tally ID </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form.Control type="text" id='transporterTallyId' className="erp_input_field" value={ContractorTallyId} onChange={e => { setContractorTallyId(e.target.value); validateFields(e) }} maxlength="50" optional="optional" />
                      <MDTypography variant="button" id="error_transporterTallyId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Is Active </Form.Label>
                    </div>
                    <div className='col-sm-8'>
                      <Form>
                        <div className="erp_form_radio">
                          <div className="fCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="Yes"
                              type="radio"
                              value="1"
                              name="isContractorActive"
                              defaultChecked
                            />
                          </div>
                          <div className="sCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="No"
                              value="0"
                              type="radio"
                              name="isContractorActive"
                            />
                          </div>
                        </div>
                      </Form>
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
                            <select size="sm" id="cmb_contractor_bank_account_type" className="form-select form-select-sm erp_input_field" value={cmb_contractor_bank_account_type} onChange={(e) => { setContractorBankAccountType(e.target.value); validateBankFields() }}>
                              <option value="">Select</option>
                              {bankAccountTypeList?.map(bankAcc => (
                                <option value={bankAcc.field_name}>{bankAcc.field_name}</option>

                              ))}
                            </select>
                            <MDTypography variant="button" id="error_cmb_contractor_bank_account_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
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
                            <Form.Control type="text" className="erp_input_field" id="txt_contractor_bank_branch_name" value={txt_contractor_bank_branch_name} onChange={e => { setContractorBankBranchName(e.target.value); validateBankFields() }} maxLength="255" />
                            <MDTypography variant="button" id="error_txt_contractor_bank_branch_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                            </MDTypography>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-sm-4'>
                            <Form.Label className="erp-form-label">Bank A/C. NO.<span className="required">*</span></Form.Label>
                          </div>

                          <div className='col'>
                            <Form.Control type="text" className="erp_input_field" id="txt_contrator_bank_account_no" value={txt_contrator_bank_account_no} onChange={(e) => {
                              if (validateNumberDateInput.current.isInteger(e.target.value)) {
                                setContractorBankAccountNo(e.target.value)
                              }; validateBankFields();
                            }} maxLength="17" />
                            <MDTypography variant="button" id="error_txt_contrator_bank_account_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                            </MDTypography>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-sm-4'>
                            <Form.Label className="erp-form-label">IFSC NO.<span className="required">*</span></Form.Label>
                          </div>
                          <div className='col'>
                            <Form.Control type="text" className="erp_input_field" id="txt_contractor_bank_ifsc_code" value={txt_contractor_bank_ifsc_code} onChange={e => { setContractotBankIfscCode(e.target.value.split(' ').join('').toUpperCase()); validateBankFields() }} maxLength="11" />
                            <MDTypography variant="button" id="error_txt_contractor_bank_ifsc_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
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
                            <Form.Control type="text" className="erp_input_field" id="txt_contractor_bank_swift_code" value={txt_contractor_bank_swift_code} onChange={e => { setContractorBankSwiftCode(e.target.value); }} maxLength="50" optional='optional' />
                            <MDTypography variant="button" id="error_txt_contractor_bank_swift_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                            </MDTypography>
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-sm-4'>
                            <Form.Label className="erp-form-label">GST NO.</Form.Label>
                          </div>

                          <div className='col'>
                            <Form.Control type="text" className="erp_input_field" id="txt_contractor_bank_gst_no" value={txt_contractor_bank_gst_no} onChange={e => { setContractorBankGstNo(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="50" optional='optional' />
                            <MDTypography variant="button" id="error_txt_contractor_bank_gst_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
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
                            {/* <Form> */}
                            <div className="erp_form_radio">
                              <div className="fCheck">
                                <Form.Check
                                  className="erp_radio_button"
                                  label="Yes"
                                  type="radio"
                                  value="true" checked={txt_is_active === true} onClick={() => { setContractorBankIsActive(true); }}
                                  name="isBankActive"
                                  defaultChecked
                                />
                              </div>
                              <div className="sCheck">
                                <Form.Check
                                  className="erp_radio_button"
                                  label="No"
                                  value="false" checked={txt_is_active === false} onClick={() => { setContractorBankIsActive(false); }}
                                  type="radio"
                                  name="isBankActive"
                                />
                              </div>
                            </div>
                            {/* </Form> */}
                          </div>
                        </div>
                      </div>
                    </div >
                    <div className="text-center my-2">
                      <MDButton type="button" onClick={FnAddContractorBank} className={`btn erp-gb-button ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular">Add Bank</MDButton>
                    </div>
                  </form >

                  {renderContractorBanks}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div className="card-footer py-0 text-center">
              <MDButton type="button" className="erp-gb-button"
                onClick={() => {
                  const path = compType === 'Register' ? '/Masters/ContractorListing/reg' : '/Masters/ContractorListing';
                  navigate(path);
                }}
                variant="button"
                fontWeight="regular">Back</MDButton>

              {keyForViewUpdate !== 'view' ? (
                <MDButton type="submit" className="erp-gb-button erp_MLeft_btn" id="saveBtn" variant="button" fontWeight="regular" onClick={handleSubmit}>  save  </MDButton>) : null}

            </div>
          </div>

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
          <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
            <Modal.Body className='erp_city_modal_body'>
              <div className='row'>
                <div className='col-12 align-self-end'>
                  <button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button>
                </div>
              </div>
              {displayRecordComponent()}
            </Modal.Body>
          </Modal >

          {/* Success Msg Popup */}
          <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

          {/* Error Msg Popup */}
          <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

        </MDBox>
      </DashboardLayout>
    </>
  );

};
export default Contractor;