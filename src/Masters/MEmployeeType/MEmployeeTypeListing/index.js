import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';

//React Bootstrap components
import { Table } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ConfigConstants from "assets/Constants/config-constant";
import MDButton from "components/MDButton";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import MDTypography from "components/MDTypography";
import FrmValidations from 'FrmGeneric/FrmValidations';

// import files
import ComboBox from "Features/ComboBox";

function MEmployeeTypeListing({ goBack }) {
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, COMPANY_NAME } = configConstants;

    const { state } = useLocation();
    const { keyForViewUpdate, compType } = state || {}

    // UseRefs
    const navigate = useNavigate();
    const frmValidation = useRef();
    const combobox = useRef();
    const comboDataAPiCall = useRef();
    const validateNumberPercentInput = useRef();


    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState("");

    const [deductionData, setDeductionData] = useState([]);
    const [earningData, setEarningData] = useState([]);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    const [employeeGroupTypeOptions, setEmployeeGroupTypeOptions] = useState([]);
    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [cmb_employee_type, setEmployeeType] = useState([]);
    const [cmb_employee_group_type, setEmployeeGroupType] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    const [employeeTypeId, setEmployeeTypeId] = useState([]);
    const [cmb_employeeTypeName, setEmployeeTypeName] = useState([]);
    const [cmb_employeeTypeShortName, setEmployeeTypeShortName] = useState('');
    const [effective_date, setEffectiveDate] = useState(today);
    // const [ded_effective_date, setDedEffectiveDate] = useState(today);
    const [employeeTypeGroupId, setEmployeeTypeGroupId] = useState('');
    const [cmb_employeeTypeGroupName, setEmployeeTypeGroupName] = useState('');
    const [cmb_employeeTypeGroupShortName, setEmployeeTypeGroupShortName] = useState('');


    //Error Msg
    const handleCloseErrModal = () => {
        setShowErrorMsgModal(false)
    };

    const validateErrorMsgs = () => {
        frmValidation.current.validateFieldsOnChange('employeeFormId')
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update')
                break;
            case 'view':
                setActionType('(View)');
                break;
            default:
                setActionType('(Create)');
                break;
        }

    };
    useEffect(async () => {
        await ActionType();
        try {
            await fillPropertyComboBoxes();
            await FnShowEarningHeadRecrd();
        } catch (error) {
            // Handle any errors
            console.error(error);
        }

    }, [])

    const fillPropertyComboBoxes = async () => {
        try {
            const comboBoxesPropertyNames = ["EmployeeTypeGroup", "EmployeeType",];

            const employeeGroupTypesApiCall = await combobox.current.fillComboBox('EmployeeTypeGroup');
            setEmployeeGroupTypeOptions(employeeGroupTypesApiCall);

            const employeeTypesApiCall = await combobox.current.fillComboBox('EmployeeType');
            setEmployeeTypeOptions(employeeTypesApiCall);


        } catch (error) {
            console.log("error : ", error)
        }
    }
    //function for  loadEmployeeType
    const loadEmployeeType = async () => {
        var employeeGroupType = document.getElementById('cmb_employee_group_type').value
        var employeeType = document.getElementById('cmb_employee_type').value
        if (employeeGroupType !== '') {
            resetGlobalQuery();
            globalQuery.columns.push("field_id");
            globalQuery.columns.push("field_name");
            globalQuery.columns.push("property_value");
            globalQuery.table = "amv_properties"
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "property_group", operator: "=", value: employeeGroupType });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

            const employeeGroupTypeResponse = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
            setEmployeeTypeOptions(employeeGroupTypeResponse)
            setEmployeeTypeGroupShortName(employeeGroupTypeResponse[0].property_value)
            setEmployeeTypeGroupName(employeeGroupTypeResponse[0].field_name)
            setEmployeeTypeGroupId(employeeGroupTypeResponse[0].field_id)
        }

        if (employeeType !== '') {
            resetGlobalQuery();
            globalQuery.columns.push("field_id");
            globalQuery.columns.push("field_name");
            globalQuery.columns.push("property_value");
            globalQuery.table = "amv_properties"
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "field_id", operator: "=", value: employeeType });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

            const employeeTypeApiResponse = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)

            setEmployeeTypeShortName(employeeTypeApiResponse[0].property_value)
            setEmployeeTypeName(employeeTypeApiResponse[0].field_name)
            setEmployeeTypeId(employeeTypeApiResponse[0].field_id)
        }
    }

    const FnShowEarningHeadRecrd = async () => {
        try {
            const earnHeadDataApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnShowEarningAndDeductionRecords/${(COMPANY_ID)}`)
            const responce = await earnHeadDataApiCall.json();
            const earningMappingRecords = responce.EarningMappingRecords
            const deductionMappingRecords = responce.DeductionMappingRecords

            if (earningMappingRecords.length !== 0) {

                setEarningData(earningMappingRecords)
                setDeductionData(deductionMappingRecords)
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }
    const FncheckUpadateDeductionRecrds = async () => {

        const checkIsValidate = await frmValidation.current.validateForm("employeeFormId");
        if (checkIsValidate) {
            $('.selectEarning').prop('checked', false);
            $('.selectDeduction').prop('checked', false);
            try {
                const UpadateDeductionRecrdsApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmEmployeeTypeEarningAndTypeDeduction/FnShowAllRecords?employee_type_name=${cmb_employeeTypeName}&employee_type_group_name=${cmb_employeeTypeGroupName}&company_id=${COMPANY_ID}`)

                const responce = await UpadateDeductionRecrdsApiCall.json();

                let earningMapRecords = responce.EarningMappingRecords;
                let deductionMapRecords = responce.DeductionMappingRecords;

                if (earningMapRecords.length !== 0) {

                    let earningHeadData = earningData.map((rowData) => {
                        const correspondingMapRecord = earningMapRecords.find((mapRecord) => mapRecord.earning_heads_id === rowData.earning_heads_id);

                        if (correspondingMapRecord) {
                            // If a matching mapRecord is found, update calculation_value and formula
                            return {
                                ...rowData,
                                calculation_value: correspondingMapRecord.calculation_value,
                                formula: correspondingMapRecord.formula,
                                effective_date: correspondingMapRecord.effective_date,
                            };
                        }

                        // If no matching mapRecord is found, return the original rowData
                        return rowData;
                    });
                    setEarningData(earningHeadData)

                    earningMapRecords.forEach(function (existingPayTerm) {
                        $('#selectEarning_' + existingPayTerm.earning_heads_id).prop('checked', true);
                        setEffectiveDate(earningMapRecords[0].effective_date)
                    });
                }
                if (deductionMapRecords.length !== 0) {

                    let deductionHeadData = deductionData.map((rowData) => {
                        const correspondingMapRecord = deductionMapRecords.find((mapRecord) => mapRecord.deduction_heads_id === rowData.deduction_heads_id);

                        if (correspondingMapRecord) {
                            // If a matching mapRecord is found, update calculation_value and formula
                            return {
                                ...rowData,
                                calculation_value: correspondingMapRecord.calculation_value,
                                formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
                                effective_date: correspondingMapRecord.effective_date,
                            };
                        }

                        // If no matching mapRecord is found, return the original rowData
                        return rowData;
                    });

                    setDeductionData(deductionHeadData)

                    deductionMapRecords.forEach(function (existingPayTerm) {
                        $('#selectDeduction_' + existingPayTerm.deduction_heads_id).prop('checked', true);
                        setEffectiveDate(deductionMapRecords[0].effective_date)
                    });

                }
            } catch (error) {
                console.log("error: ", error)
            }
        }
    }
    function handleEarningCheckbox(id) {

        $('input:checkbox[name="selectEarning"][value="' + id + '"]').attr('checked', false);
        const totalChkBoxes = document.querySelectorAll('input[name=selectEarning]').length;
        const totalChkBoxesChked = document.querySelectorAll('input[name=selectEarning]:checked').length;
        if (totalChkBoxes == totalChkBoxesChked) {

            document.getElementById('selectAllEarning').checked = true;
        } else if (totalChkBoxes > totalChkBoxesChked) {
            ;
            document.getElementById('selectAllEarning').checked = false;
        }
    }
    function handleDeductionCheckbox(id) {

        $('input:checkbox[name="selectDeduction"][value="' + id + '"]').attr('checked', false);
        const totalChkBoxes = document.querySelectorAll('input[name=selectDeduction]').length;
        const totalChkBoxesChked = document.querySelectorAll('input[name=selectDeduction]:checked').length;
        if (totalChkBoxes == totalChkBoxesChked) {

            document.getElementById('selectAllDeduction').checked = true;
        } else if (totalChkBoxes > totalChkBoxesChked) {
            ;
            document.getElementById('selectAllDeduction').checked = false;
        }
    }

    //Fn for render payment terms static table 
    const renderEarningTable = useMemo(() => {
        return <>
            <Table id='earningHead-table' bordered striped >
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Action</th>
                        <th className="erp_table_th">Earning Head </th>
                        <th className="erp_table_th">Short Name</th>
                        <th className="erp_table_th">Calculation Type</th>
                        <th className="erp_table_th">Formula</th>
                        <th className="erp_table_th">Calculation Value</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        earningData.map((earnItem, Index) =>
                            <tr payTermItemIndex={Index} rowIndex={Index}>

                                <td className="erp_table_td">
                                    <input type="checkbox" name="selectEarning" className="selectEarning" value={earnItem.earning_heads_id} id={'selectEarning_' + earnItem.earning_heads_id} onClick={() => handleEarningCheckbox(earnItem.earning_heads_id)} disabled={keyForViewUpdate === 'view'} />
                                </td>
                                <td className="erp_table_td">{earnItem.earning_head_name}</td>
                                <td className="erp_table_td">{earnItem.earning_head_short_name}</td>
                                <td className="erp_table_td">{earnItem.calculation_type}</td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0" value={earnItem.formula} id={"formula_" + earnItem.earning_heads_id} onChange={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        onBlur={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        Headers='formula' disabled={keyForViewUpdate === 'view'}
                                    />
                                </td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0 text-end" value={earnItem.calculation_value} id={"calculation_value_" + earnItem.earning_heads_id} onChange={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        onBlur={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        Headers='calculation_value' disabled={keyForViewUpdate === 'view'} />
                                </td>

                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </>
    }, [earningData]);

    const renderDeductionTable = useMemo(() => {
        return <>
            <Table id='deductionHead-table' bordered striped >
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Action</th>
                        <th className="erp_table_th">Deduction Head </th>
                        <th className="erp_table_th">Short Name</th>
                        <th className="erp_table_th">Calculation Type</th>
                        <th className="erp_table_th">Formula</th>
                        <th className="erp_table_th">Calculation Value</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        deductionData.map((deductionItem, Index) =>
                            <tr payTermItemIndex={Index} >

                                <td className="erp_table_td">
                                    <input type="checkbox" name="selectDeduction" className="selectDeduction" value={deductionItem.deduction_heads_id} id={'selectDeduction_' + deductionItem.deduction_heads_id} onClick={() => handleDeductionCheckbox(deductionItem.deduction_heads_id)} disabled={keyForViewUpdate === 'view'} />
                                </td>
                                <td className="erp_table_td">{deductionItem.deduction_head_name}</td>
                                <td className="erp_table_td">{deductionItem.deduction_head_short_name}</td>
                                <td className="erp_table_td">{deductionItem.calculation_type}</td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0" value={deductionItem.formula} id={"formula_" + deductionItem.deduction_heads_id} onChange={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        onBlur={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        Headers='formula' disabled={keyForViewUpdate === 'view'} />
                                </td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0 text-end" value={deductionItem.calculation_value} id={"calculation_value_" + deductionItem.deduction_heads_id} onChange={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        onBlur={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        Headers='calculation_value' disabled={keyForViewUpdate === 'view'} />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </>
    }, [deductionData]);


    const updatePmtTermsTblData = (currentPaymentTerm, e) => {
        let clickedColName = e.target.getAttribute('Headers');
        delete e.target.parentElement.dataset.tip;

        switch (clickedColName) {

            case 'earning_head_value':
                let isValidPercentageInput = validateNumberPercentInput.current.percentValidate(JSON.stringify(e.target.value));
                if (isValidPercentageInput === true) {
                    currentPaymentTerm[clickedColName] = e.target.value
                    delete e.target.parentElement.dataset.tip;
                }
                break;
            case 'calculation_value':
                let isValiddecimalNumberInput = validateNumberPercentInput.current.decimalNumber(JSON.stringify(e.target.value), 2);
                currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
                delete e.target.parentElement.dataset.tip;

                break;
            case 'formula':
                currentPaymentTerm[clickedColName] = e.target.value
                break;
            default:
                break;
        }

        // update the Payment terms table data.
        const updateEarningData = [...earningData]
        const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
        updateEarningData[pmtTermIndexInArray] = currentPaymentTerm;
        setEarningData(updateEarningData);

    }
    // earning head  validations
    const FnValidateEarningHead = async () => {
        let selectedEarningHead = $('#earningHead-table tbody tr .selectEarning:checked')
        let selectedDuductionHead = $('#deductionHead-table tbody tr .selectDeduction:checked')

        let EarningHead = true;
        if (selectedEarningHead.length === 0 && selectedDuductionHead.length === 0) {
            setErrMsg('Please Select Atleast One Earning Head...!');
            setShowErrorMsgModal(true);
            return EarningHead = false;
        } else {
            selectedEarningHead.each(function () {
                let currentTblRow = $(this.parentElement.parentElement)
                let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
                let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

                if (calculatedValue === '') {
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
                    return EarningHead = false;

                } else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
                    $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
                    return EarningHead = false;
                }

            });
            selectedDuductionHead.each(function () {
                let currentTblRow = $(this.parentElement.parentElement)
                let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
                let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

                if (calculatedValue === '') {
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
                    return EarningHead = false;

                } else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
                    $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
                    return EarningHead = false;
                }

            });
            return EarningHead;
        }

    }


    const updateDeductionTblData = (currentPaymentTerm, e) => {
        let clickedColName = e.target.getAttribute('Headers');
        delete e.target.parentElement.dataset.tip;

        switch (clickedColName) {

            case 'earning_head_value':
                let isValidPercentageInput = validateNumberPercentInput.current.percentValidate(JSON.stringify(e.target.value));
                if (isValidPercentageInput === true) {
                    currentPaymentTerm[clickedColName] = e.target.value
                    delete e.target.parentElement.dataset.tip;
                } else {
                    const currentTblRow = e.target.parentElement.parentElement;

                }
                break;
            case 'calculation_value':
                let isValiddecimalNumberInput = validateNumberPercentInput.current.decimalNumber(JSON.stringify(e.target.value), 2);
                currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
                break;
            case 'formula':
                currentPaymentTerm[clickedColName] = e.target.value
                break;
            default:
                break;
        }
        // update the DeductionData table data.
        const updateDeductionData = [...deductionData]
        const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
        updateDeductionData[pmtTermIndexInArray] = currentPaymentTerm;
        setDeductionData(updateDeductionData);


    }

    //function to check All checkBoxes of earning and deduction head
    function toggleChkAllBoxes(key) {

        switch (key) {
            case "selectAllEarning":
                $('.selectEarning').prop('checked', $('#selectAllEarning').is(":checked"));
                break;
            case 'PartiallyEarningSelection':
                $('#selectAllEarning').prop('checked', $('input:checkbox.selectEarning:checked').length == $('input:checkbox.selectEarning').length);
                break;
            // For customer contact
            case 'selectAllDeduction':
                $('.selectDeduction').prop('checked', $('#selectAllDeduction').is(":checked"));
                break;
            case 'PartiallyDeductionSelection':
                $('#selectAllDeduction').prop('checked', $('input:checkbox.selectDeduction:checked').length === $('input:checkbox.selectDeduction').length);
                break;

        }
    }


    const addEarningDeductionData = async () => {
        const checkIsValidate = await frmValidation.current.validateForm("employeeFormId");
        if (checkIsValidate) {
            let json = { 'TransEarningHeadData': [], 'TransDeductionHeadData': [], 'commonIds': {} }
            try {

                if (await FnValidateEarningHead()) {
                    $("input:checkbox[name=selectEarning]:checked").each(function () {
                        let findEarningData = earningData.find(item => item.earning_heads_id === parseInt($(this).val()));

                        const earningDatas = {
                            company_id: COMPANY_ID,
                            company_branch_id: COMPANY_BRANCH_ID,
                            earning_heads_id: findEarningData.earning_heads_id,
                            earning_code: findEarningData.earning_code,
                            earning_head_short_name: findEarningData.earning_head_short_name,
                            earning_type: findEarningData.earning_type,
                            calculation_type: findEarningData.calculation_type,
                            calculation_value: findEarningData.calculation_value,
                            effective_date: findEarningData.effective_date,
                            formula: findEarningData.formula,
                            effective_date: effective_date,
                            created_by: UserName,
                            employee_type_name: cmb_employeeTypeName,
                            employee_type_short_name: cmb_employeeTypeShortName,
                            employee_type_id: employeeTypeId,
                            employee_type_group_name: cmb_employeeTypeGroupName,
                            employee_type_group_short_name: cmb_employeeTypeGroupShortName,

                        }
                        json.TransEarningHeadData.push(earningDatas);
                    });

                    $("input:checkbox[name=selectDeduction]:checked").each(function () {
                        let findDiductionData = deductionData.find(item => item.deduction_heads_id === parseInt($(this).val()));

                        const deductionDatas = {
                            company_id: COMPANY_ID,
                            company_branch_id: COMPANY_BRANCH_ID,
                            deduction_heads_id: findDiductionData.deduction_heads_id,
                            deduction_code: findDiductionData.deduction_code,
                            deduction_head_short_name: findDiductionData.deduction_head_short_name,
                            deduction_type: findDiductionData.deduction_type,
                            calculation_type: findDiductionData.calculation_type,
                            calculation_value: findDiductionData.calculation_value,
                            effective_date: findDiductionData.effective_date,
                            formula: findDiductionData.formula,
                            effective_date: effective_date,
                            created_by: UserName,
                            employee_type_name: cmb_employeeTypeName,
                            employee_type_short_name: cmb_employeeTypeShortName,
                            employee_type_id: employeeTypeId,
                            employee_type_group_name: cmb_employeeTypeGroupName,
                            employee_type_group_short_name: cmb_employeeTypeGroupShortName,
                        }
                        json.TransDeductionHeadData.push(deductionDatas);
                    });
                    json.commonIds.company_id = COMPANY_ID
                    json.commonIds.company_branch_id = COMPANY_BRANCH_ID
                    json.commonIds.employee_type_id = employeeTypeId
                    json.commonIds.employee_type_group_name = cmb_employeeTypeGroupName
                    json.commonIds.employee_type_name = cmb_employeeTypeName

                    const formData = new FormData();
                    formData.append(`EmployeeEarningAndDeductionMappingData`, JSON.stringify(json))
                    const requestOptions = {
                        method: 'POST',
                        body: formData
                    };
                    const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmEmployeeTypeEarningAndTypeDeduction/FnAddUpdateRecord`, requestOptions)
                    const resp = await apiCall.json()
                    if (resp.success === '0') {
                        setErrMsg(resp.error)
                        setShowErrorMsgModal(true)
                    } else {
                        $('.selectEarning').prop('checked', false);
                        $('.selectDeduction').prop('checked', false);
                        setEmployeeGroupType('');
                        setEmployeeType('');
                        setEffectiveDate('');
                        console.log("resp: ", resp)
                        setSuccMsg(resp.message)
                        setShowSuccessMsgModal(true)
                    }
                }
            } catch (error) {
                console.log("error: ", error)
            }
        }
    }
    return (
        <>
            <ComboBox ref={comboDataAPiCall} />
            <ComboBox ref={combobox} />
            <ValidateNumberDateInput ref={validateNumberPercentInput} />
            <FrmValidations ref={frmValidation} />
            <div>
                <div className="erp_top_Form">
                    <div className='card p-1'>
                        <div className='card-header text-center py-0'>
                            <label className='erp-form-label-lg text-center'>Employee Type (Earning Deduction Mapping)</label>
                        </div>
                        <form id='employeeFormId'>
                            <div className="row erp_transporter_div ">
                                <div className="col-sm-6 erp_form_col_div">
                                    <div className='row'>
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Group Type <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select id="cmb_employee_group_type" className="form-select form-select-sm" value={cmb_employee_group_type} onChange={e => { loadEmployeeType(); setEmployeeGroupType(e.target.value); validateErrorMsgs(); }} maxLength="255">
                                                <option value="" disabled>Select</option>
                                                {employeeGroupTypeOptions?.map(groupType => (
                                                    <option value={groupType.property_value}>{groupType.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_employee_group_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 erp_form_col_div">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label"> Effective Date </Form.Label>
                                            </div>
                                            <div className="col">
                                                <Form.Control type="date" id="effective_date" className="erp_input_field" value={effective_date} onChange={e => { setEffectiveDate(e.target.value); }} optional="optional" />
                                                <MDTypography variant="button" id="error_effective_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* second column */}
                                <div className="col-sm-6 erp_form_col_div">
                                    <div className="row">

                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { loadEmployeeType(); setEmployeeType(e.target.value); validateErrorMsgs() }} maxLength="255">
                                                <option value="" disabled>Select</option>
                                                {employeeTypeOptions?.map(employeeTypes => (
                                                    <option value={employeeTypes.field_id}>{employeeTypes.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div>
                                        <MDButton onClick={() => FncheckUpadateDeductionRecrds()} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                                            fontWeight="regular">show</MDButton>
                                    </div >

                                </div>

                            </div>
                        </form>

                        <div className="row col-12">

                            <div class="col-12 col-lg-6" style={{ minHeight: "500px;" }}>
                                <div className='erp-form-label-lg'>Employee Type Wise Earning</div>
                                <div class="col pt-sm-1">
                                    <input type='checkbox' class="selectAllEarning" id="selectAllEarning" onClick={(e) => toggleChkAllBoxes('selectAllEarning')} disabled={keyForViewUpdate === 'view'} /> <label class="erp-form-label pb-1"> Select All </label>
                                </div>
                                <div style={{ height: '450px', overflowY: 'auto' }}>
                                    {renderEarningTable}
                                </div>
                                <MDTypography variant="button" id="error_select_earningHead" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}> </MDTypography>
                            </div>
                            {/* </div> */}
                            <div class="col-12 col-lg-6" style={{ minHeight: "500px;" }}>
                                <div className='erp-form-label-lg'>Employee Type Wise Deduction</div>
                                <div class="col pt-sm-1">
                                    <input type='checkbox' class="selectAllDeduction" id="selectAllDeduction" onClick={(e) => toggleChkAllBoxes('selectAllDeduction')} disabled={keyForViewUpdate === 'view'} /> <label class="erp-form-label pb-1"> Select All </label>
                                </div>

                                <div style={{ height: '450px', overflowY: 'auto' }}>
                                    {renderDeductionTable}
                                </div>
                            </div>
                            <div className="erp_frm_Btns py-5">
                                <MDButton type="submit" id="saveBtn" onClick={() => addEarningDeductionData()} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                                    fontWeight="regular">{actionLabel}</MDButton>
                                <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { navigate(`/DashBoard`) }} variant="button"
                                    fontWeight="regular">Exit</MDButton>
                            </div >
                            {/* Success Msg Popup */}
                            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                            {/* Error Msg Popup */}
                            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MEmployeeTypeListing;