import React, { useLayoutEffect, useMemo } from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';

// React Icons
import { MdDelete, MdRefresh } from 'react-icons/md';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";




// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import { Accordion, Modal, Table, Button } from "react-bootstrap";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";


// import react icons
import { useLocation } from "react-router-dom";
// React icons

import { AiOutlineSchedule } from "react-icons/ai";


// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ConfigConstants from "assets/Constants/config-constant";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';



function ProductionRegister({ goToNext }) {

    const ProductionRegi = useRef();
    const validate = useRef();

    const { state } = useLocation();
    const { ProductionRegisterId, keyForViewUpdate } = state || {}
    // const [productionDetailData, setproductionDetailData] = useState([])

    const [actionType, setActionType] = useState('Save')


    const [ProductionData, setProductionData] = useState([])
    console.log('ProductionData:', ProductionData);
    const [designationOptions, setDesignationOptions] = useState([]);

    //Current date
    const today = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    // Productuion Register states
    const [productionRegisterData, setProductionRegisterData] = useState([])
    const [rowCount, setRowCount] = useState(1)

    const [actionLabel, setActionLabel] = useState('Save')

    //Shift wise Ring Frame Prduction hooks
    const [dt_spinning_production_date, setProdPlanDate] = useState(today);
    const [txt_prod_month, setProdMonth] = useState();
    const [txt_prod_year, setProdYear] = useState();
    const [cmb_plant_id, setProdPlantName] = useState('');
    const [cmb_section_id, setProdSection] = useState();
    const [cmb_sub_section_id, setProdSubSection] = useState();
    const [cmb_shift, setShift] = useState([]);
    const [txt_target_efficiency, setProdTargetEff] = useState();
    const [txt_no_of_machine, setProdNoOfMachine] = useState();

    const [accountCount, setAccountCount] = useState();

    const [spinningProdCountOptions, setSpinngProdCountOptions] = useState([]);


    ///Shiftwise Machine Stoppage Entry(Ring Frame) Comboboxes
    const [machineOptions, setProdMachineOptions] = useState([]);
    const [stoppagereasonOptions, setProdStoppageReasonOptions] = useState([]);
    const [salesordernoOpts, setsalesordernoOpts] = useState([]);

    // For Refs
    const validateNumberDateInput = useRef();
    const combobox = useRef();

    const [isLoading, setIsLoading] = useState(false);


    ///Shiftwise Machine Wastage Entry(Ring Frame) Combobox
    const [prodWastageOptions, setProdWastageOptions] = useState([]);
    const [wastageDetails, setWastageDetails] = useState([]);

    // selece order sales no list 
    const [salesOrderNo, setsalesOrderNo] = useState([]);


    ///////RIng Frame Production Shift Details
    const [machineNumData, setMachineNumData] = useState([]);
    const [ringFrameProdShiftData, setRingFrameProdShiftData] = useState([]);


    //Shift wise Ring Frame Prduction comboboxes
    const [spinplanyearOptions, setSpinPlanYearOptions] = useState([]);
    const [plantOptions, setPlantOptions] = useState([]);
    const [prodsectionOptions, setProdSectionOptions] = useState([]);
    const [prodsubsectionOptions, setProdSubSectionOptions] = useState([]);
    const [shiftOptions, setShiftOptions] = useState([]);

    const comboOnChange = async (key) => {
        switch (key) {
            case 'cmb_section_id':
                const prod_section_Id = $('#cmb_section_id').val();
                const getProdSubSectionApiCall = await comboDataAPiCall.current.fillMasterData("xmv_production_sub_section", "production_section_id", prod_section_Id);
                setProdSubSectionOptions(getProdSubSectionApiCall);
                break;
        }
    }

    const setMonthYear = (value) => {

        setProdPlanDate(value);
        var dateComponents = value.split('-');
        setProdMonth(dateComponents[1]);
        setProdYear(dateComponents[0])
    }


    ///Production summary Hooks
    const [prodSummaryRowsFirstCol, setprodSummaryRowsFirstCol] = useState(['No Of Machine', '100% Production', 'Target Production', 'Actual Production', 'Production Loss', 'Stoppage Time(mins)', 'Shift Wastage(Kgs)', 'Spindle Utilize']);

    ////useRef Hooks
    const comboDataAPiCall = useRef();


    const renderproductionsummary = useMemo(() => {
        return (<div style={{ display: "block", overflow: "auto", height: "320px" }}>
            <Table id="todaysProdSummaryTableId" bordered striped>
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th"></th>
                        <th className="erp_table_th text-center" colSpan={3}>
                            Today's Production Summary
                        </th>
                        <th className="erp_table_th text-center" colSpan={3}>
                            Up To Day's Production Summary
                        </th>
                    </tr>
                </thead>
                <thead className="erp_table_head">
                    <tr style={{ borderWidth: '1px' }}>
                        <th className="erp_table_th">Description</th>
                        {shiftOptions?.map((header, indexOfItem) => (
                            <th key={indexOfItem} className="erp_table_th" id={`${header}`}>
                                {header.field_name}
                            </th>
                        ))}
                        <th className="erp_table_th">Total</th>
                        {shiftOptions?.map((header, indexOfItem) => (
                            <th key={indexOfItem} className="erp_table_th" id={`${header}`}>
                                {header.field_name}
                            </th>
                        ))}
                        <th className="erp_table_th">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {prodSummaryRowsFirstCol?.map((firstCol, index) => (
                        <tr key={index}>
                            <td className="erp_table_td">{firstCol}</td>
                            <td colSpan={3}></td>
                            <td colSpan={3}></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>)
    }, [shiftOptions, prodSummaryRowsFirstCol])





    const productionregisterdetails = (indexToRemove) => {
        const updatedproductionDetailData = ProductionData.filter((item, index) => index !== indexToRemove);
        setProductionData(updatedproductionDetailData);
    }




    const validateFields = () => {
        validate.current.validateFieldsOnChange("ProductionRegisterId")
    }


    const FnValidateForm = async () => {
        const checkIsValidate = await validate.current.validateForm("ProductionRegisterId");
        if (!checkIsValidate) {
            return false;
        }
        let projectRegisterValid = true;
        const tableRows = document.querySelectorAll('#productionRegisterTbl tbody tr');
        tableRows.forEach(row => {
            const dateName = row.querySelector('input[id^="date_"]').value;
            if (dateName === '') {
                row.querySelector('input[id^="date_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                row.querySelector('input[id^="date_"]').focus();
                projectRegisterValid = false;
                return;
            } else {
                delete row.querySelector('input[id^="date_"]').parentElement.dataset.tip;
            }


        })
        return projectRegisterValid;

    }


    // const FnAddProductionRegisterDetails = async () => {
    //     debugger;
    //     try {
    //         setIsLoading(true)
    //         let checkIsValidate = false;
    //         checkIsValidate = await FnValidateForm()

    //        // const json = { 'TransAgent': {}, 'TransAgentContactData': []} }
    //         if (checkIsValidate) {
    //             const data = {
    //                 //   company_id: COMPANY_ID,
    //                 //   company_branch_id: COMPANY_BRANCH_ID,



    //             };
    //             // 'TransAgent': {}, 'TransAgentContactData': [], 'TransAgentBankData': [] 
    //             json.TransAgentContactData = setProductionData
    //             // json.TransAgentBankData = agentBankData

    //             // const formData = new FormData()
    //             //  formData.append('TransAgentData', JSON.stringify(json))

    //             const forwardData = {
    //                 method: 'POST',
    //                 // body: formData,
    //             }


    //         }
    //     } catch (error) {
    //         console.log("error", error);
    //         // navigate('/Error')
    //     } finally {
    //         setIsLoading(false)
    //     }

    // }


    const FnAddProductionRegisterDetails = async () => {
        console.log(productionRegisterData);
        debugger;
        try {
            setIsLoading(true);
            let checkIsValidate = false;
            checkIsValidate = await FnValidateForm();

            if (checkIsValidate) {
                const data = {};

                // Assuming setProductionData is already defined somewhere in your code
                console.log('setProductionData:', setProductionData);

                const json = { 'TransAgent': {}, 'TransProductionData': [] };
                json.TransProductionData = ProductionData;

                // Print ProductionData to the console
                console.log('ProductionData:', ProductionData);

                const forwardData = {
                    method: 'POST',
                };
            }
        } catch (error) {
            console.log("error", error);
            // navigate('/Error')
        } finally {
            setIsLoading(false);
        }
    };


    const removeFirstRow = (indexToRemove) => {
        if (indexToRemove !== 0) {
            const updatedProductionRegisterData = productionRegisterData.filter((item, index) => index !== indexToRemove);
            setProductionRegisterData(updatedProductionRegisterData)
        } else {
            const updatedProductionRegisterData = [...productionRegisterData];  // Create a copy of the array
            updatedProductionRegisterData[0] = { ...productionObject }; // Set values of 0th index to the contactBlankObject
            setProductionRegisterData(updatedProductionRegisterData);
        }
    }

    const productionObject = {

        sr_no: 0,
        date: '',
        salesOrderNo: '',
        setNo: '',
        houseNo: '',
        partyName: '',
        countValue: '',
        accountCount: '',
        yarnSource: '',
        netwt: '',
        onofcreel: '',
        totalpkgused: '',
        totalWeightissueToWpg: '',
        weightpkg: '',
        bottomKgs: '',
        totalEnds: '',
        lengthTotal: '',
        damagedcone: '',
        breaksMillion: '',
        bottomKg: '',
        emptycones: '',
        bottompercentage: '',

    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update');

                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("ProductionRegisterId");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }

    };


    useEffect(async () => {
        await fillComboBox();
    }, [])

    const fillComboBox = async () => {

        debugger;
        resetGlobalQuery();
        globalQuery.columns.push("sales_order_no");
        globalQuery.table = "mtv_sales_order_master_trading_summary";
        // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID, });
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

        const getsalesordernoUpdatedApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);
        // Extract sales_order_no values from getsalesordernoUpdatedApiCall array
        const salesOrderNumbers = getsalesordernoUpdatedApiCall.map(item => item.sales_order_no);
        setsalesordernoOpts(salesOrderNumbers);

        comboDataAPiCall.current.fillMasterData("amv_financial_year", "", "").then((plantApiCall) => {
            setSpinPlanYearOptions(plantApiCall);
        })

        comboDataAPiCall.current.fillMasterData("cmv_plant", "", "").then((getProdPlantApiCall) => {
            setPlantOptions(getProdPlantApiCall);
        })

        comboDataAPiCall.current.fillMasterData("xmv_production_section", "", "").then((getProdSectionApiCall) => {
            setProdSectionOptions(getProdSectionApiCall);
        })

        comboDataAPiCall.current.fillComboBox('ProductionShifts').then((shiftsApiCall) => {
            setShiftOptions(shiftsApiCall);
        })

        comboDataAPiCall.current.fillMasterData("cmv_machine", "", "").then((getProdMachineApiCall) => {
            setProdMachineOptions(getProdMachineApiCall);
        })

        comboDataAPiCall.current.fillMasterData(" xmv_production_stoppage_reasons", "", "").then((getProdStoppageReasonsApiCall) => {
            setProdStoppageReasonOptions(getProdStoppageReasonsApiCall);
        })

        comboDataAPiCall.current.fillMasterData(" xmv_production_wastage_types", "", "").then((getProdWastageReasonsApiCall) => {
            setProdWastageOptions(getProdWastageReasonsApiCall);
        })


        const fetchSalesOrderNo = async () => {
            try {
                const response = await comboDataAPiCall.current.fillMasterData("mtv_sales_order_master_trading_summary", "", "");
                setsalesOrderNo(response);
            } catch (error) {
                console.error("Error fetching sales order numbers:", error);
                // Handle error if needed
            }
        }

        //////Ring Frame Production Shift Details
        resetGlobalQuery();
        globalQuery.columns = ['production_actual_count', 'field_id', 'field_name', 'production_count_id'];
        globalQuery.table = "xmv_spinning_prod_count"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        const getSpinningProdCountCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
        setSpinngProdCountOptions(getSpinningProdCountCall);

        const getMachineNosApiCall = await comboDataAPiCall.current.fillMasterData("cmv_machine", "", "");
        setMachineNumData(getMachineNosApiCall);

        const prodShiftDataArray = (getMachineNosApiCall.map((machine, index) => {
            return {
                machineId: machine.field_id,
                machineName: machine.field_name,
                actual_count: '',
                speed: '',
                tpi: '',
                tm: '',
                efficiency_percent: '',
                spindles: '',
                grams_100: '',
                grams_target: '',
                grams_actual: '',
                kgs_100: '',
                kgs_target: '',
                kgs_actual: '',
                efficiency_Target: '',
                prod_loss_with_reason: '',
                prod_loss_with_out_reason: '',
                waste_percent: '',
                production_mixing: '',
                production_count_desc: '',
                conversion_40s: '',
                total_stoppage_time: '',
                total_stoppage_spindles: '',
                yarn_construction: ''
            };

        }));
        setRingFrameProdShiftData(prodShiftDataArray);


    }


    const FnUpdateProductionRegiterTblRows = (rowData, event) => {
        debugger;
        // let eventId = document.getElementById(event.target.id);
        let clickedColName = event.target.getAttribute('Headers');
        let enteredValue = event.target.value;

        switch (clickedColName) {
            case 'sr_no':
                rowData[clickedColName] = enteredValue;
                if (enteredValue !== '')
                    delete document.querySelector('input[id^="date_"]').parentElement.dataset.tip;
                break;
            // CREEL CNDS * ON.OF.CREEL	= 	TOTAL PKG USED

            case 'creelcnds':
                debugger;
                if (!isNaN(enteredValue)) {
                    rowData[clickedColName] = enteredValue;
                    const packageused = rowData.onofcreel * enteredValue;
                    rowData['totalpkgused'] = isNaN(packageused) ? 0 : packageused;
                } else {
                    rowData[clickedColName] = 0;
                    rowData['totalpkgused'] = 0;
                }
                break;

            // TOTAL PKG USED * WEIGHT / PKG = TOTAL WEIGHT ISSUE TO WPG	
            case 'weightpkg':
                if (!isNaN(enteredValue)) {
                    rowData[clickedColName] = enteredValue;
                    rowData['totalWeightissueToWpg'] = Math.round(rowData['totalpkgused'] * enteredValue);
                } else {
                    rowData[clickedColName] = 0;
                    rowData['totalWeightissueToWpg'] = 0;
                }
                break;
            // TOTAL WEIGHT ISSUE TO WPG  - NET.WT = BOTTOM KGS
            case 'netWt':
                debugger;
                if (!isNaN(enteredValue)) {
                    rowData[clickedColName] = enteredValue;
                    const newbottomkgs = rowData['totalWeightissueToWpg'] - enteredValue;
                    rowData['bottomKgs'] = newbottomkgs;
                } else {
                    rowData[clickedColName] = 0;
                    rowData['bottomKgs'] = rowData['totalWeightissueToWpg'];
                }
                break;

            //	BOTTOM KG  * 100 / TOTAL WEIGHT ISSUE TO WPG	
            case 'bottomKg':
                if (!isNaN(enteredValue)) {
                    rowData[clickedColName] = enteredValue;

                    rowData['bottompercentage'] = validateNumberDateInput.current.decimalNumber(JSON.stringify(enteredValue * 100 / parseFloat(rowData['totalWeightissueToWpg'])), 2);
                } else {
                    rowData[clickedColName] = 0;
                    rowData['bottompercentage'] = 0;
                }
                break;
            case 'totalWeightissueToWpg':
                if (!isNaN(enteredValue)) {
                    rowData[clickedColName] = parseFloat(enteredValue);

                    rowData['bottompercentage'] = validateNumberDateInput.current.decimalNumber(JSON.stringify(rowData['bottomKg'] / rowData['totalWeightissueToWpg']), 2);
                } else {
                    rowData[clickedColName] = 0;
                    rowData['bottompercentage'] = 0;
                }
                break;


            // (LENGTH  * T.ENDS ) / (1693 * A.COUNT)
            case 'lengthTotal':
            case 'totalEnds':
            case 'actual_count':
                rowData[clickedColName] = enteredValue;
                const lengthTotal = parseFloat(rowData['lengthTotal']);
                const totalEnds = parseFloat(rowData['totalEnds']);
                const accountCount = parseFloat(rowData['actual_count']);

                const netWt = (lengthTotal * totalEnds) / (1693 * accountCount);
                rowData['netWt'] = isNaN(netWt) ? 0 : validateNumberDateInput.current.decimalNumber(JSON.stringify(netWt), 2);

                const newbottomkgs = rowData['totalWeightissueToWpg'] - rowData['netWt'];
                rowData['bottomKgs'] = Math.round(newbottomkgs);

                break;

            // salesOrderNo
            case 'salesOrderNo':
                rowData[clickedColName] = enteredValue;
                break;

            case 'onofcreel':
                rowData[clickedColName] = enteredValue;
                rowData.totalpkgused = rowData.creelcnds * rowData.onofcreel;

                break;

            case 'sr_no':
            // case 'salesOrderNo':
            case 'date':
            // case 'setNo':
            case 'houseNo':
            case 'partyName':
            case 'countValue':
            case 'accountCount':
            case 'yarnSource':
            //case 'totalpkgused':
            case 'totalWeightissueToWpg':
            case 'weightpkg':
            case 'bottomKgs':
            // case 'totalEnds':
            // case 'lengthTotal':
            case 'damagedcone':
            case 'breaksMillion':
            case 'bottomKg':
            case 'emptycones':
            case 'bottompercentage':

                rowData[clickedColName] = enteredValue;
                // if (enteredValue.length >= 10) {
                //     delete eventId.parentElement.dataset.tip;
                // }
                rowData[clickedColName] = enteredValue; // Update the value in rowData
                calculateTotalPackageUsed(rowData); // Call a function to calculate the total package used

                break;
        }

        const productionDetails = [...productionRegisterData];
        const arrayIndex = parseInt(event.target.parentElement.getAttribute('rowindex'));
        productionDetails[arrayIndex] = rowData;
        setProductionRegisterData(productionDetails);
    }

    const calculateTotalPackageUsed = (rowData) => {
        if (rowData.hasOwnProperty('creelcnds') && rowData.hasOwnProperty('onofcreel')) {
            const creelcnds = parseFloat(rowData.creelcnds);
            const onofcreel = parseFloat(rowData.onofcreel);
            const totalpkgused = creelcnds * onofcreel; // Perform the multiplication
            rowData.totalpkgused = totalpkgused; // Update the totalpkgused value in rowData
            updateTable(); // Call a function to update the table with the new values
        }
    }

    const updateTable = () => {
        // Implement logic to update the table with the new values
    }

    useLayoutEffect(() => {
        const getExistingProductionRegisterData = [...productionRegisterData]
        getExistingProductionRegisterData.push(productionObject)
        setProductionRegisterData(getExistingProductionRegisterData)
    }, [rowCount])

    const setRowCountAndAddRow = () => {
        debugger;
        const lastRowIndex = productionRegisterData.length - 1;
        const lastRowContactPerson = productionRegisterData[lastRowIndex].date;
        if (lastRowContactPerson !== '') {
            setRowCount(rowCount + 1);
        } else {
            const tableRows = document.querySelectorAll('#productionRegisterTbl tbody tr');
            tableRows.forEach(row => {
                const bankContactName = row.querySelector('input[id^="date_"]').value;
                if (bankContactName === '') {
                    row.querySelector('input[id^="date_"]').parentElement.dataset.tip = 'Please fill this Field...!';

                    row.querySelector('input[id^="date_"]').focus();
                    return;
                } else {
                    delete row.querySelector('input[id^="date_"]').parentElement.dataset.tip;
                }
            }
            )
        }
    };

    const renderProjectRigisterTable = useMemo(() => {
        return <Table id='productionRegisterTbl' className={`erp_table ${productionRegisterData.length !== 0 ? 'display' : 'd-none'}`} responsive bordered striped>
            <thead className="erp_table_head">
                <tr id="headerRowId">
                    <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Sr.No</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Date</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Sales Order No</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >Set.No</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >In-House/No</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >Party Name</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >Count</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >A.Count</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}  >Yarn Source </th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >Creel Cnds</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>On.Of.Creel</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Total PKG Used </th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} >Weight/ PKG</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Total Weight Issue To WPG</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Bottom KGS</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>T.Ends</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }} > Length</th>
                    <th className="erp_table_th" style={{ paddingRight: "35px" }}>Net.WT </th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Breaks Millon</th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Bottom KG </th>
                    <th className="erp_table_th" style={{ paddingRight: "30px" }}>Bottom</th>

                </tr>
            </thead>


            <tbody>
                {productionRegisterData.map((item, index) =>
                    <tr rowindex={index} className="sticky-column">
                        <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
                            <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
                            <IoAddCircleOutline className='erp_trAdd_icon' onClick={setRowCountAndAddRow} />
                            {/* <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> */}

                            {/* {
                    index === 0 ? <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> : null
                  } */}
                        </td>
                        {/* sr.no */}
                        <td className='erp_table_td'>
                            {


                            } {index + 1}
                        </td>

                        {/* date  */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="date" className="erp_input_field mb-0"
                                            id={`date_${index}`} value={dt_spinning_production_date} Headers='date'
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} onBlur={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} />
                                    </>
                                    : item.date
                            }
                        </td>
                        {/*SALES ORDER NO */}
                        <td className="erp_table_td">
                            <select
                                id={`salesOrderNo_${index}`}
                                value={item.salesOrderNo}
                                style={{ width: '150px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"
                                onChange={(e) => FnUpdateProductionRegiterTblRows(item, e)}
                                Headers='salesOrderNo'
                            >
                                <option value="">Select</option>
                                {salesordernoOpts.map((salesOrderNumbers, index) => (
                                    <option value={salesOrderNumbers}>
                                        {salesOrderNumbers}
                                    </option>
                                ))}

                            </select>
                        </td>



                        {/* SET.NO */}
                        <td className="erp_table_td">
                            <select
                                id={`setNo_${index}`} value={item.setNo} style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"

                                onChange={(e) => FnUpdateProductionRegiterTblRows(item, e)}
                                Headers='actual_count'
                            >
                                <option value="" >Select</option>
                                <option>6109</option>
                                <option>6112</option>
                                <option>6116</option>
                                <option>6117</option>
                                <option>6118</option>
                                <option>6120</option>
                                <option>6121</option>
                                <option>6127</option>
                                <option>6128</option>
                                <option>6129</option>
                                <option>6130</option>
                                <option>6139</option>
                                <option>6142</option>
                                <option>6143</option>
                                <option>6144</option>
                                <option>6149</option>
                                <option>6150</option>
                                <option>6151</option>
                                <option>6160</option>
                                <option>6161</option>
                                <option>6162</option>
                                <option>6163</option>
                                <option>6169</option>
                                <option>6174</option>
                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}


                            </select>
                        </td>

                        {/* IN-HOUSE NAME */}
                        <td className="erp_table_td">
                            <select
                                id={`houseNo_${index}`} value={item.houseNo} style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"

                                onChange={(e) => FnUpdateProductionRegiterTblRows(e, item)}
                                Headers='actual_count'
                            >
                                <option value="" >Select</option>
                                <option>IN-HOUSE</option>
                                <option>JOB</option>
                                <option>SELL-PURCHASE</option>


                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}


                            </select>
                        </td>

                        {/* PARTY NAME */}
                        <td className="erp_table_td">
                            <select
                                id={`partyName_${index}`} value={item.partyName} style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"

                                onChange={(e) => FnUpdateProductionRegiterTblRows(e, item)}
                                Headers='actual_count'
                            >
                                <option value="" >Select</option>
                                <option>PASHUPATI</option>
                                <option>SHARDABHUMI</option>
                                <option>RESHMA</option>
                                <option>JAYTEX</option>


                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}


                            </select>
                        </td>

                        {/* COUNT */}
                        <td className="erp_table_td">
                            <select
                                id={`countValue_${index}`} value={item.countValue} style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"

                                onChange={(e) => FnUpdateProductionRegiterTblRows(e, item)}
                                Headers='actual_count'
                            >
                                <option value=""  >Select</option>
                                <option>16 OE</option>
                                <option>20 CCW</option>
                                <option>30 KCW</option>
                                <option>10 CW SLUB</option>
                                <option>16 K SLUB</option>
                                <option>30 CCW</option>
                                <option>23 CP</option>
                                <option>30 CCW</option>
                                <option>20 OE</option>

                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}


                            </select>
                        </td>
                        {/* A.COUNT */}
                        <td className="erp_table_td">
                            <select
                                id={`accountCount_${index}`}
                                value={item.setAccountCount}
                                style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"
                                onChange={(e) => { setAccountCount(); FnUpdateProductionRegiterTblRows(item, e) }} // Corrected passing of parameters
                                Headers='actual_count'
                            >
                                <option value="">Select</option>
                                <option value="16">16</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="10">10</option>
                                <option value="23">23</option>
                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        {/* {Yarn Source} */}
                        <td className="erp_table_td">
                            <select
                                id={`yarnSource_${index}`} value={item.yarnSource} style={{ width: '100px' }}
                                className="erp_input_field_table_txt form-select form-select-sm"

                                onChange={(e) => FnUpdateProductionRegiterTblRows(e, item)}
                                Headers='actual_count'
                            >
                                <option value="" >Select</option>
                                <option>WHITE GOLD</option>
                                <option>PASHUPATI</option>
                                <option>TRIDENT</option>
                                <option>VARDHMAN</option>
                                <option>KANCHAN</option>
                                <option>JAYPRABHU</option>
                                <option>MAHIMA</option>
                                <option>GCTHREAD</option>
                                <option>ORITO</option>
                                <option>SUDHIVA</option>


                                {spinningProdCountOptions?.map((prodCount) => (
                                    <option key={prodCount.field_id} value={prodCount.production_actual_count}>
                                        {prodCount.field_name}
                                    </option>
                                ))}


                            </select>
                        </td>

                        {/* CREEL CNDS  Multiplication      */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`netwt_${index}`} value={item.creelcnds}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='creelcnds' />
                                    </>
                                    : item.creelcnds
                            }
                        </td>
                        {/* ON.OF.CREEL  Multiplication */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`densit_${index}`} value={item.onofcreel}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='onofcreel' />
                                    </>
                                    : item.onofcreel
                            }
                        </td>

                        {/* total calculate  CREEL CNDS*ON.OF.CREELh=TOTAL PKG USED  Multiplication */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`wildyarn_${index}`} value={item.totalpkgused}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='totalpkgused' />
                                    </>
                                    : item.totalpkgused
                            }
                        </td>

                        {/* WEIGHT / PKG (TOTAL PKG USED *WEIGHT/PNG (ENTRY)= total weight issue  to wpg   )	 */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`weightpkg_${index}`} value={item.weightpkg}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='weightpkg' />
                                    </>
                                    : item.weightpkg
                            }
                        </td>


                        {/* ToTAL WEIGHT ISSUE TO WPG     */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0" disabled
                                            id={`totalWeightissueToWpg_${index}`} value={item.totalWeightissueToWpg}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='totalWeightissueToWpg' />
                                    </>
                                    : item.totalWeightissueToWpg
                            }
                        </  td>


                        {/* BOTTOM KGS */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0" disabled
                                            id={`bottomKgs_${index}`} value={item.bottomKgs}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='bottomKgs' />
                                    </>
                                    : item.bottomKgs
                            }
                        </td>

                        {/* T.ENDS */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`totalEnds_${index}`} value={item.totalEnds}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='totalEnds' />
                                    </>
                                    : item.totalEnds
                            }
                        </td>

                        {/* LENGTH */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`length_${index}`} value={item.lengthTotal}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='lengthTotal' />
                                    </>
                                    : item.lengthTotal
                            }
                        </td>

                        {/* NET.WT	 */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`netWt_${index}`} value={item.netWt}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='netWt' />
                                    </>
                                    : item.netWt
                            }
                        </td>

                        {/* BREAKS MILLION */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`breaksMillion_${index}`} value={item.breaksMillion}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='breaksMillion' />
                                    </>
                                    : item.breaksMillion
                            }
                        </td>

                        {/* BOTTOM KG */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`bottomKg_${index}`} value={item.bottomKg}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='bottomKg' />
                                    </>
                                    : item.bottomKg
                            }
                        </td>

                        {/* BOTTOM percentage */}
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0" disabled
                                            id={`bottompercentage_${index}`} value={item.bottompercentage}
                                            onChange={(e) => { FnUpdateProductionRegiterTblRows(item, e); }} Headers='bottompercentage' />
                                    </>
                                    : item.bottompercentage
                            }
                        </td>


                    </tr>
                )}
            </tbody>
        </Table>
    }, [productionRegisterData, designationOptions, salesordernoOpts])


    return (
        <>

            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <ComboBox ref={comboDataAPiCall} />
            <ComboBox ref={ProductionRegi} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1 '>
                    <div className='card-header text-center py-0'>
                        {<label className='erp-form-label-lg main_heding'>DIRECT WARPING PRODUCTION REGISTER{actionType}</label>}
                    </div>
                    <form id='productionmasterId'>
                        <div className='row p-1'>
                            {/* 1 st Column */}
                            <div className='col-sm-4 erp_form_col_div'>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Prod. Start Date <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id='dt_spinning_production_date' className="erp_input_field" value={dt_spinning_production_date} onChange={(e) => { setMonthYear(e.target.value) }} />
                                        <MDTypography variant="button" id="error_dt_spinning_production_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Production Month <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id='txt_prod_month' className="erp_input_field" value={txt_prod_month} disabled />
                                        <MDTypography variant="button" id="error_txt_prod_month" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Production Year <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id='txt_prod_year' className="erp_input_field" value={txt_prod_year} disabled />
                                        <MDTypography variant="button" id="error_txt_prod_year" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Prod. Plant Name <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_plant_id" className="form-select form-select-sm" value={cmb_plant_id} onChange={(e) => { setProdPlantName(e.target.value); }}>
                                            <option value="" disabled>Select</option>
                                            {plantOptions.length !== 0 ? (
                                                <>{plantOptions?.map(plant => (
                                                    <option value={plant.field_id}>{plant.field_name}</option>
                                                ))} </>
                                            ) : null
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_plant_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Shift <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_shift" className="form-select form-select-sm" value={cmb_shift} onChange={(e) => { setShift(e.target.value); }}>
                                            <option value="">Select</option>
                                            {shiftOptions.length !== 0 ? (
                                                <>
                                                    {shiftOptions?.map(shift => (
                                                        <option value={shift.field_id}>{shift.field_name}</option>
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
                                        <Form.Label className="erp-form-label">Production Section <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_section_id" className="form-select form-select-sm" value={cmb_section_id} onChange={(e) => { setProdSection(e.target.value); comboOnChange('cmb_section_id') }}>
                                            <option value="">Select</option>
                                            {prodsectionOptions.length !== 0 ? (
                                                <>
                                                    {prodsectionOptions?.map(production => (
                                                        <option value={production.field_id}>{production.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_section_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Prod. Sub Section <span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="cmb_sub_section_id" className="form-select form-select-sm" value={cmb_sub_section_id} onChange={(e) => { setProdSubSection(e.target.value); }}>
                                            <option value="">Select</option>
                                            {prodsubsectionOptions.length !== 0 ? (
                                                <>
                                                    {prodsubsectionOptions?.map(subproduction => (
                                                        <option value={subproduction.field_id}>{subproduction.field_name}</option>
                                                    ))}
                                                </>
                                            ) : null

                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_sub_section_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                            </div>
                            <div className='col-sm-1 erp_form_col_div'></div>

                            {/* ..............2nd Column.......................... */}
                            <div className='col-sm-6 erp_form_col_div'>
                                <div className='erp-form-label-lg text-center'>Production Summary</div>
                                {renderproductionsummary}
                            </div>
                        </div>
                    </form>
                    <hr />
                    <Accordion defaultActiveKey="0" className="mt-3">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header className="erp-form-label-md">DIRECT WARPING PRODUCTION REGISTER</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <div className="mt-10">
                                    <>
                                        {renderProjectRigisterTable}
                                    </>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>



                </div >
                <hr />
                <div className='text-center mb-5 mt-3 py-5'>
                    {/* <MDButton type="button" className="erp-gb-button" variant="button" fontWeight="regular"
                                    onClick={() => {
                                        const path = compType === 'Register' ? '/Masters/AgentListing/reg' : '/Masters/AgentListing';
                                        navigate(path);
                                    }} >Back</MDButton> */}
                    <MDButton type="button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" onClick={FnAddProductionRegisterDetails}
                        fontWeight="regular">{actionLabel}</MDButton>
                    {/* <MDButton className={`erp-gb-button ms-2 ${'' === 0 ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={() => goToNext( keyForViewUpdate)}>
                                    Next
                                </MDButton> */}

                </div>


            </div >

        </>
    )
} export default ProductionRegister


