import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// import react icons
import { useLocation, useNavigate } from "react-router-dom";

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';


function FrmPropertyEntry({ property_master_name = '', btn_disabled = false ,  propertyInfo}) {
    var activeValue = '';

    //changes by ujjwala on 6/1/2024 case no . 1
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;

    const { property_id_prop, property_group_prop, key } = propertyInfo || ''

    const { state } = useLocation();
    const { propertyid = 0, keyForViewUpdate, compType } = state || {}

    const child = useRef();
    const validate = useRef();
    //end by ujjwala
    // For navigate
    const navigate = useNavigate();

    // Add Product Type Form Fields
    const [property_id, setPropertyid] = useState(propertyid);
    const [propertymasterIdOption, setPropertyOption] = useState([]);
    const [property_master_id, setPropertyMasterId] = useState(property_id_prop || '');
    const [txt_property_name, setPropertyName] = useState('');
    const [txt_property_value, setProductValue] = useState('');
    const [txt_property_group, setPropertyGroup] = useState(property_group_prop || '');
    const [txt_remark, setRemark] = useState('');
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
            navigate(`/Masters/FrmPropertyListing`);
        }
    }
    //changes by ujjwala on 6/1/2024 case no . 1
    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            await propsFunction()
            await comboDataOnLoad();
            if (property_id !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const propsFunction = async () => {
        if (key==='Add'){
                $('#property_master_id').attr('disabled', true);
                $('#txt_property_group').attr('disabled', true);}
    };

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                if (key==='Add'){setActionType('(Creation)')}
                setActionLabel('Update')
                $('#property_master_id').attr('disabled', true);
                if (actionType === '(Modification)') { $('#txt_property_name').attr('disabled', true)}
               
                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("propertyFormId");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('propertyFormId')
    }

    //end by ujjwala
    const FnCheckUpdateResponce = async () => {
         try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/properties/FnShowParticularRecordForUpdate/${property_id}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();

            let resp = (updateRes.data)
            setPropertyid(resp.property_id);
            setPropertyMasterId(resp.property_master_id);
            setPropertyName(resp.property_name);
            setProductValue(resp.property_value);
            setPropertyGroup(resp.property_group);
            setRemark(resp.remark);

            $('#saveBtn').show();

            switch (resp.is_active) {
                case true:
                    document.querySelector('input[name="isactive"][value="1"]').checked = true;
                    break;
                case false:
                    document.querySelector('input[name="isactive"][value="0"]').checked = true;
                    break;
                default: break;
            }


        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }

    const comboDataOnLoad = async () => {
        resetGlobalQuery();
        globalQuery.columns.push("properties_master_name");
        globalQuery.columns.push("properties_master_id");
        globalQuery.table = "am_properties_master"
        // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
        var getPropertiesApiCall = await child.current.fillFiltersCombo(globalQuery)
        setPropertyOption(getPropertiesApiCall);

        if (property_master_name !== '') {
            const foundedProperty = getPropertiesApiCall.find(propertyMaster => propertyMaster.properties_master_name === property_master_name);
            if (foundedProperty) {
                setPropertyMasterId(foundedProperty.properties_master_id);
                $('#property_master_id').prop('disabled', 'disabled')
            }
        }

    }

    const handleSubmit = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("propertyFormId");
            if (checkIsValidate === true) {
                var active;
                activeValue = document.querySelector('input[name=isactive]:checked').value

                switch (activeValue) {
                    case '1': active = true; break;
                    case '0': active = false; break;
                    default: break;
                }
                const data = {
                    company_id: COMPANY_ID,
                    property_id: property_id,
                    created_by: UserName,
                    modified_by: property_id === 0 ? null : UserName,
                    property_master_id: property_master_id,
                    properties_master_name: $("#property_master_id option:selected").text(),
                    property_name: txt_property_name,
                    property_value: txt_property_value,
                    property_group: txt_property_group,
                    remark: txt_remark,
                    is_active: active,

                };
                console.log(data);
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/properties/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.success === '0') {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    const evitCache = child.current.evitCache();
                    console.log(evitCache);
                    sessionStorage.setItem("propertyId", responce.data.property_id)
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                    clearFormFields();
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };

    const clearFormFields = () => {
        setPropertyMasterId('');
        setPropertyName('');
        setProductValue('');
        setPropertyGroup('');
        setRemark('');

    }


    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={child} />
            <div className='erp_top_Form'>
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Property Master{actionType} </label>
                    </div>
                    <form id="propertyFormId">
                        <div className="row erp_transporter_div">

                            {/* first row */}
                            <div className="col-sm-6 ">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Property Master<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select id="property_master_id" className="form-select form-select-sm" value={property_master_id} onChange={(e) => { setPropertyMasterId(e.target.value); validateFields(); }}>
                                            <option value="">Select</option>
                                            {
                                                propertymasterIdOption?.map(propertyoption => (
                                                    <option value={propertyoption.properties_master_id}>{propertyoption.properties_master_name}</option>
                                                ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_property_master_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Property Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_property_name" className="erp_input_field" value={txt_property_name} onChange={e => { setPropertyName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_property_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Property Value<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_Property_value" className="erp_input_field" value={txt_property_value} onChange={e => { setProductValue(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_Property_value" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second row */}

                            <div className="col-sm-6 ">
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Property Group</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_property_group" className="erp_input_field" value={txt_property_group} onChange={e => { setPropertyGroup(e.target.value); validateFields(); }} optional="optional" maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_property_group" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label"> Remark</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control as="textarea" id="txt_remark" className="erp_input_field" value={txt_remark} onChange={e => { setRemark(e.target.value); validateFields(); }} optional="optional" maxLength="1000" />
                                        <MDTypography variant="button" id="error_txt_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
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

                    {/* //changes by ujjwala on 6/1/2024 case no . 4 */}
                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"

                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/FrmPropertyListing/reg' : '/Masters/FrmPropertyListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={btn_disabled ? true : false}
                        >Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                    </div >
                    {/* end by ujjwala */}
                </div >

                {/* Success Msg Popup */}
                < SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()
                } show={[showSuccessMsgModal, succMsg]} />
                {/* Error Msg Popup */}
                < ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            </div >
        </>
    )
}

export default FrmPropertyEntry