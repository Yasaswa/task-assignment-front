
import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useNavigate, useLocation } from "react-router-dom";
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstrap
import Form from 'react-bootstrap/Form';
// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ConfigConstants from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';

function ModuleFormEntry() {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

    var activeValue = '';
    // var CompanyBranchId = sessionStorage.getItem('CompanyBranchId');
    // var modulesformsID = sessionStorage.getItem('modulesformsID');
    // const [modules_forms_id, setmodulesforms_Id] = useState(sessionStorage.getItem('modulesformsID') !== "" && sessionStorage.getItem('modulesformsID') !== null ? modulesformsID : 0);
    const { state } = useLocation();
    const { modulesformsID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    const [modules_forms_id, setmodulesforms_Id] = useState(modulesformsID)
    const comboBoxRef = useRef();
    const validate = useRef();

    // For navigate
    const navigate = useNavigate();

    //For Combo
    const [moduleIDoption, setModuleIDoption] = useState([]);
    const [submoduleIDoption, setSubmoduleIDoption] = useState([]);
    const [modulesmenuIDoption, setModulesmenuIDoption] = useState([]);
    const [modulesubmenuIDoption, setModulesubmenuIDoption] = useState([]);

    // Add Product Type Form Fields
    const [is_selected_flag, setIsSelectedFlag] = useState(true);

    const [cmb_module_id, setModuleId] = useState();
    const [cmb_sub_module_id, setSubModuleId] = useState('');
    const [cmb_modules_menu_id, setModulesMenuId] = useState('');
    const [cmb_modules_sub_menu_id, setModulesSubmenuId] = useState('');
    const [txt_modules_forms_name, setModulesFormsname] = useState('');
    const [txt_display_sequence, setDisplaySequence] = useState('');
    const [txt_display_name, setDisplayName] = useState('');
    const [txt_icon_class, setIconClass] = useState('');
    const [cmb_menu_type, setMenuType] = useState('');
    const [txt_listing_component_name, setListingComponentName] = useState('');
    const [txt_listing_component_import_path, setListingComponentImportPath] = useState('');
    const [txt_listing_navigation_url, setListingNavigationUrl] = useState('');
    const [txt_form_component_name, setFormComponentName] = useState('');
    const [txt_form_component_import_path, setFormComponentImportPath] = useState('');
    const [txt_form_navigation_url, setFormNavigationUrl] = useState('');
    const [txt_navigation_url, setNavigationUrl] = useState('');
    const [txt_page_header, setPageHeader] = useState('');

    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/ModuleFormListing`);
        }
    }

    useEffect(async () => {
        const functionCall = async () => {
            await comboDataOnLoad()
            await ActionType()
            if (modules_forms_id !== 0) {
                await FnCheckUpdateResponce();
            }
        }
        functionCall()
    }, [])


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            //  var modules_forms_id = sessionStorage.getItem("modulesformsID");
            if (modules_forms_id !== "undefined" && modules_forms_id !== '' && modules_forms_id !== null) {

                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesForms/FnShowParticularRecords/${modules_forms_id}/${COMPANY_ID}`)
                const updateRes = await apiCall.json();

                //   let resp = (updateRes.data)    

                setmodulesforms_Id(updateRes.modules_forms_id);
                setModuleId(updateRes.parent_module_id);
                await comboOnChange('Module');
                setSubModuleId(updateRes.sub_module_id);
                await comboOnChange('subModule');
                setModulesMenuId(updateRes.modules_menu_id);
                await comboOnChange('ModuleMenues');
                setModulesSubmenuId(updateRes.modules_sub_menu_id);
                await comboOnChange('ModuleSubMenues');
                setModulesFormsname(updateRes.modules_forms_name);
                setDisplaySequence(updateRes.module_form_display_sequence);
                setDisplayName(updateRes.display_name);
                setIconClass(updateRes.icon_class);
                setNavigationUrl(updateRes.navigation_url);
                setPageHeader(updateRes.page_header);
                setIsSelectedFlag(updateRes.is_selected == 1 ? "true" : "false");

                $('#saveBtn').show();

                switch (updateRes.is_active) {
                    case true:
                        document.querySelector('input[name="isactive"][value="1"]').checked = true;
                        break;
                    case false:
                        document.querySelector('input[name="isactive"][value="0"]').checked = true;
                        break;
                    default:
                        break;
                }
                // var keyForViewUpdate = sessionStorage.getItem('keyForViewUpdate');

                switch (keyForViewUpdate) {
                    case 'update':
                        $('#saveBtn').attr('disabled', false);
                        break;
                    case 'view':
                        $("input[type=radio]").attr('disabled', true);
                        $('#saveBtn').attr('disabled', true);
                        await validate.current.readOnly("moduleFormId");
                        break;
                    default:
                        break;
                }

            }

        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }
    const comboDataOnLoad = async () => {
        const getModuleList = await comboBoxRef.current.fillMasterData("amv_modules", "", "")
        setModuleIDoption(getModuleList)
    }

    const handleSubmit = async () => {

        try {
            const checkIsValidate = await validate.current.validateForm("moduleFormId");

            if (checkIsValidate === true) {
                let active;
                activeValue = document.querySelector('input[name=isactive]:checked').value

                switch (activeValue) {
                    case '1': active = true; break;
                    case '0': active = false; break;
                    default:
                        break;

                }
                const data = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    modules_forms_id: modules_forms_id,
                    module_id: cmb_module_id,
                    sub_module_id: cmb_sub_module_id,
                    modules_menu_id: cmb_modules_menu_id,
                    modules_sub_menu_id: cmb_modules_sub_menu_id,
                    modules_forms_name: txt_modules_forms_name,
                    display_sequence: txt_display_sequence,
                    display_name: txt_display_name,
                    icon_class: txt_icon_class,
                    navigation_url: txt_navigation_url,
                    page_header: txt_page_header,
                    is_selected: is_selected_flag,
                    is_active: active,
                    menu_type: cmb_menu_type,
                    listing_component_name: txt_listing_component_name,
                    listing_component_import_path: txt_listing_component_import_path,
                    listing_navigation_url: txt_listing_navigation_url,
                    form_component_name: txt_form_component_name,
                    form_component_import_path: txt_form_component_import_path,
                    form_navigation_url: txt_form_navigation_url,
                    created_by: UserName,
                    modified_by: modules_forms_id === 0 ? null : UserName,

                };

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesForms/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.success === '0') {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    var evitCache = await comboBoxRef.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('moduleFormId')
        // var formObj = $('#moduleFormId');
        // var inputObj;

        // for (var i = 0; i <= formObj.get(0).length - 1; i++) {
        //     inputObj = formObj.get(0)[i];
        //     if (inputObj.type === 'text' && inputObj.value !== '') {
        //         $("#error_" + inputObj.id).hide();
        //     } else if (inputObj.type === 'select-one' && inputObj.value !== '') {
        //         $("#error_" + inputObj.id).hide();
        //     } else if (inputObj.type === 'textarea' && inputObj.value !== '') {
        //         $("#error_" + inputObj.id).hide();
        //     } else if (inputObj.type === 'date' && inputObj.value !== '') {
        //         $("#error_" + inputObj.id).hide();
        //     }

        // }
    }
    const validateNo = (key) => {
        const numCheck = /^[0-9]*\.?[0-9]*$/;

        switch (key) {
            case 'sequence':
                var sequenceVal = $('#txt_display_sequence').val();
                if (numCheck.test(sequenceVal)) {
                    setDisplaySequence(sequenceVal)
                }
                break;
            default:
                break;


        }
    }


    const comboOnChange = async (key) => {
        switch (key) {
            case 'Module':
                var selectedModule = $('#cmb_module_id').val();
                setModuleId(selectedModule)
                if (selectedModule !== '0' && selectedModule !== '') {

                    const getSubModuleList = await comboBoxRef.current.fillMasterData("amv_modules", "parent_module_id", selectedModule)
                    setSubmoduleIDoption(getSubModuleList)
                }
                break;

            case 'subModule':
                var selectedSubModule = $('#cmb_sub_module_id').val();
                setSubModuleId(selectedSubModule)

                if (selectedSubModule !== '0' && selectedSubModule !== '') {
                    const getModuleMenuList = await comboBoxRef.current.fillMasterData("amv_modules_menu", "sub_modules_id", selectedSubModule)
                    setModulesmenuIDoption(getModuleMenuList)
                }
                break;

            case 'ModuleMenues':
                var selectedModuleMenu = $('#cmb_modules_menu_id').val();
                if (selectedModuleMenu === '0') {
                    setModulesMenuId(selectedModuleMenu)
                }
                resetGlobalQuery();
                globalQuery.columns.push("modules_sub_menu_name");
                globalQuery.columns.push("modules_sub_menu_id");
                globalQuery.table = "am_modules_sub_menu"
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });

                globalQuery.conditions.push({ field: "modules_menu_id", operator: "=", value: selectedModuleMenu });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                var submenues = await comboBoxRef.current.fillFiltersCombo(globalQuery)
                setModulesubmenuIDoption(submenues)
                break;

            case 'ModuleSubMenues':
                var selectedsubmenues = $('#cmb_modules_sub_menu_id').val();
                if (selectedsubmenues === '0') {
                    setModulesSubmenuId(selectedsubmenues)

                }
                break;
            default:
                break;
        }
    }
    // .....................................................................................................
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                // $('#txt_Holiday_Name').attr('disabled', true);

                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("moduleFormId");
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };


    return (
        <>
            <ComboBox ref={comboBoxRef} />
            <FrmValidations ref={validate} />

            <DashboardLayout>
                <div className='main_heding'>
                    <label className='erp-form-label-lg main_heding'>Module Form {actionType} </label>
                </div>
                <div className='card mt-3'>
                    <form id="moduleFormId">
                        <div className="row erp_transporter_div">

                            {/* first row */}


                            <div className="col-sm-6 erp_filter_group-by-result">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Module<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className='col'>
                                        <select id="cmb_module_id" className="form-select form-select-sm" value={cmb_module_id} onChange={(e) => { setModuleId(e.target.value); comboOnChange('Module'); validateFields(); }} >
                                            <option value="">Select</option>
                                            {
                                                moduleIDoption?.map(moduleidoption => (
                                                    <option value={moduleidoption.field_id}>{moduleidoption.field_name}</option>
                                                ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_module_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Sub Module<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className='col'>
                                        <select id="cmb_sub_module_id" className="form-select form-select-sm" value={cmb_sub_module_id} onChange={(e) => { setSubModuleId(e.target.value); comboOnChange('subModule'); validateFields(); }}>
                                            <option value="">Select</option>
                                            {submoduleIDoption?.map(submoduleidoption => (
                                                <option value={submoduleidoption.field_id}>{submoduleidoption.field_name}</option>
                                            ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_sub_module_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Modules Menu<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select id="cmb_modules_menu_id" className="form-select form-select-sm" value={cmb_modules_menu_id} onChange={(e) => { setModulesMenuId(e.target.value); comboOnChange('ModuleMenues'); validateFields(); }}>
                                            <option value="">Select</option>
                                            {modulesmenuIDoption?.map(modulesmenuidoption => (
                                                <option value={modulesmenuidoption.field_id}>{modulesmenuidoption.field_name}</option>
                                            ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_modules_menu_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Modules Sub Menu<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className='col'>
                                        <select id="cmb_modules_sub_menu_id" className="form-select form-select-sm" value={cmb_modules_sub_menu_id} onChange={(e) => { setModulesSubmenuId(e.target.value); comboOnChange('ModuleSubMenues'); validateFields(); }}>
                                            <option value="">Select</option>
                                            {modulesubmenuIDoption?.map(modulesubmenuidoption => (
                                                <option value={modulesubmenuidoption.modules_sub_menu_id}>{modulesubmenuidoption.modules_sub_menu_name}</option>
                                            ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_modules_sub_menu_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Modules Forms Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_modules_forms_name" className="erp_input_field" value={txt_modules_forms_name} onChange={e => { setModulesFormsname(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_modules_forms_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Display Sequence<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_display_sequence" className="erp_input_field  erp_align-right" value={txt_display_sequence} onChange={e => { validateNo('sequence'); validateFields(); }} maxLength="19" />
                                        <MDTypography variant="button" id="error_txt_display_sequence" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Menu Type<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className='col'>
                                        <select id="cmb_menu_type" className="form-select form-select-sm" value={cmb_menu_type} onChange={(e) => { setMenuType(e.target.value); validateFields(); }}>
                                            <option value="M">Master</option>
                                            <option value="T">Transactions</option>
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_menu_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Listing Component Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_listing_component_name" className="erp_input_field" value={txt_listing_component_name} onChange={e => { setListingComponentName(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_listing_component_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Listing Component Import<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_listing_component_import_path" className="erp_input_field" value={txt_listing_component_import_path} onChange={e => { setListingComponentImportPath(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_listing_component_import_path" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Listing Navigation URL<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_listing_navigation_url" className="erp_input_field" value={txt_listing_navigation_url} onChange={e => { setListingNavigationUrl(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_listing_navigation_url" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>



                            </div>

                            {/* second row */}

                            <div className="col-sm-6 erp_filter_group-by-result">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Form Component Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_form_component_name" className="erp_input_field" value={txt_form_component_name} onChange={e => { setFormComponentName(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_form_component_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Form Component Import<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_form_component_import_path" className="erp_input_field" value={txt_form_component_import_path} onChange={e => { setFormComponentImportPath(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_form_component_import_path" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Form Component Navigation<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_form_navigation_url" className="erp_input_field" value={txt_form_navigation_url} onChange={e => { setFormNavigationUrl(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_form_navigation_url" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Display Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_display_name" className="erp_input_field" value={txt_display_name} onChange={e => { setDisplayName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_display_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label"> Icon Class<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_icon_class" className="erp_input_field" value={txt_icon_class} onChange={e => { setIconClass(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_icon_class" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label"> Navigation Url<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_navigation_url" className="erp_input_field" value={txt_navigation_url} onChange={e => { setNavigationUrl(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_navigation_url" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label"> Page Header<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_page_header" className="erp_input_field" value={txt_page_header} onChange={e => { setPageHeader(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_page_header" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Module Is-Selected</Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck">
                                                <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="moduleActive" checked={is_selected_flag === "true"} onChange={(e) => { setIsSelectedFlag(e.target.value); validateFields(); }} />
                                            </div>

                                            <div className="sCheck">
                                                <Form.Check className="erp_radio_button" label="No" value="false" type="radio" name="moduleActive" checked={is_selected_flag === "false"} onChange={(e) => { setIsSelectedFlag(e.target.value); validateFields(); }} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Module Active</Form.Label>
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
                    <div className="erp_frm_Btns">
                        <MDButton type="button" className="erp-gb-button" onClick={() => { navigate(`/Masters/ModuleFormListing`) }} variant="button"
                            fontWeight="regular">Back</MDButton>
                        {/* <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className="erp-gb-button erp_MLeft_btn " variant="button"
                            fontWeight="regular">save</MDButton> */}
                        <MDButton type="submit" onClick={handleSubmit} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

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

export default ModuleFormEntry