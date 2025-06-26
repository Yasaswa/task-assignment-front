import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import { CircularProgress } from "@material-ui/core";
//React Bootstrap components
import { Card, CardBody, Table } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ConfigConstants from "assets/Constants/config-constant";
import MDButton from "components/MDButton";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import MDTypography from "components/MDTypography";
import FrmValidations from 'FrmGeneric/FrmValidations';
import GenerateTAutoNo from "FrmGeneric/GenerateTAutoNo";
import ComboBox from "Features/ComboBox";
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import InfoModal from "components/Modals/InfoModal";
import { deepPurple } from "@material-ui/core/colors";


function FrmBusinessTravelEntry() {

    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName, FINANCIAL_SHORT_NAME, UserId, COMPANY_BRANCH_ID, SHORT_COMPANY, SHORT_FINANCIAL_YEAR, USER_CODE, DEPARTMENT_ID } = configConstants;

    const { state } = useLocation();
    const { keyForViewUpdate, leavesId = 0, modules_forms_id } = state || {}

  
     // Loader
      const [isLoading, setIsLoading] = useState(false);

    // UseRefs
    const navigate = useNavigate();
    const validate = useRef();
    const frmValidation = useRef();
    const combobox = useRef();
    const generateAutoNoAPiCall = useRef();
    const comboDataAPiCall = useRef();
    const validateNumberPercentInput = useRef();
    const [leaves_transaction_id, setLeavesTransactionId] = useState(leavesId);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [showWarningMsgModal, setShowWarningMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState("");
    let employeeComboRef = useRef(null);

    const [leavesDetails, setLeavesApplicationData] = useState([]);
    const [leaves_applied_days, setLeavesAppliedDays] = useState(1);
    const [cmb_employee_id, setEmployeeName] = useState(UserId);
    const [txt_leaves_sanction_days, setLeavesSanctionDays] = useState(0);
    const [txt_leaves_rejection_days, setLeavesRejectionDays] = useState(0);
    const [chk_isactive, setIsActive] = useState(true);
    const [chk_isLeavesandwich, setLeaveSandwich] = useState('No');
    const [cmb_employee_type, setEmployeeType] = useState('');
    const [txt_employee_code, setEmployeeCode] = useState();
    const [txt_work_handover_id, setWorkHandoverId] = useState('');
    const [txt_sanction_by_id, setSanctionById] = useState(UserId);
    const [applied_by_id, setAppliedById] = useState('');
    const [cmb_leave_status, setLeaveStatus] = useState('Pending');
    const [txt_department_id, setDepartmentId] = useState('');
    const [reporting_to, setReportingTo] = useState('');
    const [weeklyoff, setWeeklyOFF] = useState('');
    const [txt_leave_type_id, setLeaveTypeId] = useState("11");
    const [dt_leaves_application_date, setApplicationDate] = useState(today);
    const [dt_leaves_requested_from_date, setLeavesRequestedFromDate] = useState(today);
    const [dt_leaves_requested_to_date, setLeavesRequestedToDate] = useState(today);
    const [dt_leaves_approved_from_date, setLeavesApprovedFromDate] = useState();
    const [dt_leaves_approved_to_date, setLeavesApprovedToDate] = useState();
    const [dt_approved_date, setApprovedDate] = useState(today());
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [remarkLable, setRemarkLabel] = useState('Leave')

    const [txt_leave_approve_remark, setRemark] = useState('');
    const [txt_leave_reason, setLeaveReason] = useState('');
    const [txt_sub_department_id, setsubDepartmentId] = useState('');
    const [txt_leaves_applications_id, setTransactionId] = useState('');
    const [existingCount, setExistingCount] = useState(0);
    const [appliedAllEmployee, setEmplyeeForApplied] = useState([]);
    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [employeeAppliedBy, setEmployeeListBasedEmployeeType] = useState([]);
    const [departmentopt, setDepartmentOption] = useState([]);
    const [subdepartmentopt, setSubDepartmentOption] = useState([]);
    const [employeeListId, setEmployeeListOption] = useState([]);
    const [reportingToListId, setReportingToListOption] = useState([]);
    const [leaveTypeAll, setLeaveTypesAllOption] = useState([]);
    const [ApproveFlag, setApproveFlag] = useState(false);
    const currentDate = dt_leaves_requested_from_date;
    const leaveTodate = new Date().toISOString().split('T')[0];
    const [approvedByOptions, setApprovedByOptions] = useState([]);
    const [defaultSelectedOptions, setpreSelectedOptions] = useState([]);


    //Error Msg
    const handleCloseErrModal = () => { setShowErrorMsgModal(false) };
    const handleCloseWarnModal = () => { setShowWarningMsgModal(false) };

    useEffect(() => {
        setIsLoading(true);
        const loadDataOnload = async () => {
            await ActionType()
            await fillCombos();
            if (leavesId !== 0) {
                await FnCheckUpdateResponce()
            } else {
                await generateLeavesNo();
            }
        }
        setIsLoading(false);
        loadDataOnload()
    }, []);


    const generateLeavesNo = async () => {
        try {
            const transactionId = await generateAutoNoAPiCall.current.generateTAutoNo("hm_leaves_applications", "leaves_applications_id", "", 'L', "6");
            setTransactionId(transactionId);
            return transactionId;
        } catch (error) {
            navigate('/Error')
        }
    }
   
    const validateErrorMsgs = () => {
        frmValidation.current.validateFieldsOnChange('leavesDetailsFormId');
    }
    const validateForm = () => {
        frmValidation.current.validateFieldsOnChange('ApproveForm')
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        navigate(`/Masters/MBusinessTravelApplication/FrmBusiessTravelListing`)

    }


    function convertDate(dateString) {
        // Create a new Date object from the original date string
        let dateObj = new Date(dateString);

        // Extract year, month, and day from the Date object
        let year = dateObj.getFullYear();
        let month = String(dateObj.getMonth() + 1).padStart(2, '0');
        let day = String(dateObj.getDate()).padStart(2, '0');

        // Format the date as YYYY-MM-DD
        return `${year}-${month}-${day}`;
    }

    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(year, month - 1, day); // Month is 0-indexed
    };

    const calculateAppliedDays = (key, date) => {

        // Get the values from the DOM
        const fromDateStr = document.getElementById('dt_leaves_requested_from_date').value;
        const toDateStr = document.getElementById('dt_leaves_requested_to_date').value;

        let fromDate, toDate;

        switch (key) {
            case 'dt_leaves_requested_from_date':
                fromDate = date instanceof Date ? date : parseDate(date);
                toDate = parseDate(toDateStr);
                break;
            case 'dt_leaves_requested_to_date':
                fromDate = parseDate(fromDateStr);
                toDate = date instanceof Date ? date : parseDate(date);
                break;
            default:
                console.error('Invalid key provided');
                return;
        }

        // Check if both dates are valid
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            console.error('Invalid date input');
            return;
        }

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        const diffTime = toDate.getTime() - fromDate.getTime();
        // let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Use Math.floor to get full days


        if (diffDays < 0) {
            diffDays = 0;
        }

        console.log(diffDays);
        setLeavesAppliedDays(diffDays);
    };

    const calculateApproveDays = (fromDateStrs, toDateStrs) => {

        const fromDate = new Date(fromDateStrs);
        const toDate = new Date(toDateStrs);
        // Check if both dates are valid
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            console.error('Invalid date input');
            return;
        }
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        const diffTime = toDate.getTime() - fromDate.getTime();
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Use Math.floor to get full days

        setLeavesSanctionDays(diffDays);
        calculateRejectionDays(diffDays);
    }

    const calculateRejectionDays = (sanctionDays) => {
        const appliedDays = document.getElementById('leaves_applied_days').value;
        if (isNaN(sanctionDays)) {
            console.error('Invalid input for sanction days');
            return;
        }
        const rejectionDays = appliedDays - sanctionDays;
        setLeavesRejectionDays(rejectionDays);
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                setRemarkLabel('Update')
                await validate.current.readOnly("ApproveForm");
                $('#leaves_applied_days').attr('disabled', true);

                break;
            case 'view':
                setActionType('(View)');
                setRemarkLabel('Leave')
                await validate.current.readOnly("leavesDetailsFormId");
                // await validate.current.readOnly("leaveForm");
                await validate.current.readOnly("ApproveForm");
                $('#save-btn').hide();
                break;
            case 'approve':
                setActionType('(Approve)');
                setActionLabel('Approve')
                setRemarkLabel('Approve');
                setApproveFlag(true);
                setLeaveStatus("Approved");
                await validate.current.readOnly("leavesDetailsFormId");
               
                break;
            case 'cancel':
                setActionType('(Cancel)');
                setActionLabel('cancel');
                setRemarkLabel('Cancel');
                setLeaveStatus("Cancelled");
                await validate.current.readOnly("leavesDetailsFormId");
                 break;
            default:
                setActionType('(Creation)');
                setSanctionById('');
                setApprovedDate('');
                await validate.current.readOnly("ApproveForm");
                $('#cmb_leave_status').attr('disabled', true);
                break;
        }

    };

    const fillCombos = async () => {
        try {
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name'];
            globalQuery.table = "amv_properties";
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'EmployeeType' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.orderBy = ['property_name']
            const employeeTypesApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setEmployeeTypeOptions(employeeTypesApiCall);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name'];
            globalQuery.table = "cmv_department";
            globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
            globalQuery.conditions.push({ field: "department_type", operator: "=", value: 'M' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

            const departmentIdApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setDepartmentOption(departmentIdApiCall);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name'];
            globalQuery.table = "cmv_department";
            globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
            globalQuery.conditions.push({ field: "department_type", operator: "=", value: 'S' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

            const departmentIdApiCalls = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setSubDepartmentOption(departmentIdApiCalls);

            // Using USER CODE getting employee type
            if (keyForViewUpdate === "add") {
                setEmployeeCode(USER_CODE);

                resetGlobalQuery();
                globalQuery.columns = ['employee_type'];
                globalQuery.table = "cmv_employee";
                globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] });
                globalQuery.conditions.push({ field: "employee_code", operator: "=", value: USER_CODE });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const employeeTypeApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);

                let req_employee = employeeTypesApiCall.find((data) => data.field_name === employeeTypeApiCall[0]['employee_type']);
                setEmployeeType(req_employee.field_name);
                $("#cmb_employee_type").val(req_employee.field_name);
               

                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code', 'weeklyoff_name'];
                globalQuery.table = "cmv_employee";
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "employee_type", operator: "=", value: req_employee.field_name });
                globalQuery.conditions.push({ field: "employee_id", operator: "=", value: UserId });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                let getAppliedByApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                // setEmployeeListBasedEmployeeType(getAppliedByApiCall);
                if (getAppliedByApiCall.length > 0) {
                    getAppliedByApiCall = getAppliedByApiCall?.map(prop => ({ ...prop, value: prop.field_id, label: `[${prop.old_employee_code}] ${prop.field_name}`, punching_code: prop.old_employee_code, reporting_to: prop.reporting_to }));
                    setEmployeeListBasedEmployeeType(getAppliedByApiCall);
                    setDepartmentId(getAppliedByApiCall[0].department_id);
                    setsubDepartmentId(getAppliedByApiCall[0].sub_department_id);
                    // setEmployeeName(getAppliedByApiCall[0].field_id);
                    setReportingTo(getAppliedByApiCall[0].reporting_to);
                    setWeeklyOFF(getAppliedByApiCall[0].weeklyoff_name);
                    // setAppliedById(getAppliedByApiCall[0].field_id);
                    employeeComboRef.current.field_id = getAppliedByApiCall[0].field_id
                    employeeComboRef.current.field_name = getAppliedByApiCall[0].field_name
                    employeeComboRef.current.old_employee_code = getAppliedByApiCall[0].old_employee_code
                    setEmployeeName(getAppliedByApiCall[0].field_id);

                    let reportingTo = getAppliedByApiCall[0].reporting_to;
                    if (reportingTo !== null && reportingTo !== "" && reportingTo !== undefined) {
                        let setAppliedByIdsString = [];
                        let preSelectedOptionsList = [];
                        const matchedOption = getAppliedByApiCall.find(employee => employee.reporting_to === parseInt(reportingTo));
                        if (matchedOption) {
                            preSelectedOptionsList.push({
                                value: matchedOption.reporting_to, label: matchedOption.reporting_to_name
                            });
                            setAppliedByIdsString.push(matchedOption.reporting_to);

                        }


                        setpreSelectedOptions(preSelectedOptionsList);
                        setAppliedById(setAppliedByIdsString);
                    }
                }
               
                resetGlobalQuery();
                globalQuery.columns.push("user_id as field_id");
                globalQuery.columns.push("user_name as field_name");
                globalQuery.table = "amv_modules_forms_user_access";
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "modules_forms_id", operator: "=", value: modules_forms_id });
                globalQuery.conditions.push({ field: "approve_access", operator: "=", value: 1 });
                // comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                let getApprovalApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                const AppliedByOptions = [
                    { value: '', label: 'Select' },
                    // { value: '0', label: 'Add New Record+' },
                    ...getApprovalApiCall.map((appliedBy) => ({ ...appliedBy, value: appliedBy.field_id, label: appliedBy.field_name })),
                ];

                setEmplyeeForApplied(AppliedByOptions);

            }


            resetGlobalQuery();
            globalQuery.columns.push("user_id as field_id");
            globalQuery.columns.push("user_name as field_name");
            globalQuery.table = "amv_modules_forms_user_access";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "modules_forms_id", operator: "=", value: modules_forms_id });
            globalQuery.conditions.push({ field: "approve_access", operator: "=", value: 1 });
            comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                .then(getApproveEmpAccessList => {
                    setApprovedByOptions(getApproveEmpAccessList);
                    console.log("Approve Access Emp List: ", getApproveEmpAccessList);
                });


            await FnComboOnchange('employee_type');


            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'reporting_to', 'reporting_to_name'];
            globalQuery.table = "cmv_employee_list";
            globalQuery.conditions.push({ field: "employee_type", operator: "=", value: "Staff" });
            globalQuery.conditions.push({ field: "is_active", operator: "=", value: 1 });

            const employeeListApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setEmployeeListOption(employeeListApiCall);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name'];
            globalQuery.table = "hmv_leave_type";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            const leaveTypeApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setLeaveTypesAllOption(leaveTypeApiCall);

        } catch (error) {
            console.log("error: ", error);
            navigate('/Error')
        }
    }
    const formatDate = (dateString) => {
        if (!dateString) return ''; 
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };
    const FnComboOnchange = async (key, event) => {
        switch (key) {
            case 'employee_type':
                const employeeType = document.getElementById('cmb_employee_type').value;
                $('#error_leaves_applied_days').hide();

                if (employeeType !== "") {
                    resetGlobalQuery();
                    globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code'];
                    globalQuery.table = "cmv_employee";
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "employee_type", operator: "=", value: employeeType });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    let getAppliedByApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                    if (getAppliedByApiCall.length > 0) {
                        getAppliedByApiCall = getAppliedByApiCall?.map(prop => ({ ...prop, value: prop.field_id, label: `[${prop.old_employee_code}] ${prop.field_name}`, punching_code: prop.old_employee_code }));
                        setEmployeeListBasedEmployeeType(getAppliedByApiCall);
                    }

                    resetGlobalQuery();
                    globalQuery.columns.push("user_id as field_id");
                    globalQuery.columns.push("user_name as field_name");
                    globalQuery.table = "amv_modules_forms_user_access";
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "modules_forms_id", operator: "=", value: modules_forms_id });
                    globalQuery.conditions.push({ field: "approve_access", operator: "=", value: 1 });
                    // comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                    let getApprovalApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                    const AppliedByOptions = [
                        { value: '', label: 'Select' },
                        ...getApprovalApiCall.map((appliedBy) => ({ ...appliedBy, value: appliedBy.field_id, label: appliedBy.field_name })),
                    ];

                    setEmplyeeForApplied(AppliedByOptions);
                    break;
                }
            case 'employee_code':

                setEmployeeName('');
                const employeeCode = document.getElementById('txt_employee_code').value;
                const employeetype = document.getElementById('cmb_employee_type').value;

                if (employeeCode !== "" && employeetype !== "") {
                    resetGlobalQuery();
                    globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id', 'old_employee_code'];
                    globalQuery.table = "cmv_employee";
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "employee_type", operator: "=", value: employeetype });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

                   let getAppliedByApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                    if (getAppliedByApiCall.length > 0) {
                        getAppliedByApiCall = getAppliedByApiCall?.map(prop => ({ ...prop, value: prop.field_id, label: `[${prop.old_employee_code}] ${prop.field_name}`, punching_code: prop.old_employee_code }));
                        setEmployeeListBasedEmployeeType(getAppliedByApiCall);
                    }

                    // Only search for employee if the input length is at least 3 characters
                    if (employeeCode.length >= 3) {
                        const serachemployeeCode = getAppliedByApiCall.find(employee =>
                            employee.employee_code.toLowerCase().includes(employeeCode.toLowerCase()) ||
                            employee?.field_name?.toLowerCase().includes(employeeCode.toLowerCase())
                            || employee?.old_employee_code?.includes(employeeCode)
                        );


                        if (serachemployeeCode) {
                            employeeComboRef.current.field_id = serachemployeeCode.field_id
                            employeeComboRef.current.field_name = serachemployeeCode.field_name
                            employeeComboRef.current.old_employee_code = serachemployeeCode.old_employee_code
                            setEmployeeName(serachemployeeCode.field_id);
                            //****************************************** */
                            if (keyForViewUpdate === "add") {
                                setReportingTo(serachemployeeCode.reporting_to);
                                setAppliedById(serachemployeeCode.reporting_to_name);

                                let reportingTo = serachemployeeCode.reporting_to;
                                if (reportingTo !== null && reportingTo !== "" && reportingTo !== undefined) {
                                    let setAppliedByIdsString = [];
                                    let preSelectedOptionsList = [];
                                    const matchedOption = getAppliedByApiCall.find(employee => employee.reporting_to === parseInt(reportingTo));
                                    if (matchedOption) {
                                        preSelectedOptionsList.push({
                                            value: matchedOption.reporting_to, label: matchedOption.reporting_to_name
                                        });
                                        setAppliedByIdsString.push(matchedOption.reporting_to);

                                    }


                                    setpreSelectedOptions(preSelectedOptionsList);
                                    setAppliedById(setAppliedByIdsString);
                                }

                            }
                            //****************************************** */
                           const subDepartmentID = serachemployeeCode.sub_department_id;
                            const departmentID = serachemployeeCode.department_id;

                            setDepartmentId(departmentID);
                            setsubDepartmentId(subDepartmentID); // Correctly set subDepartmentId
                            FnComboOnchange('employee_baseDeparmentAndType');
                        }
                    } else {
                       setEmployeeName('');
                        setReportingTo('');
                        setDepartmentId('');
                        setsubDepartmentId('');
                    }
                }
                break;
            case 'empl_code':
                const selectedEmployeecode = employeeComboRef.current?.field_name;
               const selectedSearchEmployee = employeeAppliedBy.find(employee => employee.field_name === selectedEmployeecode);
                if (selectedSearchEmployee && selectedSearchEmployee !== '' && selectedSearchEmployee !== null && selectedSearchEmployee !== undefined) {
                    setEmployeeCode(selectedSearchEmployee.employee_code);
                }

                break;
            case 'employee_name':
                const selectedEmployeeFieldName = employeeComboRef.current?.field_name;
                const selectedEmployee = employeeAppliedBy.find(employee => employee.field_name === selectedEmployeeFieldName);
                $('#error_leaves_applied_days').hide();
             //   setClosingBalance('');
                setLeaveTypeId('');
                if (selectedEmployee) {
                    setEmployeeCode(selectedEmployee.employee_code);
                    setWeeklyOFF(selectedEmployee.weeklyoff_name);
                    if (keyForViewUpdate === "add") {
                        if (selectedEmployee.reporting_to == null || selectedEmployee.reporting_to_name == "" ||
                            selectedEmployee.reporting_to_name == null || selectedEmployee.reporting_to == "") {
                            setReportingTo("");
                            setAppliedById("");
                            setpreSelectedOptions("");
                        } else {
                            setReportingTo(selectedEmployee.reporting_to);
                            setAppliedById(selectedEmployee.reporting_to_name);
                        }

                        let reportingTo = selectedEmployee.reporting_to;
                        if (reportingTo !== null && reportingTo !== "" && reportingTo !== undefined) {
                            let setAppliedByIdsString = [];
                            let preSelectedOptionsList = [];
                            const matchedOption = employeeAppliedBy.find(employee => employee.reporting_to === parseInt(reportingTo));
                            if (matchedOption) {
                                preSelectedOptionsList.push({
                                    value: matchedOption.reporting_to, label: matchedOption.reporting_to_name
                                });
                                setAppliedByIdsString.push(matchedOption.reporting_to);
                            }
                            setpreSelectedOptions(preSelectedOptionsList);
                            setAppliedById(setAppliedByIdsString);
                        }

                    }
                    //****************************************** */
                    const subdepartmentID = selectedEmployee.sub_department_id;
                    const departmentID = selectedEmployee.department_id;
                    setDepartmentId(departmentID);
                    setsubDepartmentId(subdepartmentID)

                    await FnComboOnchange('employee_baseDeparmentAndType');
                }
                const date = formatDate(document.getElementById('dt_leaves_requested_to_date').value)

                FnComboOnchange('leave_To_date', date);
                break;

            case 'employee_baseDeparmentAndType':

                const selectedEmployeeField = employeeComboRef.current?.field_id;
                const selectedEmployees = employeeAppliedBy.find(employee => employee.field_name === selectedEmployeeField);
                let subdepartmentID;
                let departmentID;
                if (selectedEmployees) {
                    subdepartmentID = selectedEmployees.sub_department_id;
                    departmentID = selectedEmployees.department_id;
                    setDepartmentId(departmentID);
                    setsubDepartmentId(subdepartmentID);
                }
                if (departmentID === '' || departmentID === null || departmentID === undefined) {
                    departmentID = document.getElementById('txt_department_id').value;
                }
                if (subdepartmentID === '' || subdepartmentID === null || subdepartmentID === undefined) {
                    subdepartmentID = document.getElementById('txt_sub_department_id').value;
                }
                const employee_type = document.getElementById('cmb_employee_type').value;
                $('#error_leaves_applied_days').hide();

                if (employee_type !== "" && departmentID !== "") {
                    resetGlobalQuery();
                    // var employeeID = $('#cmb_employee_id').val();
                    var employeeID = employeeComboRef.current?.field_id;
                    globalQuery.columns = ['field_id', 'field_name', 'department_name'];
                    globalQuery.table = "cmv_employee_list";
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: subdepartmentID });
                    globalQuery.conditions.push({ field: "department_id", operator: "=", value: departmentID });
                    globalQuery.conditions.push({ field: "employee_type", operator: "=", value: employee_type });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    const reportingToListApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                    // setReportingToListOption(reportingToListApiCall);
                    const filteredReportingToList = reportingToListApiCall.filter(item => item.field_id !== parseInt(employeeID));

                    // Update the state with the filtered list
                    setReportingToListOption(filteredReportingToList);



                    resetGlobalQuery();
                    globalQuery.columns = ['field_id', 'field_name', 'reporting_to', 'reporting_to_name'];
                    globalQuery.table = "cmv_employee_list";
                    // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "employee_type", operator: "=", value: "Staff" });
                    globalQuery.conditions.push({ field: "is_active", operator: "=", value: 1 });

                    const employeeListId = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                    const filteReporting = employeeListId.filter(item => item.field_id !== parseInt(employeeID));
                    setEmployeeListOption(filteReporting);

                }
                break;



            
            case 'leave_To_date':
                debugger
                $(`#error_dt_leaves_requested_to_date`).hide();
                // var emplCode = $('#cmb_employee_id option:selected').attr('empCode');
                if (document.getElementById('txt_employee_code').value !== "") {
                    const employeeCode = document.getElementById('txt_employee_code').value
                    // if (emplCode !== "") {
                    //     const employeeCode = emplCode
                    const leaveRequestedFromDate = formatDate(document.getElementById('dt_leaves_requested_from_date').value)
                    const leaveRequestedToDate = convertDate(event)
                    const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmLeavesApplications/FnShowExisitingCount/${employeeCode}/${leaveRequestedFromDate}/${leaveRequestedToDate}`)
                    const response = await apiCall.json();
                    const count = response.ShowExisitingCount.exsitingCount
                    setExistingCount(count)
                    if (count !== 0 && keyForViewUpdate === 'add') {
                        $(`#error_dt_leaves_requested_to_date`).text(`Application Is Allready Exist.`);
                        $(`#error_dt_leaves_requested_to_date`).show();
                    } else {
                        $(`#error_dt_leaves_requested_to_date`).hide();
                        

                    }
                } debugger
                validatedatetimeFields('leave_date');
                break;
            case 'leave_status':
                const leave_Status = document.getElementById('cmb_leave_status').value;
                if (leave_Status === "Rejected" || leave_Status === "Pending") {
                    setLeavesSanctionDays(0);
                    setLeavesRejectionDays(leaves_applied_days);
                }

                break;
            case 'leaveAppliedDays':
                const value = event.target.value;
                const regex = /^(\d+(\.5)?)?$/; // Regular expression to match allowed values

                // Allow empty value and valid regex matches
                if (value === '' || regex.test(value)) {
                    setLeavesAppliedDays(value);
                }
                break;
            default:
                break;
        }

    };

   


    const validatedatetimeFields = async (key, date) => {
        debugger
        const startLeavesDate = parseDate(document.getElementById('dt_leaves_requested_from_date').value);
        const endLeavesDate = parseDate(document.getElementById('dt_leaves_requested_to_date').value);
        const startApproveDateTime = document.getElementById('dt_leaves_approved_from_date').value;
        // const endApproveDateTime = document.getElementById('dt_leaves_approved_to_date').value;
        switch (key) {
            case 'leave_date':
                if (startLeavesDate !== "") {
                    if (endLeavesDate !== "") {
                        if (startLeavesDate > endLeavesDate) {
                            $(`#error_dt_leaves_requested_from_date`).text(`Leave To Date should be greater than Leave From Date`);
                            $(`#error_dt_leaves_requested_from_date`).show();
                        } else {
                            $(`#error_dt_leaves_requested_from_date`).hide();
                        }
                    }
                }
                break;
            case 'leave_Fromdate':
               const startApproveDateTime = new Date(date);
                const endApproveDateTimesStr = document.getElementById('dt_leaves_approved_to_date').value;
                const endApproveDateTimes = parseDate(endApproveDateTimesStr);
                if (startApproveDateTime !== "" && endApproveDateTimes !== "") {
                    if (startApproveDateTime > endApproveDateTimes) {
                        setLeavesApprovedFromDate(startLeavesDate);
                        calculateApproveDays(startApproveDateTime, endApproveDateTimes);

                    } else {
                        calculateApproveDays(startApproveDateTime, endApproveDateTimes);
                    }

                }
                break;
            case 'approve_date':
                const startApproveDateTimes = parseDate(document.getElementById('dt_leaves_approved_from_date').value);
                const endApproveDateTime = new Date(date);
                if (startApproveDateTimes !== "" && endApproveDateTime !== "" && startApproveDateTimes >= startLeavesDate && endApproveDateTime <= endLeavesDate) {
                    $(`#error_dt_leaves_approved_to_date`).hide();
                    setLeavesApprovedFromDate(startApproveDateTimes);
                    setLeavesApprovedToDate(endApproveDateTime);
                    calculateApproveDays(startApproveDateTimes, endApproveDateTime);
                } else {
                    debugger
                   setLeavesApprovedFromDate(startLeavesDate);
                    setLeavesApprovedToDate(endLeavesDate);
                    calculateApproveDays(startLeavesDate, endLeavesDate);
                };
                break;
        }
    }

    //Fn for render Leaves Details static table 
    

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmLeavesApplications/FnShowParticularRecordForUpdate/${COMPANY_ID}/${leavesId}`)
            const response = await apiCall.json();
            const leaveBalance = response.leaveBalanceData;
            const { leaves_transaction_id,
                leaves_applications_id,
                leaves_application_date,
                employee_type,
                employee_id,
                employee_code,
                department_id,
                sub_department_id,
                leave_type_id,
                leaves_requested_from_date,
                leaves_requested_to_date,
                leaves_approved_from_date,
                leaves_approved_to_date,
                leaves_applied_days,
                leaves_sanction_days,
                leaves_rejection_days,
                work_handover_id,
                approved_date,
                applied_by_id,
                leave_status,
                leave_approve_remark,
                leave_reason,
                reporting_to,
                leave_sandwich,
                punch_code,
                is_active, approved_by_id } = response.data;
            // const employeeType = document.getElementById('cmb_employee_type').value;
            resetGlobalQuery();
            // setEmployeeCode('');
            setEmployeeName('');
            setDepartmentId('');
            setsubDepartmentId('');
            setReportingTo('');
            setWorkHandoverId('');
            //****************************************** */
            globalQuery.columns = ['field_id', 'field_name', 'employee_code', 'department_name', 'reporting_to_name', 'reporting_to', 'department_id', 'sub_department_id'];
            globalQuery.table = "cmv_employee";
            // globalQuery.conditions.push({ field: "employee_type", operator: "=", value: employee_type });
            globalQuery.conditions.push({ field: "is_active", operator: "=", value: 1 });
            const getAppliedByApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);


            setLeavesTransactionId(leaves_transaction_id)
            setApplicationDate(leaves_application_date)
            setTransactionId(leaves_applications_id)
            setSanctionById(approved_by_id);
            setEmployeeType(employee_type);
            await FnComboOnchange('employee_type');
            setEmployeeName(employee_id);
            employeeComboRef.current.field_id = employee_id
            employeeComboRef.current.old_employee_code = punch_code
            setEmployeeCode(employee_code);
            await FnComboOnchange('employee_code');
            setDepartmentId(department_id);
            setsubDepartmentId(sub_department_id);
            setAppliedById(applied_by_id);


            //****************************************** */
            let splitParts = applied_by_id.split(','); // Split the string into an array
            // Initialize an empty array
            let setAppliedByIdsString = [];
            let preSelectedOptionsList = [];
            // Populate the array with the split parts
            splitParts.forEach(element => {
                const matchedOption = getAppliedByApiCall.find(employee => employee.field_id === parseInt(element));
                if (matchedOption) {
                    preSelectedOptionsList.push({
                        value: matchedOption.field_id, label: matchedOption.field_name
                    });
                    setAppliedByIdsString.push(matchedOption.field_id);

                }
            });

            setpreSelectedOptions(preSelectedOptionsList);
            setAppliedById(setAppliedByIdsString);
            //****************************************** */
            setReportingTo(reporting_to);
            setLeaveTypeId(leave_type_id);
          
            setLeavesRequestedFromDate(leaves_requested_from_date)
            setLeavesRequestedToDate(leaves_requested_to_date)
            setLeaveSandwich(leave_sandwich);
            setLeaveStatus(leave_status);
            if (leave_status === "Pending") {
                setLeavesSanctionDays(0);
                setLeavesRejectionDays(leaves_applied_days);
            }
            if (keyForViewUpdate === "approve") {
                setLeavesApprovedFromDate(leaves_requested_from_date);
                setLeavesApprovedToDate(leaves_requested_to_date);
                setApprovedDate(today);
                setLeaveStatus("Approved")
            } else {
                setLeavesApprovedFromDate(leaves_approved_from_date);
                setLeavesApprovedToDate(leaves_approved_to_date);
                setApprovedDate(approved_date);
            }
            setLeavesSanctionDays(leaves_sanction_days);
            if (keyForViewUpdate === "cancel") {
                
                setLeavesSanctionDays(0);
                setSanctionById('');
                setLeavesRejectionDays(0);
                setLeaveStatus("Cancelled")
                setApprovedDate('');
            } else {
                calculateApproveDays(leaves_requested_from_date, leaves_requested_to_date);

            }
            if (keyForViewUpdate === "view") {
                setLeavesSanctionDays(leaves_sanction_days);
            }
            if (keyForViewUpdate === "update") {
                setLeavesSanctionDays(0);
                setSanctionById('');
                setApprovedDate('');
            }
            setLeavesAppliedDays(leaves_applied_days);
            setLeavesRejectionDays(leaves_rejection_days);
            setWorkHandoverId(work_handover_id);
            setRemark(leave_approve_remark.trim());
            setLeaveReason(leave_reason);

            setIsActive(is_active);
            // setClosingBalance(leaveBalance?.closing_balance)

            setIsActive(is_active);
            



        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }
    const validateApproval = () => {
        let isValid = true;

        if (!defaultSelectedOptions || defaultSelectedOptions.length === 0) {
            $(`#error_applied_by_id`).text(`Please select at least one approval option..`);
            $(`#error_applied_by_id`).show();
            isValid = false;
        } else {
            $(`#error_applied_by_id`).hide();
        }

        
        const leave_reason = document.getElementById('txt_leave_reason').value;
        if (!leave_reason || leave_reason === "") {
            $(`#error_txt_leave_reason`).text(`Please Fill this Field..`);
            $(`#error_txt_leave_reason`).show();
            isValid = false;
        } else {
            $(`#error_txt_leave_reason`).hide();
        }

        return isValid;
    };


    const leavesApplicationData = async () => {
        debugger
        try{
        const leaveAppliedDays = parseFloat(document.getElementById('leaves_applied_days').value);
        setIsLoading(true)
        let checkIsValidate = false;
        if (keyForViewUpdate === "approve") {
            checkIsValidate = await frmValidation.current.validateForm("ApproveForm");
        } else if (keyForViewUpdate === "add" || keyForViewUpdate === "update") {
            const leavesDetailsFormValid = await frmValidation.current.validateForm("leavesDetailsFormId");
            // const leaveFormValid = await frmValidation.current.validateForm("leaveForm");

            // Check if any of the validations fail
            if (!leavesDetailsFormValid) {
                checkIsValidate = false;
            } else {
                checkIsValidate = true;
            }
        }
        
        const date = formatDate(document.getElementById('dt_leaves_requested_to_date').value)
        if (existingCount !== 0 && keyForViewUpdate === "add") {
            FnComboOnchange('leave_To_date', date);
            return false;
        }
        if (keyForViewUpdate === "cancel") {
            const leave_approve_remark = document.getElementById('txt_leave_approve_remark').value.trim();

            if (leave_approve_remark === '') {
                $(`#error_txt_leave_approve_remark`).text(`Please fill this field.`);
                $(`#error_txt_leave_approve_remark`).show();
                checkIsValidate = false;
            } else {
                $(`#error_txt_leave_approve_remark`).hide();
                checkIsValidate = true;
            }

        }

        const isValid = validateApproval();
        if (checkIsValidate && isValid) {
            let approval = applied_by_id.join(',');

            try {
                debugger
                const leavesApplicationData = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    leaves_application_date: dt_leaves_application_date,
                    leaves_applications_id: txt_leaves_applications_id,
                    leaves_transaction_id: leaves_transaction_id,
                    employee_code: txt_employee_code,
                    // employee_code: $('#cmb_employee_id option:selected').attr('empCode'),
                    employee_type: cmb_employee_type,
                    // employee_id: cmb_employee_id,
                    employee_id: employeeComboRef.current?.field_id,
                    // employee_id :employeeComboRef.current?.field_id ?? UserId,
                    department_id: txt_department_id,
                    sub_department_id: txt_sub_department_id,
                    leave_type_id: "11",
                    leaves_requested_from_date: convertDate(dt_leaves_requested_from_date),
                    created_by: UserName,
                    leaves_requested_to_date: convertDate(dt_leaves_requested_to_date),
                    financial_year: FINANCIAL_SHORT_NAME,
                    is_active: chk_isactive,
                    leave_sandwich: chk_isLeavesandwich,
                    leaves_approved_from_date: convertDate(dt_leaves_approved_from_date),
                    leaves_approved_to_date: convertDate(dt_leaves_approved_to_date),
                    leaves_applied_days: leaves_applied_days,
                    leaves_sanction_days: txt_leaves_sanction_days,
                    leaves_rejection_days: txt_leaves_rejection_days,
                    work_handover_id: txt_work_handover_id,
                    approved_date: dt_approved_date,
                    // applied_by_id: applied_by_id,
                    // applied_by_id: (applied_by_id === null || applied_by_id === "") ? UserId : applied_by_id,
                    applied_by_id: (approval === null || approval === "") ? UserId : approval,

                    leave_status: cmb_leave_status,
                    leave_approve_remark: txt_leave_approve_remark.trim(),
                    leave_reason: txt_leave_reason,
                    // approved_by_id: txt_sanction_by_id,
                    approved_by_id: (txt_sanction_by_id === null || txt_sanction_by_id === "") ? UserId : txt_sanction_by_id,
                    reporting_to: reporting_to,
                    modified_by: leaves_transaction_id === 0 ? null : UserName,
                    // punch_code: $('#cmb_employee_id option:selected').attr('punching_code'),old_employee_code
                    punch_code: employeeComboRef.current?.old_employee_code,
                    short_company: SHORT_COMPANY,
                    short_financial_year: SHORT_FINANCIAL_YEAR,

                }

                console.log(leavesApplicationData);
                if (keyForViewUpdate !== "approve") {
                    leavesApplicationData.leaves_approved_from_date = '';
                    leavesApplicationData.leaves_approved_to_date = '';
                    leavesApplicationData.approved_date = '';
                    leavesApplicationData.approved_by_id = '';
                }

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leavesApplicationData)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmLeavesApplications/FnAddUpdateRecord/${ApproveFlag}`, requestOptions)
                const resp = await apicall.json()
                console.log(resp);
                if (resp.success === 2) {
                    setErrMsg(resp.error)
                    setShowWarningMsgModal(true)
                } else if (resp.success === 0) {
                    setErrMsg(resp.error);
                    setShowErrorMsgModal(true)
                } else if (resp.success === 1) {
                    setIsActive(true);
                    console.log("resp: ", resp);
                    setSuccMsg(resp.message);
                    setShowSuccessMsgModal(true);
                }
                
            } catch (error) {
                console.log("error: ", error)
                navigate('/Error')
            }
        }
    }
    finally{
        setIsLoading(false)
    }
    }

    const handleDateChange = (key, date) => {

        switch (key) {

            case 'dt_leaves_requested_from_date':
                const dt_leaves_requested_from_date = document.getElementById('dt_leaves_requested_from_date').value;
                const dt_leaves_requested_to_dates = document.getElementById('dt_leaves_requested_to_date').value;
                if (dt_leaves_requested_from_date !== '') {
                    $('#error_dt_leaves_requested_from_date').hide();
                    // setLeavesRequestedFromDate(date);
                    calculateAppliedDays('dt_leaves_requested_from_date', date);
                    FnComboOnchange('leave_To_date', date);
                    const formattedFromDate = date ? date.toLocaleDateString('en-CA') : '';
                    if (formattedFromDate !== '') { document.getElementById('error_dt_leaves_requested_from_date').style.display = 'none'; }
                    setLeavesRequestedFromDate(formattedFromDate);
                    // If the start date is set after the end date, clear the end date
                    let formattedToDate = dt_leaves_requested_to_dates.split("-").reverse().join("-");

                    if (new Date(formattedFromDate) > new Date(formattedToDate)) {
                        setLeavesRequestedToDate('');
                    }
                }
                break;
            case 'dt_leaves_requested_to_date':

                const dt_leaves_requested_to_date = document.getElementById('dt_leaves_requested_to_date').value;

                // if (dt_leaves_requested_to_date !== '') {
                $('#error_dt_leaves_requested_to_date').hide();
                // setLeavesRequestedToDate(date);
                calculateAppliedDays('dt_leaves_requested_to_date', date);
                FnComboOnchange('leave_To_date', date);
                const formattedToDate = date ? date.toLocaleDateString('en-CA') : '';
                if (formattedToDate !== '') { document.getElementById('error_dt_leaves_requested_to_date').style.display = 'none'; }
                setLeavesRequestedToDate(formattedToDate)
                // }
                break;
            case 'dt_leaves_approved_to_date':
                debugger
                const dt_leaves_approved_to_date = document.getElementById('dt_leaves_approved_to_date').value;

                if (dt_leaves_approved_to_date !== '') {
                    $('#error_dt_leaves_approved_to_date').hide();
                    setLeavesApprovedToDate(date);
                    validatedatetimeFields('approve_date', date);
                }
                break;
            case 'dt_leaves_approved_from_date': debugger
                const dt_leaves_approved_from_date = document.getElementById('dt_leaves_approved_from_date').value;

                if (dt_leaves_approved_from_date !== '') {
                    $('#error_dt_leaves_approved_from_date').hide();
                    setLeavesApprovedFromDate(date);
                    validatedatetimeFields('leave_Fromdate', date);
                }
                break;
            case 'dt_approved_date':
                const dt_approved_date = document.getElementById('dt_approved_date').value;

                if (dt_approved_date !== '') {
                    $('#error_dt_approved_date').hide();
                    setApprovedDate(date);
                }
                break;

            default:
                break;
        }
    }
    const handleSelectoptions = (selectedOptions) => {
        if (selectedOptions.length === 0) {

            $(`#error_applied_by_id`).text(`Please select at least one approval option..`);
            $(`#error_applied_by_id`).show();
        } else {
            $(`#error_applied_by_id`).hide();

        }              // Update the selected options state
        setpreSelectedOptions(selectedOptions);

        // Extract the values (field_ids) from the selected options
        const fieldIds = selectedOptions.map(option => option.value);

        // Update the applied_by_id state or perform other actions
        setAppliedById(fieldIds);

        // Any additional logic you want to implement
        console.log('Selected Options:', selectedOptions);
    };

    return (
        <>
            <ComboBox ref={comboDataAPiCall} />
            <ComboBox ref={combobox} />
            <FrmValidations ref={validate} />
            <GenerateTAutoNo ref={generateAutoNoAPiCall} />
            <ValidateNumberDateInput ref={validateNumberPercentInput} />
            <FrmValidations ref={frmValidation} />

            {isLoading ?
                    <div className="spinner-overlay"  >
                      <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span id="spinner_text" className="text-dark">Loading...</span>
                      </div>
                    </div> :
                    null}
            <div>
                <div className="erp_top_Form">
                    <div className='card p-1'>
                        <div className='card-header text-center py-0'>
                            <label className='erp-form-label-lg main_heding'>Official Journey Application {actionType}</label>
                        </div>
                        <form id='leavesDetailsFormId'>
                            <div className="row erp_transporter_div ">
                                <div className="col-sm-4 erp_form_col_div">
                                    <div className="col-sm-12 erp_form_col_div">
                                        <div className="row">
                                            <div className="col-sm-4 col-12">
                                                <Form.Label className="erp-form-label"> Transactions Id <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <Form.Control type="text" id="txt_leaves_applications_id" className="erp_input_field" value={txt_leaves_applications_id} onChange={e => { setTransactionId(e.target.value); }} disabled />
                                                <MDTypography variant="button" id="error_txt_leaves_applications_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                </MDTypography>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col" >
                                                <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { FnComboOnchange('employee_type'); setEmployeeType(e.target.value); validateErrorMsgs() }} maxLength="255" disabled>
                                                    {/* <option value="" disabled>Select</option> */}
                                                    {employeeTypeOptions?.map(employeeTypes => (
                                                        <option value={employeeTypes.field_name}>{employeeTypes.field_name}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4 col-12">
                                                <Form.Label className="erp-form-label"> Employee Code & Name  <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col-12 col-md-3 pe-md-0" hidden>
                                                <Form.Control type="text" id="txt_employee_code" className="erp_input_field" value={txt_employee_code} onChange={(e) => { FnComboOnchange('employee_code'); setEmployeeCode(e.target.value); validateErrorMsgs() }} onBlur={(e) => { FnComboOnchange('empl_code'); }} disabled />
                                                {/* onBlur={e => { FnComboOnchange('employee_code'); }} */}
                                                <MDTypography variant="button" id="error_txt_employee_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                </MDTypography>
                                            </div>
                                            <div className="col">
                                                {/* <div className="col-12 col-md-5 pt-md-0 pt-3 ps-md-1"> */}
                                                <Select ref={employeeComboRef}
                                                    options={employeeAppliedBy}
                                                    inputId="cmb_employee_id"
                                                    // isDisabled={['view', 'approve', 'cancel'].includes(keyForViewUpdate) }
                                                    isDisabled={true}
                                                    value={employeeAppliedBy.find(option => option.value == cmb_employee_id)}
                                                    onChange={(selectedOpt) => {
                                                        setEmployeeName(selectedOpt.value);
                                                        employeeComboRef.current = selectedOpt;
                                                        FnComboOnchange('employee_name');
                                                        validateErrorMsgs();
                                                    }}

                                                    placeholder="Search for a employee..."
                                                    className="form-search-custom"
                                                    classNamePrefix="custom-select"
                                                    styles={{
                                                        option: (provided, state) => ({ ...provided, fontSize: '12px' }),
                                                        singleValue: (provided, state) => ({ ...provided, fontSize: '12px' }),
                                                        input: (provided, state) => ({ ...provided, fontSize: '12px' }),
                                                    }}
                                                />
                                                <MDTypography variant="button" id="error_cmb_employee_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label"> Journey From <span className="required">*</span></Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <DatePicker selected={dt_leaves_requested_from_date} id="dt_leaves_requested_from_date" onChange={(date) => {
                                                            handleDateChange('dt_leaves_requested_from_date', date);
                                                        }} onBlur={e => { calculateAppliedDays(); }} disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'approve' || keyForViewUpdate === 'view'}
                                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                                            selectsStart
                                                            startDate={dt_leaves_requested_from_date ? new Date(dt_leaves_requested_from_date) : null}
                                                            endDate={dt_leaves_requested_to_date ? new Date(dt_leaves_requested_to_date) : null}
                                                        />
                                                        <MDTypography variant="button" id="error_dt_leaves_requested_from_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                        
                                    </div>
                                </div>
                                {/* second column */}
                                <div className="col-sm-4 erp_form_col_div">
                                    <div className="col-sm-12 erp_form_col_div">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Department Name<span className="required">*</span></Form.Label>
                                            </div>

                                            <div className="col">
                                                <select id="txt_department_id" className="form-select form-select-sm" value={txt_department_id} onChange={e => { setDepartmentId(e.target.value); validateErrorMsgs() }} maxLength="20" disabled>
                                                    <option value="" disabled>Select</option>
                                                    {departmentopt.map(department => (
                                                        <option value={department.field_id}>{department.field_name}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_txt_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Sub Dpt. Name<span className="required">*</span></Form.Label>
                                            </div>

                                            <div className="col">
                                                <select id="txt_sub_department_id" className="form-select form-select-sm" value={txt_sub_department_id} onChange={e => { setsubDepartmentId(e.target.value); validateErrorMsgs() }} disabled>
                                                    <option value="" disabled>Select</option>
                                                    {subdepartmentopt.map(department => (
                                                        <option value={department.field_id}>{department.field_name}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_txt_sub_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Status <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <Form.Control as="select" id="cmb_leave_status" className="form-select form-select-sm" value={cmb_leave_status} onChange={e => { setLeaveStatus(e.target.value); FnComboOnchange('leave_status'); }} disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'approve'} maxLength="255" required>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </Form.Control>
                                                <MDTypography variant="button" id="error_cmb_leave_status" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label"> Journey To <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <DatePicker selected={dt_leaves_requested_to_date} id="dt_leaves_requested_to_date"
                                                    onChange={(date) => { handleDateChange('dt_leaves_requested_to_date', date); }}
                                                    // onBlur={e => { FnComboOnchange('leave_type'); }}
                                                    disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'approve' || keyForViewUpdate === 'view'}
                                                    dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                                    selectsEnd
                                                    startDate={dt_leaves_requested_from_date ? new Date(dt_leaves_requested_from_date) : null}
                                                    endDate={dt_leaves_requested_to_date ? new Date(dt_leaves_requested_to_date) : null}
                                                    minDate={dt_leaves_requested_from_date ? new Date(dt_leaves_requested_from_date) : null}
                                                />
                                                <MDTypography variant="button" id="error_dt_leaves_requested_to_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4 erp_form_col_div">
                                    <div className="col-sm-12 erp_form_col_div">
                                      
                                        {/* //******************************************  */}
                                        <div className="row">

                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Approval<span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <Select
                                                    value={defaultSelectedOptions} // Use value to control the selected options
                                                    type='select-one'
                                                    id='applied_by_id'
                                                    isMulti
                                                    name="approval"
                                                    options={appliedAllEmployee?.map((employeename) => ({
                                                        value: employeename.field_id,
                                                        label: employeename.field_name,
                                                    }))}

                                                    isDisabled={!employeeAppliedBy.filter(emp => emp.employee_code === txt_employee_code).some(
                                                        (item) =>
                                                            item.reporting_to === null ||
                                                            item.reporting_to === undefined ||
                                                            item.reporting_to === ""
                                                    )}
                                                    onChange={handleSelectoptions}

                                                    styles={{
                                                        option: (provided) => ({
                                                            ...provided,
                                                            fontSize: '12px', // Adjust the font size as per your requirement
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            fontSize: '12px', // Adjust the font size as per your requirement
                                                        }),
                                                        input: (provided) => ({
                                                            ...provided,
                                                            fontSize: '10px', // Adjust the font size as per your requirement
                                                        }),
                                                        multiValue: (provided) => ({
                                                            ...provided,
                                                            fontSize: '10px', // Adjust the font size of selected values (tags)
                                                        }),
                                                        multiValueLabel: (provided) => ({
                                                            ...provided,
                                                            fontSize: '10px', // Adjust the font size of selected value labels
                                                        }),
                                                        control: (provided) => ({
                                                            ...provided,
                                                            fontSize: '12px', // Adjust the font size for the input control
                                                        }),
                                                    }}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                                <MDTypography variant="button" id="error_applied_by_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                        {/* //****************************************** */}
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Reporting To <span className="required">*</span></Form.Label>
                                            </div>

                                            <div className="col">
                                                <select id="reporting_to" className="form-select form-select-sm" value={reporting_to} onChange={e => { setReportingTo(e.target.value); validateErrorMsgs(); }} maxLength="255"
                                                    disabled={!employeeAppliedBy.filter(emp => emp.employee_code === txt_employee_code).some(
                                                        (item) =>
                                                            item.reporting_to === null ||
                                                            item.reporting_to === undefined ||
                                                            item.reporting_to === ""
                                                    )}>
                                                    <option value="" disabled>Select</option>
                                                    {employeeListId?.map(report => (
                                                        <option value={report.field_id}>{report.field_name}</option>
                                                    ))}
                                                </select>

                                                <MDTypography variant="button" id="error_reporting_to" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label"> Journey Reason <span className="required">*</span> </Form.Label>
                                            </div>
                                            <div className="col">
                                                <Form.Control as="textarea" id="txt_leave_reason" className="erp_txt_area optional" value={txt_leave_reason} onChange={e => { setLeaveReason(e.target.value); validateErrorMsgs() }} maxlength="500" />
                                                <MDTypography variant="button" id="error_txt_leave_reason" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label"> Applied Days <span className="required">*</span></Form.Label>
                                            </div>

                                            <div className="col">
                                                <Form.Control type="number" id="leaves_applied_days" className="erp_input_field" value={leaves_applied_days} onChange={(e) => { FnComboOnchange('leaveAppliedDays', e); validateErrorMsgs() }} disabled />
                                            </div>
                                            <MDTypography variant="button" id="error_leaves_applied_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>


                        {/* <hr></hr> */}
                        {/* <Card className="mb-4">
                            <Card.Body> */}

                        <div className="card" style={{ display: keyForViewUpdate === "approve" || keyForViewUpdate === "view" || keyForViewUpdate === "cancel" ? "block" : "none" }}>
                            <div className="card-header py-0 main_heding mb-0">
                                <label className="erp-form-label-md-lg">
                                    Business Travel Approve Details
                                </label>
                            </div>
                            {/* Card's Body Starts*/}
                            <div className="card-body p-0">
                                <form id="ApproveForm">
                                    {/* <div class="erp-form-label-lg">Leaves Approve Details</div> */}
                                    <div className="row erp_transporter_div ">
                                        <div className="col-sm-4 erp_form_col_div">
                                            <div className="col-sm-12 erp_form_col_div">
                                                <div className="row">

                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label">Approve by <span className="required">*</span></Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <select id="txt_sanction_by_id" className="form-select form-select-sm" value={txt_sanction_by_id} onChange={e => { setSanctionById(e.target.value); validateForm() }} maxLength="255" disabled>
                                                            <option value="">Select</option>
                                                            {approvedByOptions?.map(employeeTypes => (
                                                                <option value={employeeTypes.field_id}>{employeeTypes.field_name}</option>
                                                            ))}
                                                        </select>
                                                        <MDTypography variant="button" id="error_txt_sanction_by_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label"> Approve From <span className="required">*</span></Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <DatePicker selected={dt_leaves_approved_from_date} id="dt_leaves_approved_from_date" onChange={(date) => {
                                                            handleDateChange('dt_leaves_approved_from_date', date);
                                                        }} disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'view'}
                                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                                            selectsStart
                                                            startDate={dt_leaves_approved_from_date ? new Date(dt_leaves_approved_from_date) : null}
                                                            endDate={dt_leaves_approved_to_date ? new Date(dt_leaves_approved_to_date) : null}
                                                            minDate={dt_leaves_requested_from_date}
                                                            maxDate={dt_leaves_requested_to_date}
                                                        />
                                                        <MDTypography variant="button" id="error_dt_leaves_approved_from_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label"> Approve To <span className="required">*</span></Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <DatePicker selected={dt_leaves_approved_to_date} id="dt_leaves_approved_to_date" onChange={(date) => {
                                                            handleDateChange('dt_leaves_approved_to_date', date);
                                                        }} disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'view'}
                                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                                            selectsEnd
                                                            startDate={dt_leaves_approved_from_date ? new Date(dt_leaves_approved_from_date) : null}
                                                            endDate={dt_leaves_approved_to_date ? new Date(dt_leaves_approved_to_date) : null}
                                                            minDate={dt_leaves_approved_from_date ? new Date(dt_leaves_approved_from_date) : null}
                                                            maxDate={dt_leaves_requested_to_date}
                                                        />
                                                        <MDTypography variant="button" id="error_dt_leaves_approved_to_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 erp_form_col_div">
                                            <div className="col-sm-12 erp_form_col_div">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label">Approve Days <span className="required">*</span></Form.Label>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <Form.Control type="text" id="txt_leaves_sanction_days" className="erp_input_field text-end" value={txt_leaves_sanction_days} onChange={(e) => { setLeavesSanctionDays(e.target.value); validateForm() }} disabled={keyForViewUpdate === 'cancel' || keyForViewUpdate === 'approve'} />
                                                        <MDTypography variant="button" id="error_txt_leaves_sanction_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                        </MDTypography>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label">Rejected Days <span className="required">*</span></Form.Label>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <Form.Control type="text" id="txt_leaves_rejection_days" className="erp_input_field text-end" value={txt_leaves_rejection_days} onChange={(e) => { setLeavesRejectionDays(e.target.value); validateForm() }} disabled />
                                                        <MDTypography variant="button" id="error_txt_leaves_rejection_days" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                               

                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label"> Approve Date <span className="required">*</span></Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <DatePicker selected={dt_approved_date} id="dt_approved_date" onChange={(date) => {
                                                            handleDateChange('dt_approved_date', date);
                                                        }} disabled
                                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" />
                                                        <MDTypography variant="button" id="error_dt_approved_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 erp_form_col_div">
                                            <div className="col-sm-12 erp_form_col_div">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label">{remarkLable} Remark  </Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <Form.Control as="textarea" id="txt_leave_approve_remark" className="erp_txt_area optional" value={txt_leave_approve_remark} onChange={e => { setRemark(e.target.value); validateForm() }} maxlength="500" optional="optional" />
                                                        <MDTypography variant="button" id="error_txt_leave_approve_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                        </MDTypography>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
                                                    </div>
                                                    <div className="col">
                                                        <div className="erp_form_radio">
                                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive} onClick={() => { setIsActive(true); }} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'add' || keyForViewUpdate === 'update' || keyForViewUpdate === 'cancel'} /> </div>
                                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={!chk_isactive} onClick={() => { setIsActive(false); }} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'add' || keyForViewUpdate === 'update' || keyForViewUpdate === 'cancel'} /> </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {/* </Card.Body>
                        </Card> */}
                            </div>
                        </div>
                        <div className="row col-12">
                            <div className="text-center py-0 mb-5 pt-4">
                                <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { navigate(`/Masters/MBusinessTravelApplication/FrmBusiessTravelListing`) }} variant="button"
                                    fontWeight="regular">Back</MDButton>
                                <MDButton type="submit" onClick={() => leavesApplicationData()} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                                    fontWeight="regular">{actionLabel}</MDButton>

                            </div >
                            {/* Success Msg Popup */}
                            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                            {/* Error Msg Popup */}
                            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                            <InfoModal closeModal={() => handleCloseWarnModal()} show={[showWarningMsgModal, errMsg]} />
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}

export default FrmBusinessTravelEntry;