import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Accordion from "react-bootstrap/Accordion";
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';
// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { CircularProgress } from "@material-ui/core";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import Select from 'react-select';
import { Table } from "react-bootstrap";

function FrmTaskMasterEntry() {
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, FINANCIAL_SHORT_NAME, UserName, UserId } = configConstants;
    const { state } = useLocation();
    const { taskTransactionId = 0, keyForViewUpdate = 'Add' } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const combobox = useRef();
    const validate = useRef();
    const navigate = useNavigate()

    //department Feilds
    const [isLoading, setIsLoading] = useState(false);

    //Current date
    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [task_name, setTaskname] = useState("");
    const [employee_id, setEmployeeid] = useState();
    const [employee_type, setEmployeeType] = useState();
    const [employeeDesignation, setEmployeeDesignation] = useState("");
    const [task_Transaction_Id, setTaskTransactionId] = useState(taskTransactionId);
    const [module_id, setModuleId] = useState();
    const [sub_module_id, setSubModuleId] = useState();
    const [task_purpose, setTaskPurpose] = useState("");
    const [assigned_task_start_time, setAssignedTaskStartTime] = useState();
    const [assigned_task_end_time, setAssignedTaskEndtime] = useState("");
    const [assigned_task_start_date, setAssignedTaskStartDate] = useState(today);
    const [assigned_task_end_date, setAssignedTaskEndDate] = useState(today);
    const [task_status, setTaskStatus] = useState('P');
    const [task_description, setTaskDescriptions] = useState('Pending');
    const [task_remark, setTaskRemark] = useState("");
    const [task_assigned_by, setTaskAssignedBy] = useState(parseInt(UserId));
    const [accomplished_task_end_time, setAccomplishedTaskEndtime] = useState();
    const [accomplished_task_end_date, setAccomplishedTaskEndDate] = useState(today);

    const [actionType, setActionType] = useState(`${'(' + keyForViewUpdate + ')'}`);
    let label = keyForViewUpdate === 'update' ? 'Update' : 'Save'
    const [actionLabel, setActionLabel] = useState(label);

    //option Box
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [moduleFormOptions, setModuleFormOptions] = useState([]);
    const [subModuleFormOptions, setSubModuleFormOptions] = useState([]);

    const [prevTasksAssignedByData, setPrevTasksAssignedBydata] = useState([]);
    const [prevTasksAssignedToData, setPrevTasksAssignedTodata] = useState([]);

    const currentDate = new Date().toISOString().split('T')[0];

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Master/MTaskMaster/MTaskMasterListing`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');


    useEffect(() => {
        const loadDataOnload = async () => {
            await FillComobos();
        }
        loadDataOnload()
    }, []);

    let employeeRef = useRef();
    let modulesRef = useRef();
    let subModuleRef = useRef();
    let tasksAssignedByref = useRef();

    const FillComobos = async () => {
        debugger
        if (combobox.current) {
            try {
                //Employee Options
                resetGlobalQuery();
                globalQuery.columns = ['employee_type', 'employee_id', 'employee_name'];
                globalQuery.table = "cm_employee";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const employeeApiCall = await combobox.current.fillFiltersCombo(globalQuery);
                const employeeOpts = [
                    { value: '', label: 'Select' },
                    ...employeeApiCall.map((emp) => ({ ...emp, value: emp.employee_id, label: `${emp.employee_name}` })),
                ];
                setEmployeeOptions(employeeOpts);

                // Modules list
                resetGlobalQuery();
                globalQuery.columns = ['sub_modules_id', 'modules_menu_name'];
                globalQuery.table = "am_modules_menu";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const modulesApiCall = await combobox.current.fillFiltersCombo(globalQuery);
                const moduleOptions = [
                    { value: '', label: 'Select' },
                    ...modulesApiCall.map((module) => ({ ...module, value: module.sub_modules_id, label: `${module.modules_menu_name}` })),
                ];
                setModuleFormOptions(moduleOptions);

                //Tasks Assigned By
                tasksAssignedByref.current = employeeOpts.find(emp => emp.employee_id === parseInt(UserId));

                resetGlobalQuery();
                globalQuery.columns = ['*'];
                globalQuery.table = "mtv_task_assign_master";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "task_assigned_by", operator: "=", value: UserId });
                const tasksAssignedByEmployee = await combobox.current.fillFiltersCombo(globalQuery);
                setPrevTasksAssignedBydata(tasksAssignedByEmployee);

                if (taskTransactionId !== 0) {
                    await FnCheckUpdateResponce(employeeOpts, moduleOptions)
                }

            } catch (error) {
                console.log("error : ", error)
            }
        }
    }



    const addDepartment = async () => {
        try {
            debugger
            const validation = validateForm();
            let validatePrevtask = task_status === 'X' ? true : hasTimeOverlap(prevTasksAssignedToData);
            if (validation && validatePrevtask) {
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    financial_year: FINANCIAL_SHORT_NAME,
                    task_transaction_id: task_Transaction_Id,
                    employee_type: employeeRef.current.employee_type,
                    employee_id: employeeRef.current.value,
                    employee_designation: employeeDesignation,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    task_name: task_name,
                    task_purpose: task_purpose,
                    assigned_task_start_time: assigned_task_start_time,
                    assigned_task_end_time: assigned_task_end_time,
                    assigned_task_start_date: assigned_task_start_date,
                    assigned_task_end_date: assigned_task_end_date,
                    accomplished_task_end_time: ['C', 'X'].includes(task_status) ? accomplished_task_end_time : '',
                    accomplished_task_end_date: ['C', 'X'].includes(task_status) ? accomplished_task_end_date : '',
                    task_status: task_status,
                    task_remark: task_remark,
                    task_assigned_by: task_assigned_by,
                    created_by: UserName,
                    modified_by: UserName
                };


                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/MTaskAssign/FnAddUpdateRecord/${keyForViewUpdate}`, requestOptions)
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




    const FnCheckUpdateResponce = async (employeeOpts, moduleOptions) => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/MTaskAssign/FnShowParticularRecordForUpdate/${task_Transaction_Id}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();

            setEmployeeid(updateRes.employee_id);
            setEmployeeType(updateRes.employee_type);
            setEmployeeDesignation(updateRes.employee_designation);
            employeeRef.current = employeeOpts.find(emp => emp['employee_id'] === updateRes['employee_id']);
            await comboOnChange('employee')


            setModuleId(updateRes['module_id']);
            modulesRef.current = moduleOptions.find(mod => mod['sub_modules_id'] === updateRes['module_id']);
            let subModuleOptions = await comboOnChange('module');
            subModuleRef.current = subModuleOptions.find(subMod => subMod['modules_sub_menu_id'] === updateRes['sub_module_id']);
            setSubModuleId(updateRes['sub_module_id']);

            setTaskname(updateRes['task_name']);
            setAssignedTaskStartDate(updateRes['assigned_task_start_date'])
            setAssignedTaskStartTime(updateRes['assigned_task_start_time']);
            setAssignedTaskEndDate(updateRes['assigned_task_end_date']);
            setAssignedTaskEndtime(updateRes['assigned_task_end_time']);

            if (updateRes['task_status'] === 'C' || updateRes['task_status'] === 'X') {
                setAccomplishedTaskEndDate(updateRes['accomplished_task_end_date']);
                setAccomplishedTaskEndtime(updateRes['accomplished_task_end_time']);
            }

            let taskSta = updateRes['task_status'];
            setTaskPurpose(updateRes['task_purpose']);
            setTaskStatus(taskSta);
            setTaskRemark(updateRes['task_remark']);

            function getTaskStatusDesc(task) {
                if (task === 'A') return 'In-Progress';
                else if (task === 'C') return 'Completed';
                else if (task === 'X') return 'Canceled';
                else return 'Pending';
            }

            setTaskDescriptions(getTaskStatusDesc(taskSta))

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    }

    const comboOnChange = async (key) => {
        debugger
        try {
            setIsLoading(true);
            switch (key) {
                case 'employee':
                    let employeeId = employeeRef.current.value;
                    if (employeeId != '') {
                        if (keyForViewUpdate === "Add") {
                            resetGlobalQuery();
                            globalQuery.columns = ['department_id', 'sub_department_id', 'designation_name'];
                            globalQuery.table = "cm_employees_workprofile";
                            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                            globalQuery.conditions.push({ field: "employee_id", operator: "=", value: employeeId });
                            const employeeProfile = await combobox.current.fillFiltersCombo(globalQuery);
                            // setDepartmentId(employeeProfile[0]['department_id']);
                            // setSubDepartmentId(employeeProfile[0]['sub_department_id']);
                            setEmployeeDesignation(employeeProfile[0]['designation_name']);


                        }

                        resetGlobalQuery();
                        globalQuery.columns = ['*'];
                        globalQuery.table = "mtv_task_assign_master";
                        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                        globalQuery.conditions.push({ field: "employee_id", operator: "=", value: employeeId });
                        const tasksAssignedToEmployee = await combobox.current.fillFiltersCombo(globalQuery);
                        setPrevTasksAssignedTodata(tasksAssignedToEmployee)

                    }
                    break;

                case 'module':
                    let moduleId = modulesRef.current.sub_modules_id;

                    // Modules list
                    resetGlobalQuery();
                    globalQuery.columns = ['modules_sub_menu_id', 'sub_modules_id', 'modules_sub_menu_name'];
                    globalQuery.table = "am_modules_sub_menu";
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "sub_modules_id", operator: "=", value: moduleId });
                    const submodulesApiCall = await combobox.current.fillFiltersCombo(globalQuery);
                    const submoduleOptions = [
                        { value: '', label: 'Select' },
                        ...submodulesApiCall.map((module) => ({ ...module, value: module.modules_sub_menu_id, label: `${module.modules_sub_menu_name}` })),
                    ];
                    setSubModuleFormOptions(submoduleOptions);
                    return submoduleOptions;
                    break;


                default:
                    break;
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    };

    const formatDateTime = (date, time) => {
        if (!date || !time) return "-:-";

        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year} - (${time})`;
    };


    const renderPrevTasksAssignedToTbl = useMemo(() => {
        return (
            <Table id="sizingProductionTbl" className={`erp_table ${prevTasksAssignedToData?.length !== 0 ? "display" : "d-none"}`} responsive bordered striped>
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Sr. No.</th>
                        <th className="erp_table_th">Task Assigned By</th>
                        <th className="erp_table_th">Task Name</th>
                        <th className="erp_table_th">Task Start Period</th>
                        <th className="erp_table_th">Task End Period</th>
                        <th className="erp_table_th">Task Status</th>
                        <th className="erp_table_th">Task Finished Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        prevTasksAssignedToData.length > 0 && prevTasksAssignedToData.map((task, index) => (
                            <tr>
                                <td className="erp_table_td">{index + 1}</td>
                                <td className="erp_table_td">{task.assigned_by_name}</td>
                                <td className="erp_table_td">{task.task_name}</td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.assigned_task_start_date, task.assigned_task_start_time)}
                                </td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.assigned_task_end_date, task.assigned_task_end_time)}
                                </td>
                                <td className="erp_table_td">
                                    {task.task_status_desc}
                                </td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.accomplished_task_end_date, task.accomplished_task_end_time)}
                                </td>

                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        )
    }, [prevTasksAssignedToData]);

    const renderPrevTasksAssignedByTbl = useMemo(() => {

        return (
            <Table id="sizingProductionTbl" className={`erp_table ${prevTasksAssignedByData?.length !== 0 ? "display" : "d-none"}`} responsive bordered striped>
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Sr. No.</th>
                        <th className="erp_table_th">Task Assigned To</th>
                        <th className="erp_table_th">Task Name</th>
                        <th className="erp_table_th">Task Start Period</th>
                        <th className="erp_table_th">Task End Period</th>
                        <th className="erp_table_th">Task Status</th>
                        <th className="erp_table_th">Task Finished Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        prevTasksAssignedByData.length > 0 && prevTasksAssignedByData.map((task, index) => (
                            <tr>
                                <td className="erp_table_td">{index + 1}</td>
                                <td className="erp_table_td">{task.employee_name}</td>
                                <td className="erp_table_td">{task.task_name}</td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.assigned_task_start_date, task.assigned_task_start_time)}
                                </td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.assigned_task_end_date, task.assigned_task_end_time)}
                                </td>
                                <td className="erp_table_td">
                                    {task.task_status_desc}
                                </td>
                                <td className="erp_table_td">
                                    {formatDateTime(task.accomplished_task_end_date, task.accomplished_task_end_time)}
                                </td>

                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        )
    }, [prevTasksAssignedByData]);


    const validateForm = () => {
        try {
            if (!employee_id || employee_id === 0) {
                setErrMsg('Please Select Employee');
                setShowErrorMsgModal(true);
                return false;
            }

            if (task_name.trim() === '') {
                $("#error_task_name").show().text('Enter Task Name');
                $("#task_name").focus();
                return false;
            }

            if (!module_id || module_id === 0) {
                $("#error_module_id").show().text('Please Select Module !');
                return false;
            }

            if (!sub_module_id || sub_module_id === 0) {
                $("#error_sub_module_id").show().text('Please Select Sub-Module !');
                return false;
            }

            if (!validateTime(assigned_task_start_time)) {
                setErrMsg('Enter Task Start time...');
                setShowErrorMsgModal(true);
                return false;
            }

            if (!validateTime(assigned_task_end_time)) {
                setErrMsg('Enter Task End time...');
                setShowErrorMsgModal(true);
                return false;
            }


            const startDateTime = new Date(`${assigned_task_start_date}T${assigned_task_start_time}`);
            const endDateTime = new Date(`${assigned_task_end_date}T${assigned_task_end_time}`);

            if (endDateTime <= startDateTime) {
                setErrMsg("End date and time must be greater than start date and time.");
                setShowErrorMsgModal(true);
                return false;
            }


            if (task_purpose.trim() === '') {
                setErrMsg("Please give proper Brief about the task...");
                setShowErrorMsgModal(true);
                return false;
            }

            if (['C', 'X'].includes(task_status) && !validateTime(accomplished_task_end_time)) {
                setErrMsg("Enter Task Completed time...");
                setShowErrorMsgModal(true);
                return false;
            }


            return true; // ✅ Everything passed
        } catch (error) {
            console.error("Validation error:", error);
            setErrMsg("Unexpected error occurred during validation.");
            setShowErrorMsgModal(true);
            return false;
        }
    };


    const validateTime = (timeStr) => {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr); // Validates "HH:mm"
    };


    function hasTimeOverlap(prevTasks) {
        debugger
        const newStart = new Date(`${assigned_task_start_date}T${assigned_task_start_time}`);
        const newEnd = new Date(`${assigned_task_end_date}T${assigned_task_end_time}`);

        // Ensure new task's end is after start
        if (newEnd <= newStart) {
            return { isValid: false, message: "End date/time must be after start date/time." };
        }

        // Filter previous tasks with status 'P' or 'A'
        const overlappingTask = prevTasks.find(task => {
            if (!['P', 'A'].includes(task.task_status) || task['task_transaction_id'] === task_Transaction_Id) return false;

            const prevStart = new Date(`${task.assigned_task_start_date}T${task.assigned_task_start_time}`);
            const prevEnd = new Date(`${task.assigned_task_end_date}T${task.assigned_task_end_time}`);

            // Check if time periods overlap
            return newStart < prevEnd && newEnd > prevStart;
        });

        if (overlappingTask) {
            setErrMsg(`{Current Task Over-lapped with ${overlappingTask['task_name']} assigned by ${overlappingTask['assigned_by_name']}}`);
            setShowErrorMsgModal(true);
            return false;
        }

        return true;
    }


    return (
        <>
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <ComboBox ref={combobox} />
            <FrmValidations ref={validate} />
            <DashboardLayout>
                <div className='card p-1'>
                    {isLoading ?
                        <div className="spinner-overlay"  >
                            <div className="spinner-container">
                                <CircularProgress color="primary" />
                                <span id="spinner_text" className="text-dark">Loading...</span>
                            </div>
                        </div> :
                        null}

                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Task Assign{actionType} </label>
                    </div>
                    <form id="departmentform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-4 erp_form_col_div">

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Employee Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={employeeRef}
                                            isDisabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'update'}
                                            value={employeeOptions.find(option => option.value === employee_id) || null}
                                            options={employeeOptions}
                                            onChange={(selectedOption) => {
                                                setEmployeeid(selectedOption.value)
                                                employeeRef.current = selectedOption;
                                                comboOnChange('employee');
                                                setShowErrorMsgModal(false)
                                            }
                                            }
                                            placeholder="Search for Employee..."
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

                                        <MDTypography variant="button" id="error_employee_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Task Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="task_name" className="erp_input_field" disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)} value={task_name} onChange={e => { setTaskname(e.target.value); $("#error_task_name").hide(); }} maxLength="155" />
                                        <MDTypography variant="button" id="error_task_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Task Start Date & Time<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col-sm-8 col-12'>
                                        <div className="row">
                                            <div className='col-12 col-md-6 pe-md-0'>
                                                <Form.Control type="date" id='assigned_task_start_date' disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)} className="erp_input_field" value={assigned_task_start_date}
                                                    onChange={e => { setAssignedTaskStartDate(e.target.value); }} min={currentDate} />
                                            </div>
                                            <div className="col-12 col-md-6 pt-md-0">
                                                <Form.Control
                                                    type="time"
                                                    id='assigned_task_start_time'
                                                    className="erp_input_field"
                                                    value={assigned_task_start_time}
                                                    disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        // Only update state when it's a full valid time string like HH:mm
                                                        if (val.length <= 5) {
                                                            setAssignedTaskStartTime(val);
                                                        }
                                                        $("#error_assigned_task_start_time").hide();
                                                    }}
                                                />

                                                <MDTypography variant="button" id="error_assigned_task_start_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Task Status<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select id="taskstatus" className="form-select form-select-sm" disabled={keyForViewUpdate === 'view' || ['Completed', 'Canceled'].includes(task_description)} value={task_status} onChange={(e) => setTaskStatus(e.target.value)}>
                                            <option value="P">Pending</option>
                                            <option value="A">In-Progress</option>
                                            <option value="C">Completed</option>
                                            <option value="X">Cancelled</option>
                                        </select>
                                    </div>
                                </div>


                            </div>

                            {/* second column */}
                            <div className="col-sm-4 erp_form_col_div">

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Employee Designation </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="departmentName" disabled maxLength="255" value={employeeDesignation} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Module Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={modulesRef}
                                            isDisabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)}
                                            value={moduleFormOptions.find(option => option.value === module_id) || null}
                                            options={moduleFormOptions}
                                            onChange={(selectedOption) => {
                                                setModuleId(selectedOption.value)
                                                modulesRef.current = selectedOption;
                                                comboOnChange('module'); $("#error_module_id").hide()
                                            }}
                                            placeholder="Search for Modules..."
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
                                        <MDTypography variant="button" id="error_module_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Task End Date & Time<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col-sm-8 col-12'>
                                        <div className="row">
                                            <div className='col-12 col-md-6 pe-md-0'>
                                                <Form.Control type="date" id='assigned_task_end_date' disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)} className="erp_input_field" value={assigned_task_end_date}
                                                    onChange={e => { setAssignedTaskEndDate(e.target.value); }} min={currentDate} />
                                            </div>
                                            <div className="col-12 col-md-6 pt-md-0">
                                                <Form.Control
                                                    type="time"
                                                    id='assigned_task_end_time'
                                                    className="erp_input_field"
                                                    value={assigned_task_end_time} disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        // Only update state when it's a full valid time string like HH:mm
                                                        if (val.length <= 5) {
                                                            setAssignedTaskEndtime(val);
                                                        }
                                                        $("#error_assigned_task_end_time").hide();
                                                    }}
                                                />

                                                <MDTypography variant="button" id="error_assigned_task_end_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`row ${task_status === 'C' || task_status === 'X' ? 'display' : 'd-none'}`}>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Task Completed Date & Time<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col-sm-8 col-12'>
                                        <div className="row">
                                            <div className='col-12 col-md-6 pe-md-0'>
                                                <Form.Control type="date" id='assigned_task_end_date' className="erp_input_field" disabled={keyForViewUpdate === 'view' || ['Completed', 'Canceled'].includes(task_description)} value={accomplished_task_end_date}
                                                    onChange={e => { setAccomplishedTaskEndDate(e.target.value); }} min={currentDate} />
                                            </div>
                                            <div className="col-12 col-md-6 pt-md-0">
                                                <Form.Control
                                                    type="time"
                                                    id='accomplished_task_end_time'
                                                    className="erp_input_field"
                                                    value={accomplished_task_end_time} disabled={keyForViewUpdate === 'view' || ['Completed', 'Canceled'].includes(task_description)}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        // Only update state when it's a full valid time string like HH:mm
                                                        if (val.length <= 5) {
                                                            setAccomplishedTaskEndtime(val);
                                                        }
                                                        $("#error_accomplished_task_end_time").hide();
                                                    }}
                                                />
                                            </div>
                                            <MDTypography variant="button" id="error_accomplished_task_end_time" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            {/* 3rd Col */}
                            <div className="col-sm-4 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Task Assigned By <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={employeeRef}
                                            isDisabled
                                            value={employeeOptions.find(option => option.value === task_assigned_by) || null}
                                            options={employeeOptions.filter(emp => emp.employee_type !== 'Worker')}
                                            onChange={(selectedOption) => {
                                                setTaskAssignedBy(selectedOption.value)
                                                tasksAssignedByref.current = selectedOption;
                                                comboOnChange('tasksAssignedBy');
                                            }}
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
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Sub Module Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={subModuleRef}
                                            isDisabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)}
                                            value={subModuleFormOptions.find(option => option.value === sub_module_id) || null}
                                            options={subModuleFormOptions}
                                            onChange={(selectedOption) => {
                                                setSubModuleId(selectedOption.value)
                                                subModuleRef.current = selectedOption; $("#error_sub_module_id").hide()
                                            }}
                                            placeholder="Search for Sub-Modules..."
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
                                        <MDTypography variant="button" id="error_sub_module_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Task Brief<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control as="textarea" rows={1} className={`erp_txt_area`} disabled={keyForViewUpdate === 'view' || ['X', 'C'].includes(task_status)} id="task_remark" value={task_purpose} onChange={e => { setTaskPurpose(e.target.value); setShowErrorMsgModal(false) }} maxlength="555" />
                                        <MDTypography variant="button" id="error_task_purpose" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className={`row ${task_status === 'C' || task_status === 'X' ? 'display' : 'd-none'}`}>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Remark</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control as="textarea" rows={1} className={`erp_txt_area`} id="task_remark" value={task_remark} disabled={['Completed', 'Canceled'].includes(task_description) || keyForViewUpdate === 'view'} onChange={e => { setTaskRemark(e.target.value); }} maxlength="555" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>


                    <>
                        {prevTasksAssignedToData.length > 0 && (
                            <>
                                <hr />
                                <Accordion defaultActiveKey="1">
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="erp-form-label-md">
                                            {`Previous Tasks Assigned to ` + (employeeRef?.current?.label || '')}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {renderPrevTasksAssignedToTbl}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </>
                        )}
                    </>


                    <>
                        {prevTasksAssignedByData.length > 0 && (
                            <>
                                <hr />
                                <Accordion defaultActiveKey="1">
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="erp-form-label-md">
                                            {`Previous Tasks Assigned By ` + (tasksAssignedByref?.current?.label || '')}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {renderPrevTasksAssignedByTbl}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </>
                        )}
                    </>

                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button" onClick={() => { const path = '/Master/MTaskMaster/MTaskMasterListing'; navigate(path); }} variant="button" fontWeight="regular">Back</MDButton>
                        <MDButton type="submit" onClick={addDepartment} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular">{actionLabel}</MDButton>
                    </div >
                </div>


                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </DashboardLayout>
        </>
    )
}

export default FrmTaskMasterEntry