import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Modal from 'react-bootstrap/Modal';

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmPropertyEntry from "Masters/MProperty/FrmPropertyEntry";
import FrmValidations from "FrmGeneric/FrmValidations";
import { MdRefresh } from "react-icons/md";
import { Tooltip } from "react-bootstrap";
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";


function FrmDesignationEntry({ goToNext, designationId, keyForViewUpdate, compType }) {
    //case no. 1 chnges by ujjwala 3/1/2024 Start
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;

    const validate = useRef();
    const comboDataAPiCall = useRef();
    const frmValidation = useRef();
    var activeValue = '';
    const navigate = useNavigate();

    // Add Company Form Fields
    const [designation_id, setDesignationId] = useState(designationId)

    const [cmb_company_sector_id, setDesignationSector] = useState('');
    // end by Ujjwala
    const [txt_designation_name, setDesignationName] = useState('');
    const [txt_short_name, setShortName] = useState('');
    const [cmb_report_designation_id, setReportDesignation] = useState();
    const [txt_designations_position, setDesignationPosition] = useState(1);
    const [actionLabel, setActionLabel] = useState('Save')
    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [cmb_employee_type, setEmployeeType] = useState('');
    const [employeeGroupTypeOptions, setEmployeeGroupTypeOptions] = useState([]);

    //option Feilds
    const [Sectoroptions, setSectoroptions] = useState([])
    const [reportDesignationOption, setreportDesignationOption] = useState([])

    // to add new records in combo box 
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');


    // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
    }
    //end by ujjwala

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionLabel('Update')
                $('#txt_designation_name').attr('disabled', true)
                $('#cmb_employee_type').attr('disabled', true)
                $('#cmb_company_sector_id').attr('disabled', true)
                $('#txt_short_name').attr('disabled', true)
                $('#shortName').attr('disabled', true)
                break;
            case 'view':
                await validate.current.readOnly("designationForm");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                break;
        }

    };
    //end by ujjwala

    // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
    useEffect(async () => {
        await fillComobos();
        await ActionType()
        if (designationId !== 0 && designation_id !== undefined) {
            await FnCheckUpdateResponce()
        }

    }, [])

    const validateErrorMsgs = () => {
        frmValidation.current.validateFieldsOnChange('designationForm')
    }
    //end by ujjwala

    const validateFields = () => {
        validate.current.validateFieldsOnChange('designationForm')
    }

    const fillComobos = async () => {
        try {
            if (comboDataAPiCall.current) {
                debugger;
                comboDataAPiCall.current.fillComboBox("CompanySectors").then((propertyList1) => {
                    setSectoroptions(propertyList1)
                })

                // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
                comboDataAPiCall.current.fillMasterData("cmv_designation", "", "").then((getDesignationApiCall) => {
                    setreportDesignationOption(getDesignationApiCall);
                });

                //end by ujjwala

                comboDataAPiCall.current.fillComboBox('EmployeeTypeGroup').then((employeeGroupTypesApiCall) => {
                    setEmployeeGroupTypeOptions(employeeGroupTypesApiCall);
                });

                comboDataAPiCall.current.fillComboBox('EmployeeType').then((employeeTypesApiCall) => {
                    setEmployeeTypeOptions(employeeTypesApiCall);
                });

            }
        } catch (error) {
            console.log('error', error)
            navigate('/Error')
        }

    }

    const comboOnChange = async (key) => {
        // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
        switch (key) {
            case 'Designation':
                var assignToheadVal = document.getElementById('cmb_report_designation_id').value;
                if (assignToheadVal === "0") {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                break;
            //end by ujjwala
            case 'companySector':
                var propertyVal = document.getElementById('cmb_company_sector_id').value;
                setDesignationSector(propertyVal)
                if (propertyVal !== "") {
                    $('#error_cmb_company_sector_id').hide();
                }
                if (propertyVal === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Company Sector')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").css("padding-top", "0px");
                    }, 100)
                }
                break;
        }

    }

    // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
    const FnRefreshbtn = async (key) => {
        switch (key) {
            case 'Designation':
                comboDataAPiCall.current.fillMasterData("cmv_designation", "", "").then((empList1) => {
                    setreportDesignationOption(empList1)
                })
                break;

            default:
                break;
        }
    }

    const validationfornext = async () => {
        const checkIsValidate = await validate.current.validateForm("designationForm");
        if (checkIsValidate && designation_id !== 0) {
            goToNext(designation_id, keyForViewUpdate, txt_designation_name, cmb_employee_type);
        } else {
            console.log("Validation failed!");
        }
    }

    //end by ujjwala
    const handleSubmit = async () => {
        const checkIsValidate = await validate.current.validateForm("designationForm");
        if (checkIsValidate === true) {
            var active;

            activeValue = document.querySelector('input[name=isDesignationActive]:checked').value

            switch (activeValue) {
                case '0': active = false; break;
                case '1': active = true; break;
            }

            const data = {
                company_id: COMPANY_ID,
                designation_id: designation_id,
                created_by: UserName,
                modified_by: designation_id === null ? null : UserName,
                company_sector_id: cmb_company_sector_id,
                designation_name: txt_designation_name,
                short_name: txt_short_name,
                report_designation_id: cmb_report_designation_id,
                employee_type: cmb_employee_type,
                designations_position: txt_designations_position,
                is_active: active,

            };
            console.log(data);
            const method = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnAddUpdateRecord`, method)
            const responce = await apiCall.json();
            console.log("response error: ", responce.data);
            if (responce.error !== "") {
                console.log("response error: ", responce.error);
                setErrMsg(responce.error)
                setShowErrorMsgModal(true)

            } else {
                const evitCache = comboDataAPiCall.current.evitCache();
                console.log(evitCache);
                setDesignationId(responce.data.designation_id)
                setSuccMsg(responce.message);
                setShowSuccessMsgModal(true);
            }

        }

    };

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnShowParticularRecordForUpdate/${designation_id}`)
            const updateRes = await apiCall.json();
            setDesignationId(designation_id)
            setDesignationSector(updateRes.data.company_sector_id);
            setDesignationName(updateRes.data.designation_name);
            setEmployeeType(updateRes.data.employee_type);
            setShortName(updateRes.data.short_name);
            setReportDesignation(updateRes.data.report_designation_id);
            setDesignationPosition(updateRes.data.designations_position);

            switch (updateRes.data.is_active) {
                case true:
                    document.querySelector('input[name="isDesignationActive"][value="1"]').checked = true;
                    break;
                case false:
                    document.querySelector('input[name="isDesignationActive"][value="0"]').checked = true;
                    break;
            }

        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }




    const validateNo = (noKey) => {
        const regexNo = /^[0-9\b]+$/;
        const value = noKey.target.value
        if (regexNo.test(value) || value === '') {
            setDesignationPosition(value)
        }
    }



    // Show ADd record Modal
    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {

            case 'Company Sector':
                comboDataAPiCall.current.fillComboBox("CompanySectors").then((CompanySectorupdatedlist) => {
                    setSectoroptions(CompanySectorupdatedlist)
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

            case 'Company Sector':
                return <FrmPropertyEntry property_master_name={`CompanySectors`} btn_disabled={true} />;

            default:
                return null;
        }
    }

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataAPiCall} />
            <FrmValidations ref={frmValidation} />
            <div className='card p-1'>

                <form id="designationForm">
                    <div className="row erp_transporter_div">

                        <div className="col-sm-6 erp_form_col_div">
                            <div className="row">

                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                </div>
                                <div className="col">
                                    <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { setEmployeeType(e.target.value); validateErrorMsgs() }} maxLength="255">
                                        <option value="" disabled>Select</option>
                                        {employeeTypeOptions?.map(employeeTypes => (
                                            <option value={employeeTypes.field_name}>{employeeTypes.field_name}</option>
                                        ))}
                                    </select>
                                    <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Company Sector </Form.Label>
                                </div>
                                <div className="col">
                                    <select size="sm" id="cmb_company_sector_id" value={cmb_company_sector_id} className="form-select form-select-sm" onChange={() => comboOnChange('companySector')} optional='optional'>
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>

                                        {Sectoroptions.length !== 0 ? (
                                            <>
                                                {Sectoroptions.map(orderType => (
                                                    <option key={orderType.field_id} value={orderType.field_id} lbl={orderType.field_name}> {orderType.field_name} </option>
                                                ))}
                                            </>
                                        ) : null}


                                    </select>



                                    <MDTypography variant="button" id="error_cmb_company_sector_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Designation Name <span className="required">*</span></Form.Label>
                                </div>
                                <div className="col">
                                    <Form.Control type="text" id="txt_designation_name" className="erp_input_field" value={txt_designation_name} onChange={e => { setDesignationName(e.target.value); validateFields() }} maxLength="200" />
                                    <MDTypography variant="button" id="error_txt_designation_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Short Name </Form.Label>
                                </div>
                                <div className="col">
                                    <Form.Control type="text" id="txt_short_name" className="erp_input_field" value={txt_short_name} onChange={(e) => { setShortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="5" optional='optional' />
                                    <MDTypography variant="button" id="error_txt_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                    </MDTypography>
                                </div>
                            </div>

                        </div>

                        {/* Second column   */}
                        <div className="col-sm-6 erp_form_col_div">

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label"> Report Designation Name<span className="required">*</span> </Form.Label>
                                </div>
                                <div className="col">
                                    <select size="sm" id="cmb_report_designation_id" value={cmb_report_designation_id} className="form-select form-select-sm" onChange={(e) => { setReportDesignation(e.target.value); comboOnChange('Designation'); validateFields() }} >
                                        <option value="">Select</option>
                                        {reportDesignationOption.length !== 0 ? (
                                            <>
                                                {reportDesignationOption.map(orderType => (
                                                    <option key={orderType.field_id} value={orderType.field_id} lbl={orderType.field_name}> {orderType.field_name} </option>
                                                ))}
                                            </>
                                        ) : null}
                                    </select>

                                    <MDTypography variant="button" id="error_cmb_report_designation_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                                <div className="col-sm-1 col-2">
                                    <Tooltip title="Refresh" placement="top">
                                        <MDTypography>
                                            <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("Designation"); }} style={{ color: 'black' }} />
                                        </MDTypography>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Designation Position</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="text" id="txt_designations_position" className="erp_input_field" value={txt_designations_position} onChange={e => { validateNo(e); validateFields() }} maxLength="11" optional='optional' />
                                    <MDTypography variant="button" id="error_txt_designations_position" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
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
                                                    value="1"
                                                    name="isDesignationActive"
                                                    defaultChecked

                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isDesignationActive"

                                                />
                                            </div>
                                        </div>
                                    </Form>
                                </div>

                            </div>
                        </div>

                    </div >

                </form >


                <div className="card-footer py-0 text-center">
                    <MDButton type="button" className="erp-gb-button"

                        onClick={() => {
                            const path = compType === 'Register' ? '/Masters/DesignationListing/reg' : '/Masters/DesignationListing';
                            navigate(path);
                        }}
                        variant="button"

                        fontWeight="regular">Back</MDButton>
                    <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                        fontWeight="regular">{actionLabel}</MDButton>

                    <MDButton type="button"
                        onClick={validationfornext}
                        // onClick={() => props.goToNext(designationId, keyForViewUpdate)}

                        id="nxtBtn" className="erp_MLeft_btn erp-gb-button " variant="button"
                        fontWeight="regular">Next</MDButton>

                </div >

            </div >


            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


            <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Body className='erp_city_modal_body'>
                    <div className='row'>
                        <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                    </div>
                    {displayRecordComponent()}

                </Modal.Body>
            </Modal >

        </>

    )
}

export default FrmDesignationEntry
