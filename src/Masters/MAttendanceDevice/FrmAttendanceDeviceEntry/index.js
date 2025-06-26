
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import ComboBox from "Features/ComboBox";

function FrmAttendanceDeviceEntry(props) {

    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const {attendance_device_id = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const validate = useRef();
    const navigate = useNavigate()
    const comboDataFunc = useRef();

    //financial Year Feilds
    const [txt_attendance_device_id, setAttendanceDeviceId] = useState(attendance_device_id);
    const [txt_attendance_device_name, setAttendanceDeviceName] = useState('');
    const [txt_attendance_device_ip_address, setAttendanceDeviceIpAddress] = useState('');
    const [txt_attendance_device_port_no, setAttendaceDevicePortNo] = useState('');
    const [chk_isactive, setIsActive] = useState(true);
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
            navigate(`/Masters/MAttendanceDevice/FrmAttendanceDeviceListing`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            if (attendance_device_id !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])


    const addAttendanceDevice = async () => {
        debugger
        try {
            const checkIsValidate = await validate.current.validateForm("attendanceDeviceform");
            if (checkIsValidate === true) {
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    attendance_device_id: txt_attendance_device_id,
                    created_by: UserName,
                    modified_by: txt_attendance_device_id === 0 ? null : UserName,
                    attendance_device_ip_address: txt_attendance_device_ip_address,
                    attendance_device_name: txt_attendance_device_name,
                    attendance_device_port_no: txt_attendance_device_port_no,
                    is_active: chk_isactive,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmAttendanceDevice/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    const evitCache = comboDataFunc.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
        }

    };

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                // $('#txt_attendance_device_name').attr('disabled', true)
                // $('#txt_attendance_device_ip_address').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');

                await validate.current.readOnly("attendanceDeviceform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('attendanceDeviceform')
    }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmAttendanceDevice/FnShowParticularRecordForUpdate/${COMPANY_ID}/${txt_attendance_device_id}`)
            const updateRes = await apiCall.json();
            //const data = JSON.parse(updateRes.data)
            const data = updateRes.data;
            setAttendanceDeviceId(data.attendance_device_id)
            setAttendanceDeviceName(data.attendance_device_name)
            setAttendanceDeviceIpAddress(data.attendance_device_ip_address);
            setAttendaceDevicePortNo(data.attendance_device_port_no);
            setIsActive(data.is_active);
        } catch (error) {
            console.log("error: ", error)
        }

    }

    return (
        <>
            <ComboBox ref={comboDataFunc} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Attendance Device{actionType} </label>
                    </div>
                    <form id="attendanceDeviceform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Attendance Device Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_attendance_device_name" value={txt_attendance_device_name} onChange={e => { setAttendanceDeviceName(e.target.value); validateFields() }} maxLength="255"  />
                                        {/* disabled={keyForViewUpdate === 'update'} */}
                                        <MDTypography variant="button" id="error_txt_attendance_device_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">I.P.Address <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_attendance_device_ip_address" className="erp_input_field" value={txt_attendance_device_ip_address} onChange={(e) => { setAttendanceDeviceIpAddress(e.target.value); validateFields() }} maxLength="20" />
                                        <MDTypography variant="button" id="error_txt_attendance_device_ip_address" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second column */}
                            <div className="col-sm-6 erp_form_col_div">
                            <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Port No <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_attendance_device_port_no" className="erp_input_field" value={txt_attendance_device_port_no} onChange={(e) => { setAttendaceDevicePortNo(e.target.value.toUpperCase()); validateFields() }} maxLength="4"  />
                                        <MDTypography variant="button" id="error_txt_attendance_device_port_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
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

                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MAttendanceDevice/FrmAttendanceDeviceListing/reg' : '/Masters/MAttendanceDevice/FrmAttendanceDeviceListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={addAttendanceDevice} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

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

export default FrmAttendanceDeviceEntry;
