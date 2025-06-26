import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmPropertyEntry from "Masters/MProperty/FrmPropertyEntry";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from "FrmGeneric/FrmValidations";

function FrmMCompanyEntry(props) {
  // Call ConfigConstants to get the configuration constants
  const configConstants = ConfigConstants();
  const { UserName } = configConstants;

  var activeValue = '';
  let compType = sessionStorage.getItem('compType');

  const child = useRef();
  const validateNumberDateInput = useRef();
  const validateRef = useRef();

  var FTcompanyData;

  // For navigate
  const navigate = useNavigate();

  // Add Company Form Fields
  const [company_id, setCompany_id] = useState(sessionStorage.getItem('companyID') === 'undefined' || sessionStorage.getItem('companyID') === null || sessionStorage.getItem('companyID') === '' ? 0 : parseInt(sessionStorage.getItem('companyID')));
  const [companySectoroptions, setcompanySectoroptions] = useState([])
  const [companyLegalName, setCompanyLegalName] = useState('');
  const [companyTradeName, setCompanyTradeName] = useState('');
  const [shortName, setShortName] = useState('');
  const [companySector, setCompanySector] = useState('');
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyTypeId, setCompanyTypeId] = useState('');
  const [natureOfBusiness, setNatureOfBusiness] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [establishDate, setEstablishDate] = useState('');
  const [logo, setLogo] = useState('');
  const [logoDocPath, setLogoDocPath] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [remark, setRemark] = useState('');

  const [templogoFileName, setTemplogoFileName] = useState('');

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');


  // to add new records in combo box 
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [modalHeaderName, setHeaderName] = useState('')
  let keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');

  useEffect(async () => {
    await FnFetchPropertyRecords();
    if (company_id !== 0) {
      await FnCheckUpdateResponce();
    } else {
      $('#updateBtn').hide();
      $('#nxtBtn').show();
      $('#nxtOnlyBtn').hide();
      $('#companyLegalName').attr('disabled', false);
    }
    FTcompanyData = localStorage.getItem('FTcompanyData')
    if (FTcompanyData !== null) {
      console.log("dtaa present: ", localStorage.getItem('FTcompanyData'))
      addDataInFields();
    } else {
      $("#TemplogoFile").hide();
    }

  }, [])

  const addDataInFields = async () => {
    const FTcompanyDataJson = JSON.parse(FTcompanyData)
    setCompanyTypeId(FTcompanyDataJson.company_type_id)
    setCompanySector(FTcompanyDataJson.company_sector)
    setCompanyLegalName(FTcompanyDataJson.company_legal_name)
    setCompanyTradeName(FTcompanyDataJson.company_trade_name)
    setShortName(FTcompanyDataJson.company_short_name)
    setNatureOfBusiness(FTcompanyDataJson.nature_of_business)
    setRegistrationNo(FTcompanyDataJson.registration_no)
    setRegistrationDate(FTcompanyDataJson.registration_date)
    setEstablishDate(FTcompanyDataJson.establish_date)
    setRemark(FTcompanyDataJson.remark)
    setTemplogoFileName(localStorage.getItem('tempFileName'))
    $("#TemplogoFile").show();
  }

  const fetchTempLogo = async () => {
    try {
      const downloadImageApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnGetTempCompanyLogo`)
      const blob = await downloadImageApiCall.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${templogoFileName}`,);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.log("error: " + error)
      navigate('/Error')

    }
  }

  const FnFetchPropertyRecords = async () => {
    try {
      var controlName = ["CompanySectors", "CompanyTypes"];
      if (child.current) {
        child.current.fillComboBox(controlName[0]).then((companySectors) => {
          setcompanySectoroptions(companySectors)
        })

        child.current.fillComboBox(controlName[1]).then((companyTypes) => {
          setCompanyTypes(companyTypes)
        })
      }

    } catch (error) {
      console.log("error: " + error)
      navigate('/Error')
    }
  }

  const FnCheckUpdateResponce = async () => {
    try {
      debugger;
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnShowParticularRecordForUpdate/${company_id}`)
      const updateRes = await apiCall.json();
      if (updateRes.success === 1 && updateRes.data !== null) {
        let resposeData = updateRes.data
        setCompany_id(resposeData.company_id)
        setCompanyLegalName(resposeData.company_legal_name)
        setCompanyTradeName(resposeData.company_trade_name)
        setShortName(resposeData.company_short_name)
        setCompanySector(resposeData.company_sector)
        setCompanyTypeId(resposeData.company_type_id)
        setNatureOfBusiness(resposeData.nature_of_business)
        setRegistrationNo(resposeData.registration_no)
        setRegistrationDate(resposeData.registration_date)
        setEstablishDate(resposeData.establish_date)
        setRemark(resposeData.remark)
        setLogoDocPath(resposeData.company_logo_document_path)
        setLogoFileName(resposeData.logo_file_name)
        $('#updateBtn').show();
        $('#nxtBtn').hide();
        $('#nxtOnlyBtn').show();
        $('#logoFile').show();

        switch (resposeData.is_active) {
          case true:
            document.querySelector('input[name="isCompanyActive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isCompanyActive"][value="0"]').checked = true;
            break;
        }

        sessionStorage.removeItem('companyLegalName')
        sessionStorage.setItem("companyLegalName", resposeData.company_legal_name);



        var keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');
        switch (keyForViewUpdate) {
          case 'update':
            $("input[type=radio]").attr('disabled', false);
            $('#updateBtn').attr('disabled', false);
            $('#companyLegalName').attr('disabled', true);
            $('#shortName').attr('disabled', true);
            // await validateRef.current.readOnly('compForm');
            break;
          case 'view':
            $("input[type=radio]").attr('disabled', true);
            $('#updateBtn').attr('disabled', true);
            await validateRef.current.readOnly('compForm');
            break;
        }


      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      var file = e.target.files[0];
      setLogo(file);
      localStorage.removeItem('tempFileName')
      localStorage.setItem('tempFileName', e.target.files[0].name)
      $('#error_CompanyLogo').hide();
    }
  };

  const handleSubmit = async () => {
    const checkIsValidate = await validateRef.current.validateForm('compForm');
    if (checkIsValidate === true) {
      var active;
      activeValue = document.querySelector('input[name=isCompanyActive]:checked').value
      switch (activeValue) {
        case '0': active = false; break;
        case '1': active = true; break;
      }

      const data = {
        company_id: company_id,
        company_legal_name: companyLegalName,
        company_trade_name: companyTradeName,
        company_short_name: shortName,
        company_sector: companySector,
        company_type_id: companyTypeId,
        nature_of_business: natureOfBusiness,
        registration_no: registrationNo,
        registration_date: registrationDate,
        establish_date: establishDate,
        is_active: active,
        remark: remark
      };
      console.log(data);

      const resTempUpload = await uploadTempFile();
      localStorage.setItem("FTcompanyData", JSON.stringify(data));
      localStorage.setItem("FTcompanyData", JSON.stringify(data));
      sessionStorage.removeItem('companyLegalName')
      sessionStorage.setItem("companyLegalName", companyLegalName);
      props.goToNext();
    }
  };

  const uploadTempFile = async () => {
    try {
      const formData = new FormData();
      formData.append(`file`, logo)
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnStoreTempFile`, requestOptions)
      const fetchRes = await apicall.json();
      console.log("fetchRes: ", fetchRes)
      return fetchRes;

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const updateCompany = async () => {
    try {
      const checkIsValidate = await validateRef.current.validateForm('compForm');
      if (checkIsValidate === true) {
        var active;
        activeValue = document.querySelector('input[name=isCompanyActive]:checked').value
        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }

        const data1 = {
          company_id: company_id,
          company_legal_name: companyLegalName,
          company_trade_name: companyTradeName,
          company_short_name: shortName,
          company_sector: companySector,
          company_type_id: companyTypeId,
          nature_of_business: natureOfBusiness,
          registration_no: registrationNo,
          registration_date: registrationDate,
          establish_date: establishDate,
          created_by: company_id === 0 ? UserName : null,
          modified_by: company_id !== 0 ? UserName : null,
          is_active: active,
          remark: remark,
        };
        console.log(data1);
        if (logo !== '' && logo !== undefined) {
          const uTempFile = await uploadTempFile();
        }

        const requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data1)
        };

        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          const evitCache = await child.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          FnCheckUpdateResponce();
        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }



  const validateFields = () => {
    validateRef.current.validateFieldsOnChange('compForm');
  }

  const comboOnChange = async (key) => {
    switch (key) {
      case 'companySector':
        var propertyVal = document.getElementById('companySectorId').value;
        if (propertyVal === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Company Sector')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").css("padding-top", "0px");
          }, 100)
        }
        var companySectorSelect = document.getElementById("companySectorId");
        var companySectors = companySectorSelect.options[companySectorSelect.selectedIndex].text;
        setCompanySector(companySectors)
        if (companySectors !== "") { $('#error_companySectorId').hide(); }
        break;
      case 'companyType':
        var comType = $('#companyTypeId').val();
        setCompanyTypeId(comType);

        var companyTypeVal = document.getElementById('companyTypeId').value;

        if (companyTypeVal === '0') {
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Company Type')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(0).css("padding-top", "0px");
          }, 100)
        }
        if (comType !== "") { $('#error_companyTypeId').hide(); }
        break;
    }

  }

  const fetchComapnyLogo = async () => {
    try {
      console.log("logoFileName: ", logoFileName)
      const downloadImageApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/company/FnGetCompanyLogo/${companyLegalName}`)
      const blob = await downloadImageApiCall.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${logoFileName}`,);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {
      case 'Company Type':
        child.current.fillComboBox("CompanyTypes").then((companyTypes) => {
          setCompanyTypes(companyTypes)
        })
        break;

      case 'Company Sector':
        var companySectors = await child.current.fillComboBox("CompanySectors").then(() => {
          setcompanySectoroptions(companySectors)
        })
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
      case 'Company Type':
        return <FrmPropertyEntry property_master_name={`CompanyTypes`} btn_disabled={true} />;

      case 'Company Sector':
        return <FrmPropertyEntry property_master_name={`CompanySectors`} btn_disabled={true} />;
      default:
        return null;
    }
  }


  return (
    <>
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <FrmValidations ref={validateRef} />
      <ComboBox ref={child} />
      <form id="compForm">
        <div className="row">
          <div className="col-sm-6 erp_form_col_div">
            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Type<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <select id="companyTypeId" value={companyTypeId} className="form-select form-select-sm" onChange={() => comboOnChange('companyType')}>
                  <option value="">Select</option>
                  <option value="0">Add New Record+</option>
                  {companyTypes?.map(companyType => (
                    <option value={companyType.field_id}>{companyType.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_companyTypeId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Legal Name<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id="companyLegalName" className="erp_input_field" value={companyLegalName} onChange={e => { setCompanyLegalName(e.target.value); validateFields() }} maxLength="200" />
                <MDTypography variant="button" id="error_companyLegalName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Trade Name<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" className="erp_input_field" id="companyTradeName" value={companyTradeName} onChange={e => { setCompanyTradeName(e.target.value); validateFields() }} maxLength="255" />
                <MDTypography variant="button" id="error_companyTradeName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id="shortName" className="erp_input_field" value={shortName} onChange={(e) => { setShortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="5" />
                <MDTypography variant="button" id="error_shortName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Sector<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <select size="sm" id="companySectorId" value={companySector} className="form-select form-select-sm" onChange={() => comboOnChange('companySector')}>
                  <option value="">Select</option>
                  <option value="0">Add New Record+</option>
                  {companySectoroptions?.map(companySec => (
                    <option value={companySec.field_name}>{companySec.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_companySectorId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Nature Of Business</Form.Label>
              </div>
              <div className="col">
                <Form.Control as="textarea" rows={1} id="natureOfBusiness" className="erp_txt_area" value={natureOfBusiness} onChange={e => { setNatureOfBusiness(e.target.value); validateFields() }} maxlength="255" optional='optional' />
                <MDTypography variant="button" id="error_natureOfBusiness" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
          </div>

          {/* Second column  */}
          <div className="col-sm-6 erp_form_col_div">
            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Registration No.</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id="registrationNo" className="erp_input_field" value={registrationNo} onChange={e => { setRegistrationNo(e.target.value.split(' ').join('')); validateFields() }} maxLength="255" optional='optional' />
                <MDTypography variant="button" id="error_registrationNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label"> Registration Date</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="date" id="registrationDateId" className="erp_input_field date" value={registrationDate} onChange={e => { setRegistrationDate(e.target.value); validateFields() }} optional='optional' />
                <MDTypography variant="button" id="error_registrationDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Establish Date</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="date" id="establishDateId" className="erp_input_field" value={establishDate} onChange={e => { setEstablishDate(e.target.value); validateFields() }} optional='optional' />
                <MDTypography variant="button" id="error_establishDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Logo<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <Form.Control type="file" id="CompanyLogo" className="erp_input_field" onChange={handleFileChange} accept="image/*" />
                <MDTypography component="label" className="erp-form-label" variant="button" id="logoFile" fontWeight="regular" color="info" style={{ display: 'none' }} >
                  <Link to="#" onClick={fetchComapnyLogo}> {logoFileName} </Link>
                </MDTypography>
                <MDTypography component="label" className="erp-form-label" variant="button" id="TemplogoFile" fontWeight="regular" color="info" style={{ display: 'none' }} >
                  <Link to="#" onClick={fetchTempLogo}>  {templogoFileName}   </Link>
                </MDTypography>
                <MDTypography variant="button" id="error_CompanyLogo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Remark</Form.Label>
              </div>
              <div className="col">
                <Form.Control as="textarea" rows={1} id="remark" className="erp_txt_area" value={remark} onChange={e => { setRemark(e.target.value); validateFields() }} maxlength="500" optional='optional' />
                <MDTypography variant="button" id="error_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Company Active<span className="required">*</span></Form.Label>
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
                        name="isCompanyActive"
                        defaultChecked
                      />
                    </div>
                    <div className="sCheck">
                      <Form.Check
                        className="erp_radio_button"
                        label="No"
                        value="0"
                        type="radio"
                        name="isCompanyActive"
                      />
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div >
      </form>


      <div className="text-center">
        <MDButton type="button" className="erp-gb-button"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/CompanyListing/reg' : '/Masters/CompanyListing';
            navigate(path);
          }}
          variant="button"
          fontWeight="regular">Back</MDButton>
        <MDButton type="button" onClick={updateCompany} id="updateBtn" style={{ display: 'none' }} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' && keyForViewUpdate === '' ? 'd-none' : 'display'}`} variant="button"
          fontWeight="regular">Update</MDButton>
        <MDButton type="button" onClick={handleSubmit} id="nxtBtn" className="ms-2 erp-gb-button" variant="button"
          fontWeight="regular">next</MDButton>
        <MDButton type="button" onClick={props.goToNext} id="nxtOnlyBtn" style={{ display: 'none' }} className="ms-2 erp-gb-button" variant="button"
          fontWeight="regular">next</MDButton>
      </div >


      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

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

export default FrmMCompanyEntry;
