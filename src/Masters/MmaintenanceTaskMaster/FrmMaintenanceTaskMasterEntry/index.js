import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery';
import { useLocation, useNavigate } from 'react-router-dom';
import { Accordion, Table, Form } from 'react-bootstrap';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ComboBox from 'Features/ComboBox';
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import DepartmentEntry from 'Masters/MDepartment/FrmDepartmentEntry';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import ConfigConstants from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';

export default function FrmMaintenanceTaskMasterEntry() {
    let expanded = false;
    //changes by ujjwala on 11/1/2024
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { maintenanceTaskMasterId = 0, keyForViewUpdate, compType = 'Masters' } = state || {}
    // UseRefs
    const navigate = useNavigate();
    const comboDataAPiCall = useRef();
    const validateNumberDateInput = useRef();
    const validate = useRef();
    //MODEL
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    //combo options
    const [departmentOotions, setDepartmentOptions] = useState([]);
    const [subdepartmentOotions, setSubDepartmentOptions] = useState([]);
    //Machine Master fields 
    const [maintenance_task_master_id, setMaintenanceTaskMasterId] = useState(maintenanceTaskMasterId)
    const [txt_maintenance_task_name, setMaintenanceTaskName] = useState('')
    const [txt_maintenance_task_Description, setMaintenanceTaskDescription] = useState('')
    const [int_std_task_frequency, setStdTaskFrequency] = useState('')
    const [int_std_task_man_hour, setStdTaskManHour] = useState()
    const [departmentId, setDepartmentId] = useState('')
    const [subDepartmentId, setSubDepartmentId] = useState('')
    const [int_std_task_tollerance, setStdTaskTollerance] = useState()
    const [cmb_maintenance_task_type, setMaintenanceTaskType] = useState('C');
    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [rowCount, setRowCount] = useState();
    const FillComboBox = async () => {
        resetGlobalQuery();
        const getDepartmentOptions = await comboDataAPiCall.current.fillMasterData("cmv_department", "department_type", "M");
        setDepartmentOptions(getDepartmentOptions);
    }

    //function for load subdepartment
    //changes by ujjwala on 11/1/2024 case 3
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

            const subDepartmentAPIResponse = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
            setSubDepartmentOptions(subDepartmentAPIResponse);
        }
    }

    const removeFirstRow = () => {
        $('#BContactPersonID-' + 1).val("");
        $('#BContactPersonID1-' + 1).val("");
        $('#BContactPersonID2-' + 1).val("");
        $('#BContactPersonID3-' + 1).val("");

    }

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing`)
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const validateFields = () => {
        validate.current.validateFieldsOnChange('maintenanceTaskformId')

    }
    //changes by ujjwala on 11/1/2024 case 5
    const addRecordInProperty = async (key) => {
        switch (key) {
            case 'cmb_department':
                const department_idval = document.getElementById('cmb_department').value;
                if (department_idval === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')

                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
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
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 100)
                }


                setSubDepartmentId(sub_department_id)
                $('#error_cmb_subdepartment').hide();
                break;

        }
    }
    //changes by ujjwala on 11/1/2024
    useEffect(async () => {
        await ActionType()
        await FillComboBox();
        if (maintenanceTaskMasterId !== null) {
            await FnCheckUpdateResponce();
            setRowCount(1)
        } else {
            await addTableRow(1);
            setRowCount(1)

        }
    }, [])
    //changes by ujjwala on 11/1/2024 case 1
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update')
                break;
            case 'view':
                setActionType('(View)');
                $("table").find("input,button,textarea,select").attr("disabled", "disabled");
                await validate.current.readOnly("maintenanceTaskformId");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:

                setActionType('(Create)');
                break;
        }
    };
    //end by ujjwala
    const addTableRow = async (rowCount) => {


        const createTd1 = $('<span><input type="text" class="erp_input_field" id="BContactPersonID-' + rowCount + '" maxLength="255"/></span>')
        const createTd2 = $('<span><input type="text" class="erp_input_field" id="BContactPersonID1-' + rowCount + '" maxLength="18"/></span>')
        const createTd4 = $('<span><input type="text" class="erp_input_field" id="BContactPersonID2-' + rowCount + '" maxLength="18"/></span>')

        $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd1));
        $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd2));
        $('#BContactEntry-tr-' + rowCount).append($("<td>").append(createTd4));

    }


    const addElectricalMeterData = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("maintenanceTaskformId");
            if (checkIsValidate === true) {

                let json = { 'TransHeaderData': {}, 'TransDetailData': [], 'commonIds': {} }
                for (let count = 1; count <= rowCount; count++) {
                    var rowIsPresent = document.getElementById("BContactEntry-tr-" + count);
                    if (rowIsPresent !== null) {
                        const contact = $('#BContactPersonID-' + count).val();
                        const TaskActivityFunctionality = $('#BContactPersonID-' + count).val();
                        const TaskActivityResults = $('#BContactPersonID1-' + count).val();
                        const StdTaskActivityLossPerHour = $('#BContactPersonID2-' + count).val();

                        if (contact !== '') {
                            const Electricalmeterdata = {
                                company_branch_id: COMPANY_BRANCH_ID,
                                company_id: COMPANY_ID,
                                created_by: UserName,
                                maintenance_task_master_id: maintenance_task_master_id,
                                modified_by: maintenance_task_master_id === null ? null : UserName,
                                maintenance_task_name: txt_maintenance_task_name,
                                maintenance_task_type: cmb_maintenance_task_type,
                                maintenance_task_Description: txt_maintenance_task_Description,
                                std_task_frequency: int_std_task_frequency,
                                std_task_man_hour: int_std_task_man_hour,
                                production_department_id: departmentId,
                                production_sub_department_id: subDepartmentId,
                                std_task_tollerance: int_std_task_tollerance,
                                is_active: chk_isactive,
                            };
                            json.TransHeaderData = Electricalmeterdata;

                            let crJson = {}
                            //changes by ujjwala on 11/1/2024 
                            crJson['company_id'] = COMPANY_ID
                            crJson['company_branch_id'] = COMPANY_BRANCH_ID
                            crJson['created_by'] = UserName
                            crJson['modified_by'] = maintenance_task_master_id === null ? null : UserName
                            crJson['task_activity_functionality'] = 0;
                            crJson['maintenance_task_activity_id'] = 0;
                            crJson['task_activity_results'] = TaskActivityFunctionality;
                            crJson['std_task_activity_loss_per_hour'] = TaskActivityResults;
                            crJson['std_task_activity_minutes'] = StdTaskActivityLossPerHour;

                            json.TransDetailData.push(crJson)

                            json.commonIds.company_id = COMPANY_ID
                            json.commonIds.company_branch_id = COMPANY_BRANCH_ID
                            json.commonIds.maintenance_task_master_id = maintenance_task_master_id

                            const formData = new FormData();
                            formData.append(`YmMaintenanceData`, JSON.stringify(json))
                            const requestOptions = {
                                method: 'POST',
                                body: formData
                            };

                            const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/YmMaintenanceDetails/FnAddUpdateRecord`, requestOptions)
                            const responce = await apicall.json()
                            console.log("response: ", responce.data);
                            if (responce.error !== "") {
                                console.log("response error: ", responce.error);
                                setErrMsg(responce.error)
                                setShowErrorMsgModal(true)

                            } else {
                                const evitCache = comboDataAPiCall.current.evitCache();
                                console.log(evitCache);
                                setSuccMsg(responce.message)
                                setShowSuccessMsgModal(true);
                                await FnCheckUpdateResponce();
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            navigate('/Error')
        }
    }

    const displayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Department':
                return <DepartmentEntry btn_disabled={true} />;

            case 'Sub Department':
                return <DepartmentEntry department={departmentId} btn_disabled={true} />;

            default:
                return null;
        }
    }

    // Show ADd record Modal
    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Department':
                const departmentAPiCall = await comboDataAPiCall.current.fillMasterData("cmv_department", "", "");
                setDepartmentOptions(departmentAPiCall)
                break;
            case 'Sub Department':
                await loadSubDepartment();
                break;
            default:
                break;
        }
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").css({ "padding-top": "110px" });
        }, 200)
    }


    const FnCheckUpdateResponce = async () => {
        var count = 0;
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/YmMaintenanceDetails/FnShowAllMaintenanceMasterAndDetailsRecords/${maintenance_task_master_id}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();
            //const data = updateRes.data
            let MaintenanceMasterRecord = updateRes.MaintenanceMasterRecord;
            let MaintenanceDetailsRecord = updateRes.MaintenanceDetailsRecord;

            if (MaintenanceMasterRecord !== null && MaintenanceMasterRecord !== "") {
                setMaintenanceTaskMasterId(MaintenanceMasterRecord.maintenance_task_master_id)
                setMaintenanceTaskName(MaintenanceMasterRecord.maintenance_task_name)
                setMaintenanceTaskDescription(MaintenanceMasterRecord.maintenance_task_Description)
                setDepartmentId(MaintenanceMasterRecord.production_department_id)
                await loadSubDepartment()
                setSubDepartmentId(MaintenanceMasterRecord.production_sub_department_id)
                setStdTaskTollerance(MaintenanceMasterRecord.std_task_tollerance)
                setStdTaskManHour(MaintenanceMasterRecord.std_task_man_hour)
                setStdTaskFrequency(MaintenanceMasterRecord.std_task_frequency)
                setMaintenanceTaskType(MaintenanceMasterRecord.maintenance_task_type)
                setIsActive(MaintenanceMasterRecord.is_active);


                //changes by ujjwala on 11/1/2024 case 8
                if (MaintenanceDetailsRecord.length > 0) {
                    let count = 1;
                    for (let idCounter = 0; idCounter < MaintenanceDetailsRecord.length; idCounter++) {
                        let EnquiryExistingFun = MaintenanceDetailsRecord[idCounter].task_activity_results
                        let EnquiryExpectedFun = MaintenanceDetailsRecord[idCounter].std_task_activity_loss_per_hour
                        let EnquiryExpectedFunvalue = MaintenanceDetailsRecord[idCounter].std_task_activity_minutes
                        if (idCounter === 0) {
                            $(`#BContactPersonID-${count}`).val(EnquiryExistingFun);
                            $(`#BContactPersonID1-${count}`).val(EnquiryExpectedFun);
                            $(`#BContactPersonID2-${count}`).val(EnquiryExpectedFunvalue);
                        } else {
                            addTableRow(count)
                            $(`#BContactPersonID-${count}`).val(EnquiryExistingFun);
                            $(`#BContactPersonID2-${count}`).val(EnquiryExpectedFun);
                            $(`#BContactPersonID2-${count}`).val(EnquiryExpectedFunvalue);
                        }
                        count++;
                    }
                    // setFunctionalityrowcount(count)
                }


            }
        } catch (error) {
            console.log("Error: ", error);
            navigate('/Error')
        }
    }
    //changes by ujjwala on 11/1/2024
    const validateNo = (key) => {

        const numCheck = /^[0-9]*\.?[0-9]*$/;
        const regexNo = /^[0-9]*\.[0-9]{4}$/
        const regexNo1 = /^[0-9]*\.[0-9]{4}$/
        var dot = '.';
        switch (key) {
            case 'pFromRange':
                var pFromRangeVal = $('#int_std_task_man_hour').val();
                if (!regexNo.test(pFromRangeVal) && pFromRangeVal.length <= 14 || pFromRangeVal.indexOf(dot) === 14) {
                    if (numCheck.test(pFromRangeVal)) {
                        setStdTaskManHour(pFromRangeVal)
                    }

                }
                break;
        }
    }

    //end by ujjwala
    return (
        <>
            <ComboBox ref={comboDataAPiCall} />
            <FrmValidations ref={validate} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />

            <div className="erp_top_Form">

                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Maintenance Task Master {actionType} </label>
                    </div>
                    <form id="maintenanceTaskformId">
                        <div className="row erp_transporter_div">
                            {/* //first column */}
                            <div className="col-sm-6">

                                {/* Department Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Department <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_department" className="form-select form-select-sm" value={departmentId} onChange={() => { loadSubDepartment(); validateFields(); addRecordInProperty("cmb_department") }} >
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>
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
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Sub Department <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_subdepartment" className="form-select form-select-sm" value={subDepartmentId} onChange={() => { loadSubDepartment(); validateFields(); addRecordInProperty("cmb_subdepartment") }} >
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>
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

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Maintenance Task Type</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select id="cmb_maintenance_task_type" name="cmb_maintenance_task_type" className="form-select form-select-sm" value={cmb_maintenance_task_type} onChange={(e) => { setMaintenanceTaskType(e.target.value); }} >
                                            <option value="C" lbl="Common">Common</option>
                                            <option value="P" lbl="Preventive Maintenance">Preventive Maintenance</option>
                                            <option value="B" lbl="Breakdown Maintenance">Breakdown Maintenance</option>
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_maintenance_task_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Maintenance Task Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_maintenance_task_name" value={txt_maintenance_task_name} onChange={e => { setMaintenanceTaskName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_maintenance_task_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* Machine Short Name Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Maintenance Task Description<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_maintenance_task_Description" value={txt_maintenance_task_Description} onChange={e => { setMaintenanceTaskDescription(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_maintenance_task_Description" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* //second column */}
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Std Task Man Hour<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field text-end" id="int_std_task_man_hour" value={int_std_task_man_hour} onChange={e => { validateNo('pFromRange'); validateFields(); }} maxLength="19" />
                                        <MDTypography variant="button" id="error_int_std_task_man_hour" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Std Task Frequency<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field text-end" id="int_std_task_frequency" value={int_std_task_frequency}
                                            onChange={e => {
                                                if (validateNumberDateInput.current.isInteger(e.target.value)) {
                                                    setStdTaskFrequency(e.target.value)
                                                }; validateFields();
                                            }} maxLength="11" />
                                        <MDTypography variant="button" id="error_int_std_task_frequency" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Std Task Tollerance<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field text-end" id="int_std_task_tollerance" value={int_std_task_tollerance}
                                            onChange={e => {
                                                if (validateNumberDateInput.current.isInteger(e.target.value)) {
                                                    setStdTaskTollerance(e.target.value)
                                                }; validateFields()
                                            }} maxLength="11" />
                                        <MDTypography variant="button" id="error_int_std_task_tollerance" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
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
                </div>

                <hr />
                {/* chnges by ujjwla gurav on 11/1/2024 */}
                <Accordion defaultActiveKey="1" >
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className="erp-form-label-md">Maintenance Task Details</Accordion.Header>
                        <Accordion.Body>
                            <div class="col pt-sm-1">
                                <MDButton type="button" className="erp-gb-button" variant="button" fontWeight="regular" >Add Details</MDButton>
                            </div>
                            <br></br>
                            <Table className="erp_table" id="BContactEntryTable" responsive bordered striped>
                                <thead className='erp_table_head erp_table_th'>
                                    <tr>
                                        <th>Task Activity Results</th>
                                        <th>Std Task Activity Loss Per Hour</th>
                                        <th>Std Task Activity Minutes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="BContactEntry-tr-1">
                                        <td>
                                            <span><input type="text" class="erp_input_field" id="BContactPersonID-1" maxLength="255" /></span>
                                        </td>
                                        <td>
                                            <span><input type="number" className="erp_input_field text-end" id="BContactPersonID1-1" maxLength="18" /></span>
                                        </td>
                                        <td>
                                            <span><input type="number" className="erp_input_field text-end" id="BContactPersonID2-1" maxLength="18" /></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <div className="card-footer py-0 text-center">
                    <MDButton type="button" className="erp-gb-button"

                        onClick={() => {
                            const path = compType === 'Register' ? '/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing/reg' : '/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing';
                            navigate(path);
                        }}
                        variant="button"
                        fontWeight="regular" >Back</MDButton>
                    <MDButton type="submit" onClick={addElectricalMeterData} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                        fontWeight="regular">{actionLabel}</MDButton>
                </div >

                {/* <div className="erp_frm_Btns" >
                    <MDButton type="button" className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => { navigate(`/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing`) }} >Back</MDButton>
                    <MDButton type="button" id="btn_save" className="erp-gb-button erp_MLeft_btn" onClick={addElectricalMeterData} variant="button" fontWeight="regular"  >Save</MDButton>

                </div > */}

                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


                {/* Add new Record Popup */}
                <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Header>
                        {/* <Modal.Title className='erp_modal_title'>{modalHeaderName}</Modal.Title> */}
                        <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                    </Modal.Header>
                    <Modal.Body className='erp_city_modal_body'>
                        {displayRecordComponent()}
                    </Modal.Body>
                    <Modal.Footer>
                        <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
                            fontWeight="regular">Close</MDButton>

                    </Modal.Footer>
                </Modal >

            </div >
        </>
    )
} 
