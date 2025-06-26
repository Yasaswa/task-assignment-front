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


function FrmFinancialYearEntry(props) {

    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { financialYearId = 0, keyForViewUpdate } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const validate = useRef();
    const navigate = useNavigate()

    //financial Year Feilds
    const [txt_financial_year_id, setFinancialYearId] = useState(financialYearId);
    const [txt_financial_year, setFinancialYear] = useState('');
    const [txt_short_name, setShortName] = useState('');
    const [txt_short_year, setShortYear] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [txt_remark, setRemark] = useState('');

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
            navigate(`/Masters/MFinancialYear/FrmFinancialYearListing`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            if (financialYearId !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])


    const addfinancialYear = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("financialYearform");
            if (checkIsValidate === true) {
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    financial_year_id: txt_financial_year_id,
                    created_by: UserName,
                    modified_by: txt_financial_year_id === 0 ? null : UserName,
                    short_name: txt_short_name,
                    financial_year: txt_financial_year,
                    short_year: txt_short_year,
                    end_date: end_date,
                    start_date: start_date,
                    remark: txt_remark,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/finaincialyear/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };


    const ActionType = async () => {
        switch (keyForViewUpdate) {
            // case 'update':
            //     setActionType('(Modify)');
            //     setActionLabel('Update')
            //     $('#rb_departmentType').attr('disabled', true)
            //     $('#departmentGroup').attr('disabled', true)
            //     $('#departmentName').attr('disabled', true)
            //     $('#shortName').attr('disabled', true)
            //     break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("financialYearform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('financialYearform')
    }

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/finaincialyear/FnShowParticularRecord/${COMPANY_ID}/${txt_financial_year_id}`)
            const updateRes = await apiCall.json();
            const data = JSON.parse(updateRes.data)
            setFinancialYearId(data.financial_year_id)
            setFinancialYear(data.financial_year)
            setShortName(data.short_name);
            setShortYear(data.short_year);
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setRemark(data.remark);
            setIsActive(data.is_active);
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }

    return (
        <>
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Financial Year{actionType} </label>
                    </div>
                    <form id="financialYearform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Financial Year <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="txt_financial_year" value={txt_financial_year} onChange={e => { setFinancialYear(e.target.value); validateFields() }} maxLength="20" />
                                        <MDTypography variant="button" id="error_txt_financial_year" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Short Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_short_name" className="erp_input_field" value={txt_short_name} onChange={(e) => { setShortName(e.target.value.toUpperCase()); validateFields() }} maxLength="5" />
                                        <MDTypography variant="button" id="error_txt_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Short Year <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id="txt_short_year" className="erp_input_field" value={txt_short_year} onChange={(e) => { setShortYear(e.target.value.toUpperCase()); validateFields() }} maxLength="5" />
                                        <MDTypography variant="button" id="error_txt_short_year" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Start Date <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="start_date" className="erp_input_field" value={start_date} onChange={e => { setStartDate(e.target.value); validateFields() }} />
                                        <MDTypography variant="button" id="error_start_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second column */}
                            <div className="col-sm-6 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> End Date <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="end_date" className="erp_input_field" value={end_date} onChange={e => { setEndDate(e.target.value); validateFields() }} />
                                        <MDTypography variant="button" id="error_end_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Remark <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control as="textarea" id="txt_remark" className="erp_input_field" value={txt_remark} onChange={e => { setRemark(e.target.value); validateFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
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
                        <MDButton type="button" className="erp-gb-button" onClick={() => { navigate(`/Masters/MFinancialYear/FrmFinancialYearListing`) }} variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={addfinancialYear} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
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

export default FrmFinancialYearEntry;
