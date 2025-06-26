import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from 'jquery';
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";
import { CircularProgress } from "@mui/material";
import { resetGlobalQuery } from "assets/Constants/config-constant";
import { globalQuery } from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";

function FrmEmployeeGradeEntry({ goToNext, empGradeID }) {
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;


    const validate = useRef();
    const navigate = useNavigate();

    const { state } = useLocation();
    let { keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    const [employee_grade_id, setempgrade_id] = useState(empGradeID)
    const [employeeGroupTypeOptions, setEmployeeGroupTypeOptions] = useState([]);
    const [cmb_employee_group_type, setEmployeeGroupType] = useState('');
    const [txt_empgrade_name, setempgrade_name] = useState("")
    const [txt_empgrade_shortName, setempgrade_shortName] = useState("")
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    useEffect(async () => {
        await ActionType()
        await fillPropertyComboBoxes();
        if (employee_grade_id !== 0 && employee_grade_id !== undefined) {
            await FnCheckUpdateResponce()
        }
    }, [])

    const fillPropertyComboBoxes = async () => {
        try {
            const employeeGroupTypesApiCall = await comboDataAPiCall.current.fillComboBox('EmployeeTypeGroup');
            setEmployeeGroupTypeOptions(employeeGroupTypesApiCall);

        } catch (error) {
            console.log("error : ", error)
        }
    }


    // to add new records in combo box 
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const comboDataAPiCall = useRef();

    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
    }
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update');
                $("input[type=radio]").attr('disabled', false);
                $('#btn_save').attr('disabled', false);
                $('#btn_upload_doc').attr('disabled', false);
                $('#txt_empgrade_name').attr('disabled', true);
                $('#txt_empgrade_shortName').attr('disabled', true);
                break;

            case 'view':
                setActionType('(View)');
                $("input[type=radio]").attr('disabled', true);
                $('#btn_upload_doc').attr('disabled', true)
                $('#txt_empgrade_name').attr('disabled', true)
                $('#txt_empgrade_shortName').attr('disabled', true)
                await validate.current.readOnly("employeeGradeform");
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    }

    const validateFields = () => {
        validate.current.validateFieldsOnChange('employeeGradeform')
    }


    const validationfornext = async () => {
        const checkIsValidate = await validate.current.validateForm("employeeGradeform");
        if (checkIsValidate && employee_grade_id !== 0) {
            goToNext(employee_grade_id, keyForViewUpdate, txt_empgrade_name, txt_empgrade_name);
        }

    }

    const addemployeeGradeData = async () => {
        debugger
        try {
            const checkIsValidate = await validate.current.validateForm("employeeGradeform");
            if (checkIsValidate === true) {
                var active;
                var activeValue = document.querySelector('input[name=isEmployeeGradeActive]:checked').value
                switch (activeValue) {
                    case 'false': active = false; break;
                    case 'true': active = true; break;
                }

                const data = {
                    company_id: COMPANY_ID,
                    employee_grade_id: employee_grade_id,
                    created_by: UserName,
                    modified_by: employee_grade_id === 0 ? null : UserName,
                    employee_grade_name: txt_empgrade_name,
                    short_name: txt_empgrade_shortName,
                    employee_group_type: cmb_employee_group_type,
                    created_by: UserName,
                    modified_by: employee_grade_id === 0 ? null : UserName,
                    is_active: active,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employeegrade/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce.data);
                if (responce.error !== "") {
                    $('#error_txt_empgrade_name').hide();
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    console.log("employee_grade_id", responce.data);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                    setempgrade_id(responce.data.employee_grade_id)
                    await FnCheckUpdateResponce();
                }

            }
        } catch (error) {
            console.log("error: ", error);
            navigate('/Error')
        }
    };
    const FnCheckUpdateResponce = async () => {
        try {
            if (employee_grade_id !== 0) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employeegrade/FnShowParticularRecordForUpdate/${employee_grade_id}/${COMPANY_ID}`)

                const updateRespose = await apiCall.json();
                const data = (updateRespose.EmployeeGradeModelRecord)
                if (data !== null && data !== "") {
                    setempgrade_id(employee_grade_id)
                    setempgrade_name(data.employee_grade_name)
                    setempgrade_shortName(data.short_name)
                    setEmployeeGroupType(data.employee_group_type)

                    switch (data.is_active) {
                        case true:
                            document.querySelector('input[name="isEmployeeGradeActive"][value="true"]').checked = true;
                            break;
                        case false:
                            document.querySelector('input[name="isEmployeeGradeActive"][value="false"]').checked = true;
                            break;
                    }


                }
            }

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }



    const validateEmployeeGradeName = async () => {
        try {
            resetGlobalQuery();
            globalQuery.columns = ['employee_grade_name'];
            globalQuery.table = "cm_employee_grade";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "employee_grade_name", operator: "=", value: $('#txt_empgrade_name').val() });

            const productvalidationCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);

            if (productvalidationCall.length !== 0) {
                $('#error_txt_empgrade_name').text("Employee Grade name already exists");
                $('#error_txt_empgrade_name').show();
                $('#error_txt_empgrade_name').focus();
                return false;
            } else {
                $('#error_txt_empgrade_name').hide();
                return true;
            }
        } catch (error) {
            console.log("error: ", error);
            return false;
        }
    };
    $('#txt_empgrade_shortName').on('input', async () => {
        try {
            const result = await validateEmployeeGradeName();
            if (result) {
                $('#error_txt_empgrade_name').hide();
            } else {
                $('#error_txt_empgrade_name').show();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    });

    const validateShortName = async () => {
        debugger
        try {
            resetGlobalQuery();
            globalQuery.columns = ['short_name'];
            globalQuery.table = "cm_employee_grade";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "short_name", operator: "=", value: txt_empgrade_shortName });

            const productvalidationCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);

            if (productvalidationCall.length !== 0) {

                setTimeout(() => {
                    $('#error_txt_empgrade_shortName').text("Employee Grade Short name already exist");
                    $('#error_txt_empgrade_shortName').show();
                    $('#error_txt_empgrade_shortName').focus();
                }, 1);

                return false;
            } else {
                $('#error_txt_empgrade_shortName').hide();
                return true;
            }
        } catch (error) {
            console.log("error: ", error);
            return false;
        }
    };
    $('#txt_empgrade_name').on('input', async () => {
        try {
            const result = await validateShortName();
            debugger
            if (result) {
                $('error_txt_empgrade_shortName').hide();
            } else {
                $('error_txt_empgrade_shortName').show();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    });

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataAPiCall} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress />
                        <span>Loading...</span>
                    </div>
                </div> :
                ''}

            <div className='card p-1'>

                <form id="employeeGradeform">
                    <div className="row erp_transporter_div">

                        <div className="col-sm-6 erp_form_col_div">

                            <div className='row'>
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Group Type <span className="required">*</span></Form.Label>
                                </div>
                                <div className="col">
                                    <select id="cmb_employee_group_type" className="form-select form-select-sm" value={cmb_employee_group_type} onChange={e => { setEmployeeGroupType(e.target.value); }} maxLength="255">
                                        <option value="" disabled>Select</option>
                                        {employeeGroupTypeOptions?.map(groupType => (
                                            <option value={groupType.field_name}>{groupType.field_name}</option>
                                        ))}
                                    </select>
                                    <MDTypography variant="button" id="error_cmb_employee_group_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Employee Grade Name<span className="required">*</span></Form.Label>
                                </div>
                                <div className="col">
                                    {/* <Form.Control type="text" className="erp_input_field" id="txt_empgrade_name" value={txt_empgrade_name} onChange={e => { setempgrade_name(e.target.value); validateFields(); }} onBlur={() => { if (keyForViewUpdate === 'Add') { validateEmployeeGradeName(); } }} maxLength="255" /> */}
                                    <Form.Control type="text" className="erp_input_field" id="txt_empgrade_name" value={txt_empgrade_name} onChange={e => { setempgrade_name(e.target.value); validateFields(); }} maxLength="255" />
                                    <MDTypography variant="button" id="error_txt_empgrade_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>



                        </div>
                        {/* test case 4 shivanjali */}
                        {/* second column */}
                        <div className="col-sm-6 erp_form_col_div">
                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
                                </div>
                                <div className="col">
                                    {/* <Form.Control type="text" id="txt_empgrade_shortName" className="erp_input_field" value={txt_empgrade_shortName} onChange={(e) => { setempgrade_shortName(e.target.value.toUpperCase()); validateFields(); }} onBlur={() => { if (keyForViewUpdate === 'Add') { validateShortName(); } }} maxLength="50" /> */}
                                    <Form.Control type="text" id="txt_empgrade_shortName" className="erp_input_field" value={txt_empgrade_shortName} onChange={(e) => { setempgrade_shortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="50" />
                                    <MDTypography variant="button" id="error_txt_empgrade_shortName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                                    </MDTypography>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <Form.Label className="erp-form-label">Is Active</Form.Label>
                                </div>
                                <div className="col">

                                    <div className="erp_form_radio">
                                        <div className="fCheck">
                                            <Form.Check
                                                className="erp_radio_button"
                                                label="Yes"
                                                type="radio"
                                                value="true"
                                                name="isEmployeeGradeActive"
                                                defaultChecked

                                            />
                                        </div>
                                        <div className="sCheck">
                                            <Form.Check
                                                className="erp_radio_button"
                                                label="No"
                                                value="false"
                                                type="radio"
                                                name="isEmployeeGradeActive"

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="card-footer py-0 text-center">
                    <MDButton type="button" className="erp-gb-button"
                        onClick={() => {
                            const path = compType === 'Register' ? '/Masters/MEmployeeGrade/FrmEmployeeGradeListing/reg' : '/Masters/MEmployeeGrade/FrmEmployeeGradeListing';
                            navigate(path);
                        }} variant="button"
                        fontWeight="regular">Back</MDButton>
                    <MDButton type="submit" onClick={addemployeeGradeData} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === "view" ? 'd-none' : 'display'}`} variant="button"
                        fontWeight="regular">{actionLabel}</MDButton>
                    <MDButton type="button"
                        onClick={validationfornext}
                        id="nxtBtn" className="ms-2 erp-gb-button " variant="button"
                        fontWeight="regular" >Next</MDButton>
                </div >
            </div>
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

        </>
    )
}
export default FrmEmployeeGradeEntry
