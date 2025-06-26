import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstra
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import FrmDepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry"
import { resetGlobalQuery } from "assets/Constants/config-constant";
import { globalQuery } from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";


function FrmContractorCommissionEntry(props) {

    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { commissionId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const validate = useRef();
    const navigate = useNavigate()
    const comboDataFunc = useRef();


    //radio btn
    const [modalHeaderName, setHeaderName] = useState('')
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    //financial Year Feilds
    const [chk_job_type_category, setJobTypeCategory] = useState('Standard Rates');
    const [tx_commission_id, setCommissionId] = useState(commissionId);
    const [cmb_department_id, setDeparmentId] = useState([]);
    const [cmb_sub_department_id, setSubDeparmentId] = useState([]);
    const [cmb_skill_type, setSkillType] = useState([]);
    
    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    const [commissionType, setCommissionType] = useState('percent');
    const [commission_rate, setCommissionRate] = useState(0);
    const [cmb_resident_type, setResidentType] = useState('resident');
   
    // const [residentValue, setResidentValue] = useState(0);

    // hooks for combo
    const [departmentOption, setDepartmentOption] = useState([]);
    const [subDepartmentOption, setSubDepartmentOption] = useState([]);
    const [skillTypeOption, setSkillTypeOption] = useState([]);
    const [residentTypeOption, setResidentTypeOption] = useState([]);


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MContractorCommission/FrmContractorCommissionList`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            await fillComobos();
            if (commissionId !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])


    const addContractorCommission = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("contractCommissionform");
            if (checkIsValidate === true) {
                const data = {
                    // company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    commission_rate_id: tx_commission_id,
                    created_by: UserName,
                    modified_by: tx_commission_id === 0 ? null : UserName,
                    resident_type: cmb_resident_type,
                    commission_type:commissionType,
                    commission_rate:commission_rate,
                    department_id: cmb_department_id,
                    sub_department_id: cmb_sub_department_id,
                    skill_type: cmb_skill_type,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contractCommission/FnAddUpdateRecord`, requestOptions)
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
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                // $('#txt_job_type_name').attr('disabled', true)
                // $('#txt_job_type_short_name').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');

                await validate.current.readOnly("contractCommissionform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('contractCommissionform')
    }

    // const FnCombosOnChanges = async (key) => {
    //     debugger
    //     switch (key) {
    //         case 'department':
    //             const DepartmentVar = document.getElementById('cmb_department_id').value;
    //             setDeparmentId(DepartmentVar)

    //             resetGlobalQuery();
    //             globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
    //             globalQuery.table = "cmv_department"
    //             globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    //             globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
    //             globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: DepartmentVar });
    //             const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
    //             setSubDepartmentOption(subDepartmentopt)
    //             break;

    //         case 'sub_Department':
    //             debugger
    //             const subDepartmentVar = document.getElementById('cmb_sub_department_id').value;
    //             setSubDeparmentId(subDepartmentVar)
    //             resetGlobalQuery();
    //             globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
    //             globalQuery.table = "cmv_department"
    //             globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    //             globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
    //             const subDepartmentopts = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
    //             setSubDepartmentOption(subDepartmentopts)

    //             break;
    //         case 'SkillType':
    //             const skillTypeVar = document.getElementById('cmb_skill_type').value;
    //             setSkillType(skillTypeVar)
               
    //             $('#error_cmb_skill_type').hide();
    //             if (skillTypeVar === '0') {
    //                 sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
    //                 setHeaderName('Skill Type')
    //                 setShowAddRecModal(true)
    //                 setTimeout(() => {
    //                     $(".erp_top_Form").eq(1).css("padding-top", "0px");

    //                 }, 100)
    //             }
    //             break;


    //     }
    // }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contractCommission/FnShowParticularRecord/${tx_commission_id}`)
            const updateRes = await apiCall.json();
            const data = JSON.parse(updateRes.data)
            setCommissionId(data.commission_rate_id)
           
            setDeparmentId(data.department_id);
            FnCombosOnChange('department')
            setSubDeparmentId(data.sub_department_id);
            FnCombosOnChange('sub_Department')
            setSkillType(data.skill_type);
            setResidentType(data.resident_type)
            setCommissionType(data.commission_type)
            setCommissionRate(data.commission_rate);
            
            setIsActive(data.is_active);
          
            
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }

    const fillComobos = async () => {
       
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "department_type", operator: "=", value: "M" });
        const Departmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setDepartmentOption(Departmentopt)


        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
        const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setSubDepartmentOption(subDepartmentopt)

      
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'property_value'];
        globalQuery.table = "amv_properties"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "SkillLevels" });
        const skillType = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setSkillTypeOption(skillType)

        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'property_value'];
        globalQuery.table = "amv_properties"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "Resident Type" });
        const residentType = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
        setResidentTypeOption(residentType)

    }

    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Department':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: "" });
                const Department = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setDeparmentId(Department)
                break;

            case 'Sub Department':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_id", operator: "=", value: "" });
                const subDepartment = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setDeparmentId(subDepartment)
                break;

            case 'Skill Type':
                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'property_name'];
                globalQuery.table = "amv_properties"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const skillType = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSkillType(skillType)
                break;

        }


        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
        }, 200)

    }

   
    const FnCombosOnChange = async (key) => {
        debugger
        switch (key) {
            case 'Department':
                const DepartmentVar = document.getElementById('cmb_department_id').value;
                setDeparmentId(DepartmentVar)

                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name', 'department_short_name'];
                globalQuery.table = "cmv_department"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                globalQuery.conditions.push({ field: "department_type", operator: "=", value: "S" });
                globalQuery.conditions.push({ field: "parent_department_id", operator: "=", value: DepartmentVar });
                const subDepartmentopt = await comboDataFunc.current.removeCatcheFillCombo(globalQuery)
                setSubDepartmentOption(subDepartmentopt)

                $('#error_cmb_department_id').hide();
                if (DepartmentVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;

            case 'Sub Department':
                debugger
                const subDepartmentVar = document.getElementById('cmb_sub_department_id').value;
                setSubDeparmentId(subDepartmentVar)
              
                $('#error_cmb_sub_department_id').hide();
                if (subDepartmentVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Department')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;
            case 'SkillType':
                const skillTypeVar = document.getElementById('cmb_skill_type').value;
                setSkillType(skillTypeVar)
                const subDepartmentVars = document.getElementById('cmb_sub_department_id').value;
                

                $('#error_cmb_skill_type').hide();
                if (skillTypeVar === '0') {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Skill Type')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 100)
                }
                break;
                case 'resident_type':
                    const residentType = document.getElementById('cmb_resident_type').value;
                    setResidentType(residentType)
                    $('#error_cmb_resident_type').hide();
                   
                    break;
         


        }
    }
    const displayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Department':
                return <FrmDepartmentEntry btn_disabled={true} />;
            default:
                return null;
        }
    }

    const validateNo = (key) => {
        const numCheck = /^[0-9]*\.?[0-9]*$/;
        const regexNo = /^[0-9]*\.[0-9]{5}$/
        const percentCheck = /^(100(\.0{1,5})?|[0-9]{1,2}(\.[0-9]{1,5})?)$/; // Allows percentages from 0 to 100

        var dot = '.';
        // Clear previous error message
        $(`#error_commitions`).text('').hide(); // Hide the error message initially

        switch (key) {
            case 'commission_rate':
                debugger
                var commissionValueVal = $('#commission_value').val();
                if (commissionValueVal === "") {
                    commissionValueVal = "0";
                    setCommissionRate(commissionValueVal); // Optionally set the state to 0
                }
                if (!regexNo.test(commissionValueVal) && commissionValueVal.length <= 19 || commissionValueVal.indexOf(dot) === 19) {
                    if (commissionType === 'percent') {
                        // Validate as percent
                        if (percentCheck.test(commissionValueVal)) {
                            setCommissionRate(commissionValueVal); // Set the value if valid
                        } else {
                            $(`#error_commitions`).text('Percent value cannot exceed 100').show();


                        }
                    } else if (commissionType === 'amount') {
                        // Validate as amount (can be any number)
                        if (numCheck.test(commissionValueVal)) {
                            setCommissionRate(commissionValueVal);
                        }
                    }
                }
                break;
            
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
                        <label className='erp-form-label-lg text-center'>Contractor Commission {actionType} </label>
                    </div>
                    <form id="contractCommissionform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Department Name <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_department_id" className="form-select form-select-sm" value={cmb_department_id} onChange={(e) => { FnCombosOnChange('Department'); setDeparmentId(e.target.value); }}>
                                            <option value="">Select</option>
                                            <option value="0" disabled={props.btn_disabled}>Add New Record+</option>
                                            {departmentOption.length !== 0 ? (
                                                <>
                                                    {departmentOption?.map(deprtname => (
                                                        <option value={deprtname.field_id} departmentName={deprtname.department_short_name}>{deprtname.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Sub Department<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_sub_department_id" className="form-select form-select-sm" value={cmb_sub_department_id} onChange={(e) => { FnCombosOnChange('Sub Department'); setSubDeparmentId(e.target.value) }}>
                                            <option value="">Select</option>
                                            <option value="0" disabled={props.btn_disabled}>Add New Record+</option>
                                            {subDepartmentOption.length !== 0 ? (
                                                <>
                                                    {subDepartmentOption?.map(subDept => (
                                                        <option value={subDept.field_id} subDepartmentName={subDept.department_short_name}>{subDept.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_sub_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Skill Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_skill_type" className="form-select form-select-sm" value={cmb_skill_type} onChange={() => FnCombosOnChange('SkillType')}  >
                                            <option value="">Select</option>
                                            {skillTypeOption?.map(skillTypeOption => (
                                                <option value={skillTypeOption.field_name} skillTypeShortName={skillTypeOption.property_value}>{skillTypeOption.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_skill_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>




                            </div>

                            {/* second column */}
                            <div className="col-sm-6 erp_form_col_div">

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Resident Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_resident_type" className="form-select form-select-sm" value={cmb_resident_type}
                                        // onChange={(e) => {  setResidentType(e.target.value); }}
                                        onChange={() => FnCombosOnChange('resident_type')}
                                          >
                                            <option value="">Select</option>
                                            {residentTypeOption?.map(residentOption => (
                                                <option value={residentOption.field_name} residentShortName={residentOption.property_value}>{residentOption.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_resident_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Commission Type & Rate<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                          
                                            <div className="fCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Percent"
                                                    type="radio"
                                                    value="percent"
                                                    name="commission_type"
                                                    checked={commissionType === 'percent'}
                                                    onClick={() => setCommissionType('percent')}
                                                />
                                            </div>
                                          
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Amount"
                                                    type="radio"
                                                    value="amount"
                                                    name="commission_type"
                                                    checked={commissionType === 'amount'}
                                                    onClick={() => setCommissionType('amount')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <Form.Control
                                            type="text"
                                            id="commission_value"
                                            className="erp_input_field text-end"
                                            value={commission_rate}
                                            onChange={e => {
                                                validateNo('commission_rate');
                                            }}
                                            maxLength="19"
                                            placeholder={commissionType === 'percent' ? 'Enter percentage' : 'Enter amount'}
                                        />
                                        <MDTypography variant="button" id="error_commitions" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
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
                                const path = compType === 'Register' ? '/Masters/MContractorCommission/FrmContractorCommissionList/reg' : '/Masters/MContractorCommission/FrmContractorCommissionList';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={addContractorCommission} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>
                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                {showAddRecModal ? <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Body className='erp_city_modal_body'>
                        <div className='row'>
                            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                        </div>
                        {displayRecordComponent()}
                    </Modal.Body>
                </Modal > : null}
            </div>
        </>
    )
}

export default FrmContractorCommissionEntry;
