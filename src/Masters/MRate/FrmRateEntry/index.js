import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $, { event } from "jquery";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import { Accordion, Modal, Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CircularProgress } from "@material-ui/core";

// File Imports
import ComboBox from "Features/ComboBox";
import ConfigConstants from "assets/Constants/config-constant";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";

//Bootstrap imports
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";




function FrmRateEntry(props) {
    const { state } = useLocation();
    const { rate_id = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {};

    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    // use refs
    const navigate = useNavigate();
    const comboDataAPiCall = useRef();
    const validate = useRef();
    const validateNumberDateInput = useRef();

    // Modals
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setModalHeaderName] = useState('')


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => { setShowSuccessMsgModal(false); }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');


    // Loader
    const [isLoading, setIsLoading] = useState(false);
    // const currentDate = today();
    const currentDate = new Date().toISOString().split('T')[0];
    //Form Fields
    const [cmb_product_type_id, setProductTypeId] = useState("");
    const [dt_effective_date_id, setEffectiveDate] = useState(currentDate)


    // combo Options List
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [productUnitOptions, setProductUnitOptions] = useState([]);

    // material table
    const [materialDetailsData, setMaterialDetailsData] = useState([]);

    useEffect(() => {
        fnFillComobos();
    }, [])
    //Fn for add default data
    const fnFillComobos = () => {
        comboDataAPiCall.current.fillMasterData("smv_product_type", "", "")
            .then(getProductType => {
                setProductTypeOptions(getProductType)
            })
    }
    // Add rec modal
    const closeAddRecModal = async () => {
        switch (modalHeaderName) {
            case 'Product Type':
                const productTypeApiCall = await comboDataAPiCall.current.fillMasterData("smv_product_type", "", "")
                setProductTypeOptions(productTypeApiCall)
                break;

            default:
                break;
        }
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").css({
                "padding-top": "110px"
            });
        }, 200)

    }

    const DisplayRecordComponent = () => {
        switch (modalHeaderName) {
            case 'Product Type':
                return 0;
            default:
                return null;
        }
    }

    //validate fields form
    const validateFields = () => {
        validate.current.validateFieldsOnChange('rateFormId')
    }

    const comboOnChange = async (key) => {
        switch (key) {
            case 'productType':
                var productTpVal = document.getElementById('cmb_product_type_id').value;
                setProductTypeId(productTpVal)
                if (productTpVal === '0') {
                    setModalHeaderName('Product Type')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else if (productTpVal !== '0' && productTpVal !== '') {
                    setIsLoading(true);
                    $('#error_cmb_product_type_id').hide();
                    const getProductUnitOptions = await comboDataAPiCall.current.fillMasterData("smv_product_unit", "", "")
                    setProductUnitOptions(getProductUnitOptions)
                    resetGlobalQuery();
                    globalQuery.columns.push("*");
                    globalQuery.table = "smv_product_current_rate"
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    const getMaterialList = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);
                    debugger
                    if (getMaterialList.length !== 0) {
                        setEffectiveDate(getMaterialList[0].effective_date)
                        setMaterialDetailsData(() => {
                            return getMaterialList.map((rowData) => ({
                                ...rowData,
                                // effective_date: rowData.effective_date !== "" && rowData.effective_date !== null ? rowData.effective_date : currentDate,
                                material_rate: rowData.material_rate !== "" && rowData.material_rate !== null ? rowData.material_rate : "0",
                            }));
                        });
                        FnValidateDetailsFields();

                    } else {
                        setMaterialDetailsData([])
                    }
                    setIsLoading(false);
                }

                break;
        }
    }

    //------------------------------------------------------------- material Details Starts ----------------------------------------------------------------------
    //Fn to render po details table
    const renderMaterialRateDetails = useMemo(() => {
        return <>
            {materialDetailsData.length !== 0 ? <>

                <Table className="erp_table erp_table_scroll" id='material_details_table_id' responsive bordered striped>
                    <thead className="erp_table_head">
                        <tr>
                            <th className="erp_table_th">Sr No</th>
                            <th className="erp_table_th">Material Name</th>
                            {/* <th className="erp_table_th">Efficient Date</th> */}
                            <th className="erp_table_th">Material Rate</th>
                            <th className="erp_table_th">Material Unit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {materialDetailsData.map((poItem, index) => (
                            <tr rowIndex={index}>

                                <td className="erp_table_td text-end">{index + 1}</td>
                                <td className="erp_table_td ">{poItem.product_material_name}</td>
                                {/* <td className="erp_table_td ">
                                    <input type="date" className="erp_input_field mb-0 " headers='effective_date'
                                        id={`effective_date_${index}`} value={poItem.effective_date} min={currentDate}
                                        onChange={(e) => { updatePODetailsTblData(poItem, e); }}
                                    /></td> */}
                                <td className="erp_table_td text-end">
                                    <input
                                        type="text"
                                        className="erp_input_field mb-0 " headers='material_rate'
                                        id={`material_rate_${index}`}
                                        value={poItem.material_rate}
                                        onChange={(e) => { updatePODetailsTblData(poItem, e); }}
                                    />
                                </td>
                                <td>
                                    <select id={`product_material_stock_unit_id_${index}`} className="form-select form-select-sm"
                                        value={poItem.product_material_stock_unit_id} headers='product_material_stock_unit_id' disabled >
                                        <option value=''>Select</option>
                                        {productUnitOptions.length !== 0 ?
                                            <>
                                                {productUnitOptions?.map(unitItem => (
                                                    <option value={unitItem.field_id} >{unitItem.field_name}</option>
                                                ))}
                                            </>
                                            : ''
                                        }
                                    </select></td>

                            </tr>
                        ))}
                    </tbody>
                </Table></> : null
            }
        </>
    }, [materialDetailsData, cmb_product_type_id]);

    //function for update Details table data
    const updatePODetailsTblData = async (currentRowData, event) => {
        let focusedInputField = document.querySelector('#' + event.target.id);
        let clickedColName = event.target.getAttribute('headers');
        // if (clickedColName === 'effective_date') {
        //     if (event.target.value !== '' || event.target.value !== undefined) {
        //         currentRowData[clickedColName] = event.target.value;
        //     } else {
        //         currentRowData[clickedColName] = '';
        //     }
        // } else
         if (clickedColName === 'material_rate') {
            if (event.target.value !== '') {
                delete focusedInputField.parentElement.dataset.tip;
                currentRowData[clickedColName] = validateNumberDateInput.current.decimalNumber(event.target.value, 4);
            } else {
                focusedInputField.parentElement.dataset.tip = "Please fill this field...!"
                currentRowData[clickedColName] = '';
            }
        } else if (clickedColName.includes('product_material_stock_unit_id')) {
            if (event.target.value !== '' && event.target.value !== '0') {
                currentRowData[clickedColName] = event.target.value;
            } else {
                focusedInputField.parentElement.dataset.tip = "Please fill this field...!"
                currentRowData[clickedColName] = '';
            }
        }
        const tblRows = [...materialDetailsData]
        const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowIndex'))
        tblRows[arrayIndex] = currentRowData
        setMaterialDetailsData(tblRows);                        // Set that updated data in table data hook;
    }
    //------------------------------------------------ Material Details Ends -------------------------------------------------------------------------------------
    //------------------------------------------------ Save Material Rate Starts-------------------------------------------------------------------------------------
    const FnValidateDetailsFields = () => {
        $('#material_details_table_id tbody tr').each(function () {
            let currentTblRow = $(this);
            let materialRateInput = currentTblRow.find('input[id^="material_rate_"]');
            materialRateInput.parent().removeAttr("data-tip");
        });
    }


    const FnMaterialDetailsValidate = () => {
        let validatematerialRate = true;
        if (cmb_product_type_id === "" || cmb_product_type_id === "0") { 
            $('#error_cmb_product_type_id').text("Please select atleast one...!");
            $('#error_cmb_product_type_id').show();
            return validatematerialRate = false; 
        }
        $('#material_details_table_id tbody tr').each(function () {
            let currentTblRow = $(this);
            let materialRate = parseFloat(currentTblRow.find('input[id^="material_rate_"]').val());
            if (isNaN(materialRate) || materialRate <= 0 || materialRate === '') {
                $(currentTblRow.find('input[id^="material_rate_"]'))[0].parentElement.dataset.tip = 'Material rate should not be a zero or blank...!';
                $(currentTblRow.find('input[id^="material_rate_"]'))[0].focus();
                return validatematerialRate = false;
            }
        });
        return validatematerialRate;
    }
    const FnAddMaterialRate = async () => {
        debugger
        try {
            let materialDetailsValidate = FnMaterialDetailsValidate();
            if (materialDetailsValidate) {
                let json = { 'ProductCurrentRateData': [], 'commonIds': { 'company_id': COMPANY_ID } };
                for (let index = 0; index < materialDetailsData.length; index++) {
                    const element = materialDetailsData[index];
                    const currentMaterialRate = {
                        company_id: COMPANY_ID,
                        company_branch_id: COMPANY_BRANCH_ID,
                        product_rate_id: 0,
                        product_type_id: cmb_product_type_id,
                        product_material_id: element.product_material_id,
                        // effective_date: element.effective_date,
                        effective_date: dt_effective_date_id,
                        material_rate: element.material_rate,
                        product_unit_id: element.product_material_stock_unit_id,
                        remark: element.remark,
                        created_by: UserName,
                        modified_by: keyForViewUpdate === 'update' || keyForViewUpdate === 'approve' ? UserName : ''
                    };
                    json.ProductCurrentRateData.push(currentMaterialRate);
                }
                console.log("json of Rate Master New: ", json);

                const formData = new FormData();
                formData.append(`ProductCurrentRateData`, JSON.stringify(json))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductCurrentRate/FnAddUpdateRecord`, requestOptions);
                const responce = await apicall.json();
                if (responce.success === "0") {
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
    }

    //------------------------------------------------ Save Material Rate Ends-------------------------------------------------------------------------------------


    return (
        <>

            <div className='erp_top_Form'>
                <div className='card p-1'>
                    <FrmValidations ref={validate} />
                    <ComboBox ref={comboDataAPiCall} />
                    <ValidateNumberDateInput ref={validateNumberDateInput} />
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Rate</label>
                    </div>

                    <div className='row '>
                        <div className="col">
                            <form id="rateFormId">
                                <div className="row erp_transporter_div">
                                    <div className="col-sm-6 erp_form_col_div">
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <Form.Label className="erp-form-label">Product Type<span className="required">*</span></Form.Label>
                                            </div>
                                            <div className='col-sm-4 '>
                                                <select id="cmb_product_type_id" className="form-select form-select-sm" value={cmb_product_type_id} onChange={() => { comboOnChange('productType'); validateFields(); }}>
                                                    <option value="">Select</option>
                                                    <option value="0">Add New Record+</option>
                                                    {productTypeOptions?.map(productType => (
                                                        <option value={productType.field_id}>{productType.field_name}</option>
                                                    ))}
                                                </select>
                                                <MDTypography variant="button" id="error_cmb_product_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <Form.Label className="erp-form-label">Effective Date<span className="required">*</span></Form.Label>
                                            </div>
                                            <div className='col-sm-4 '>
                                                <input type="date" className="erp_input_field mb-0 "
                                                    id={`dt_effective_date_id`} value={dt_effective_date_id} min={currentDate}
                                                    onChange={(e) => { setEffectiveDate(e.target.value); validateFields(); }} />
                                                <MDTypography variant="button" id="error_dt_effective_date_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                                </MDTypography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col m-2">
                            <div className="font-weight-bolder fs-6">Material Rate Details :</div>
                            {isLoading ?
                                <div className="spinner-overlay"  >
                                    <div className="spinner-container">
                                        <CircularProgress color="primary" />
                                        <span id="spinner_text" className="text-dark">Loading...</span>
                                    </div>
                                </div> :
                                null}
                            {materialDetailsData.length > 0
                                ? <>
                                    {renderMaterialRateDetails}
                                </>
                                :
                                <>
                                    <div className=" ">
                                        <span className="erp_validation text-center" fontWeight="regular" color="error"> No Material Records Found... </span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/DashBoard/reg' : '/DashBoard';
                                navigate(path);
                            }} variant="button" fontWeight="regular" disabled={props.btn_disabled ? true : false} >Back</MDButton>

                        {keyForViewUpdate !== 'view' ? (
                            <MDButton type="submit" onClick={FnAddMaterialRate} id="save_btn_id" className="erp-gb-button erp_MLeft_btn " variant="button"
                                fontWeight="regular">Save</MDButton>
                        ) : null}

                    </div >
                </div>
                {/* Modals For show msgs */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


                {/* //Modal For Add new Record */}
                <Modal size="lg" show={showAddRecModal} onHide={closeAddRecModal} backdrop="static" keyboard={false} centered >

                    <Modal.Body className='erp_city_modal_body'>
                        <div className='row'>
                            <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={closeAddRecModal}></button></div>
                        </div>
                        {DisplayRecordComponent()}
                    </Modal.Body>
                </Modal >
            </div >
        </>
    )
}
export default FrmRateEntry