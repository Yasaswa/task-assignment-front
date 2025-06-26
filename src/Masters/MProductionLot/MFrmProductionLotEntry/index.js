
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import FrmValidations from "FrmGeneric/FrmValidations";
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from "react-router-dom";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from 'Features/ComboBox';
import ErrorModal from 'components/Modals/ErrorModal';
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
// import FrmMProductTypeEntry from 'Masters/MProductType/FrmProductEntry';
import GenerateMaterialId from 'FrmGeneric/GenerateMaterialId/GenerateMaterialId';
import GenerateTAutoNo from 'FrmGeneric/GenerateTAutoNo';
import { CircularProgress } from '@material-ui/core';
// crated by ujjwala at 11/04/2024
export default function MFrmProductionLotEntry(props) {
    var activeValue = '';
    const validate = useRef();
    const combobox = useRef();
    const comboDataAPiCall = useRef();
    const generateAutoNoAPiCall = useRef();
    const { state } = useLocation();
    const configConstants = ConfigConstants();
    const validateNumberDateInput = useRef();
    const { COMPANY_ID, UserName, COMPANY_BRANCH_ID, FINANCIAL_SHORT_NAME } = configConstants;
    const { lotid = 0, keyForViewUpdate, compType = 'Masters' } = state || {}

    const [isLoading, setIsLoading] = useState(false);

    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    //master filed hooks 
    const [dt_lot_date, setLotDate] = useState(today);
    const [plantOptions, setPlantOptions] = useState([]);
    const [int_lot_no, setLotNo] = useState('');
    const [int_sub_lot_no, setSubLotNo] = useState('');
    const [dt_lot_start_date, setLotStartDate] = useState(today);
    const [dt_lot_end_date, setLotEndDate] = useState(today)
    const [cmb_product_type_id, setSpinnPlanId] = useState('')
    const [rb_sales_type, setSalesType] = useState('D')
    const [chk_is_active, setIsActive] = useState(true);
    const [cmb_lot_no, setComboLotNo] = useState('');
    const [cmb_count_id, setcountname] = useState(1);
    const [txt_actual_name, setActualName] = useState('');
    const [cmb_packing_id, setpackingid] = useState('');
    const [txt_per_packing_weight, settxt_per_packing_weight] = useState('');
    const [txt_cone_weight, settxt_cone_weight] = useState(0);
    const [txt_cone_quantity, setptxt_cone_quantity] = useState(0);
    const [txt_lot_starting_no, Setlotstartingno] = useState(1);
    const [txt_lot_quantity, Setlotquantity] = useState(0);
    const [txt_lot_ending_no, SetEndingstartingno] = useState(1);
    const [cmb_process_Type, SetProcessType] = useState([]);
    const [cmb_value_added_product_Type, SetvalueaddedproductType] = useState([]);
    const [cmb_yarn_hosiery, SetYarnhosiry] = useState([]);
    const [cmb_yarn_ply_id, Setyarnply] = useState([]);


    //footer fileds
    const [txt_total_cones, setTotalCones] = useState(0)
    const [txt_total_packages, setTotalPackages] = useState(0)
    const [txt_gross_weight, setGrossWeight] = useState(0)
    const [txt_net_weight, setNetWeight] = useState('')
    const [txt_dispatched_packages, setDispatchedPackages] = useState(0)
    const [txt_dispatched_weight, setDispatchedWeight] = useState(0)
    const [txt_packing_status, setPackingStatus] = useState('p')

    //options hook

    const [productTypeOption, setproductTypeOption] = useState('')
    const [lotNoOptions, setLotNoOptions] = useState([]);

    const [unitOptions, setUintOptions] = useState([]);
    const [cmb_unit_id, setunitname] = useState(1)
    const [yarnPackingTypeOptions, setYarnPackingTypeOptions] = useState([]);
    const [CountOptions, setCountOptions] = useState([]);
    const [yarnProcessTypeOptions, setyarnProcessTypeOptions] = useState([]);
    const [ValueAddedProductTypeoption, setValueAddedProductTypeoption] = useState([]);
    const [yarnhosieryoption, setyarnhosieryoption] = useState([]);
    const [YarnPlyTypeoption, setYarnPlyTypeoption] = useState([]);
    const [lot_id, setlotId] = useState(lotid);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [cmb_plant_id, setProdPlantName] = useState([]);

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Show ADD record Modal
    const handleCloseRecModal = async () => {
        await FillComobos()
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").css({ "padding-top": "110px" });
        }, 200)
    }
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MProductionLot/MFrmProductionLotListing`);
        }

    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    const date_toString = (input_Date) => {
        const parsed_Date = new Date(input_Date);
        const date_OfInputDate = String(parsed_Date.getDate()).padStart(2, '0');
        const month_OfInputDate = String(parsed_Date.getMonth() + 1).padStart(2, '0');
        const year_OfInputDate = parsed_Date.getFullYear();

        const formatted_Date = date_OfInputDate + month_OfInputDate + year_OfInputDate;
        return formatted_Date;
    }

    // For navigate
    const navigate = useNavigate();
    useEffect(async () => {
        setIsLoading(true)
        await ActionType();
        await FillComobos();
        if (keyForViewUpdate === 'Add') {
            fillAutoNo();

        }
        await FnCheckUpdateResponce();

        setIsLoading(false)
    }, [])

    // fill combo onload
    const FillComobos = async () => {
        try {
            resetGlobalQuery();
            globalQuery.columns = ['lot_no', 'MAX(yarn_packing_master_id) AS max_yarn_packing_master_id'];
            globalQuery.table = "xtv_spinning_yarn_packing_master";
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.groupBy = ['lot_no'];
            comboDataAPiCall.current.removeCatcheFillCombo(globalQuery).then((lotTypeApiCall) => {
                setLotNoOptions(lotTypeApiCall)
            });

            combobox.current.fillMasterData("smv_product_unit", "", "").then((unitApiCall) => {
                setUintOptions(unitApiCall);
            })

            const getProdPlantApiCall = await comboDataAPiCall.current.fillMasterData("cmv_plant", "", "");
            setPlantOptions(getProdPlantApiCall);

            resetGlobalQuery();
            const yarnlist = await comboDataAPiCall.current.fillComboBox('yarnProcessType')
            setyarnProcessTypeOptions(yarnlist);
            const yarnlist1 = await comboDataAPiCall.current.fillComboBox('yarnValueAdditionType')
            setValueAddedProductTypeoption(yarnlist1);
            const yarnlist2 = await comboDataAPiCall.current.fillComboBox('yarnHosieryWarpType')
            setyarnhosieryoption(yarnlist2);
            const yarnlist3 = await comboDataAPiCall.current.fillComboBox('yarnPlyType')
            setYarnPlyTypeoption(yarnlist3);



            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'cone_weight', 'cone_quantity', 'packing_weight', 'yarn_packing_types_id']
            globalQuery.table = "xmv_yarn_packing_types"
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });

            comboDataAPiCall.current.removeCatcheFillCombo(globalQuery).then((yarnTypeApiCall) => {
                setYarnPackingTypeOptions(yarnTypeApiCall)
            })

            const getSpinnPlantApiCall = await comboDataAPiCall.current.fillMasterData("smv_product_type", "", "");
            setproductTypeOption(getSpinnPlantApiCall);

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'production_count_name', 'production_actual_count']
            globalQuery.table = "xmv_spinning_prod_count"
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });

            const columnListdata = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setCountOptions(columnListdata)
            if (keyForViewUpdate === "Add") {
                let productcount = columnListdata[0].field_id
                setcountname(productcount)
            }
            else {
                setcountname()
            }
            let productactualcount = columnListdata[0].production_actual_count
            setActualName(productactualcount)

        } catch (error) {
            console.log("error : ", error)
        }
    }


    const comboOnChange = async (key) => {
        switch (key) {
            case 'cmb_count_id':
                let countVal = parseInt($('#cmb_count_id').val());
                setcountname(countVal);

                const selectedGodown = CountOptions.find(yarnCount => yarnCount.field_id === countVal);
                if (selectedGodown) {
                    setActualName(selectedGodown.production_actual_count)
                } else {
                    setActualName('0')
                }

                break;
            case 'cmb_packing_id':
                let countVal1 = parseInt($('#cmb_packing_id').val());
                setpackingid(countVal1)
                const selectedpacking = yarnPackingTypeOptions.find(yarnCount => yarnCount.field_id === countVal1);
                if (selectedpacking) {
                    settxt_per_packing_weight(selectedpacking.packing_weight);
                    settxt_cone_weight(selectedpacking.cone_weight);
                    setTotalCones(selectedpacking.cone_quantity)
                    setptxt_cone_quantity(selectedpacking.cone_quantity);
                } else {
                    settxt_per_packing_weight('0')
                    settxt_cone_weight('0')
                    setptxt_cone_quantity('0')
                    setTotalCones('0')
                }
                break;
            case 'txt_lot_quantity':
                let count2 = parseInt($('#txt_lot_quantity').val());
                Setlotquantity(count2)
                setTotalPackages(count2);
                break;
            case 'cmb_plant_id':
                let plantId = $('#cmb_plant_id').val();
                setProdPlantName(plantId);
                break;
            case 'cmb_count_id':
                let countId = $('#cmb_count_id').val();
                setcountname(countId);
                break;

            case 'cmb_product_type_id':
                let SpinnplantId = $('#cmb_product_type_id').val();
                setSpinnPlanId(SpinnplantId);
                break;

            case 'cmb_lot_no':
                let cmbLotNo = $('#cmb_lot_no').val();
                const selectedOption = document.getElementById("cmb_lot_no").selectedOptions[0];
                const maxYarn = selectedOption.getAttribute("maxYarn");
                setComboLotNo(cmbLotNo);
                setSubLotNo(cmbLotNo);

        }
    }

    const handleInputChange = (e) => {
        const { id } = e.target;
        const value = document.getElementById(id).value;
        switch (id) {
            case 'txt_cone_weight':
                settxt_cone_weight(validateNumberDateInput.current.decimalNumber(value, 4));
                calculateValues("txt_gross_weight");
                break;
            case 'txt_lot_quantity':
                Setlotquantity(validateNumberDateInput.current.decimalNumber(value, 4));
                calculateValues("txt_gross_weight");
                calculateValues("txt_lot_ending_no");
                break;
            case 'txt_lot_starting_no':
                Setlotstartingno(validateNumberDateInput.current.decimalNumber(value, 4));
                calculateValues("txt_lot_ending_no");
                break;
            case 'cmb_packing_id':
                let countVal1 = parseInt($('#cmb_packing_id').val());
                setpackingid(countVal1)
                const selectedpacking = yarnPackingTypeOptions.find(yarnCount => yarnCount.field_id === countVal1);
                if (selectedpacking) {
                    settxt_per_packing_weight(selectedpacking.packing_weight);
                    settxt_cone_weight(selectedpacking.cone_weight);
                    let coneweight = selectedpacking.cone_weight
                    let lotQuantity = parseInt($('#txt_lot_quantity').val());
                    let totalgrossweight = coneweight * lotQuantity
                    setGrossWeight(totalgrossweight)

                    calculateValues("txt_lot_ending_no");
                }
                else {
                    setGrossWeight('0')
                }
                break;

            default:
                break;
        }
        validateFields();
    }
    const calculateValues = (fieldName) => {
        const getValue = (id) => parseFloat(document.getElementById(id).value);
        const setValue = (setter, value) => setter(isNaN(value) ? 0 : (fieldName === 'txt_gross_weight' ? value.toFixed(2) : value));
        switch (fieldName) {
            case 'txt_gross_weight':
                let coneQuantity = getValue('txt_lot_quantity');
                let coneWeight = getValue('txt_cone_weight');
                if (isNaN(coneQuantity)) coneQuantity = 0;
                if (isNaN(coneWeight)) coneWeight = 0;
                let grossWeight = coneQuantity * coneWeight;
                if (isNaN(grossWeight)) grossWeight = 0; // Set grossWeight to 0 if NaN
                setValue(setGrossWeight, grossWeight);
                break;
            case 'txt_lot_ending_no':
                let lotQuantity = getValue('txt_lot_quantity');
                let txt_lot_starting_no = getValue('txt_lot_starting_no');
                if (isNaN(lotQuantity)) lotQuantity = 0;
                if (isNaN(txt_lot_starting_no)) txt_lot_starting_no = 0;
                let txt_lot_ending_no = lotQuantity + txt_lot_starting_no;
                if (isNaN(txt_lot_ending_no)) txt_lot_ending_no = 0; // Set grossWeight to 0 if NaN
                setValue(SetEndingstartingno, txt_lot_ending_no);
                break;
            default:
                break;
        }
    };




    const fillAutoNo = async () => {
        try {
            const autoNoApiCall = await generateAutoNoAPiCall.current.generateTAutoNo("xm_production_lot_master", "lot_no",
                "", "Lot", "5");

            let startDate = dt_lot_date === undefined ? today() : $('#dt_lot_date').val();

            let string_plantName_Date = ($('#cmb_count_id').find(":selected").text() + '/' + date_toString(startDate) + '/');
            const index_Of_Slash = autoNoApiCall.indexOf('/');
            const lotNocode = autoNoApiCall.substring(0, index_Of_Slash + 1) + string_plantName_Date + autoNoApiCall.substring(index_Of_Slash + 1);
            setLotNo(lotNocode);


            const autoNoApiCallsub = await generateAutoNoAPiCall.current.generateTAutoNo("xm_production_lot_master", "lot_no",
                "", "SubLot", "5");

            let startDatesub = dt_lot_date === undefined ? today() : $('#dt_lot_date').val();
            //let endDate = dt_spin_planenddate === undefined ? today() : $('#dt_spin_planenddate').val();

            let string_sublot_Date = ($('#cmb_count_id').find(":selected").text() + '/' + date_toString(startDatesub) + '/');
            const index_Of_Slash_sub = autoNoApiCallsub.indexOf('/');
            const lotNocodesub = autoNoApiCallsub.substring(0, index_Of_Slash_sub + 1) + string_sublot_Date + autoNoApiCallsub.substring(index_Of_Slash_sub + 1);
            setSubLotNo(lotNocodesub);
            return autoNoApiCallsub, autoNoApiCall;

        } catch (error) {
            console.log('error: ', error);
            navigate('/Error')
        }
    };

    const handleSubmit = async (e) => {
        try {
            setIsLoading(true)
            const checkIsValidate = await validate.current.validateForm("productionLot");
            if (checkIsValidate === true) {
                var chk_is_active;

                activeValue = document.querySelector('input[name=chk_is_active]:checked').value

                switch (activeValue) {
                    case 'true': chk_is_active = 1; break;
                    case 'false': chk_is_active = 0; break;
                    default: break;
                }
                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    financial_year: FINANCIAL_SHORT_NAME,
                    lot_id: lotid,
                    lot_date: dt_lot_date,
                    lot_no: int_lot_no,
                    sub_lot_no: int_sub_lot_no,
                    lot_start_date: dt_lot_start_date,
                    cone_weight: txt_cone_weight,
                    cone_quantity: txt_cone_quantity,
                    per_packing_weight: txt_per_packing_weight,
                    lot_quantity: txt_lot_quantity,
                    lot_end_date: dt_lot_end_date,
                    lot_starting_no: txt_lot_starting_no,
                    sales_type: rb_sales_type,
                    total_cones: txt_total_cones,
                    total_packages: txt_total_packages,
                    gross_weight: txt_gross_weight,
                    net_weight: txt_net_weight,
                    dispatched_packages: txt_dispatched_packages,
                    dispatched_weight: txt_dispatched_weight,
                    lot_status: txt_packing_status,
                    is_active: chk_is_active,
                    created_by: UserName,
                    modified_by: lotid === 0 ? null : UserName,
                    yarn_packing_date: dt_lot_date,
                    production_count_id: cmb_count_id,
                    production_actual_count: txt_actual_name,
                    yarn_packing_types_id: cmb_packing_id,
                    per_packing_weight: txt_per_packing_weight,
                    lot_starting_no: txt_lot_starting_no,
                    lot_ending_no: txt_lot_ending_no,
                    product_type_id: cmb_product_type_id,
                    product_unit_id: cmb_unit_id,
                    plant_id: cmb_plant_id,
                }

                console.log(data);
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const agentApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionLotMaster/FnAddUpdateRecord/`, requestOptions)
                const response = await agentApiCall.json();
                if (response.success === '0') {
                    setErrMsg(response.error)
                    setShowErrorMsgModal(true)
                } else {
                    setSuccMsg(response.message)
                    setShowSuccessMsgModal(true)
                }
            }
        } catch (error) {
            console.log("error", error);
            navigate('/Error')
        } finally {
            setIsLoading(false)
        }
    };


    const FnCheckUpdateResponce = async () => {
        try {
            if (lotid !== 0) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionLotMaster/FnShowParticularRecordForUpdate/${lotid}/${COMPANY_ID}`)
                const updateRes = await apiCall.json();
                let data = updateRes.ProductionLotMasterRecord
                setlotId(data.lotid)
                setLotDate(data.lot_date);
                setComboLotNo(data.lot_no)
                setLotNo(data.lot_no);
                setProdPlantName(data.plant_id);
                await comboOnChange('txt_lot_quantity')
                Setlotquantity(data.lot_quantity)
                setSubLotNo(data.sub_lot_no);
                setActualName(data.production_actual_count)
                setLotStartDate(data.lot_start_date);
                setLotEndDate(data.lot_end_date);
                setcountname(data.production_count_id);
                await comboOnChange('cmb_packing_id')
                setpackingid(data.yarn_packing_types_id);
                await comboOnChange('cmb_product_type_id')
                setSpinnPlanId(data.product_type_id);
                settxt_cone_weight(data.cone_weight);
                settxt_per_packing_weight(data.per_packing_weight);
                setptxt_cone_quantity(data.cone_quantity);
                SetEndingstartingno(data.lot_ending_no)
                Setlotstartingno(data.lot_starting_no)
                setSalesType(data.sales_type);
                setTotalCones(data.total_cones);
                setTotalPackages(data.total_packages);
                setGrossWeight(data.gross_weight);
                setPackingStatus(data.lot_status);
                setIsActive(data.is_active);
                setNetWeight(data.net_weight);
                setDispatchedPackages(data.dispatched_packages);
                setDispatchedWeight(data.dispatched_weight);
                switch (data.is_active) {
                    case true:
                        document.querySelector('input[name="chk_is_active"][value="true"]').checked = true;
                        break;
                    case false:
                        document.querySelector('input[name="chk_is_active"][value="false"]').checked = true;
                        break;
                    default: break;
                }
            }
        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }

    const validateFields = () => {
        validate.current.validateFieldsOnChange('productionLot')
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                $('#saveBtn').attr('disabled', false);
                $('#jol').attr('disabled', true);
                $('#rrdfg').attr('disabled', true);
                break;
            case 'view':
                setActionType('(View)');
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly("productionLot");
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={combobox} />
            <ComboBox ref={comboDataAPiCall} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <GenerateMaterialId ref={generateAutoNoAPiCall} />
            <GenerateTAutoNo ref={generateAutoNoAPiCall} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress />
                        <span>Loading...</span>
                    </div>
                </div> : null}

            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'> Production Lot{actionType}</label>
                    </div>
                    <form id="productionLot">
                        <div className="row erp_transporter_div  text-start">
                            {/* first row */}
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Prod.Plant Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_plant_id" className="form-select form-select-sm" value={cmb_plant_id} onChange={(e) => { comboOnChange('cmb_plant_id'); validateFields(); }}>
                                            <option value="">Select</option>
                                            {plantOptions.length !== 0 ? (
                                                <>{plantOptions?.map(plant => (
                                                    <option value={plant.field_id} shortName={plant.field_name}> {plant.field_name}</option>
                                                ))} </>
                                            ) : null
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_plant_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Yarn Process Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_process_Type" className="form-select form-select-sm" value={cmb_process_Type} onChange={(e) => SetProcessType{e.target.value}; validateFields();}>
                                            <option value="">Select</option>

                                            <>{yarnProcessTypeOptions?.map(yarnProcessType => (
                                                <option value={yarnProcessType.field_id}> {yarnProcessType.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_process_Type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Yarn Process Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_process_Type" className="form-select form-select-sm" value={cmb_process_Type} onChange={(e) => { SetProcessType(e.target.value); validateFields(); }}>
                                            <option value="">Select</option>
                                            <>{yarnProcessTypeOptions?.map(yarnProcessType => (
                                                <option value={yarnProcessType.field_id}> {yarnProcessType.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_value_added_product_Type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Value Added Product Type <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_value_added_product_Type" className="form-select form-select-sm" value={cmb_value_added_product_Type} onChange={(e) => { SetvalueaddedproductType(e.target.value); validateFields(); }}>
                                            <option value="">Select</option>

                                            <>{ValueAddedProductTypeoption?.map(ValueAddedProductType => (
                                                <option value={ValueAddedProductType.field_id}> {ValueAddedProductType.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_value_added_product_Type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Yarn Hosiery<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_yarn_hosiery" className="form-select form-select-sm" value={cmb_yarn_hosiery} onChange={(e) => { SetYarnhosiry(e.target.value); validateFields(); }}>
                                            <option value="">Select</option>

                                            <>{yarnhosieryoption?.map(yarnhosiery => (
                                                <option value={yarnhosiery.field_id}> {yarnhosiery.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_yarn_hosiery" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Yarn Ply Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_yarn_ply_id" className="form-select form-select-sm" value={cmb_yarn_ply_id} onChange={(e) => { Setyarnply(e.target.value); validateFields(); }}>
                                            <option value="" >Select</option>

                                            <>{YarnPlyTypeoption?.map(YarnPlyType => (
                                                <option value={YarnPlyType.field_id}> {YarnPlyType.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_count_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Lot date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id='dt_lot_date' className="erp_input_field" value={dt_lot_date} onChange={e => { setLotDate(e.target.value); validateFields(); }}

                                        />
                                        <MDTypography variant="button" id="error_dt_lot_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Product Count<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_count_id" className="form-select form-select-sm" value={cmb_count_id} onChange={(e) => { comboOnChange('cmb_count_id'); validateFields(); fillAutoNo(); }}>
                                            <option value="" disabled>Select</option>

                                            <>{CountOptions?.map(count => (
                                                <option value={count.field_id}> {count.field_name}</option>
                                            ))} </>


                                        </select>
                                        <MDTypography variant="button" id="error_cmb_count_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Lot no.<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="int_lot_no" maxLength="1000" value={int_lot_no}
                                            onChange={e => { setLotNo(e.target.value); validateFields(); }}
                                        />
                                        <MDTypography variant="button" id="error_int_lot_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Sub Lot no.<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field" id="int_sub_lot_no" maxLength="500" value={int_sub_lot_no}
                                            onChange={e => { setSubLotNo(e.target.value); validateFields(); }}
                                        />
                                        <MDTypography variant="button" id="error_int_sub_lot_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Lot Start Date <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id='dt_lot_start_date' className="erp_input_field" value={dt_lot_start_date} onChange={e => { setLotStartDate(e.target.value); validateFields(); }}
                                        />
                                        <MDTypography variant="button" id="error_dt_lot_start_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Lot End Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id='dt_lot_end_date' className="erp_input_field" value={dt_lot_end_date} onChange={e => { setLotEndDate(e.target.value); validateFields(); }}
                                        />
                                        <MDTypography variant="button" id="error_dt_lot_end_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Unit Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_unit_id" className="form-select form-select-sm" value={cmb_unit_id} onChange={(e) => { setunitname(e.target.value); validateFields(); }}>
                                            <option value="">Select</option>
                                            {unitOptions?.map(unitOpt => (
                                                <option value={unitOpt.field_id} >{unitOpt.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_unit_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Product Actual Count<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" className="erp_input_field text-end" id="txt_actual_name" value={txt_actual_name} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_actual_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Product Type<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_product_type_id" className="form-select form-select-sm" value={cmb_product_type_id} onChange={(e) => { comboOnChange('cmb_product_type_id'); validateFields(); }}>
                                            <option value="" disabled>Select</option>
                                            {productTypeOption.length !== 0 ? (
                                                <>{productTypeOption?.map(productType => (
                                                    <option value={productType.field_id}> {productType.field_name}</option>
                                                ))} </>
                                            ) : null
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_product_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                            </div>

                            {/* second row */}
                            <div className="col-lg-6 ">
                                <div className="row">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Yarn Packing Types<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select id="cmb_packing_id" className="form-select form-select-sm" value={cmb_packing_id} onChange={(e) => { comboOnChange('cmb_packing_id'); handleInputChange(e); validateFields(); }}>

                                                <option value="">Select</option>
                                                {yarnPackingTypeOptions?.map(packingType => (
                                                    <option value={packingType.field_id}>{packingType.field_name}</option>
                                                ))}


                                            </select>
                                            <MDTypography variant="button" id="error_cmb_packing_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Cone Weight<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_cone_weight" value={txt_cone_weight} maxLength="255" onChange={(e) => handleInputChange(e)} />
                                            <MDTypography variant="button" id="error_txt_cone_weight" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Cone Quantity<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_cone_quantity" value={txt_cone_quantity} maxLength="255" />
                                            <MDTypography variant="button" id="error_txt_cone_quantity" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Per Packing Weight<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_per_packing_weight" value={txt_per_packing_weight} maxLength="255" />
                                            <MDTypography variant="button" id="error_txt_per_packing_weight" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Lot Quantity<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_lot_quantity" value={txt_lot_quantity} maxLength="255" onChange={(e) => { comboOnChange('txt_lot_quantity'); handleInputChange(e); validateFields(); }} />
                                            <MDTypography variant="button" id="error_txt_lot_quantity" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Lot Starting No<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_lot_starting_no" value={txt_lot_starting_no} maxLength="255" onChange={e => { Setlotstartingno(e.target.value); validateFields(); handleInputChange(e) }} />
                                            <MDTypography variant="button" id="error_txt_lot_starting_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Lot Ending No<span className="required">*</span> </Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="erp_input_field text-end" id="txt_lot_ending_no" value={txt_lot_ending_no} maxLength="255" onChange={e => { validateFields(); }} />
                                            <MDTypography variant="button" id="error_txt_lot_ending_no" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Sales Type</Form.Label>
                                        </div>
                                        <div className="col">
                                            <div className="erp_form_radio">
                                                <div className="fCheck me-2"> <Form.Check className="erp_radio_button" label="Domestic" type="radio" lbl="Domestic" value="D" name="rb_sales_type" checked={rb_sales_type === "D"} onClick={(e) => { setSalesType('D'); }} optional="optional" /> </div>
                                                <div className="sCheck me-3"> <Form.Check className="erp_radio_button" label="Export" type="radio" lbl="Export" value="E" name="rb_sales_type" checked={rb_sales_type === "E"} onClick={(e) => { setSalesType('E') }} optional="optional" /> </div>
                                                <div className="fCheck"> <Form.Check className="erp_radio_button" label="Sample" type="radio" lbl="Sample" value="S" name="rb_sales_type" checked={rb_sales_type === "S"} onClick={(e) => { setSalesType('S') }} optional="optional" /> </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label"> Total Cones<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id='txt_total_cones' className="erp_input_field text-end" value={txt_total_cones} readOnly maxLength='19' />
                                            <MDTypography variant="button" id="error_txt_total_cones" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Gross Weight<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id='txt_gross_weight' className="erp_input_field text-end" value={txt_gross_weight} readOnly maxLength='19' />
                                            <MDTypography variant="button" id="error_txt_gross_weight" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label"> Total Packages <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id='txt_total_packages' className="erp_input_field  text-end" value={txt_total_packages} readOnly maxLength='19' />
                                            <MDTypography variant="button" id="error_txt_total_packages" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Net Weight<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id='txt_net_weight' className="erp_input_field text-end" value={txt_net_weight} onChange={e => { setNetWeight(e.target.value); validateFields(); }} maxLength='19' />
                                            <MDTypography variant="button" id="error_txt_net_weight" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">PackingStatus</Form.Label>
                                        </div>
                                        <div className='col'>
                                            <select id="txt_packing_status" className="form-select form-select-sm" value={txt_packing_status} onChange={(e) => { setPackingStatus(e.target.value); }} optional="optional"  >
                                                <option value="P" lbl="Pending">Pending</option>
                                                <option value="W" lbl="WIP">WIP</option>
                                                <option value="C" lbl="Completed">Completed</option>
                                                <option value="D" lbl="Dispatched">Dispatched</option>
                                                <option value="I" lbl="Invoice">Invoice</option>
                                                <option value="PC" lbl="PreeClosed">PreeClosed</option>
                                                <option value="X" lbl="Canceled">Canceled</option>
                                            </select>
                                            <MDTypography variant="button" id="error_cmb_txt_packing_status" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Form.Label className="erp-form-label">Is Active</Form.Label>
                                            </div>
                                            <div className="col">
                                                <div className="erp_form_radio">
                                                    <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_is_active" checked={chk_is_active === true} onClick={() => { setIsActive(true); }} /> </div>
                                                    <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_is_active" checked={chk_is_active === false} onClick={() => { setIsActive(false); }} /> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>



                    <div className="card-footer py-2 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MProductionLot/MFrmProductionLotListing/reg' : '/Masters/MProductionLot/MFrmProductionLotListing';

                                navigate(path);
                            }} variant="button" fontWeight="regular"
                        //disabled={props.btn_disabled ? true : false}
                        >Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                    </div >
                </div>
            </div>

            {/* Add new Record Popup */}
            <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Body className='erp_city_modal_body'>
                    <div className='row'>
                        <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
                    </div>
                    {/* <FrmMProductTypeEntry btn_disabled /> */}
                </Modal.Body>

            </Modal >

            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
        </>
    )

}
