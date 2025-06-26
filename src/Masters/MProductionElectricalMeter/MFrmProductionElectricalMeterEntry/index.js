import React, { useEffect, useRef, useState, useMemo } from 'react'
import $ from 'jquery';
import { useNavigate, useLocation } from 'react-router-dom';
import { Accordion, Table, Form } from 'react-bootstrap';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ComboBox from 'Features/ComboBox';
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import FrmPlantEntry from 'Masters/MPlant/FrmPlantEntry';
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";



// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import DepartmentEntry from 'Masters/MDepartment/FrmDepartmentEntry';

export default function MFrmProductionElectricalMeterEntry() {
    const validate = useRef();
    let [detailsAccordEventKey, setDetailsAccordEventKey] = useState(0);
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { prod_electrical_meter_id = 0, keyForViewUpdate, compType = 'Masters' } = state || {}
    // UseRefs
    const navigate = useNavigate();
    const comboDataAPiCall = useRef();

    //MODEL
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    //combo options
    const [plantOptions, setPlantOptions] = useState([]);
    const [departmentOotions, setDepartmentOptions] = useState([]);
    const [subdepartmentOotions, setSubDepartmentOptions] = useState([]);

    //Machine Master fields 
    const [machineName, setMachineName] = useState('')
    const [machineShortName, setMachineShortName] = useState('')
    const [txt_technicalspecification, setTechnicalSpecification] = useState('')
    const [txt_machineserialno, setMachineSerialNo] = useState('')
    const [dt_machineerectiondate, setMachineErectionDate] = useState('')
    const [plantId, setPlantId] = useState('')
    const [departmentId, setDepartmentId] = useState('')
    const [subDepartmentId, setSubDepartmentId] = useState('')
    const [num_machinestopagecapacity, setMachineStopagecapacity] = useState()
    const [ElectricalMachineNamedata, setElectricalMachineNamedata] = useState([]);
    const [txtprod_electrical_meter_id, setprod_electrical_meter_id] = useState(prod_electrical_meter_id);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')




    //function for fill all combo box
    const FillComboBox = async () => {
        const plantApiCall = await comboDataAPiCall.current.fillMasterData("cmv_plant", "", "");
        setPlantOptions(plantApiCall)
        resetGlobalQuery();
        const getDepartmentOptions = await comboDataAPiCall.current.fillMasterData("cmv_department", "department_type", "M");
        setDepartmentOptions(getDepartmentOptions);
    }

    //function for load subdepartment
    const loadSubDepartment = async () => {
        debugger

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
            setSubDepartmentOptions(subDepartmentAPIResponse)

            var depantmentId = document.getElementById('cmb_department').value
            var SubdepantmentId = document.getElementById('cmb_subdepartment').value
            var PlantdepantmentId = document.getElementById('cmb_plant').value

            if (depantmentId !== '') {
                resetGlobalQuery();
                globalQuery.columns.push("machine_id");
                globalQuery.columns.push("machine_name");
                globalQuery.table = "cmv_machine"
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "department_id", operator: "=", value: depantmentId });
                globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: SubdepantmentId });
                globalQuery.conditions.push({ field: "plant_id", operator: "=", value: PlantdepantmentId });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

                const machineNamedata = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setElectricalMachineNamedata(machineNamedata)
            }
        }
    }

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing`)
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');



    // function for setup combo box value on change
    const addRecordInProperty = async (key) => {
        switch (key) {
            case 'cmb_plant':
                const palnt_id = document.getElementById('cmb_plant').value;

                if (palnt_id === "0") {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Plant')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 100)
                }
                setPlantId(palnt_id)
                $('#error_cmb_plant').hide();
                break;
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

    useEffect(async () => {
        await ActionType();
        await FillComboBox();
        await loadSubDepartment();
        await FnCheckUpdateResponce();

    }, [])

    const addElectricalMeterData = async () => {
        debugger
        try {
            let checkIsValidate = await validate.current.validateForm("electricalMeterformId");
            var checkedCheckboxes = $("input:checkbox[name=checkmachinename]:checked");
            var numberOfCheckedCheckboxes = checkedCheckboxes.length;
            if (numberOfCheckedCheckboxes === 0) {
                checkIsValidate = false;
                setErrMsg('Please Check at Least One Machine Name.');
                setShowErrorMsgModal(true);
                setDetailsAccordEventKey(0);
            }

            $("input:checkbox[name=checkmachinename]:checked").each(function () {
                if ($(`#machine_meter_load_capacity_${$(this).val()}`).val() === '') {
                    checkIsValidate = false;
                    setErrMsg('Please Check at Least Machine Meter Load Capacity.');
                    setShowErrorMsgModal(true);
                    setDetailsAccordEventKey(0);
                    return false
                }
            })

            if (checkIsValidate) {
                var active;
                var activeValue = document.querySelector('input[name=isMachineActive]:checked').value
                switch (activeValue) {
                    case '0': active = false; break;
                    case '1': active = true; break;
                }

                let json = { 'TransHeaderData': {}, 'TransDetailData': [], 'commonIds': {} }

                const Electricalmeterdata = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    created_by: UserName,
                    modified_by: txtprod_electrical_meter_id === 0 ? null : UserName,
                    prod_electrical_meter_id: txtprod_electrical_meter_id,
                    prod_electrical_meter_name: machineName,
                    prod_electrical_meter_short_name: machineShortName,
                    prod_electrical_meter_tech_spect: txt_technicalspecification,
                    prod_electrical_meter_sr_no: txt_machineserialno,
                    prod_electrical_meter_errection_date: dt_machineerectiondate,
                    prod_plant_id: plantId,
                    prod_department_id: departmentId,
                    prod_sub_department_id: subDepartmentId,
                    prod_electrical_meter_load_capacity: num_machinestopagecapacity,
                    is_active: active
                };
                json.TransHeaderData = Electricalmeterdata;

                $("input:checkbox[name=checkmachinename]:checked").each(function () {
                    const bomfilteredDataElement = ElectricalMachineNamedata.find(item => item.machine_id === parseInt($(this).val()))
                    let crJson = {}

                    crJson['company_id'] = COMPANY_ID
                    crJson['company_branch_id'] = COMPANY_BRANCH_ID
                    crJson['machine_id'] = bomfilteredDataElement.machine_id
                    crJson['prod_electrical_meter_id'] = txtprod_electrical_meter_id
                    crJson['created_by'] = UserName
                    crJson['modified_by'] = txtprod_electrical_meter_id === 0 ? null : UserName
                    crJson['machine_meter_load_capacity'] = $(`#machine_meter_load_capacity_${$(this).val()}`).val()
                    json.TransDetailData.push(crJson)
                })
                json.commonIds.company_id = COMPANY_ID
                json.commonIds.company_branch_id = COMPANY_BRANCH_ID
                json.commonIds.prod_electrical_meter_id = txtprod_electrical_meter_id


                const formData = new FormData();
                formData.append(`XmElectricalMeterData`, JSON.stringify(json))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };

                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionElectricalMeter/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response: ", responce.data);
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    const evitCache = comboDataAPiCall.current.evitCache();
                    console.log(evitCache);
                    console.log("prod_electrical_meter_id", responce.data);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            navigate('/Error')
        }
    }

    const displayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Plant':
                return <FrmPlantEntry btn_disabled={true} />;
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
            case 'Plant':
                const plantApiCall = await comboDataAPiCall.current.fillMasterData("cmv_plant", "", "");
                setPlantOptions(plantApiCall)
                break;
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
        try {
            if (prod_electrical_meter_id !== 0) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionElectricalMeter/FnShowAllElectricalMeterAndMappingRecords/${prod_electrical_meter_id}/${COMPANY_ID}`)
                const updateRes = await apiCall.json();
                //const data = updateRes.data
                let electricalMasterData = updateRes.ElectricalMasterRecord;
                let electricalDetailsData = updateRes.ElectricalMasterMappingRecord;

                if (electricalMasterData !== null && electricalMasterData !== "") {

                    setprod_electrical_meter_id(electricalMasterData.prod_electrical_meter_id)
                    setMachineName(electricalMasterData.prod_electrical_meter_name)
                    setMachineShortName(electricalMasterData.prod_electrical_meter_short_name)
                    setMachineErectionDate(electricalMasterData.prod_electrical_meter_errection_date)
                    setPlantId(electricalMasterData.prod_plant_id)
                    setDepartmentId(electricalMasterData.prod_department_id)
                    await loadSubDepartment()
                    setSubDepartmentId(electricalMasterData.prod_sub_department_id)
                    setMachineStopagecapacity(electricalMasterData.prod_electrical_meter_load_capacity)
                    setMachineSerialNo(electricalMasterData.prod_electrical_meter_sr_no)
                    setTechnicalSpecification(electricalMasterData.prod_electrical_meter_tech_spect)
                    await loadSubDepartment()
                    electricalDetailsData.forEach(function (electricalDetailsDatacheck) {
                        $('#checkMachinenameId_' + electricalDetailsDatacheck.machine_id).prop('checked', true);
                        $('#machine_meter_load_capacity_' + electricalDetailsDatacheck.machine_id).val(electricalDetailsDatacheck.machine_meter_load_capacity);
                    });

                    switch (electricalMasterData.is_active) {
                        case true:
                            document.querySelector('input[name="isMachineActive"][value="1"]').checked = true;
                            break;
                        case false:
                            document.querySelector('input[name="isMachineActive"][value="0"]').checked = true;
                            break;
                    }



                }
            }

        } catch (error) {
            console.log("Error: ", error);
            navigate('/Error')
        }
    }
    const validateFields = () => {
        validate.current.validateFieldsOnChange('electricalMeterformId')
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                $("input[type=radio]").attr('disabled', false);
                $('#btn_save').attr('disabled', false);
                $('#btn_upload_doc').attr('disabled', false)
                $('#txt_machineshortnameshortName').attr('disabled', true)
                $('#txt_machineename').attr('disabled', true)
                $('#cmb_subdepartment').prop('disabled', true);
                $('#cmb_department').prop('disabled', true);
                $('#cmb_plant').prop('disabled', true);
                $('#txt_machineserialno').prop('disabled', true);
                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("electricalMeterformId");
                $('#btn_upload_doc').attr('disabled', true)
                $("input[type=radio]").attr('disabled', true);
                $('#chkAllMachineName').attr('disabled', true)
                break;

            default:
                setActionType('(Creation)');
                break;
        }
    };

    const updateMachineNameTblData = (row, event) => {
        debugger
        let clickedColName = event.target.getAttribute('Headers');
        const exptval = document.getElementById(event.target.id);
        if (event.target.value.trim() === '') {
            exptval.parentElement.dataset.tip = 'Please enter valid Machine Meter Load Capacity...!!'
        } else {
            delete exptval.parentElement.dataset.tip;
        }

        row[clickedColName] = event.target.value;
        let electricalmachinenameData = [...ElectricalMachineNamedata];
        const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowIndex'))
        electricalmachinenameData[arrayIndex] = row
        setElectricalMachineNamedata(electricalmachinenameData);
    }

    function toggleMachineNameChkBoxes(key) {
        switch (key) {

            case 'chkAllMachineName':
                $('.checkmachinename').prop('checked', $('#chkAllMachineName').is(":checked"));
                break;
            case 'PartiallyMachineNameSelection':
                $('#chkAllMachineName').prop('checked', $('input:checkbox.checkmachinename:checked').length === $('input:checkbox.checkmachinename').length);
                break;
        }
    }
    const renderTermsTable = useMemo(() => {
        return <>
            {ElectricalMachineNamedata.length !== 0 ?
                <div className="erp_table_scroll">
                    <Table className="erp_table showData" id='erp-Electricalterms-table' responsive bordered>
                        <thead className="erp_table_head">
                            <tr>
                                <th className="erp_table_th">Action</th>
                                <th className="erp_table_th">Machine Name </th>
                                <th className="erp_table_th">Machine Meter Load Capacity </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ElectricalMachineNamedata.map((machinenameData, Index) =>
                                    <tr rowIndex={Index}>
                                        <td className="erp_table_td">
                                            <input type="checkbox" className="checkmachinename" name="checkmachinename"
                                                id={'checkMachinenameId_' + machinenameData.machine_id}
                                                value={machinenameData.machine_id}
                                                onChange={() => toggleMachineNameChkBoxes('PartiallyMachineNameSelection')}
                                                disabled={keyForViewUpdate === 'view'} />
                                        </td>
                                        <td className="erp_table_td">
                                            <input type="text" name="machineNameDisabled" id={`machine_name_${machinenameData.machine_id}`}
                                                className="erp_input_field mb-0 "
                                                value={machinenameData.machine_name}
                                                onChange={(e) => { updateMachineNameTblData(machinenameData, e); }}
                                                Headers='machine_name'
                                                disabled="disabled" />
                                        </td>
                                        <td className="erp_table_td">
                                            <input type="text" id={`machine_meter_load_capacity_${machinenameData.machine_id}`}
                                                className="erp_input_field mb-0 "
                                                value={machinenameData.machine_meter_load_capacity}
                                                onChange={(e) => { updateMachineNameTblData(machinenameData, e); }}
                                                Headers='machine_meter_load_capacity'
                                                disabled={keyForViewUpdate === 'view'} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
                : null}
        </>
    }, [ElectricalMachineNamedata]);


    function validateKiloVolt(machineStoppageCapacity) {
        const kVRegex = /^(\d+(\.\d{1,2})?)/; // Regular expression for kV input with up to two decimal places
        if (kVRegex.test(machineStoppageCapacity)) {
            // Input matches the expected format
            const value = parseFloat(machineStoppageCapacity); // Extract the numerical value
            if (value >= 0 && value <= 1000) {
                // Valid kV value
                setMachineStopagecapacity(machineStoppageCapacity);
                return { isValid: true, value: value };
            }
        }
        // If the input is not in the correct format or out of range
        return { isValid: false, value: null };
    }

    return (
        <>
            <ComboBox ref={comboDataAPiCall} />

            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Electrical Meter Master{actionType} </label>
                    </div>
                    <form id="electricalMeterformId">
                        <div className="row erp_transporter_div">
                            {/* //first column */}
                            <div className="col-sm-6 erp_form_col_div">
                                {/* Machine Name Row */}
                                {/* Plant Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Plant <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_plant" className="form-select form-select-sm" value={plantId} onChange={() => { validateFields(); addRecordInProperty("cmb_plant") }} >
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>
                                            {plantOptions.length !== 0 ? (
                                                <>
                                                    {plantOptions?.map(plant => (
                                                        <option value={plant.field_id}>{plant.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_plant" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

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

                                {/* test case 3 shivanjali */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_machineename" value={machineName} onChange={e => { setMachineName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_machineename" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                {/* test case 4  shivanjali*/}
                                {/* Machine Short Name Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Short Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_machineshortnameshortName" value={machineShortName} onChange={e => { setMachineShortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="4" />
                                        <MDTypography variant="button" id="error_txt_machineshortname" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                {/* Machine Serial No Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Serial No <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_machineserialno" value={txt_machineserialno} onChange={e => { setMachineSerialNo(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_machineserialno" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                            </div>

                            {/* //second column */}


                            <div className="col-sm-6 erp_form_col_div">

                                {/* Technical Specification Row */}

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Tech. Specification <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_technicalspecification" value={txt_technicalspecification} onChange={e => { setTechnicalSpecification(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_technicalspecification" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>



                                {/* Machine Erection Date Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Errection Date </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="dt_machineerectiondate" className="erp_input_field optional" value={dt_machineerectiondate} onChange={e => { setMachineErectionDate(e.target.value); validateFields() }} />
                                        <MDTypography variant="button" id="error_dt_machineerectiondate" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* Machine Stopage Capacity Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Load Capacity(KiloVolt)<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="number" className="erp_input_field" id="num_machinestopagecapacity" value={num_machinestopagecapacity} onChange={e => { setMachineStopagecapacity(e.target.value); validateKiloVolt(e.target.value); validateFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_num_machinestopagecapacity" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>




                                {/*Machine Active Row */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Is Active <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Yes"
                                                    type="radio"
                                                    value="1"
                                                    name="isMachineActive"
                                                    defaultChecked

                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isMachineActive"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>

                <hr />
                {/* PO terms details */}
                <div className='row'>
                    <Accordion defaultActiveKey="0" >
                        <Accordion.Item eventKey="1">
                            <Accordion.Header className="erp-form-label-md">Mapped Machines</Accordion.Header>
                            <Accordion.Body>
                                <div class="col pt-sm-0">
                                    <input type='checkbox' class="" id="chkAllMachineName" onClick={(e) => toggleMachineNameChkBoxes('chkAllMachineName')} /> <label class="erp-form-label pb-1"> Check All </label>
                                </div>
                                <div className='row erp_table_scroll'>
                                    {renderTermsTable}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className='card-footer py-0 row pb-5'>
                    <div className="pb-5 text-center">
                        <MDButton type="button" className="erp-gb-button" variant="button" fontWeight="regular"

                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing/reg' : '/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing';
                                navigate(path);
                            }}

                        >Back</MDButton>
                        <MDButton type="button" id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={addElectricalMeterData} variant="button" fontWeight="regular"  >{actionLabel}</MDButton>
                    </div>
                </div>

                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


                {/* Add new Record Popup */}
                <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Body className='erp_city_modal_body'>
                        <div className='row'>
                            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                        </div>
                        {displayRecordComponent()}
                    </Modal.Body>
                </Modal >
            </div>
        </>
    )
} 
