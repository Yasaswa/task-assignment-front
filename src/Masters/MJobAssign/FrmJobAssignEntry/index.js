import React, { useEffect, useRef, useMemo } from 'react'
import { useState } from 'react'
import $, { data } from 'jquery';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { Form, Table } from 'react-bootstrap';
import Tooltip from "@mui/material/Tooltip";
import ComboBox from 'Features/ComboBox';
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from "assets/Constants/config-constant";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import FrmValidations from 'FrmGeneric/FrmValidations';
import GenerateTAutoNo from 'FrmGeneric/GenerateTAutoNo';
import { CircularProgress } from '@material-ui/core';
import { RxCrossCircled } from "react-icons/rx";
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { Modal } from 'react-bootstrap';
import DepartmentEntry from 'Masters/MDepartment/FrmDepartmentEntry';
import { useNavigate } from 'react-router-dom';


function FrmJobAssignEntry() {
    // Config Constant
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, EARNING_DEDUCTION_MAPPING_BASE } = configConstants;

    const [action_Label, setActionLabel] = useState('(Add)');

    const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
    const [shiftOptions, setShiftOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subDepartmentGroupOptions, setSubDepartmentGroupOptions] = useState([]);

    //Form Hooks
    const [dt_attendance_date, setAttendanceDate] = useState();
    const [cmb_shift, setShift] = useState();
    const [cmb_employee_type, setEmployeeType] = useState('');
    const [cmb_department_id, setDepartmentId] = useState('');
    const [cmb_subdepartment_group_id, setSubDepartmentGroupId] = useState('');

    const [jobAssignTableDetails, setJobAssignTableDetails] = useState([]);

    //end
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    //useRef Hooks
    const comboDataAPiCall = useRef();
    const validate = useRef();
    const navigate = useNavigate();

    useEffect(async () => {
        await FillCombos();
    }, []);

    // Show ADd record Modal
    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Department':
                await comboBoxesOnChange("DepartmentGroup");
                break;

            case 'Sub Department':
                await comboBoxesOnChange("Department");
                break;

            default:
                break;
        }
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => { $(".erp_top_Form").css({ "padding-top": "0px" }); }, 200)

    }

    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const displayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Department':
                return <DepartmentEntry btn_disabled={true} />;
            case 'Sub Department':
                return <DepartmentEntry btn_disabled={true} departmentType="S" />;
            default:
                return null;
        }
    }

    const FillCombos = async () => {
        debugger
        //Setting Shift Options
        const shiftsApiCall = await comboDataAPiCall.current.fillComboBox('ProductionShifts');
        setShiftOptions(shiftsApiCall);

        //Set Employee Options
        comboDataAPiCall.current.fillComboBox("EmployeeType").then((getEmployeeTypeApiCall) => {
            setEmployeeTypeOptions(getEmployeeTypeApiCall);
        })

        //Set Department Options
        resetGlobalQuery();
        globalQuery.columns.push("field_id");
        globalQuery.columns.push("field_name");
        globalQuery.table = "cmv_department"
        globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
        globalQuery.conditions.push({ field: "department_type_desc", operator: "=", value: "Main" });
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        comboDataAPiCall.current.fillFiltersCombo(globalQuery).then((getDepartmentApiCall) => {
            setDepartmentOptions(getDepartmentApiCall);
        })
    }

    // Fill the combo boxes from property table.
    const comboBoxesOnChange = async (key) => {
        try {
            switch (key) {
                case 'Department':
                    const departmentId = document.getElementById('cmb_department_id').value;
                    if (departmentId === '0') {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Department')
                        setShowAddRecModal(true)
                        setTimeout(() => {
                            $(".erp_top_Form").eq(0).css("padding-top", "0px");
                        }, 100)
                    }


                    if (departmentId !== "") {
                        setDepartmentId(departmentId);
                        $('#error_department_group_id').hide();
                        try {
                            resetGlobalQuery();
                            globalQuery.columns.push("field_id");
                            globalQuery.columns.push("field_name");
                            globalQuery.conditions.push({
                                field: "parent_department_id",
                                operator: "=",
                                value: departmentId
                            });
                            globalQuery.conditions.push({
                                field: "department_type",
                                operator: "=",
                                value: "S"
                            });
                            globalQuery.table = "cmv_department";
                            var subDeptOptions = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
                            setSubDepartmentGroupOptions(subDeptOptions);
                            setSubDepartmentGroupId('');
                        } catch (error) {
                            console.log('Error: ' + error);
                        }
                    } else {
                        setSubDepartmentGroupOptions([]);
                        setSubDepartmentGroupId('');
                    }
                    break;

                case 'SubDepartment':
                    const SubDepartmentval = document.getElementById('cmb_subdepartment_group_id').value;
                    if (SubDepartmentval === '0') {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Sub Department')
                        setShowAddRecModal(true)
                        setTimeout(() => {
                            $(".erp_top_Form").eq(0).css("padding-top", "0px");
                        }, 100)
                    }
                    break;
            }

        } catch (error) {
            console.log("error : ", error)
            navigate('/Error')
        }
    }

    const renderjobassigntable = useMemo(() => {
        return <Table id="jobassigntableId" style={{ display: "block", width: 'auto', overflow: "auto" }} bordered striped>
            <thead className="erp_table_head">
                <tr>
                    <td className="erp_table_th " style={{ width: "auto" }}>Sr. No</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>Employee Id</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>Department</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>In Time</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>Employee Name</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>Actual Shift</td>
                    <td className="erp_table_th " style={{ width: "auto" }}>Present Shift</td>
                </tr>

            </thead>
            <tbody>

            </tbody>
        </Table>

    }, [jobAssignTableDetails]);



    ////Validation starts here
    const validateFields = () => {
        validate.current.validateFieldsOnChange('jobAssignMasterId');
    }


    return (
        <>
            <DashboardLayout>
                <ComboBox ref={comboDataAPiCall} />
                <FrmValidations ref={validate} />

                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Job Assign{action_Label} </label>
                    </div>

                    <form id='jobAssignMasterId'>
                        <div className='row p-1'>
                            {/*................ 1st Column .............*/}
                            <div className='col-sm-6 erp_form_col_div'>
                                <div className='row'>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Attendance Date</Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="date" id='dt_attendance_date' className="erp_input_field" value={dt_attendance_date} onChange={(e) => { setAttendanceDate(e.target.value); validateFields() }} />
                                            <MDTypography variant="button" id="error_dt_attendance_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { setEmployeeType(e.target.value); validateFields(); }} maxLength="255">
                                                <option value="" disabled>Select</option>
                                                {employeeTypeOptions?.map(employeeTypes => (
                                                    <option value={employeeTypes.field_id} property_value={employeeTypes.property_value}>{employeeTypes.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/*.......................2nd Column.......................... */}
                            <div className='col-sm-6 erp_form_col_div'>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Prod. Shift <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_shift" className="form-select form-select-sm" value={cmb_shift} onChange={(e) => { setShift(e.target.value); validateFields() }}>
                                            <option value="">Select</option>
                                            {shiftOptions.length !== 0 ? (
                                                <>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_name}>{shift.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_shift" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Department <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select size="sm" id="cmb_department_id" className="form-select form-select-sm" value={cmb_department_id} onChange={(e) => { comboBoxesOnChange('Department'); validateFields() }} >
                                            <option value="" disabled>Select </option>
                                            <option value="0">Add New Record+</option>
                                            {departmentOptions?.map(deptOption => (
                                                <option value={deptOption.field_id} key={deptOption.field_id}>{deptOption.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>

                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Sub-Department <span className="required">*</span></Form.Label>

                                    </div>
                                    <div className='col'>
                                        <select size="sm" id="cmb_subdepartment_group_id" className="form-select form-select-sm" value={cmb_subdepartment_group_id} onChange={(e) => { setSubDepartmentGroupId(e.target.value); comboBoxesOnChange('SubDepartment'); validateFields(); }}>
                                            <option value="" disabled="true">Select </option>
                                            <option value="0">Add New Record+</option>
                                            {subDepartmentGroupOptions?.map(subDeptt => (
                                                <option value={subDeptt.field_id} key={subDeptt.field_id}>{subDeptt.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_subdepartment_group_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <hr />
                    <div className='row pt-2'>
                        {renderjobassigntable}
                    </div>

                    <div className="erp_frm_Btns">
                        <MDButton className="erp-gb-button ms-2" variant="button" id='back_Button' fontWeight="regular" >Back</MDButton>
                        <MDButton type="submit" id="save_Button" className="erp-gb-button ms-2 view_hide" variant="button" fontWeight="regular">Save</MDButton>
                    </div >

                </div>
            </DashboardLayout>

            {/* Add new Record Popup */}
            <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className='erp_modal_title'>{modalHeaderName}</Modal.Title>
                    <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                </Modal.Header>
                <Modal.Body className='erp_city_modal_body'>
                    {displayRecordComponent()}
                </Modal.Body>
                <Modal.Footer>
                    <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
                        fontWeight="regular">Close</MDButton>

                </Modal.Footer>
            </Modal >
        </>
    )
}

export default FrmJobAssignEntry
