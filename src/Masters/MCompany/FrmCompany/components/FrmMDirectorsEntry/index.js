import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import FrmValidations from "FrmGeneric/FrmValidations";
import ComboBox from "Features/ComboBox";

// React bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTable } from 'react-table'
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

// Import Files
import PdfExport from 'Features/Exports/PdfExport';
import ExcelExport from "Features/Exports/ExcelExport";
import JsonExport from "Features/Exports/JsonExport";
import CSVExport from "Features/Exports/CSVExport";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";


// Import React icons 
import { RxCrossCircled } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import Datatable from "components/DataTable";



function Directors(props) {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const {  UserName } = configConstants;

  const [company_director_id, setCompany_director_id] = useState();
  var activeValue;

  // Form Heading 
  const [formHeading, setFormHeading] = useState('Director Information');
  const COMPANY_NAME = sessionStorage.getItem('companyLegalName')

  //view,update & delete from listing page 
  let COMPANY_ID = sessionStorage.getItem("companyID");
  let keyforViewUpdate = sessionStorage.getItem('keyForViewUpdate');
  var compType = sessionStorage.getItem('compType');
  const fnKVU = (keyforViewUpdate) => {
    switch (keyforViewUpdate) {
      case 'view':
        $('#directorFormId :input').prop('disabled', true);
        $('#directorSaveBtnId').attr('disabled', true);
        $('#directorNameId').attr('disabled', true);
        break;
    }
  }


  // For navigate
  const navigate = useNavigate();

  var validateRef = useRef();
  var child = useRef();

  // Pagination Variables 
  const pageEntriesOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "500", value: 500 },
  ]
  var [entriesPerPage, setEntriesPerPage] = useState(pageEntriesOptions[0].value);
  const [pageCount, setpageCount] = useState(0);
  const [PageCurrent, setcurrentPage] = useState(0);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);


  // Table Data Fields
  const [data, setDirectorData] = useState([]);
  const [columns, setColumns] = useState([]);
  var columnHeads;

  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Add Director Form Fields
  const [directorName, setDirectorName] = useState('');
  const [directorAddress, setDirectorAddress] = useState('');
  const [directorQualification, setDirectorQualification] = useState('');
  const [directorCellNo1, setDirectorCellNo1] = useState('');
  const [directorCellNo2, setDirectorCellNo2] = useState('');
  const [directorPhoneNo, setDirectorPhoneNo] = useState('');
  const [directorEmailId1, setDirectorEmailId1] = useState('');
  const [directorEmailId2, setDirectorEmailId2] = useState('');
  const [directorWebSite, setDirectorWebSite] = useState('');
  const [directorFacebookProfile, setDirectorFacebookProfile] = useState('');
  const [directorLinkedinProfile, setDirectorLinkedinProfile] = useState('');
  const [directorTwitterProfile, setDirectorTwitterProfile] = useState('');
  const [directorPANNo, setDirectorPANNo] = useState('');
  const [directorAdharNo, setDirectorAdharNo] = useState('');
  const [directorDINNo, setDirectorDINNo] = useState('');
  const [rolesResposibilties, setRolesResposibilties] = useState('');

  // Export Fields
  var dataExport = [];
  var columnExport = [];
  const pdfExp = useRef();
  const exlsExp = useRef();
  const csvExp = useRef();

  const jsonExp = useRef();

  var reportName = "Director Report"

  var validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(async () => {
    fnKVU(keyforViewUpdate);
    await showDirectorRecords();

    const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
    const respCountryCode = await apiCallCountryCodeList.json();
    console.log("apiCallCountryCodeList: ", respCountryCode)
    setCountryCodeOptions(respCountryCode)
  }, []);

  const showDirectorRecords = async () => {
    if (COMPANY_ID !== null && COMPANY_ID !== '' && COMPANY_ID !== undefined) {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnShowParticularRecords/${COMPANY_ID}?page=0&size=${entriesPerPage}`);
      const responce = await res.json();
      if (responce.content.length > 0) {
        console.log("Director Responce: ", responce);
        const total = responce.totalElements;
        setpageCount(Math.ceil(total / entriesPerPage));
        var column = [];
        columnHeads = Object.keys(responce.content[0]);
        console.log("Document Records: ", responce)
        for (let colKey = 0; colKey < columnHeads.length; colKey++) {
          if (colKey == 0) {
            column.push({
              Headers: "Action", accessor: "Action",
              Cell: row => (
                <div style={{ display: "flex" }}>
                  <MdModeEdit className={keyforViewUpdate === 'view' ? "erp-edit-btn d-none" : "erp-edit-btn"} onClick={e => viewUpdateDelete(row.original, 'update')} />
                  <MdDelete className={keyforViewUpdate === 'view' ? "erp-delete-btn d-none" : "erp-delete-btn"} onClick={e => viewUpdateDelete(row.original, 'delete')} />
                  <AiFillEye className="erp-view-btn" onClick={e => viewUpdateDelete(row.original, 'view')} />
                </div>
              ),
            });
          }
          if (!columnHeads[colKey].includes('_id') && !columnHeads[colKey].includes('is_') && !columnHeads[colKey].includes('_on') && !columnHeads[colKey].includes('_by') && !columnHeads[colKey].includes('field_name')) {
            column.push({ Headers: columnHeads[colKey], accessor: columnHeads[colKey] });
          }
        }
        setColumns(column)
        setDirectorData(responce.content)
        $("#table_listing").show();
        $("#filter_display_controls").show();
        $("#display_exports").show();
      } else {
        $("#table_listing").hide();
        $("#filter_display_controls").hide();
        $("#display_exports").hide();
      }
    }
  }

  const FnShowDirectorRecordsToExport = async () => {
    try {
      const directRecrdsToexport = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnShowParticularRecords/${COMPANY_ID}`)
      const responce = await directRecrdsToexport.json();

      console.log("All Comapny Details to export: ", responce)
      if (responce.content.length > 0) {
        $('#NoRcrdId').hide();
        var colHeads = Object.keys(responce.content[0]);
        for (let colKey = 0; colKey < colHeads.length; colKey++) {
          columnExport.push(colHeads[colKey]);
        }
        dataExport = responce.content
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const infoForUpdate = async (company_director_id, key) => {
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnShowParticularRecordForUpdate/${company_director_id}`)
      const responce = await apiCall.json();

      console.log("Document Particular document: ", responce);
      setDirectorName(responce.company_director_name)
      setDirectorAddress(responce.director_address)
      setDirectorQualification(responce.director_qualification)
      setDirectorPhoneNo(responce.director_phone_no)
      setDirectorCellNo1(responce.director_cell_no1)
      setDirectorCellNo2(responce.director_cell_no2)
      setDirectorEmailId1(responce.director_EmailId1)
      setDirectorEmailId2(responce.director_EmailId2)
      setDirectorWebSite(responce.director_website)
      setDirectorFacebookProfile(responce.director_facebook_profile)
      setDirectorLinkedinProfile(responce.director_linkedin_profile)
      setDirectorTwitterProfile(responce.director_twitter_profile)
      setDirectorPANNo(responce.director_pan_no)
      setDirectorAdharNo(responce.director_adhar_no)
      setDirectorDINNo(responce.director_din_no)
      setRolesResposibilties(responce.rolesResposibilties)

      switch (responce.is_active) {
        case true:
          document.querySelector('input[name="isDirectorActive"][value="1"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="isDirectorActive"][value="0"]').checked = true;
          break;

      }

      if (key === "update") {
        setFormHeading('Modify Director')
        $("input[type=radio]").attr('disabled', false);
        $("#directorSaveBtnId").attr('disabled', false);
        $('#directorNameId').attr('disabled', true)

      } else if (key === "view") {
        setFormHeading('View Director')
        $("input[type=radio]").attr('disabled', true);
        $('#directorNameId').attr('disabled', true)
        $("#directorSaveBtnId").attr('disabled', true);
      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }


  function viewUpdateDelete(data, key) {
    var company_director_id = data.company_director_id
    setCompany_director_id(company_director_id)
    switch (key) {
      case 'update':
        removeReadAttr();
        infoForUpdate(company_director_id, "update"); break;

      case 'delete': setShow(true); break;

      case 'view':
        infoForUpdate(company_director_id, "view");
        var formObj = $('#directorFormId');
        var inputObj;

        for (var i = 0; i <= formObj.get(0).length - 1; i++) {
          inputObj = formObj.get(0)[i];
          if (inputObj.type === 'text') {
            $('#' + inputObj.id).attr('readonly', true);
          } else if (inputObj.type == 'select-one') {
            $('#' + inputObj.id).attr('disabled', true);
          } else if (inputObj.type === 'file') {

          } else if (inputObj.type === 'textarea') {
            $('#' + inputObj.id).attr('readonly', true);
          } else if (inputObj.type === 'date') {
            $('#' + inputObj.id).attr('readonly', true);
          } else if (inputObj.type === 'email') {
            $('#' + inputObj.id).attr('readonly', true);
          } else if (inputObj.type === 'number') {
            $('#' + inputObj.id).attr('readonly', true);
          }
        }
        break;

    }

  }

  const deleteDirector = async () => {
    try {
      const method = { method: 'POST' }
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnDeleteRecord/${company_director_id}/${UserName}`, method)
      const responce = await apiCall.json();
      console.log("Director Deleted: ", responce);
      setShow(false)
      fetchComments(PageCurrent);
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const fetchComments = async (currentPage) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnShowParticularRecords/${COMPANY_ID}?page=${currentPage}&size=${entriesPerPage}`);
      const data = await res.json();
      if (data.content.length === 0) {
        $("#table_listing").hide();
        $("#filter_display_controls").hide();
        $("#display_exports").hide();
        showAddDirectorForm();
      }
      console.log("Responce when fetch comments: ", data)
      setDirectorData(data.content);
      return data.content;
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  };

  const handlePageClick = async (pageNo) => {
    console.log(pageNo.selected)
    var currentPage = pageNo.selected;
    setcurrentPage(currentPage);
    console.log("current Page: ", currentPage)
    const commentsFormServer = await fetchComments(currentPage);
    console.log("commentsFormServer director data: ", commentsFormServer)
  }

  const handlePageCountClick = async () => {
    var count = document.getElementById("page_entries_id").value;
    setEntriesPerPage(count)
    console.log(pageCount)
    await showDirectorRecords();
  }

  const addDirector = async (event) => {
    try {
      event.preventDefault(); // 👈️ prevent page refresh
      var checkIsValid = validateDirector();
      if (checkIsValid === true) {
        var active;
        activeValue = document.querySelector('input[name=isDirectorActive]:checked').value

        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }

        if (company_director_id === '' || company_director_id === null) { setCompany_director_id(0) }
        const data = {
          company_id: COMPANY_ID,
          company_director_id: company_director_id,
          company_director_name: directorName,
          director_address: directorAddress,
          director_qualification: directorQualification,
          director_cell_no1: directorCellNo1,
          director_cell_no2: directorCellNo2,
          director_phone_no: directorPhoneNo,
          director_EmailId1: directorEmailId1,
          director_EmailId2: directorEmailId2,
          director_website: directorWebSite,
          director_facebook_profile: directorFacebookProfile,
          director_linkedin_profile: directorLinkedinProfile,
          director_twitter_profile: directorTwitterProfile,
          director_pan_no: directorPANNo,
          director_adhar_no: directorAdharNo,
          director_din_no: directorDINNo,
          rolesResposibilties: rolesResposibilties,
          created_by: company_director_id === 0 ? UserName : null,
          modified_by: company_director_id !== 0 ? UserName : null,
          is_active: active
        };
        const forwDirectorData = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
        const addDirectorApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/companydirectors/FnAddUpdateRecord`, forwDirectorData)
        const response = await addDirectorApiCall.json();

        console.log("Add director responcce: ", response)
        if (response.error !== "") {
          setErrMsg(response.error)
          setShowErrorMsgModal(true)
        } else {
          console.log("Director Add Data", response);
          clearFormFields();
          const evitCache = await child.current.evitCache();
          console.log(evitCache);
          setSuccMsg(response.message)
          setShowSuccessMsgModal(true)
          await showDirectorRecords();
          await FnShowDirectorRecordsToExport();
        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  };

  //Validations starts here
  const validateDirector = () => {
    validateRef.current.validateForm('directorFormId');
  }

  const validateFields = () => {
    validateRef.current.validateFieldsOnChange('directorFormId');
  }

  const removeReadAttr = () => {
    validateRef.current.removeReadAttr('directorFormId');
  }


  const validateNo = (noKey) => {
    const regexNo = /^[0-9\b]+$/;
    switch (noKey.target.id) {
      case 'directorCellNo1Id':
        if (noKey.target.value !== '' || regexNo.test(noKey.target.value)) {
          if (noKey.target.value === 'NaN') {
            setDirectorCellNo1("")
          } else {
            setDirectorCellNo1(noKey.target.value)
          }
        }
        break;
      case 'directorCellNo2Id':
        if (noKey.target.value !== '' || regexNo.test(noKey.target.value)) {
          if (noKey.target.value === 'NaN') {
            setDirectorCellNo2("")
          } else {
            setDirectorCellNo2(noKey.target.value)
          }
        }
        break;
      case 'directorPhoneNoId':
        if (noKey.target.value !== '' || regexNo.test(noKey.target.value)) {
          if (noKey.target.value === 'NaN') {
            setDirectorPhoneNo("")
          } else {
            setDirectorPhoneNo(noKey.target.value)
          }
        }
        break;
    }
  }

  const showAddDirectorForm = () => {
    clearFormFields();
    removeReadAttr();
    setCompany_director_id(0);
    setFormHeading('Director Information')
    $("#directorSaveBtnId").attr('disabled', false);
    $("input[type=radio]").attr('disabled', false);
    $('#directorNameId').attr('disabled', false)

  }

  const clearFormFields = () => {
    $('[id^="error_"]').hide();
    setDirectorName('');
    setDirectorAddress('');
    setDirectorQualification('');
    setDirectorCellNo1('');
    setDirectorCellNo2('');
    setDirectorPhoneNo('');
    setDirectorEmailId1('');
    setDirectorEmailId2('');
    setDirectorWebSite('');
    setDirectorFacebookProfile('');
    setDirectorLinkedinProfile('');
    setDirectorTwitterProfile('');
    setDirectorPANNo('');
    setDirectorAdharNo('');
    setDirectorDINNo('');
    setRolesResposibilties('');
  }


  const validateEmail = (email) => {
    switch (email) {
      case 'Email1':
        if (directorEmailId1 !== '' && validEmail.test(directorEmailId1)) {
          $('#error_directorEmailId1').hide()
        } else {
          $('#error_directorEmailId1').text('Please enter valid email!...')
          $('#error_directorEmailId1').show()
        }
        break;
      case 'Email2':
        if (directorEmailId2 !== '' && validEmail.test(directorEmailId2)) {
          $('#error_directorEmailId2').hide()
        } else {
          $('#error_directorEmailId2').show()
          $('#error_directorEmailId2').text('Please enter valid email...!')
        }
        break;
    }
  }
  const exporttoPdf = async () => {
    const filtrdata = await FnShowDirectorRecordsToExport();
    if (dataExport.length !== 0) {
      pdfExp.current.pdf(dataExport, columnExport, reportName, "")
    }

  }

  async function exporttoExcel() {
    const filtrdata = await FnShowDirectorRecordsToExport();
    console.log("pdfExpFilters: ", filtrdata)
    if (dataExport.length !== 0) {
      var jsonToExportExcel = { 'allData': {}, 'columns': {}, 'filtrKeyValue': {}, 'headings': {}, 'key': 'reportExport' }
      for (let col = 0; col < columnExport.length; col++) {
        jsonToExportExcel['columns'][col] = columnExport[col]
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
  }

  const exporttoJSON = async () => {
    const filtrdata = await FnShowDirectorRecordsToExport();
    if (dataExport.length !== 0) {
      var data = [];
      var dataJson = {};
      for (let index = 0; index < dataExport.length; index++) {
        const element = dataExport[index];
        for (let colExIndex = 0; colExIndex < columnExport.length; colExIndex++) {
          dataJson[columnExport[colExIndex]] = element[columnExport[colExIndex]]
        }
        data.push(dataJson)
      }
      jsonExp.current.json(data, reportName)
    }
  }

  const exportToCSV = async () => {
    const callFiltrTabledata = await FnShowDirectorRecordsToExport();
    if (dataExport.length !== 0) {
      var data = [];
      var dataJson = {};
      for (let index = 0; index < dataExport.length; index++) {
        const element = dataExport[index];
        for (let colExIndex = 0; colExIndex < columnExport.length; colExIndex++) {
          dataJson[columnExport[colExIndex]] = element[columnExport[colExIndex]]
        }
        data.push(dataJson)
      }
      csvExp.current.csv(data, reportName)
    }
  }

  return (
    <>
      <PdfExport ref={pdfExp} />
      <ExcelExport ref={exlsExp} />
      <JsonExport ref={jsonExp} />
      <CSVExport ref={csvExp} />
      <FrmValidations ref={validateRef} />
      <ComboBox ref={child}/>

      <div>
        <div className='main_heding'>
          <label className='erp-form-label-lg main_heding'> {COMPANY_NAME} </label>
        </div>
        <div className="row btn_row_class">
          <div className="col-6 add_btn" id="filter_display_controls" style={{ display: 'none' }}>
            <MDButton className={`btn erp-gb-button ${keyforViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={showAddDirectorForm}>Add Director</MDButton> &nbsp;
            <span>
              <span className="page_entries" >
                <MDTypography component="label" variant="button" className="erp-form-label-md">Entries per page: &nbsp;</MDTypography>

                <select onChange={handlePageCountClick} className="erp_page_select erp_form_control" id="page_entries_id" >
                  {pageEntriesOptions.map(pageEntriesOptions => (
                    <option value={pageEntriesOptions.value}>{pageEntriesOptions.label}</option>

                  ))}
                </select>
              </span>
            </span>
          </div>
          <div className="col-6 pagination_id" id="display_exports" style={{ display: 'none' }}>
            <span className="exports">
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoPdf()}>PDF<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoExcel()}>EXCEL<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exportToCSV()}>CSV<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
              <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoJSON()}>JSON<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
            </span>
          </div>
        </div>
        <div id="table_listing" style={{ display: "none" }}>
          <Datatable data={data} columns={columns} />
          {
            data.length > 0 && pageCount !== 1
              ? <ReactPaginate className="erp_pagination"
                marginPagesDisplayed={2} pageRangeDisplayed={3}
                pageCount={pageCount} onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"} pageClassName={"page-item"}
                pageLinkClassName={"page-link erp-gb-button"} previousClassName={"page-item"}
                previousLinkClassName={"page-link erp-gb-button"} nextClassName={"page-item"}
                nextLinkClassName={"page-link erp-gb-button"} breakClassName={"page-item"}
                breakLinkClassName={"page-link"} activeClassName={"active"}
              />
              : ''
          }
        </div>
      </div>

      <hr />
      {/* Add Director Form */}
      <Accordion defaultActiveKey="0" id="showAddDirectorForm">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="erp-form-label-md">{formHeading}</Accordion.Header>
          <Accordion.Body>
            <form id="directorFormId">
              <div className="row">
                {/* 1st */}
                <div className="col-sm-6 erp_form_col_div">

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Director Name<span className="required">*</span></Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorNameId" className="erp_input_field" value={directorName} onChange={e => { setDirectorName(e.target.value); validateFields() }} maxLength="255" />
                      <MDTypography variant="button" id="error_directorNameId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Address</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control as="textarea" rows={1} id="directorAddressId" className="erp_txt_area" value={directorAddress} onChange={e => { setDirectorAddress(e.target.value); validateFields() }} maxLength="500" optional='optional' />
                      <MDTypography variant="button" id="error_directorAddressId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Qualification</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control as="textarea" rows={1} id="directorQualificationId" className="erp_txt_area" value={directorQualification} onChange={e => { setDirectorQualification(e.target.value); validateFields() }} maxLength="500" optional='optional' />
                      <MDTypography variant="button" id="error_directorQualificationId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Primary Cell No.</Form.Label>
                    </div>
                    <div className="col">
                      <span className='erp_phone' >
                        <select size="sm" id='cellCntryId1' className='form-select-phone' optional='optional'>
                          {countryCodeOptions?.map(option => (
                            <option value={option}>{option}</option>

                          ))}
                        </select>
                        <Form.Control type="text" className="erp_input_field erp_phn_border" id="directorCellNo1Id" value={directorCellNo1} onInput={(e) => {
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                        }} onChange={e => { validateNo(e); validateFields() }} optional='optional' />
                      </span>
                      <MDTypography variant="button" id="error_directorCellNo1Id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Secondary Cell No.</Form.Label>
                    </div>
                    <div className="col">
                      <span className='erp_phone' >
                        <select size="sm" id='cellCntryId2' className='form-select-phone' optional='optional'>
                          {countryCodeOptions?.map(option => (
                            <option value={option}>{option}</option>

                          ))}
                        </select>

                        <Form.Control type="text" className="erp_input_field  erp_phn_border" id="directorCellNo2Id" value={directorCellNo2} onInput={(e) => {
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                        }} onChange={e => { validateNo(e); validateFields() }} optional='optional' />
                      </span>
                      <MDTypography variant="button" id="error_directorCellNo2Id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label"> Phone No. </Form.Label>
                    </div>
                    <div className="col">
                      <span className='erp_phone' >
                        <select size="sm" id='phoneNoCntryId' className='form-select-phone' optional='optional'>
                          {countryCodeOptions?.map(option => (
                            <option value={option}>{option}</option>

                          ))}
                        </select>
                        <Form.Control type="text" className="erp_input_field erp_phn_border" id="directorPhoneNoId" value={directorPhoneNo} onInput={(e) => {
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                        }} onChange={e => { validateNo(e); validateFields() }} optional='optional' />
                      </span>
                      <MDTypography variant="button" id="error_directorPhoneNoId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Primary Email Id</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="email" id="directorEmailId1" className="erp_input_field" value={directorEmailId1} onChange={e => { setDirectorEmailId1(e.target.value.trim()); validateEmail('Email1') }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_directorEmailId1" className={`erp_validation ${directorEmailId1 === '' ? 'd-none' : ''}`} fontWeight="regular" color="error">
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Secondary Email Id </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="email" id="directorEmailId2" className="erp_input_field" value={directorEmailId2} onChange={e => { setDirectorEmailId2(e.target.value.trim()); validateEmail('Email2') }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_directorEmailId2" className={`erp_validation ${directorEmailId2 === '' ? 'd-none' : ''}`} fontWeight="regular" color="error">
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Web Site</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorWebSiteId" className="erp_input_field" value={directorWebSite} onChange={e => { setDirectorWebSite(e.target.value); validateFields() }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_directorWebSiteId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>


                </div>
                {/* 2nd */}
                <div className="col-sm-6 erp_form_col_div">
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Facebook Profile</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" className="erp_input_field" id="directorFacebookProfileId" value={directorFacebookProfile} optional='optional' onChange={e => { setDirectorFacebookProfile(e.target.value); validateFields() }} maxLength="50" />
                      <MDTypography variant="button" id="error_directorFacebookProfileId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Linkedin Profile</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorLinkedinProfileId" className="erp_input_field" value={directorLinkedinProfile} onChange={e => { setDirectorLinkedinProfile(e.target.value); validateFields() }} maxLength="100" optional='optional' />
                      <MDTypography variant="button" id="error_directorLinkedinProfileId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Twitter Profile</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorTwitterProfileId" className="erp_input_field" value={directorTwitterProfile} onChange={e => { setDirectorTwitterProfile(e.target.value); validateFields() }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_directorTwitterProfileId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">PAN No. </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorPANNoId" className="erp_input_field" value={directorPANNo} onChange={e => { setDirectorPANNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="10" optional='optional' />
                      <MDTypography variant="button" id="error_directorPANNoId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label"> Aadhar No. </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="number" className="erp_input_field" id="directorAdharNoId" value={directorAdharNo} onChange={e => { setDirectorAdharNo(e.target.value); validateFields() }} onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                      }} optional='optional' />
                      <MDTypography variant="button" id="error_directorAdharNoId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">DIN No. </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="text" id="directorDINNoId" className="erp_input_field" value={directorDINNo} onChange={e => { setDirectorDINNo(e.target.value); validateFields() }} maxLength="50" optional='optional' />
                      <MDTypography variant="button" id="error_directorDINNoId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Roles Resposibilties</Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control as="textarea" rows={1} id="rolesResposibiltiesId" className="erp_txt_area" value={rolesResposibilties}
                        onChange={e => { setRolesResposibilties(e.target.value); validateFields() }} maxLength="500" optional='optional' />
                      <MDTypography variant="button" id="error_rolesResposibiltiesId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Director Active</Form.Label>
                    </div>
                    <div className="col">
                      <Form>
                        <div className="erp_form_radio">
                          <div className="fCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="Yes"
                              type="radio"
                              value="1"
                              name="isDirectorActive"
                              defaultChecked

                            />
                          </div>
                          <div className="sCheck">
                            <Form.Check
                              className="erp_radio_button"
                              label="No"
                              value="0"
                              type="radio"
                              name="isDirectorActive"

                            />
                          </div>
                        </div>
                      </Form>
                    </div>

                  </div>

                </div>
              </div>
            </form>
            <div>
              <MDButton type="button" id='directorSaveBtnId' onClick={addDirector}
                className={`erp-gb-button ${keyforViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              >
                save Director
              </MDButton>
            </div>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>


      <div className="text-center">
        <MDButton className="btn erp-gb-button"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/CompanyListing/reg' : '/Masters/CompanyListing';
            navigate(path);
          }}
          variant="button" fontWeight="regular">
          Home
        </MDButton>
        <MDButton type="button" onClick={props.goBack} className="btn erp-gb-button ms-2" variant="button"
          fontWeight="regular">Back</MDButton>  
      </div>

      {/* Delete Modal */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
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
          <Button variant="danger" className='erp-gb-button' onClick={deleteDirector}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

    </>
  );
}

export default Directors;
