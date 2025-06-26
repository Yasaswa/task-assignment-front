import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import ConfigConstants from "assets/Constants/config-constant";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// React Bootstrap Imports
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { Table } from "react-bootstrap"

// React icons
import { AiOutlineDownCircle, AiFillEye } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { TbArrowsLeft, TbArrowsDown, TbArrowsUp, TbArrowsRight } from "react-icons/tb";
import { HiOutlineArrowNarrowRight, HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowUp, HiOutlineArrowNarrowDown } from "react-icons/hi";
import { MdModeEdit, MdDelete, MdRefresh } from "react-icons/md";

// Import Files
import PdfExport from 'Features/Exports/PdfExport';
import ExcelExport from "Features/Exports/ExcelExport";
import JsonExport from "Features/Exports/JsonExport";
import CSVExport from "Features/Exports/CSVExport";
import ComboBox from "Features/ComboBox";
import DocumentF from "Features/Document";
import FrmCity from "FrmGeneric/MCity/FrmCity";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { FiDownload } from 'react-icons/fi';
import Datatable from 'components/DataTable';
import FrmValidations from "FrmGeneric/FrmValidations";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import Tooltip from "@mui/material/Tooltip";
import FrmPropertyEntry from "Masters/MProperty/FrmPropertyEntry";
import { CircularProgress } from "@material-ui/core";
import { FaTimes } from "react-icons/fa";
import { RiSearchLine } from "react-icons/ri";


function Branch(props) {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { UserName, USER_ACCESS } = configConstants;
  // const { companyID, UserName, COMPANY_NAME } = configConstants;

  let companyID = sessionStorage.getItem("companyID");
  const [company_branch_id, setCompanyBranchID] = useState();
  let docGroup = "Company"
  const combobox = useRef();
  const validationRef = useRef();
  const validateNumberDateInput = useRef();

  var keyforViewUpdate = sessionStorage.getItem('keyForViewUpdate');
  var compType = sessionStorage.getItem('compType');
  const fnKVU = (keyforViewUpdate) => {
    switch (keyforViewUpdate) {
      case 'view':
        $('#bankform #formbody').hide();
        $('#saveBtn').hide();
        break;
    }
  }

  //Setting hook for key(update , view, delete for view branch & bank branch info) in Branch Entry Page
  const [keyFVUD, setKeyVUD] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // For navigate
  const navigate = useNavigate();

  let operatorLabels = { "=": "is", "!=": "is not", "1": "active", "0": "closed", "o": "open", "!*": "none", "*": "any", "~": "contains", "!~": "doesn't contain", "^": "starts with", "$": "ends with" };
  let operatorByType = {
    "list": ["=", "!="], "status": ["1", "0"], "list_status": ["o", "=", "!", "c", "*"], "list_optional": ["=", "!", "!*", "*"],
    "list_subprojects": ["*", "!*", "=", "!"], "string": ["~", "=", "!~", "!=", "^", "$"], "text": ["~", "!~", "^", "$", "!*", "*"],
    "integer": ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"], "float": ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"],
    "relation": ["=", "!", "=p", "=!p", "!p", "*o", "!o", "!*", "*"], "tree": ["=", "~", "!*", "*"]
  };

  // Option Box
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [branchHeadOptions, setBranchHeadOptions] = useState([]);
  const [branchSubHeadOptions, setBranchSubHeadOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [companyBranchTypeOptions, setCompanyBranchOptions] = useState([]);


  // Form Heading 
  const [formHeading, setFormHeading] = useState('Branch Information');
  const [COMPANY_NAME, setCompanyName] = useState(sessionStorage.getItem('companyLegalName'))

  // Document Form
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const handleCloseDocumentForm = () => setShowDocumentForm(false);
  const viewDocumentForm = () => setShowDocumentForm(true);

  // Table Data fields
  const [data, setBranchs] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modalHeaderName, setHeaderName] = useState('');
  let activeValue;
  let storeSelectedValues = [];

  // Filter Fields
  const [filterComboBox, setFilterComboBox] = useState([]);
  const [recordData, setRecordData] = useState([]);
  // Company Branch Form Fields
  const [BranchName, setBranchName] = useState('');
  const [cmb_company_branch_type, setCompanyBranchType] = useState('');

  const [chkBranchtype, setBranchType] = useState('Main');
  const [ShortName, setShortName] = useState('');
  const [branchAddress1, setBranchAddress1] = useState('');
  const [branchAddress2, setBranchAddress2] = useState('');
  const [OfficePinCode, setOfficePinCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [OfficePhoneNo, setOfficePhoneNo] = useState('');
  const [OfficeCellNo, setOfficeCellNo] = useState('');
  const [OfficeEmail, setOfficeEmail] = useState('');
  const [FacebookProfile, setFacebookProfile] = useState('');
  const [LinkedinProfile, setLinkedinProfile] = useState('');
  const [TwitterProfile, setTwitterProfile] = useState('');
  const [GSTNO, setGSTNO] = useState('');
  const [gstDivision, setGstDivision] = useState('');
  const [GSTDivisionRange, setGSTDivisionRange] = useState('');
  const [PanNo, setPanNo] = useState('');
  const [UdyogAdharNo, setUdyogAdharNo] = useState('');
  const [VatNo, setVatNo] = useState('');
  const [ServiceTaxNo, setServiceTaxNo] = useState('');
  const [ExciseNo, setExciseNo] = useState('');
  const [CSTNo, setCSTNo] = useState('');
  const [BSTNo, setBSTNo] = useState('');
  const [WebSite, setWebSite] = useState('');
  const [TallyId, setTallyId] = useState('');
  const [is_sez, setSez] = useState('');
  const [BranchHeadID, setBranchHeadID] = useState();
  const [BranchSubHeadID, setBranchSubHeadID] = useState();

  //Bank Entry
  // ADD Bank Feilds
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

  // Delete Modal
  const handleClose = () => setShowDeleteModal(false);
  const [showDeletemodal, setShowDeleteModal] = useState(false);

  const [searchState, setGlobalFilterSearch] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')

  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {
      case 'City':
        combobox.current.fillMasterData("cmv_city", "district_id", district).then((propertyList2) => {
          setCityOptions(propertyList2)
        })
        break;
      case 'Company Type':
        combobox.current.fillComboBox("CompanyTypes").then((companyTypes) => {
          setCompanyBranchOptions(companyTypes)
        })
        break;
    }
    setShowAddRecModal(false);

  }
  const [showAddRecModal, setShowAddRecModal] = useState(false);

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Export Fields
  var dataExport = [];
  var columnExport = [];

  const pdfExp = useRef();
  const exlsExp = useRef();
  const jsonExp = useRef();
  const csvExp = useRef();

  var reportName = "Branch Report"
  const pdfExpFilters = {};

  //Pagination Fields 
  const pageEntriesOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "500", value: 500 },
    { label: "All", value: 0 },
  ]
  var [entriesPerPage, setEntriesPerPage] = useState(pageEntriesOptions[2].value);
  let [pageCount, setpageCount] = useState(0);
  var [PageCurrent, setcurrentPage] = useState(0);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [groupByColumns, setGroupByColumns] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  //Pagination Fields For bank
  const [keys, setKeys] = useState('')

  useEffect(() => {
    const functioncall = async () => {
      setIsLoading(true)
      fnKVU(keyforViewUpdate);
      if (keyforViewUpdate === "view") {
        $("input[type=radio]").attr('disabled', true);
        addReadOnlyAttr();
      }

      $('.hide-show-filters').hide();
      setCompanyName(sessionStorage.getItem('companyLegalName'));
      await FillComobos();
      const availCols = await showReportRecords();
      await fetchFilteredData(PageCurrent, entriesPerPage, availCols)
      setIsLoading(false)
    }
    functioncall()


  }, []);

  const displayRecordComponent = () => {
    switch (modalHeaderName) {
      case 'Company Type':
        return <FrmPropertyEntry property_master_name={`CompanyTypes`} btn_disabled={true} />;
      case 'City':
        return <FrmCity property_master_name={`CompanyTypes`} btn_disabled={true} />;
      default:
        return null;
    }
  }


  const FillComobos = async () => {
    debugger
    try {
      var controlName = ["cmv_employee", "cmv_country",]
      if (combobox.current) {
        combobox.current.fillMasterData(controlName[0], "is_delete", "0").then((empList) => {
          setBranchHeadOptions(empList)
          setBranchSubHeadOptions(empList)
        })
        combobox.current.fillMasterData(controlName[1], "is_delete", "0").then((cmv_countryList) => {
          setCountryOptions(cmv_countryList)
        })
      }

      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      setCountryCodeOptions(respCountryCode)

      //Bank starts Here
      const controlNameForBank = ["BankAccountsType", "fmv_currency", "cmv_banks_List"];
      if (combobox.current) {
        combobox.current.fillComboBox(controlNameForBank[0]).then((propertyList1) => {
          setBankAccountTypeOption(propertyList1)
        })
        combobox.current.fillMasterData(controlNameForBank[1], "", "").then((vCurrencyType) => {
          setCurrencyTypeOption(vCurrencyType)
        })
        // combobox.current.fillMasterData(controlNameForBank[2], "", "").then((propertyList3) => {
        //   setBankNameOptionList(propertyList3)
        // })
      }

      resetGlobalQuery();
      globalQuery.columns = ["*"];
      globalQuery.table = "cmv_banks_List";
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      const propertyList3 = await combobox.current.fillFiltersCombo(globalQuery);
      setBankNameOptionList(propertyList3);


      var controlName = ["CompanyTypes"];
      if (combobox.current) {
        combobox.current.fillComboBox(controlName[0]).then((companyTypes) => {
          setCompanyBranchOptions(companyTypes)
        })
      }
    } catch (error) {
      console.log('error', error.message)
      navigate('/Error')
    }
  }

  const FnRefreshbtn = async (key) => {
    switch (key) {
      case 'BranchHead':
        combobox.current.fillMasterData("cmv_employee", "is_delete", "0").then((BranchHeadempList) => {
          setBranchHeadOptions(BranchHeadempList)
        })
        break;
      case 'BranchSubHead':
        combobox.current.fillMasterData("cmv_employee", "is_delete", "0").then((BranchSubHeadempList) => {
          setBranchSubHeadOptions(BranchSubHeadempList)
        })
        break;
      default:
        break;
    }
  }

  const FnCheckUserAccess = () => {
    const currentRoute = window.location.pathname;
    const obj = USER_ACCESS ? USER_ACCESS.find(item => item.listing_navigation_url === currentRoute) : null;
    console.log("Particular Page user access: ", obj);
    return obj;
  }

  const globalSearchOnChange = async () => {
    if (entriesPerPage !== 0) {
      setcurrentPage(0)
      setEntriesPerPage(0)
      await fetchFilteredData(0, 0, selectedColumns.length !== 0 ? selectedColumns : availableColumns)
    }
    setSearchInputValue(searchState)
  }

  const showReportRecords = async () => {
    try {
      const summaryRptApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/report/FnShowAllReportRecords?reportType=${'summary'}&viewName=${'cmv_company_branch_rpt'}`)
      const summaryResponce = await summaryRptApiCall.json();
      console.log("summaryResponce responce: ", summaryResponce)
      if (summaryResponce.content.length !== 0) {
        var rptColumnHeads = summaryResponce.headerKeys;
        setRecordData(summaryResponce.content)
        let filterBox = [];
        let tempOptionBox = []
        for (let colKey = 0; colKey < rptColumnHeads.length; colKey++) {
          const content = summaryResponce.content;
          const columnName = rptColumnHeads[colKey];
          const value = content[columnName];
          if (value !== null) {
            const myArray = value.split(":");

            switch (myArray[2]) {
              case 'Y':
                filterBox.push({ Headers: myArray[1], accessor: columnName });
                tempOptionBox.push({ Headers: myArray[1], accessor: columnName });
                break;
              case 'O':
                tempOptionBox.push({ Headers: myArray[1], accessor: columnName });
                break;
              default:
                break

            }

          }

        }
        setFilterComboBox(filterBox)
        setAvailableColumns(tempOptionBox)
        setGroupByColumns(tempOptionBox)
        return tempOptionBox;
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  const viewUpdateDelete = async (data, key) => {
    var company_branch_Id = data.company_branch_id
    setCompanyBranchID(company_branch_Id)
    switch (key) {
      case 'update':
        setKeys('update')
        await infoForUpdate(company_branch_Id, 'update')
        break;
      case 'delete':
        setShowDeleteModal(true);
        break;
      case 'view':
        setKeys('view')
        await infoForUpdate(company_branch_Id, 'view');
        addReadOnlyAttr();
        break;
      default:
        break;
    }
  }


  const handlePageClick = async (pageNo) => {
    let currentPage = pageNo.selected;
    setcurrentPage(currentPage);
    const commentsFormServer = await fetchFilteredData(currentPage, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
    console.log("commentsFormServer: ", commentsFormServer)

  }

  const handlePageCountClick = async () => {
    let count = document.getElementById("page_entries_id").value;
    setEntriesPerPage(count)
    setcurrentPage(0)
    await fetchFilteredData(0, count, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
  }



  const fetchParticularBranchBanks = async (company_branch_Id, key) => {
    try {
      const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companybank/FnShowParticularRecordForUpdate/${company_branch_Id}/${companyID}`)
      const responce = await apicall.json();
      setBankData(responce);
    } catch (error) {
      console.log(error)
      navigate('/Error')
    }
  }

  const infoForUpdate = async (company_branch_Id, key) => {

    setKeyVUD(key);

    $("#compBranchFormId [id^='error_']").hide();
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companybranch/FnShowParticularRecordForUpdate/${company_branch_Id}`)
      const data = await apiCall.json();
      console.log("Branch Particular document: ", data);
      setCountry(data.branch_country_id)
      await addRecordInProperty('Country')
      setBranchName(data.company_branch_name);
      setCompanyBranchType(data.company_branch_type);
      setBranchType(data.branch_type);
      setShortName(data.branch_short_name);
      setBranchAddress1(data.branch_address1);
      setBranchAddress2(data.branch_address2);
      setOfficePinCode(data.branch_pincode);
      setState(data.branch_state_id);
      await addRecordInProperty('State')
      setDistrict(data.branch_district_id)
      await addRecordInProperty('District')
      setCity(data.branch_city_id);
      setOfficePhoneNo(data.branch_phone_no);
      setOfficeCellNo(data.branch_cell_no);
      setOfficeEmail(data.branch_EmailId);
      setFacebookProfile(data.branch_facebook_profile);
      setLinkedinProfile(data.branch_linkedin_profile);
      setTwitterProfile(data.branch_twitter_profile);
      setGSTNO(data.branch_gst_no);
      setGSTDivisionRange(data.branch_gst_range);
      setGstDivision(data.branch_gst_division);
      setPanNo(data.branch_pan_no);
      setUdyogAdharNo(data.branch_udyog_adhar_no);
      setVatNo(data.branch_vat_no);
      setServiceTaxNo(data.branch_service_tax_no);
      setExciseNo(data.branch_excise_no);
      setCSTNo(data.branch_cst_no);
      setBSTNo(data.branch_bst_no);
      setWebSite(data.branch_website);
      setTallyId(data.branch_tally_id);
      setBranchHeadID(data.branch_head_id);
      setBranchSubHeadID(data.branch_subhead_id);

      setBankData([]);

      switch (data.is_active) {
        case true:
          document.querySelector('input[name="isBranchActive"][value="1"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="isBranchActive"][value="0"]').checked = true;
          break;
        default:
          break;
      }
      switch (data.is_sez) {
        case true:
          document.querySelector('input[name="isSez"][value="1"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="isSez"][value="0"]').checked = true;
          break;
      }
      //Calling Bank Branch Details Function
      fetchParticularBranchBanks(company_branch_Id, key);
      if (key === "update") {
        setFormHeading("Modify Branch")
        $("input[type=radio]").attr('disabled', false);
        $("#branchSaveBtn").attr('disabled', false);
        $("#branchName").attr('disabled', true);
        $("#shortName").attr('disabled', true);
        removeReadAttr();
      } else if (key === "view") {
        setFormHeading("View Branch")
        $("input[type=radio]").attr('disabled', true);
        $("#branchSaveBtn").attr('disabled', true);
        $('#saveBtn').hide();
      }
    } catch (error) {
      console.log('error: ', error)
      navigate('/Error')
    }
  }

  const OpenAddBranch = () => {
    clearFormFields();
    removeReadAttr();
    setCompanyBranchID(0)
    setFormHeading("Branch Information")
    $("#branchSaveBtn").attr('disabled', false);
    $("input[type=radio]").attr('disabled', false);
    $("#branchName").attr('disabled', false);
  }

  const addCompany = async () => {
    debugger
    try {
      var sessionCompdata = localStorage.getItem("FTcompanyData");
      console.log("sessionCompdata: ", JSON.parse(sessionCompdata))
      const compdata = JSON.parse(sessionCompdata)
      const requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compdata)
      };

      const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnAddUpdateRecord`, requestOptions)
      const responce = await apicall.json()
      console.log("response error: ", responce);
      if (responce.error !== "") {
        console.log("response error: ", responce.error);
        setErrMsg(responce.error)
        setShowErrorMsgModal(true)
        return false;
      } else {
        sessionStorage.setItem("companyID", responce.data.company_id);
        console.log("companyID", responce.data.company_id);
        localStorage.removeItem('FTcompanyData')
        localStorage.removeItem('tempFileName')
        return true;
      }
    } catch (error) {
      console.log("error: ", error);
      navigate('/Error')
      return false;
    }
  }

  const addBranch = async (event) => {
    var isValidate = await validate();
    if (isValidate === true) {
      if ($('#tablebranchlist').css('display') === 'none') {
        const checkIsAdded = await addCompany();
        if (checkIsAdded === true) {
          await saveBranch();
        }
      } else {
        await saveBranch();
      }
    }
  }

  const saveBranch = async () => {
    try {
      var active;
      var isSez;
      companyID = sessionStorage.getItem("companyID");

      activeValue = document.querySelector('input[name=isBranchActive]:checked').value
      switch (activeValue) {
        case '0': active = false; break;
        case '1': active = true; break;
      }
      activeValue = document.querySelector('input[name=isSez]:checked').value
      switch (activeValue) {
        case '1': isSez = true; break;
        case '0': isSez = false; break;
      }
      const data = {
        company_id: companyID,
        company_branch_id: company_branch_id,
        company_branch_type: cmb_company_branch_type,
        branch_type: chkBranchtype,
        company_branch_name: BranchName,
        branch_short_name: ShortName,
        branch_address1: branchAddress1,
        branch_address2: branchAddress2,
        branch_country_id: country,
        branch_state_id: state,
        branch_district_id: district,
        branch_city_id: city,
        branch_pincode: OfficePinCode,
        branch_phone_no: OfficePhoneNo,
        branch_cell_no: OfficeCellNo,
        branch_EmailId: OfficeEmail,
        branch_facebook_profile: FacebookProfile,
        branch_linkedin_profile: LinkedinProfile,
        branch_twitter_profile: TwitterProfile,
        branch_gst_no: GSTNO,
        branch_gst_division: gstDivision,
        branch_gst_range: GSTDivisionRange,
        branch_pan_no: PanNo,
        branch_udyog_adhar_no: UdyogAdharNo,
        branch_vat_no: VatNo,
        branch_service_tax_no: ServiceTaxNo,
        branch_excise_no: ExciseNo,
        branch_cst_no: CSTNo,
        branch_bst_no: BSTNo,
        branch_website: WebSite,
        branch_tally_id: TallyId,
        branch_head_id: BranchHeadID,
        branch_subhead_id: BranchSubHeadID,
        is_active: active,
        is_sez: isSez,
        created_by: company_branch_id === 0 ? UserName : null,
        modified_by: company_branch_id !== 0 ? UserName : null
      };

      const forwardData = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
      var response;
      const compBranchApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companybranch/FnAddUpdateRecord`, forwardData)
      response = await compBranchApiCall.json();
      let resp = JSON.parse(response.data)

      if (response.error !== "") {
        setErrMsg(response.error)
        setShowErrorMsgModal(true)

      } else {

        var jsonObj = { 'compAndBrnchId': {}, 'bankIds': {} }
        jsonObj['bankIds'] = dataBank;
        jsonObj['compAndBrnchId']['company_branch_id'] = company_branch_id;
        jsonObj['compAndBrnchId']['company_id'] = companyID;

        const formData = new FormData();

        formData.append(`companyBankJson`, JSON.stringify(jsonObj))
        const forwardFormData = {
          method: 'POST',
          body: formData
        };

        const compBankApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companybank/FnAddUpdateRecord`, forwardFormData)
        const responseBank = await compBankApiCall.json()
        console.log("response: ", responseBank)
        console.log("bank posting jsonObj: ", jsonObj)

        clearFormFields();
        setBankData([]);
        const evitCache = await combobox.current.evitCache();
        console.log(evitCache);
        setSuccMsg(response.message)
        setShowSuccessMsgModal(true)
        const availCols = await showReportRecords();
        await fetchFilteredData(PageCurrent, entriesPerPage, availCols)
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const addRecordInProperty = async (key) => {
    switch (key) {

      case 'companyType':
        var comType = $('#cmb_company_branch_type').val();
        setCompanyBranchType(comType);

        var companyTypeVal = document.getElementById('cmb_company_branch_type').value;

        if (companyTypeVal === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Company Type')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }
        if (comType !== "") { $('#error_cmb_company_branch_type').hide(); }
        break;

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

          const stateList = await combobox.current.fillFiltersCombo(globalQuery)
          setStateOptions(stateList)
          setState('')
          setDistrictOptions([])
          setDistrict('');
          setCityOptions([]);
          setCity('');

        } else if (getCountryId === '') {
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

          const districtList = await combobox.current.fillFiltersCombo(globalQuery)
          setDistrict('');
          setCityOptions([]);
          setCity('');
          setDistrictOptions(districtList)
        } else if (getStateId === '') {
          setDistrictOptions([])
          setCityOptions([]);
          setDistrict('');
          setCity('');
        }
        break;
      case 'District':
        const getDistrictId = document.getElementById('districtId').value;
        setDistrict(getDistrictId)
        if (getDistrictId !== '') {
          $('#error_districtId').hide();

          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name']
          globalQuery.table = "cmv_city"
          globalQuery.conditions.push({ field: "district_id", operator: "=", value: getDistrictId });
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

          const cityList = await combobox.current.fillFiltersCombo(globalQuery)
          setCityOptions(cityList)
        } else if (getDistrictId === '') {
          setCityOptions([]);
          setCity('');
        }
        break;

      case 'City':
        const propertyValCity = document.getElementById('cityId').value;
        if (propertyValCity === '0') {

          setHeaderName('City')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").css({
              "padding-top": "0px"
            });
          }, 200)

        } else {
          setCity(propertyValCity)
          if (propertyValCity !== "") { $('#error_cityId').hide(); }
        }
        break;

      case 'BranchHead':
        const branchHead = document.getElementById('branchHeadId').value;
        setBranchHeadID(branchHead)
        if (branchHead === '0') {
          const newTab = window.open('/Masters/Employees', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }

        if (branchHead !== '') { $('#error_branchHeadId').hide(); }
        break;

      case 'BranchSubHead':
        const branchSubHead = document.getElementById('branchSubHeadId').value;
        setBranchSubHeadID(branchSubHead)
        if (branchSubHead === '0') {
          const newTab = window.open('/Masters/Employees', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }
        if (branchSubHead !== '') { $('#error_branchSubHeadId').hide(); }
        break;
      default:
        break;
    }
  }

  const deleteBranch = async () => {
    try {
      const method = { method: 'POST' }
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companybranch/FnDeleteRecord/${company_branch_id}/${UserName}`, method)
      const response = await apiCall.json();
      setShowDeleteModal(false)
      clearFormFields();
      OpenAddBranch();
      await fetchFilteredData(PageCurrent, entriesPerPage);
    } catch (error) {
      console.log('error:', error);
      navigate('/Error')
    }
  }

  const clearFormFields = () => {
    setBranchName('');
    setCompanyBranchType('');
    setShortName('');
    setBranchAddress1('');
    setBranchAddress2('');
    setOfficePinCode('');
    setState('');
    setCity('');
    setCountry('');
    setDistrict('');
    setOfficePhoneNo('');
    setOfficeCellNo('');
    setOfficeEmail('');
    setFacebookProfile('');
    setLinkedinProfile('');
    setTwitterProfile('');
    setGSTNO('');
    setGSTDivisionRange('');
    setGstDivision('');
    setPanNo('');
    setUdyogAdharNo('');
    setVatNo('');
    setServiceTaxNo('');
    setExciseNo('');
    setCSTNo('');
    setBSTNo('');
    setWebSite('');
    setTallyId('');
    setBranchHeadID('');
    setBranchSubHeadID('');
    setStateOptions([]);
    setDistrictOptions([])
    setCityOptions([]);

    // $('input:checkbox[name=isSez]').removeAttr('checked');
    $("input[name='isSez'][value='0']").prop('checked', true);
    $("input[name='isBranchActive'][value='1']").prop('checked', true);

  }

  //-----------------------------------------Bank Entry Starts Here-------------------------------------------//
  const FnAddBank = async () => {
    // 
    const checkIsBankValidate = await validateBankForm();
    if (checkIsBankValidate == true) {
      $('#error_bankNameId').text('This Bank already exits!').hide();
      const contactData = {
        company_id: companyID,
        company_branch_id: company_branch_id,
        bank_id: $('#bankNameId').val(),
        company_branch_bank_account_type: $('#accountTypeId').val(),
        company_branch_bank_name: $('#bankNameId option:selected').text(),
        company_branch_bank_branch_name: bankBranchName,
        company_branch_bank_account_no: $('#bankAccountNo').val(),
        company_branch_bank_ifsc_code: bankIfscNo,
        company_branch_bank_swift_code: bankSwiftCode,
        company_branch_bank_gst_no: bankGstNo,
        currency_type: $('#currencyType').val(),
        is_active: is_bankActive
      }

      const isDuplicate = dataBank.some((item) => item.company_branch_bank_name === contactData.company_branch_bank_name);
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
        setInterval(function () {
          $('#error_bankNameId').text('This Bank already exits!').hide();
        }, 3000);
      }
    }
  }

  const renderTransporterBanks = useMemo(() => {
    // 
    return <>
      {keyFVUD === 'view' ? null : <hr />}
      {dataBank.length !== 0 ?
        <Table className="erp_table" responsive bordered striped>
          <thead className="erp_table_head">
            <tr>
              <th className="erp_table_th" style={{ width: '40px' }}>Sr. No</th>
              <th className={keyFVUD === 'view' ? "erp_table_th d-none" : "erp_table_th"}>Action</th>
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
            {dataBank?.map((bankItem, index) => (
              <tr key={index}>
                <td className="erp_table_td">{index + 1}</td>
                <td className={`erp_table_td ${keyFVUD === 'view' ? "d-none" : "display"}`}>
                  <MdDelete className="erp-delete-btn" onClick={() => deleteBank(index)} />
                </td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_account_type}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_name}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_branch_name}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_account_no}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_ifsc_code}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_swift_code}</td>
                <td className="erp_table_td text-end">{bankItem.company_branch_bank_gst_no}</td>
                <td className="erp_table_td text-end">{bankItem.currency_type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        : null}</>

  }, [dataBank])

  const deleteBank = (indexToRemove) => {
    const updatedDataBank = dataBank.filter((item, index) => index !== indexToRemove);
    setBankData(updatedDataBank);

  }

  //Validations
  // validation field
  const validate = () => {
    return validationRef.current.validateForm('compBranchFormId');
  }

  const validateBankForm = () => {
    return validationRef.current.validateForm('bankform');
  }
  const validateFields = () => {
    return validationRef.current.validateFieldsOnChange('compBranchFormId');
  }
  const validateBankFields = () => {
    return validationRef.current.validateFieldsOnChange('bankform');
  }
  const addReadOnlyAttr = () => {
    return validationRef.current.readOnly('compBranchFormId');
  }
  const removeReadAttr = () => {
    return validationRef.current.removeReadOnlyAttr('compBranchFormId');
  }

  const validateEmail = (email) => {

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      $('#error_email').text('Please enter proper email').show();
    } else {
      $('#error_email').hide();
    }
  }

  const validateNo = (noKey) => {
    const regexNo = /^[0-9\b]+$/;
    const value = noKey.target.value
    switch (noKey.target.id) {
      case 'pinCode':
        if (regexNo.test(value) || value === '') {
          setOfficePinCode(value)
        }
        break;
      case 'phoneNo':
        if (regexNo.test(value) || value === '') {
          setOfficePhoneNo(value)
        }
        break;
      case 'cellNo':
        if (regexNo.test(value) || value === '') {
          setOfficeCellNo(value)
        }
        break;
    }
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

  const reload = () => {
    window.location.reload();
  }

  // <!------------Filter Start------------!>

  const addSelectedColumns = () => {
    const selectedOption = document.getElementById("availableColumns");
    const selectedValue = selectedOption.value;
    if (selectedValue) {
      const selectedColumn = availableColumns.find(column => column.accessor === selectedValue);
      if (selectedColumn) {
        setAvailableColumns(availableColumns.filter(column => column.accessor !== selectedValue));
        setSelectedColumns([...selectedColumns, selectedColumn]);
      }
    }
  }

  const moveAllToSelectedColumns = () => {
    setSelectedColumns([...selectedColumns, ...availableColumns]);
    setAvailableColumns([]);
  }
  const addAvailableColumns = () => {
    const selectedOption = document.getElementById("selectedColumns");
    const selectedValue = selectedOption.value;
    if (selectedValue) {
      const selectedColumn = selectedColumns.find(column => column.accessor === selectedValue);
      if (selectedColumn) {
        setAvailableColumns([...availableColumns, selectedColumn]);
        setSelectedColumns(selectedColumns.filter(column => column.accessor !== selectedValue));
      }
    }
  }
  const moveAllToAvailableColumns = () => {
    // Move all selected columns to available columns
    setAvailableColumns([...availableColumns, ...selectedColumns]);

    // Clear the selected columns
    setSelectedColumns([]);
  };

  const moveOptionTop = () => {
    const selectedIndex = selectedColumns.findIndex(column => column.accessor === selectedValue);
    if (selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      const movedColumn = newSelectedColumns.splice(selectedIndex, 1)[0];
      setSelectedColumns([movedColumn, ...newSelectedColumns]);
    }
  };

  const moveOptionBottom = () => {
    const selectedIndex = selectedColumns.findIndex(column => column.accessor === selectedValue);
    if (selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      const movedColumn = newSelectedColumns.splice(selectedIndex, 1)[0];
      setSelectedColumns([...newSelectedColumns, movedColumn]);
    }
  };


  const moveOptionUp = () => {
    const selectedIndex = selectedColumns.findIndex(column => column.accessor === selectedValue);

    if (selectedIndex > 0) {
      const newSelectedColumns = [...selectedColumns];
      [newSelectedColumns[selectedIndex], newSelectedColumns[selectedIndex - 1]] = [newSelectedColumns[selectedIndex - 1], newSelectedColumns[selectedIndex]];
      setSelectedColumns(newSelectedColumns);
    }
  };

  const moveOptionDown = () => {
    const selectedIndex = selectedColumns.findIndex(column => column.accessor === selectedValue);

    if (selectedIndex < selectedColumns.length - 1 && selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      [newSelectedColumns[selectedIndex], newSelectedColumns[selectedIndex + 1]] = [newSelectedColumns[selectedIndex + 1], newSelectedColumns[selectedIndex]];
      setSelectedColumns(newSelectedColumns);
    }
  };

  const addFilterSelect = async () => {
    debugger
    let masterList;
    let filterText = document.getElementById('add_filter_select');
    if (filterText.value !== '0') {
      document.querySelectorAll("#add_filter_select option").forEach(opt => {
        if (opt.value === filterText.value) {
          opt.disabled = true;
        }
      });
      const value = recordData[filterText.value];
      const myArray = value.split(":");
      const newFilter = {
        id: filterText.value,
        label: myArray[1],
        type: myArray[3],
        dataKey: myArray[5],
        operatorArray: [],
        dataArray: []
      };
      switch (myArray[3]) {
        case 'C':
          if (myArray[5] === 'O') {
            resetGlobalQuery();
            globalQuery.columns.push(`DISTINCT (${filterText.value})`);
            if (!(myArray[4] === 'cmv_city' || myArray[4] === 'cmv_country' || myArray[4] === 'cmv_district' || myArray[4] === 'cmv_state')) {
              globalQuery.conditions.push({
                field: "company_id",
                operator: "=",
                value: companyID
              });
            }
            globalQuery.conditions.push({
              field: "is_delete",
              operator: "=",
              value: 0
            });
            globalQuery.table = myArray[4]
            masterList = await combobox.current.fillFiltersCombo(globalQuery)
          } else {
            masterList = await combobox.current.fillMasterData(myArray[4], "", "")
          }

          newFilter.operatorArray = operatorByType.list
          newFilter.dataArray = masterList
          break;
        case 'P':
          let propertyList = await combobox.current.fillComboBox(myArray[3])
          newFilter.operatorArray = operatorByType.list
          newFilter.dataArray = propertyList
          break;
        case 'T':
          newFilter.operatorArray = operatorByType.string
          break;
        case 'H':
          // Extracting values within parentheses from the last element
          const valuesInParentheses = myArray[myArray.length - 1].slice(1, -1);
          // Splitting the string into an array of values
          const resultArray = valuesInParentheses.split(',');
          console.log(resultArray);
          newFilter.operatorArray = operatorByType.list
          newFilter.dataArray = resultArray
          break;
        case 'D':
          newFilter.operatorArray = operatorByType.date
          break;
      }
      // Update the state with the new filter
      setSelectedFilters(prevFilters => [...prevFilters, newFilter]);
    }
  }

  const removeFilter = (filterId) => {
    // Remove the filter from the state
    setSelectedFilters(prevFilters => prevFilters.filter(filter => filter.id !== filterId));
    document.querySelectorAll("#add_filter_select option").forEach(opt => {
      if (opt.value === filterId) {
        opt.disabled = false;
      }
    });
    $("#add_filter_select").val('0');
  };

  const submitQuery = async (availCols) => {
    try {
      const requiredColumns = ['company_branch_id', 'branch_type']

      let selectBox = document.getElementById("selectedColumns");
      let group_by = document.getElementById("group_by").value;
      let jsonQuery = { 'viewname': {}, 'selectQuery': {}, 'whereQuery': {}, 'operators': {}, 'group_by': {}, "additionalParam": {}, "orderBy": {} };
      storeSelectedValues = []
      if (selectBox.length !== 0) {
        let selectOrder = []; // Array to store the order of elements
        let storeSelectedValues = []; // Assuming this is defined somewhere in your code

        // Loop through selectBox to populate selectQuery and selectOrder
        for (let index = 0; index < selectBox.length; index++) {
          let optionValue = selectBox.options[index].value;
          jsonQuery['selectQuery'][index] = optionValue;
          selectOrder.push(index); // Store the index in the order array
          storeSelectedValues.push(optionValue);
        }

        // Loop through requiredColumns to add missing elements in the specified order
        for (let index = 0; index < requiredColumns.length; index++) {
          const element = requiredColumns[index];
          if (!jsonQuery.selectQuery.hasOwnProperty(element)) {
            // Add the element at the end of the order array and assign the value
            selectOrder.push(selectOrder.length);
            jsonQuery['selectQuery'][selectOrder.length - 1] = element;
          }
        }

        // Now, construct the final selectQuery object using the specified order
        let finalSelectQuery = {};
        for (let orderIndex of selectOrder) {
          finalSelectQuery[orderIndex] = jsonQuery['selectQuery'][orderIndex];
        }

        // Replace the original selectQuery with the finalSelectQuery
        jsonQuery['selectQuery'] = finalSelectQuery;


      } else {
        for (let index = 0; index < availCols.length; index++) {
          let optionValue = availCols[index].accessor;
          jsonQuery['selectQuery'][optionValue] = optionValue;
        }
      }

      for (let selIndex = 0; selIndex < selectedFilters.length; selIndex++) {
        let fieldvalue = selectedFilters[selIndex].id.trim()
        let operatorSelectValue = document.getElementById(`operators_${fieldvalue}_id`).value;
        let valueSelectValue = document.getElementById(`values_${fieldvalue}_id`).value;
        if (selectedFilters[selIndex].type === 'T') {
          switch (operatorSelectValue) {
            case '~':
              operatorSelectValue = "LIKE"
              valueSelectValue = "%" + valueSelectValue + "%";
              break;
            case '!~':
              operatorSelectValue = "NOT LIKE"
              valueSelectValue = "%" + valueSelectValue + "%";
              break;
            case '^':
              operatorSelectValue = "LIKE"
              valueSelectValue = "%" + valueSelectValue;
              break;
            case '$':
              operatorSelectValue = "LIKE"
              valueSelectValue = valueSelectValue + "%";
              break;
            default:
              break;
          }
        }



        if (selectedFilters[selIndex].type === 'D' && operatorSelectValue === '<>=') {
          if (document.getElementById(`values_${fieldvalue}_id_2`).value !== '' && document.getElementById(`values_${fieldvalue}_id`).value !== '') {
            valueSelectValue = `${document.getElementById(`values_${fieldvalue}_id_2`).value}`
            operatorSelectValue = `BETWEEN '${document.getElementById(`values_${fieldvalue}_id`).value}' AND `
            // this for display filters on reports
            pdfExpFilters[selectedFilters[selIndex].label] = valueSelectValue + ` BETWEEN ` + `${document.getElementById(`values_${fieldvalue}_id`).value}`;
          } else {
            continue;
          }

        } else {
          // this for display filters on reports
          pdfExpFilters[selectedFilters[selIndex].label] = valueSelectValue;
        }
        jsonQuery['whereQuery'][fieldvalue] = valueSelectValue;
        jsonQuery['operators'][fieldvalue] = operatorSelectValue;
      }
      jsonQuery['group_by']["GROUP BY"] = group_by;
      jsonQuery['additionalParam']['is_delete'] = "0";
      jsonQuery['additionalParam']['company_id'] = companyID;
      jsonQuery['viewname']['cmv_company_branch'] = 'cmv_company_branch';
      jsonQuery['orderBy']['ORDER BY'] = 'company_branch_id';

      let executeQuery = JSON.stringify(jsonQuery)
      return executeQuery;

    } catch (error) {
      console.log("error", error);
      navigate('/Error')
    }
  }

  function toggleFilter() {
    $(this).text(function (_, currentText) {
      return currentText == "▼" ? "▲" : "▼";
    });
    $('.hide-show-filters').toggle('fast');
  };

  const [selectedFilters, setSelectedFilters] = useState([])


  const fetchFilteredData = async (page, size, availCols) => {
    try {
      setIsLoading(true)
      const executeQuery = await submitQuery(availCols);
      const formData = new FormData();
      formData.append(`jsonQuery`, executeQuery)
      const requestOptions = { method: 'POST', body: formData };
      const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/filter/FnMShowFilterRecords/${page}/${size}`, requestOptions)
      const responce = await fetchResponse.json();
      console.log("Responce when fetch FilteredData : ", responce)
      var nColumn = [];
      if (responce.content.length > 0) {
        $('#NoRcrdId').hide();
        const total = responce.totalElements;
        setpageCount(parseInt(size) !== 0 ? Math.ceil(total / size) : 1);

        // Get column Name & Accessor
        let colNameAccessor;
        let colNameHeader;

        for (let colKey = 0; colKey < availCols.length; colKey++) {
          colNameAccessor = availCols[colKey].accessor
          colNameHeader = availCols[colKey].Headers
          if (colKey === 0) {
            nColumn.push({
              Headers: "Action", accessor: "Action",
              Cell: row => (
                <div style={{ display: "flex" }}>
                  <AiFillEye className="erp-view-btn" onClick={e => viewUpdateDelete(row.original, 'view')} />
                  {compType === 'Register' ?
                    null : <>
                      <MdModeEdit className="erp-edit-btn" onClick={e => viewUpdateDelete(row.original, 'update')} />
                      <MdDelete className="erp-delete-btn" onClick={e => viewUpdateDelete(row.original, 'delete')} />
                    </>
                  }
                </div>
              ),
            });
          }
          nColumn.push({ Headers: colNameHeader, accessor: colNameAccessor });

        }
        $("#tablebranchlist").show();
        $('#filter_display_controls').show();
        $('#display_exports').show();
        $('#filter_display').show();
        setColumns(nColumn);
        setBranchs(responce.content)
        let BranchTypeObj = responce.content.find(item => item.branch_type === 'Main')
        if (BranchTypeObj.branch_type === 'Main') {
          setBranchType('Sub');
          $('[name="chkBranchtype"]').attr('disabled', true);
        }
        console.log("responce :", BranchTypeObj.branch_type)
      } else {
        setColumns([]);
        setBranchs([])
        $('#NoRcrdId').show();

        if (companyID !== '' && companyID !== null && companyID !== 'undefined') {
          $("#tablebranchlist").show();
          $('#filter_display_controls').show();
          $('#display_exports').show();
          $('#filter_display').show();
        } else {
          $("#tablebranchlist").hide();
          $('#filter_display_controls').hide();
          $('#display_exports').hide();
          $('#filter_display').hide();
        }

      }
      return responce;
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }

  };

  const fetchFilteredDataToExport = async (availCols) => {
    try {
      setIsLoading(true)
      const executeQuery = submitQuery(availCols);
      const formData = new FormData();
      formData.append(`jsonQuery`, executeQuery)
      const requestOptions = { method: 'POST', body: formData };
      const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/filter/FnShowFilterRecords`, requestOptions)
      const responce = await fetchResponse.json();
      let filterColumnsToExport = [];

      if (responce.content.length > 0) {
        // Get column Name & Accessor
        let colNameAccessor;
        let colNameHeader;

        for (let colKey = 0; colKey < availCols.length; colKey++) {
          colNameAccessor = availCols[colKey].accessor
          colNameHeader = availCols[colKey].Headers

          filterColumnsToExport.push({ Headers: colNameHeader, accessor: colNameAccessor });
        }

        dataExport = responce.content
        columnExport = filterColumnsToExport
      } else {
        dataExport = []
        columnExport = []
      }
      return responce;
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }

  };

  // <!------------Filter end------------!>
  const exporttoPdf = async () => {
    try {
      setIsLoading(true)
      await fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      const filtrdata = await fetchFilteredDataToExport(selectedColumns.length !== 0 ? selectedColumns : availableColumns);

      if (filtrdata.length !== 0) {
        var filtrObjKeys = Object.keys(pdfExpFilters);
        for (let objKey = 0; objKey < filtrObjKeys.length; objKey++) {
          var key = filtrObjKeys[objKey];
          var value = pdfExpFilters[key];
        }
      }
      if (dataExport.length !== 0) {
        pdfExp.current.pdf(dataExport, columnExport, reportName, pdfExpFilters)
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }

  const exporttoExcel = async () => {
    try {
      setIsLoading(true)
      await fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      const filtrdata = await fetchFilteredDataToExport(selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      if (dataExport.length !== 0) {
        var jsonToExportExcel = { 'allData': {}, 'columns': columnExport, 'filtrKeyValue': {}, 'headings': {}, 'key': 'reportExport' }

        if (filtrdata.length !== 0) {
          var filtrObjKeys = Object.keys(pdfExpFilters);
          for (let objKey = 0; objKey < filtrObjKeys.length; objKey++) {
            var key = filtrObjKeys[objKey];
            var value = pdfExpFilters[filtrObjKeys[objKey]];
            jsonToExportExcel['filtrKeyValue'][objKey] = key + ' : ' + value
          }
        }

        for (let arrKey = 0; arrKey < dataExport.length; arrKey++) {
          jsonToExportExcel['allData'][arrKey] = dataExport[arrKey];
        }
        jsonToExportExcel['headings']['ReportName'] = reportName
        jsonToExportExcel['headings']['CompanyName'] = COMPANY_NAME
        jsonToExportExcel['headings']['CompanyAddress'] = sessionStorage.getItem('companyAddress')

        console.log("jsonToExportExcel: ", jsonToExportExcel)
        exlsExp.current.excel(jsonToExportExcel, reportName)
      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }

  const exporttoJSON = async () => {
    try {
      setIsLoading(true)
      await fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      await fetchFilteredDataToExport(selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      if (dataExport.length !== 0) {
        let data = dataExport.map(element => {
          return columnExport.reduce((dataJson, col) => {
            dataJson[col.accessor] = element[col.accessor];
            return dataJson;
          }, {});
        });
        jsonExp.current.json(data, reportName)
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }


  const exportToCSV = async () => {
    try {
      setIsLoading(true)
      await fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      await fetchFilteredDataToExport(selectedColumns.length !== 0 ? selectedColumns : availableColumns);
      if (dataExport.length !== 0) {
        let data = dataExport.map(element => {
          return columnExport.reduce((dataJson, col) => {
            dataJson[col.accessor] = element[col.accessor];
            return dataJson;
          }, {});
        });
        csvExp.current.csv(data, columnExport, reportName)
      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }

  const FnRenderAdditionalInputsOnDateChange = (filter) => {
    if (filter.type === 'D' && document.getElementById(`operators_${filter.id}_id`).value === '<>=') {
      const filterTblRow = document.getElementById(`${filter.id}`);
      const filterTblRowTd = document.createElement('td');

      // Create the first input element
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.id = `values_${filter.id}_id_2`;
      dateInput.className = 'erp_form_control erp_input_field inputValue erp_operator_val ms-4';

      filterTblRowTd.appendChild(dateInput);
      filterTblRow.appendChild(filterTblRowTd);
    } else {
      // Remove the existing td if it exists
      const existingTd = document.getElementById(`values_${filter.id}_id_2`);
      if (existingTd) {
        existingTd.parentNode.removeChild(existingTd);
      }
    }
    return null;
  };

  return (
    <>
      <ComboBox ref={combobox} />
      <PdfExport ref={pdfExp} />
      <ExcelExport ref={exlsExp} />
      <JsonExport ref={jsonExp} />
      <CSVExport ref={csvExp} />
      <FrmValidations ref={validationRef} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <>
        {isLoading ?
          <div className="spinner-overlay"  >
            <div className="spinner-container">
              <CircularProgress color="primary" />
              <span id="spinner_text" className="text-dark">Loading...</span>
            </div>
          </div> :
          null}
        <div className='main_heding'>
          <label className='erp-form-label-lg main_heding'>{COMPANY_NAME} </label>
        </div>
        <div id='filter_display' style={{ display: 'none' }}>
          <button className="erp_toggle-filter" onClick={toggleFilter}><AiOutlineDownCircle className="rotate_filtr_arrow" />
            <MDTypography component="label" className="erp-form-label-md-lg" variant="button" >
              &nbsp; filters
            </MDTypography></button>
          <div className="hide-show-filters card filter">
            <div className="row">

              <div className="col-sm-6 erp_filter_table_avl_col" >
                <div className='container shadow h-100 rounded erp_group-resl_container'>
                  <div className='row erp_filter_row_tab_view'>
                    <div className='col-sm-4'>
                      <span>
                        <MDTypography component="label" variant="button" className="erp-form-label-md">
                          Available Columns
                        </MDTypography>
                        <select size="10" id="availableColumns" className="erp_form-select-sm-filter erp_form-select-filter">
                          {availableColumns?.map(column => (
                            <option value={column.accessor}>  {column.Headers} </option>
                          ))}
                        </select>

                      </span>
                    </div>

                    <div className='col-sm-1'>
                      <div className="buttons" id="buttons_row1">
                        <TbArrowsRight size={15} className='buttons_move erp_filtr_moveBtn' onClick={moveAllToSelectedColumns} /><br></br>
                        <HiOutlineArrowNarrowRight size={15} className='buttons_move erp_filtr_moveBtn' onClick={addSelectedColumns} /><br></br>
                        <HiOutlineArrowNarrowLeft size={15} className='buttons_move erp_filtr_moveBtn' onClick={addAvailableColumns} /><br></br>
                        <TbArrowsLeft size={15} className='buttons_move erp_filtr_moveBtn' onClick={moveAllToAvailableColumns} />
                      </div>
                    </div>

                    <div className='col-sm-4'>
                      <div className="col">
                        <MDTypography component="label" variant="button" className="erp-form-label-md">
                          Selected Columns
                        </MDTypography>

                        <select size="10" id="selectedColumns" className="erp_form-select-sm-filter erp_form-select-filter" onChange={e => setSelectedValue(e.target.value)}>
                          {selectedColumns.map((column, index) => (
                            <option key={index} value={column.accessor}>{column.Headers}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-1'>
                      <div className="buttons" id="buttons_row2">
                        <TbArrowsUp size={15} className="erp_filtr_moveBtn" onClick={moveOptionTop} /><br></br>
                        <HiOutlineArrowNarrowUp size={15} className="erp_filtr_moveBtn" onClick={moveOptionUp} /><br></br>
                        <HiOutlineArrowNarrowDown size={15} className="erp_filtr_moveBtn" onClick={moveOptionDown} /><br></br>
                        <TbArrowsDown size={15} className="erp_filtr_moveBtn" onClick={moveOptionBottom} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>



              <div className="col-sm-6 erp_filter_group-by-result">
                <div className='container shadow h-100 rounded erp_group-resl_container'>

                  <div className='row erp_group-reslut-by'>
                    <div className='col-sm-3 filtr_gropBy'>
                      <MDTypography
                        className="erp-form-label-md"
                        component="label"
                        variant="button"
                      >Group results by</MDTypography>
                    </div>
                    <div className='col filtr_gropBy'>
                      <Form.Select size="sm" className="erp_form_control operatorSelect" id="group_by">
                        <option value=""></option>
                        {groupByColumns?.map(column => (
                          <option value={column.accessor}> {column.Headers} </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                  <div className="row add-filter add_filter_div">
                    <div className='col-sm-3'>
                      <MDTypography component="label" variant="button" className="erp-form-label-md">
                        Add Filter
                      </MDTypography>
                    </div>
                    <div className="col">
                      <Form.Select size="sm" onChange={addFilterSelect} className="erp_form_control group_by operatorSelect erp_add_filter" id="add_filter_select" >
                        <option value="0"></option>
                        {filterComboBox?.map(column => (
                          <option value={column.accessor}>{column.Headers}</option>

                        ))}
                      </Form.Select>
                    </div>
                  </div>

                  <table id="filters-table" className='erp-filters-table-scroll'>
                    <tbody>
                      {selectedFilters.map(filter => (
                        <tr id={filter.id} key={filter.id}>
                          <td>
                            <input
                              type="checkbox"
                              id={`cb_${filter.id}_id`}
                              value={filter.id}
                              checked
                              onClick={() => removeFilter(filter.id)}
                            />
                            <label className='erp-form-label'>&nbsp;{filter.label}</label>
                          </td>
                          {/* Operators */}
                          <td>
                            {(filter.type === 'C' || filter.type === 'P' || filter.type === 'H') && (
                              <select id={`operators_${filter.id}_id`} className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control">
                                {filter.operatorArray.map(operator => (
                                  <option key={operator} value={operator}>
                                    {operatorLabels[operator]}
                                  </option>
                                ))}
                              </select>
                            )}
                            {filter.type === 'T' && (
                              <select id={`operators_${filter.id}_id`} className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control">
                                {filter.operatorArray.map(operator => (
                                  <option key={operator} value={operator}>
                                    {operatorLabels[operator]}
                                  </option>
                                ))}
                              </select>
                            )}

                            {filter.type === 'D' && (
                              <select id={`operators_${filter.id}_id`} className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control" onChange={() => FnRenderAdditionalInputsOnDateChange(filter)}>
                                {filter.operatorArray.map(operator => (
                                  <option key={operator} value={operator}>
                                    {operatorLabels[operator]}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          {/* Values */}
                          <td>
                            {filter.type === 'C' && (
                              <select
                                id={`values_${filter.id}_id`}
                                className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                              >
                                {filter.dataArray.map((item, index) => (
                                  <option
                                    key={index}
                                    value={filter.dataKey === 'O' ? item[filter.id] : item.field_name}
                                  >
                                    {filter.dataKey === 'O' ? item[filter.id] : item.field_name}
                                  </option>
                                ))}
                              </select>
                            )}

                            {filter.type === 'P' && (
                              <select id={`values_${filter.id}_id`} className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control">
                                {filter.dataArray.map((item, index) => (
                                  <option key={index} value={item.field_name}>
                                    {item.field_name}
                                  </option>
                                ))}
                              </select>
                            )}
                            {filter.type === 'T' && (
                              <input type="text" id={`values_${filter.id}_id`} className='erp_form_control erp_input_field inputValue erp_operator_val' />

                            )}
                            {filter.type === 'D' && (<>
                              <input type="date" id={`values_${filter.id}_id`} className='erp_form_control erp_input_field inputValue erp_operator_val' />
                            </>
                            )}
                            {filter.type === 'H' && (
                              <select id={`values_${filter.id}_id`} className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control">
                                {filter.dataArray.map((operator, index) => (
                                  <option key={index} value={operator}>
                                    {operator}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row btn_row_class">
          <div className="col-sm-8" >
            <MDButton className={`btn erp-gb-button ${compType === 'Register' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={OpenAddBranch}>Add</MDButton> &nbsp;
            <MDButton class="btn erp-gb-button" variant="button" fontWeight="regular" onClick={() => fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns)}>Apply Filter</MDButton> &nbsp;
            <MDButton class="btn erp-gb-button" variant="button" fontWeight="regular" onClick={reload}>Clear Filter</MDButton>&nbsp;
            <span className="page_entries">
              <MDTypography component="label" variant="button" className="erp-form-label-md">Entries per page: &nbsp;</MDTypography>

              <Form.Select onChange={handlePageCountClick} value={entriesPerPage} className="erp_page_select erp_form_control" id="page_entries_id" >
                {pageEntriesOptions.map(pageEntriesOptions => (
                  <option value={pageEntriesOptions.value}>{pageEntriesOptions.label}</option>

                ))}
              </Form.Select>
            </span>
          </div>

          <div className="col-4 pagination_id" id="display_exports" style={{ display: 'none' }}>
            <span className="exports">
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoPdf()}>PDF<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoExcel()}>EXCEL<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exportToCSV()}>CSV<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoJSON()}>JSON<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
            </span>
          </div>
        </div>
      </ >


      {data.length !== 0 ? <>
        <div className="row mt-1">
          <div className="col-sm-3">
            <div class="input-group">
              <input type="text" className='erp_input_field form-control' style={{ height: '30px' }} value={searchState || ''}
                onChange={(e) => setGlobalFilterSearch(e.target.value)} placeholder="Search!..." aria-describedby="basic-addon2" />
              <span class="input-group-text" id="basic-addon2" onClick={() => { setSearchInputValue(''); setGlobalFilterSearch('') }}><FaTimes /></span>
            </div>
          </div>
          <div className="col-sm-1">
            <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => globalSearchOnChange()}> <RiSearchLine className="erp-download-icon-btn" /> </MDButton>
          </div>
        </div>
        <Datatable data={data} columns={columns} freezeColumnCount={5} stateValue={searchInputValue} />

        {pageCount !== 1 ?
          <ReactPaginate
            className='erp_pagination'
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link erp-gb-button"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link erp-gb-button"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link erp-gb-button"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"} /> : null}
      </> : <Card id="NoRcrdId" >
        <Card.Body>No records found...</Card.Body>
      </Card>}
      <hr />
      {/* Add Branch Form */}
      <div className='card' id="addFormOpen">
        <Accordion defaultActiveKey="0" >
          <Accordion.Item eventKey="0">
            <Accordion.Header className="erp-form-label-md">{formHeading}</Accordion.Header>
            <Accordion.Body>
              <form id='compBranchFormId'>
                <div className='row'>
                  {/* 1st */}
                  <div className='col-sm-4 erp_form_col_div'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Name<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="branchName" className="erp_input_field" value={BranchName} onChange={e => { setBranchName(e.target.value); validateFields() }} maxLength="255" />
                        <MDTypography variant="button" id="error_branchName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Company Branch Type<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <select size="sm" id="cmb_company_branch_type" className="form-select form-select-sm" value={cmb_company_branch_type} onChange={() => addRecordInProperty("companyType")}>
                          <option value="">Select</option>
                          <option value="0">Add New Record+</option>
                          {companyBranchTypeOptions?.map(companyType => (
                            <option value={companyType.field_name}>{companyType.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_company_branch_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label"> Branch Type </Form.Label>
                      </div>
                      <div className="col-sm-8">
                        <div className="erp_form_radio">
                          <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Main" type="radio" lbl="Main" value={chkBranchtype} checked={chkBranchtype === "Main"} onClick={() => { setBranchType("Main"); }} name="chkBranchtype" defaultChecked /> </div>
                          <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="Sub" type="radio" lbl="Sub" value={chkBranchtype} checked={chkBranchtype === "Sub"} onClick={() => { setBranchType("Sub"); }} name="chkBranchtype" /> </div>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="shortName" className="erp_input_field" value={ShortName} onChange={e => { setShortName(e.target.value.toUpperCase()); validateFields() }} maxLength="5" />
                        <MDTypography variant="button" id="error_shortName" className="erp_validation" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Add. line-1<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control as="textarea" rows={1} id="branchAddr1" className="erp_txt_area" value={branchAddress1} onChange={e => { setBranchAddress1(e.target.value); validateFields() }} maxlength="500" />
                        <MDTypography variant="button" id="error_branchAddr1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Add. line-2</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control as="textarea" rows={1} id="branchAddr2" className="erp_txt_area " value={branchAddress2} onChange={e => { setBranchAddress2(e.target.value); validateFields() }} maxlength="500" optional="optional" />
                        <MDTypography variant="button" id="error_branchAddr2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Pin Code<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" className="erp_input_field number" id="pinCode" value={OfficePinCode} onChange={event => {
                          setOfficePinCode(validateNumberDateInput.current.decimalNumber(event.target.value, 4)); validateFields()
                        }} maxLength="6" />
                        <MDTypography variant="button" id="error_pinCode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Country<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <select size="sm" id="countryId" className="form-select form-select-sm" value={country} onChange={() => addRecordInProperty("Country")}>
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
                        <select size="sm" id="stateId" className="form-select form-select-sm" value={state} onChange={() => addRecordInProperty("State")}>
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
                        <select size="sm" id="districtId" className="form-select form-select-sm" value={district} onChange={() => addRecordInProperty("District")}>
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
                        <select id="cityId" value={city} className="form-select form-select-sm" onChange={() => addRecordInProperty("City")}>
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
                        <Form.Label className="erp-form-label">Phone No.<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <span className='erp_phone' >
                          <select size="sm" id='phoneCntryId' className='form-select-phone'>
                            {countryCodeOptions?.map(option => (
                              <option value={option}>{option}</option>
                            ))}
                          </select>
                          <Form.Control type="text" className="erp_input_field erp_phn_border" id="phoneNo" value={OfficePhoneNo} onChange={e => { validateNo(e); validateFields() }} maxLength="10" />
                        </span>
                        <MDTypography variant="button" id="error_phoneNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                  </div>

                  {/* 2nd */}
                  <div className='col-sm-4 erp_form_col_div'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Cell No.<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <span className='erp_phone' >
                          <select size="sm" id='cellCntryId' className='form-select-phone'>
                            {countryCodeOptions?.map(option => (
                              <option value={option}>{option}</option>
                            ))}
                          </select>
                          <Form.Control type="text" className="erp_input_field erp_phn_border" id="cellNo" value={OfficeCellNo} onChange={e => { validateNo(e); validateFields() }} maxLength="10" />

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
                        <Form.Control type="email" id="email" className="erp_input_field" value={OfficeEmail} onChange={e => { setOfficeEmail(e.target.value); validateEmail(e.target.value); validateFields(); }} maxLength="50" />
                        <MDTypography variant="button" id="error_email" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>

                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Web Site</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="webSite" className="erp_input_field " value={WebSite} onChange={e => { setWebSite(e.target.value); validateWebSite(e.target) }} maxLength="50" optional="optional" />
                        <MDTypography variant="button" id="error_webSite" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Facebook Profile</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="fbProfile" className="erp_input_field " value={FacebookProfile} onChange={e => { setFacebookProfile(e.target.value); validateFields() }} maxLength="50" optional="optional" />                      </div>
                      <MDTypography variant="button" id="error_fbProfile" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Linkedin Profile</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="linkdInProfile" className="erp_input_field " value={LinkedinProfile} onChange={e => { setLinkedinProfile(e.target.value); validateFields() }} maxLength="100" optional="optional" />
                        <MDTypography variant="button" id="error_linkdInProfile" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Twitter Profile</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="twitterProfile" className="erp_input_field " value={TwitterProfile} onChange={e => { setTwitterProfile(e.target.value); validateFields() }} maxLength="100" optional="optional" />
                        <MDTypography variant="button" id="error_twitterProfile" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">GST No.<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="gstNo" className="erp_input_field" value={GSTNO} onChange={e => { setGSTNO(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="15" />
                        <MDTypography variant="button" id="error_gstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">GST Division</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='gstDivision' className="erp_input_field " value={gstDivision} onChange={e => { setGstDivision(e.target.value); validateFields() }} maxLength="500" optional="optional" />
                        <MDTypography variant="button" id="error_gstDivision" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">GST Range</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="gstDivisionRange" className="erp_input_field " value={GSTDivisionRange} onChange={e => { setGSTDivisionRange(e.target.value); validateFields() }} maxLength="500" optional="optional" />
                        <MDTypography variant="button" id="error_gstDivisionRange" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">PAN No.<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id="panNo" className="erp_input_field" value={PanNo} onChange={e => { setPanNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="10" />
                        <MDTypography variant="button" id="error_panNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                  </div>

                  {/* 3rd */}
                  <div className='col-sm-4 erp_form_col_div'>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Udyog Adhar No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='UdyogAdharNo' className="erp_input_field " value={UdyogAdharNo} onChange={e => { setUdyogAdharNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="12" optional="optional" />
                        <MDTypography variant="button" id="error_UdyogAdharNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">VAT No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='VatNo' className="erp_input_field " value={VatNo} onChange={e => { setVatNo(e.target.value); validateFields() }} maxLength="11" optional="optional" />
                        <MDTypography variant="button" id="error_VatNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Service Tax No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='taxNo' className="erp_input_field " value={ServiceTaxNo} onChange={e => { setServiceTaxNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="15" optional="optional" />                      </div>
                      <MDTypography variant="button" id="error_taxNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Excise No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='exciseNo' className="erp_input_field " value={ExciseNo} onChange={e => { setExciseNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="15" optional="optional" />
                        <MDTypography variant="button" id="error_exciseNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">CST No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='cstNo' className="erp_input_field " value={CSTNo} onChange={e => { setCSTNo(e.target.value); validateFields() }} maxLength="11" optional="optional" />
                        <MDTypography variant="button" id="error_cstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">BST No.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='bstNo' className="erp_input_field " value={BSTNo} onChange={e => { setBSTNo(e.target.value); validateFields() }} maxLength="11" optional="optional" />
                        <MDTypography variant="button" id="error_bstNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Tally Id.</Form.Label>
                      </div>
                      <div className='col'>
                        <Form.Control type="text" id='tallyId' className="erp_input_field " value={TallyId} onChange={e => { setTallyId(e.target.value); validateFields() }} maxLength="50" optional="optional" />
                        <MDTypography variant="button" id="error_tallyId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">SEZ</Form.Label>
                      </div>
                      <div className='col'>
                        <Form>
                          <div className="erp_form_radio">
                            <div className="fCheck">
                              <Form.Check
                                className="erp_radio_button" label="Yes" type="radio" value="1" name="isSez" optional="optional" />
                            </div>
                            <div className="sCheck">
                              <Form.Check className="erp_radio_button" label="No" value="0" type="radio" name="isSez" defaultChecked optional="optional" />
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Head<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <select id="branchHeadId" value={BranchHeadID} className="form-select form-select-sm" onChange={() => addRecordInProperty("BranchHead")}>
                          <option value="">Select</option>
                          <option value="0">Add New Record+</option>
                          {branchHeadOptions?.map(option => (
                            <option value={option.field_id}>{option.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_branchHeadId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-sm-1 ">
                        <Tooltip title="Refresh" placement="top">
                          <MDTypography className="erp-view-btn" >
                            <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("BranchHead")} style={{ color: 'black' }} />
                          </MDTypography>
                        </Tooltip>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Sub Head<span className="required">*</span></Form.Label>
                      </div>
                      <div className='col'>
                        <select id="branchSubHeadId" value={BranchSubHeadID} className="form-select form-select-sm" onChange={() => addRecordInProperty("BranchSubHead")}>
                          <option value="">Select</option>
                          <option value="0">Add New Record+</option>
                          {branchSubHeadOptions?.map(option => (
                            <option value={option.field_id}>{option.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_branchSubHeadId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-sm-1 ">
                        <Tooltip title="Refresh" placement="top">
                          <MDTypography className="erp-view-btn" >
                            <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("BranchSubHead")} style={{ color: 'black' }} />
                          </MDTypography>
                        </Tooltip>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Branch Active</Form.Label>
                      </div>
                      <div className='col'>
                        <Form>
                          <div className="erp_form_radio">
                            <div className="fCheck">
                              <Form.Check
                                className="erp_radio_button"
                                label="Yes"
                                type="radio"
                                value="1"
                                name="isBranchActive"
                                defaultChecked
                              />
                            </div>
                            <div className="sCheck">
                              <Form.Check
                                className="erp_radio_button"
                                label="No"
                                value="0"
                                type="radio"
                                name="isBranchActive"
                              />
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <hr />

              {/* Bank Adding Accordian */}
              <Accordion defaultActiveKey="0" >
                <Accordion.Item eventKey={0}>
                  <Accordion.Header className="erp-form-label-md">Branch Bank Information</Accordion.Header>
                  <Accordion.Body>
                    <form id="bankform" className={`${keyFVUD === 'view' ? 'd-none' : 'display'}`}>
                      <div className="row" id='formbody'>
                        <div className="col-sm-6 erp_form_col_div">
                          <div className='row'>
                            <div className='col-sm-4'>
                              <Form.Label className="erp-form-label">Account Type<span className="required">*</span></Form.Label>
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
                              <Form.Label className="erp-form-label">Bank Branch Name<span className="required">*</span></Form.Label>
                            </div>
                            <div className='col'>
                              <Form.Control type="text" className="erp_input_field" id="bankBranchName"
                                onInput={(e) => {
                                  let sanitizedValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                  e.target.value = sanitizedValue;
                                }}
                                onChange={e => { setBankBranchName(e.target.value); validateBankFields() }} maxLength="255" />
                              <MDTypography variant="button" id="error_bankBranchName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                              </MDTypography>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-4'>
                              <Form.Label className="erp-form-label">Bank Account No<span className="required">*</span></Form.Label>
                            </div>

                            <div className='col'>
                              <Form.Control type="text" className="erp_input_field" id="bankAccountNo"
                                // onInput={(e) => {
                                //   let parsedValue = parseInt(e.target.value);
                                //   if (isNaN(parsedValue)) {
                                //     e.target.value = '';
                                //   } else { e.target.value = Math.max(0, parsedValue).toString().slice(0, 15); }
                                // }}
                                onInput={(e) => {
                                  let value = e.target.value;
                              
                                  // Allow only numeric input and limit to 15 characters
                                  if (/^\d*$/.test(value)) {
                                    e.target.value = value.slice(0, 15); // Limit to 15 characters
                                  } else {
                                    e.target.value = ''; // Clear if non-numeric input is detected
                                  }
                                }}
                                onChange={(e) => { validateNo(e); validateBankFields(); }}
                              />
                              <MDTypography variant="button" id="error_bankAccountNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                              </MDTypography>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-4'>
                              <Form.Label className="erp-form-label">IFSC No<span className="required">*</span></Form.Label>
                            </div>

                            <div className='col'>
                              <Form.Control type="text" className="erp_input_field" id="bankIfscNo"
                                onInput={(e) => {
                                  const enteredValue = e.target.value;
                                  const isValid = /^[A-Z0-9]*$/.test(enteredValue);
                                  if (!isValid) {
                                    document.getElementById('error_bankIfscNo').innerText = 'Please Enter Capital letters';
                                  } else {
                                    validateBankFields();
                                  }
                                }}
                                onChange={e => { setBankIfscNo(e.target.value); }} maxLength="11" />
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
                              <Form.Control type="text" className="erp_input_field" id="bankSwiftCode" onChange={e => { setBankSwiftCode(e.target.value); validateFields() }} maxLength="50" optional='optional' />
                              <MDTypography variant="button" id="error_bankSwiftCode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                              </MDTypography>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-sm-4'>
                              <Form.Label className="erp-form-label">GST No</Form.Label>
                            </div>

                            <div className='col'>
                              <Form.Control type="text" className="erp_input_field" id="bankGstNo" onChange={e => { setBankGStNo(e.target.value); validateFields() }} maxLength="50" optional='optional' />
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
                                <option value="">Select</option>
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
                        <MDButton type="button" onClick={FnAddBank} id="saveBtn" className="erp-gb-button erp_MLeft_btn" variant="button" fontWeight="regular">Add</MDButton>
                      </div>
                    </form >
                    {renderTransporterBanks}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className='erp_frm_Btns'>
        <MDButton className="erp-gb-button"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/CompanyListing/reg' : '/Masters/CompanyListing';
            navigate(path);
          }}
          variant="button" fontWeight="regular">
          Home
        </MDButton> &nbsp;
        <MDButton type="button" id="branchSaveBtn" className={`btn erp-gb-button ${keyforViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={addBranch} variant="button"
          fontWeight="regular">save</MDButton>&nbsp;
        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={props.goBack}>
          Back
        </MDButton>&nbsp;
        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={props.goToNext}>
          Next
        </MDButton>
      </div>


      {/* Delete Modal */}
      <Modal show={showDeletemodal} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={handleClose}></button></span>
        <Modal.Body className='erp_modal_body'>
          <span className='erp_modal_delete_icon'><RxCrossCircled /></span>
          <h6>Are you sure?</h6>
          <div className="erp-form-label">Do you wish to delete this record ?</div>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
          <Button variant="success" className='erp-gb-button' onClick={handleClose}>
            Cancel
          </Button>&nbsp;
          <Button variant="danger" className='erp-gb-button' onClick={deleteBranch}>Delete</Button>
        </Modal.Footer>
      </Modal>


      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      {/* Document modal */}
      <Modal size="lg" className='erp_document_Form' show={showDocumentForm} onHide={handleCloseDocumentForm} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title className='erp_modal_title'>Document Form</Modal.Title>
          <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseDocumentForm}></button></span>
        </Modal.Header>
        <Modal.Body>
          <DocumentF group_id={companyID} document_group={docGroup} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="btn erp-gb-button" onClick={handleCloseDocumentForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Add new Record Popup */}
      <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
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
      </Modal >

    </>
  );
}

export default Branch;
