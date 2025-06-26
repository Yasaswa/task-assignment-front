
import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useNavigate, useLocation } from "react-router-dom";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { CircularProgress } from "@material-ui/core";

// File Imports
import ComboBox from "Features/ComboBox";
import ConfigConstants from "assets/Constants/config-constant";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";

import FrmValidations from 'FrmGeneric/FrmValidations';
import GenerateMaterialId from "FrmGeneric/GenerateMaterialId/GenerateMaterialId";
import { keyframes } from '@emotion/react';

export default function FrmMCodificationEntry(props) {

    const { state } = useLocation();
    const { product_codification_id = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {};

    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;

    // use refs
    const comboDataAPiCall = useRef();
    const validate = useRef();
    const generateMaterialIdAPiCall = useRef();


    // combobox Option
    const [category5Options, setCategory5Options] = useState([])
    const [category4Options, setCategory4Options] = useState([])
    const [category3Options, setCategory3Options] = useState([])
    const [category2Options, setCategory2Options] = useState([])
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [productCategory1Options, setProductCategory1Options] = useState([])


    // Add Product Type Form Fields
    const [cmb_cd_product_type_id, setProductTypeId] = useState();
    const [cmb_cd_product_category1_id, setProductCategory1ID] = useState('');
    const [cmb_cd_product_category2_id, setProductCategory2ID] = useState('');
    const [cmb_cd_product_category3_id, setPCategory3Id] = useState('');
    const [cmb_cd_product_category4_id, setPCategory4Id] = useState('');
    const [cmb_cd_product_category5_id, setPCategory5Id] = useState('');
    const [txt_product_specification_name, setProductSpecificationName] = useState('');
    const [txt_existingSpecificationName, setExistingSpecificationName] = useState('');
    const [txt_remark, setRemark] = useState('');
    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');


    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MCodification/MCodificationList`)
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // For navigate
    const navigate = useNavigate();
    // Loader
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
        setIsLoading(true);
        ActionType();
        await fillComobos();
        if (product_codification_id !== 0) {
            await FnCheckUpdateResponce();
        }
        setIsLoading(false);
    }, [])
    const fillComobos = async () => {
        comboDataAPiCall.current.fillMasterData("smv_product_type", "", "")
            .then(getProductType => {
                setProductTypeOptions(getProductType)
            })
    }



    // Add rec modal
    const closeAddRecModal = async () => {
        switch (cat5ModalHeaderName) {
            case 'Product Type':
                const productTypeApiCall = await comboDataAPiCall.current.fillMasterData("smv_product_type", "", "")
                setProductTypeOptions(productTypeApiCall)
                break;

            case 'Product Category-1':
                var proctTypeIdVal = document.getElementById('cmb_cd_product_type_id').value;
                setProductTypeId(proctTypeIdVal)

                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: proctTypeIdVal });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
                globalQuery.table = "smv_product_category1"
                var productCat1ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setProductCategory1Options(productCat1ApiCall)
                break;

            case 'Product Category-2':
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var proctTypeIdVal = document.getElementById('cmb_cd_product_type_id').value;

                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: proctTypeIdVal });
                globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
                globalQuery.table = "smv_product_category2"

                var productCat2ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setCategory2Options(productCat2ApiCall)
                break;

            case 'Product Category-3':
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;


                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
                globalQuery.table = "smv_product_category3"

                var productCat3ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setCategory3Options(productCat3ApiCall)
                break;

            case 'Product Category-4':
                var proctTypeIdVal = document.getElementById('cmb_cd_product_type_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;
                var productCat3Val = document.getElementById('cmb_cd_product_category3_id').value;
                var productCat4Val = document.getElementById('cmb_cd_product_category4_id').value;
                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: proctTypeIdVal });
                globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: productCat3Val });
                globalQuery.conditions.push({ field: "product_category4_id", operator: "=", value: productCat4Val });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
                globalQuery.table = "smv_product_category4"
                var productCat4ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setCategory4Options(productCat4ApiCall)
                break;
            case 'Product Category-5':
                var proctTypeIdVal = document.getElementById('cmb_cd_product_type_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;
                var productCat3Val = document.getElementById('cmb_cd_product_category3_id').value;
                var productCat4Val = document.getElementById('cmb_cd_product_category4_id').value;
                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: proctTypeIdVal });
                globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: productCat3Val });
                globalQuery.conditions.push({ field: "product_category4_id", operator: "=", value: productCat4Val });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
                globalQuery.table = "smv_product_category5"
                var productCat5ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                setCategory5Options(productCat5ApiCall)
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
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [cat5ModalHeaderName, setCat5ModalHeaderName] = useState('')



    const handleSubmit = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm('productCodificationFormId');
            if (checkIsValidate) {
                const data = {
                    company_id: COMPANY_ID,
                    product_codification_id: product_codification_id,
                    product_type_id: cmb_cd_product_type_id,
                    product_category1_id: cmb_cd_product_category1_id,
                    product_category2_id: cmb_cd_product_category2_id,
                    product_category3_id: cmb_cd_product_category3_id,
                    product_category4_id: cmb_cd_product_category4_id,
                    product_category5_id: cmb_cd_product_category5_id,
                    product_specification_name: txt_product_specification_name,
                    remark: txt_remark,
                    is_active: chk_isactive,
                    created_by: keyForViewUpdate === '' ? UserName : null,
                    modified_by: keyForViewUpdate === 'update' ? UserName : null,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductCodification/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {

                    const evitCache = comboDataAPiCall.current.evitCache();
                    console.log(evitCache);
                    console.log("product_codification_id", responce.data.product_codification_id);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    };


    const FnCheckUpdateResponce = async () => {
        try {
            if (product_codification_id !== 0) {

                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductCodification/FnShowParticularRecordForUpdate/${product_codification_id}/${COMPANY_ID}`)
                const updateRes = await apiCall.json();

                let codificationData = updateRes.data
                setProductTypeId(codificationData.product_type_id);
                await comboOnChange('productType')
                setProductCategory1ID(codificationData.product_category1_id);
                await comboOnChange('productCategory1')
                setProductCategory2ID(codificationData.product_category2_id);
                await comboOnChange('productCategory2')
                setPCategory3Id(codificationData.product_category3_id)
                await comboOnChange('productCategory3')
                setPCategory4Id(codificationData.product_category4_id)
                await comboOnChange('productCategory4')
                setPCategory5Id(codificationData.product_category5_id)
                setProductSpecificationName(codificationData.product_specification_name);
                setRemark(codificationData.remark);
                setIsActive(codificationData.is_active)
                setExistingSpecificationName(codificationData.product_specification_name);
                switch (keyForViewUpdate) {
                    case 'view':
                        await validate.current.readOnly("productCodificationFormId");
                        $("input[type=radio]").attr('disabled', true);

                        break;
                    case 'update':
                        $('#cmb_cd_product_type_id').attr('disabled', true);
                        // $('#cmb_cd_product_category1_id').attr('disabled', true);
                        // $('#cmb_cd_product_category2_id').attr('disabled', true);
                        // $('#cmb_cd_product_category3_id').attr('disabled', true);
                        // $('#txt_product_specification_name').attr('disabled', true);
                        break;
                }
            }

        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }

    const comboOnChange = async (key) => {
        switch (key) {
            case 'productType':
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                setProductCategory1Options([]);
                setCategory2Options([]);
                setCategory3Options([]);
                setCategory4Options([]);
                setCategory5Options([]);
                setProductCategory1ID('');
                setProductCategory2ID('');
                setPCategory3Id('');
                setPCategory4Id('');
                setPCategory5Id('');
                if (productTpVal === '0') {
                    setProductTypeId(productTpVal)
                    setCat5ModalHeaderName('Product Type')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    setProductTypeId(productTpVal)
                    $('#error_cmb_cd_product_type_id').hide();
                    resetGlobalQuery();
                    globalQuery.columns.push("field_id");
                    globalQuery.columns.push("field_name");
                    globalQuery.table = "smv_product_category1"
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    const productCategory1ApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);
                    setProductCategory1Options(productCategory1ApiCall);
                    await FnGenerateTechSpecName();
                }
                break;

            case 'productCategory1':
                setCategory2Options([]);
                setCategory3Options([]);
                setCategory4Options([]);
                setCategory5Options([]);
                setProductCategory2ID('');
                setPCategory3Id('');
                setPCategory4Id('');
                setPCategory5Id('');
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;

                if (productCat1Val === '0') {
                    setProductCategory1ID(productCat1Val)
                    setCat5ModalHeaderName('Product Category-1')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    setProductCategory1ID(productCat1Val)
                    resetGlobalQuery();
                    globalQuery.columns.push("field_id");
                    globalQuery.columns.push("field_name");
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                    globalQuery.table = "smv_product_category2"
                    var productCat2ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                    setCategory2Options(productCat2ApiCall)
                    // setTimeout(async () => {
                    //     await FnGenerateTechSpecName();
                    // }, 200);
                    await FnGenerateTechSpecName();
                }
                break;

            case 'productCategory2':
                setCategory3Options([]);
                setCategory4Options([]);
                setCategory5Options([]);
                setPCategory3Id('');
                setPCategory4Id('');
                setPCategory5Id('');
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                if (productCat2Val === '0') {
                    setProductCategory2ID(productCat2Val)
                    setCat5ModalHeaderName('Product Category-2')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    setProductCategory2ID(productCat2Val)
                    // Product category 3 list
                    resetGlobalQuery();
                    globalQuery.columns.push("field_id");
                    globalQuery.columns.push("field_name");
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                    globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.table = "smv_product_category3"

                    var productCat3ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                    setCategory3Options(productCat3ApiCall)
                    // setTimeout(async () => {
                    //     await FnGenerateTechSpecName();
                    // }, 200);
                    await FnGenerateTechSpecName();
                }

                break;
            case 'productCategory3':
                setCategory4Options([]);
                setCategory5Options([]);
                setPCategory4Id('');
                setPCategory5Id('');
                var productCat3Val = document.getElementById('cmb_cd_product_category3_id').value;
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                if (productCat3Val === '0') {
                    setPCategory3Id(productCat3Val)
                    setCat5ModalHeaderName('Product Category-3')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    setPCategory3Id(productCat3Val)

                    // Product category 4 list
                    resetGlobalQuery();
                    globalQuery.columns.push("field_id");
                    globalQuery.columns.push("field_name");
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                    globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                    globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: productCat3Val });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.table = "smv_product_category4"
                    var productCat4ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                    setCategory4Options(productCat4ApiCall)
                    // setTimeout(async () => {
                    //     await FnGenerateTechSpecName();
                    // }, 200);
                    await FnGenerateTechSpecName();

                }
                break;
            case 'productCategory4':
                setCategory5Options([]);
                setPCategory5Id('');
                var productCat4Val = document.getElementById('cmb_cd_product_category4_id').value;
                var productCat3Val = document.getElementById('cmb_cd_product_category3_id').value;
                var productCat2Val = document.getElementById('cmb_cd_product_category2_id').value;
                var productCat1Val = document.getElementById('cmb_cd_product_category1_id').value;
                var productTpVal = document.getElementById('cmb_cd_product_type_id').value;
                if (productCat4Val === '0') {
                    setPCategory4Id(productCat4Val)
                    setCat5ModalHeaderName('Product Category-4')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    setPCategory4Id(productCat4Val)
                    // Product category 5 list
                    resetGlobalQuery();
                    globalQuery.columns.push("field_id");
                    globalQuery.columns.push("field_name");
                    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                    globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: productTpVal });
                    globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
                    globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: productCat2Val });
                    globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: productCat3Val });
                    globalQuery.conditions.push({ field: "product_category4_id", operator: "=", value: productCat4Val });
                    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                    globalQuery.table = "smv_product_category5"
                    var productCat5ApiCall = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
                    setCategory5Options(productCat5ApiCall)
                    // setTimeout(async () => {
                    //     await FnGenerateTechSpecName();
                    // }, 200);
                    await FnGenerateTechSpecName();

                }
                break;
            case 'productCategory5':
                var productCat5Val = document.getElementById('cmb_cd_product_category5_id').value;
                setPCategory5Id(productCat5Val)

                if (productCat5Val === '0') {
                    setCat5ModalHeaderName('Product Category-5')
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 200)
                } else {
                    // setTimeout(async () => {
                    //     await FnGenerateTechSpecName();
                    // }, 200);
                    await FnGenerateTechSpecName();
                }

                break;

        }
    }

   



const validateFields = () => {
    validate.current.validateFieldsOnChange('productCodificationFormId')
}


const ActionType = async () => {
    switch (keyForViewUpdate) {

        case 'update':
            setActionType('(Modification)');
            break;

        case 'view':
            setActionType('(View)');
            break;

        default:
            setActionType('(Creation)');
            break;
    }

};

const FnGenerateTechSpecName = async () => {
    debugger
    let productTypeValue = document.getElementById("cmb_cd_product_type_id").value;
    let productTypeShortName = document.getElementById("cmb_cd_product_type_id").options[document.getElementById("cmb_cd_product_type_id").selectedIndex].text;
    let productTpText = productTypeValue !== "0" && productTypeValue !== "" ? productTypeShortName : "";
    let productCat1Text = document.getElementById("cmb_cd_product_category1_id").options[document.getElementById("cmb_cd_product_category1_id").selectedIndex].text;
    let productCat2Text = document.getElementById("cmb_cd_product_category2_id").options[document.getElementById("cmb_cd_product_category2_id").selectedIndex].text;
    let productCat3Text = document.getElementById("cmb_cd_product_category3_id").options[document.getElementById("cmb_cd_product_category3_id").selectedIndex].text;
    let productCat4Text = document.getElementById("cmb_cd_product_category4_id").options[document.getElementById("cmb_cd_product_category4_id").selectedIndex].text;
    let productCat5Text = document.getElementById("cmb_cd_product_category5_id").options[document.getElementById("cmb_cd_product_category5_id").selectedIndex].text;
    let productMakeText = "";
    let productMaterialGradeText = "";

    const autoTextApiCall = await generateMaterialIdAPiCall.current.GenerateTechnicalSpecName(productTpText, productCat1Text, productCat2Text, productCat3Text,
        productCat4Text, productCat5Text, productMakeText, productMaterialGradeText);
    setProductSpecificationName(autoTextApiCall);
}

// fn check already exist specification name
const fnSpecificationNameExists = async (specificationName) => {
    if (specificationName !== "" && specificationName !== undefined) {
        if (specificationName !== txt_existingSpecificationName) {
            resetGlobalQuery();
            globalQuery.columns.push("product_specification_name");
            globalQuery.columns.push("product_codification_id");
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "product_specification_name", operator: "=", value: specificationName });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
            globalQuery.table = "sm_product_codification"
            let getSpecificationName = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)
            if (getSpecificationName.length !== 0) {
                $('#error_txt_product_specification_name').text("Specification name aready exists...!")
                $('#error_txt_product_specification_name').show();
            } else {
                $('#error_txt_product_specification_name').hide();
            }
        }
    }
}


return (
    <>
        {isLoading ?
            <div className="spinner-overlay"  >
                <div className="spinner-container">
                    <CircularProgress color="primary" />
                    <span id="spinner_text" className="text-dark">Loading...</span>
                </div>
            </div> :
            null}
        <div className='erp_top_Form'>
            <div className='card p-1'>
                <FrmValidations ref={validate} />
                <ComboBox ref={comboDataAPiCall} />
                <GenerateMaterialId ref={generateMaterialIdAPiCall} />
                <div className='card-header text-center py-0'>
                    <label className='erp-form-label-lg main_heding'>Codification{actionType}  </label>
                </div>

                <form id="productCodificationFormId">
                    <div className="row erp_transporter_div">
                        <div className="col-sm-6 erp_form_col_div">

                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Type<span className="required">*</span></Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_type_id" className="form-select form-select-sm" value={cmb_cd_product_type_id} onChange={() => { comboOnChange('productType'); validateFields(); }}>
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {productTypeOptions?.map(productType => (
                                            <option value={productType.field_id}>{productType.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Category1</Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_category1_id" className="form-select form-select-sm" value={cmb_cd_product_category1_id} onChange={() => { comboOnChange('productCategory1'); validateFields(); }} optional="optional">
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {productCategory1Options?.map(productCategory1 => (
                                            <option value={productCategory1.field_id}>{productCategory1.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_category1_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Category2</Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_category2_id" className="form-select form-select-sm" value={cmb_cd_product_category2_id} onChange={() => { comboOnChange('productCategory2'); validateFields(); }} optional="optional">
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {category2Options?.map(productCategory2 => (
                                            <option value={productCategory2.field_id}>{productCategory2.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_category2_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Category3</Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_category3_id" className="form-select form-select-sm" value={cmb_cd_product_category3_id} onChange={() => { comboOnChange('productCategory3'); validateFields(); }} optional="optional">
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {category3Options?.map(productCategory3 => (
                                            <option value={productCategory3.field_id}>{productCategory3.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_category3_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Category 4</Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_category4_id" className="form-select form-select-sm" value={cmb_cd_product_category4_id} onChange={() => { comboOnChange('productCategory4'); validateFields(); }} optional="optional">
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {category4Options?.map(productCategory4 => (
                                            <option value={productCategory4.field_id}>{productCategory4.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_category4_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                        </div>

                        {/* second row */}

                        <div className="col-sm-6 erp_form_col_div">
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label">Product Category 5</Form.Label>
                                </div>
                                <div className='col'>
                                    <select id="cmb_cd_product_category5_id" className="form-select form-select-sm" value={cmb_cd_product_category5_id} onChange={() => { comboOnChange('productCategory5'); validateFields(); }} optional="optional">
                                        <option value="">Select</option>
                                        <option value="0">Add New Record+</option>
                                        {category5Options?.map(productCategory5 => (
                                            <option value={productCategory5.field_id}>{productCategory5.field_name}</option>

                                        ))}

                                    </select>
                                    <MDTypography variant="button" id="error_cmb_cd_product_category5_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label"> Specification Name<span className="required">*</span></Form.Label>
                                </div>
                                <div className='col'>
                                    <Form.Control type="text" id="txt_product_specification_name" className="erp_input_field" value={txt_product_specification_name}
                                        onBlur={(e) => { fnSpecificationNameExists(e.target.value); }}
                                        onChange={e => { setProductSpecificationName(e.target.value); validateFields(); }} maxLength="255" />
                                    <MDTypography variant="button" id="error_txt_product_specification_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-3'>
                                    <Form.Label className="erp-form-label"> Remark </Form.Label>
                                </div>
                                <div className='col'>
                                    <Form.Control as="textarea" rows={1} className="erp_txt_area" id="txt_remark" value={txt_remark} onChange={e => { setRemark(e.target.value); validateFields(); }} maxLength="255" optional="optional" />
                                    <MDTypography variant="button" id="error_txt_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                    </MDTypography>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-3">
                                    <Form.Label className="erp-form-label">Is Active </Form.Label>
                                </div>
                                <div className="col">
                                    <div className="erp_form_radio">
                                        <div className="fCheck">
                                            <Form.Check
                                                className="erp_radio_button"
                                                label="Yes"
                                                type="radio"
                                                value="1"
                                                name="isactive" checked={chk_isactive === true} onClick={() => { setIsActive(true); }}

                                            />
                                        </div>
                                        <div className="sCheck">
                                            <Form.Check
                                                className="erp_radio_button"
                                                label="No"
                                                value="0"
                                                type="radio" checked={chk_isactive === false} onClick={() => { setIsActive(false); }}
                                                name="isactive"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
                <div className="card-footer py-0 text-center">
                    <MDButton type="button" className="erp-gb-button"
                        onClick={() => {
                            const path = compType === 'Register' ? '/Masters/MCodification/MCodificationList/reg' : '/Masters/MCodification/MCodificationList';
                            navigate(path);
                        }} variant="button" fontWeight="regular" disabled={props.btn_disabled ? true : false} >Back</MDButton>

                    {keyForViewUpdate !== 'view' ? (
                        <MDButton type="submit" onClick={handleSubmit} id="save_btn_id" className="erp-gb-button erp_MLeft_btn " variant="button"
                            fontWeight="regular">{keyForViewUpdate === "" ? 'Save' : 'Update'}</MDButton>
                    ) : null}

                </div >
            </div>

            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


            {/* //changes by tushar */}
            <Modal size="lg" show={showAddRecModal} onHide={closeAddRecModal} backdrop="static" keyboard={false} centered >

                <Modal.Body className='erp_city_modal_body'>
                    <div className='row'>
                        <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={closeAddRecModal}></button></div>
                    </div>
                    {/* {DisplayRecordComponent()} */}
                </Modal.Body>
            </Modal >


        </div>
    </>
)
}
