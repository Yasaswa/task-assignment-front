import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery';
import { useLocation, useNavigate } from 'react-router-dom';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 PRO React components
import MDButton from 'components/MDButton';

// React Bootstrap imports
import { Table } from "react-bootstrap"

// import React icons
import { IoAddCircleOutline } from "react-icons/io5"
import { IoRemoveCircleOutline } from "react-icons/io5"

//File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { Form } from 'react-bootstrap';
import { globalQuery, resetGlobalQuery } from 'assets/Constants/config-constant';
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import FrmValidations from 'FrmGeneric/FrmValidations';



const MmaintenanceTaskActivityEntry = () => {
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName, COMPANY_BRANCH_ID } = configConstants;

    const { state } = useLocation()
    const { maintenance_task_activity_id = 0, production_department_id, production_sub_department_id, keyForViewUpdate = 'Add', compType = 'Masters' } = state

    const [txt_maintenance_task_activity_id, setmaintenance_task_activity_id] = useState(maintenance_task_activity_id)
    const [departmentId, setDepartmentId] = useState(production_department_id)
    const [subDepartmentId, setSubDepartmentId] = useState(production_sub_department_id)
    const [departmentOotions, setDepartmentOptions] = useState([]);
    const [subdepartmentOotions, setSubDepartmentOptions] = useState([]);
    const [actionType, setActionType] = useState('')


    const [rowCount, setRowCount] = useState(0);

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    // const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        navigate(`/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing`);
    }

    const validate = useRef();


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');
    //MODEL
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')
    // For navigate
    const navigate = useNavigate();
    const comboDataAPiCall = useRef();
    const validateNumberDateInput = useRef();


    useEffect(() => {
        const functionCall = async () => {
            debugger
            await ActionType();
            await FillComboBox();
            if (maintenance_task_activity_id !== null) {
                await FnShowTaskActivityRecords();
            } else {
                await addTableRow(1);
                setRowCount(1)
            }

        }
        functionCall()
    }, [])

    const FnCheckKey = async (rowCount) => {
        debugger
        if (keyForViewUpdate !== "undefined" && keyForViewUpdate !== '' && keyForViewUpdate !== null) {
            switch (keyForViewUpdate) {
                case 'view':
                    addReadOnlyAttr(rowCount)
                    $('#cmb_department').attr('disabled', true);
                    $('#cmb_subdepartment').attr('disabled', true)
                    break;
                case 'update':
                    $('#cmb_department').attr('disabled', true);
                    $('#cmb_subdepartment').attr('disabled', true)
                    break;
            }

        }
    }
    const validateFields = () => {
        var formObj = $('#TaskActivityId');
        var inputObj;

        for (var i = 0; i <= formObj.get(0).length - 1; i++) {
            inputObj = formObj.get(0)[i];
            if (inputObj.type === 'text' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'select-one' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'textarea' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'date' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'number' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            }
        }
    }
    //function for load subdepartment
    const loadSubDepartment = async () => {
        var depantmentId = document.getElementById('cmb_department').value
        if (depantmentId !== '') {
            resetGlobalQuery();
            globalQuery.columns.push("field_id");
            globalQuery.columns.push("field_name");

            globalQuery.table = "cmv_department"
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: depantmentId });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "department_group", operator: "=", value: 'Production' });
            globalQuery.conditions.push({ field: "department_type", operator: "=", value: 'S' });

            const subDepartmentAPIResponse = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
            setSubDepartmentOptions(subDepartmentAPIResponse)


        }
    }
    const FillComboBox = async () => {

        resetGlobalQuery();
        globalQuery.columns.push("field_id");
        globalQuery.columns.push("field_name");
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "company_id", operator: "=", value: parseInt(COMPANY_ID) });
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "department_type", operator: "=", value: 'M' });
        globalQuery.conditions.push({ field: "department_group", operator: "=", value: 'Production' });

        const productionParentProcessApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
        setDepartmentOptions(productionParentProcessApiCall);


    }
    const FnShowTaskActivityRecords = async () => {
        try {
            var count = 0;
            const TActivityDataApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/YmMaintenanceTaskActivity/FnShowParticularRecords/${departmentId}/${subDepartmentId}/${COMPANY_ID}`)
            const responce = await TActivityDataApiCall.json();

            if (responce.content.length !== 0) {
                sessionStorage.setItem('onloadDataFillup', 'start')
                for (let TactivityIndex = 0; TactivityIndex < responce.content.length; TactivityIndex++) {
                    count += 1;
                    await addTableRow(count);
                    $('#TActivityID-' + count).val(responce.content[TactivityIndex].task_activity_functionality);
                    $('#TActivityID1-' + count).val(responce.content[TactivityIndex].task_activity_results);
                    // $('#TActivityID2-' + count).val(responce.content[TactivityIndex].std_task_activity_loss_per_hour);
                    $('#TActivityID2-' + count).val(validateNumberDateInput.current.decimalNumber((responce.content[TactivityIndex].std_task_activity_loss_per_hour).toString(), 4));
                    $('#TActivityID3-' + count).val(validateNumberDateInput.current.decimalNumber((responce.content[TactivityIndex].std_task_activity_minutes).toString(), 4));
                    // $('#TActivityID3-' + count).val(responce.content[TactivityIndex].std_task_activity_minutes);
                }
                setDepartmentId(responce.content[0].production_department_id)
                await loadSubDepartment()
                setSubDepartmentId(responce.content[0].production_sub_department_id)
                setRowCount(count)
                sessionStorage.removeItem('onloadDataFillup');
            } else {
                sessionStorage.setItem('onloadDataFillup', 'start')
                count++;
                await addTableRow(count);
                setRowCount(count)
                sessionStorage.removeItem('onloadDataFillup')
            }
            await FnCheckKey(count)
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }

    const updateCountState = () => {
        var count = rowCount + 1;
        addTableRow(count);
        setRowCount(rowCount + 1)
    }

    const addTableRow = async (rowCount) => {

        if (rowCount !== 1) {
            let newRow = $(`<tr id="TActivityEntryTable-tr-${rowCount}"></tr>`);
            let secondLastRow = $("#TActivityEntryTable tr").eq(-1);
            newRow.insertBefore(secondLastRow);
            $('#TActivityEntryTable-tr-' + rowCount).append($("<td>").append('<span class="RemoveTrBtn"  id="RemoveTrBtn-' + rowCount + '" name=' + rowCount + ' value=' + rowCount + '><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="erp_trRemove_icon"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 256H176"></path></svg></span>'))
        }

        const createTd1 = $('<span><input type="text" class="erp_input_field" id="TActivityID-' + rowCount + '" maxLength="255"/></span>')
        const createTd2 = $('<span><input type="text" class="erp_input_field" id="TActivityID1-' + rowCount + '" maxLength="255"/></span>')
        const createTd4 = $('<span><input type="text" class="erp_input_field numberInput" id="TActivityID2-' + rowCount + '" maxLength="19"/></span>')
        const createTd5 = $('<span><input type="text" class="erp_input_field numberInput" id="TActivityID3-' + rowCount + '" maxLength="19"/></span>')

        $('#TActivityEntryTable-tr-' + rowCount).append($("<td>").append(createTd1));
        $('#TActivityEntryTable-tr-' + rowCount).append($("<td>").append(createTd2));
        $('#TActivityEntryTable-tr-' + rowCount).append($("<td>").append(createTd4));
        $('#TActivityEntryTable-tr-' + rowCount).append($("<td>").append(createTd5));

        $('.numberInput').on('input', function () {
            $(this).val(function (index, value) {
                value = value.replace(/[^0-9.]/g, '');
                const parts = value.split('.');

                if (parts.length > 1 && parts[1].length > 4) {
                    parts[1] = parts[1].slice(0, 4);
                }
                value = parts.join('.');
                const decimalCount = value.split('.').length - 1;
                if (decimalCount > 1) {
                    value = value.slice(0, value.lastIndexOf('.'));
                }
                return value;
            });
        });



        $('body').on('click', '.RemoveTrBtn', function () {
            var $tr = $(this).closest('tr');
            $tr.remove();
        });

    }

    var activeValue = '';

    const addTaskActivityEntryData = async () => {
        try {
            const checkIsValidated = validateRows();

            var active;
            activeValue = document.querySelector('input[name=isactive]:checked').value

            switch (activeValue) {
                case '1': active = true; break;
                case '0': active = false; break;
            }

            var BContactJson = { 'MaintenanceTaskJsons': [], 'commonIds': {} }
            if (checkIsValidated === true) {

                for (let count = 1; count <= rowCount; count++) {
                    var rowIsPresent = document.getElementById("TActivityEntryTable-tr-" + count);
                    if (rowIsPresent !== null) {
                        const contact = $('#TActivityID-' + count).val();
                        if (contact !== '') {
                            const TaskActivityFunctionality = $('#TActivityID-' + count).val();
                            const TaskActivityResults = $('#TActivityID1-' + count).val();
                            const StdTaskActivityLossPerHour = $('#TActivityID2-' + count).val();
                            const StdTaskActivityMinutes = $('#TActivityID3-' + count).val();
                            const BContactJsonData = {
                                company_id: parseInt(COMPANY_ID),
                                company_branch_id: parseInt(COMPANY_BRANCH_ID),
                                maintenance_task_activity_id: txt_maintenance_task_activity_id,
                                created_by: UserName,
                                modified_by: maintenance_task_activity_id === 0 ? null : UserName,
                                task_activity_functionality: TaskActivityFunctionality,
                                task_activity_results: TaskActivityResults,
                                std_task_activity_loss_per_hour: StdTaskActivityLossPerHour,
                                std_task_activity_minutes: StdTaskActivityMinutes,
                                production_department_id: departmentId,
                                production_sub_department_id: subDepartmentId,
                                is_active: active,

                            }
                            //console.log('tr-', count, " : ", contact + designation + contactNo + BContactEmail + BAltrContact + BAltrEmail)
                            // BContactJson['MaintenanceTaskJsons'].push(BContactJsonData)
                            BContactJson.MaintenanceTaskJsons.push(BContactJsonData)
                        }
                    }
                }
                BContactJson['commonIds']['maintenance_task_activity_id'] = maintenance_task_activity_id
                BContactJson['commonIds']['production_department_id'] = departmentId
                BContactJson['commonIds']['production_sub_department_id'] = subDepartmentId
                BContactJson['commonIds']['company_id'] = parseInt(COMPANY_ID)

                console.log("BContactJson: ", BContactJson)

                const BContactGridData = JSON.stringify(BContactJson)
                const formData = new FormData();
                formData.append(`CYmMaintenanceData`, BContactGridData)
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/YmMaintenanceTaskActivity/FnAddUpdateRecord`, requestOptions)
                const resp = await apiCall.json()
                if (resp.success === '0') {
                    setErrMsg(resp.error)
                    setShowErrorMsgModal(true)
                } else {
                    console.log("resp: ", resp)
                    const evitCache = await comboDataAPiCall.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(resp.message)
                    setShowSuccessMsgModal(true)
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }


    const validateRows = () => {
        var regexNo = /^[0-9\b]+$/;
        for (let count = 1; count <= rowCount; count++) {

            var rowIsPresent = document.getElementById("TActivityEntryTable-tr-" + count);
            if (rowIsPresent !== null) {
                const TaskActivityFunctionality = $('#TActivityID-' + count).val();
                if (TaskActivityFunctionality === '') {
                    TaskActivityFunctionality.parentElement.dataset.tip = 'Please enter hrs  !...';
                    // showErrorMessage(count, 'Please enter Task Activity Functionality!...');
                    return false;
                } else {
                    delete TaskActivityFunctionality.parentElement.dataset.tip;
                    // removeErrorMessage(count);
                }
                const StdTaskActivityLossPerHour = $('#TActivityID2-' + count).val();
                if (StdTaskActivityLossPerHour === '') {
                    StdTaskActivityLossPerHour.parentElement.dataset.tip = 'Please enter hrs  !...';
                    // showErrorMessage(count, 'Please enter Standard Task Activity Loss per Hour!...');
                    return false;
                } else {
                    delete StdTaskActivityLossPerHour.parentElement.dataset.tip;

                    // removeErrorMessage(count);
                }
            }
        }
        return true;
    }



    // const validateRows = () => {
    //     var regexNo = /^[0-9\b]+$/;
    //     for (let count = 1; count <= rowCount; count++) {

    //         var rowIsPresent = document.getElementById("TActivityEntryTable-tr-" + count);
    //         if (rowIsPresent !== null) {
    //             const TaskActivityFunctionality = $('#TActivityID-' + count).val();

    //             const inp3 = document.querySelector('#TActivityID2-' + count);
    //             if (TaskActivityFunctionality === '') {
    //                 inp3.parentElement.dataset.tip = 'Please enter hrs  !...';
    //                 return false;
    //             } else {
    //                 delete inp3.parentElement.dataset.tip;
    //             }

    //             const StdTaskActivityLossPerHour = $('#TActivityID2-' + count).val();

    //             const inp4 = document.querySelector('#TActivityID3-' + count);
    //             if (StdTaskActivityLossPerHour !== '' && (!regexNo.test(StdTaskActivityLossPerHour) || StdTaskActivityLossPerHour.length < 10)) {
    //                 inp4.parentElement.dataset.tip = 'Please enter valid number !...';
    //                 return false;
    //             } else {
    //                 delete inp4.parentElement.dataset.tip;
    //             }
    //         }
    //     }
    //     return true;
    // }

    const removeFirstRow = () => {
        $('#TActivityID-' + 1).val("");
        $('#TActivityID1-' + 1).val("");
        $('#TActivityID2-' + 1).val("");
        $('#TActivityID3-' + 1).val("");

    }

    const addReadOnlyAttr = (rowCount) => {
        $("#TActivityEntryTable").find("input,button,textarea,select").attr("disabled", true);
        $("#TActivityEntryTable").find("input,button,textarea,select").attr("readonly", true);
        $('.disableClass').prop('disabled', true)
    }
    // function for setup combo box value on change
    const addRecordInProperty = async (key) => {
        switch (key) {

            case 'cmb_department':
                const department_idval = document.getElementById('cmb_department').value;
                if (department_idval === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')

                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(0).css("padding-top", "0px");
                    }, 100)
                }
                setDepartmentId(department_idval)
                $('#error_cmb_department').hide();
                break;

            case 'cmb_subdepartment':
                const sub_department_id = document.getElementById('cmb_subdepartment').value;
                if (sub_department_id === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Sub Department')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(0).css("padding-top", "0px");
                    }, 100)
                }


                setSubDepartmentId(sub_department_id)
                $('#error_cmb_subdepartment').hide();
                break;

        }
    }
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                break;
            case 'view':
                setActionType('(View)');
                addReadOnlyAttr(rowCount);
                // await validate.current.readOnly(rowCount);
                await validate.current.readOnly("TaskActivityId");


                break;
            default:
                setActionType('(Create)');
                break;
        }
    };

    return (
        <>
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataAPiCall} />
            <div className='erp_top_Form'>

                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Maintenance Task Activity {actionType}  </label>
                    </div>
                    <form id="TaskActivityId">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Department <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_department" className="form-select form-select-sm" value={departmentId} onChange={() => { loadSubDepartment(); validateFields(); addRecordInProperty("cmb_department") }} >
                                            <option value="0">Select</option>
                                            {/* <option value="0">Add New Record+</option> */}
                                            {departmentOotions.length !== 0 ? (
                                                <>
                                                    {departmentOotions?.map(department => (
                                                        <option value={department.field_id}>{department.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_department" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* Sub Department Row */}
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Sub Department<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_subdepartment" className="form-select form-select-sm" value={subDepartmentId} onChange={() => { loadSubDepartment(); validateFields(); addRecordInProperty("cmb_subdepartment") }} >
                                            <option value="0">Select</option>
                                            {/* <option value="0">Add New Record+</option> */}
                                            {subdepartmentOotions.length !== 0 ? (
                                                <>
                                                    {subdepartmentOotions?.map(subdepartment => (
                                                        <option value={subdepartment.field_id}>{subdepartment.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_subdepartment" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>






                            </div>

                            {/* //second column */}


                            <div className="col-sm-6 erp_form_col_div">

                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Maintenance Active <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Yes"
                                                    type="radio"
                                                    value="1"
                                                    name="isactive"
                                                    defaultChecked

                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isactive"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>


                    <Table className="erp_table" id="TActivityEntryTable" responsive bordered striped>
                        <thead className='erp_table_head erp_table_th'>
                            <tr>
                                <th>Action</th>
                                <th>Task Activity Functionality</th>
                                <th>Task Activity Results</th>
                                <th>Std Task Activity Loss Per Hour</th>
                                <th>Std Task Activity Minutes</th>

                            </tr>
                        </thead>

                        <tbody>

                            <tr id="TActivityEntryTable-tr-1">
                                <td><IoRemoveCircleOutline className='erp_trRemove_icon disableClass' onClick={() => removeFirstRow()} /> <IoAddCircleOutline className='erp_trAdd_icon disableClass' onClick={() => updateCountState()} /></td>
                            </tr>
                        </tbody>


                    </Table>
                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing/reg' : '/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular">Back</MDButton>

                        {keyForViewUpdate !== 'view' ? (
                            <MDButton type="submit" onClick={() => addTaskActivityEntryData()} id="saveBtn" className="erp-gb-button erp_MLeft_btn " variant="button"
                                fontWeight="regular">save</MDButton>
                        ) : null}
                    </div >
                    {/* Success Msg Popup */}
                    <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                    {/* Error Msg Popup */}
                    <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                </div>
            </div>
        </>
    )
}

export default MmaintenanceTaskActivityEntry
