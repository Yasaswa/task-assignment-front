import React, { useEffect, useMemo, useState } from 'react'
import { useRef } from 'react';
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap & stylling required
import { CircularProgress } from "@material-ui/core";
import { Card, Form, Table, } from "react-bootstrap";
import { MdDelete } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';

// Import for the searchable combo box.
import Select from 'react-select';

// Generic Component's & Functions Import
import ConfigConstants from "assets/Constants/config-constant";
import { globalQuery, resetGlobalQuery, } from "assets/Constants/config-constant"
import ComboBox from 'Features/ComboBox';
import { useNavigate, useLocation } from 'react-router-dom';

import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";

function FrmSalaryRulesEntry() {

    // *********** Get Data from listing Page **********
    const { state } = useLocation();
    const { salaryRuleId = 0, propertyId = 0, keyForViewUpdate = 'Add', compType = 'Transaction' } = state || {}

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, FINANCIAL_SHORT_NAME, COMPANY_NAME, UserId } = configConstants;

    //Spinner
    const [isLoading, setIsLoading] = useState(false);

    ////Set button type & Action Type
    const [button_name, setButtonName] = useState(keyForViewUpdate === 'update' ? "Update" : "Save");
    const [action_type, setActionType] = useState(keyForViewUpdate === 'view' ? "(View)" : keyForViewUpdate === 'update' ? "(Update)" : "(Add)");


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState("");
    const FnCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        navigate('/Masters/MSalaryRules/FrmSalaryRulesListing');
    };

    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const FnCloseErrModal = () => {
        setShowErrorMsgModal(false)
    };

    //Hooks for Option Boxes
    const [salaryRuleOptions, setSalaryRuleOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subdepartmentOptions, setsubDepartmentOptions] = useState([]);
    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [jobtypeOptions, setJobTypeOptions] = useState([]);

    const [salary_rule_id, setSalaryRuleId] = useState(salaryRuleId);
    const [cmb_salary_rule, setSalaryRule] = useState();
    const [salaryDetailsArr, setSalaryDetailsArr] = useState([]);

    //useRef Hooks
    const comboDataAPiCall = useRef();
    const navigate = useNavigate();


    ////Creating empty Object 
    const emptyJsonObj = {
        'department_id': '',
        'sub_department_id': '',
        'rule_days': '',
        'employee_type_id': '',
        'job_type_id': ''
    }

    useEffect(async () => {
        setIsLoading(true);
        await FillCombos();
        if (keyForViewUpdate !== 'Add') {
            await FnCheckUpdateResponce();
        }
        setIsLoading(false);
    }, []);

    const FillCombos = async () => {

        try {
            ///Loading Salary Rules Options
            const salaryRulApiCall = await comboDataAPiCall.current.fillComboBox('SALARYRULES')
            setSalaryRuleOptions(salaryRulApiCall);

            ///Loading Main Department & Sub Department Options
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'department_type', 'department_id', 'parent_department_id'];
            globalQuery.table = "cmv_department"
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let getDepartmentsApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setDepartmentOptions(getDepartmentsApiCall?.filter(item => item.department_type === 'M'));
            setsubDepartmentOptions(getDepartmentsApiCall?.filter(item => item.department_type === 'S'));

            ///Job Type Options
            resetGlobalQuery();
            globalQuery.columns = ['attendance_status_id', 'attendance_status_name'];
            globalQuery.table = "hm_attendance_status"
            let getJobTypeApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            if (getJobTypeApiCall.length !== '') {
                setJobTypeOptions(getJobTypeApiCall);
            }

            //Employee Type Options
            const employeeTypeApiCall = await comboDataAPiCall.current.fillComboBox('EmployeeTypeGroup')
            setEmployeeTypeOptions(employeeTypeApiCall);

            ////Creating empty Object & passing it into hook
            setSalaryDetailsArr([emptyJsonObj]);

        } catch (error) {
            alert('Error');
        }
    }

    const FnManageSalesDetails = (rowIndex, action) => {
        debugger;
        try {
            let salaryDetailsData = [...salaryDetailsArr]; 
            let validation = true;
            // Validation loop
            for (let index = 0; index < salaryDetailsData.length; index++) {
                let data = salaryDetailsData[index];
                for (let key in data) {
                    if (key === "rule_days" && (data[key] === '' || data[key] === 0)) {
                        $(`#${key}_${index}`).parent().attr('data-tip', 'Please fill it..!');
                        validation = false;
                        break;
                    }
    
                    if (data[key] === '' || data[key] === null) {
                        if (!['deleted_by', 'deleted_on'].includes(key)) {
                            $(`#${key}_${index}`).parent().attr('data-tip', 'Please fill it..!');
                            validation = false;
                            break;
                        }
                    }
                }
                if (!validation) break;
            }
    
            if (validation) {
                if (action === 'add') {
                    // Add a new empty object at the beginning of the array
                    setSalaryDetailsArr([emptyJsonObj, ...salaryDetailsData]);
                } else {
                    // Remove the specified row
                    salaryDetailsData.splice(rowIndex, 1);
                    if (salaryDetailsData.length > 0) {
                        setSalaryDetailsArr(salaryDetailsData);
                    } else {
                        // If the last row is removed, add an empty object to keep the array non-empty
                        setSalaryDetailsArr([emptyJsonObj]);
                    }
                }
            }
        } catch (error) {
            console.log('Error in FnManageSalesDetails:', error); 
        }
    }
    

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/salaryRules/FnShowParticularRecord/${propertyId}/${COMPANY_ID}`);

            const updateRes = await apiCall.json();
            let salaryRulesData = updateRes.SalaryRulesData.map((details) => {
                Object.keys(details).forEach((key) => {
                    if (details[key] === null) {
                        details[key] = "";
                    }
                });
                return details;
            });

            console.log('salaryRulesData: ', salaryRulesData);


            const updatedSalaryDetailsList = await FnGetRespectiveSubDepartments(salaryRulesData)
            setSalaryDetailsArr(updatedSalaryDetailsList)
            setSalaryRule(updateRes.SalaryRulesData[0]['property_id']);

            //////Actions performing based 
            if (keyForViewUpdate === 'view') {
                $(".view_hide").hide();
                $(".view_disable").prop("disabled", true)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    //Render Salary Rules Table
    const renderSalaryRulesTable = useMemo(() => {
        return <Table id="salaryrulestableId" style={{ display: "block", overflow: "auto" }} bordered striped>
            <thead className="erp_table_head">
                <tr>
                    <td className="erp_table_th view_hide" style={{}}>Action</td>
                    <td className="erp_table_th" style={{ width: "150px", }}>Department</td>
                    <td className="erp_table_th" style={{ width: "150px", }}>Sub Department</td>
                    <td className="erp_table_th" style={{ width: "80px", }}>Days</td>
                    <td className="erp_table_th" style={{ width: "100px", }}>Employee Type</td>
                    <td className="erp_table_th" style={{ width: "100px", }}>Leave Type</td>

                </tr>
            </thead>
            <tbody id='salaryrulestableBodyId'>
                {salaryDetailsArr?.map((details, indexOfItem) => (
                    <tr rowindex={indexOfItem} id={`salaryDetailsTabletr${indexOfItem}`}>
                        <td className="erp_table_td view_hide">
                            <IoAddCircleOutline className='erp_trAdd_icon' onClick={(e) => FnManageSalesDetails(indexOfItem, 'add')} />

                            <MdDelete className="erp-delete-btn" onClick={(e) => FnManageSalesDetails(indexOfItem, 'remove')} />
                        </td>
                        <td className="erp_table_td" >
                            <select
                                id={`department_id_${indexOfItem}`} style={{ width: 'auto', backgroundColor: '#AFE1AF' }}

                                className="erp_input_field_table_txt form-select form-select-sm mb-1 view_disable"
                                value={details.department_id}
                                onChange={(e) => FnChangeSalaryDetailsTblRow(e, details, indexOfItem)}
                                Headers='department_id'
                            >
                                <option style={{ backgroundColor: 'white' }} value=''>Select</option>
                                <option style={{ backgroundColor: 'white' }} value={0}>All</option>
                                {departmentOptions?.map((departmentoption) => (
                                    <option style={{ backgroundColor: 'white' }} value={departmentoption.field_id} departmentId={departmentoption.department_id} parentDepartmentId={departmentoption.parent_department_id}>
                                        {departmentoption.field_name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="erp_table_td">
                            <select
                                id={`sub_department_id_${indexOfItem}`} style={{ width: '150px', backgroundColor: '#AFE1AF' }}

                                className="erp_input_field_table_txt form-select form-select-sm mb-1 view_disable"
                                value={parseInt(details.sub_department_id)}
                                onChange={(e) => FnChangeSalaryDetailsTblRow(e, details, indexOfItem)}
                                Headers='sub_department_id'
                            >
                                <option style={{ backgroundColor: 'white' }} value=''>Select</option>
                                <option style={{ backgroundColor: 'white' }} value={0}>All</option>
                                {details.sub_department_list?.map((department) => (
                                    <option key={department.field_id} style={{ backgroundColor: 'white' }} value={department.field_id}>{department.field_name}</option>
                                ))}

                            </select>
                        </td>
                        <td className="erp_table_td">
                            <input
                                type="text" style={{ width: '80px', backgroundColor: '#AFE1AF' }}
                                className="erp_input_field_table_txt mb-1 text-end view_disable zero_removal"
                                id={`rule_days_${indexOfItem}`} pattern="\d*"
                                onInput={(e) => FnChangeSalaryDetailsTblRow(e, details, indexOfItem)}
                                value={details.rule_days}
                                Headers='rule_days'
                            />
                        </td>

                        <td className="erp_table_td">
                            <select
                                id={`employee_type_id_${indexOfItem}`} style={{ width: '150px', backgroundColor: '#AFE1AF' }}

                                className="erp_input_field_table_txt form-select form-select-sm mb-1 view_disable"
                                value={details.employee_type_id}
                                onChange={(e) => FnChangeSalaryDetailsTblRow(e, details, indexOfItem)}
                                Headers='employee_type_id'
                            >
                                <option style={{ backgroundColor: 'white' }} val='' >Select</option>
                                <option style={{ backgroundColor: 'white' }} value={0}>All</option>
                                {employeeTypeOptions?.map((employeetypeoption) => (
                                    <option style={{ backgroundColor: 'white' }} value={employeetypeoption.field_id}>
                                        {employeetypeoption.field_name}
                                    </option>
                                ))}
                            </select>
                        </td>

                        <td className="erp_table_td">
                            <select
                                id={`job_type_id_${indexOfItem}`} style={{ width: '150px', backgroundColor: '#AFE1AF' }}

                                className="erp_input_field_table_txt form-select form-select-sm mb-1 view_disable"
                                value={details.job_type_id}
                                onChange={(e) => FnChangeSalaryDetailsTblRow(e, details, indexOfItem)}
                                Headers='job_type_id'
                            >
                                <option style={{ backgroundColor: 'white' }} >Select</option>
                                {jobtypeOptions?.map((jobtypeoption) => (
                                    <option style={{ backgroundColor: 'white' }} value={jobtypeoption.attendance_status_id}>
                                        {jobtypeoption.attendance_status_name}
                                    </option>
                                ))}
                            </select>
                        </td>

                    </tr>
                ))}
            </tbody>
        </Table>
    }, [salaryDetailsArr]);

    /////Function to change table rows
    const FnChangeSalaryDetailsTblRow = async (handleevent, rowdata, indexOfItem) => {
        debugger;
        try {
            // Create a deep copy of the state array
            const salaryRules = [...salaryDetailsArr];
            // Save the original data for reversion in case of duplicates
            const originalRowData = { ...salaryRules[indexOfItem] };

            let eventId = document.getElementById(handleevent.target.id);
            let clickedColName = handleevent.target.getAttribute('Headers');
            let enteredValue = handleevent.target.value;

            // Update the row data based on the input
            let updatedRowData = { ...rowdata }; // Create a copy to avoid direct mutation
            if (clickedColName === 'rule_days' && (isNaN(enteredValue) || enteredValue === "")) {
                updatedRowData[clickedColName] = 0;
            } else {
                updatedRowData[clickedColName] = parseInt(enteredValue);
            }

            // Temporarily update salaryRules to reflect the change
            salaryRules[indexOfItem] = updatedRowData;

            // Check for duplicates
            let hasDuplicate = salaryRules.some((details, index) => {
                return salaryRules.some((item, innerIndex) => {
                    return index !== innerIndex &&
                        parseInt(details.department_id) === parseInt(item.department_id) &&
                        details.sub_department_id === item.sub_department_id &&
                        parseInt(details.rule_days) === parseInt(item.rule_days) &&
                        details.employee_type_id === item.employee_type_id &&
                        details.job_type_id === item.job_type_id;
                });
            });

            if (hasDuplicate) {
                // If a duplicate is found, revert the change by resetting the row data
                salaryRules[indexOfItem] = originalRowData;
                eventId.parentElement.dataset.tip = 'Combination already exists!';
            } else {
                // No duplicate found, clear any existing tooltip
                delete eventId.parentElement.dataset.tip;

                // Clear tooltips in the entire table row
                let tableRowId = $(`#salaryrulestableBodyId`);
                tableRowId.find('td').each(function () {
                    delete this.dataset.tip;
                });

                // Update state based on the modified salaryRules
                if (clickedColName === 'department_id') {
                    const updatedSalaryDetailsList = await FnGetRespectiveSubDepartments(salaryRules);
                    setSalaryDetailsArr(updatedSalaryDetailsList);
                } else {
                    setSalaryDetailsArr(salaryRules);
                }
            }
            console.log('Salary Rules :' + salaryRules);
        } catch (error) {
            console.log('error', error);
        } finally {

        }
    }




    const FnGetRespectiveSubDepartments = async (salaryRules) => {
        let allSubDepartments = [...subdepartmentOptions];

        if (allSubDepartments.length === 0) {
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'department_type', 'department_id', 'parent_department_id'];
            globalQuery.table = "cmv_department"
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let getDepartmentsApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            allSubDepartments = getDepartmentsApiCall?.filter(item => item.department_type === 'S')
        }

        const updatedSalaryDetails = await Promise.all(salaryRules.map(async (item) => {

            // Get godown_section rows
            const subDepartments = allSubDepartments.filter(subDept => parseInt(subDept.parent_department_id) === parseInt(item.department_id));

            return { ...item, sub_department_list: subDepartments };
        }));

        return updatedSalaryDetails;
    }

    const validate = () => {
        let cmb_salary_rule = $("#cmb_salary_rule option:selected").val();
        if (cmb_salary_rule !== '') {
            setSalaryRule(cmb_salary_rule);
            $("#error_cmb_salary_rule").hide();
        } else {
            $("#error_cmb_salary_rule").text('Select Salary Rule...!').show();
        }
    }

    const validateForm = () => {
        try {
            let validation = true;
            let salaryRulesDetails = [...salaryDetailsArr];

            // Validate the salary rule selection
            if ($("#cmb_salary_rule option:selected").val() !== "") {
                $("#error_cmb_salary_rule").hide();
            } else {
                $("#error_cmb_salary_rule").text('Select Salary Rule...!').show();
                validation = false;
            }
            if (!validation) return false;

            // Validate the salary rules details
            for (let index = 0; index < salaryRulesDetails.length; index++) {
                let data = salaryRulesDetails[index];
                for (let key in data) {
                    if (key === "rule_days" && (data[key] === '' || data[key] === 0)) {
                        $(`#${key}_${index}`).parent().attr('data-tip', 'Please fill it..!');
                        validation = false;
                        break;
                    }

                    if (data[key] === '' || data[key] === null || data[key] === undefined) {
                        if (!['deleted_by', 'deleted_on'].includes(key)) {
                            $(`#${key}_${index}`).parent().attr('data-tip', 'Please fill it..!');
                            validation = false;
                            break;
                        }
                    }
                }
                if (!validation) break;
            }

            if (!validation) return false;
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            return false; // Return false in case of error
        }
    };


    const saveSalaryRulesDetails = async () => {
        try {
            setIsLoading(true)
            if (validateForm() === true) {
                let saveJson = { 'SalaryRulesData': [], 'commonIds': { 'salary_rule_id': salary_rule_id, 'company_id': COMPANY_ID } };

                let salaryRulesJsonArr = salaryDetailsArr.map((details) => {
                    details['company_id'] = COMPANY_ID;
                    details['property_id'] = parseInt($('#cmb_salary_rule option:selected').val());
                    details['created_by'] = UserName;
                    details['modified_by'] = UserName;
                    // Set department_id to 0 if it's an empty string
                    if (details['department_id'] === '') {
                        details['department_id'] = 0;
                    }
                    if (details['sub_department_id'] === '') {
                        details['sub_department_id'] = 0;
                    }
                    delete details['sub_department_list']; // Remove the unwanted key
                    return details;
                });

                saveJson.SalaryRulesData = salaryRulesJsonArr;


                const formData = new FormData();
                formData.append(`SalaryRulesObject`, JSON.stringify(saveJson))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/salaryRules/FnAddUpdateRecord`, requestOptions)
                const resp = await apiCall.json()
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

    $(document).on('click', '.zero_removal', function () {
        if ($(this).val() === '0') {
            $(this).val("")
        }
    });
    $(document).on('mouseup mousedown', function (e) {
        let inputBoxes = $(".zero_removal");
        inputBoxes.each(function () {
            if ($(this).val() === "") {
                $(this).val('0');
            }
        });
    });
    return (
        <>
            <ComboBox ref={comboDataAPiCall} />

            <DashboardLayout>
                {isLoading ?
                    <div className="spinner-overlay"  >
                        <div className="spinner-container">
                            <CircularProgress color="primary" />
                            <span>Loading...</span>
                        </div>
                    </div> :
                    ''}

                {/* Card Starts*/}
                <div className="card mt-4">
                    <div className="card-header py-0 main_heding">
                        <label className="erp-form-label-lg">Salary Rules{action_type}</label>
                    </div>

                    {/* Card's Body Starts*/}
                    <div className="card-body">
                        <div className="row">
                            {/* First Column Starts*/}
                            <div className="col-sm-5 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label"> Salary Rule</Form.Label>
                                    </div>


                                    <div className='col-12 col-sm-8'>
                                        <select id="cmb_salary_rule" className="form-select form-select-sm view_disable" value={cmb_salary_rule} onChange={(e) => { validate(); }}>
                                            <option value="">Select</option>
                                            {salaryRuleOptions.length !== 0 ? (
                                                <>
                                                    {salaryRuleOptions?.map(salaryrule => (
                                                        <option value={salaryrule.field_id}>{salaryrule.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_salary_rule" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>
                            {/* {First Column Ends Here} */}
                        </div>


                        {/* {Salary Rules Table} */}

                        <div className='col-sm-9 erp_form_col_div mt-4'>
                            <div className='erp-form-label-lg'>Salary Rules Details</div>
                            {renderSalaryRulesTable}

                        </div>
                    </div>
                    <hr />

                    <div className="erp_frm_Btns mb-2">
                        <MDButton className="erp-gb-button ms-2" variant="button" id='back_Button' fontWeight="regular" onClick={() => navigate('/Masters/MSalaryRules/FrmSalaryRulesListing')}>Back</MDButton>
                        <MDButton type="submit" id="save_Button" className="erp-gb-button ms-2 view_hide" variant="button"
                            onClick={() => saveSalaryRulesDetails()} fontWeight="regular">{button_name}</MDButton>
                    </div >

                </div>
            </DashboardLayout>
            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => FnCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => FnCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
        </>

    )
}

export default FrmSalaryRulesEntry