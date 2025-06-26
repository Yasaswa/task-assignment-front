import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { CircularProgress } from '@material-ui/core';
import Tooltip from "@mui/material/Tooltip";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";

// React Bootstrap Imports
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

//Common Imports
import ComboBox from "Features/ComboBox";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from 'assets/Constants/config-constant';

// Common components imports.
import Datatable from 'components/DataTable';
import DeleteModal from 'components/Modals/DeleteModal';

function FrmPayrollSettingListing({ compType = 'Masters' }) {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [HRPayrollSettingsId, setHRPayrollSettingsId] = useState();


    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_NAME, UserName, USER_ACCESS } = configConstants;

    // Table Data
    const [data, setPayrollSettingData] = useState([]
    );
    const [columns, setColumns] = useState([]
    );

    // Filter Fields
    const [filterComboBox, setFilterComboBox] = useState([]);
    const [recordData, setRecordData] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [groupByColumns, setGroupByColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [searchState, setGlobalFilterSearch] = useState('')
    const [searchInputValue, setSearchInputValue] = useState('')
    // Export Fields
    var dataExport = [];
    var columnExport = [];

    const comboBox = useRef();
    const navigate = useNavigate();


    const pdfExpFilters = {};
    var reportName = "Product Service Activities Report"
    var operatorLabels = { "=": "is", "!=": "is not", "1": "active", "0": "closed", "o": "open", "!*": "none", "*": "any", "~": "contains", "!~": "doesn't contain", "^": "starts with", "$": "ends with", "<=": "less than or equal", ">=": "greater than or equal", '<>=': 'BETWEEN' };
    var operatorByType = {
        "list": ["=", "!="], "status": ["1", "0"], "list_status": ["o", "=", "!", "c", "*"], "list_optional": ["=", "!", "!*", "*"],
        "list_subprojects": ["*", "!*", "=", "!"], "string": ["~", "=", "!~", "!=", "^", "$"], "text": ["~", "!~", "^", "$", "!*", "*"],
        "integer": ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"], "float": ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"],
        "relation": ["=", "!", "=p", "=!p", "!p", "*o", "!o", "!*", "*"], "tree": ["=", "~", "!*", "*"], "date": ["=", "<=", '>=', '<>='],
    };

    // Popup Fields
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    useEffect(async () => {
        $('.hide-show-filters').hide();
        // const availCols = await FnShowProdServiceActivityRptRecords(reportType);
        await fetchFilteredData()
    }, [])

    const fetchFilteredData = async () => {
        try {
            debugger
            setIsLoading(true)
            const access_control = FnCheckUserAccess() || { all_access: false, read_access: false, modify_access: false, delete_access: false };
            //http://localhost:2025/api/payrollSettings/FnShowAllReportRecords
            const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/payrollSettings/FnShowAllReportRecords`)
            const responce = await fetchResponse.json();
            let payrollData = responce
            // let nColumn = [];
            if (payrollData.length > 0) {
                setColumns([
                    {
                        Headers: "Action", accessor: "Action",
                        Cell: row => (
                            <div style={{ display: "flex" }}>
                                <Tooltip title="view" placement="top">
                                    <MDTypography className="erp-view-btn" >
                                        <AiFillEye className={`erp-view-btn ${access_control.all_access || access_control.read_access ? 'display' : 'd-none'}`} onClick={() => viewUpdateDelete(row.original, 'view')} />
                                    </MDTypography>
                                </Tooltip>
                                {compType === 'Register' ? null : <>
                                    <Tooltip title="Edit" placement="top">
                                        <MDTypography className="erp-view-btn" >
                                            <MdModeEdit className={`erp-edit-btn ${access_control.all_access || access_control.modify_access ? 'display' : 'd-none'}`} onClick={e => viewUpdateDelete(row.original, 'update')} />
                                        </MDTypography>
                                    </Tooltip>
                                </>}
                            </div>
                        ),
                    },
                    { Headers:'Company ID',accessor: 'company_id'},
                    { Headers: 'PF Limit', accessor:'pf_limit'},
                    { Headers: 'Short Leave Hours', accessor: 'short_leave_hours' },
                    { Headers: 'Attendance Allowance Days', accessor: 'attendance_allowance_days' },
                    { Headers: 'Worker Minimum Wages', accessor: 'worker_minimum_wages' },
                    { Headers: 'Night Allowance Days', accessor: 'night_allowance_days' }
                  ]
                );

                setPayrollSettingData(responce)
            }
            else {
                setColumns([])
                setPayrollSettingData([])
            }
            return;
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        } finally {
            setIsLoading(false)
        }
    };

    const infoForUpdate = async (hrpayroll_settings_id, key) => {
        debugger
        sessionStorage.removeItem('dataAddedByCombo')
        navigate("/Masters/MPayrollSetting/FrmPayrollSettingEntry", { state: { hrpayroll_settings_id, keyForViewUpdate: key, compType: compType } })
    }

    function viewUpdateDelete(row, key) {
        
        let hrpayroll_settings_id = row.hrpayroll_settings_id
        setHRPayrollSettingsId(hrpayroll_settings_id)
        switch (key) {
            case 'update': infoForUpdate(hrpayroll_settings_id, 'update'); break;
            case 'delete': setShow(true); break;
            case 'view': infoForUpdate(hrpayroll_settings_id, 'view'); break;
        }
    }

    const openForm = () => {
        sessionStorage.removeItem('dataAddedByCombo')
        navigate("/Masters/FrmPayrollSettingEntry", { state: { hrpayroll_settings_id: 0, keyForViewUpdate: 0, compType: compType } })
    }

    const reload = () => {
        window.location.reload();
    }


    const submitQuery = async (availCols) => {
        try {
            const requiredColumns = ['hrpayroll_settings_id']

            let selectBox = document.getElementById("selectedColumns");
            let group_by = document.getElementById("group_by").value;
            let jsonQuery = { 'viewname': {}, 'selectQuery': {}, 'whereQuery': {}, 'operators': {}, 'group_by': {}, "additionalParam": {}, "orderBy": {} };
            let storeSelectedValues = []
            if (selectBox.length !== 0) {
                let selectOrder = []; // Array to store the order of elements
                let storeSelectedValues = []; // Assuming this is defined somewhere in your code

                // Loop through selectBox to populate selectQuery and selectOrder
                for (let index = 0; index < selectBox.length; index++) {
                    let optionValue = selectBox.options[index].value;
                    jsonQuery['selectQuery'][index] = optionValue;
                    selectOrder.push(index); // Store the index in the order array
                    storeSelectedValues.push(optionValue);
                }
                // Loop through requiredColumns to add missing elements in the specified order
                for (let index = 0; index < requiredColumns.length; index++) {
                    const element = requiredColumns[index];
                    if (!jsonQuery.selectQuery.hasOwnProperty(element)) {
                        // Add the element at the end of the order array and assign the value
                        selectOrder.push(selectOrder.length);
                        jsonQuery['selectQuery'][selectOrder.length - 1] = element;
                    }
                }

                // Now, construct the final selectQuery object using the specified order
                let finalSelectQuery = {};
                for (let orderIndex of selectOrder) {
                    finalSelectQuery[orderIndex] = jsonQuery['selectQuery'][orderIndex];
                }

                // Replace the original selectQuery with the finalSelectQuery
                jsonQuery['selectQuery'] = finalSelectQuery;


            } else {
                for (let index = 0; index < availCols.length; index++) {
                    let optionValue = availCols[index].accessor;
                    jsonQuery['selectQuery'][optionValue] = optionValue;
                }
            }

            for (let selIndex = 0; selIndex < selectedFilters.length; selIndex++) {
                let fieldvalue = selectedFilters[selIndex].id.trim()
                let operatorSelectValue = document.getElementById(`operators_${fieldvalue}_id`).value;
                let valueSelectValue = document.getElementById(`values_${fieldvalue}_id`).value;
                if (selectedFilters[selIndex].type === 'T') {
                    switch (operatorSelectValue) {
                        case '~':
                            operatorSelectValue = "LIKE"
                            valueSelectValue = "%" + valueSelectValue + "%";
                            break;
                        case '!~':
                            operatorSelectValue = "NOT LIKE"
                            valueSelectValue = "%" + valueSelectValue + "%";
                            break;
                        case '^':
                            operatorSelectValue = "LIKE"
                            valueSelectValue = "%" + valueSelectValue;
                            break;
                        case '$':
                            operatorSelectValue = "LIKE"
                            valueSelectValue = valueSelectValue + "%";
                            break;
                        default:
                            break;
                    }
                }

                if (selectedFilters[selIndex].type === 'D' && operatorSelectValue === '<>=') {
                    if (document.getElementById(`values_${fieldvalue}_id_2`).value !== '' && document.getElementById(`values_${fieldvalue}_id`).value !== '') {
                        valueSelectValue = `${document.getElementById(`values_${fieldvalue}_id_2`).value}`
                        operatorSelectValue = `BETWEEN '${document.getElementById(`values_${fieldvalue}_id`).value}' AND `
                        // this for display filters on reports
                        pdfExpFilters[selectedFilters[selIndex].label] = valueSelectValue + ` BETWEEN ` + `${document.getElementById(`values_${fieldvalue}_id`).value}`;
                    } else {
                        continue;
                    }
                } else {
                    // this for display filters on reports
                    pdfExpFilters[selectedFilters[selIndex].label] = valueSelectValue;
                }
                jsonQuery['whereQuery'][fieldvalue] = valueSelectValue;
                jsonQuery['operators'][fieldvalue] = operatorSelectValue;
            }
            jsonQuery['group_by']["GROUP BY"] = group_by;
            jsonQuery['additionalParam']['is_delete'] = "0";
            jsonQuery['additionalParam']['company_id'] = COMPANY_ID;
            jsonQuery['viewname']['smv_product_service_activity_master'] = 'smv_product_service_activity_master';
            jsonQuery['orderBy']['ORDER BY'] = 'hrpayroll_settings_id';
            let executeQuery = JSON.stringify(jsonQuery)
            return executeQuery;
        } catch (error) {
            console.log("error", error);
            navigate('/Error')
        }
    }


    const FnCheckUserAccess = () => {
        const currentRoute = window.location.pathname;
        const obj = USER_ACCESS ? USER_ACCESS.find(item => item.listing_navigation_url === currentRoute) : null;
        console.log("Particular Page user access: ", obj);
        return obj;
    }

    const FnRenderAdditionalInputsOnDateChange = (filter) => {
        if (filter.type === 'D' && document.getElementById(`operators_${filter.id}_id`).value === '<>=') {
            const filterTblRow = document.getElementById(`${filter.id}`);
            const filterTblRowTd = document.createElement('td');
            // Create the first input element
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.id = `values_${filter.id}_id_2`;
            dateInput.className = 'erp_form_control erp_input_field inputValue erp_operator_val ms-4';
            filterTblRowTd.appendChild(dateInput);
            filterTblRow.appendChild(filterTblRowTd);
        } else {
            // Remove the existing td if it exists
            const existingTd = document.getElementById(`values_${filter.id}_id_2`);
            if (existingTd) {
                existingTd.parentNode.removeChild(existingTd);
            }
        }
        return null;
    };

    return (
        <>
            <ComboBox ref={comboBox} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span id="spinner_text" className="text-dark">Loading...</span>
                    </div>
                </div> :
                null}
            <DashboardLayout>
                <div className='main_heding'>
                    <label className='erp-form-label-lg'>Payroll Settings</label>
                </div>
                <Datatable data={data} columns={columns} freezeColumnCount={5} stateValue={searchInputValue} />
            </DashboardLayout >
            <DeleteModal show={show} closeModal={handleClose} deleteRecord={console.log(`deleted`)} />
        </>
    )
}

export default FrmPayrollSettingListing