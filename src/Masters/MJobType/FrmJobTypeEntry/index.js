import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstra
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import FrmDepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry"
import { resetGlobalQuery } from "assets/Constants/config-constant";
import { globalQuery } from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";


function FrmJobTypeEntry(props) {

    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { jobTypeId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const validate = useRef();
    const navigate = useNavigate()
    const comboDataFunc = useRef();


    //radio btn
    const [modalHeaderName, setHeaderName] = useState('')
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    //financial Year Feilds
    const [chk_job_type_category, setJobTypeCategory] = useState('Standard Rates');
    const [txt_job_type_id, setJobTypeId] = useState(jobTypeId);
    const [cmb_department_id, setDeparmentId] = useState([]);
    const [cmb_sub_department_id, setSubDeparmentId] = useState([]);
    const [cmb_skill_type, setSkillType] = useState([]);
    const [txt_hours_month, setHoursMonth] = useState('');
    const [txt_job_type_name, setJobTypeName] = useState('');
    const [txt_job_type_short_name, setJobTypeShortName] = useState('');
    const [txt_job_type_rate, setJobTypeRate] = useState(1);
    const [txt_job_type_rate_group, setJobTypeRateGroup] = useState(1);
    const [txt_job_type_attendance_allowance, setJobTypeAttndanceAllowance] = useState(0);

    const [txt_job_type_attendance_allow_24_days, setJobTypeAtteAllowance24Days] = useState(0);

    const [txt_job_type_attendance_allow_26_days, setJobTypeAtteAllowance26Days] = useState(0);

    const [txt_on_time_allowance, setAtteAllowanceOnTime] = useState(0);

    const [txt_job_type_night_allowance, setJobTypeNightAllowance] = useState(0);
    const [txt_job_type_special_allowance, setJobTypeSpecialAllowance] = useState(0);
    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    // hooks for combo
    const [departmentOption, setDepartmentOption] = useState([]);
    const [subDepartmentOption, setSubDepartmentOption] = useState([]);
    const [skillTypeOption, setSkillTypeOption] = useState([]);


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MJobType/FrmJobTypeListing`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            await fillComobos();
            if (jobTypeId !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])


    const addJobType = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("jobTypeform");
            if (checkIsValidate === true) {
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    job_type_id: txt_job_type_id,
                    created_by: UserName,
                    modified_by: txt_job_type_id === 0 ? null : UserName,
                    job_type_category: chk_job_type_category,
                    department_id: cmb_department_id,
                    sub_department_id: cmb_sub_department_id,
                    skill_type: cmb_skill_type,
                    hours_month: txt_hours_month,
                    job_type_name: txt_job_type_name,
                    job_type_short_name: txt_job_type_short_name,
                    job_type_rate: txt_job_type_rate,
                    job_type_attendance_allowance: txt_job_type_attendance_allowance,
                    job_type_night_allowance: txt_job_type_night_allowance,
                    job_type_special_allowance: txt_job_type_special_allowance,
                    job_type_rate_group: txt_job_type_rate_group,
                    is_active: chk_isactive,
                    job_type_attendance_allow_24_days:txt_job_type_attendance_allow_24_days,
                    job_type_attendance_allow_26_days:txt_job_type_attendance_allow_26_days,
                    on_time_allowance:txt_on_time_allowance,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/jobType/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };


    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                // $('#txt_job_type_name').attr('disabled', true)
                // $('#txt_job_type_short_name').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');

                await validate.current.readOnly("jobTypeform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('jobTypeform')
    }

    const FnCombosOnChanges = async (key) => {
        debugger
        switch (key) {
            case 'department':
                const DepartmentVar = document.getElementById('cmb_department_id').value;
                setDeparmentId(DepartmentVar)

                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
                globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: DepartmentVar });
                const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSubDepartmentOption(subDepartmentopt)
                break;

            case 'sub_Department':
                debugger
                const subDepartmentVar = document.getElementById('cmb_sub_department_id').value;
                setSubDeparmentId(subDepartmentVar)
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
                const subDepartmentopts = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSubDepartmentOption(subDepartmentopts)

                break;
            case 'SkillType':
                const skillTypeVar = document.getElementById('cmb_skill_type').value;
                setSkillType(skillTypeVar)
                generateJobType();
                $('#error_cmb_skill_type').hide();
                if (skillTypeVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Skill Type')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;


        }
    }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/jobType/FnShowParticularRecord/${txt_job_type_id}`)
            const updateRes = await apiCall.json();
            const data = JSON.parse(updateRes.data)
            setJobTypeId(data.job_type_id)
            setJobTypeCategory(data.job_type_category);
            setDeparmentId(data.department_id);
            FnCombosOnChanges('department')
            setSubDeparmentId(data.sub_department_id);
            FnCombosOnChange('sub_Department')
            setSkillType(data.skill_type);
            setJobTypeName(data.job_type_name)
            setHoursMonth(data.hours_month)
            setJobTypeShortName(data.job_type_short_name);
            setJobTypeRate(data.job_type_rate);
            setJobTypeAttndanceAllowance(data.job_type_attendance_allowance);
            setJobTypeAtteAllowance24Days(data.job_type_attendance_allow_24_days);
            setJobTypeAtteAllowance26Days(data.job_type_attendance_allow_26_days);
            setAtteAllowanceOnTime(data.on_time_allowance);
            setJobTypeNightAllowance(data.job_type_night_allowance);
            setJobTypeSpecialAllowance(data.job_type_special_allowance);
            setJobTypeRateGroup(data.job_type_rate_group);
            setIsActive(data.is_active);
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }

    const fillComobos = async () => {
        // comboDataFunc.current.fillMasterData("cmv_department", "parent_department_id", "").then((departmentidListApiCall) => {
        //     setDepartmentOption(departmentidListApiCall);
        // })

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "department_type", operator: "=", value: "M" });
        const Departmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setDepartmentOption(Departmentopt)


        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
        const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setSubDepartmentOption(subDepartmentopt)

        // comboDataFunc.current.fillMasterData("cmv_department", "department_id", "").then((departmentidListApiCall) => {
        //     setSubDepartmentOption(departmentidListApiCall);
        // })

        // comboDataFunc.current.fillComboBox("SkillLevels").then((departmentidListApiCall) => {
        //     setSkillTypeOption(departmentidListApiCall);
        // })

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'property_value'];
        globalQuery.table = "amv_properties"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "SkillLevels" });
        const skillType = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setSkillTypeOption(skillType)

    }

    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Department':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: "" });
                const Department = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setDeparmentId(Department)
                break;

            case 'Sub Department':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_id", operator: "=", value: "" });
                const subDepartment = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setDeparmentId(subDepartment)
                break;

            case 'Skill Type':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'property_name'];
                globalQuery.table = "amv_properties"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const skillType = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSkillType(skillType)
                break;

        }


        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
        }, 200)

    }

    const generateJobType = async () => {
        const skillType = document.getElementById('cmb_skill_type').value;
        const hoursMonth = document.getElementById('txt_hours_month').value;
        const subDepartmentshortName = $('#cmb_sub_department_id option:selected').attr('subdepartmentName');
        const skillTypes = $('#cmb_skill_type option:selected').attr('skillTypeShortName');

        // Include skillType only if it has a value
        // const jobType = subDepartmentshortName + (skillType ? `:${skillType}` '') + `:${hoursMonth}`;
        let jobType = subDepartmentshortName;

        if (skillTypes) {
            jobType += `:${skillTypes}`;
        }
        if (hoursMonth || (!skillTypes && subDepartmentshortName)) {
            jobType += `:${hoursMonth}`;
        }
        setJobTypeName(jobType);
    }

    const FnCombosOnChange = async (key) => {
        debugger
        switch (key) {
            case 'Department':
                const DepartmentVar = document.getElementById('cmb_department_id').value;
                setDeparmentId(DepartmentVar)

                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
                globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: DepartmentVar });
                const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSubDepartmentOption(subDepartmentopt)

                $('#error_cmb_department_id').hide();
                if (DepartmentVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;

            case 'Sub Department':
                debugger
                const subDepartmentVar = document.getElementById('cmb_sub_department_id').value;
                setSubDeparmentId(subDepartmentVar)
                generateJobType();
                $('#error_cmb_sub_department_id').hide();
                if (subDepartmentVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;
            case 'SkillType':
                const skillTypeVar = document.getElementById('cmb_skill_type').value;
                setSkillType(skillTypeVar)
                const subDepartmentVars = document.getElementById('cmb_sub_department_id').value;
                if (subDepartmentVars !== "") {
                    generateJobType();
                }

                $('#error_cmb_skill_type').hide();
                if (skillTypeVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Skill Type')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;
            case 'hoursMonth':
                const hoursMonth = document.getElementById('txt_hours_month').value;
                setHoursMonth(hoursMonth)
                const subDepartmentVal = document.getElementById('cmb_sub_department_id').value;
                if (subDepartmentVal !== "") {
                    generateJobType();
                }


                break;


        }
    }
    const displayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Department':
                return <FrmDepartmentEntry btn_disabled={true} />;
            default:
                return null;
        }
    }

    const validateNo = (key) => {
        const numCheck = /^[0-9]*\.?[0-9]*$/;
        const regexNo = /^[0-9]*\.[0-9]{5}$/
        var dot = '.';
        switch (key) {
            case 'pFromRange':
                var pFromRangeVal = $('#txt_job_type_rate').val();
                if (!regexNo.test(pFromRangeVal) && pFromRangeVal.length <= 14 || pFromRangeVal.indexOf(dot) === 14) {
                    if (numCheck.test(pFromRangeVal)) {
                        setJobTypeRate(pFromRangeVal)
                    }

                }
                break;
            case 'pToRange':
                var pToRangeVal = $('#txt_job_type_rate_group').val();
                if (!regexNo.test(pToRangeVal) && pToRangeVal.length <= 14 || pToRangeVal.indexOf(dot) === 14) {
                    if (numCheck.test(pToRangeVal)) {
                        setJobTypeRateGroup(pToRangeVal)
                    }

                }
                break;
            case 'attendanceAllowance':
                var attendanceAllowanceVal = $('#txt_job_type_attendance_allowance').val();
                if (!regexNo.test(attendanceAllowanceVal) && attendanceAllowanceVal.length <= 14 || attendanceAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(attendanceAllowanceVal)) {
                        setJobTypeAttndanceAllowance(attendanceAllowanceVal)
                    }

                }
                break;
            case 'attendanceAllowance24days':
                var attendanceAllowanceVal = $('#txt_job_type_attendance_allow_24_days').val();
                if (!regexNo.test(attendanceAllowanceVal) && attendanceAllowanceVal.length <= 14 || attendanceAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(attendanceAllowanceVal)) {
                        setJobTypeAtteAllowance24Days(attendanceAllowanceVal)
                    }

                }
                break;
            case 'attendanceAllowance26days':
                var attendanceAllowanceVal = $('#txt_job_type_attendance_allow_26_days').val();
                if (!regexNo.test(attendanceAllowanceVal) && attendanceAllowanceVal.length <= 14 || attendanceAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(attendanceAllowanceVal)) {
                        setJobTypeAtteAllowance26Days(attendanceAllowanceVal)
                    }

                }
                break;
            case 'attendanceOnTimeAllowance':
                var attendanceAllowanceVal = $('#txt_on_time_allowance').val();
                if (!regexNo.test(attendanceAllowanceVal) && attendanceAllowanceVal.length <= 14 || attendanceAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(attendanceAllowanceVal)) {
                        setAtteAllowanceOnTime(attendanceAllowanceVal)
                    }

                }
                break;

            case 'nightAllowances':
                var nightAllowanceVal = $('#txt_job_type_night_allowance').val();
                if (!regexNo.test(nightAllowanceVal) && nightAllowanceVal.length <= 14 || nightAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(nightAllowanceVal)) {
                        setJobTypeNightAllowance(nightAllowanceVal)
                    }

                }
                break;
            case 'specialAllowance':
                var specialAllowanceVal = $('#txt_job_type_special_allowance').val();
                if (!regexNo.test(specialAllowanceVal) && specialAllowanceVal.length <= 14 || specialAllowanceVal.indexOf(dot) === 14) {
                    if (numCheck.test(specialAllowanceVal)) {
                        setJobTypeSpecialAllowance(specialAllowanceVal)
                    }

                }
                break;
        }
    }
    return (
        <>
            <ComboBox ref={comboDataFunc} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Job Type {actionType} </label>
                    </div>
                    <form id="jobTypeform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Category</Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Standard Rates" type="radio" lbl="Yes" value="Standard Rates" name="chk_job_type_category" checked={chk_job_type_category === "Standard Rates"} onClick={() => { setJobTypeCategory('Standard Rates'); }} /> </div>
                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="MachineWise Rates" type="radio" lbl="No" value="MachineWise Rates" name="chk_job_type_category" checked={chk_job_type_category === "MachineWise Rates"} onClick={() => { setJobTypeCategory('MachineWise Rates'); }} /> </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Department Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_department_id" className="form-select form-select-sm" value={cmb_department_id} onChange={(e) => { FnCombosOnChange('Department'); setDeparmentId(e.target.value); }}>
                                            <option value="">Select</option>
                                            <option value="0" disabled={props.btn_disabled}>Add New Record+</option>
                                            {departmentOption.length !== 0 ? (
                                                <>
                                                    {departmentOption?.map(deprtname => (
                                                        <option value={deprtname.field_id} departmentName={deprtname.department_short_name}>{deprtname.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Sub Department<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_sub_department_id" className="form-select form-select-sm" value={cmb_sub_department_id} onChange={(e) => { FnCombosOnChange('Sub Department'); setSubDeparmentId(e.target.value) }}>
                                            <option value="">Select</option>
                                            <option value="0" disabled={props.btn_disabled}>Add New Record+</option>
                                            {subDepartmentOption.length !== 0 ? (
                                                <>
                                                    {subDepartmentOption?.map(subDept => (
                                                        <option value={subDept.field_id} subDepartmentName={subDept.department_short_name}>{subDept.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_sub_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Skill Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_skill_type" className="form-select form-select-sm" value={cmb_skill_type} onChange={() => FnCombosOnChange('SkillType')}  >
                                            <option value="">Select</option>
                                            {skillTypeOption?.map(skillTypeOption => (
                                                <option value={skillTypeOption.field_name} skillTypeShortName={skillTypeOption.property_value}>{skillTypeOption.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_skill_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Hours months <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="number" className="erp_input_field" id="txt_hours_month" value={txt_hours_month} onChange={e => { FnCombosOnChange('hoursMonth'); validateFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_hours_month" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Job Type Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_job_type_name" value={txt_job_type_name} onChange={e => { setJobTypeName(e.target.value); validateFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_job_type_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Short Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_short_name" className="erp_input_field" value={txt_job_type_short_name} onChange={(e) => { setJobTypeShortName(e.target.value.toUpperCase()); validateFields() }} maxLength="4" />
                                        <MDTypography variant="button" id="error_txt_job_type_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>



                            </div>

                            {/* second column */}
                            <div className="col-sm-6 erp_form_col_div">

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Rate</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_rate" className="erp_input_field text-end" value={txt_job_type_rate} onChange={e => { validateNo('pFromRange'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_rate" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Rate Group</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_rate_group" className="erp_input_field text-end" value={txt_job_type_rate_group} onChange={e => { validateNo('pToRange'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_rate_group" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Attendance Allowance</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_attendance_allowance" className="erp_input_field text-end" value={txt_job_type_attendance_allowance} onChange={e => { validateNo('attendanceAllowance'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_attendance_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Attendance (24 Days)</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_attendance_allow_24_days" className="erp_input_field text-end" value={txt_job_type_attendance_allow_24_days} onChange={e => { validateNo('attendanceAllowance24days'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_attendance_allow_24_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Attendance (26 Days)</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_attendance_allow_26_days" className="erp_input_field text-end" value={txt_job_type_attendance_allow_26_days} onChange={e => { validateNo('attendanceAllowance26days'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_attendance_allow_26_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">On Time Allowance</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_on_time_allowance" className="erp_input_field text-end" value={txt_on_time_allowance} onChange={e => { validateNo('attendanceOnTimeAllowance'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_on_time_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Night Allowance</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_night_allowance" className="erp_input_field text-end" value={txt_job_type_night_allowance} onChange={e => { validateNo('nightAllowances'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_night_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Job Type Special Allowance</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_job_type_special_allowance" className="erp_input_field text-end" value={txt_job_type_special_allowance} onChange={e => { validateNo('specialAllowance'); }} maxLength="19" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_job_type_special_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive} onClick={() => { setIsActive(true); }} /> </div>
                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={!chk_isactive} onClick={() => { setIsActive(false); }} /> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MJobType/FrmJobTypeListing/reg' : '/Masters/MJobType/FrmJobTypeListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={addJobType} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>
                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                {showAddRecModal ? <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Body className='erp_city_modal_body'>
                        <div className='row'>
                            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                        </div>
                        {displayRecordComponent()}
                    </Modal.Body>
                </Modal > : null}
            </div>
        </>
    )
}

export default FrmJobTypeEntry;
