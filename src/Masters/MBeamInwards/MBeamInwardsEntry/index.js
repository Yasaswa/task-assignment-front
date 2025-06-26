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
import FrmPropertyEntry from "Masters/MProperty/FrmPropertyEntry";
// import Select from 'react-select';

function FrmBeamInwardsEntry() {




    let blankObject = { beam_type: '', beam_no: '', beam_width: '', tare_weight: '', section: '', beam_status: 'E', beam_inwards_id: 0 };

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_NAME, COMPANY_BRANCH_ID, SHORT_COMPANY, UserName, UserId, FINANCIAL_SHORT_NAME } = configConstants;
    const { state } = useLocation();
    const { customerId = 0, keyForViewUpdate = 'Add', beamInwardsDate } = state || {}

    const [action_type, setActionType] = useState("Add");
    const [button_label, setButtonLabel] = useState("Save");

    const [showAddRecModal, setShowAddRecModal] = useState(false);



    const handleCloseRecModal = async () => {
       debugger
       
         
        resetGlobalQuery();
        globalQuery.columns = ['property_name', 'property_value', 'property_id'];
        globalQuery.table = "am_properties";
        globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'SizedBeams' });
        globalQuery.conditions.push({ field: 'property_group', operator: '=', value: 'BI' })
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        let beamTypeAPICall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
        const beamTypeList = [
            // { value: '', label: 'Select' },
            { value: '0', label: 'Add New Record +' },
            ...beamTypeAPICall.map((beamType) => ({ value: beamType.property_id, label: beamType.property_value }))
        ];
        setBeamtypeList(beamTypeList);
    
        
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        
        
        setTimeout(() => {
          $(".erp_top_Form").css({ "padding-top": "110px" });
        }, 200)
      
    }
    
   

    //Hooks for Beam Inwards 
    const [cmb_customer_id, setCustomerId] = useState(customerId);
    const [cmb_customer_order, setCustomerOrder] = useState();
    const [txt_beam_width, setBeamWidth] = useState();
    const [dt_beam_inwards_date, setBeamInwardsDate] = useState(beamInwardsDate);


    const [customerList, setCustomerList] = useState([]);
    const [customerOrderList, setCustomerOrderList] = useState([]);
    const [customer_short_name, SetCustomerShortName] = useState();
    const [beamTypeList, setBeamtypeList] = useState([]);

    const [beamInwardsData, setBeamInwardsData] = useState([blankObject]);


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MBeamInwards/MBeamInwardsListing`)
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
        setIsLoading(true);
        await FnFillCombos();
        if (keyForViewUpdate !== "Add") {
            await FnCheckUpdateResponce();
        }

        setIsLoading(false)
    }, [])


    const FnFillCombos = async () => {

        try {

            // Get customer details
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'customer_short_name'];
            globalQuery.table = "cmv_customer"
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let getCustomerDetails = await comboDataAPiCall.current?.fillFiltersCombo(globalQuery)
            if (getCustomerDetails.length !== 0) {
                const customers = [
                    { value: '', label: 'Select', customer_short_name: '' },
                    { value: '0', label: 'Add New Record +', customer_short_name: '' },
                    ...getCustomerDetails.map((customer) => ({ ...customer, value: customer.field_id, label: customer.field_name, customer_short_name: customer.customer_short_name })),
                ];
                setCustomerList(customers);
            }

            resetGlobalQuery();
            globalQuery.columns = ['property_name', 'property_value', 'property_id'];
            globalQuery.table = "am_properties";
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'SizedBeams' });
            globalQuery.conditions.push({ field: 'property_group', operator: '=', value: 'BI' })
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            let beamTypeAPICall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            const beamTypeList = [
                // { value: '', label: 'Select' },
                { value: '0', label: 'Add New Record +' },
                ...beamTypeAPICall.map((beamType) => ({ value: beamType.property_id, label: beamType.property_value }))
              ];
            setBeamtypeList(beamTypeList);


        } catch (error) {
            console.log(error);
        }
    }

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XtBeamInwards/FnShowParticularRecord/${customerId}/${COMPANY_ID}/${dt_beam_inwards_date}`);
            const reqData = await apiCall.json();
            let BeamInwardsData = reqData['BeamInwardsData'];
            setBeamInwardsData(BeamInwardsData);
            setBeamInwardsDate(BeamInwardsData[0]['beam_inwards_date']);
            SetCustomerShortName(BeamInwardsData[0]['customer_short_name']);

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
        try {
            switch (key) {
                case 'Customer':
                    const getCustomerId = cmb_customer_id_ref.current.value || ''
                    if (getCustomerId !== '0') {
                        let customer_short_name = customerList.find((option) => option.value === getCustomerId)?.customer_short_name;
                        if (customer_short_name !== null){
                            SetCustomerShortName(customer_short_name);
                            $("#error_customer_short_name").hide();
                           } else {
                                       SetCustomerShortName('');
                                       $("#error_customer_short_name").text("Customer Short Name is not available...!");
                                       $("#error_customer_short_name").show();
                                       $("#customer_short_name").focus();
                                    }
                        
                        setCustomerId(getCustomerId);
                        const updatedBeamInwardsData = beamInwardsData.map(item => {
                            const beamType = beamTypeList?.find(option => option.property_id === parseInt(item?.beam_type))?.property_value || '';
                            item['beam_inward_type'] = `${customer_short_name !== undefined ? `${customer_short_name}-` : ''}${beamType !== undefined ? `${beamType}-` : ''} ${item['beam_no']}`;
                            return item;
                           
                        });
                        setBeamInwardsData(updatedBeamInwardsData);
                        $("#error_cmb_customer_id").hide();
                    }
                    break;   
            }
        } catch (error) {
            console.log('error:- ', error);
        }
    }


    const FnManageBeamInwardsDetailsTbl = ((action, rowIndex) => {
        try {
            let beamInwardsDetails = [...beamInwardsData];
            // if (action === 'add') {
            //     // Add a new empty object at the beginning of the array
            //     setBeamInwardsData([blankObject, ...beamInwardsDetails]);
            // } else {
            //     Remove the specified row
            //     if (beamInwardsDetails.length > 1) {
            //         beamInwardsDetails.splice(rowIndex, 1);
            //         setBeamInwardsData(beamInwardsDetails);
            //     }
            //  }

            if (action === 'add') {
                if (validatebeamInwardsDetailsTbl() === true) {
                      setBeamInwardsData([blankObject, ...beamInwardsDetails]);
                }
            }  else {
                   if (beamInwardsDetails.length > 1) {
                    beamInwardsDetails.splice(rowIndex, 1);
                    setBeamInwardsData(beamInwardsDetails);
                } else {
                    setBeamInwardsData([]);
                }
             }
  } catch (error) {

        }
    })
    const getBackgroundColor = (status) => (status !== 'C' ? '#AFE1AF' : '');

    const renderBeamInwardDetails = useMemo(() => {
        return (
            <Table>
                <thead className="erp_table_head">
                    <tr>

                        <th className={`erp_table_th ${keyForViewUpdate === 'view' || keyForViewUpdate === 'approve' ? 'd-none' : 'display'}`} style={{ width: "60px" }}>Action</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Section</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Beam Type</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Beam No</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Beam Name</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>RS</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Tare Weight</th>
                        <th className="erp_table_th" style={{ width: "100px" }}>Beam Status</th>
                    </tr>
                </thead>

                <tbody>
                    {beamInwardsData.map((beamInwardsDetails, indexOfItem) => (
                        <tr rowindex={indexOfItem}>
                            <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
                                <IoAddCircleOutline className={`${beamInwardsDetails.beam_status === 'C' ? 'd-none' : 'erp_trAdd_icon'}`} onClick={() => FnManageBeamInwardsDetailsTbl('add', indexOfItem)} />
                                <IoRemoveCircleOutline className={`${beamInwardsDetails.beam_status === 'C' ? 'd-none' : 'erp_trRemove_icon'}`} onClick={() => FnManageBeamInwardsDetailsTbl('remove', indexOfItem)} />
                            </td>

                            <td className="erp_table_td">
                                <input
                                    type="text"
                                    id={`section_${indexOfItem}`}

                                    Headers='section'
                                    style={{ backgroundColor: getBackgroundColor(beamInwardsDetails.beam_status), width: 'auto' }}
                                    className="erp_input_field_table_txt remove0 mb-0"
                                    disabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'}
                                    value={beamInwardsDetails.section}
                                    onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields(); }}
                                />
                            </td>

                            {/* <td className="erp_table_td">
                                <select className="form-select form-select-sm mb-0" id={`beam_type_${indexOfItem}`} value={beamInwardsDetails.beam_type}
                                    disabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'}
                                    Headers='beam_type' onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields();}} >
                                    <option value="">Select</option>
                                    <option value="0">Add New Record</option>
                                    {
                                        beamTypeList.map(beamtype => (
                                            <option value={beamtype.property_id}>{beamtype.property_value}</option>
                                        ))
                                    }
                                </select>
                            </td> */}

                           
                            <td className="erp_table_td">
                                        <Select  
                                            options={beamTypeList}
                                            isDisabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'} 
                                            id={`beam_type_${indexOfItem}`}
                                            value={beamTypeList.find(option => option.value === beamInwardsDetails.beam_type) || null}
                                            onChange={(selectedOption) => {  
                                                FnUpdateBeamInwardDetails(beamInwardsDetails, { ...selectedOption, Headers: 'beam_type' }, indexOfItem);
                                                validateFields();
                                            }}
                                            placeholder="Search Beam type..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"
                                            styles={{  
                                                option: (provided) => ({  ...provided,  fontSize: '12px'  }),
                                                singleValue: (provided) => ({  ...provided,  fontSize: '12px'   }),
                                                input: (provided) => ({  ...provided,  fontSize: '12px'   })
                                            }}
                                        />
                             </td>


                            <td className="erp_table_td">
                                <input
                                    type="text"
                                    id={`beam_no_${indexOfItem}`}
                                    disabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'}
                                    Headers='beam_no'
                                    style={{ backgroundColor: getBackgroundColor(beamInwardsDetails.beam_status), width: 'auto' }}
                                    className="erp_input_field_table_txt remove0 mb-0 "
                                    value={beamInwardsDetails.beam_no}
                                    onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields();}}
                                />
                            </td>

                            <td className="erp_table_td">{beamInwardsDetails.beam_inward_type}</td>

                            <td className="erp_table_td">
                                <input
                                    type="text"
                                    id={`beam_width_${indexOfItem}`}
                                    disabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'}
                                    Headers='beam_width'
                                    style={{ backgroundColor: getBackgroundColor(beamInwardsDetails.beam_status), width: '150px' }}
                                    className="erp_input_field_table_txt remove0 mb-0 "
                                    value={beamInwardsDetails.beam_width}
                                    onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields();}}
                                />
                            </td>

                            <td className="erp_table_td">
                                <input
                                    type="text"
                                    id={`tare_weight_${indexOfItem}`}
                                    disabled={keyForViewUpdate === 'view' || beamInwardsDetails.beam_status === 'C'}
                                    Headers='tare_weight'
                                    style={{ backgroundColor: getBackgroundColor(beamInwardsDetails.beam_status), width: '150px' }}
                                    className="erp_input_field_table_txt remove0 mb-0 "
                                    value={beamInwardsDetails.tare_weight}
                                    onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields();}}
                                />
                            </td>

                            <td className="erp_table_td" >
                                <select className="form-select form-select-sm mb-0" id={`beam_status_${indexOfItem}`} value={beamInwardsDetails.beam_status}
                                    disabled
                                    Headers='beam_status' onChange={(e) => { FnUpdateBeamInwardDetails(beamInwardsDetails, e, indexOfItem); validateFields();}} >

                                    <option value='E'>Empty</option>
                                    <option value='C'>Completed</option>
                                </select>
                            </td>

                        </tr>
                    ))}

                </tbody>
            </Table>
        )
    }, [beamInwardsData, beamTypeList, customerId])

    const FnGenerateBeamInwardTYpe = (currentRowData, beamTypeOptions) => {
        const beamType = beamTypeOptions?.find(option =>  option.value === parseInt(currentRowData?.beam_type))?.label || '';
        const beamNo = currentRowData?.beam_no || '';
        return `${$("#customer_short_name").val() != '' ? `${$("#customer_short_name").val()}-` : ''}${beamType && beamType !== 'Select' ? `${beamType}-` : ''}${beamNo}`;

    };

    const FnUpdateBeamInwardDetails = (currentRowData, event, index) => {
        debugger
        try {
            // Create a deep copy of the entire state array
            const updatedBeamInwardsData = beamInwardsData.map((row, i) =>
                i === index ? { ...row } : row
            );
    
            let clickedColName = event?.target?.getAttribute('Headers') ?? event.Headers;

            if( clickedColName === 'beam_type' && event.value == 0){

                 sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                            
                 setShowAddRecModal(true)
                            setTimeout(() => {
                              $(".erp_top_Form").eq(0).css("padding-top", "0px");
                            }, 100)
                
                // setShowAddRecModal(true); 
                return;
            }

            let enteredValue = event?.target?.value ?? event.value;

            // $("#" + event.target.id).parent().removeAttr('data-tip');
    
            updatedBeamInwardsData[index][clickedColName] = enteredValue;
    
            if (['beam_type', 'beam_no'].includes(clickedColName)) {
                debugger

                let beam_inward_type = FnGenerateBeamInwardTYpe(
                    updatedBeamInwardsData[index],
                    beamTypeList
                );
                updatedBeamInwardsData[index]['beam_inward_type'] = beam_inward_type;

               
                
                if(updatedBeamInwardsData[index].beam_no !== "" && updatedBeamInwardsData[index].beam_no != 0 && updatedBeamInwardsData[index].beam_type!=="" && cmb_customer_id!=""){

                // Debouncing for API calls
                if (updatedBeamInwardsData[index].debounceTimer) {
                    clearTimeout(updatedBeamInwardsData[index].debounceTimer);
                }
                updatedBeamInwardsData[index].debounceTimer = setTimeout(async () => {
                    try {
                        // setIsLoading(true)
                        resetGlobalQuery();
                        globalQuery.columns = ['beam_status', 'beam_width', 'tare_weight'];
                        globalQuery.table = 'xt_beam_inwards_table';
                        globalQuery.conditions.push({field: 'beam_inward_type',operator: '=',value: beam_inward_type,});
                        const getBeamDetails = await comboDataAPiCall.current?.fillFiltersCombo(globalQuery);
                        if (getBeamDetails?.length !== 0) {
                            console.log(getBeamDetails[0]);
    
                            const updatedRow = {
                                ...updatedBeamInwardsData[index],
                                tare_weight: getBeamDetails[0].tare_weight
                            };
                            updatedBeamInwardsData[index] = updatedRow;
    
                            setBeamInwardsData([...updatedBeamInwardsData]);
                        }
                    } catch (error) {
                        console.error('Error fetching beam details:', error);
                    }
                    finally{
                        // setIsLoading(false)
                    }
                }, 500);
            }
        }
            setBeamInwardsData([...updatedBeamInwardsData]);
        } catch (error) {
            console.error('Error in FnUpdateBeamInwardDetails:', error);
        }
    };


    const addSizingBeamInwards = async () => {
        try {
            validateFields();
            setIsLoading(true);
            let checkIsValidate = true;
            if (keyForViewUpdate !== "") {
                checkIsValidate = await FnValidateBeamInwards();
            }

            if (!validatebeamInwardsDetailsTbl()) {  
                // setErrMsg("Please enter valid Beam No and Beam Width.");
                // setShowErrorMsgModal(true);
                return false;
            }
            if (checkIsValidate) {
                const json = { 'BeamInwardsDetails': [], 'commonIds': { 'company_id': COMPANY_ID, 'keyForViewUpdate': keyForViewUpdate } }
                //Beam Inward Details
                beamInwardsData.map((detail) => {
                    let emptyJson = {};
                    if (detail.beam_width > 0) {
                        emptyJson.company_id = COMPANY_ID;
                        emptyJson.customer_id = cmb_customer_id;
                        emptyJson.company_branch_id = COMPANY_BRANCH_ID;
                        emptyJson.financial_year = FINANCIAL_SHORT_NAME;
                        emptyJson.beam_inwards_date = dt_beam_inwards_date;
                        emptyJson.beam_inwards_id = detail.beam_inwards_id;
                        emptyJson.section = detail.section;
                        emptyJson.beam_type = detail.beam_type != "" ? detail.beam_type : null;
                        emptyJson.beam_no = detail.beam_no;
                        emptyJson.beam_width = detail.beam_width;
                        emptyJson.tare_weight = detail.tare_weight;
                        emptyJson.beam_status = detail.beam_status;
                        emptyJson.beam_inward_type = detail.beam_inward_type;
                        emptyJson.created_by = UserName;
                        emptyJson.modified_by = UserName;
                        json.BeamInwardsDetails.push(emptyJson);
                    }
                });
                const formData = new FormData()
                formData.append('BeamInwardsData', JSON.stringify(json))
                const forwardData = {
                    method: 'POST',
                    body: formData,
                }
                const WPOApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XtBeamInwards/FnAddUpdateRecord`, forwardData)
                const responce = await WPOApiCall.json()
                if (responce.success === 0) {
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }

        } catch {

        } finally {
            setIsLoading(false);
        }
    }

    const actionType = () => {
        switch (keyForViewUpdate) {
            case 'update':
                return '(Modify)';
            case 'view':
                return '(View)';
            default:
                return '';
        }
    }

    const FnValidateBeamInwards = async () => {
        let beamInwardsIsValid = true;
        validateFields();
        validatebeamInwardsDetailsTbl();
        if (cmb_customer_id === "" || cmb_customer_id === null) {
            setErrMsg('Please Select a Customer');
            setShowErrorMsgModal(true);
            beamInwardsIsValid = false;
            return false
        }
        else {
            if (customer_short_name === null || customer_short_name === "") {
                $("#error_customer_short_name").text("Customer Short Name is not available...!");
                $("#error_customer_short_name").show();
                $("#customer_short_name").focus();
                return false;}
           else { let otherFormFieldsIsValid = await validate.current.validateForm("beamInwardsFormId");
            if (!otherFormFieldsIsValid) { return false; }}
        }
        return beamInwardsIsValid
    }


    const validateFields = async () => {
        debugger

        
        if (cmb_customer_id === "" || cmb_customer_id === null || cmb_customer_id === 0 ) {
            $("#error_cmb_customer_id").text("Please select Customer...!");
            $("#error_cmb_customer_id").show();
            $("#cmb_customer_id").focus();
            return false;}

         if (customer_short_name === null || customer_short_name === "") {
            $("#error_customer_short_name").text("Customer Short Name is not available...!");
            $("#error_customer_short_name").show();
            $("#customer_short_name").focus();
            return false;}
       
        // else {
        //     validate.current.validateFieldsOnChange('beamInwardsFormId');
        //     $("#error_cmb_customer_id").hide();
            
        // }
    }

    var validatebeamInwardsDetailsTbl = () => {
        debugger

        try {
            
            let beamInwardsDetails = [...beamInwardsData];
            let validation = true;
            
            for (let i = 0; i < beamInwardsDetails.length; i++) {
                let data = beamInwardsDetails[i];
            
                for (let key in data) {
                    if (key.startsWith("beam_width") ||  key.startsWith("beam_no")) {  
                        let tabledataId = $("#" + key + `_${i}`);
                        if (tabledataId.is(':visible') && (['', 0, '0', null].includes(tabledataId.val()))) {
                            if (tabledataId.attr('type') === 'text') {
                                tabledataId.parent().attr('data-tip', 'Please Enter proper data...!');
                            }
            
                            tabledataId.focus();
                            validation = false;
                            break;
                        }  else {
                            tabledataId.parent().removeAttr('data-tip');
                        }

                    }
                }
                if (!validation) {
                    break;
                }
            }
            
            return validation;
            
        } catch (error) {
            console.error("Validation error:", error);
            return false;
        }
    }
    

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
                    <label className='erp-form-label-lg text-center'>Beam Inwards {actionType()} </label>
                </div>
                <form id='beamInwardsFormId'>
                    <div className="row ms-1 mt-3">
                        <div className="col-sm-4 erp_form_col_div ">
                            <div className="row">
                                <div className='col-sm-5'>
                                    <Form.Label className="erp-form-label">Customer <span className="required">*</span> </Form.Label>
                                </div>
                                <div className='col-sm-7'>
                                    <Select
                                        ref={cmb_customer_id_ref}
                                        options={customerList}

                                        inputId="cmb_customer_id" // Provide the ID for the input box
                                        value={customerList.find(option => option.value === cmb_customer_id)}

                                        onChange={(selectedOpt) => {
                                            cmb_customer_id_ref.current = selectedOpt;
                                            FnComboBoxesOnChange("Customer");
                                        }}
                                       
                                        placeholder="Search for a customer..."
                                        className="form-search-custom"
                                        classNamePrefix="custom-select" // Add custom prefix for class names
                                        isDisabled={keyForViewUpdate !== 'Add'}
                                        styles={{  option: (provided, state) => ({  ...provided,   fontSize: '12px'   }),
                                            singleValue: (provided, state) => ({  ...provided,  fontSize: '12px'  }),
                                            input: (provided, state) => ({  ...provided,  fontSize: '12px' // Adjust the font size as per your requirement
                                            })
                                        }}
                                    />

                                    <MDTypography variant="button" id="error_cmb_customer_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-4 erp_form_col_div ">

                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label"> Date <span className="required">*</span> </Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="date" id="dt_beam_inwards_date" className="erp_input_field" value={dt_beam_inwards_date} onChange={e => { setBeamInwardsDate(e.target.value); }} disabled={keyForViewUpdate !== 'Add'} />
                                    <MDTypography variant="button" id="error_dt_beam_inwards_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-4 erp_form_col_div ">
                            <div className="row">
                                <div className="col-sm-5">
                                    <Form.Label className="erp-form-label">Customer Short Name</Form.Label>
                                </div>
                                <div className="col-sm-7">
                                    <Form.Control type="text" id='customer_short_name' className="erp_input_field" value={customer_short_name} disabled />
                                    <MDTypography variant="button" id="error_customer_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>  </MDTypography>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

                <hr />

                <div className="col-sm-12 px-lg-2 d-block">
                    <div className="col-lg-12 col-12 erp_form_col_div">
                        <div className="card">
                            <div className="card-header py-0 main_heading mb-0">
                                <label className="erp-form-label-md-lg">Beam Inward Details</label>
                            </div>
                            <div className="card-body p-0">{renderBeamInwardDetails}</div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card-footer pb-4 text-center">
                <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { navigate(`/Masters/MBeamInwards/MBeamInwardsListing`) }} variant="button"
                    fontWeight="regular">Back</MDButton>
                <MDButton type="submit" onClick={addSizingBeamInwards} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                    fontWeight="regular">{button_label}</MDButton>
                {/* <MDButton className={`erp-gb-button ms-2 ${keyForViewUpdate === 'Add' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={() => printWarpingProdOrderPlan()}>Print &nbsp;<FiPrinter className="erp-download-icon-btn" />
                </MDButton> */}
            </div >

            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

                
                <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                       <Modal.Header>
                         <Modal.Title className='erp_modal_title'></Modal.Title>
                         <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                       </Modal.Header>
                       <Modal.Body className='erp_city_modal_body'>
                          <FrmPropertyEntry btn_disabled={true} propertyInfo={{  property_id_prop: 176, property_group_prop: 'BI',  key: 'Add' }} />
                       </Modal.Body>
                       <Modal.Footer>
                         <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
                           fontWeight="regular">Close</MDButton>
               
                       </Modal.Footer>
                     </Modal > 
        </DashboardLayout >
    )
}

export default FrmBeamInwardsEntry
