import React, { useState, useRef, useEffect, useMemo } from 'react'
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ComboBox from 'Features/ComboBox';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import GenerateTAutoNo from "FrmGeneric/GenerateTAutoNo";

import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import { FiPrinter } from 'react-icons/fi';
// import ShortLeave from 'FrmGeneric/Invoice/ShortLeave';
import { renderToString } from "react-dom/server";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { CircularProgress } from '@material-ui/core';

function FrmCompOffLeaveEntry() {

    const { state } = useLocation();
    const { keyForViewUpdate, compoffId, compType, modules_forms_id } = state || {}
    //     // Globally Constants.
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserId, UserName, COMPANY_NAME, FINANCIAL_SHORT_NAME, COMPANY_ADDRESS, USER_CODE, DEPARTMENT_ID } = configConstants;


    //Loader
    const [isLoading, setIsLoading] = useState(false);

    const [actionLabel, setActionLabel] = useState('Save');
    const navigator = useNavigate();
    const generateAutoNoAPiCall = useRef();

    //////useRef Hooks
    const comboBoxRef = useRef();
    const validate = useRef();
    const validateNumberDateInput = useRef();
    const navigate = useNavigate();
    let cmb_department_id_ref = useRef(null);
    let subDepartmentComboRef = useRef(null);
    let employeeTypesComboRef = useRef(null);
    let employeeComboRef = useRef(null);
    let departmentComboRef = useRef(null);

    //Current date
    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;

    }


    ////Array Options
    const [employeeList, setEmployeeListOption] = useState([]);

    ///Hooks for Header data

    const [cmb_employee_id, setEmployeeId] = useState('');
    const [txt_employee_code, setEmployeeCode] = useState();
    const [txt_punch_code, setPunchCode] = useState();

    const [employeeTypesOpts, setEmployeeTypesOpts] = useState([]);
    const [cmb_employee_type_id, setEmployeeTypeId] = useState('');
    // const [cmb_department_id, setDepartmentId] = useState('');
    const [txt_approved_by, setApprovedBy] = useState('');
    const [cmb_compoff_status, setApprovedStatus] = useState('Pending');
    const [txt_weekly_off, setWeeklyOff] = useState('');
    const [txt_compoff_reason, setCompOffReason] = useState('');
    const [departmentopt, setDepartmentOption] = useState([]);

    const [actionType, setActionType] = useState('')
    const [employeeOpts, setEmployeeOpts] = useState([]);
    const [departmentOpts, setDepartmentOpts] = useState([]);
    const [subDepartmentOpts, setSubDepartmentOpts] = useState([]);
    // const [cmb_departmentId, setDepartmentId] = useState(0);
    const [cmb_department_id, setDepartmentId] = useState('');
    const [allDepartmentsList, setAllDepartmentsList] = useState([]);
    const [cmb_sub_department_id, setSubDepartmentId] = useState(0);
    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    // const [att_date_time, setCompOffDate] = useState(today());
    const [comp_off_intimation_details_id, setCompOffIntimationId] = useState(compoffId);
    const [txt_approval_remark, setApprovalRemark] = useState('');

    const [reportingTo, setReportingToName] = useState('');
    const [leave_request_type, setLeaveRequestType] = useState('C');
    const [holidayDates, setHolidayDates] = useState([]);
    const [weeklyOffDates, setWeeklyOffDates] = useState([]);
    const [att_date_time, setCompOffDate] = useState(
        leave_request_type === 'H' ? holidayDates[0]?.date : weeklyOffDates[0]
    );
    const [lock_date, setLockDate] = useState('');
    const [lock_status, setLockStatus] = useState('');
    const [lockMonthName, setLockMonthName] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        navigate('/Masters/MCompOffLeaveRequest/FrmCompOffLeaveList')
        setShowSuccessMsgModal(false)
    };

    useEffect(async () => {
        await ActionType()
        await FillCombos();
        if (compoffId !== 0) {
            await FnCheckUpdateResponce()
        }
    }, [])


    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("compoffFormId");
                break;
            case 'approve':
                setActionType('(Approve)');
                setActionLabel('Approve');
                setApprovedStatus('Approved');
                // setApproveFlag(true);
                // await validate.current.readOnly("compoffFormId");
                // $('#txt_approval_remark').attr('disabled', false);


                break;

            case 'cancel':
                setActionType('(Cancel)');
                setActionLabel('cancel');
                setApprovedStatus('Cancelled');
                await validate.current.readOnly("compoffFormId");
                break;
            default:
                setActionType('(Creation)');
                break;
        }

    };



    const FillCombos = async () => {
        debugger
        try {

            resetGlobalQuery();
            globalQuery.columns = ["lock_date", "lock_status", "hrpayroll_settings_id"]
            globalQuery.table = "hm_hrpayroll_settings";
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            const lockData = await comboBoxRef.current.fillFiltersCombo(globalQuery);
            setLockDate(lockData[0].lock_date);
            setLockStatus(lockData[0].lock_status);
            let lockDate = new Date(lockData[0].lock_date);
            const lockMonth = lockDate.getMonth(); // 0 = January, 1 = February, ..., 11 = December

            // Array of month names
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // Get the name of the locked month
            const lockMonthName = monthNames[lockMonth];

            // Calculate the next month, wrapping around to January if it's December
            const prevMonth = lockMonth === 0 ? 11 : lockMonth - 1; // If January (0), set to December (11)

            const prevMonthName = monthNames[prevMonth];
            setLockMonthName(lockMonth);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name'];
            globalQuery.table = "amv_properties";
            // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'EmployeeType' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            const employeeTypesApiCall = await comboBoxRef.current.fillFiltersCombo(globalQuery);
            setEmployeeTypesOpts(employeeTypesApiCall);
            // if (DEPARTMENT_ID !== '11') {
            setEmployeeCode(USER_CODE);

            resetGlobalQuery();
            globalQuery.columns = ['employee_type'];
            globalQuery.table = "cmv_employee";
            globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
            globalQuery.conditions.push({ field: "employee_code", operator: "=", value: USER_CODE });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            const employeeTypeApiCall = await comboBoxRef.current.fillFiltersCombo(globalQuery);

            let req_employee = employeeTypesApiCall.find((data) => data.field_name === employeeTypeApiCall[0]['employee_type']);
            setEmployeeTypeId(req_employee.field_name);
            $("#cmb_employee_type_id").val(req_employee.field_name);
            // setEmployeeName(UserId);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code', 'weeklyoff_name'];
            globalQuery.table = "cmv_employee";
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "employee_type", operator: "=", value: req_employee.field_name });
            globalQuery.conditions.push({ field: "employee_id", operator: "=", value: UserId });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let getAppliedByApiCall = await comboBoxRef.current.fillFiltersCombo(globalQuery);
            if (getAppliedByApiCall.length > 0) {
                getAppliedByApiCall = getAppliedByApiCall?.map(prop => ({ ...prop, value: prop.field_id, label: `[${prop.old_employee_code}] ${prop.field_name}`, punching_code: prop.old_employee_code }));
                if (keyForViewUpdate === "add") {
                    setEmployeeOpts(getAppliedByApiCall);
                    employeeComboRef.current.field_id = getAppliedByApiCall[0].field_id
                    employeeComboRef.current.employee_id = getAppliedByApiCall[0].field_id
                    employeeComboRef.current.field_name = getAppliedByApiCall[0].field_name
                    employeeComboRef.current.employee_code = getAppliedByApiCall[0].employee_code
                    employeeComboRef.current.old_employee_code = getAppliedByApiCall[0].old_employee_code
                    setEmployeeId(getAppliedByApiCall[0].field_id);
                    setWeeklyOff(getAppliedByApiCall[0].weeklyoff_name);
                    setPunchCode(getAppliedByApiCall[0].old_employee_code);
                    setReportingToName(getAppliedByApiCall[0].reporting_to_name);
                    // Generate weekly off dates based on weekly off name
                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const weekDayIndex = daysOfWeek.indexOf(getAppliedByApiCall[0].weeklyoff_name);


                    //----------------------------------------**********--------
                    // if (weekDayIndex === -1) return;
                    // const currentDate = new Date();
                    // const currentMonth = currentDate.getMonth();
                    // const currentYear = currentDate.getFullYear();

                    // const dates = [];
                    // let date = new Date(currentYear, currentMonth, 1);

                    // while (date.getMonth() === currentMonth) {
                    //     if (date.getDay() === weekDayIndex) {
                    //         dates.push(new Date(date));
                    //     }
                    //     date.setDate(date.getDate() + 1);
                    // }
                    //----------------------------------------**********--------

                    if (weekDayIndex === -1) return;

                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth();

                    // Start from the 1st of the **previous month**
                    const startDate = new Date(currentYear, currentMonth - 1, 1);
                    // End on the **7th of the next month**
                    const endDate = new Date(currentYear, currentMonth + 1, 7);

                    const dates = [];
                    let date = new Date(startDate);

                    while (date <= endDate) {
                        const dateMonth = date.getMonth() + 1;
                        if (dateMonth > lockMonth && date.getDay() === weekDayIndex) {
                            dates.push(new Date(date));
                        }
                        // if (date.getDay() === weekDayIndex) { // Ensure only the required weekday is added

                        //     if (currentDate.getDate() < 2) {
                        //         // Add 30 days and also subtract 30 days (two separate dates)
                        //         if (dateMonth === lockMonth) {
                        //             let adjustedDate2 = new Date(date);
                        //             adjustedDate2.setDate(adjustedDate2.getDate() + 30);
                        //             dates.push(adjustedDate2);
                        //         } else {
                        //             let adjustedDate = new Date(date);
                        //             adjustedDate.setDate(adjustedDate.getDate() - 30);
                        //             dates.push(adjustedDate);
                        //         }
                        //     } else {
                        //         // Subtract 30 days
                        //         let adjustedDate1 = new Date(date);
                        //         adjustedDate1.setDate(adjustedDate1.getDate() + 30);
                        //         dates.push(adjustedDate1);
                        //     }

                        // }

                        date.setDate(date.getDate() + 1);

                    }


                    // Set the weekly off dates
                    setWeeklyOffDates(dates);
                    setCompOffDate(dates[0] || new Date());

                }
            }


            // }
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'employee_id', 'employee_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code', 'weeklyoff_name'];
            globalQuery.table = "cmv_employee"
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            // let employeeList = await comboBoxRef.current.fillFiltersCombo(globalQuery);
            // setEmployeeOpts(employeeList);
            comboBoxRef.current.fillFiltersCombo(globalQuery)
                .then(rcvdEmpls => {
                    rcvdEmpls = rcvdEmpls?.map(prop => ({ ...prop, value: prop.employee_id, employee_code: prop.employee_code, label: `[${prop.old_employee_code}] ${prop.employee_name}` }));
                    rcvdEmpls.unshift({ employee_id: '', employee_code: '', value: 'All', label: 'All' });
                    setEmployeeOpts(rcvdEmpls);
                });

            resetGlobalQuery();
            globalQuery.columns.push("user_id as field_id");
            globalQuery.columns.push("user_name as field_name");
            globalQuery.table = "amv_modules_forms_user_access";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "modules_forms_id", operator: "=", value: modules_forms_id });
            globalQuery.conditions.push({ field: "approve_access", operator: "=", value: 1 });
            comboBoxRef.current.fillFiltersCombo(globalQuery)
                .then(getApproveEmpAccessList => {
                    setEmployeeListOption(getApproveEmpAccessList);
                    console.log("Approve Access Emp List: ", getApproveEmpAccessList);
                });

            // Load Department & Sub-Department
            resetGlobalQuery();
            globalQuery.columns = ["department_id", "parent_department_id", "department_type", "department_name", "department_group"];
            globalQuery.table = "cm_department"
            globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            comboBoxRef.current.fillFiltersCombo(globalQuery)
                .then(rcvdDepts => {
                    const { mainDepartments, subDepartments } = rcvdDepts.reduce((acc, department) => {
                        if (department.department_type === "M") {
                            acc.mainDepartments.push({
                                ...department,
                                label: department.department_name,
                                value: department.department_id,
                            });
                        } else if (department.department_type === "S") {
                            acc.subDepartments.push({
                                ...department,
                                label: department.department_name,
                                value: department.department_id,
                            });
                        }
                        return acc;
                    }, { mainDepartments: [], subDepartments: [] });
                    setAllDepartmentsList([...mainDepartments, ...subDepartments]);

                    mainDepartments.unshift({ department_id: '', value: 'All', label: 'All' });
                    setDepartmentOpts(mainDepartments);
                    // subDepartments.unshift({ value: 'All', label: 'All' });
                    // setSubDepartmentOpts(subDepartments);
                });


        } catch (error) {

        }
    }
    const FnComboOnChange = async (comboName) => {
        debugger
        try {
            switch (comboName) {
                case "Department":
                    setEmployeeCode('');

                    employeeComboRef.current = null;
                    subDepartmentComboRef.current = null;
                    setSubDepartmentId('');
                    let selectedDepartment = departmentComboRef.current.department_id;
                    const subDepartmentList = allDepartmentsList.filter(department =>
                        (!selectedDepartment || department.parent_department_id === selectedDepartment) && department.department_type === "S"
                    );
                    subDepartmentList.unshift({ department_id: '', value: 'All', label: 'All' });
                    setSubDepartmentOpts(subDepartmentList);

                    let selectedEmployeeTypes = employeeTypesComboRef.current?.field_name || 'All';
                    let selectedDpt = departmentComboRef.current?.department_id || 'All';

                    resetGlobalQuery();
                    globalQuery.columns = ["employee_id", "employee_code", "employee_name", "old_employee_code", 'weeklyoff_name', 'reporting_to', 'reporting_to_name'];
                    globalQuery.table = "cmv_employee"
                    if (selectedEmployeeTypes && selectedEmployeeTypes !== 'All') {
                        globalQuery.conditions.push({ field: "employee_type", operator: "=", value: selectedEmployeeTypes });
                    }
                    if (selectedDpt && selectedDpt !== 'All') {
                        globalQuery.conditions.push({ field: "department_id", operator: "=", value: selectedDpt });
                    }
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: parseInt(COMPANY_ID) });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    comboBoxRef.current.fillFiltersCombo(globalQuery)
                        .then(rcvdEmpls => {
                            rcvdEmpls = rcvdEmpls?.map(prop => ({ ...prop, value: prop.employee_id, employee_code: prop.employee_code, label: `[${prop.old_employee_code}] ${prop.employee_name}` }));
                            rcvdEmpls.unshift({ employee_id: '', employee_code: '', value: 'All', label: 'All' });
                            setEmployeeOpts(rcvdEmpls);
                        });

                    setEmployeeId('');
                    // }
                    break;

                case "subDepartment":
                    debugger
                    setEmployeeCode('');
                    employeeComboRef.current = null;
                    let selectedDepTS = departmentComboRef.current.department_id;
                    const subDepartmentLists = allDepartmentsList.filter(department =>
                        (!selectedDepTS || department.parent_department_id === selectedDepTS) && department.department_type === "S"
                    );
                    subDepartmentLists.unshift({ department_id: '', value: 'All', label: 'All' });
                    setSubDepartmentOpts(subDepartmentLists);

                    // subDepartmentComboRef.current = null;
                    // setSubDepartmentId('');
                    let selectedEmpType = employeeTypesComboRef.current?.field_name || 'All';
                    let selectedDpts = departmentComboRef.current?.department_id || 'All';
                    let selectedSubDPts = subDepartmentComboRef.current?.department_id || 'All';

                    resetGlobalQuery();
                    globalQuery.columns = ["employee_id", "employee_code", "employee_name", "old_employee_code", 'weeklyoff_name', 'reporting_to', 'reporting_to_name'];
                    globalQuery.table = "cmv_employee"
                    if (selectedEmpType && selectedEmpType !== 'All') {
                        globalQuery.conditions.push({ field: "employee_type", operator: "=", value: selectedEmpType });
                    }
                    if (selectedDpts && selectedDpts !== 'All') {
                        globalQuery.conditions.push({ field: "department_id", operator: "=", value: selectedDpts });
                    }
                    if (selectedSubDPts && selectedSubDPts !== 'All') {
                        globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: selectedSubDPts });
                    }
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: parseInt(COMPANY_ID) });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    comboBoxRef.current.fillFiltersCombo(globalQuery)
                        .then(rcvdEmpls => {
                            rcvdEmpls = rcvdEmpls?.map(prop => ({ ...prop, value: prop.employee_id, employee_code: prop.employee_code, label: `[${prop.old_employee_code}] ${prop.employee_name}` }));
                            rcvdEmpls.unshift({ employee_id: '', employee_code: '', value: 'All', label: 'All' });
                            setEmployeeOpts(rcvdEmpls);
                        });

                    setEmployeeId('');

                    break;
                case "EmployeeType":
                    setEmployeeCode('');
                    setWeeklyOff('');
                    employeeComboRef.current = null;
                    // let selectedEmployeeType = employeeTypesComboRef.current?.field_name || 'All';
                    let selectedEmployeeType = document.getElementById('cmb_employee_type_id').value;
                    let selectedDepartments = departmentComboRef.current?.department_id || 'All';
                    let selectedSubDepartment = subDepartmentComboRef.current?.department_id || 'All';
                    resetGlobalQuery();
                    globalQuery.columns = ["employee_id", "employee_code", "employee_name", "old_employee_code", 'weeklyoff_name', 'reporting_to', 'reporting_to_name'];
                    globalQuery.table = "cmv_employee"
                    if (selectedEmployeeType && selectedEmployeeType !== 'All') {
                        globalQuery.conditions.push({ field: "employee_type", operator: "=", value: selectedEmployeeType });
                    }
                    if (selectedDepartments && selectedDepartments !== 'All') {
                        globalQuery.conditions.push({ field: "department_id", operator: "=", value: selectedDepartments });
                    }
                    if (selectedSubDepartment && selectedSubDepartment !== 'All') {
                        globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: selectedSubDepartment });
                    }
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: parseInt(COMPANY_ID) });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    comboBoxRef.current.fillFiltersCombo(globalQuery)
                        .then(rcvdEmpls => {
                            rcvdEmpls = rcvdEmpls?.map(prop => ({ ...prop, value: prop.employee_id, employee_code: prop.employee_code, label: `[${prop.old_employee_code}] ${prop.employee_name}` }));
                            rcvdEmpls.unshift({ employee_id: '', employee_code: '', value: 'All', label: 'All' });
                            setEmployeeOpts(rcvdEmpls);
                        });

                    setEmployeeId('');
                    break;
                case 'EmployeeCode':
                    debugger
                    setWeeklyOff('');
                    var serachemployeeCode = $('#txt_employee_code').val();
                    setEmployeeCode(serachemployeeCode);
                    let findEmployee = null;

                    if (serachemployeeCode.length >= 3) {
                        findEmployee = employeeOpts.find((employee) => {
                            return employee.employee_code === serachemployeeCode
                                || employee?.label?.toLowerCase().includes(serachemployeeCode.toLowerCase())
                                || employee?.old_employee_code === serachemployeeCode
                        });
                    }
                    if (findEmployee) {
                        setEmployeeId(findEmployee.employee_id);
                        setWeeklyOff(findEmployee.weeklyoff_name);
                        employeeComboRef.current = {
                            employee_id: findEmployee.employee_id,
                            employee_code: findEmployee.employee_code,
                            old_employee_code: findEmployee.old_employee_code
                        };
                    } else {
                        setEmployeeId('');
                        employeeComboRef.current = {
                            employee_id: '',
                            employee_code: '',
                        };
                    }
                    break;
                case 'EmplCode':
                    // setEmployeeCode(employeeComboRef.current.employee_code);
                    if (employeeComboRef.current && employeeComboRef.current.employee_code) {
                        setEmployeeCode(employeeComboRef.current.employee_code);
                    }

                    break;

                case 'Holiday':
                    resetGlobalQuery();
                    globalQuery.columns = ['production_holiday_date', 'production_holiday_name']; // Include the holiday name
                    globalQuery.table = "xm_production_holiday";
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    // Fetch holiday data including names
                    const holidayData = await comboBoxRef.current.fillFiltersCombo(globalQuery);
                    // Convert holiday dates to Date objects and pair with holiday names
                    const holidayDatesWithNames = holidayData.map(holiday => ({
                        date: new Date(holiday.production_holiday_date),
                        name: holiday.production_holiday_name // Assuming holiday_name is the name field
                    }));

                    // Set the holiday dates and names to state
                    setHolidayDates(holidayDatesWithNames);
                    const currentMonth = new Date().getMonth() + 1;
                    const currentYear = new Date().getFullYear();
                    const currentMonthHoliday = holidayDatesWithNames.find(
                        (holiday) => holiday.date.getMonth() === currentMonth && holiday.date.getFullYear() === currentYear
                    );
                    setCompOffDate(currentMonthHoliday ? currentMonthHoliday.date : new Date());
                    // setWeeklyOff(currentMonthHoliday ? currentMonthHoliday.name : new Date());

                    break;
                case 'CompOff':
                    debugger
                    resetGlobalQuery();
                    globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code', 'weeklyoff_name'];
                    globalQuery.table = "cmv_employee";
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    // globalQuery.conditions.push({ field: "employee_type", operator: "=", value: req_employee.field_name });
                    globalQuery.conditions.push({ field: "employee_id", operator: "=", value: UserId });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    let getAppliedByApiCall = await comboBoxRef.current.fillFiltersCombo(globalQuery);
                    employeeComboRef.current.field_id = getAppliedByApiCall[0].field_id
                    employeeComboRef.current.employee_id = getAppliedByApiCall[0].field_id
                    employeeComboRef.current.field_name = getAppliedByApiCall[0].field_name
                    employeeComboRef.current.employee_code = getAppliedByApiCall[0].employee_code
                    employeeComboRef.current.old_employee_code = getAppliedByApiCall[0].old_employee_code
                    setEmployeeId(getAppliedByApiCall[0].field_id);
                    setWeeklyOff(getAppliedByApiCall[0].weeklyoff_name);
                    setPunchCode(getAppliedByApiCall[0].old_employee_code);
                    setReportingToName(getAppliedByApiCall[0].reporting_to_name);
                    // Generate weekly off dates based on weekly off name
                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const weekDayIndex = daysOfWeek.indexOf(getAppliedByApiCall[0].weeklyoff_name);

                    if (weekDayIndex === -1) return;
                    const currentDate = new Date();
                    const currentYears = currentDate.getFullYear();
                    const currentMonths = currentDate.getMonth();

                    // Start from the 1st of the **previous month**
                    const startDate = new Date(currentYears, currentMonths - 1, 1);
                    // End on the **7th of the next month**
                    const endDate = new Date(currentYears, currentMonths + 1, 7);

                    const dates = [];
                    let date = new Date(startDate);

                    while (date <= endDate) {
                        const dateMonth = date.getMonth() + 1;

                        // if (date.getDay() === weekDayIndex) {
                        //     dates.push(new Date(date));
                        // }
                        if (dateMonth > lockMonthName && date.getDay() === weekDayIndex) {
                            // if (dateMonth >= lockMonthName && currentDate.getDate() < 2 && date.getDay() === weekDayIndex) {

                            dates.push(new Date(date));
                        }
                        date.setDate(date.getDate() + 1);
                    }


                    // Set the weekly off dates
                    setWeeklyOffDates(dates);
                    setCompOffDate(dates[0] || new Date());
                    // setCompOffDate(weeklyOffDates[0] || new Date());
                    break;
                case 'Employee':
                    debugger
                    setWeeklyOff('');
                    setReportingToName('');
                    var employeeID = employeeComboRef.current?.employee_id;
                    if (employeeID !== "") {
                        // var employeeCode = $('#cmb_employee_id option:selected').attr('employeeCode');
                        setEmployeeId(employeeComboRef.current.employee_id);
                        setEmployeeCode(employeeComboRef.current.employee_code);
                        setPunchCode(employeeComboRef.current.old_employee_code);
                        setWeeklyOff(employeeComboRef.current.weeklyoff_name)
                        setReportingToName(employeeComboRef.current.reporting_to_name);
                        // Generate weekly off dates based on weekly off name
                        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        const weekDayIndex = daysOfWeek.indexOf(employeeComboRef.current.weeklyoff_name);

                        // if (weekDayIndex === -1) return;

                        // const currentDate = new Date();
                        // const currentMonth = currentDate.getMonth();
                        // const currentYear = currentDate.getFullYear();

                        // const dates = [];
                        // let date = new Date(currentYear, currentMonth, 1);

                        // while (date.getMonth() === currentMonth) {
                        //     if (date.getDay() === weekDayIndex) {
                        //         dates.push(new Date(date));
                        //     }
                        //     date.setDate(date.getDate() + 1);
                        // }

                        if (weekDayIndex === -1) return;

                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        // Start from the 1st of the **previous month**
                        const startDate = new Date(currentYear, currentMonth - 1, 1);
                        // End on the **7th of the next month**
                        const endDate = new Date(currentYear, currentMonth + 1, 7);

                        const dates = [];
                        let date = new Date(startDate);

                        while (date <= endDate) {
                            const dateMonth = date.getMonth() + 1;
                            // if (dateMonth >= lockMonthName && currentDate.getDate() < 2 && date.getDay() === weekDayIndex) {
                            //     dates.push(new Date(date));
                            // }

                            if (dateMonth > lockMonthName && date.getDay() === weekDayIndex) {
                                dates.push(new Date(date));
                            }
                            date.setDate(date.getDate() + 1);
                        }
                        // Set the weekly off dates
                        setWeeklyOffDates(dates);

                    } else {
                        setEmployeeCode('');
                    }

                default:
                    break;
            }

        } catch (error) {
            console.log("error on combos change: ", error)
            navigate('/Error')
        }
    }

    const validateEmployeeForm = async () => {
        let Holiday = document.getElementById("txt_holiday").value
        if (leave_request_type === "H" && Holiday === "No Holiday") {
            $("#error_txt_weekly_off").text("No Holiday available on this day...!");
            $("#error_txt_weekly_off").show();
            $("#error_txt_weekly_off").focus();
            return false;
        } else {
            $("#error_txt_weekly_off").hide();
        }
        return true;
    }
    const saveCompOff = async () => {
        debugger
        setIsLoading(true)
        try {
            let checkIsValidate = true;
            if (leave_request_type === "H") {
                checkIsValidate = await validateEmployeeForm();
            }
            const validateForm = await validate.current.validateForm('compoffFormId');
            if (validateForm === true && checkIsValidate === true) {
                const dates = new Date(att_date_time);
                // const formattedDate = AttDate.toISOString().split('T')[0];
                const formattedDate = `${dates.getFullYear()}-${(dates.getMonth() + 1).toString().padStart(2, '0')}-${dates.getDate().toString().padStart(2, '0')}`;
                const data = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    created_by: UserName,
                    punch_code: txt_punch_code,
                    employee_id: employeeComboRef.current?.employee_id,
                    comp_off_intimation_details_id: comp_off_intimation_details_id !== undefined && comp_off_intimation_details_id !== 0
                        ? comp_off_intimation_details_id
                        : 0,
                    att_date_time: formattedDate,
                    employee_code: employeeComboRef.current?.employee_code,
                    status: cmb_compoff_status,
                    // weeklyoff_name: txt_weekly_off ,
                    weeklyoff_name: leave_request_type === "H" ? document.getElementById("txt_holiday").value : txt_weekly_off,
                    remark: txt_compoff_reason,
                    employee_type: cmb_employee_type_id,
                    // employee_type_id: employeeTypesComboRef.current?.field_id,
                    approval_remark: txt_approval_remark,
                    comp_holiday_type: leave_request_type,
                }
                if (keyForViewUpdate === "approve") {
                    data.approved_by_id = UserId;
                    data.approved_date = today();
                }


                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };

                const getCompOffDetails = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmCompoffDetails/FnAddUpdateRecord`, requestOptions)
                const resp = await getCompOffDetails.json()
                if (resp.success === 0) {
                    setErrMsg(resp.error)
                    setShowErrorMsgModal(true)
                } else {
                    setSuccMsg(resp.message)
                    setShowSuccessMsgModal(true)
                }
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }



    const FnCheckUpdateResponce = async () => {
        debugger
        setIsLoading(true)
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmCompoffDetails/FnShowParticularRecordForUpdate/${COMPANY_ID}/${compoffId}`)
            const response = await apiCall.json();
            const compOffData = response.data;
            setCompOffIntimationId(compOffData.comp_off_intimation_details_id);
            setEmployeeCode(compOffData.employee_code);
            employeeComboRef.current.employee_code = compOffData.employee_code;
            employeeComboRef.current.old_employee_code = compOffData.old_employee_code;
            setEmployeeId(compOffData.employee_id);
            employeeComboRef.current.employee_id = compOffData.employee_id;
            setEmployeeTypeId(compOffData.employee_type);
            setPunchCode(compOffData.punch_code);
            setCompOffDate(compOffData.att_date_time);
            setCompOffReason(compOffData.remark);
            setApprovedBy(compOffData.approved_by_id);
            setLeaveRequestType(compOffData.comp_holiday_type);
            setWeeklyOff(compOffData.weeklyoff_name);

            setApprovalRemark(compOffData.approval_remark);
            setReportingToName(compOffData.reporting_to_name);
            if (keyForViewUpdate === 'cancel') {
                setApprovedStatus('Cancelled');
            } if (keyForViewUpdate === 'approve') {
                setApprovedStatus('Approved');
            } if (keyForViewUpdate === 'view') {
                setApprovedStatus(compOffData.status);
            }

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        } finally {
            setIsLoading(false)
        }

    }

    ////Validation starts here
    const validateFields = async () => {
        await validate.current.validateFieldsOnChange('compoffFormId');
    }



    const handleDateChange = (key, date) => {
        switch (key) {
            case 'att_date_time':
                const dateTime = document.getElementById('att_date_time')
                if (dateTime !== '') {
                    $('#error_att_date_time').hide();
                    setCompOffDate(date);
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <ComboBox ref={comboBoxRef} />
            <FrmValidations ref={validate} />
            <GenerateTAutoNo ref={generateAutoNoAPiCall} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span id="spinner_text" className="text-dark">Loading...</span>
                    </div>
                </div> :
                null}
            <DashboardLayout>
                {/* <div className="erp_top_Form"> */}
                <div className='card p-1 mt-3'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Comp.Off & Holiday Present Leave{actionType} </label>
                    </div>


                    <form id="compoffFormId">

                        <div className='row mt-1'>
                            <div className='col-sm-6 erp_form_col_div'>

                                <div className="row mb-1">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">
                                            {leave_request_type === 'H' ? 'Holiday & Date :' : 'CompOff & Date :'}
                                        </Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="row">
                                            <div className="col-12 col-md-6 pe-md-0">
                                                <div className="erp_form_radio">
                                                    <div className="fCheck"> <Form.Check className="erp_radio_button" label="CompOff" type="radio" lbl="CompOff" value="C" name="leave_request_type" checked={leave_request_type === "C"} onChange={() => { setLeaveRequestType("C"); FnComboOnChange("CompOff"); }} disabled={keyForViewUpdate != "add"} /> </div>
                                                    <div className="sCheck ps-3"> <Form.Check className="erp_radio_button" label="Holiday" type="radio" lbl="Holiday" value="H" name="leave_request_type" checked={leave_request_type === "H"} onChange={() => { setLeaveRequestType("H"); FnComboOnChange("Holiday"); }} disabled={keyForViewUpdate != "add"} /> </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col">
                                        <DatePicker selected={att_date_time} id="att_date_time" onChange={(date) => handleDateChange('att_date_time', date)}
                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'approve'}
                                            // minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)} // First day of the current month
                                            // maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)} // Last day of the current month
                                            // minDate={new Date(new Date().getFullYear(), lockMonthName + 1, 1)} // Start from next month
                                            minDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)} // First day of the previous month
                                            maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 7)} // 7th of the next month

                                            filterDate={(date) =>
                                                leave_request_type === "H"
                                                    ? holidayDates.some(holiday => holiday.date.toDateString() === date.toDateString())
                                                    : weeklyOffDates.some(weeklyOffDate => weeklyOffDate.toDateString() === date.toDateString())
                                            }
                                        />
                                        <MDTypography variant="button" id="error_att_date_time" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_employee_type_id" className="form-select form-select-sm" value={cmb_employee_type_id} onChange={e => { FnComboOnChange('EmployeeType'); setEmployeeTypeId(e.target.value); }} maxLength="255" disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'approve'}>
                                            <option value="" disabled>Select</option>
                                            {employeeTypesOpts?.map(employeeTypes => (
                                                <option value={employeeTypes.field_name}>{employeeTypes.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_employee_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Employee / Reporting To :<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className="col">
                                        <Select ref={employeeComboRef}
                                            options={employeeOpts}
                                            inputId="cmb_employee_id"
                                            isDisabled
                                            value={employeeOpts.find(option => option.value == cmb_employee_id) || null}
                                            onChange={(selectedOpt) => {
                                                setEmployeeId(selectedOpt.value);
                                                employeeComboRef.current = selectedOpt;
                                                FnComboOnChange('Employee');
                                                validateFields();
                                            }}
                                            placeholder="Search for a employee..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"
                                            styles={{
                                                option: (provided, state) => ({ ...provided, fontSize: '12px' }),
                                                singleValue: (provided, state) => ({ ...provided, fontSize: '12px' }),
                                                input: (provided, state) => ({ ...provided, fontSize: '12px' })
                                            }}
                                        />
                                        <MDTypography variant="button" id="error_cmb_employee_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}> </MDTypography>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id='reportingTo' className="erp_input_field" value={reportingTo} onChange={(e) => { setReportingToName(e.target.value); validateFields(); }} disabled />
                                        <MDTypography variant="button" id="error_reportingTo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                            </div>

                            <div className='col-sm-6 erp_form_col_div'>

                                <div className="row mb-1">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">
                                            {leave_request_type === 'H' ? 'Holiday Name & Status' : 'Weekly Off & Status'} <span className="required">*</span>
                                        </Form.Label>
                                    </div>

                                    {leave_request_type === 'H' ? (
                                        <div className="col">
                                            {/* Displaying the holiday name if it matches the selected date */}
                                            <Form.Control
                                                as="textarea"
                                                className="erp_input_field optional"
                                                id="txt_holiday"

                                                // value={
                                                //     holidayDates.some((holiday) => {
                                                //         const holidayDate = new Date(holiday.date);
                                                //         const currentMonth = new Date(att_date_time).getMonth();
                                                //         return holidayDate.getMonth() === currentMonth;
                                                //     })
                                                //         ? holidayDates.find((holiday) => {
                                                //             const date = new Date(att_date_time);
                                                //             return !isNaN(date) && new Date(holiday.date).toDateString() === date.toDateString();
                                                //         })?.name || 'No Holiday'
                                                //         : txt_weekly_off // Show "No holiday" if no holidays found in the current month
                                                // }
                                                value={(() => {
                                                    if (keyForViewUpdate !== 'add') {
                                                        return txt_weekly_off; // Show saved weekly off value when not in 'add' mode
                                                    }

                                                    const selectedDate = new Date(att_date_time);
                                                    if (isNaN(selectedDate)) return 'No Holiday';

                                                    // Check if there's a holiday on the selected date
                                                    const holiday = holidayDates.find((holiday) =>
                                                        new Date(holiday.date).toDateString() === selectedDate.toDateString()
                                                    );

                                                    return holiday ? holiday.name : 'No Holiday';
                                                })()}

                                                disabled
                                            />
                                            <MDTypography variant="button" id="error_txt_weekly_off" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    ) : (
                                        <div className="col">
                                            {/* Weekly off textarea */}
                                            <Form.Control
                                                as="textarea"
                                                className="erp_input_field optional"
                                                id="txt_weekly_off"
                                                value={txt_weekly_off}
                                                disabled
                                            />

                                        </div>

                                    )}

                                    <div className="col">
                                        <Form.Control as="select" id="cmb_compoff_status" className="form-select form-select-sm" value={cmb_compoff_status} onChange={e => { setApprovedStatus(e.target.value); validateFields(); }} disabled={keyForViewUpdate !== 'approve'} maxLength="255" required>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </Form.Control>
                                        <MDTypography variant="button" id="error_cmb_compoff_status" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>

                                <div className="row mb-1">
                                    <div className="col-sm-4">

                                        <Form.Label className="erp-form-label">
                                            {leave_request_type === 'H' ? 'Holiday Reason :' : 'CompOff Reason :'} <span className="required">*</span>
                                        </Form.Label>
                                    </div>
                                    <div className="col">

                                        <Form.Control
                                            as="textarea"
                                            className="erp_input_field"
                                            id="txt_compoff_reason"
                                            value={txt_compoff_reason}
                                            onChange={e => { setCompOffReason(e.target.value); validateFields(); }}
                                            disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'approve'}

                                        />
                                        <MDTypography variant="button" id="error_txt_compoff_reason" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className={`${keyForViewUpdate === 'add' || keyForViewUpdate === 'update' ? 'd-none' : 'display'}`}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Approval Remark <span className="required">*</span>
                                            </Form.Label>
                                        </div>
                                        <div className="col">

                                            <Form.Control
                                                as="textarea"
                                                className="erp_input_field "
                                                id="txt_approval_remark"
                                                value={txt_approval_remark}
                                                onChange={e => { setApprovalRemark(e.target.value); }}
                                                disabled={keyForViewUpdate === 'view'}
                                                optional={`${keyForViewUpdate !== 'approve' ? "optional" : ''}`}
                                            />
                                            <MDTypography variant="button" id="error_txt_approval_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </form>

                    {/* </div> */}
                    <div className="erp_frm_Btns py-2">
                        <MDButton className="erp-gb-button ms-2" variant="button" id='back_Button' fontWeight="regular" onClick={() => navigate('/Masters/MCompOffLeaveRequest/FrmCompOffLeaveList')}>Back</MDButton>
                        <MDButton type="submit" id="save_Button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            onClick={() => saveCompOff()} fontWeight="regular">{actionLabel}</MDButton>
                        {/* <MDButton className={`erp-gb-button erp_MLeft_btn ${keyForViewUpdate === 'view' || keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" onClick={() => printInvoice(true)}>Print &nbsp;<FiPrinter className="erp-download-icon-btn" />
                    </MDButton> */}
                    </div >
                </div >
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </DashboardLayout >

        </>
    )
}

export default FrmCompOffLeaveEntry