import React, { useState, useReducer } from 'react'
import { useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import { Modal, Spinner, Table } from "react-bootstrap";
import { Button } from "react-bootstrap"
import Select from 'react-select';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { Tooltip } from "@material-ui/core";

import { MdDelete, MdRefresh } from "react-icons/md";

import { Form } from 'react-bootstrap';
import MDButton from "components/MDButton";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import $ from 'jquery';
import MDTypography from 'components/MDTypography';
import ComboBox from 'Features/ComboBox';
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from "assets/Constants/config-constant";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import FrmValidations from 'FrmGeneric/FrmValidations';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
import { CircularProgress } from "@material-ui/core";

function FrmStandardLossEntry() {


    

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_NAME, COMPANY_BRANCH_ID, SHORT_COMPANY, UserName, UserId, FINANCIAL_SHORT_NAME } = configConstants;
    const { state } = useLocation();
    const { standardLossId = 0, keyForViewUpdate = 'Add' } = state || {}

    const [action_type, setActionType] = useState("Add");
    const [button_label, setButtonLabel] = useState("Save");

    //Hooks for Standard Loss 
    const [weft_break, setWeftBreak] = useState();
    const [gaiting, setGaiting] = useState();
    const [knotting, setKnotting] = useState();
    const [warp_break, setWarpBreak] = useState();
    const [weaveType, setWeaveType] = useState({});
    const [traget_efficiency, setTargetEfficiency] = useState([]);
    const [weaveTypeList, setWeavetypeList] = useState([]);
   

    const [production_standard_losses_id, setStandardLossId] = useState(standardLossId);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MStandardLoss/StandardLossListing`)
        }
    }

    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showWRFilterForm, setShowWRFilterForm] = useState(false);

    const [showModal, setShowModal] = useState(false);

    //useRef Hooks
    const cmb_customer_id_ref = useRef(null);
    const comboDataAPiCall = useRef();
    const validateNumberDateInput = useRef();
    const validate = useRef();
    const generateAutoNoAPiCall = useRef();
    const navigate = useNavigate();

    useEffect(async () => {
        debugger
        setIsLoading(true);
        await FnFillCombos();
        if (keyForViewUpdate !== 'Add') {
            await FnCheckUpdateResponce();
        }

        setIsLoading(false)
    }, [])


    const FnFillCombos = async () => {

        try {

            resetGlobalQuery();
            globalQuery.columns = ['property_name', 'property_value', 'property_id'];
            globalQuery.table = "am_properties";
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'WeaveDesign' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let weaveTypeAPICall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setWeavetypeList(weaveTypeAPICall);

        } catch (error) {
            console.log(error);
        }
    }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XtProductionStandardLoss/FnShowStandardLossDetails/${production_standard_losses_id}/${parseInt(COMPANY_ID)}`);
            const updateRes = await apiCall.json();
            let data = updateRes.StandardLossMasterRecord;
            setWeftBreak(data.weft_break)
            setGaiting(data.gaiting)
            setKnotting(data.knotting)
            setWarpBreak(data.warp_break)
            setWeaveType({
                val: data.weave_design_id,
                label: data.weave_design_name
            });
            setTargetEfficiency(data.traget_efficiency)


          



            switch (keyForViewUpdate) {
                case 'update':
                    setActionType("Update");
                    setButtonLabel("Update");
                    break;
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const FnComboBoxesOnChange = (key) => {
        debugger
        try {
            switch (key) {
                case 'Customer':

                    break;
            }
        } catch (error) {
            console.log('error:- ', error);
        }
    }


    




    

    const addStandardLossRecord = async () => {
        debugger
        try {
            setIsLoading(true);
            const json = { 'TransHeaderData': {}, 'commonIds': { 'company_id': COMPANY_ID, 'keyForViewUpdate': keyForViewUpdate } }
            json.TransHeaderData = {
                company_id: COMPANY_ID,
                company_branch_id: COMPANY_BRANCH_ID,
                financial_year: FINANCIAL_SHORT_NAME,
                production_standard_losses_id:  keyForViewUpdate === 'Add' ? 0 : standardLossId,
                weave_design_id: weaveType.val,
                weave_design_name: weaveType.label,
                warp_break: warp_break,
                weft_break: weft_break,
                knotting: knotting,
                gaiting: gaiting,
                traget_efficiency: traget_efficiency,

                created_by: UserName,
                modified_by: UserName,


        

            }

            const formData = new FormData()
            formData.append('XtProductionStandardLossData', JSON.stringify(json))
            const forwardData = {
                method: 'POST',
                body: formData,
            }

            const WPOApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XtProductionStandardLoss/FnAddUpdateRecord`, forwardData)
            const responce = await WPOApiCall.json()
            if (responce.success === 0) {
                setErrMsg(responce.error)
                setShowErrorMsgModal(true)
            } else {
                setSuccMsg(responce.message)
                setShowSuccessMsgModal(true);
            }

        } catch {

        } finally {
            setIsLoading(false);
        }
    }

    const actionType = () => {
        debugger
        switch (keyForViewUpdate) {
            case 'update':
                return '(Modify)';
            case 'view':
                return '(View)';
            default:
                return '';
        }
    }

    const handleWeaveTypeChange = (e) => {
        debugger
        const selectedWeave = weaveTypeList.find(
            (weave) => weave.property_id === parseInt(e.target.value)
        );

        setWeaveType({
            val: e.target.value,
            label: selectedWeave?.property_name || "",
        });

        // Call additional function if needed
        // FnUpdateStandardLossRecord();
    };


    return (
        <DashboardLayout>
            <ComboBox ref={comboDataAPiCall} />

            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <FrmValidations ref={validate} />


            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span>Loading...</span>
                    </div>
                </div> :
                ''}

            <div className='card p-1'>
                <div className='card-header text-center py-0'>
                    <label className='erp-form-label-lg text-center'>Standard Losses {actionType()} </label>
                </div>
                <form id='standardLossFormId'>
                    <div className="row ms-1 mt-3">
                        <div className="col-sm-4 erp_form_col_div ">
                            <div className="row">
                                <div className='col-sm-5'>
                                    <Form.Label className="erp-form-label">Weave <span className="required">*</span> </Form.Label>
                                </div>
                                <div className='col-sm-7'>

                                    <select
                                        className="form-select form-select-sm mb-0"
                                        id="weaveType"
                                        value={weaveType.val || ""}
                                        disabled={keyForViewUpdate === "view"}
                                        onChange={handleWeaveTypeChange}
                                    >
                                        <option value="">Select</option>
                                        {weaveTypeList.map((weavetype) => (
                                            <option key={weavetype.property_id} value={weavetype.property_id}>
                                                {weavetype.property_name}
                                            </option>
                                        ))}
                                    </select>

                                    <MDTypography variant="button" id="error_cmb_customer_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label">Knotting</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="input" id="knotting" className="erp_input_field" value={knotting} onChange={e => { setKnotting(e.target.value); }} disabled={keyForViewUpdate == 'view'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-4 erp_form_col_div ">

                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label"> Warp Break <span className="required">*</span> </Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="input" id="warp_break" className="erp_input_field" value={warp_break} onChange={e => { setWarpBreak(e.target.value); }} disabled={keyForViewUpdate == 'view'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label">Gaiting</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="input" id="gaiting" className="erp_input_field" value={gaiting} onChange={e => { setGaiting(e.target.value); }} disabled={keyForViewUpdate == 'view'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-4 erp_form_col_div ">
                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label">Weft Break</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="input" id="weft_break" className="erp_input_field" value={weft_break} onChange={e => { setWeftBreak(e.target.value); }} disabled={keyForViewUpdate == 'view'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label">Target Efficiency</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="input" id="traget_efficiency" className="erp_input_field" value={traget_efficiency} onChange={e => { setTargetEfficiency(e.target.value); }} disabled={keyForViewUpdate == 'view'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>

                        </div>


                    </div>
                </form>

                <hr />



            </div>

            <div className="card-footer pb-4 text-center">
                <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { navigate(`/Masters/MStandardLoss/StandardLossListing`) }} variant="button"
                    fontWeight="regular">Back</MDButton>
                <MDButton type="submit" onClick={addStandardLossRecord} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                    fontWeight="regular">{button_label}</MDButton>
            </div >

            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
        </DashboardLayout >
    )
}

export default FrmStandardLossEntry
