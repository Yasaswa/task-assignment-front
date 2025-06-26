import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { RxCrossCircled } from "react-icons/rx";

// File Imports
import ComboBox from "Features/ComboBox";
import DocumentF from "Features/Document";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";

import FrmHSNSAC from "Masters/MHSN-SAC/FrmHSN-SAC";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"

import FrmMServiceActivityEntry from "Masters/MServiceActivity/MServiceActivityEntry";
import { Accordion, Table } from "react-bootstrap";

import Datatable from "components/DataTable";
import { CircularProgress } from "@material-ui/core";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";
import GenerateMaterialId from "FrmGeneric/GenerateMaterialId/GenerateMaterialId";
import Tooltip from "@mui/material/Tooltip";


//changes by ujjwala on 9/1/2024 case no. 1
function FrmMServiceEntry(props) {
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, COMPANY_CATEGORY_COUNT } = configConstants;
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const { productSrId = 0, keyForViewUpdate, compType, productId = 0 } = state || {}

  const [categoryCount, setCategoryCount] = useState(sessionStorage.getItem('compRMCatCount') !== "" && sessionStorage.getItem('compRMCatCount') !== null ? parseInt(sessionStorage.getItem('compRMCatCount')) : 0);
  let docGroup = "Service";
  //use refs
  const validateNumberDateInput = useRef();
  const generateMaterialIdAPiCall = useRef();

  // For navigate
  const navigate = useNavigate();
  const validate = useRef();
  const comboDataAPiCall = useRef();
  // Combo Options
  const [product_id, setproduct_id] = useState(productId)
  const [product_sr_id, setProductSrId] = useState(productSrId)
  const [productTypeOptions, setProductTypeOptions] = useState([])
  const [productCategory1Options, setProductCategory1Options] = useState([])
  const [productCategory2Options, setProductCategory2Options] = useState([])
  const [productCategory3Options, setProductCategory3Options] = useState([])
  const [productCategory4Options, setProductCategory4Options] = useState([])
  const [productCategory5Options, setProductCategory5Options] = useState([])
  const [hsnSacCodeOptions, setProductHsnSacCodeOptions] = useState([])
  const [srSaleUnitOptions, setSrSaleUnitOptions] = useState([])

  //  Form Fields
  const [cmb_product_type_id, setProductTypeId] = useState()
  const [cmb_product_category1_id, setProductCategory1Id] = useState('10');
  const [cmb_product_category2_id, setProductCategory2Id] = useState('10');
  const [cmb_product_category3_id, setProductCategory3Id] = useState('10');
  const [cmb_product_category4_id, setProductCategory4Id] = useState('10');
  const [cmb_product_category5_id, setProductCategory5Id] = useState('10');
  const [txt_material_id, setMaterialId] = useState('');

  const [txt_product_sr_code, setProductSrCode] = useState('');
  const [txt_product_sr_name, setProductSrName] = useState('');
  const [txt_product_sr_short_name, setProductSrShortName] = useState('');
  const [txt_product_sr_print_name, setProductSrPrintName] = useState('');
  const [txt_product_sr_tech_spect, setProductSrTechSpect] = useState('');
  const [cmb_product_sr_hsn_sac_code_id, setProductSrHsnSacCodeId] = useState('');
  const [txt_product_sr_std_price, setProductSrStdPrice] = useState(1);
  const [txt_product_sr_std_hours, setProductSrStdHours] = useState(1);
  const [txt_product_sr_std_profit_percent, setProductSrStdProfitPercent] = useState(1);
  const [txt_product_sr_std_discount_percent, setProductSrStdDiscountPercent] = useState(0);
  const [cmb_product_sr_sales_unit_id, setProductSrSalesUnitId] = useState('6');
  const [txt_product_sr_bar_code, setProductSrBarCode] = useState('');
  const [file_sr_qr_code, setSrQrCode] = useState();
  const [file_product_sr_qr_code, setProductSrQrCode] = useState('');
  const [chk_isactive, setIsActive] = useState(true);
  const [txt_remark, setRemark] = useState('');
  const [cmb_process_duration, setProcessDuration] = useState('One Time');
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')
  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  //const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/FrmMServiceListing`);

    }
  }
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Document Form
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const handleCloseDocumentForm = () => setShowDocumentForm(false);
  const viewDocumentForm = () => setShowDocumentForm(true);

  // Table Data
  const [Suppdata, setSuppData] = useState([]);
  const [Suppcolumns, setSuppColumns] = useState([]);
  const [QaMappingdata, setQaMappingData] = useState([]);
  const [QaMappingcolumns, setQaMappingColumns] = useState([]);
  let qaMappColumnHeads;

  const [processdata, setProcessData] = useState([]);
  const [processcolumns, setProcessColumns] = useState([]);
  const [custdata, setCustData] = useState([]);
  const [custcolumns, setCustColumns] = useState([]);
  const [activitiesTblData, setActivitiesTblData] = useState([]);


  //responce fron fncheck
  const [supplierMappingData, setSupplierMappingData] = useState([]);
  const [processMappingData, setProcessMappingData] = useState([]);
  const [qaMappingData, setQAMappingData] = useState([]);
  const [CustomerMappingData, setCustomerMappingData] = useState([]);
  const [activitiesTblDataResp, setActivitiesTblDataResp] = useState([]);


  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {
      case 'Product Type':
        resetGlobalQuery();
        globalQuery.columns.push("field_id");
        globalQuery.columns.push("field_name");
        globalQuery.columns.push("product_type_short_name");
        globalQuery.table = "smv_product_type"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
        globalQuery.conditions.push({ field: "product_type_group", operator: "=", value: 'SR' });
        comboDataAPiCall.current.removeCatcheFillCombo(globalQuery).then((productTypeApiCall) => {
          setProductTypeOptions(productTypeApiCall)
        })


        break;
      case 'Product Category 1':
        comboOnChange('productType')
        break;
      case 'Product Category 2':
        comboOnChange('productCategory1')
        break;
      case 'Product Category 3':
        comboOnChange('productCategory2')
        break;
      case 'Product Category 4':
        comboOnChange('productCategory3')
        break;
      case 'Product Category 5':
        comboOnChange('productCategory4')
        break;

      case 'HSN-SAC':
        comboDataAPiCall.current.fillMasterData("cmv_hsn_sac", "is_delete", "0").then((HsnSacCodeApiCall) => {
          setProductHsnSacCodeOptions(HsnSacCodeApiCall)
        })
        break;

      case 'Activity':
        await FnShowAllActivitiesRecords();
        break;

      case 'SrsalesUnit':
        comboDataAPiCall.current.fillMasterData("smv_product_unit", "is_delete", "0").then((productSrUnitApiCall) => {
          setSrSaleUnitOptions(productSrUnitApiCall)
        })
        break;

      default:
        break;
    }
    setShowAddRecModal(false);
    sessionStorage.removeItem('dataAddedByCombo')
    setTimeout(() => {
      $(".erp_top_Form").css({ "padding-top": "110px" });
    }, 200)

  }

  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [modalHeaderName, setHeaderName] = useState('')

  useEffect(async () => {
    debugger
    setIsLoading(true);
    try {
      await ActionType()
      await fillComobos();
      // await FnShowAllActiveRecords();
      if (product_sr_id !== 0 && productSrId !== undefined) {
        await FnCheckUpdateResponce();
      }

    } catch (error) {

      console.error(error);
      navigate('/Error')
    } finally {

      setIsLoading(false);
    }
    $(document).on('mouseup', function (e) {
      var container = $("#enquiry-order-ul");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
  }, [])


  const fillComobos = async () => {
    debugger
    // product_id



    // const productTypeApiCall = await comboDataAPiCall.current.fillMasterDataWithOperator("smv_product_type", "product_type_short_name", "NOT IN", "('FG', 'BR')")
    // const productTypeApiCall = await comboDataAPiCall.current.fillMasterDataWithOperator("smv_product_type", "product_type_short_name", "IN", "('SR', 'GN', 'TM')")
    // setProductTypeOptions(productTypeApiCall)

    //changes by tushar 
    resetGlobalQuery();
    globalQuery.columns.push("field_id");
    globalQuery.columns.push("field_name");
    globalQuery.columns.push("product_type_short_name");
    globalQuery.table = "smv_product_type"
    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
    globalQuery.conditions.push({ field: "product_type_group", operator: "=", value: 'SR' });
    comboDataAPiCall.current.removeCatcheFillCombo(globalQuery).then((productTypeApiCall) => {
      setProductTypeOptions(productTypeApiCall)
    })

    comboDataAPiCall.current.fillMasterData("cmv_hsn_sac", "hsn_sac_type", "SAC").then((HsnSacCodeApiCall) => {
      setProductHsnSacCodeOptions(HsnSacCodeApiCall)
    })

    comboDataAPiCall.current.fillMasterData("smv_product_unit", "is_delete", "0").then((productSrUnitApiCall) => {
      setSrSaleUnitOptions(productSrUnitApiCall)
    })

    console.log("product_id", product_id);
    for (let count = 0; count <= COMPANY_CATEGORY_COUNT; count++) {
      $('#product_category' + count + '_id').show()
    }
    // Category label display
    resetGlobalQuery();
    globalQuery.columns.push("property_value");
    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
    globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'SRCategorySettings' });
    globalQuery.orderBy = ["property_id"];
    globalQuery.table = "amv_properties"
    var labelList = await comboDataAPiCall.current.fillFiltersCombo(globalQuery)

    // Display category labels
    if (labelList.length !== 0) {
      for (let count = 0; count < COMPANY_CATEGORY_COUNT; count++) {
        $('#cat' + count + 'Label').append(labelList[count].property_value)
      }
    } else {
      for (let count = 1; count < COMPANY_CATEGORY_COUNT; count++) {
        $('#cat' + count + 'Label').append('SR Category ' + [count] + ' :')
      }
    }


  }

  //changes by ujjwala on 9/1/2024 case no .3
  const ActionType = async () => {
    debugger
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')

        $('#txt_material_id').attr('disabled', true);
        $('#txt_product_sr_name').attr('disabled', true);
        $('#txt_product_sr_short_name').attr('disabled', true);
        $('#cmb_product_type_id').attr('disabled', true);
        $('#cmb_process_duration').attr('disabled', true);
        $('#cmb_product_category1_id').attr('disabled', true);
        $('#cmb_product_category2_id').attr('disabled', true);
        $('#cmb_product_category3_id').attr('disabled', true);
        $('#cmb_product_category4_id').attr('disabled', true);
        $('#cmb_product_category5_id').attr('disabled', true);


        break;
      case 'view':
        setActionType('(View)');
        await validate.current.readOnly("servicesFormId");
        $("input[type=radio]").attr('disabled', true);
        $('#checkSupplier').attr('disabled', true);
        $('#checkcustomer').attr('disabled', true);
        $('#checkProcess').attr('disabled', true)
        $('#checkQaMapp').attr('disabled', true)
        $("form").find("input,textarea,select").attr("disabled", "disabled");
        $('.selectCustomer').attr('disabled', true)
        $('.selectProcess').attr('disabled', true)
        $('.selectQaMapping').attr('disabled', true)
        $('.selectSupplier').attr('disabled', true)
        $("input[type=radio]").attr('disabled', true);
        $('#btn_save').attr('disabled', true);
        break;

      case 'delete':
        setActionType('(Delete)');
        await validate.current.readOnly("servicesFormId");
        $("input[type=radio]").attr('disabled', true);
        $('#checkSupplier').attr('disabled', true);
        $('#checkcustomer').attr('disabled', true);
        $('#checkProcess').attr('disabled', true)
        $('#checkQaMapp').attr('disabled', true)
        $("form").find("input,textarea,select").attr("disabled", "disabled");
        $('.selectCustomer').attr('disabled', true)
        $('.selectProcess').attr('disabled', true)
        $('.selectQaMapping').attr('disabled', true)
        $('.selectSupplier').attr('disabled', true)
        $("input[type=radio]").attr('disabled', true);
        $('#btn_save').attr('disabled', true);
        break;

      default:
        setActionType('(Creation)');
        break;
    }

  };
  //end

  const FnCheckUpdateResponce = async () => {
    debugger
    try {
      debugger;
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnShowAllMaintenanceMasterAndDetailsRecords/${product_sr_id}/${COMPANY_ID}`)
      const responce = await apiCall.json();
      if (responce.ProductServiceMasterRecords !== null) {
        let productServiceMasterRecords = responce.ProductServiceMasterRecords;

        let productServiceCustomerRecords = responce.ProductServiceCustomerRecords;
        let productServiceProcessRecordsRecords = responce.ProductServiceProcessRecordsRecords;
        let productServiceQaMappingModelRecords = responce.ProductServiceQaMappingModelRecords;
        let productServiceSupplierModelRecords = responce.ProductServiceSupplierModelRecords;
        let productServiceActivityModelRecords = responce.ProductServiceActivitiesRecords;


        setSupplierMappingData(productServiceSupplierModelRecords);
        setProcessMappingData(productServiceProcessRecordsRecords);
        setQAMappingData(productServiceQaMappingModelRecords);
        setCustomerMappingData(productServiceCustomerRecords);
        setActivitiesTblDataResp(productServiceActivityModelRecords);

        setproduct_id(productServiceMasterRecords.product_id)
        setProductTypeId(productServiceMasterRecords.product_type_id)
        await comboOnChange('productType')
        setProcessDuration(productServiceMasterRecords.process_duration)
        setProductCategory1Id(productServiceMasterRecords.product_category1_id)
        await comboOnChange('productCategory1')
        setProductCategory2Id(productServiceMasterRecords.product_category2_id)
        await comboOnChange('productCategory2')
        setProductCategory3Id(productServiceMasterRecords.product_category3_id)
        await comboOnChange('productCategory3')
        setProductCategory4Id(productServiceMasterRecords.product_category4_id)
        await comboOnChange('productCategory4')
        setProductCategory5Id(productServiceMasterRecords.product_category5_id)
        setMaterialId(productServiceMasterRecords.material_id)
        setProductSrCode(productServiceMasterRecords.product_sr_code)
        setProductSrName(productServiceMasterRecords.product_sr_name)
        setProductSrShortName(productServiceMasterRecords.product_sr_short_name)
        setProductSrPrintName(productServiceMasterRecords.product_sr_print_name)
        setProductSrTechSpect(productServiceMasterRecords.product_sr_tech_spect)
        setProductSrHsnSacCodeId(productServiceMasterRecords.product_sr_hsn_sac_code_id)
        setProductSrStdPrice(productServiceMasterRecords.product_sr_std_price)
        setProductSrStdHours(productServiceMasterRecords.product_sr_std_hours)
        setProductSrStdProfitPercent(productServiceMasterRecords.product_sr_std_profit_percent)
        setProductSrStdDiscountPercent(productServiceMasterRecords.product_sr_std_discount_percent)
        setProductSrSalesUnitId(productServiceMasterRecords.product_sr_sales_unit_id)
        setProductSrSalesUnitId(productServiceMasterRecords.product_sr_sales_unit_id)
        setProductSrBarCode(productServiceMasterRecords.product_sr_bar_code)
        setProductSrQrCode(productServiceMasterRecords.product_sr_qr_code)
        setRemark(productServiceMasterRecords.remark)
        setIsActive(productServiceMasterRecords.is_active);


        if (responce.ProductServiceCustomerRecords !== null) {

          productServiceCustomerRecords.forEach((existingServiceData) => {
            $('#selectCustomer_' + existingServiceData.customer_id).prop('checked', true);
          })
        }

        if (responce.ProductServiceProcessRecordsRecords !== null) {
          productServiceProcessRecordsRecords.forEach(function (existingprocessdata) {
            $('#selectProcess_' + existingprocessdata.product_process_id).prop('checked', true);
          })
        }

        if (responce.ProductServiceQaMappingModelRecords !== null) {
          productServiceQaMappingModelRecords.forEach(function (existingQaMapping) {
            $('#selectQaMapping_' + existingQaMapping.product_qa_parameters_id).prop('checked', true);
          })
        }

        if (responce.ProductServiceSupplierModelRecords !== null) {
          productServiceSupplierModelRecords.forEach(function (existingSupplier) {
            $('#selectSupplier_' + existingSupplier.supplier_id).prop('checked', true);
          })
        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  //changes by ujjwala on 9/1/2024 case no. 1
  const comboOnChange = async (key) => {
    debugger
    const selectedProductType = document.getElementById('cmb_product_type_id').value;
    switch (key) {
      case 'productType':
        let productTpVal = document.getElementById('cmb_product_type_id').value;
        if (productTpVal === '0') {
          setProductTypeId(productTpVal)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Type')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");

          }, 200)
        } else {
          setProductTypeId(productTpVal)
          if (productTpVal !== "") {
            $('#error_cmb_product_type_id').hide();
            const shortName = document.getElementById("cmb_product_type_id").options[document.getElementById("cmb_product_type_id").selectedIndex].getAttribute('ptShortName')
            localStorage.setItem('ptShortName', shortName)
            if (productSrId === 0 || productSrId === undefined) {
              await FnGenerateMaterialId(productTpVal, shortName);
              // await FnGetProductTypeDependentCombo(productTpVal);
            }
          }
          const productCategory1ApiCall = await comboDataAPiCall.current.fillMasterData("smv_product_category1", "product_type_id", productTpVal)
          setProductCategory1Options(productCategory1ApiCall)
          setProductCategory1Id('');
          setProductCategory2Id('');
          setProductCategory3Id('');
          setProductCategory4Id('');
          setProductCategory5Id('');
        }
        break;

      case 'productCategory1':
        let productCat1Val = document.getElementById('cmb_product_category1_id').value;
        if (productCat1Val === '0') {
          setProductCategory1Id(productCat1Val)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Category 1')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          setProductCategory1Id(productCat1Val)
          // Product category 2 list
          resetGlobalQuery();
          globalQuery.columns.push("field_id");
          globalQuery.columns.push("field_name");
          globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: selectedProductType });
          globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: productCat1Val });
          globalQuery.table = "smv_product_category2"
          let productCat2ApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery)
          setProductCategory2Options(productCat2ApiCall)
          if (productCat1Val !== "") { $('#error_cmb_product_category1_id').hide(); }
          setProductCategory2Id('');
          setProductCategory3Id('');
          setProductCategory4Id('');
          setProductCategory5Id('');
        }
        break;

      case 'productCategory2':
        if (document.getElementById('cmb_product_category2_id').value === '0') {
          setProductCategory1Id(document.getElementById('cmb_product_category2_id').value)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Category 2')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          // Product category 3 list
          setProductCategory2Id(document.getElementById('cmb_product_category2_id').value)
          resetGlobalQuery();
          globalQuery.columns.push("field_id");
          globalQuery.columns.push("field_name");
          globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: selectedProductType });
          globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: document.getElementById('cmb_product_category1_id').value });
          globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: document.getElementById('cmb_product_category2_id').value });
          globalQuery.table = "smv_product_category3"
          let productCat3ApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery)
          setProductCategory3Options(productCat3ApiCall)
          if (document.getElementById('cmb_product_category2_id').value !== "") { $('#error_cmb_product_category2_id').hide(); }
          setProductCategory3Id('');
          setProductCategory4Id('');
          setProductCategory5Id('');
        }
        break;

      case 'productCategory3':
        if (document.getElementById('cmb_product_category3_id').value === '0') {
          setProductCategory1Id(document.getElementById('cmb_product_category3_id').value)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Category 3')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          // Product category 4 list
          setProductCategory3Id(document.getElementById('cmb_product_category3_id').value)
          resetGlobalQuery();
          globalQuery.columns.push("field_id");
          globalQuery.columns.push("field_name");
          globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: selectedProductType });
          globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: document.getElementById('cmb_product_category1_id').value });
          globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: document.getElementById('cmb_product_category2_id').value });
          globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: document.getElementById('cmb_product_category3_id').value });
          globalQuery.table = "smv_product_category4"
          let productCat4ApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery)
          setProductCategory4Options(productCat4ApiCall)
          if (document.getElementById('cmb_product_category3_id').value !== "") { $('#error_cmb_product_category3_id').hide(); }
          setProductCategory4Id('');
          setProductCategory5Id('');
        }
        break;

      case 'productCategory4':
        if (document.getElementById('cmb_product_category4_id').value === '0') {
          setProductCategory1Id(document.getElementById('cmb_product_category4_id').value)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Category 4')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          // Product category 4 list
          setProductCategory4Id(document.getElementById('cmb_product_category4_id').value)
          resetGlobalQuery();
          globalQuery.columns.push("field_id");
          globalQuery.columns.push("field_name");
          globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
          globalQuery.conditions.push({ field: "product_type_id", operator: "=", value: selectedProductType });
          globalQuery.conditions.push({ field: "product_category1_id", operator: "=", value: document.getElementById('cmb_product_category1_id').value });
          globalQuery.conditions.push({ field: "product_category2_id", operator: "=", value: document.getElementById('cmb_product_category2_id').value });
          globalQuery.conditions.push({ field: "product_category3_id", operator: "=", value: document.getElementById('cmb_product_category3_id').valueCat3Val });
          globalQuery.conditions.push({ field: "product_category4_id", operator: "=", value: document.getElementById('cmb_product_category4_id').value });
          globalQuery.table = "smv_product_category5"
          let productCat5ApiCall = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery)
          setProductCategory5Options(productCat5ApiCall)
          if (document.getElementById('cmb_product_category4_id').value !== "") { $('#error_cmb_product_category4_id').hide(); }
        }
        break;

      case 'productCategory5':
        if (document.getElementById('cmb_product_category5_id').value === '0') {
          setProductCategory1Id(document.getElementById('cmb_product_category5_id').value)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Product Category 5')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          setProductCategory5Id(document.getElementById('cmb_product_category5_id').value)
          if (document.getElementById('cmb_product_category5_id').value !== "") { $('#error_cmb_product_category5_id').hide(); }
        }
        break;

      case 'hsnSacCode':
        let productHsnSacCode = document.getElementById('cmb_product_sr_hsn_sac_code_id').value;
        if (productHsnSacCode === '0') {
          setProductSrHsnSacCodeId(productHsnSacCode)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('HSN-SAC')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        } else {
          setProductSrHsnSacCodeId(productHsnSacCode)
          if (productHsnSacCode !== "") { $('#error_cmb_product_sr_hsn_sac_code_id').hide(); }
        }
        break;

      case 'SrsalesUnit':
        let productSrSalesUnitId = document.getElementById('cmb_product_sr_sales_unit_id').value;
        if (productSrSalesUnitId === '0') {
          setProductSrSalesUnitId(productSrSalesUnitId)
          sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
          setHeaderName('Sr sale Unit')
          setShowAddRecModal(true)
          setTimeout(() => {
            $(".erp_top_Form").eq(1).css("padding-top", "0px");
          }, 200)
        }
        setProductSrSalesUnitId(productSrSalesUnitId)
        if (productSrSalesUnitId !== "") { $('#error_cmb_product_sr_sales_unit_id').hide(); }
        break;
    }
  }

  //end
  const displayRecordComponent = () => {
    switch (modalHeaderName) {

      case 'HSN-SAC':
        return <FrmHSNSAC btn_disabled={true} />

      case 'Activity':
        return <FrmMServiceActivityEntry btn_disabled={true} />;

      default:
        return null;
    }
  }


  function toggleServiceChkBoxes(key) {
    switch (key) {
      // For customer check
      case "checkcustomer":
        $('.selectCustomer').prop('checked', $('#checkcustomer').is(":checked"));
        break;
      case 'PartiallyCustomerSelection':
        $('#checkcustomer').prop('checked', $('input:checkbox.selectCustomer:checked').length === $('input:checkbox.selectCustomer').length);
        break;
      // For process check
      case 'checkProcess':
        $('.selectProcess').prop('checked', $('#checkProcess').is(":checked"));
        break;
      case 'PartiallyProcessSelection':
        $('#checkProcess').prop('checked', $('input:checkbox.selectProcess:checked').length === $('input:checkbox.selectProcess').length);
        break;
      // For QA check
      case 'checkQaMapp':
        $('.selectQaMapping').prop('checked', $('#checkQaMapp').is(":checked"));
        break;
      case 'PartiallyQAmappingSelection':
        $('#checkQaMapp').prop('checked', $('input:checkbox.selectQaMapping:checked').length === $('input:checkbox.selectQaMapping').length);
        break;
      //supplier check
      case 'checkSupplier':
        $('.selectSupplier').prop('checked', $('#checkSupplier').is(":checked"));
        break;
      case 'PartiallySupplierSelection':
        $('#checkSupplier').prop('checked', $('input:checkbox.selectSupplier:checked').length === $('input:checkbox.selectSupplier').length);
        break;
      //changes by tushar deslect all checkbox
      // case 'clearSupplierSelection':
      //   $('.selectSupplier').prop('checked', false);
      //   break;

      //Service Activities checkboxes.
      case 'checkAllActivity':
        $('.checkActivity').prop('checked', $('#checkAllActivity').is(":checked"));
        break;
      case 'PartiallyActivitySelection':
        $('#checkAllActivity').prop('checked', $('input:checkbox.checkActivity:checked').length === $('input:checkbox.checkActivity').length);
        break;
      default:
        break;
    }
  }

  //supplierRecords
  const FnShowAllActiveRecords = async (accordianSelectKey) => {
    debugger

    try {
      const ProductServiceAllActiveRecords = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnShowAllDefaultMappings/${COMPANY_ID}?accordianSelectKey=${accordianSelectKey}`)
      const ServiceResponce = await ProductServiceAllActiveRecords.json();
      // ProductSrCustomerAllActiveRecords
      console.log("Responce: ", ServiceResponce)

      const excludedFields = [
        '_id', 'field_name', 'is_', '_on', '_by', 'company_', 'supplier_sector',
        'supplier_short_name', 'supplier_type', 'nature_of_business', 'supplier_gl_codes',
        'supplier_history', 'supp_branch_short_name', 'supp_branch_address1', 'supp_branch_address2', 'supp_branch_pincode',
        'district_name', 'country_name', 'supp_branch_region',
        'supp_branch_linkedin_profile', 'supp_branch_facebook_profile', 'supp_branch_twitter_profile',
        'supp_branch_gst_division', 'supp_branch_gst_range', 'supp_branch_pan_no',
        'supp_branch_udyog_adhar_no', 'supp_branch_vat_no', 'supp_branch_service_tax_no', 'supp_branch_excise_no', 'supp_branch_cst_no',
        'supp_branch_bst_no', 'supp_branch_rating', 'supp_branch_gl_codes',
        'sez_name', 'supplier_username', 'supplier_password', 'remark', 'active', 'deleted'
      ];

      const excludedcustFields = [
        '_id', 'field_name', 'is_', '_on', '_by', 'company_', 'customer_type', 'customer_code', 'customer_short_name', 'nature_of_business',
        'customer_gl_codes', 'customer_history', 'cust_branch_short_name', 'cust_branch_address1', 'cust_branch_address2', 'cust_branch_pincode', 'branch_type', 'cust_branch_region',
        'cust_branch_linkedin_profile', 'cust_branch_twitter_profile', 'cust_branch_facebook_profile', 'cust_branch_gst_division', 'cust_branch_gst_range', 'cust_branch_pan_no',
        'cust_branch_udyog_adhar_no', 'cust_branch_vat_no', 'cust_branch_service_tax_no', 'cust_branch_excise_no', 'cust_branch_cst_no', 'cust_branch_bst_no', 'cust_branch_rating',
        'cust_branch_gl_codes', 'customer_username', 'customer_password', 'remark', 'active', 'deleted'
      ];

      if (ServiceResponce.ProductServiceSupplierAllActiveRecords !== undefined) {
        if (ServiceResponce.ProductServiceSupplierAllActiveRecords.length > 0) {
          var suppColumn = [];
          var suppColumnHeads = [];
          suppColumnHeads = Object.keys(ServiceResponce.ProductServiceSupplierAllActiveRecords[0]);
          console.log("column heads: ", suppColumnHeads)
          for (let colKey = 0; colKey < suppColumnHeads.length; colKey++) {
            if (colKey === 0) {
              suppColumn.push({
                Headers: "Action",
                accessor: "Action",
                Cell: row => (
                  <div className="text-center">
                    <input type='checkbox' class="form-check-input selectSupplier" name="selectSupplier" id={'selectSupplier_' + row.original.supplier_id}
                      value={row.original.supplier_id} onClick={() => toggleServiceChkBoxes('PartiallySupplierSelection')} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'delete'}>
                    </input>

                  </div>
                ),
              });
            }
            // if (!suppColumnHeads[colKey].includes('_id') && !suppColumnHeads[colKey].includes('company_name') && !suppColumnHeads[colKey].includes('is_') && !suppColumnHeads[colKey].includes('_on') && !suppColumnHeads[colKey].includes('_by') && !suppColumnHeads[colKey].includes('field_name')) {
            //changes by tushar 
            if (!excludedFields.some(field => suppColumnHeads[colKey].includes(field))) {
              suppColumn.push({ Headers: suppColumnHeads[colKey], accessor: suppColumnHeads[colKey] });
            }
          }
          setSuppColumns(suppColumn)
          setSuppData(ServiceResponce.ProductServiceSupplierAllActiveRecords)
        }
      }
      if (ServiceResponce.ProductServiceQaMappingAllActiveRecords !== undefined) {
        if (ServiceResponce.ProductServiceQaMappingAllActiveRecords.length > 0) {
          let qaMappColumn = [];
          qaMappColumnHeads = Object.keys(ServiceResponce.ProductServiceQaMappingAllActiveRecords[0]);
          console.log("column heads: ", ServiceResponce)
          for (let colKey = 0; colKey < qaMappColumnHeads.length; colKey++) {
            if (colKey == 0) {
              qaMappColumn.push({
                Headers: "Action",
                accessor: "Action",

                Cell: row => (
                  <div className="text-center">
                    <input type='checkbox' class="form-check-input selectQaMapping" name="selectQaMapping" id={'selectQaMapping_' + row.original.product_qa_parameters_id}
                      value={row.original.product_qa_parameters_id} onClick={() => toggleServiceChkBoxes('PartiallyQAmappingSelection')} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'delete'}>
                    </input>
                  </div>
                ),
              });
            }
            if (!qaMappColumnHeads[colKey].includes('_id') && !qaMappColumnHeads[colKey].includes('company_name') && !qaMappColumnHeads[colKey].includes('is_') && !qaMappColumnHeads[colKey].includes('_on') && !qaMappColumnHeads[colKey].includes('_by') && !qaMappColumnHeads[colKey].includes('field_name')) {
              qaMappColumn.push({ Headers: qaMappColumnHeads[colKey], accessor: qaMappColumnHeads[colKey] });
            }
          }
          setQaMappingColumns(qaMappColumn)
          setQaMappingData(ServiceResponce.ProductServiceQaMappingAllActiveRecords)
        }
      }
      if (ServiceResponce.ProductServiceProcessAllActiveRecords !== undefined) {
        if (ServiceResponce.ProductServiceProcessAllActiveRecords.length > 0) {
          let processMappingColumns = [];
          let columnHeads = Object.keys(ServiceResponce.ProductServiceProcessAllActiveRecords[0]);

          for (let colKey = 0; colKey < columnHeads.length; colKey++) {
            if (colKey === 0) {
              processMappingColumns.push({
                Headers: "Action",
                accessor: "Action",
                Cell: row => (
                  <div className="text-center">
                    <input type='checkbox' class="form-check-input selectProcess" name="selectProcess" id={'selectProcess_' + row.original.product_process_id} value={row.original.product_process_id}
                      onClick={() => toggleServiceChkBoxes('PartiallyProcessSelection')} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'delete'} />
                  </div>
                ),
              });
            }
            if (!columnHeads[colKey].includes('_id') && !columnHeads[colKey].includes('company_name') && !columnHeads[colKey].includes('is_') && !columnHeads[colKey].includes('_on') && !columnHeads[colKey].includes('_by') && !columnHeads[colKey].includes('field_name') && !columnHeads[colKey].includes('remark') && !columnHeads[colKey].includes('active') && !columnHeads[colKey].includes('deleted') && !columnHeads[colKey].includes('product_process_std_scrap_percent') && !columnHeads[colKey].includes('product_process_std_production_hrs')) {
              processMappingColumns.push({ Headers: columnHeads[colKey], accessor: columnHeads[colKey] });
            }
          }
          setProcessColumns(processMappingColumns);
          setProcessData(ServiceResponce.ProductServiceProcessAllActiveRecords);
        }
      }

      if (ServiceResponce.ProductSrCustomerAllActiveRecords !== undefined) {
        if (ServiceResponce.ProductSrCustomerAllActiveRecords.length > 0) {
          var custColumn = [];
          let columnHeads;
          columnHeads = Object.keys(ServiceResponce.ProductSrCustomerAllActiveRecords[0]);
          console.log("column heads: ", columnHeads)
          for (let colKey = 0; colKey < columnHeads.length; colKey++) {
            if (colKey == 0) {
              custColumn.push({
                Headers: "Action",
                accessor: "Action",
                Cell: row => (
                  <div className="text-center">
                    <input type='checkbox' class="form-check-input selectCustomer" name="selectCustomer" id={'selectCustomer_' + row.original.customer_id}
                      value={row.original.customer_id} onClick={() => toggleServiceChkBoxes('PartiallyCustomerSelection')} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'delete'}>
                    </input>
                  </div>
                ),
              });
            }
            // if (!columnHeads[colKey].includes('_id') && !columnHeads[colKey].includes('company_name') && !columnHeads[colKey].includes('is_') && !columnHeads[colKey].includes('_on') && !columnHeads[colKey].includes('_by') && !columnHeads[colKey].includes('field_name')) {
            if (!excludedcustFields.some(field => columnHeads[colKey].includes(field))) {
              custColumn.push({ Headers: columnHeads[colKey], accessor: columnHeads[colKey] });
            }
          }
          setCustColumns(custColumn)
          setCustData(ServiceResponce.ProductSrCustomerAllActiveRecords)
        }
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const FnShowAllActivitiesRecords = async () => {
    try {
      debugger;
      const getActivities = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductServiceActivityMaster/FnShowAllActiveRecords/${COMPANY_ID}`)
      const apiResp = await getActivities.json();

      if (apiResp.data.length !== 0) {
        const existingActivitiesData = [...activitiesTblDataResp];
        let latestActivitiesData = apiResp.data;

        for (let existActivityCounter = 0; existActivityCounter < existingActivitiesData.length; existActivityCounter++) {
          const existingActivityId = existingActivitiesData[existActivityCounter].product_service_activity_master_id;
          const latestActivity = latestActivitiesData.map((pmtTerm, index) => ({
            index, item: pmtTerm,
          })).find(data => data.item.product_service_activity_master_id === existingActivityId);
          if (latestActivity) {
            const existingIndex = latestActivity.index;
            // Move the found object to the first index
            const movedItem = latestActivitiesData.splice(existingIndex, 1)[0];
            latestActivitiesData.unshift(movedItem);
          }
        }
        setActivitiesTblData(latestActivitiesData);
        setTimeout(() => {
          activitiesTblDataResp.forEach(function (existingActivity) {
            $('#checkActivity_' + existingActivity.product_service_activity_master_id).prop('checked', true);
          });
        }, 200);
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  const onFileUpload = (e) => {
    if (e.target.files) {
      let file = e.target.files[0];
      setSrQrCode(file);
    }
  }

  const uploadQRCodeFile = async (product_sr_id, product_sr_name) => {
    try {
      const formData = new FormData();
      formData.append(`file`, file_product_sr_qr_code)
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnStoreQRFile/${product_sr_id}/${product_sr_name}`, requestOptions)
      const fetchRes = await apicall.json();
      console.log("fetchRes: ", fetchRes)
      return fetchRes;
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }

  const fetchQrCode = async () => {
    try {
      const downloadImageApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnGetQRCode/${product_sr_id}`)
      const blob = await downloadImageApiCall.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qrcode.png`,);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }


  const validateFields = () => {
    validate.current.validateFieldsOnChange('servicesFormId')
  }

  const validateNo = (key) => {
    const numCheck = /^[0-9]*\.?[0-9]*$/;
    switch (key) {
      case 'StdPrice':
        let stdPriceVal = $('#txt_product_sr_std_price').val();
        if (numCheck.test(stdPriceVal)) {
          setProductSrStdPrice(stdPriceVal)
        }
        break;

      case 'StdHours':
        let stdHoursVal = $('#txt_product_sr_std_hours').val();
        if (numCheck.test(stdHoursVal)) {
          setProductSrStdHours(stdHoursVal)
        }
        break;
    }
  }


  const FnValidateService = async () => {
    let ServiceIsValid = true;
    const checkboxesCustomer = $('.selectCustomer:checked');
    if (checkboxesCustomer.length === 0) {
      setErrMsg('Please select at least one customer.');
      setShowErrorMsgModal(true);
      ServiceIsValid = false;
      //   return false;
      return false;
    }
    else {
      ServiceIsValid = true;
    }

    const checkboxesProcess = $('.selectProcess:checked');
    if (checkboxesProcess.length === 0) {
      setErrMsg('Please select at least one Process.');
      setShowErrorMsgModal(true);
      ServiceIsValid = false;
      return false;
    }
    else {
      ServiceIsValid = true;
    }

    const checkboxesQaMapping = $('.selectQaMapping:checked');
    if (checkboxesQaMapping.length === 0) {
      setErrMsg('Please select at least one QaMapping.');
      setShowErrorMsgModal(true);
      ServiceIsValid = false;
      return false;
    }
    else {
      ServiceIsValid = true;
    }

    const checkboxesSupplier = $('.selectSupplier:checked');
    if (checkboxesSupplier.length === 0) {
      setErrMsg('Please select at least one Supplier.');
      setShowErrorMsgModal(true);
      ServiceIsValid = false;
      return false;
    }
    else {
      ServiceIsValid = true;
    }
    return ServiceIsValid;
  };


  const addService = async (functionType) => {
    debugger
    try {
      let ServiceIsValid;
      setIsLoading(true);
      const checkIsValidate = await validate.current.validateForm("servicesFormId");
      if (checkIsValidate) {
        ServiceIsValid = await FnValidateService();
      }
      if (ServiceIsValid) {
        let json = {
          'ServiceMasterData': {}, 'TransCustomerData': [], 'SrProcessData': [], 'QaMappingData': [], 'SrActivitiesData': [],// productSrId === undefined
          'SrSupplierData': [], 'commonIds': { company_id: COMPANY_ID, company_branch_id: COMPANY_BRANCH_ID, product_sr_id: product_sr_id, product_id: productSrId !== 0 ? product_id : 0 }
          , 'saveKey': functionType
        }

        const formData = new FormData();
        if (functionType === 'generalEntry' || functionType === 'allServiceData') {
          // ServiceMasterData
          const quotationMasterFormData = {
            product_id: product_id,
            company_id: COMPANY_ID,
            company_branch_id: COMPANY_BRANCH_ID,
            product_sr_id: product_sr_id,
            product_type_id: cmb_product_type_id,
            modified_by: product_id === 0 ? null : UserName,
            product_category1_id: cmb_product_category1_id,
            product_category2_id: cmb_product_category2_id,
            product_category3_id: cmb_product_category3_id,
            product_category4_id: cmb_product_category4_id,
            product_category5_id: cmb_product_category5_id,
            // material_id: txt_material_id,
            product_sr_code: txt_product_sr_code,
            product_sr_name: txt_product_sr_name,
            product_sr_short_name: txt_product_sr_short_name,
            product_sr_print_name: txt_product_sr_print_name,
            product_sr_tech_spect: txt_product_sr_tech_spect,
            product_sr_hsn_sac_code_id: cmb_product_sr_hsn_sac_code_id,
            product_sr_std_price: txt_product_sr_std_price,
            product_sr_std_hours: txt_product_sr_std_hours,
            product_sr_std_profit_percent: txt_product_sr_std_profit_percent,
            product_sr_std_discount_percent: txt_product_sr_std_discount_percent,
            product_sr_sales_unit_id: cmb_product_sr_sales_unit_id,
            product_sr_bar_code: txt_product_sr_bar_code === "" ? product_sr_id : txt_product_sr_bar_code,
            // product_sr_qr_code: file_product_sr_qr_code,
            remark: txt_remark,
            is_active: chk_isactive,
            created_by: UserName,
            process_duration: cmb_process_duration,

          }

          json.ServiceMasterData = quotationMasterFormData;
          formData.append(`qrCodeFile`, file_sr_qr_code)
        }

        if (functionType === 'customerMapping' || functionType === 'allServiceData') {
          //TransCustomerData
          $("input:checkbox[name=selectCustomer]:checked").each(function () {
            let custData = {
              company_id: COMPANY_ID,
              modified_by: product_sr_id === null ? null : UserName,
              company_branch_id: COMPANY_BRANCH_ID,
              product_sr_id: product_sr_id,
              customer_id: $(this).val(),
              created_by: UserName,
            }
            json.TransCustomerData.push(custData);
          });
        }
        // SrProcessData
        if (functionType === 'processMapping' || functionType === 'allServiceData') {
          $("input:checkbox[name=selectProcess]:checked").each(function () {
            let processData = {
              company_id: COMPANY_ID,
              company_branch_id: COMPANY_BRANCH_ID,
              product_sr_id: product_sr_id,
              product_process_id: $(this).val(),
              created_by: UserName,
              modified_by: product_sr_id === null ? null : UserName,
            }
            json.SrProcessData.push(processData);
          });
        }
        //changes by ujjwala on 9/1/2024 case no. 1
        // QaMappingData
        if (functionType === 'qaMapping' || functionType === 'allServiceData') {
          $("input:checkbox[name=selectQaMapping]:checked").each(function () {
            let qaMappingObj = QaMappingdata.find((item) => item.product_qa_parameters_id === parseInt(this.value))
            let qaMappingData = {
              modified_by: product_sr_id === null ? null : UserName,
              company_id: COMPANY_ID,
              company_branch_id: COMPANY_BRANCH_ID,
              product_sr_id: product_sr_id,
              product_qa_parameters_id: $(this).val(),
              product_sr_qa_from_range: qaMappingObj.from_range,
              product_sr_qa_to_range: qaMappingObj.to_range,
              product_sr_qa_from_deviation_percent: qaMappingObj.from_deviation_percent,
              product_sr_qa_to_deviation_percent: qaMappingObj.to_deviation_percent,
              created_by: UserName,
            }
            json.QaMappingData.push(qaMappingData);
          });
        }
        //end
        //SrSupplierData
        if (functionType === 'supplierMapping' || functionType === 'allServiceData') {
          $("input:checkbox[name=selectSupplier]:checked").each(function () {
            let suppData = {
              modified_by: product_sr_id === null ? null : UserName,
              company_id: COMPANY_ID,
              company_branch_id: COMPANY_BRANCH_ID,
              product_sr_id: product_sr_id,
              created_by: UserName,
              supplier_id: $(this).val(),
            }
            json.SrSupplierData.push(suppData);
          });

        }

        $("input:checkbox[name=checkActivity]:checked").each(function () {
          let acitivityObj = activitiesTblData.find((activity) => activity.product_service_activity_master_id === parseInt(this.value))
          let activityData = {
            product_sr_activity_id: 0,
            company_id: COMPANY_ID,
            company_branch_id: COMPANY_BRANCH_ID,
            product_sr_id: product_sr_id,
            product_service_activity_master_id: $(this).val(),
            product_sr_activity_name: acitivityObj.activity_name,
            product_sr_activity_description: acitivityObj.activity_description,
            product_sr_activity_std_hour: acitivityObj.std_hour,
            is_active: chk_isactive,
            modified_by: product_sr_id === null ? null : UserName,
            created_by: UserName,
          }
          json.SrActivitiesData.push(activityData);
        });
        if(activitiesTblData.length === 0 && json.SrActivitiesData.length){
          json.SrActivitiesData = activitiesTblDataResp;
        }

        formData.append(`SmProductSrData`, JSON.stringify(json))
        const requestOptions = {
          method: 'POST',
          body: formData
        };

        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnAddUpdateRecord`, requestOptions)
        const response = await apicall.json();

        if (response.error !== "") {
          setErrMsg(response.error)
          setShowErrorMsgModal(true)
        } else {
          const { product_sr_id, product_sr_name, product_sr_qr_code } = response.data;
          setProductSrId(product_sr_id)
          setProductSrName(product_sr_name)
          setProductSrQrCode(product_sr_qr_code)
          setproduct_id(response.data.product_id)
          const evitCache = comboDataAPiCall.current.evitCache();
          console.log(evitCache);
          setSuccMsg(response.message)
          setShowSuccessMsgModal(true);
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
      console.log("error: ", error)
      navigate('/Error')
    }
  }

  // -----------------------------------------------------------------------------------------
  const FnGenerateMaterialId = async (productTpVal, ptShortName) => {
    const autoNoApiCall = await generateMaterialIdAPiCall.current.GenerateCode("sm_product_sr", "product_sr_id", 'product_type_id', productTpVal, ptShortName, "4");
    setProductSrId(autoNoApiCall);
    return autoNoApiCall;
  }

  // -------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------

  //changes by tushar
  const handleAccordionSelect = async (eventKey) => {
    debugger
    let checkedLength = 0;

    switch (eventKey) {
      case 'ProcessMapping':
        checkedLength = $("input:checkbox[name=selectProcess]:checked").length;
        if (checkedLength === 0) {
          await FnShowAllActiveRecords("ProcessMapping");
        }
        if (productSrId !== 0) {
          $("input:checkbox[name=selectProcess]").each(function () {
            const checkboxValue = parseInt($(this).val());
            const orderNoIndex = processMappingData.findIndex((item) => item.product_process_id === checkboxValue)
            if (orderNoIndex !== -1) {
              $(this).prop('checked', true);
            }
          });
        }
        console.log("ProcessMapping");
        break;

      case 'customerMapping':
        checkedLength = $("input:checkbox[name=selectCustomer]:checked").length;
        if (checkedLength === 0) {
          await FnShowAllActiveRecords("customerMapping");
        } if (productSrId !== 0) {
          $("input:checkbox[name=selectCustomer]").each(function () {
            const checkboxValue = parseInt($(this).val());
            const orderNoIndex = CustomerMappingData.findIndex((item) => item.customer_id === checkboxValue)
            if (orderNoIndex !== -1) {
              $(this).prop('checked', true);
            }
          });
        }
        console.log("customerMapping");
        break;

      case 'SupplierMapping':
        checkedLength = $("input:checkbox[name=selectSupplier]:checked").length;
        if (checkedLength === 0) {
          await FnShowAllActiveRecords("SupplierMapping");

        } if (productSrId !== 0) {
          $("input:checkbox[name=selectSupplier]").each(function () {
            const checkboxValue = parseInt($(this).val());
            const orderNoIndex = supplierMappingData.findIndex((item) => item.supplier_id === checkboxValue)
            if (orderNoIndex !== -1) {
              $(this).prop('checked', true);
            }
          });
        }
        console.log("SupplierMapping");
        break;

      case 'QaMapping':

        checkedLength = $("input:checkbox[name=selectQaMapping]:checked").length;
        if (checkedLength === 0) {
          await FnShowAllActiveRecords("QaMapping");
        }
        // QaMappingdata
        if (productSrId !== 0) {
          $("input:checkbox[name=selectQaMapping]").each(function () {
            const checkboxValue = parseInt($(this).val());
            const orderNoIndex = qaMappingData.findIndex((item) => item.product_qa_parameters_id === checkboxValue)
            if (orderNoIndex !== -1) {
              $(this).prop('checked', true);
            }
          });
        }
        console.log("QaMapping");
        break;

      case 'activitiesMapping':
        checkedLength = $("input:checkbox[name=checkActivity]:checked").length;
        if (checkedLength === 0) {
          await FnShowAllActivitiesRecords("activitiesMapping");
        }
        break;

      default:
        console.log('Invalid accordion key');
        break;
    }
    if (keyForViewUpdate === "view") {
      $('input[type="checkbox"]').prop('disabled', true);
    }
  };
  // --------------------------------delete -------------------------------------------------------------------------------------------
  // Popup Fields
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  async function DeleteRecord() {
    try {
      const method = { method: 'Delete' }

      const deleteApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/SmProductSr/FnDeleteRecord/${product_sr_id}/${COMPANY_ID}/${UserName}`, method)
      const responce = await deleteApiCall.json();
      console.log("Raw material Deleted: ", responce);
      if (responce.success == '1') {
        setShow(false)
        moveToListing();
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }
  // ----------------------------------------------------------------------------------------------------------------------------
  // navigate to back listing page 
  const moveToListing = () => {
    const Path = compType === 'Register' ? '/Masters/FrmMServiceListing/reg' : '/Masters/FrmMServiceListing';
    navigate(Path);
  }

  const deleteshow = () => {
    setShow(true)
  }


  return (
    <>
      <FrmValidations ref={validate} />
      <ComboBox ref={comboDataAPiCall} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <GenerateMaterialId ref={generateMaterialIdAPiCall} />

      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress color="primary" />
            <span>Loading...</span>
          </div>
        </div> :
        ''}

      <div className="erp_top_Form">
        <div className='card p-1'>
          <div className='card-header text-center py-0 mb-2'>
            <label className='erp-form-label-lg text-center'>Service {actionType} </label>
          </div>
          <form id="servicesFormId">
            <div className="row">
              <div className='row'>
                {/* first */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Product Type : <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_type_id" className="form-select form-select-sm" value={cmb_product_type_id} onChange={() => comboOnChange('productType')}>
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productTypeOptions?.map(productType => (
                          <option value={productType.field_id} ptShortName={productType.product_type_short_name}>{productType.field_name}</option>
                        ))}

                      </select>
                      <MDTypography variant="button" id="error_cmb_product_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Billing Cycle : <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_process_duration" className="form-select form-select-sm" onChange={(e) => { validateFields(); setProcessDuration(e.target.value); }}>
                        <option value="One Time">One Time</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="ForthNightly">ForthNightly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="2 Monthly">2 Monthly</option>
                        <option value="3 Monthly">3 Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half Yearly">Half Yearly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                      <MDTypography variant="button" id="error_cmb_process_duration" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>


                  {/* <div className='row' id="product_category2_id" style={{ display: "none" }}>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label" id="cat1Label"></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category2_id" className="form-select form-select-sm" value={cmb_product_category2_id} onChange={() => comboOnChange('productCategory2')} optional='optional'>
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {category2Options?.map((category2) => (
                          <option value={category2.field_id}>{category2.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category2_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}




                  <div className='row' >
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Cust SR Category 1 :<span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category1_id" className="form-select form-select-sm" value={cmb_product_category1_id} onChange={() => comboOnChange('productCategory1')} >
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productCategory1Options?.map(productCategory1 => (
                          <option value={productCategory1.field_id}>{productCategory1.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category1_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>


                  <div className='row' id="product_category2_id" style={{ display: "none" }}>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label" id="cat1Label" ></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category2_id" className="form-select form-select-sm" value={cmb_product_category2_id} onChange={() => comboOnChange('productCategory2')} optional="optional">
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productCategory2Options?.map(productCategory2 => (
                          <option value={productCategory2.field_id}>{productCategory2.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category2_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row' id="product_category3_id" style={{ display: "none" }}>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label" id="cat2Label" ></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category3_id" className="form-select form-select-sm" value={cmb_product_category3_id} onChange={() => comboOnChange('productCategory3')} optional="optional">
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productCategory3Options?.map(productCategory3 => (
                          <option value={productCategory3.field_id}>{productCategory3.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category3_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row' id="product_category4_id" style={{ display: "none" }}>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label" id="cat3Label" > </Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category4_id" className="form-select form-select-sm" value={cmb_product_category4_id} onChange={() => comboOnChange('productCategory4')} optional="optional">
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productCategory4Options?.map(productCategory4 => (
                          <option value={productCategory4.field_id}>{productCategory4.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category4_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row' id="product_category5_id" style={{ display: "none" }}>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label" id="cat4Label"> </Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_category5_id" className="form-select form-select-sm" value={cmb_product_category1_id} onChange={() => comboOnChange('productCategory5')} optional="optional">
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {productCategory5Options?.map(productCategory5 => (
                          <option value={productCategory5.field_id}>{productCategory5.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_category5_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Material ID  : <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="product_sr_id" className="erp_input_field" value={product_sr_id} onChange={e => { setMaterialId(e.target.value); validateFields() }} maxLength="255" disabled="disabled" />
                      <MDTypography variant="button" id="error_txt_material_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Service Code : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_code" className="erp_input_field" value={txt_product_sr_code} onChange={e => { setProductSrCode(e.target.value); validateFields() }} maxLength="255" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                </div>
                {/* second */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Service Name : <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_name" className="erp_input_field" value={txt_product_sr_name} onChange={e => { setProductSrName(e.target.value); validateFields() }} maxLength="500" />
                      <MDTypography variant="button" id="error_txt_product_sr_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Short Name : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_short_name" className="erp_input_field" value={txt_product_sr_short_name} onChange={e => { setProductSrShortName(e.target.value.toUpperCase()); validateFields() }} maxLength="20" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Print Name : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_print_name" className="erp_input_field" value={txt_product_sr_print_name} onChange={e => { setProductSrPrintName(e.target.value); validateFields() }} maxLength="500" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_print_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Tech. Spect. : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control as="textarea" rows={1} id="txt_product_sr_tech_spect" className="erp_txt_area" value={txt_product_sr_tech_spect} onChange={e => { setProductSrTechSpect(e.target.value); validateFields() }} maxlength="1000" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_tech_spect" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">HSN SAC Code : <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_sr_hsn_sac_code_id" className="form-select form-select-sm" value={cmb_product_sr_hsn_sac_code_id} onChange={() => comboOnChange('hsnSacCode')}>
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {hsnSacCodeOptions?.map(HsnSacCode => (
                          <option value={HsnSacCode.field_id}>{HsnSacCode.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_sr_hsn_sac_code_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Standard Price : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_std_price" className="erp_input_field  erp_align-right" value={txt_product_sr_std_price} onChange={e => validateNo('StdPrice')} maxLength="19" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_std_price" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Standard Hours : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_std_hours" className="erp_input_field  erp_align-right" value={txt_product_sr_std_hours} onChange={e => validateNo('StdHours')} maxLength="19" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_std_hours" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                </div>
                {/* Third */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Standard Profit % : </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="number" id='txt_product_sr_std_profit_percent' className="erp_input_field erp_align-right" value={txt_product_sr_std_profit_percent}
                        onChange={(e) => {
                          if (validateNumberDateInput.current.percentValidate(e.target.value)) {
                            setProductSrStdProfitPercent(e.target.value)
                          }; validateFields();
                        }} optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_std_profit_percent" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Standard Discount % : </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control type="number" id='txt_product_sr_std_discount_percent' className="erp_input_field erp_align-right" value={txt_product_sr_std_discount_percent}
                        onChange={(e) => {
                          if (validateNumberDateInput.current.percentValidate(e.target.value)) {
                            setProductSrStdDiscountPercent(e.target.value)
                          }; validateFields();
                        }} optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_std_discount_percent" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Service Sales Unit : </Form.Label>
                    </div>
                    <div className='col'>
                      <select id="cmb_product_sr_sales_unit_id" className="form-select form-select-sm" value={cmb_product_sr_sales_unit_id} onChange={() => comboOnChange('SrsalesUnit')} optional="optional">
                        <option value="">Select</option>
                        <option value="0">Add New Record+</option>
                        {srSaleUnitOptions?.map(salesUnit => (
                          <option value={salesUnit.field_id}>{salesUnit.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_product_sr_sales_unit_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bar Code : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_product_sr_bar_code" className="erp_input_field" value={txt_product_sr_bar_code} onChange={e => { setProductSrBarCode(e.target.value); validateFields() }} maxLength="500" optional="optional" />
                      <MDTypography variant="button" id="error_txt_product_sr_bar_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">QR Code : </Form.Label>
                    </div>
                    <div className="col-sm-8">
                      <Form.Control type="file" id="file_product_sr_qr_code" className="erp_input_field" onChange={onFileUpload} optional="optional" accept="image/*" />
                      <MDTypography component="label" className={`erp-form-label ${file_product_sr_qr_code !== '' ? 'display' : 'd-none'}`} variant="button" id="file_product_sr_qr_code" fontWeight="regular" color="info"  >
                        <a href="#" onClick={fetchQrCode}>{file_product_sr_qr_code}</a>
                      </MDTypography>
                      <MDTypography variant="button" id="error_file_product_sr_qr_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Remark : </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_remark" className="erp_input_field" value={txt_remark} onChange={e => { setRemark(e.target.value); validateFields() }} maxLength="255" optional="optional" />
                      <MDTypography variant="button" id="error_txt_remark" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label"> Is Active : </Form.Label>
                    </div>
                    <div className="col">
                      <div className="erp_form_radio">
                        <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive} onClick={() => { setIsActive(true); }} /> </div>
                        <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={!chk_isactive} onClick={() => { setIsActive(false); }} /> </div>
                      </div>
                      {/* <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive === "true"} onClick={() => { setIsActive("true"); }} /> </div>
                      <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={chk_isactive === "false"} onClick={() => { setIsActive("false"); }} /> </div>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>


          <hr />
          {/* <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="1">      */}
          <Accordion defaultActiveKey="0" onSelect={handleAccordionSelect}>
            <Accordion.Item eventKey="ProcessMapping">
              <Accordion.Header className="erp-form-label-md">Process Mapping</Accordion.Header>
              <Accordion.Body>
                <div class="col pt-sm-1">
                  <input type='checkbox' name="checkProcess" id="checkProcess"
                    onClick={(e) => toggleServiceChkBoxes('checkProcess')}
                  /> <label class="erp-form-label pb-1"> Select All Process</label>
                </div>
                <div className='row erp_table_scroll'>
                  <Datatable id="process_data_id" data={processdata} columns={processcolumns} />
                </div>
                {/* <div className="text-center">
                  <MDButton type="button" className={`erp-gb-button ${product_sr_id !== 0 && keyForViewUpdate !== 'view' ? 'display' : 'd-none'}`} variant="button"
                    fontWeight="regular" onClick={() => addService('processMapping')} >Update</MDButton>
                </div> */}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />

          {/* <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="1"> */}
          <Accordion defaultActiveKey="0" onSelect={handleAccordionSelect}>
            <Accordion.Item eventKey="customerMapping">
              <Accordion.Header className="erp-form-label-md">Customer Mapping</Accordion.Header>
              <Accordion.Body>
                <div class="col pt-sm-1">
                  <input type='checkbox' name="checkcustomer" id="checkcustomer"
                    onClick={(e) => toggleServiceChkBoxes('checkcustomer')}
                  /> <label class="erp-form-label pb-1"> Select All Customer</label>
                </div>
                <div className='row erp_table_scroll'>
                  <Datatable id="Cust_data_id" data={custdata} columns={custcolumns} />
                </div>
                {/* <div className="text-center">
                  <MDButton type="button" className={`erp-gb-button ${product_sr_id !== 0 && keyForViewUpdate !== 'view' ? 'display' : 'd-none'}`} variant="button"
                    fontWeight="regular" onClick={() => addService('customerMapping')} >Update</MDButton>
                </div> */}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />
          {/* <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="1"> */}
          <Accordion defaultActiveKey="0" onSelect={handleAccordionSelect}>
            <Accordion.Item eventKey="SupplierMapping">
              <Accordion.Header className="erp-form-label-md">Supplier Mapping</Accordion.Header>
              <Accordion.Body>
                <div class="col pt-sm-1">
                  <input type='checkbox' name="checkSupplier" id="checkSupplier" onClick={(e) => toggleServiceChkBoxes('checkSupplier')} /> <label class="erp-form-label pb-1"> Select All Supplier</label>
                  {/* <input type='checkbox' name="clearSupplierSelection" id="clearSupplierSelection" onClick={() => toggleServiceChkBoxes('clearSupplierSelection')} /> <label class="erp-form-label pb-1"> Clear All Supplier</label> */}
                </div>
                <div className='row erp_table_scroll'>
                  <Datatable id="Supp_id" data={Suppdata} columns={Suppcolumns} />
                </div>
                {/* <div className="text-center">
                  <MDButton type="button" className={`erp-gb-button ${product_sr_id !== 0 && keyForViewUpdate !== 'view' ? 'display' : 'd-none'}`} variant="button"
                    fontWeight="regular" onClick={() => addService('supplierMapping')} >Update</MDButton>
                </div> */}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <hr />


          {/* <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="1"> */}
          <Accordion defaultActiveKey="0" onSelect={handleAccordionSelect}>
            <Accordion.Item eventKey="QaMapping">

              <Accordion.Header className="erp-form-label-md">QA Mapping</Accordion.Header>
              <Accordion.Body>
                <div class="col pt-sm-1">
                  <input type='checkbox' name="checkQaMapp" id="checkQaMapp"
                    onClick={(e) => toggleServiceChkBoxes('checkQaMapp')}
                  /> <label class="erp-form-label pb-1"> Select All QA Mapping</label>
                </div>
                <div className='row erp_table_scroll'>
                  <Datatable id="QaMapping_id" data={QaMappingdata} columns={QaMappingcolumns} />
                </div>
                {/* <div className="text-center">
                  <MDButton type="button" className={`erp-gb-button ${product_sr_id !== 0 && keyForViewUpdate !== 'view' ? 'display' : 'd-none'}`} variant="button"
                    fontWeight="regular" onClick={() => addService('qaMapping')} >Update</MDButton>
                </div> */}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />
          <Accordion defaultActiveKey="0" onSelect={handleAccordionSelect}>
            <Accordion.Item eventKey="activitiesMapping">
              <Accordion.Header className="erp-form-label-md">Activities Mapping</Accordion.Header>
              <Accordion.Body className="p-1 pt-0">
                <div className={`row py-1 ${keyForViewUpdate === 'view' || keyForViewUpdate === 'approve' ? 'd-none' : 'display'}`}>
                  <div className="col-12 col-sm-6">
                    <input type='checkbox' id="checkAllActivity" onClick={(e) => toggleServiceChkBoxes('checkAllActivity')} /> <label class="erp-form-label pb-1"> Select All. </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <MDButton type="button" className={`erp-gb-button float-sm-end col-1`} variant="button" fontWeight="regular"
                      onClick={() => {
                        sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                        setHeaderName('Activity');
                        setShowAddRecModal(true); setTimeout(() => { $(".erp_top_Form").css({ "padding-top": "0px" }); }, 200)
                      }}>Add
                    </MDButton>
                  </div>
                </div>

                <div className={`table-responsive ${activitiesTblData.length > 0 ? 'erp_table_scroll' : ''}`}>
                  {
                    activitiesTblData.length > 0
                      ? <>
                        <Table className="erp_table " id='activitiesTbl' bordered striped>
                          <thead className="erp_table_head">
                            <tr>
                              <th className='erp_table_th'>Action</th>
                              <th className='erp_table_th'>Activity Name</th>
                              <th className='erp_table_th'>Activity Description</th>
                              <th className='erp_table_th'>Std. Hrs.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              activitiesTblData.map((activity, index) =>
                                <tr rowindex={index}>
                                  <td className='erp_table_td'>
                                    <input type='checkbox' className="form-check-input checkActivity" name="checkActivity"
                                      id={'checkActivity_' + activity.product_service_activity_master_id} value={activity.product_service_activity_master_id}
                                      onClick={() => toggleServiceChkBoxes('PartiallyActivitySelection')} />
                                  </td>
                                  <td className="erp_table_td">{activity.activity_name}</td>
                                  <td className="erp_table_td">{activity.activity_description}</td>
                                  <td className="erp_table_td text-end">{activity.std_hour}</td>
                                </tr>
                              )
                            }
                          </tbody>
                        </Table>
                      </>
                      : null
                  }
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />
          {/*   //changes by ujjwala on 9/1/2024 case no .1 */}
          <div className="text-center mb-4">
            <MDButton type="button" className="erp-gb-button"
              onClick={() => {
                const path = compType === 'Register' ? '/Masters/FrmMServiceListing/reg' : '/Masters/FrmMServiceListing';
                navigate(path);
              }}

              variant="button"
              fontWeight="regular" >Back</MDButton>
            <MDButton type="button" onClick={() => addService('allServiceData')} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' || keyForViewUpdate === 'delete' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

            <MDButton type="button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'delete' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" onClick={() => deleteshow()}>Delete</MDButton>

            <Tooltip title={(product_id !== 0) ? "Upload disabled" : "Upload file"} placement="right">
              <MDButton type="button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" onClick={() => viewDocumentForm()}
                fontWeight="regular" disabled={product_id === 0}>Upload Document</MDButton>
            </Tooltip>
            {/* <MDButton type="button" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" onClick={() => viewDocumentForm()}
              fontWeight="regular" disabled={product_sr_id === 0}> Upload Document</MDButton> */}
          </div>
        </div>

        <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
        <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

        {/* Document modal */}
        {showDocumentForm ?
          <Modal size="lg" className='erp_document_Form' show={showDocumentForm} onHide={handleCloseDocumentForm} backdrop="static" keyboard={false} centered>
            <Modal.Header>
              <Modal.Title className='erp_modal_title'>Document Form</Modal.Title>
              <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseDocumentForm}></button></span>
            </Modal.Header>
            <Modal.Body>
              <DocumentF group_id={product_sr_id} document_group={docGroup} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" className="btn erp-gb-button" onClick={handleCloseDocumentForm}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal> : null
        }



        {/* //changes by ujjwala on 9/1/2024 case no. 1 */}
        {showAddRecModal ?
          <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
            <Modal.Body className='erp_city_modal_body'>
              <div className='row'>
                <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
              </div>
              {/* {displayRecordComponent()} */}
            </Modal.Body>
          </Modal > : null
        }

        {/* Delete Modal */}
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
          <span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={handleClose}></button></span>
          <Modal.Body className='erp_modal_body'>
            <span className='erp_modal_delete_icon'><RxCrossCircled /></span>
            <h6>Are you sure?</h6>
            <div className="erp-form-label">Do you wish to delete this record ?</div>
          </Modal.Body>
          <Modal.Footer className='justify-content-center'>
            <Button variant="success" className='erp-gb-button' onClick={handleClose}>
              Cancel
            </Button>&nbsp;
            <Button variant="danger" className='erp-gb-button' onClick={DeleteRecord}>Delete</Button>
          </Modal.Footer>
        </Modal>



      </div >
    </>
  );
}

export default FrmMServiceEntry
