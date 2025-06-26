import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';

// Common components. 
import ConfigConstants from 'assets/Constants/config-constant';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';

// Material Dashboard 2 PRO React components
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import FrmValidations from 'FrmGeneric/FrmValidations';
import ComboBox from 'Features/ComboBox';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import { COMPANY_BRANCH_ID } from 'assets/Constants/config-constant';


function FrmMServiceActivityEntry({ master_name = '', btn_disabled = false }) {

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

    const { state } = useLocation();
    const { prodServiceActivityId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    // Some common hooks.
    const validate = useRef();
    const navigator = useNavigate();
    const comboDataFunc = useRef();
    const validateNumberDateInput = useRef();

    // Common hooks.
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    // Hooks for form's fields.
    const [product_service_activity_master_id, setProductServiceActivityMasterId] = useState(prodServiceActivityId);
    const [txt_activity_name, setActvityName] = useState(master_name);
    const [txt_activity_description, setActvityDescription] = useState('');
    const [txt_std_hour, setStdHour] = useState('');
    const [rb_is_active, setIsActive] = useState('true');

    // Error Pop-Up Modal Fields.
    const FnCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Pop-Up Modal Fields.
    const FnCloseSuccessModal = () => {
        debugger
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            moveToListing();
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');


    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            if (prodServiceActivityId !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])

    //  ************* CRUD Functionality Starts. ****************************************
    const FnAddServiceActivity = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm('ProductServiceActivityFrm');
            if (checkIsValidate === true) {
                const data = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    product_service_activity_master_id: product_service_activity_master_id,
                    activity_name: txt_activity_name,
                    activity_description: txt_activity_description,
                    std_hour: txt_std_hour,
                    created_by: UserName,
                    modified_by: product_service_activity_master_id === null ? null : UserName,
                    is_active: rb_is_active,
                };
                console.log(data);
                const requestOptions = {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductServiceActivityMaster/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log('response error: ', responce);
                if (responce.error !== '') {
                    console.log('response error: ', responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    const evitCache = await comboDataFunc.current.evitCache();

                    setProductServiceActivityMasterId(responce.data.product_service_activity_master_id);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log('error: ', error)
            navigator('/Error')
        }
    };

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductServiceActivityMaster/FnShowParticularRecordForUpdate/${prodServiceActivityId}/${COMPANY_ID}`)
            const apiResponce = await apiCall.json();
            setProductServiceActivityMasterId(apiResponce.data.product_service_activity_master_id);
            setActvityName(apiResponce.data.activity_name);
            setActvityDescription(apiResponce.data.activity_description);
            setStdHour(apiResponce.data.std_hour);
            setIsActive(apiResponce.data.is_active.toString());
        } catch (error) {
            console.log('error', error)
            navigator('/Error')
        }
    }
    //  ************* CRUD Functionality Ends. ****************************************

    //  ************* Common Functions Starts. ****************************************
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                $('#txt_activity_name').prop('readonly', true);
                setActionType('(Modification)');
                setActionLabel('Update')
                break;
            case 'view':
                $("form").find("input,textarea,select").attr("disabled", "disabled");
                setActionType('(View)');
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const moveToListing = () => {
        const Path = compType === 'Register' ? '/Masters/ServiceActivityListing/reg' : `/Masters/ServiceActivityListing`;
        navigator(Path);
    }

    // For remove the errors on field value change.
    const validateFields = () => {
        validate.current.validateFieldsOnChange('ProductServiceActivityFrm')
    }

    //  ************* Common Functions Ends. ****************************************


    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataFunc} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />

            <div className='erp_top_Form'>
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Product Service Activity {actionType} </label>
                    </div>
                    <form id='ProductServiceActivityFrm'>
                        <div className='row p-3'>
                            {/* first row */}
                            <div className='col-sm-6 '>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className='erp-form-label'>Activity Name<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_activity_name' className='erp_input_field' value={txt_activity_name} onChange={e => { setActvityName(e.target.value); validateFields(); }} maxLength='500' disabled={master_name.trim() !== ''} />
                                        <MDTypography variant='button' id='error_txt_activity_name' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className='erp-form-label'>Std. Hrs.<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_std_hour' className='erp_input_field text-end' value={txt_std_hour} onChange={e => { setStdHour(validateNumberDateInput.current.decimalNumber(e.target.value, 4)); validateFields(); }} maxLength='19' />
                                        <MDTypography variant='button' id='error_txt_std_hour' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second row */}
                            <div className='col-sm-6'>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className='erp-form-label'>Activity Desc.<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control as='textarea' rows={3} id='txt_activity_description' className='erp_txt_area' value={txt_activity_description} onInput={e => { setActvityDescription(e.target.value); }} maxlength='1000' />
                                        <MDTypography variant='button' id='error_txt_activity_description' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}></MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className='erp-form-label'>Is Active</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <div className='erp_form_radio'>
                                            <div className='fCheck'> <Form.Check className='erp_radio_button' label='Yes' type='radio' lbl='Yes' value='true' name='rb_is_active' checked={rb_is_active === 'true'} onClick={() => setIsActive('true')} /> </div>
                                            <div className='sCheck'> <Form.Check className='erp_radio_button' label='No' type='radio' lbl='No' value='false' name='rb_is_active' checked={rb_is_active === 'false'} onClick={() => setIsActive('false')} /> </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </form>


                    <div className='card-footer py-0 text-center'>
                        <MDButton type='button' className='erp-gb-button' onClick={() => { moveToListing(); }} variant='button' disabled={btn_disabled ? true : false} fontWeight='regular'>Back</MDButton>
                        <MDButton type='submit' onClick={(e) => { FnAddServiceActivity(); }} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant='button' fontWeight='regular'>{actionLabel}</MDButton>
                    </div >
                </div>

                {/* Success/Error Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => FnCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                <ErrorModal handleCloseErrModal={() => FnCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </div>

        </>
    )
}

export default FrmMServiceActivityEntry;