import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstrap
import Form from 'react-bootstrap/Form';
// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from "FrmGeneric/FrmValidations";
import ComboBox from "Features/ComboBox";

function FrmDestinationEntry() {
    // Call ConfigConstants to get the configuration constants
    // changes by ujjwala 3/1/2024 case no 2. start
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { destinationID = 0, keyForViewUpdate, compType = 'Masters' } = state || {}
    //end
    var activeValue = '';
    const navigate = useNavigate();
    const validate = useRef();
    const combobox = useRef();

    // Add Designation Form Fields
    const [txt_Destination_id, setDestinationId] = useState(destinationID)
    const [txt_Destination_name, setDestinationName] = useState('');
    const [txt_Distance, SetDistance] = useState('');
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
            navigate(`/Masters/DestinationListing`)
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(async () => {
        await ActionType()
        if (txt_Destination_id !== 0) {
            await FnCheckUpdateResponce();
        }
    }, [])
    // changes by ujjwala 3/1/2024 case no 2. start
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update');
                break;

            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("destinationForm");
                $("input[type=radio]").attr('disabled', true);
                break;

            default:
                setActionType('(Create)');
                break;
        }

    };

    //end
    const handleSubmit = async () => {
        const checkIsValidate = await validate.current.validateForm("destinationForm");
        if (checkIsValidate === true) {
            var active;
            activeValue = document.querySelector('input[name=isDestinationActive]:checked').value

            switch (activeValue) {
                case '0': active = false; break;
                case '1': active = true; break;
            }
            const data = {
                company_id: COMPANY_ID,
                destination_id: txt_Destination_id,
                created_by: UserName,
                modified_by: txt_Destination_id === null ? null : UserName,
                destination_name: txt_Destination_name,
                distance: txt_Distance,
                is_active: active,
            };
            console.log(data);

            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            fetch(`${process.env.REACT_APP_BASE_URL}/api/destination/FnAddUpdateRecord`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((responce) => {
                responce.json().then((responce) => {
                    console.log(responce);
                    console.log("response error: ", responce.data);
                    if (responce.error !== "") {
                        console.log("response error: ", responce.error);
                        setErrMsg(responce.error)
                        setShowErrorMsgModal(true)

                    } else {
                        var data = JSON.stringify(responce.data)
                        sessionStorage.setItem("txt_Destination_id", data.destination_id);
                        const evitCache = combobox.current.evitCache();
                        console.log(evitCache);
                        console.log("txt_Destination_id", data.destination_id);
                        clearFormFields();
                        setSuccMsg(responce.message);
                        setShowSuccessMsgModal(true);
                    }
                }).catch(error => {
                    console.error('Error!', error);
                    navigate('/Error')
                });
            })
        }

    };

    const clearFormFields = () => {
        setDestinationName('');
        SetDistance('');

    }

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/destination/FnShowParticularRecordForUpdate/${txt_Destination_id}`)
            const updateRes = await apiCall.json();
            setDestinationId(updateRes.data.destination_id);
            setDestinationName(updateRes.data.destination_name);
            SetDistance(updateRes.data.distance);

        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }


    const validateNo = (noKey) => {
        const regexNo = /^(\d+)[.,]?(\d{1,4})[ ]?(mm|m|cm|km)$/;
        switch (noKey.target.id) {
            case 'DistanceId':
                if (noKey.target.value !== '' || regexNo.test(noKey.target.value)) {
                    if (noKey.target.value === 'NaN') {
                        SetDistance("")
                    } else {
                        SetDistance(noKey.target.value)
                    }
                }
                break;
        }


    }

    const validateFields = () => {
        validate.current.validateFieldsOnChange('destinationForm')
    }

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={combobox} />
            <div className='erp_top_Form'>

                <div className='card p-1'>
                    <div className='card-header text-center py-1'>
                        <label className='erp-form-label-lg text-center'>Destination Information{actionType} </label>
                    </div>
                    <form id="destinationForm">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6">

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Destination Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="destinationName" className="erp_input_field" value={txt_Destination_name} onChange={e => { setDestinationName(e.target.value); validateFields() }} maxLength="200" />
                                        <MDTypography variant="button" id="error_destinationName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Distance (Km)<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="DistanceId" className="erp_input_field text-end" value={txt_Distance} onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                                        }} onChange={e => { validateNo(e); validateFields() }} />
                                        <MDTypography variant="button" id="error_DistanceId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form>

                                            <div className="erp_form_radio">
                                                <div className="fCheck">
                                                    <Form.Check
                                                        className="erp_radio_button"
                                                        label="Yes"
                                                        type="radio"
                                                        value="1"
                                                        name="isDestinationActive"
                                                        defaultChecked

                                                    />
                                                </div>
                                                <div className="sCheck">
                                                    <Form.Check
                                                        className="erp_radio_button"
                                                        label="No"
                                                        value="0"
                                                        type="radio"
                                                        name="isDestinationActive"

                                                    />
                                                </div>
                                            </div>
                                        </Form>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </form>

                    <div className="erp_frm_Btns">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/DestinationListing/reg' : '/Masters/DestinationListing';
                                navigate(path);
                            }}

                            variant="button"
                            fontWeight="regular">Back</MDButton>
                        {/* // changes by ujjwala 3/1/2024 case no 2. start */}
                        <MDButton type="submit" onClick={handleSubmit} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                        {/* //end  */}

                    </div >
                </div>

                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            </div>

        </>

    )
}

export default FrmDestinationEntry
