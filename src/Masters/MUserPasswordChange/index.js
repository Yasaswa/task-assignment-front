import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';

import { useLocation, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import MDButton from "components/MDButton";
// Error Fields
import MDTypography from "components/MDTypography";
// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import ConfigConstants from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';

function MUserPasswordChange(props) {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, USER_CODE, UserId } = configConstants;

    const child = useRef();
    const validate = useRef();


    // Add Product Type Form Fields
    const [txt_current_password, setcurrent_password] = useState('');
    const [txt_new_password, setnew_password] = useState('');
    const [txt_confirm_password, setconfirm_password] = useState('');

    const [actionLabel, setActionLabel] = useState('Save')
    // For navigate
    const navigate = useNavigate();

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    // const handleCloseSuccessModal = () => { setShowSuccessMsgModal(false); }

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        navigate(`/DashBoard`);
        setShowSuccessMsgModal(false);
    };


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');
    useEffect(() => {
        const loadDataOnload = async () => {
        }
        loadDataOnload()
    }, [])


    const validateFields = () => {
        let formObj = $('#passwordchangeFormId');
        let inputObj;
        for (let i = 0; i <= formObj.get(0).length - 1; i++) {
            inputObj = formObj.get(0)[i];
            if (inputObj.type === 'text' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'password' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            }
        }
    }

    const FnResetPassword = async () => {
        debugger
        try {
            let passwordValidated = true;

            passwordValidated = await FnValidatePassword();
            if (passwordValidated === true) {
                const data = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    employee_id: UserId,
                    user_code: USER_CODE,
                    current_password: txt_current_password,
                    new_passsword: txt_new_password,
                    confirm_password: txt_confirm_password,
                };

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/UserPasswordReset/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()

                if (responce.status !== 1) {
                    setErrMsg(responce.message)
                    setShowErrorMsgModal(true)
                } else {
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

    const FnValidatePassword = async () => {
        // Validating header footer forms data.
        let headerDataIsValid = await validate.current.validateForm("passwordchangeFormId");
        if (!headerDataIsValid) { return false; }
        if (txt_new_password === txt_confirm_password) {
            return true;
        } else {
            $("#error_txt_confirm_password").text("The passwords you entered do not match. Please try again...!");
            $("#error_txt_confirm_password").show();
            $("#error_txt_confirm_password").focus();
            return false;
        }
    }


    const clearFormFields = () => {
        setcurrent_password('');
        setnew_password('');
        setconfirm_password('');
    }


    //hide and show password 
    const [showPassword, setShowPassword] = useState(false);
    const [shownewPassword, setShownewPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordhideandshow = (key) => {
        switch (key) {
            case 'currentpassword':
                setShowPassword(!showPassword);
                break;
            case 'newpassword':
                setShownewPassword(!shownewPassword);
                break;
            case 'confirmpassword':
                setShowConfirmPassword(!showconfirmPassword);
                break;
            default:
                break;
        }
    };


    return (
        <>
            <FrmValidations ref={validate} />

            <div className='erp_top_Form'>
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>User Password Change </label>
                    </div>
                    <form id="passwordchangeFormId">
                        <div className="row erp_transporter_div">
                            {/* first row */}

                            <div className="col-sm-3">
                            </div>

                            <div className="col-sm-6">

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Current Password <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <div className="input-group mb-2">
                                            <Form.Control type={showPassword ? 'text' : 'password'} className="erp_input_field number" id="txt_current_password" value={txt_current_password} onChange={(e) => { setcurrent_password(e.target.value.trim()); validateFields(); }} maxLength="50" />
                                            <span className="input-group-text" id="basic-addon2">
                                                {showPassword ? (<AiFillEye onClick={() => togglePasswordhideandshow('currentpassword')} />) : (<AiFillEyeInvisible onClick={() => togglePasswordhideandshow('currentpassword')} />)}
                                            </span>
                                        </div>
                                        <MDTypography variant="button" id="error_txt_current_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">New Password <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <div className="input-group mb-2">
                                            <Form.Control type={shownewPassword ? 'text' : 'password'} className="erp_input_field number" id="txt_new_password" value={txt_new_password} onChange={(e) => { setnew_password(e.target.value.trim()); validateFields(); }} maxLength="50" />
                                            <span className="input-group-text" id="basic-addon2">
                                                {shownewPassword ? (<AiFillEye onClick={() => togglePasswordhideandshow('newpassword')} />) : (<AiFillEyeInvisible onClick={() => togglePasswordhideandshow('newpassword')} />)}
                                            </span>
                                        </div>
                                        <MDTypography variant="button" id="error_txt_new_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Confirm Password <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <div className="input-group mb-2">
                                            <Form.Control type={showconfirmPassword ? 'text' : 'password'} className="erp_input_field number" id="txt_confirm_password" value={txt_confirm_password} onChange={(e) => { setconfirm_password(e.target.value.trim()); validateFields(); }} maxLength="50" />
                                            <span className="input-group-text" id="basic-addon2">
                                                {showconfirmPassword ? (<AiFillEye onClick={() => togglePasswordhideandshow('confirmpassword')} />) : (<AiFillEyeInvisible onClick={() => togglePasswordhideandshow('confirmpassword')} />)}
                                            </span>
                                        </div>
                                        <MDTypography variant="button" id="error_txt_confirm_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-3">
                            </div>
                        </div>
                    </form>
                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = '/DashBoard';
                                navigate(path);
                            }} variant="button" fontWeight="regular" disabled={props.btn_disabled ? true : false}>Exit</MDButton>
                        <MDButton type="submit" onClick={FnResetPassword} className={`erp-gb-button ms-2`} variant="button"
                            fontWeight="regular">Reset Password</MDButton>
                    </div >
                </div>
                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            </div>
        </>
    )
}

export default MUserPasswordChange
