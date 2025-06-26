import { React, useState, useEffect, useRef, useMemo } from "react";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import files
import ComboBox from "Features/ComboBox";
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import ConfigConstants from "assets/Constants/config-constant";
import ExcelExport from "Features/Exports/ExcelExport";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import DatePicker from 'react-datepicker';

// Import React icons
import GenerateTAutoNo from "FrmGeneric/GenerateTAutoNo";
import DepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry";
import Select from 'react-select';

function FrmShiftRosterEntry() {
    // Config Constant
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, COMPANY_NAME, FINANCIAL_SHORT_NAME, UserName } = configConstants;

    //Current date
    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;

    }

    //Loader
    const [isLoading, setIsLoading] = useState(false);

    const [action_Label, setActionLabel] = useState('(Add)');

    //Option Hooks
    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subDepartmentGroupOptions, setSubDepartmentGroupOptions] = useState([]);
    const [shiftOptions, setShiftOptions] = useState([]);
    const [dt_process_date, setProcessDate] = useState(today);
    ///Hooks For Master Data
    const [dt_from_date, setFromDate] = useState();
    const [dt_to_date, setToDate] = useState();
    const [cmb_employee_type, setEmployeeType] = useState('');
    const [cmb_employee_id, setEmployeeId] = useState('');
    const [txt_employee_code, setEmployeeCode] = useState();
    const [cmb_department_id, setDepartmentId] = useState('');
    const [cmb_subdepartment_group_id, setSubDepartmentGroupId] = useState('');
    const [cmb_from_to_shift, setFromToShiftId] = useState('');

    const [cmb_1to15_shift, set1to15ShiftId] = useState('');
    const [cmb_16to31_shift, set16to31ShiftId] = useState('');
    const [cmb_1to31_shift, set1to31ShiftId] = useState('');

    //  Current shift roster
    const [cmb_1to15_current_shift, set1to15CurrentShiftId] = useState('');
    const [cmb_16to31_current_shift, set16to31CurrentShiftId] = useState('');
    const [cmb_1to31_current_shift, set1to31CurrentShiftId] = useState('');

    ////Hooks for table
    const [shiftroosterheaderData, setShiftRoosterHeaderData] = useState([]);
    const [shiftRoosterDetails, setShiftRoosterDetails] = useState([]);
    const [currentShiftRosterDetails, setCurrentShiftRoosterDetails] = useState([]);
    const [chk_rosterType, setRosterType] = useState("Monthly");
    const [shift_roster_id, setShiftRosterId] = useState('')

    //end
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('');
    const cmb_department_id_ref = useRef()
    const cmb_subdepartment_group_id_ref = useRef()
    const cmb_employee_id_ref = useRef();




    // Success Msg HANDLING
    const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');
    const handleCloseErrModal = () => setShowErrorMsgModal(false);

    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    //////useRef Hooks
    const comboBoxRef = useRef();
    const validate = useRef();
    const exlsExp = useRef();

    const validateNumberDateInput = useRef();
    const navigate = useNavigate();
    const generateAutoNoAPiCall = useRef();
    const clearField = () => {
        setProcessDate(today);
        setFromDate('');
        setToDate('');
        setEmployeeType('');
        setEmployeeId('');
        setEmployeeCode('');
        setDepartmentId('');
        setSubDepartmentGroupId('');
        setFromToShiftId('');
        set1to15ShiftId('');
        set16to31ShiftId('');
        set1to31ShiftId('');
        set1to15CurrentShiftId('');
        set16to31CurrentShiftId('');
        set1to31CurrentShiftId('');
        setShiftRosterId('');
        setShiftRoosterDetails([]);
        generateShiftRosterId();
        setRosterType("Monthly");
    }

    useEffect(async () => {
        await FillCombos();
        await generateShiftRosterId();
    }, []);

    // Show ADd record Modal
    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Department':
                await comboBoxesOnChange("DepartmentGroup");
                break;

            case 'Sub Department':
                await comboBoxesOnChange("Department");
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
            case 'Department':
                return <DepartmentEntry btn_disabled={true} />;
            case 'Sub Department':
                return <DepartmentEntry btn_disabled={true} departmentType="S" />;
            default:
                return null;
        }
    }

    // Define the parseDate function
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(year, month - 1, day);  // Month is 0-indexed
    };

    const generateShiftRosterId = async () => {
        try {
            const transactionId = await generateAutoNoAPiCall.current.generateTAutoNo("ht_shift_roster", "roster_id", "", 'SR', "5");
            setShiftRosterId(transactionId);
            return transactionId;
        } catch (error) {
            navigate('/Error')
        }
    }
    const FillCombos = async () => {
        resetGlobalQuery();
        globalQuery.columns = ["field_id", "field_name", "concat(start_time, '-', end_time) AS startEndTime"];
        globalQuery.table = "cmv_shift"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        comboBoxRef.current.fillFiltersCombo(globalQuery).then((shiftsApiCall) => {
            setShiftOptions(shiftsApiCall);
        })

        //Set Employee Options
        comboBoxRef.current.fillComboBox("EmployeeTypeGroup").then((getEmployeeTypeApiCall) => {
            setEmployeeTypeOptions(getEmployeeTypeApiCall);
        })

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name',]
        globalQuery.conditions = [
            { field: "department_type", operator: "=", value: "M" },
            { field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] }
        ]
        globalQuery.table = "cmv_department";
        comboBoxRef.current.fillFiltersCombo(globalQuery).then((deptOptions) => {
            const departmentOptions = [
                { value: '', label: 'Select' },
                { value: 'all', label: 'All' },
                { value: '0', label: 'Add New Record+' },
                ...deptOptions.map((department) => ({ ...department, value: department.field_id, label: department.field_name, })),
            ];
            setDepartmentOptions(departmentOptions);
        });
    }


    const getEmployeeList = async () => {
        try {
            let requestJson = { 'EmployeeShiftRosterData': {} };
            var employeeTypeSelected = $('#cmb_employee_type option:selected').text();

            const departmentIdElement = cmb_department_id_ref.current.value;
            const subDepartmentElement = cmb_subdepartment_group_id_ref.current.value;

            const departmentId = (departmentIdElement === 'all' || departmentIdElement === '') ? null : departmentIdElement;
            const SubDepartmentval = (subDepartmentElement === 'all' || subDepartmentElement === '') ? null : subDepartmentElement;

            const from_to_shift = document.getElementById('cmb_from_to_shift').value;
            const dt_from_date = document.getElementById('dt_from_date').value; // Assuming this element exists


            let dateParts = dt_from_date.split('-');
            let year = parseInt(dateParts[2], 10);
            let month = parseInt(dateParts[1], 10) - 1;
            if (month === 0) {
                month = 12; // If January, wrap to December
                year -= 1;
            }

            if (employeeTypeSelected !== '' && from_to_shift !== '' && dt_from_date !== '' && year !== '' && month !== '') {

                const EmployeeShiftRosterData = {
                    employee_type: employeeTypeSelected,
                    sub_department_id: SubDepartmentval,
                    department_id: departmentId,
                    attendance_year: year,
                    attendance_month: month,
                    shift_id: from_to_shift,
                    company_id: COMPANY_ID
                }
                requestJson.EmployeeShiftRosterData = EmployeeShiftRosterData;

                const formData = new FormData();
                formData.append(`getShiftRosterDetails`, JSON.stringify(requestJson))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };

                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/shiftRoster/FnShowShiftRosterEmployeeData`, requestOptions);

                const response = await apiCall.json();
                const empOptions = [
                    { value: '', label: 'Select' },
                    { value: 'all', label: 'All' },
                    ...response.map((emp) => ({ ...emp, value: emp.field_id, label: `[${emp.old_employee_code}] [${emp.employee_code}] ${emp.field_name}` })),
                ]

                setEmployeeOptions(empOptions);

                setEmployeeId('');
                setEmployeeCode('');
            }
        } catch (error) {
            console.error('Error fetching employee list:', error);
            $('#error_cmb_employee_id').text('Error fetching data').css({ 'display': 'block', 'padding-top': '8px' });
        }
    }




    // Fill the combo boxes from property table.
    const comboBoxesOnChange = async (key) => {
        try {

            $('#error_cmb_employee_id').hide();
            switch (key) {
                case 'Employee_type':
                    setShiftRoosterDetails([]);
                    setEmployeeOptions([]);
                    // setRosterType("Monthly");
                    var empTypeElement = document.getElementById('cmb_employee_type');

                    if (empTypeElement.value !== '') {
                        setEmployeeType(empTypeElement.value);
                        await getEmployeeList();
                    } else if (empTypeElement === '0') {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Employee')
                        setShowAddRecModal(true)
                        setEmployeeId('');
                        setEmployeeCode('');
                    }
                    var employeeTypeGroup = $('#cmb_employee_type').find(":selected").text();
                    resetGlobalQuery();
                    globalQuery.columns = ["field_id", "field_name", "concat(start_time, '-', end_time) AS startEndTime"];
                    globalQuery.table = "cmv_shift"
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "employee_type_group", operator: "=", value: employeeTypeGroup });
                    comboBoxRef.current.fillFiltersCombo(globalQuery).then((shiftsApiCall) => {
                        setShiftOptions(shiftsApiCall);
                    })
                    break;


                case 'Department':
                    setShiftRoosterDetails([]);
                    setEmployeeOptions([]);
                    setRosterType("Monthly");
                    set1to15ShiftId('');
                    set16to31ShiftId('');
                    set1to31ShiftId('');

                    const departmentId = cmb_department_id_ref.current.value;
                    // const departmentId = document.getElementById('cmb_department_id').value;
                    if (departmentId === '0') {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Department')
                        setShowAddRecModal(true)
                        setTimeout(() => {
                            $(".erp_top_Form").eq(0).css("padding-top", "0px");
                        }, 100)
                    }

                    if (departmentId !== "") {
                        setDepartmentId(departmentId);
                        cmb_department_id_ref.current.field_id = departmentId

                        $('#error_department_group_id').hide();
                        try {
                            resetGlobalQuery();
                            globalQuery.columns = ['field_id', 'field_name', 'parent_department_id', 'parent_department']
                            globalQuery.conditions = [
                                { field: "department_type", operator: "=", value: "S" },
                                { field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] }
                            ]
                            if (departmentId !== 'all') {
                                globalQuery.conditions.push({
                                    field: "parent_department_id",
                                    operator: "=",
                                    value: departmentId
                                });
                            }
                            globalQuery.table = "cmv_department";
                            comboBoxRef.current.fillFiltersCombo(globalQuery).then((deptOptions) => {
                                const departmentOptions = [
                                    { value: '', label: 'Select' },
                                    { value: 'all', label: 'All' },
                                    { value: '0', label: 'Add New Record+' },
                                    ...deptOptions.map((department) => ({
                                        ...department, value: department.field_id, label: department.field_name,
                                        parent_department_id: department.parent_department_id, parent_department: department.parent_department
                                    })),
                                ];
                                setSubDepartmentGroupOptions(departmentOptions);
                            });
                            await getEmployeeList();
                            setSubDepartmentGroupId('');
                        } catch (error) {
                            console.log('Error: ' + error);
                        }
                    } else {
                        setSubDepartmentGroupOptions([]);
                        setSubDepartmentGroupId('');

                    }
                    setEmployeeId('');
                    setEmployeeCode('');
                    break;

                case 'SubDepartment':
                    setEmployeeOptions([]);
                    setRosterType("Monthly");
                    setShiftRoosterDetails([]);
                    const SubDepartmentval = cmb_subdepartment_group_id_ref.current.value;
                    // const SubDepartmentval = document.getElementById('cmb_subdepartment_group_id').value;
                    if (SubDepartmentval === '0') {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Sub Department')
                        setShowAddRecModal(true)
                        setTimeout(() => {
                            $(".erp_top_Form").eq(0).css("padding-top", "0px");
                        }, 100)
                    }
                    await getEmployeeList();
                    setEmployeeId('');
                    setEmployeeCode('');
                    break;

                case 'Employee':
                    setShiftRoosterDetails([]);
                    setRosterType("Monthly");
                    const employeeId = cmb_employee_id_ref.current.value;

                    if (employeeId !== "") {
                        setEmployeeId(employeeId);

                    }
                    if (employeeID === "all") {
                        setEmployeeCode('');
                    }
                    break;
                case 'EmplCode':

                    var employeeID = $('#cmb_employee_id').val();
                    if (employeeID !== "") {
                        var employeeCode = $('#cmb_employee_id option:selected').attr('employeeCode');
                        setEmployeeId(employeeID);
                        setEmployeeCode(employeeCode);
                    }
                    break;
                case 'EmployeeCode':
                    setRosterType("Monthly");
                    setShiftRoosterDetails([]);
                    var serachemployeeCode = $('#txt_employee_code').val();
                    setEmployeeCode(serachemployeeCode);

                    let findEmployee = null;

                    if (serachemployeeCode.length >= 3) {
                        console.log('employeeOptions:- ', employeeOptions);
                        findEmployee = employeeOptions.find((employee) => {
                            return (
                                employee?.employee_code === serachemployeeCode ||
                                employee?.field_name?.toLowerCase().includes(serachemployeeCode.toLowerCase()) ||
                                employee?.old_employee_code?.includes(serachemployeeCode)
                            );
                        });

                    }

                    if (findEmployee) {
                        setEmployeeId(findEmployee.field_id);
                    } else {
                        setEmployeeId('');
                    }
                    break;
            }

        } catch (error) {
            console.log("error : ", error)
            navigate('/Error')
        }
    }

    // Function to generate date columns
    const generateDateColumns = (fromDate, toDate) => {
        let currentDate = new Date(fromDate);
        const dateColumns = [];

        while (currentDate <= toDate) {
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dayOfWeekFullName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = `${day}/${month}/${year}`;
            const headerStr = `${day}/${month}`;

            dateColumns.push({
                header: headerStr,
                accessor: dateStr,
                days: dayOfWeek,
                fullDaysName: dayOfWeekFullName,
                day,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateColumns;
    };

    const showShiftRosterDetails = async () => {
        try {
            debugger;
            // Validate form
            const validateForm = await validate.current.validateForm('shiftrosterFormId');
            if (!validateForm) return;

            const fromDate = document.getElementById('dt_from_date').value;
            const toDate = document.getElementById('dt_to_date').value;
            const departmentName = $('#cmb_department_id option:selected').text();
            const employeeID = cmb_employee_id_ref.current.value;

            // Parse dates
            const from_Date = fromDate instanceof Date ? fromDate : parseDate(fromDate);
            const to_Date = toDate instanceof Date ? toDate : parseDate(toDate);

            // Check for valid date range
            if (to_Date < from_Date) {
                document.getElementById('error_dt_from_date').textContent = 'To Date should be greater than From Date';
                document.getElementById('error_dt_from_date').style.display = 'block';
                return;
            } else {
                document.getElementById('error_dt_from_date').style.display = 'none';
            }

            // Prepare date columns
            const dateColumns = generateDateColumns(from_Date, to_Date);
            const dateColumnsForCurrentShift = JSON.parse(JSON.stringify(dateColumns)); // Deep copy to ensure independence

            // Determine shift options
            const shiftOptions = {
                shift1to15: $('#cmb_1to15_shift option:selected').attr('shift_name'),
                shift16to31: $('#cmb_16to31_shift option:selected').attr('shift_name'),
                shift1to31: $('#cmb_1to31_shift option:selected').attr('shift_name'),
                shift1Value: $('#cmb_1to15_shift').val(),
                shift2Value: $('#cmb_16to31_shift').val(),
                shift3Value: $('#cmb_1to31_shift').val(),
                currentShift1to15: $('#cmb_1to15_current_shift option:selected').attr('shift_name'),
                currentShift16to31: $('#cmb_16to31_current_shift option:selected').attr('shift_name'),
                currentShift1to31: $('#cmb_1to31_current_shift option:selected').attr('shift_name'),
                cmb_1to15_current_shift: $('#cmb_1to15_current_shift').val(),
                cmb_16to31_current_shift: $('#cmb_16to31_current_shift').val(),
                cmb_1to31_current_shift: $('#cmb_1to31_current_shift').val(),
            };

            // Prepare shift rooster details and populate shifts
            let { shiftRoosterDetails, currentShiftRoster } = prepareShiftRoosterDetails(employeeID);

            populateShiftDetails(shiftRoosterDetails, dateColumns, shiftOptions, false);
            populateShiftDetails(currentShiftRoster, dateColumnsForCurrentShift, shiftOptions, true);

            // Update state or perform further actions
            setShiftRoosterHeaderData([...dateColumns]);
            setShiftRoosterDetails(shiftRoosterDetails);

            setCurrentShiftRoosterDetails(currentShiftRoster);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Helper function to prepare shift rooster details
    const prepareShiftRoosterDetails = (employeeID) => {
        let shiftRoosterDetails = [];
        let currentShiftRoster = [];

        if (employeeID === 'all') {
            const empOpts = [...employeeOptions];
            empOpts.splice(0, 2); // Removing first two options
            shiftRoosterDetails = [...empOpts];
            currentShiftRoster = JSON.parse(JSON.stringify(empOpts)); // Deep copy to prevent overwrite
        } else {
            shiftRoosterDetails = employeeOptions.filter(employee => employee.field_id === parseInt(employeeID));
            currentShiftRoster = JSON.parse(JSON.stringify(shiftRoosterDetails)); // Deep copy
        }

        return { shiftRoosterDetails, currentShiftRoster };
    };

    // Helper function to populate shift details
    const populateShiftDetails = (details, dateColumns, shiftOptions, isCurrentShift) => {
        const getShiftOption = (day) => {
            if (shiftOptions.shift1to31 !== 'Select') {
                return { Name: shiftOptions.shift1to31, id: shiftOptions.shift3Value };
            } else if (day >= 1 && day <= 15) {
                return { Name: shiftOptions.shift1to15, id: shiftOptions.shift1Value };
            } else {
                return { Name: shiftOptions.shift16to31, id: shiftOptions.shift2Value };
            }
        };

        const getCurrentShiftValue = (day) => {
            if (shiftOptions.shift1to31 !== 'Select') {
                return { Name: shiftOptions.currentShift1to31, id: shiftOptions.cmb_1to31_current_shift };
            } else if (day >= 1 && day <= 15) {
                return { Name: shiftOptions.currentShift1to15, id: shiftOptions.cmb_1to15_current_shift };
            } else {
                return { Name: shiftOptions.currentShift16to31, id: shiftOptions.cmb_16to31_current_shift };
            }
        };

        details.forEach(detail => {
            dateColumns.forEach(columnData => {
                const shiftInfo = isCurrentShift
                    ? getCurrentShiftValue(columnData.day)
                    : getShiftOption(columnData.day);

                // Ensure the original object fields like Name are preserved
                detail[columnData.header] = {
                    ...detail[columnData.header],  // Spread existing data
                    ...shiftInfo,  // Update with shift info
                };
            });
        });
    };


    const renderShiftRosterTable = useMemo(() => {
        if (shiftRoosterDetails.length !== 0) {
            return (
                <>
                    <Table className="erp_table" style={{ display: "block", overflowY: "auto", height: 'auto' }} id="shiftrosterFormId-table" responsive bordered striped>
                        <thead className="erp_table_head">
                            <tr id='headerRowId'>
                                {/* First column for employee_name */}
                                <th className="erp_table_th" rowSpan={2}>Employee Code</th>
                                <th className="erp_table_th" rowSpan={2}>Employee Name</th>
                                <th className="erp_table_th" rowSpan={2}>Department Name</th>

                                {/* Date columns */}
                                {shiftroosterheaderData.map((header, indexOfItem) => (
                                    <th key={indexOfItem} className="erp_table_th" id={`header_${indexOfItem}`}>
                                        {header.header}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {shiftroosterheaderData.map((header, indexOfItem) => (
                                    <th key={indexOfItem} className="erp_table_th" id={`header_${header}`}>
                                        {header.days}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {shiftRoosterDetails?.map((currentObj, rowIndex) => (
                                <tr key={`row_${rowIndex}`} className="sticky-column">
                                    {/* First cell for employee_name */}
                                    <td className='erp_table_td'>{currentObj.employee_code}</td>
                                    <td className='erp_table_td'>{currentObj.field_name}</td>
                                    <td className='erp_table_td'>{currentObj.department_name}</td>
                                    {/* Date cells */}

                                    {shiftroosterheaderData.map((key, index) => (
                                        <td key={key.header} className='erp_table_td'>
                                            {currentObj[key.header]?.Name}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            );
        }
    }, [shiftRoosterDetails]);


    const saveShiftRosterDetails = async () => {
        const validateForm = await validate.current.validateForm('shiftrosterFormId');
        if (validateForm !== true) return;
        let fromDate = document.getElementById('dt_from_date').value;
        let dateParts = fromDate.split('-');

        // Extract the year and month as integers
        let year = parseInt(dateParts[2], 10);   // YYYY part
        let month = parseInt(dateParts[1], 10);  // MM part
        const empType = $('#cmb_employee_type option:selected').text();
        try {
            if (shiftRoosterDetails !== null && shiftRoosterDetails.length !== 0) {
                let requestJson = { 'ShiftRoseterMasterData': {}, 'shiftDetailsData': [], 'currentShiftDetailsData': [] };

                const ShiftRoseterMasterData = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    roster_id: shift_roster_id,
                    process_date: dt_process_date,
                    employee_type: empType,
                    created_by: UserName,
                    attendance_month: month,
                    attendance_year: year,
                    financial_year: FINANCIAL_SHORT_NAME,
                };

                requestJson.ShiftRoseterMasterData = ShiftRoseterMasterData;
                requestJson.shiftDetailsData = shiftRoosterDetails;
                requestJson.currentShiftDetailsData = currentShiftRosterDetails;

                const formData = new FormData();
                formData.append(`getShiftRosterDetails`, JSON.stringify(requestJson))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };

                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/shiftRoster/FnAddUpdateShiftRosterDetails`, requestOptions)
                const response = await apicall.json();

                if (response.success === 0) {
                    setErrMsg(response.error)
                    setShowErrorMsgModal(true)

                } else {
                    setSuccMsg(response.message)
                    setShowSuccessMsgModal(true);
                    clearField();
                }

            }
        } catch (error) {
            console.log('error', error);
        }
    }

    ////Validation starts here
    const validateFields = async () => {
        await validate.current.validateFieldsOnChange('shiftrosterFormId');
    }

    const validatedatetimeFields = (key) => {
        const startFromDate = document.getElementById('dt_from_date').value;
        const endToDate = document.getElementById('dt_to_date').value;

        switch (key) {
            case 'formDate':
                if (startFromDate !== "") {
                    if (endToDate !== "") {
                        if (startFromDate > endToDate) {
                            $(`#error_dt_from_date`).text(` To Date should be greater than From Date`);
                            $(`#error_dt_from_date`).show();
                        } else {
                            $(`#error_dt_from_date`).hide();
                        }
                    }
                }
                break;
            case 'toDate':
                if (startFromDate !== "") {
                    if (endToDate !== "") {
                        if (startFromDate > endToDate) {
                            $(`#error_dt_from_date`).text(` To Date should be greater than  From Date`);
                            $(`#error_dt_to_date`).show();
                        } else {
                            $(`#error_dt_from_date`).hide();
                        }
                    }
                }
                break;

        }
    }

    // ---------------------------- Export2Excel Functionality Start. -------------------------------------

    const ExportToExcel = async () => {
        try {
            setIsLoading(true);
            const headerFormIsValid = await validate.current.validateForm("shiftrosterFormId");
            if (shiftRoosterDetails.length !== 0 && headerFormIsValid) {
                let jsonToExportExcel = {
                    'allData': {},
                    'columns': [],
                    'filtrKeyValue': {},
                    'headings': {},
                    'key': 'bomExport',
                    'editable_cols': []
                };

                shiftroosterheaderData.forEach((column, index) => {
                    if (index === 0) {
                        jsonToExportExcel.columns.push(
                            { "Headers": 'Employee ID', "accessor": 'employee_code' },
                            { "Headers": 'Employee Name', "accessor": 'field_name' },
                            { "Headers": 'Department Name', "accessor": 'department_name' }
                        );
                    }
                    // jsonToExportExcel.columns.push({ "Headers": column.header, "accessor": column.header });
                    jsonToExportExcel.columns.push({ "Headers": `${column.header} (${column.days})`, "accessor": column.header });
                    // jsonToExportExcel.editable_cols.push(index + 1); // Index starts from 0, so increment by 1
                });

                let filtrKeyValue = {};
                const rosterTypeText = chk_rosterType === 'Monthly' ? 'Monthly' : '15 Days';
                filtrKeyValue['0'] = "Shift Roster Id" + ' : ' + $('#shift_roster_id').val()
                filtrKeyValue['1'] = "Employee Type: " + ($('#cmb_employee_type').find(":selected").text().trim() || "") + "(" + cmb_employee_type + ")";
                filtrKeyValue['2'] = cmb_department_id ? "Department Name: " + $('#cmb_department_id').find(":selected").text() + "(" + cmb_department_id + ")" : "Department Name: ";
                filtrKeyValue['3'] = cmb_subdepartment_group_id ? "Sub Department Name:" + $('#cmb_subdepartment_group_id').find(":selected").text() + "(" + cmb_subdepartment_group_id + ")" : "Sub Department Name: ";
                filtrKeyValue['4'] = "From Date" + ' : ' + $('#dt_from_date').val()
                filtrKeyValue['5'] = "To Date" + ' : ' + $('#dt_to_date').val()
                filtrKeyValue['6'] = "Roster Type" + ' : ' + rosterTypeText
                filtrKeyValue['7'] = "From Shift & To Shift" + ' : ' + $('#cmb_from_to_shift').val()
                filtrKeyValue['8'] = "1 to 31 Shift" + ' : ' + $('#cmb_1to31_shift option:selected').text();
                filtrKeyValue['9'] = "1 to 15 Shift" + ' : ' + $('#cmb_1to15_shift option:selected').text();
                filtrKeyValue['10'] = "16 to 31 Shift" + ' : ' + $('#cmb_16to31_shift option:selected').text();
                jsonToExportExcel['filtrKeyValue'] = filtrKeyValue;

                // for (let index = 0; index < shiftRoosterDetails.length; index++) {
                //     jsonToExportExcel['allData'][index] = shiftRoosterDetails[index]

                // }

                for (let index = 0; index < shiftRoosterDetails.length; index++) {
                    const detail = shiftRoosterDetails[index]; // Get the current detail

                    // Create the exportRoster object
                    const exportRoster = {
                        field_id: detail.field_id,
                        field_name: detail.field_name,
                        employee_code: detail.employee_code,
                        department_name: detail.department_name
                    };

                    // Transform the detail's date keys to the required format
                    Object.keys(detail).forEach(key => {
                        if (key.includes('/')) {
                            exportRoster[key] = detail[key].Name;
                        }
                    });

                    // Assign the transformed object to the appropriate key in jsonToExportExcel['allData']
                    jsonToExportExcel['allData'][index] = exportRoster;
                }

                jsonToExportExcel['headings']['ReportName'] = "Shift Roster Details";
                jsonToExportExcel['headings']['CompanyName'] = COMPANY_NAME;
                jsonToExportExcel['headings']['CompanyAddress'] = sessionStorage.getItem('companyAddress');
                console.log("jsonToExportExcel: ", jsonToExportExcel);
                exlsExp.current.excel(jsonToExportExcel, "@" + COMPANY_ID);
            }
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            navigate('/Error')
        } finally {
            setIsLoading(false);
        }
    }


    // ---------------------------- Export2Excel Functionality Ends. -------------------------------------

    const handleDateChange = (key, date) => {
        debugger
        switch (key) {
            case 'dt_from_date':
                // const to_date = document.getElementById('dt_to_date').value;
                // setFromDate(date);
                const formattedFromDate = date ? date.toLocaleDateString('en-CA') : '';
                if (formattedFromDate !== '') { document.getElementById('error_dt_from_date').style.display = 'none'; }
                setFromDate(formattedFromDate);
                // If the start date is set after the end date, clear the end date
                if (dt_to_date && new Date(formattedFromDate) > new Date(dt_to_date)) {
                    setToDate('');
                }
                break;

            case 'dt_to_date':
                const formattedToDate = date ? date.toLocaleDateString('en-CA') : '';
                if (formattedToDate !== '') { document.getElementById('error_dt_to_date').style.display = 'none'; }
                setToDate(formattedToDate)
                break;
            case 'dt_process_date':
                const dt_process_date = document.getElementById('dt_process_date').value;

                if (dt_process_date !== '') {
                    $('#error_dt_process_date').hide();
                    setProcessDate(date);
                }
                break;
            default:
                break;
        }
    }

    return (
        <>
            <ComboBox ref={comboBoxRef} />
            <FrmValidations ref={validate} />
            <GenerateTAutoNo ref={generateAutoNoAPiCall} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <ExcelExport ref={exlsExp} />
            <DashboardLayout>

                <div className='card p-1 mt-3'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Shift Roster{action_Label} </label>
                    </div>

                    <form id="shiftrosterFormId" style={{ marginTop: '2px' }}>

                        <div className='row'>
                            <div className='col-sm-6 erp_form_col_div'>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Shift Roster Id :</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id='shift_roster_id' className="erp_input_field" value={shift_roster_id} onChange={(e) => { setShiftRosterId(e.target.value); validateFields() }} disabled />
                                        <MDTypography variant="button" id="error_shift_roster_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: '4px' }}>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">From Date & To Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">

                                        {/*  <Form.Control type="date" id='dt_from_date' className="erp_input_field" value={dt_from_date} onChange={(e) => { setFromDate(e.target.value); validateFields(); validatedatetimeFields('formDate'); }} />*/}
                                        <DatePicker selected={dt_from_date} id="dt_from_date" onChange={(date) => {
                                            handleDateChange('dt_from_date', date);

                                        }}
                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                            selectsStart
                                            startDate={dt_from_date ? new Date(dt_from_date) : null}
                                            endDate={dt_to_date ? new Date(dt_to_date) : null}
                                        />
                                        <MDTypography variant="button" id="error_dt_from_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                    <div className="col">
                                        {/* <Form.Control type="date" id='dt_to_date' className="erp_input_field" value={dt_to_date} onChange={(e) => { setToDate(e.target.value); validateFields(); validatedatetimeFields('formDate'); }} /> */}
                                        <DatePicker selected={dt_to_date} id="dt_to_date" onChange={(date) => {
                                            handleDateChange('dt_to_date', date);

                                        }}
                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field"
                                            selectsEnd
                                            startDate={dt_from_date ? new Date(dt_from_date) : null}
                                            endDate={dt_to_date ? new Date(dt_to_date) : null}
                                            minDate={dt_from_date ? new Date(dt_from_date) : null}
                                        />
                                        <MDTypography variant="button" id="error_dt_to_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Department </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select ref={cmb_department_id_ref}
                                            options={departmentOptions}
                                            inputId="cmb_department_id"
                                            value={departmentOptions.length > 0 ? departmentOptions.find(option => option.value === cmb_department_id) : null}
                                            onChange={(selectedOpt) => {
                                                cmb_department_id_ref.current = selectedOpt;
                                                setDepartmentId(selectedOpt.value);
                                                comboBoxesOnChange('Department');
                                                validateFields();

                                            }}
                                            placeholder="Search for a Department"
                                            className="form-search-custom"
                                            classNamePrefix="custom-select" // Add custom prefix for class names
                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                })
                                            }}
                                        />
                                        <MDTypography variant="button" id="error_cmb_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row  mb-1'>

                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Sub-Department </Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Select ref={cmb_subdepartment_group_id_ref}
                                            options={subDepartmentGroupOptions}
                                            inputId="cmb_subdepartment_group_id" // Provide the ID for the input box
                                            value={subDepartmentGroupOptions.length > 1 ? subDepartmentGroupOptions.find(option => option.value === cmb_subdepartment_group_id) : null}
                                            onChange={(selectedOpt) => {
                                                cmb_subdepartment_group_id_ref.current = selectedOpt;
                                                setSubDepartmentGroupId(selectedOpt.value);
                                                comboBoxesOnChange("SubDepartment");
                                                validateFields();
                                            }}
                                            placeholder="Search for a Sub-Department..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select" // Add custom prefix for class names
                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                })
                                            }}
                                        />
                                        <MDTypography variant="button" id="error_cmb_subdepartment_group_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { setEmployeeType(e.target.value); comboBoxesOnChange('Employee_type'); validateFields(); }} maxLength="255">
                                            <option value="" disabled>Select</option>
                                            {employeeTypeOptions?.map(employeeTypes => (
                                                <option value={employeeTypes.field_id} property_value={employeeTypes.property_value}>{employeeTypes.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Previous Shift <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select size="sm" id="cmb_from_to_shift" className="form-select form-select-sm" value={cmb_from_to_shift} onChange={(e) => { setFromToShiftId(e.target.value); comboBoxesOnChange('Employee_type'); validateFields(); }}>
                                            <option value="" disabled="true">Select </option>
                                            {shiftOptions?.map(shift => (
                                                <option value={shift.field_id} key={shift.field_id}>{shift.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_from_to_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Employee<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Select
                                            ref={cmb_employee_id_ref}
                                            options={employeeOptions}
                                            id="cmb_employee_id"
                                            value={employeeOptions.length > 0 ? employeeOptions.find(option => option.value === cmb_employee_id) : null}
                                            onChange={(selectedOpt) => {
                                                setEmployeeId(selectedOpt.value)
                                                setEmployeeCode(selectedOpt.employeeCode)
                                                cmb_employee_id_ref.current = selectedOpt;
                                                comboBoxesOnChange('Employee');
                                                validateFields();
                                            }}
                                            placeholder="Search for Employee"
                                            className="form-search-custom"
                                            classNamePrefix="custom-select" // Add custom prefix for class names
                                            styles={{
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided,
                                                    fontSize: '12px' // Adjust the font size as per your requirement
                                                })
                                            }}
                                        />
                                        <MDTypography variant="button" id="error_cmb_employee_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                            </div>
                            <div className='col-sm-6 erp_form_col_div'>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Shift Roster Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <DatePicker selected={dt_process_date} id="dt_process_date" onChange={(date) => {
                                            handleDateChange('dt_process_date', date);

                                        }}
                                            dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" />
                                        <MDTypography variant="button" id="error_dt_process_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Roster Type <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Monthly" type="radio" lbl="Monthly" value="Monthly" name="chk_rosterType" checked={chk_rosterType === "Monthly"} onClick={() => { setRosterType("Monthly"); }} /> </div>
                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="15 Days" type="radio" lbl="15 Days" value="15 Days" name="chk_rosterType" checked={chk_rosterType === "15 Days"} onClick={() => { setRosterType("15 Days"); }} /> </div>
                                        </div>
                                    </div>
                                </div>


                                {chk_rosterType === 'Monthly' ? (
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">1 to 31 Shift <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select size="sm" id="cmb_1to31_shift" className="form-select form-select-sm" value={cmb_1to31_shift} onChange={(e) => { set1to31ShiftId(e.target.value); validateFields(); }}
                                                optional={`${chk_rosterType === '15 Days' ? "optional" : ''}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                {shiftOptions?.map(shift => (
                                                    <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name} >{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_1to31_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">1 to 15 Shift <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <select size="sm" id="cmb_1to15_shift" className="form-select form-select-sm optional" value={cmb_1to15_shift} onChange={(e) => { set1to15ShiftId(e.target.value); validateFields(); }}
                                                    optional={`${chk_rosterType === 'Monthly' ? "optional" : ''}`}>
                                                    <option value="" disabled>Select</option>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name}>{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_cmb_1to15_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">16 to 31 Shift <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <select size="sm" id="cmb_16to31_shift" className="form-select form-select-sm optional" value={cmb_16to31_shift} onChange={(e) => { set16to31ShiftId(e.target.value); validateFields(); }}
                                                    optional={`${chk_rosterType === 'Monthly' ? "optional" : ''}`} >
                                                    <option value="" disabled>Select</option>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name}>{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                    ))}

                                                </select>
                                                <MDTypography variant="button" id="error_cmb_16to31_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Current SHift roster */}

                                {chk_rosterType === 'Monthly' ? (
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">1 to 31 Current Shift <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select size="sm" id="cmb_1to31_current_shift" className="form-select form-select-sm" value={cmb_1to31_current_shift} onChange={(e) => { set1to31CurrentShiftId(e.target.value); validateFields(); }}
                                                optional={`${chk_rosterType === '15 Days' ? "optional" : ''}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                {shiftOptions?.map(shift => (
                                                    <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name}>{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_1to31_current_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">1 to 15 Current Shift <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <select size="sm" id="cmb_1to15_current_shift" className="form-select form-select-sm optional" value={cmb_1to15_current_shift} onChange={(e) => { set1to15CurrentShiftId(e.target.value); validateFields(); }}
                                                    optional={`${chk_rosterType === 'Monthly' ? "optional" : ''}`}>
                                                    <option value="" disabled>Select</option>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name}>{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_cmb_1to15_current_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">16 to 31 Current Shift <span className="required">*</span></Form.Label>
                                            </div>
                                            <div className="col">
                                                <select size="sm" id="cmb_16to31_current_shift" className="form-select form-select-sm optional" value={cmb_16to31_current_shift} onChange={(e) => { set16to31CurrentShiftId(e.target.value); validateFields(); }}
                                                    optional={`${chk_rosterType === 'Monthly' ? "optional" : ''}`} >
                                                    <option value="" disabled>Select</option>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_id} key={shift.field_id} shift_name={shift.field_name}>{shift.field_name + ' [' + shift.startEndTime + ']'}</option>
                                                    ))}

                                                </select>
                                                <MDTypography variant="button" id="error_cmb_16to31_current_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="row">
                                    <div className="col-sm-4">  </div>
                                    <div className="col-sm-4">
                                        <div className="erp_frm_Btns">
                                            <MDButton type="button" id="show_button" className="erp-gb-button ms-2" variant="button"
                                                onClick={() => showShiftRosterDetails()} fontWeight="regular">Show</MDButton>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <hr />
                    <div className='card-header text-start py-0'>
                        <label className='erp-form-label-lg text-center'>Shift Roster Details </label>
                    </div>
                    <div className='row mt-1'>
                        <div className='col-auto' style={{ height: "auto" }}>
                            {renderShiftRosterTable}
                        </div>
                    </div>

                    <div className="erp_frm_Btns">
                        <MDButton className="erp-gb-button ms-2" variant="button" id='back_Button' fontWeight="regular" onClick={() => navigate('/DashBoard')}>Back</MDButton>
                        <MDButton type="submit" id="save_Button" className="erp-gb-button ms-2 view_hide" variant="button"
                            onClick={() => saveShiftRosterDetails()} fontWeight="regular">Save</MDButton>
                        <MDButton type="button" id="export-btn" className={`erp-gb-button ms-2 ${shiftRoosterDetails.length === 0 ? 'd-none' : ''}`}
                            variant="button" onClick={ExportToExcel} fontWeight="regular">Export</MDButton>

                    </div >
                </div>
            </DashboardLayout>
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            {/* Add new Record Popup */}
            {
                showAddRecModal ?
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
                    </Modal > : null
            }
        </>
    )
}

export default FrmShiftRosterEntry