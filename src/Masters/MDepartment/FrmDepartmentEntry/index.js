import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Modal from 'react-bootstrap/Modal';
import Tooltip from "@mui/material/Tooltip";
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';
// Imports React bootstra
import Form from 'react-bootstrap/Form';

// Icons
import { MdRefresh } from "react-icons/md";

// File Imports
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
// import MCostCenterEntry from "Masters/MFMCostCenter/MCostCenterEntry/Index";
import ProfitCenterEntry from "Masters/ProfitCenter/ProfitCenterEntry";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import Select from 'react-select';


function DepartmentEntry(props) {
    //changes by ujjwala on 27/12/2024
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { departmentId = 0, keyForViewUpdate, compType = 'Masters' } = state || {}
    const { departmentType = "M", parent_department = '', parentDepIs_disable = false, deptTypeIs_disable = false } = props;
    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const combobox = useRef();
    const validate = useRef();
    const navigate = useNavigate()

    //department Feilds
    const [department_id, setDepartment_id] = useState(departmentId === null ? 0 : departmentId);
    const [parentDepartment, setParentDepartment] = useState(parent_department);
    const [rb_departmentType, setDepartmentType] = useState(departmentType);
    const [departmentName, setDepartmentName] = useState('');
    const [shortName, setShortName] = useState('');
    const [departmentGroup, setDepartmentGroup] = useState('');
    const [costCenter, setCostCenter] = useState();
    const [txt_cost_center_group, setCostCenterGroup] = useState('');
    const [DepartmentHeadID, setDepartmentHeadID] = useState();
    const [DepartSubHeadID, setDepartSubHeadID] = useState();
    const [departStaffStrength, setDepartStaffStrength] = useState(1);
    const [txt_department_std_worker_strength, setDepartmentWorkerStrength] = useState(1);
    const [departReqStaffStrength, setDepartReqStaffStrength] = useState(1);
    const [departReqWorkerStrength, setDepartReqWorkerStrength] = useState(1);




    // Added on 24/07/2024 for Department & Designation wise Salary Calculaitons.
    const [txt_worker_perday_salary, setWorkerPerdaySalary] = useState(0);
    const [txt_trainee_worker_perday_salary, setTraineeWorkerPerdaySalary] = useState(0);
    const [txt_semiskillled_worker_perday_salary, setSemiskillledWorkerPerdaySalary] = useState(0);
    const [txt_worker_perday_attendance_allowance, setWorkerPerdayAttendanceAllowance] = useState(0);
    const [txt_worker_perday_night_allowance, setWorkerPerdayNightAllowance] = useState(0);

    const [generalWorkerStrength, setGeneralWorkerStrength] = useState(0);
    const [semi_skilled_Worker, setSemiSkilledWorkerStrength] = useState(0);
    const [sr_semi_skilledWorkerStrength, setSr_Semi_SkilledWorkerStrength] = useState(0);
    const [helper_WorkerStrength, setHelperWorkerStrength] = useState(0);
    const [traineeWorkerstrength, setTraineeWorkerStrength] = useState(0);
    const [skilledWorkerStrength, setSkilledWorkerStrength] = useState(0);
    const [cmb_godown_id, setGodownID] = useState("");
    const [cmb_godown_section_id, setGodownSectionID] = useState("");
    const [cmb_godown_section_bean_id, setGodownSectionBeanID] = useState("");

    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    //option Box
    const [parentDepartOption, setParentDepartOption] = useState([]);
    const [departmentGrpOption, setDepartmentGrOption] = useState([]);
    const [branchHeadOptions, setBranchHeadOptions] = useState([]);
    const [DeptSubHeadOptions, setDeptSubHeadOptions] = useState([]);
    const [godownOptions, setGodownOptions] = useState([]);
    const [godownSectionOptions, setGodownSectionOptions] = useState([]);
    const [godownSectionBeanOptions, setGodownSectionBeanOptions] = useState([]);
    const [costCenterGroupOpts, setCostCenterGroupOpts] = useState([]);

    // to add new records in combo box 
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/DepartmentListing`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    let godownComboRef = useRef(null);
    let godownSectionComboRef = useRef(null);
    let godownSectionBeanComboRef = useRef(null);

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            await FillComobos();
            if (departmentId !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])

    const addDepartment = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("departmentform");
            if (checkIsValidate === true) {
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    department_id: department_id,
                    created_by: UserName,
                    modified_by: department_id === null ? null : UserName,
                    parent_department_id: parentDepartment,
                    department_type: rb_departmentType,
                    department_name: departmentName,
                    department_short_name: shortName,
                    department_group: departmentGroup,
                    cost_center_group: txt_cost_center_group,
                    department_head_id: DepartmentHeadID,
                    department_subhead_id: DepartSubHeadID,
                    department_std_staff_strength: departStaffStrength,
                    department_std_worker_strength: txt_department_std_worker_strength,
                    worker_perday_salary: txt_worker_perday_salary,
                    trainee_worker_perday_salary: txt_trainee_worker_perday_salary,
                    semiskillled_worker_perday_salary: txt_semiskillled_worker_perday_salary,
                    worker_perday_attendance_allowance: txt_worker_perday_attendance_allowance,
                    worker_perday_night_allowance: txt_worker_perday_night_allowance,
                    department_req_std_staff_strength: departReqStaffStrength,
                    department_req_std_worker_strength: departReqWorkerStrength,
                    general_worker: generalWorkerStrength,
                    trainee_worker: traineeWorkerstrength,
                    semi_skilled_worker: semi_skilled_Worker,
                    skilled_worker: skilledWorkerStrength,
                    sr_semi_skilled_worker: sr_semi_skilledWorkerStrength,
                    helper_worker: helper_WorkerStrength,
                    is_active: chk_isactive,
                    godown_id: cmb_godown_id,
                    godown_section_id: cmb_godown_section_id,
                    godown_section_beans_id: cmb_godown_section_bean_id,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/department/FnAddUpdateRecord`, requestOptions)
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
                setActionType('(Modify)');
                setActionLabel('Update')
                // $('#rb_departmentType').attr('disabled', true)
                // $('#departmentGroup').attr('disabled', true)
                // $('#departmentName').attr('disabled', true)
                // $('#shortName').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("departmentform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('departmentform')
    }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/department/FnShowParticularRecordForUpdate/${department_id}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();
            const data = JSON.parse(updateRes.data)
            setDepartment_id(data.department_id)
            setParentDepartment(data.parent_department_id)
            setDepartmentType(data.department_type);
            setDepartmentName(data.department_name);
            setShortName(data.department_short_name);
            setDepartmentGroup(data.department_group);
            setDepartmentHeadID(data.department_head_id);
            setDepartSubHeadID(data.department_subhead_id);
            setDepartStaffStrength(data.department_std_staff_strength);
            setDepartmentWorkerStrength(data.department_std_worker_strength);
            setDepartReqStaffStrength(data.department_req_std_staff_strength);
            setDepartReqWorkerStrength(data.department_req_std_worker_strength);
            setCostCenterGroup(data.cost_center_group)
            setGodownID(parseInt(data.godown_id))
            godownComboRef.current.value = data.godown_id;
            await comboOnChange('godownId');        
            setGodownSectionID(parseInt(data.godown_section_id));
            godownSectionComboRef.current.value = data.godown_section_id;
            await comboOnChange('godownSectionId');
            setGodownSectionBeanID(data.godown_section_beans_id)

            // Added on 24/07/2024 for Department & Designation wise Salary Calculaitons.
            setWorkerPerdaySalary(data.worker_perday_salary);
            setTraineeWorkerPerdaySalary(data.trainee_worker_perday_salary);
            setSemiskillledWorkerPerdaySalary(data.semiskillled_worker_perday_salary);
            setWorkerPerdayAttendanceAllowance(data.worker_perday_attendance_allowance);
            setWorkerPerdayNightAllowance(data.worker_perday_night_allowance);

            setSkilledWorkerStrength(data.skilled_worker);
            setTraineeWorkerStrength(data.trainee_worker);
            setHelperWorkerStrength(data.helper_worker);
            setSr_Semi_SkilledWorkerStrength(data.sr_semi_skilled_worker);
            setSemiSkilledWorkerStrength(data.semi_skilled_worker);
            setGeneralWorkerStrength(data.general_worker);

            setIsActive(data.is_active);
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    }

    const FillComobos = async () => {
        debugger
        if (combobox.current) {
            // combobox.current.fillMasterData("cmv_department", "department_type", "M").then((departmentList) => {
            //     setParentDepartOption(departmentList)
            // })
            try {
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name'];
                globalQuery.table = "cmv_department";
                globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
                globalQuery.conditions.push({ field: "department_type", operator: "=", value: 'M' });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const departmentIdApiCall = await combobox.current.fillFiltersCombo(globalQuery);
                setParentDepartOption(departmentIdApiCall);

                combobox.current.fillComboBox("DepartmentGroup").then((departmentGroupList) => {
                    setDepartmentGrOption(departmentGroupList)
                })
                combobox.current.fillMasterData("cmv_employee", "", "").then((employeeList) => {
                    setBranchHeadOptions(employeeList)
                    setDeptSubHeadOptions(employeeList)
                })

                // godown list
                resetGlobalQuery();
                globalQuery.columns = ['godown_id', 'godown_name'];
                globalQuery.table = "cm_godown";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const godownList = await combobox.current.fillFiltersCombo(globalQuery);
                const godownOpts = [
                    { value: '', label: 'Select', centerShortName: '' },
                    ...godownList.map((godown) => ({ ...godown, value: godown.godown_id, label: `${godown.godown_name}` })),
                ];
                setGodownOptions(godownOpts);

                resetGlobalQuery();
                globalQuery.columns.push("DISTINCT (cost_center_group)");
                globalQuery.table = "fm_cost_center";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const costCenterGroupList = await combobox.current.fillFiltersCombo(globalQuery);
                const costCenterGroupOpts = [
                    { value: '', label: 'Select', centerShortName: '' },
                    ...costCenterGroupList.map((godown) => ({ ...godown, value: godown.cost_center_group, label: godown.cost_center_group })),
                ];
                setCostCenterGroupOpts(costCenterGroupOpts);

            } catch (error) {
                console.log("error : ", error)
            }
        }
    }

    const addRecordInProperty = async (key) => {
        switch (key) {
            case 'cmv_department':
                const departlist = document.getElementById('parentDepartId').value
                setParentDepartment(departlist)
                $('#error_parentDepartId').hide();
                break;
            case 'DepartmentGroup':
                const departmentGrouplist = document.getElementById('departmentGroup').value
                setDepartmentGroup(departmentGrouplist)
                $('#error_departmentGroup').hide();
                break;
            case 'DepartmentHead':
                const departmentHead = document.getElementById('departmentHeadId').value;
                setDepartmentHeadID(departmentHead)
                $('#error_departmentHeadId').hide();
                if (departmentHead === '0') {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                break;

            case 'DepartmentSubHead':
                const departmentSubHead = document.getElementById('deptSubHeadId').value;
                setDepartSubHeadID(departmentSubHead)
                $('#error_deptSubHeadId').hide();
                if (departmentSubHead === '0') {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                break;
           
            default: break;
        }
    }


    



    const FnRefreshbtn = async (key) => {
        switch (key) {
            case 'DepartmentHead':
                combobox.current.fillMasterData("cmv_employee", "", "").then((empList1) => {
                    setBranchHeadOptions(empList1)
                })
                break;

            case 'DepartmentSubHead':
                combobox.current.fillMasterData("cmv_employee", "", "").then((empList) => {
                    setDeptSubHeadOptions(empList)
                })
                break;

            default:
                break;
        }
    }

    const isZero = (value) => value === 0 || value === '0';

    const comboOnChange = async (key) => {

        switch (key) {
            case 'godownId':
                debugger
                let godown_Id = godownComboRef.current.value;
                if (godown_Id != '') {
                    resetGlobalQuery();
                    globalQuery.columns = ['godown_section_id', 'godown_section_name'];
                    globalQuery.table = "cm_godown_section";
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "godown_id", operator: "=", value: godown_Id });
                    const GodownSectionList = await combobox.current.fillFiltersCombo(globalQuery);
                    const GodownSectionOpts = [
                        { value: '', label: 'Select' },
                        ...GodownSectionList.map((GodownSection) => ({ ...GodownSection, value: GodownSection.godown_section_id, label: `${GodownSection.godown_section_name}` })),
                    ];
                    setGodownSectionOptions(GodownSectionOpts);
                    setGodownSectionID('')
                } else {
                    const sectionOpts = [
                        { value: '', label: 'Select' }
                    ];
                    setGodownSectionOptions(sectionOpts);
                    setGodownSectionID('')
                    setGodownSectionBeanOptions(sectionOpts)
                    setGodownSectionBeanID('')
                }
                break;

            case 'godownSectionId':
                debugger
                let godown_section_Id = godownSectionComboRef.current.value;
                let godownId = godownComboRef.current.value;

                if (godown_section_Id != '') {
                    resetGlobalQuery();
                    globalQuery.columns = ['godown_section_beans_id', 'godown_section_beans_name'];
                    globalQuery.table = "cm_godown_section_beans";
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "godown_id", operator: "=", value: godownId });
                    globalQuery.conditions.push({ field: "godown_section_id", operator: "=", value: godown_section_Id });
                    const GodownSectionBeanList = await combobox.current.fillFiltersCombo(globalQuery);
                    const GodownSectionBeanOpts = [
                        { value: '', label: 'Select' },
                        ...GodownSectionBeanList.map((GodownSection) => ({ ...GodownSection, value: GodownSection.godown_section_beans_id, label: `${GodownSection.godown_section_beans_name}` })),
                    ];
                    setGodownSectionBeanOptions(GodownSectionBeanOpts);

                } else {
                    const sectionOpts = [
                        { value: '', label: 'Select' }
                    ];
                    setGodownSectionBeanID(sectionOpts);
                    setGodownSectionBeanID('')
                }
                break;
            // case 'godownSectionBeansId':
            //     debugger
            //     let godown_section_bean_Id = godownSectionBeanComboRef.current.value;
            //     let godownSectionId = godownSectionComboRef.current.value;
            //     let godown_id = godownComboRef.current.value;

            //     if (godown_section_Id != '') {
            //         resetGlobalQuery();
            //         globalQuery.columns = ['godown_section_beans_id', 'godown_section_beans_name'];
            //         globalQuery.table = "cm_godown_section_beans";
            //         globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            //         globalQuery.conditions.push({ field: "godown_id", operator: "=", value: godown_id });
            //         globalQuery.conditions.push({ field: "godown_section_id", operator: "=", value: godown_section_Id });
            //         const GodownSectionBeanList = await combobox.current.fillFiltersCombo(globalQuery);
            //         const GodownSectionBeanOpts = [
            //             { value: '', label: 'Select' },
            //             ...GodownSectionBeanList.map((GodownSection) => ({ ...GodownSection, value: GodownSection.godown_section_beans_id, label: `${GodownSection.godown_section_beans_name}` })),
            //         ];
            //         setGodownSectionBeanOptions(GodownSectionBeanOpts);

            //     } else {
            //         const sectionOpts = [
            //             { value: '', label: 'Select' }
            //         ];
            //         setGodownSectionBeanID(sectionOpts);
            //         setGodownSectionBeanID('')
            //     }
            //     break;
            default:
                break;
        }
    }


    return (
        <>
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <ComboBox ref={combobox} />
            <FrmValidations ref={validate} />
            <DashboardLayout asModal={props.btn_disabled}>
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Department Information{actionType} </label>
                    </div>
                    <form id="departmentform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-4 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Department Type <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Main" type="radio" lbl="Main" value="M" id="rb_departmentType" name="rb_departmentType" checked={rb_departmentType === "M"} onClick={() => { setDepartmentType("M"); }} disabled={deptTypeIs_disable} /> </div>
                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="Sub" type="radio" lbl="Sub" value="S" id="rb_departmentType" name="rb_departmentType" checked={rb_departmentType === "S"} onClick={() => { setDepartmentType("S"); }} disabled={deptTypeIs_disable} /> </div>
                                        </div>
                                    </div>

                                </div>
                                {rb_departmentType === "S" ?
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Parent Department <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select size="sm" id="parentDepartId" value={parentDepartment} className="form-select form-select-sm erp_input_field" onChange={() => addRecordInProperty('cmv_department')} disabled={keyForViewUpdate === 'view' || parentDepIs_disable}>
                                                <option value="">Select</option>

                                                {parentDepartOption?.map(parentDepart => (
                                                    <option value={parentDepart.field_id}>{parentDepart.field_name}</option>

                                                ))}

                                            </select>

                                            <MDTypography variant="button" id="error_parentDepartId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    : ''
                                }

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Department Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="departmentName" value={departmentName} onChange={e => { setDepartmentName(e.target.value); validateFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_departmentName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Short Name </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="shortName" className="erp_input_field" value={shortName} onChange={(e) => { setShortName(e.target.value.toUpperCase()); validateFields() }} maxLength="20" optional="optional" />
                                        <MDTypography variant="button" id="error_shortName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Department Group <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select size="sm" id="departmentGroup" value={departmentGroup} className="form-select form-select-sm erp_input_field" onChange={() => { addRecordInProperty('DepartmentGroup'); }}>
                                            <option value="">Select</option>
                                            {departmentGrpOption?.map(deptGroup => (
                                                <option value={deptGroup.field_name}>{deptGroup.field_name}</option>

                                            ))}

                                        </select>
                                        <MDTypography variant="button" id="error_departmentGroup" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Cost Center Group<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select size="sm" id="txt_cost_center_group" value={txt_cost_center_group} className="form-select form-select-sm erp_input_field" onChange={(e) => { setCostCenterGroup(e.target.value); $("#error_txt_cost_center_group").hide() }} >
                                            {costCenterGroupOpts?.map(option => (
                                                <option value={option.cost_center_group}>{option.cost_center_group}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_txt_cost_center_group" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                               

                                <div className="row">
                                    <div className="col-sm-4 col-12">
                                        <Form.Label className="erp-form-label"> Head </Form.Label>
                                    </div>
                                    <div className="col-sm-7 col-10">
                                        <select id="departmentHeadId" value={DepartmentHeadID} className="form-select form-select-sm erp_input_field" onChange={() => { addRecordInProperty("DepartmentHead"); }} optional='optional'>
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>

                                            {branchHeadOptions?.map(option => (
                                                <option value={option.field_id}>{option.field_name}</option>

                                            ))}
                                        </select>

                                        <MDTypography variant="button" id="error_departmentHeadId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                    <div className="col-sm-1 col-2">
                                        <Tooltip title="Refresh" placement="top">
                                            <MDTypography>
                                                <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("DepartmentHead"); }} style={{ color: 'black' }} />
                                            </MDTypography>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4 col-12">
                                        <Form.Label className="erp-form-label"> SubHead</Form.Label>
                                    </div>
                                    <div className="col-sm-7 col-10">
                                        <select id="deptSubHeadId" value={DepartSubHeadID} className="form-select form-select-sm erp_input_field" onChange={() => { addRecordInProperty("DepartmentSubHead"); }} optional="optional" >
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>

                                            {DeptSubHeadOptions?.map(option => (
                                                <option value={option.field_id}>{option.field_name}</option>

                                            ))}
                                        </select>

                                        <MDTypography variant="button" id="error_deptSubHeadId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                    <div className="col-sm-1 col-2">
                                        <Tooltip title="Refresh" placement="top">
                                            <MDTypography>
                                                <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("DepartmentSubHead"); }} style={{ color: 'black' }} />
                                            </MDTypography>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> REQ. Wroker Strength </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="departReqWorkerStrength" className="erp_input_field erp_align-right" value={departReqWorkerStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setDepartReqWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_departReqWorkerStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second column */}
                            <div className="col-sm-4 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> REQ. Staff Strength </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="departReqStaffStrength" className="erp_input_field erp_align-right" value={departReqStaffStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setDepartReqStaffStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_departReqStaffStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">STD Staff Strength </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="departmentStrength" className="erp_input_field erp_align-right" value={departStaffStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setDepartStaffStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_departmentStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>



                                {/* Added on 24/07/2024 for Department & Designation wise Salary Calculaitons. */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Worker PerDay </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_worker_perday_salary" className="erp_input_field erp_align-right" value={txt_worker_perday_salary} maxLength="18"
                                            onFocus={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdaySalary(e.target.value === 0 || e.target.value === '0' ? '' : e.target.value) }}}
                                            onInput={e => { setWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}
                                            onBlur={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}} />
                                        <MDTypography variant="button" id="error_txt_worker_perday_salary" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} > </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> SemiSkilled Worker PerDay </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_semiskillled_worker_perday_salary" className="erp_input_field erp_align-right" value={txt_semiskillled_worker_perday_salary} maxLength="18"
                                            onFocus={e => {if(keyForViewUpdate !== 'view') { setSemiskillledWorkerPerdaySalary(e.target.value === 0 || e.target.value === '0' ? '' : e.target.value) }}}
                                            onInput={e => { setSemiskillledWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}
                                            onBlur={e => {if(keyForViewUpdate !== 'view') { setSemiskillledWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}} />
                                        <MDTypography variant="button" id="error_txt_semiskillled_worker_perday_salary" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} > </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Trainee Worker PerDay </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_trainee_worker_perday_salary" className="erp_input_field erp_align-right" value={txt_trainee_worker_perday_salary} maxLength="18"
                                            onFocus={e => {if(keyForViewUpdate !== 'view') {setTraineeWorkerPerdaySalary(e.target.value === 0 || e.target.value === '0' ? '' : e.target.value)} }}
                                            onInput={e => { setTraineeWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}
                                            onBlur={e => {if(keyForViewUpdate !== 'view') { setTraineeWorkerPerdaySalary(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0)} }} />
                                        <MDTypography variant="button" id="error_txt_trainee_worker_perday_salary" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} > </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Worker Attendace Allow. PerDay </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_worker_perday_attendance_allowance" className="erp_input_field erp_align-right" value={txt_worker_perday_attendance_allowance} maxLength="18"
                                            onFocus={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdayAttendanceAllowance(e.target.value === 0 || e.target.value === '0' ? '' : e.target.value)} }}
                                            onInput={e => { setWorkerPerdayAttendanceAllowance(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}
                                            onBlur={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdayAttendanceAllowance(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0)} }} />
                                        <MDTypography variant="button" id="error_txt_worker_perday_attendance_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} > </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Worker Night Allow. PerDay </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_worker_perday_night_allowance" className="erp_input_field erp_align-right" value={txt_worker_perday_night_allowance} maxLength="18"
                                            onFocus={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdayNightAllowance(e.target.value === 0 || e.target.value === '0' ? '' : e.target.value) }}}
                                            onInput={e => { setWorkerPerdayNightAllowance(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}
                                            onBlur={e => {if(keyForViewUpdate !== 'view') { setWorkerPerdayNightAllowance(validateNumberDateInput.current.decimalNumber(e.target.value, 2) || 0) }}} />
                                        <MDTypography variant="button" id="error_txt_worker_perday_night_allowance" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} > </MDTypography>
                                    </div>
                                </div>
                               
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">STD. Wroker Strength </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_department_std_worker_strength" className="erp_input_field erp_align-right" value={txt_department_std_worker_strength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setDepartmentWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_txt_department_std_worker_strength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4 erp_form_col_div">

                                
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> General Wroker </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="generalWorkerStrength" className="erp_input_field erp_align-right" value={generalWorkerStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setGeneralWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_generalWorkerStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Trainee Wroker  </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="traineeWorkerstrength" className="erp_input_field erp_align-right" value={traineeWorkerstrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setTraineeWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_traineeWorkerstrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Semi Skilled Wroker </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="semi_skilled_Worker" className="erp_input_field erp_align-right" value={semi_skilled_Worker} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setSemiSkilledWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_semi_skilled_Worker" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Skilled Wroker </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="skilledWorkerStrength" className="erp_input_field erp_align-right" value={skilledWorkerStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setSkilledWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_skilledWorkerStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Sr Semi-Skilled </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="sr_semi_skilledWorkerStrength" className="erp_input_field erp_align-right" value={sr_semi_skilledWorkerStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setSr_Semi_SkilledWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_sr_semi_skilledWorkerStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Helper  </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="helper_WorkerStrength" className="erp_input_field erp_align-right" value={helper_WorkerStrength} onChange={e => { if (validateNumberDateInput.current.isInteger(e.target.value)) { setHelperWorkerStrength(e.target.value) } }} maxLength="11" />
                                        <MDTypography variant="button" id="error_helper_WorkerStrength" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Godown </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={godownComboRef}
                                            inputId="cmb_godown_id" isDisabled={keyForViewUpdate === 'view'}
                                            value={godownOptions.find(option => option.value === cmb_godown_id) || null}
                                            options={godownOptions}
                                            onChange={(selectedOption) => {
                                                setGodownID(selectedOption.value)
                                                godownComboRef.current = selectedOption;
                                                comboOnChange('godownId');
                                            }
                                            }
                                            placeholder="Search for Godown..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"

                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                })
                                            }}
                                        />

                                        <MDTypography variant="button" id="error_cmb_godown_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Godown Section </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={godownSectionComboRef}
                                            isDisabled={keyForViewUpdate === 'view'}
                                            inputId="cmb_godown_section_id"
                                            value={godownSectionOptions.find(option => option.value === cmb_godown_section_id) || null}
                                            options={godownSectionOptions}
                                            onChange={(selectedOption) => {
                                                setGodownSectionID(selectedOption.value)
                                                godownSectionComboRef.current = selectedOption;
                                                comboOnChange('godownSectionId');
                                            }
                                            }
                                            placeholder="Search for Godown Section..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"

                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                })
                                            }}
                                        />

                                        <MDTypography variant="button" id="error_cmb_godown_section_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row '>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Godown Section Beans  </Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Select
                                            ref={godownSectionBeanComboRef}
                                            isDisabled={keyForViewUpdate === 'view'}
                                            inputId="cmb_godown_section_bean_id"
                                            value={godownSectionBeanOptions.find(option => option.value === cmb_godown_section_bean_id) || null}
                                            options={godownSectionBeanOptions}
                                            onChange={(selectedOption) => {
                                                setGodownSectionBeanID(selectedOption.value)
                                                godownSectionBeanComboRef.current = selectedOption;
                                            }}
                                            placeholder="Search for section beans..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"

                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px'
                                                })
                                            }}
                                        />
                                        <MDTypography variant="button" id="error_cmb_godown_section_bean_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* Added on 24/07/2024 for Department & Designation wise Salary Calculaitons. */}


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
                                const path = compType === 'Register' ? '/Masters/DepartmentListing/reg' : '/Masters/DepartmentListing';
                                navigate(path);
                            }}

                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={addDepartment} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                    </div >
                </div>


                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
{/* 
                <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Body className='erp_city_modal_body'>
                        <div className='row'>
                            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                        </div>
                        {displayRecordComponent()}

                    </Modal.Body>
                </Modal > */}
            </DashboardLayout>
        </>
    )
}

export default DepartmentEntry;
