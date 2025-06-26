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


function FrmPayrollSettingEntry() {

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

    const { state } = useLocation();
    const { hrpayroll_settings_id = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    // Some common hooks.
    const validate = useRef();
    const navigator = useNavigate();
    const comboDataFunc = useRef();
    const validateNumberDateInput = useRef();

    // Common hooks.
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    // Hooks for form's fields.
    // const [txt_activity_name, setActvityName] = useState();
    // const [txt_activity_description, setActvityDescription] = useState('');
    // const [txt_std_hour, setStdHour] = useState('');
    // const [rb_is_active, setIsActive] = useState('true');
    const [payrollSettingId, setHRPayrollSettingsId] = useState(hrpayroll_settings_id);
    const [txt_pf_limit, setPFLimit] = useState();
    const [txt_att_allow_days, setAttAllowDays] = useState();
    const [txt_night_allow_days, setNightAllowDays] = useState();
    const [txt_worker_min_wage, setWorkerMinWage] = useState();
    const [txt_short_leave_hrs, setShortLeaveHrs] = useState();
    const [txt_company_id, setCompanyID]=useState();
    const [is_delete,setIsDelete]=useState();

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
            if (hrpayroll_settings_id !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])

    //  ************* CRUD Functionality Starts. ****************************************
    const FnAddPayrollSettingEntry = async () => {
        try {
            debugger
            const checkIsValidate = await validate.current.validateForm('PayrollSettingFrm');
            if (checkIsValidate === true) {
                const data = {
                    pf_limit: txt_pf_limit,
                    attendance_allowance_days: txt_att_allow_days,
                    worker_minimum_wages: txt_worker_min_wage,
                    night_allowance_days: txt_night_allow_days,
                    short_leave_hours: txt_short_leave_hrs,
                    company_id:txt_company_id,
                    is_delete:is_delete
                };
                console.log(data);
                const requestOptions = {
                    method: 'PUT', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/payrollSettings/FnUpdateRecord/${hrpayroll_settings_id}`, requestOptions)
                const responce = await apicall.json()
                setPFLimit(responce.pf_limit);
                setAttAllowDays(responce.attendance_allowance_days);
                setWorkerMinWage(responce.worker_minimum_wages);
                setNightAllowDays(responce.night_allowance_days);
                setShortLeaveHrs(responce.short_leave_hours)
                if (responce.error!==null) {
                    setSuccMsg('Record updated Successfully')
                    setShowSuccessMsgModal(true);
                } else {
                    setErrMsg('Error while updating record')
                    setShowErrorMsgModal(true)
                }
            }
        } catch (error) {
            console.log('error: ', error)
            navigator('/Error')
        }
    };

    const FnCheckUpdateResponce = async () => {
        try {
            debugger
            const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/payrollSettings/FnShowAllReportRecords`)
            const responce = await fetchResponse.json();
            let apiResponce = responce.find((item)=>item.hrpayroll_settings_id===hrpayroll_settings_id)
            setPFLimit(apiResponce.pf_limit);
            setAttAllowDays(apiResponce.attendance_allowance_days);
            setWorkerMinWage(apiResponce.worker_minimum_wages);
            setNightAllowDays(apiResponce.night_allowance_days);
            setShortLeaveHrs(apiResponce.short_leave_hours)
            setCompanyID(apiResponce.company_id);
            setIsDelete(apiResponce.is_delete)
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
                setActionType('(Modification)');
                setActionLabel('Update')
                break;
            case 'view':
                $("form").find("input,textarea,select").attr("disabled", "disabled");
                setActionType('(View)');
                // setActionLabel('View')
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const moveToListing = () => {
        const Path = compType === 'Masters' ? `/Masters/MPayrollSetting/FrmPayrollSettingListing`: '/Masters/MPayrollSetting/FrmPayrollSettingEntry';
        navigator(Path);
    }
    // For remove the errors on field value change.
    const validateFields = () => {
        validate.current.validateFieldsOnChange('PayrollSettingFrm')
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
                        <label className='erp-form-label-lg text-center'>Payroll Setting {actionType} </label>
                    </div>
                    <form id='PayrollSettingFrm'>
                        <div className='row p-3'>
                            {/* first row */}
                            <div className='col-sm-6 '>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className='erp-form-label'>PF Limit<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_pf_limit' className='erp_input_field text-end' value={txt_pf_limit} onChange={e => { setPFLimit(e.target.value); validateFields(); }} maxLength='500' />
                                        <MDTypography variant='button' id='error_txt_pf_limit' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className='erp-form-label'>Attendance Allowance Days<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_att_allow_days' className='erp_input_field text-end' value={txt_att_allow_days} onChange={e => { setAttAllowDays(e.target.value); validateFields(); }} maxLength='19' />
                                        <MDTypography variant='button' id='error_txt_att_allow_days' classNa2me='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className='erp-form-label'>Worker Min Wages<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_worker_min_wage' className='erp_input_field text-end' value={txt_worker_min_wage} onChange={e => { setWorkerMinWage(e.target.value); validateFields(); }} maxLength='19' />
                                        <MDTypography variant='button' id='error_txt_worker_min_wage' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                            </div>

                            {/* second row */}
                            <div className='col-sm-6'>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className='erp-form-label'>Short Leave Hours<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_short_leave_hrs' className='erp_input_field text-end' value={txt_short_leave_hrs} onChange={e => { setShortLeaveHrs(e.target.value); validateFields(); }} maxLength='19' />
                                        <MDTypography variant='button' id='error_txt_short_leave_hrs' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className='erp-form-label'>Night Allowance Days<span className='required'>*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type='text' id='txt_night_allow_days' className='erp_input_field text-end' value={txt_night_allow_days} onChange={e => { setNightAllowDays(e.target.value); validateFields(); }} maxLength='19' />
                                        <MDTypography variant='button' id='error_txt_night_allow_days' className='erp_validation' fontWeight='regular' color='error' style={{ display: 'none' }}> </MDTypography>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </form>


                    <div className='card-footer py-0 text-center'>
                        <MDButton type='button' className='erp-gb-button' onClick={() => { moveToListing(); }} variant='button' fontWeight='regular'>Back</MDButton>
                        <MDButton type='submit' onClick={(e) => { FnAddPayrollSettingEntry(); }} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant='button' fontWeight='regular'>{actionLabel}</MDButton>
                    </div >
                </div>

                {/* Success/Error Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => FnCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                <ErrorModal handleCloseErrModal={() => FnCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </div>

        </>
    )
}

export default FrmPayrollSettingEntry;