import React, { useState, useEffect, useRef } from "react";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from "assets/Constants/config-constant";
import { Table } from "react-bootstrap";


function ProductList({ closeModal, props, stockType }) {
  const { selectedProduct } = props


  const configConstants = ConfigConstants();
  const { COMPANY_ID } = configConstants;

  // Filter Master Combo
  const [masterList, setMaterList] = useState([]);
  const [masterDataList, seMasterDataList] = useState([]);
  const [chk_product, setProduct] = useState('smv_product_rm_summary')

  // use refs
  const comboBox = useRef();

  // Table Data
  const [data, setFilteredData] = useState([]);
  const localStorageKeyArr = []
  const checkedData = [];


  useEffect(() => {
    const functionCall = async () => {
      
      await FnFillCombos();
      await clearFilters(chk_product)
    }
    functionCall()
  }, [stockType])


  const FnFillCombos = async () => {
    // Check disable product if props available
    var radioButtons = document.querySelectorAll('input[type="radio"][name="chk_product"]');

    radioButtons.forEach(function (radioButton) {
      if (!selectedProduct.includes(radioButton.value)) {
        radioButton.disabled = true;
      }
    });

    if (selectedProduct.length === 1) {
      setProduct(selectedProduct[0])
    }



    // Category display
    // const catCount = sessionStorage.getItem('compRMCatCount')
    // const cmbMasterElements = document.getElementById('cmb_master_name');
    // var counter = 1;

    // for (let cmbMasterEleInd = 0; cmbMasterEleInd < cmbMasterElements.length; cmbMasterEleInd++) {
    //   if (cmbMasterElements[cmbMasterEleInd].value === 'smv_product_category' + counter + '') {
    //     if (counter > parseInt(catCount)) {
    //       cmbMasterElements[cmbMasterEleInd].style.display = 'none'
    //       counter++;
    //     } else {
    //       counter++;
    //       cmbMasterElements[cmbMasterEleInd].style.display = 'block'
    //     }
    //   }
    // }


  }

  const FnMasterOnChange = async () => {
    let IsProductTypePresent = localStorage.getItem('smv_product_type');
    let IsCategory1Present = localStorage.getItem('smv_product_category1');
    let IsCategory2Present = localStorage.getItem('smv_product_category2');
    let IsCategory3Present = localStorage.getItem('smv_product_category3');
    let IsCategory4Present = localStorage.getItem('smv_product_category4');
    let IsCategory5Present = localStorage.getItem('smv_product_category5');
    let IsMaterialMakePresent = localStorage.getItem('smv_product_make');
    let IsMaterialTypePresent = localStorage.getItem('smv_product_material_type');
    let IsMaterialGradePresent = localStorage.getItem('smv_product_material_grade');
    let IsMaterialShapePresent = localStorage.getItem('smv_product_material_shape');

    let masterValue = $('#cmb_master_name').val();

    switch (masterValue) {
      case 'smv_product_type':
        const filterList = await createWhereJson(masterValue, "productTpDependent")
        checkedSelectedFilterFields(IsProductTypePresent, filterList)
        break;
      case 'smv_product_category1':
        const filterCat1List = await createWhereJson(masterValue, 1)
        checkedSelectedFilterFields(IsCategory1Present, filterCat1List)
        break;
      case 'smv_product_category2':
        const filterCat2List = await createWhereJson(masterValue, 2)
        checkedSelectedFilterFields(IsCategory2Present, filterCat2List)
        break;
      case 'smv_product_category3':
        const filterCat3List = await createWhereJson(masterValue, 3)
        checkedSelectedFilterFields(IsCategory3Present, filterCat3List)
        break;
      case 'smv_product_category4':
        const filterCat4List = await createWhereJson(masterValue, 4)
        checkedSelectedFilterFields(IsCategory4Present, filterCat4List)
        break;
      case 'smv_product_category5':
        const filterCat5List = await createWhereJson(masterValue, 5)
        checkedSelectedFilterFields(IsCategory5Present, filterCat5List)
        break;
      case 'smv_product_make':
        const filterProductMakeList = await createWhereJson(masterValue, "productTpDependent")
        checkedSelectedFilterFields(IsMaterialMakePresent, filterProductMakeList)
        break;
      case 'smv_product_material_type':
        const filtermaterialTypeList = await createWhereJson(masterValue, "productTpDependent")
        checkedSelectedFilterFields(IsMaterialTypePresent, filtermaterialTypeList)
        break;
      case 'smv_product_material_grade':
        const filtermaterialGradeList = await createWhereJson(masterValue, "productTpDependent")
        checkedSelectedFilterFields(IsMaterialGradePresent, filtermaterialGradeList)
        break;
      case 'smv_product_material_shape':
        const filtermaterialShapeList = await createWhereJson(masterValue, "productTpDependent")
        checkedSelectedFilterFields(IsMaterialShapePresent, filtermaterialShapeList)
        break;
      default:
        break;

    }
  }

  const createWhereJson = async (masterValue, count) => {
    let IsProductTypePresent = JSON.parse(localStorage.getItem('smv_product_type'));

    resetGlobalQuery();
    globalQuery.columns.push("field_id");
    globalQuery.columns.push("field_name");
    globalQuery.conditions.push({
      field: "company_id",
      operator: "=",
      value: COMPANY_ID
    });
    globalQuery.table = masterValue


    let createJson = { 'viewOrTable': {}, 'selectQuery': {}, 'whereQuery': {} }
    createJson['viewOrTable'][masterValue] = masterValue
    createJson['selectQuery']["field_id, field_name"] = "field_id, field_name"
    if (count !== 'productTpDependent') {
      for (let countIndex = 1; countIndex <= count; countIndex++) {
        if (countIndex === 1) {
          if (IsProductTypePresent !== '' && IsProductTypePresent !== null && IsProductTypePresent.length !== 0) {
            globalQuery.conditions.push({ field: "product_type_id", operator: "IN", values: JSON.parse(localStorage.getItem('smv_product_type')) });
          }
        }
        if (sessionStorage.getItem('smv_product_category' + countIndex) !== null && localStorage.getItem('smv_product_category' + countIndex) !== '') {
          globalQuery.conditions.push({ field: 'product_category' + countIndex + '_id', operator: "IN", values: JSON.parse(localStorage.getItem('smv_product_category' + countIndex)) });
        }
      }
    } else {
      if (masterValue !== 'smv_product_type') {
        if (IsProductTypePresent !== '' && IsProductTypePresent !== null && IsProductTypePresent.length !== 0) {
          globalQuery.conditions.push({ field: "product_type_id", operator: "IN", values: JSON.parse(localStorage.getItem('smv_product_type')) });
        }
      } else if (masterValue === 'smv_product_type') {
        // if (isPropsExist) {
        if (chk_product === 'smv_product_rm_summary') {
          globalQuery.conditions.push({ field: "product_type_group", operator: "IN", values: ['RM'] });
        } else if (chk_product === 'smv_product_fg_summary') {
          globalQuery.conditions.push({ field: "product_type_group", operator: "IN", values: ['FG'] });
        } else if (chk_product === 'smv_product_sr_summary') {
          globalQuery.conditions.push({ field: "product_type_group", operator: "IN", values: ['SR'] });
        }
        // }
      }
    }

    // APi Call
    let itemsList = await comboBox.current.fillFiltersCombo(globalQuery)
    seMasterDataList(itemsList)
  }


  const createFilterQuery = async () => {
    let checkedList = [];
    let checkListName = [];

    resetGlobalQuery();
    globalQuery.columns.push("*");
    globalQuery.conditions.push({
      field: "company_id",
      operator: "=",
      value: COMPANY_ID
    });
    globalQuery.table = chk_product

    // Get the select element
    let selectElement = document.getElementById("masterValueId");

    // Get the selected option
    let selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the fieldName attribute
    let fieldName = selectedOption.getAttribute("fieldName");

    checkedList.push(selectElement.value);
    checkListName.push(fieldName);


    localStorage.setItem($('#cmb_master_name').val(), JSON.stringify(checkedList))
    localStorage.setItem($('#cmb_master_name').val() + "Name", JSON.stringify(checkListName))

    localStorageKeyArr.push($('#cmb_master_name').val())
    localStorageKeyArr.push($('#cmb_master_name').val() + "Name")
    localStorage.setItem(`localStorageKeyArr`, JSON.stringify(localStorageKeyArr))

    // Find the <option> element by its value using jQuery
    var optionElement;
    var masterField;
    var query = ""
    var productTypes = JSON.parse(localStorage.getItem('smv_product_type'));
    var productTypesName = JSON.parse(localStorage.getItem('smv_product_typeName'))

    if (localStorage.getItem('smv_product_type') !== null && localStorage.getItem('smv_product_type') !== '') {
      if (productTypes.length !== 0) {
        var productTPStr = [];
        var productTPNameStr = '';
        for (let indexPT = 0; indexPT < productTypes.length; indexPT++) {
          productTPStr.push(productTypes[indexPT])
          productTPNameStr += JSON.stringify(productTypesName[indexPT]) + ', '
        }
        // productTPStr = productTPStr.substring(0, productTPStr.length - 2)
        productTPNameStr = productTPNameStr.substring(0, productTPNameStr.length - 2)
        // Get Master fieldid
        optionElement = $('option[value="smv_product_type"]')
        masterField = optionElement.attr('master_field');

        globalQuery.conditions.push({ field: masterField, operator: "IN", values: productTPStr });

        query += "product_type_id IN" + "(" + productTPNameStr + ")\n"
      }
    }
    for (let catIndex = 1; catIndex <= 5; catIndex++) {
      var category = JSON.parse(localStorage.getItem('smv_product_category' + catIndex))
      var categoryName = JSON.parse(localStorage.getItem('smv_product_category' + catIndex + 'Name'))
      if (localStorage.getItem('smv_product_category' + catIndex) !== null && localStorage.getItem('smv_product_category' + catIndex) !== '') {
        if (category.length !== 0) {
          var catStr = [];
          var catStrName = '';
          for (let indexCat = 0; indexCat < category.length; indexCat++) {
            catStr.push(category[indexCat])
            catStrName += JSON.stringify(categoryName[indexCat]) + ', '
          }
          catStrName = catStrName.substring(0, catStrName.length - 2)
          // Get Master fieldid
          optionElement = $('option[value="' + 'smv_product_category' + catIndex + '"]')
          masterField = optionElement.attr('master_field');

          globalQuery.conditions.push({ field: masterField, operator: "IN", values: catStr });
          query += 'product_category' + catIndex + '_id IN' + "(" + catStrName + ")\n"
        }

      }
    }

    let productMake = JSON.parse(localStorage.getItem('smv_product_make'))
    let productMakeName = JSON.parse(localStorage.getItem('smv_product_makeName'))
    if (localStorage.getItem('smv_product_make') !== null && localStorage.getItem('smv_product_make') !== '') {
      if (productMake.length !== 0) {
        let productMakeStr = [];
        let productMakeNameStr = '';
        for (let indexSh = 0; indexSh < productMake.length; indexSh++) {
          productMakeStr.push(productMake[indexSh])
          productMakeNameStr += JSON.stringify(productMakeName[indexSh]) + ', '
        }
        productMakeNameStr = productMakeNameStr.substring(0, productMakeNameStr.length - 2)

        // Get Master fieldid
        optionElement = $('option[value="smv_product_make"]')
        masterField = optionElement.attr('master_field');

        globalQuery.conditions.push({ field: masterField, operator: "IN", values: productMakeStr });
        query += "product_make_id IN" + "(" + productMakeNameStr + ")\n"
      }
    }


    var materialType = JSON.parse(localStorage.getItem('smv_product_material_type'))
    var materialTypeName = JSON.parse(localStorage.getItem('smv_product_material_typeName'))
    if (localStorage.getItem('smv_product_material_type') !== null && localStorage.getItem('smv_product_material_type') !== '') {
      if (materialType.length !== 0) {
        var materialTPStr = [];
        var materialTpNameStr = '';
        for (let indexMt = 0; indexMt < materialType.length; indexMt++) {
          materialTPStr.push(materialType[indexMt])
          materialTpNameStr += JSON.stringify(materialTypeName[indexMt]) + ', '
        }
        materialTpNameStr = materialTpNameStr.substring(0, materialTpNameStr.length - 2)

        // Get Master fieldid
        optionElement = $('option[value="smv_product_material_type"]')
        masterField = optionElement.attr('master_field');

        globalQuery.conditions.push({ field: masterField, operator: "IN", values: materialTPStr });
        query += "product_material_type_id IN" + "(" + materialTpNameStr + ")\n"
      }
    }

    let materialGrade = JSON.parse(localStorage.getItem('smv_product_material_grade'))
    let materialGradeName = JSON.parse(localStorage.getItem('smv_product_material_gradeName'))
    if (localStorage.getItem('smv_product_material_grade') !== null && localStorage.getItem('smv_product_material_grade') !== '') {
      if (materialGrade.length !== 0) {
        let materialGRStr = [];
        let materialGRNameStr = '';
        for (let indexMG = 0; indexMG < materialGrade.length; indexMG++) {
          materialGRStr.push(materialGrade[indexMG])
          materialGRNameStr += JSON.stringify(materialGradeName[indexMG]) + ', '
        }
        materialGRNameStr = materialGRNameStr.substring(0, materialGRNameStr.length - 2)

        // Get Master fieldid
        optionElement = $('option[value="smv_product_material_grade"]')
        masterField = optionElement.attr('master_field');

        globalQuery.conditions.push({ field: masterField, operator: "IN", values: materialGRStr });

        query += "product_material_grade_id IN" + "(" + materialGRNameStr + ")\n"
      }
    }

    var materialShape = JSON.parse(localStorage.getItem('smv_product_material_shape'))
    var materialShapeName = JSON.parse(localStorage.getItem('smv_product_material_shapeName'))
    if (localStorage.getItem('smv_product_material_shape') !== null && localStorage.getItem('smv_product_material_shape') !== '') {
      if (materialShape.length !== 0) {
        var materialShStr = [];
        var materialShNameStr = '';
        for (let indexSh = 0; indexSh < materialShape.length; indexSh++) {
          materialShStr.push(materialShape[indexSh])
          materialShNameStr += JSON.stringify(materialShapeName[indexSh]) + ', '
        }
        materialShNameStr = materialShNameStr.substring(0, materialShNameStr.length - 2)

        // Get Master fieldid
        optionElement = $('option[value="smv_product_material_shape"]')
        masterField = optionElement.attr('master_field');

        globalQuery.conditions.push({ field: masterField, operator: "IN", values: materialShStr });
        query += "product_material_shape_id IN" + "(" + materialShNameStr + ")\n"
      }
    }

    $('#selctedFilters').text(query)

    // APi Call
    if (query !== "") {
      const responceOfFilteredData = await comboBox.current.fillFiltersCombo(globalQuery);
      let productData = responceOfFilteredData
      if (productData.length !== 0) {
        switch (chk_product) {
          case 'smv_product_rm_summary':
            productData = productData.map(item => {
              // Create a new object with the updated key name
              const newItem = {
                ...item,

                product_id: item.product_rm_id,
                product_code: item.product_rm_code,
                product_name: item.product_rm_name,
                product_material_short_name: item.product_rm_short_name,
                product_tech_spect: item.product_rm_tech_spect,
                product_unit_name: item.product_rm_stock_unit_name,
                product_std_weight: item.product_rm_std_weight,
                stock_quantity: item.stock_quantity,
                stock_weight: item.stock_weight,

                customer_stock_quantity: item.customer_stock_quantity,
                customer_stock_weight: item.customer_stock_weight,

                product_lead_time: item.lead_time,
                product_moq: item.product_rm_moq,
                product_mrp: item.product_rm_mrp,
                product_landed_price: item.product_rm_landed_price,
                product_technical_name: item.product_rm_technical_name,
                product_type_group: item.product_type_group,
                product_type_name: item.product_type_name,
                product_type_short_name: item.product_type_short_name,
                product_category1_name: item.product_category1_name,
                product_category2_name: item.product_category2_name,
                product_category3_name: item.product_category3_name,
                product_category4_name: item.product_category4_name,
                product_category5_name: item.product_category5_name,
                product_packing_name: item.product_rm_packing_name,
                product_make_name: item.product_make_name,
                product_material_type_name: item.product_material_type_name,
                product_material_grade_name: item.product_material_grade_name,
                product_material_shape_name: item.product_material_shape_name,
                product_oem_part_code: item.product_rm_oem_part_code,
                product_our_part_code: item.product_rm_our_part_code,
                product_drawing_no: item.product_rm_drawing_no,
                godown_name: item.godown_name,
                godown_short_name: item.godown_short_name,
                godown_area: item.godown_area,
                godown_section_name: item.godown_section_name,
                godown_section_short_name: item.godown_section_short_name,
                godown_section_count: item.godown_section_count,
                godown_section_area: item.godown_section_area,
                godown_section_beans_name: item.godown_section_beans_name,
                godown_section_beans_short_name: item.godown_section_beans_short_name,
                godown_section_beans_area: item.godown_section_beans_area,
                product_hsn_sac_code: item.product_rm_hsn_sac_code,
                product_hsn_sac_rate: item.product_rm_hsn_sac_rate,
                product_category1_id: item.product_category1_id,
                product_type_id: item.product_type_id,
                product_unit_id: item.product_rm_stock_unit_id,
                product_packing_id: item.product_rm_packing_id,
                product_hsn_sac_code_id: item.product_rm_hsn_sac_code_id,
                product_category2_id: item.product_category2_id,
                product_category3_id: item.product_category3_id,
                product_category4_id: item.product_category4_id,
                product_category5_id: item.product_category5_id,
                product_make_id: item.product_make_id,
                product_material_type_id: item.product_material_type_id,
                product_material_grade_id: item.product_material_grade_id,
                product_material_shape_id: item.product_material_shape_id,
                company_id: item.company_id,
                company_branch_id: item.company_branch_id,
                godown_id: item.godown_id,
                godown_section_id: item.godown_section_id,
                godown_section_beans_id: item.godown_section_beans_id,

              };

              // Delete the old key
              // delete newItem.product_rm_name;

              return newItem;
            })
            break;
          case 'smv_product_fg_summary':

            productData = productData.map(item => {
              // Create a new object with the updated key name
              const newItem = {
                ...item,

                product_id: item.product_fg_id,
                product_code: item.product_fg_code,
                product_name: item.product_fg_name,
                product_material_short_name: item.product_fg_short_name,
                product_unit_name: item.product_fg_stock_unit_name,
                product_std_weight: item.product_fg_std_weight,
                product_tech_spect: item.product_fg_tech_spect,
                product_technical_name: item.product_fg_technical_name,
                product_type_group: item.product_type_group,
                product_type_name: item.product_type_name,
                product_type_short_name: item.product_type_short_name,
                product_category1_name: item.product_category1_name,
                product_category2_name: item.product_category2_name,
                product_category3_name: item.product_category3_name,
                product_category4_name: item.product_category4_name,
                product_category5_name: item.product_category5_name,
                product_material_type_name: item.product_material_type_name,
                product_material_grade_name: item.product_material_grade_name,
                product_material_shape_name: item.product_material_shape_name,
                product_oem_part_code: item.product_fg_oem_part_code,
                product_our_part_code: item.product_fg_our_part_code,
                product_drawing_no: item.product_fg_drawing_no,
                product_hsn_sac_code_id: item.product_fg_hsn_sac_code_id,
                product_hsn_sac_code: item.product_fg_hsn_sac_code,
                product_hsn_sac_rate: item.product_fg_hsn_sac_rate,
                product_type_id: item.product_type_id,
                product_category1_id: item.product_fg_category1_id,
                product_category2_id: item.product_fg_category2_id,
                product_category3_id: item.product_fg_category3_id,
                product_category4_id: item.product_fg_category4_id,
                product_category5_id: item.product_fg_category5_id,
                product_material_type_id: item.product_fg_material_type_id,
                product_material_grade_id: item.product_fg_material_grade_id,
                product_material_shape_id: item.product_material_shape_id,
                company_branch_id: item.company_branch_id,
                bom_applicable: item.bom_applicable,
                product_unit_id: item.product_fg_stock_unit_id,
                stock_quantity: item.stock_quantity,
                stock_weight: item.stock_weight,

                customer_stock_quantity: item.customer_stock_quantity,
                customer_stock_weight: item.customer_stock_weight,

                product_lead_time: item.lead_time

              };

              // Delete the old key
              // delete newItem.product_rm_name;

              return newItem;
            })

            break;
          case 'smv_product_sr_summary':
            productData = productData.map(item => {
              // Create a new object with the updated key name
              const newItem = {
                ...item,

                product_id: item.product_sr_id,
                product_code: item.product_sr_code,
                product_name: item.product_sr_name,
                product_material_short_name: item.product_sr_short_name,
                product_std_price: item.product_sr_std_price,
                product_std_hours: item.product_sr_std_hours,
                product_mrp: item.product_sr_mrp,
                process_duration: item.process_duration,
                product_tech_spect: item.product_sr_tech_spect,
                product_type_group: item.product_type_group,
                product_type_name: item.product_type_name,
                product_category1_name: item.product_category1_name,
                product_category2_name: item.product_category2_name,
                product_category3_name: item.product_category3_name,
                product_category4_name: item.product_category4_name,
                product_category5_name: item.product_category5_name,
                product_hsn_sac_code: item.product_sr_hsn_sac_code,
                product_hsn_sac_rate: item.product_sr_hsn_sac_rate,
                product_std_profit_percent: item.product_sr_std_profit_percent,
                product_std_discount_percent: item.product_sr_std_discount_percent,
                product_unit_name: item.product_sr_sales_unit_name,
                product_type_id: item.product_type_id,
                product_category1_id: item.product_sr_category1_id,
                product_category2_id: item.product_sr_category2_id,
                product_category3_id: item.product_sr_category3_id,
                product_category4_id: item.product_sr_category4_id,
                product_category5_id: item.product_sr_category5_id,
                product_hsn_sac_code_id: item.product_sr_hsn_sac_code_id,
                product_unit_id: item.product_sr_stock_unit_id,
                stock_quantity: item.stock_quantity,
                stock_weight: item.stock_weight,

                customer_stock_quantity: item.customer_stock_quantity,
                customer_stock_weight: item.customer_stock_weight,

                product_lead_time: item.lead_time,
                product_landed_price: item.product_material_landed_price,

              };

              // Delete the old key
              // delete newItem.product_rm_name;

              return newItem;
            })
            break;

          case 'smv_product_rm_fg_sr':
            productData = productData.map(item => {
              // Create a new object with the updated key name
              const newItem = {
                ...item,
                product_type_group: item.product_type_group,
                product_type_name: item.product_type_name,
                product_category1_name: item.product_material_category1_name,
                product_id: item.product_material_id,
                product_code: item.product_material_code,
                product_name: item.product_material_name,
                product_material_short_name: item.product_material_short_name,
                product_tech_spect: item.product_material_tech_spect,
                product_unit_name: item.product_material_stock_unit_name,
                stock_quantity: item.stock_quantity,
                stock_weight: item.stock_weight,

                customer_stock_quantity: item.customer_stock_quantity,
                customer_stock_weight: item.customer_stock_weight,

                product_lead_time: item.lead_time,
                product_moq: item.product_material_moq,
                product_mrp: item.product_material_mrp,
                product_landed_price: item.product_material_landed_price,
                product_technical_name: item.product_material_technical_name,
                product_material_type_short_name: item.product_material_type_short_name,
                product_category2_name: item.product_material_category2_name,
                product_category3_name: item.product_material_category3_name,
                product_category4_name: item.product_material_category4_name,
                product_category5_name: item.product_material_category5_name,
                product_packing_name: item.product_material_packing_name,
                product_make_name: item.product_material_make_name,
                product_material_type_name: item.product_material_type_name,
                product_material_grade_name: item.product_material_grade_name,
                product_material_shape_name: item.product_material_shape_name,
                product_oem_part_code: item.product_material_oem_part_code,
                product_our_part_code: item.product_material_our_part_code,
                product_drawing_no: item.product_material_drawing_no,
                product_std_weight: item.product_material_std_weight,
                product_std_hours: item.product_material_std_hours,
                process_duration: item.process_duration,
                product_std_profit_percent: item.product_std_profit_percent,
                product_std_discount_percent: item.product_std_discount_percent,
                godown_name: item.godown_name,
                godown_short_name: item.godown_short_name,
                godown_area: item.godown_area,
                godown_section_name: item.godown_section_name,
                godown_section_short_name: item.godown_section_short_name,
                godown_section_area: item.godown_section_area,
                godown_section_beans_name: item.godown_section_beans_name,
                godown_section_beans_short_name: item.godown_section_beans_short_name,
                godown_section_beans_area: item.godown_section_beans_area,
                product_hsn_sac_code: item.product_material_hsn_sac_code,
                product_hsn_sac_rate: item.product_material_hsn_sac_rate,
                product_category1_id: item.product_material_category1_id,
                product_type_id: item.product_type_id,
                product_unit_id: item.product_material_stock_unit_id,
                product_packing_id: item.product_material_packing_id,
                product_hsn_sac_code_id: item.product_material_hsn_sac_code_id,
                product_category2_id: item.product_material_category2_id,
                product_category3_id: item.product_material_category3_id,
                product_category4_id: item.product_material_category4_id,
                product_category5_id: item.product_material_category5_id,
                product_make_id: item.product_material_make_id,
                product_material_type_id: item.product_material_type_id,
                product_material_grade_id: item.product_material_grade_id,
                product_material_shape_id: item.product_material_shape_id,
                company_id: item.company_id,
                company_branch_id: item.company_branch_id,
                godown_id: item.godown_id,
                godown_section_id: item.godown_section_id,
                godown_section_beans_id: item.godown_section_beans_id,
                bom_applicable: item.bom_applicable
              };

              // Delete the old key
              // delete newItem.product_rm_name;

              return newItem;
            })


            break;
          default:
            break;
        }

        setFilteredData(productData)
        if (sessionStorage.getItem('isComboFilterExist') === 'true') {
          sessionStorage.setItem(`comboFilterData`, JSON.stringify(productData))
        }
        await checkProductListIsExist();

      } else {
        setFilteredData([])
      }
    }
  }

  const checkProductListIsExist = async () => {
    const getDataIfExist = JSON.parse(localStorage.getItem('filteredMaterialData'))
    try {
      if (getDataIfExist !== null && getDataIfExist !== '') {
        debugger
        const valuesToCheck = getDataIfExist.map(item => item.product_id.toString());
        $('input:checkbox[name="checkFilteredData"]').each(function () {
          if (valuesToCheck.includes($(this).val())) {
            $(this).prop('checked', true);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkedSelectedFilterFields = (sesssionVal, filterList) => {
    console.log(filterList);
    if (sesssionVal !== '' && sesssionVal !== null) {
      $('#masterValueId').val(sesssionVal)
    }

  }


  const FnAddProduct = () => {
    let newTab;
    switch (chk_product) {
      case 'smv_product_rm_summary':
        newTab = window.open('/Masters/Material', '_blank');
        if (newTab) {
          newTab.focus();
        }
        break;
      case 'smv_product_fg_summary':
        newTab = window.open('/Masters/FinishGoods', '_blank');
        if (newTab) {
          newTab.focus();
        }
        break;
      case 'smv_product_sr_summary':
        newTab = window.open('/Masters/MService/FrmMServiceEntry', '_blank');
        if (newTab) {
          newTab.focus();
        }
        break;
      default:
        break;
    }
  }


  const clearFilters = async (key) => {
    // Remove Bom Filter Session
    let LocalArr = JSON.parse(localStorage.getItem(`localStorageKeyArr`))
    if (LocalArr !== null)
      for (let localArrIndex = 0; localArrIndex < LocalArr.length; localArrIndex++) {
        localStorage.removeItem(LocalArr[localArrIndex])
      }

    for (let index = 0; index < masterList.length; index++) {
      localStorage.removeItem(masterList[index])
      localStorage.removeItem(masterList[index] + 'Name')

    }

    $('#selctedFilters').empty();
    $('#masterValueId').val(0)
    $('#cmb_master_name').val(0);
    setFilteredData([])
    seMasterDataList([])

    // Fill filter Master Combo
    resetGlobalQuery();
    globalQuery.columns = ["property_name", "property_value", "remark"]

    globalQuery.conditions.push({
      field: "company_id",
      operator: "=",
      value: COMPANY_ID
    });
    if (key === 'smv_product_rm_summary') {
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "RMFilterMasters" });
    } else if (key === 'smv_product_fg_summary') {
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "FGFilterMasters" });
    } else if (key === 'smv_product_sr_summary') {
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "SRFilterMasters" });
    } else if (key === 'smv_product_rm_fg_sr') {
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "RMFilterMasters" });
    }
    globalQuery.table = "amv_properties";

    const getMasters = await comboBox.current.fillFiltersCombo(globalQuery);
    setMaterList(getMasters)
  }

  function toggleOptionsChkBoxes(key) {
    switch (key) {
      case "checkAll":
        $('.option').prop('checked', $('#chkAllOptions').is(":checked"))
        break;
    }
  }

  const handleCheckbox = (product_id) => {
    $('input:checkbox[name="checkFilteredData"][value="' + product_id + '"]').attr('checked', false);
  }


  const applyFilterNShowData = () => {
    const requiredCols = JSON.parse(localStorage.getItem('requiredCols'));
    const checked = $("input:checkbox[name=checkFilteredData]:checked")

    const selectedProductIds = [];
    let availableBomData = JSON.parse(localStorage.getItem('filteredMaterialData')) || [];

    for (let index = 0; index < checked.length; index++) {
      const element = checked[index].value;
      selectedProductIds.push(element)

      if (availableBomData === null) {
        availableBomData = []
      }

      const tdData = data.find(item => item.product_id === element)
      if (tdData) {
        const filteredDataRecord = requiredCols.reduce((acc, col) => {
          acc[col] = tdData.hasOwnProperty(col) ? tdData[col] : 0;
          return acc;
        }, {});

        checkedData.push(filteredDataRecord);
      }
    }

    const mergeSessionAndCheckedArr = [...checkedData, ...availableBomData]
    const productItemList = mergeSessionAndCheckedArr.filter(item => selectedProductIds.includes(item.product_id))

    localStorage.setItem('filteredMaterialData', JSON.stringify(productItemList))
    closeModal();
  }

  return (
    <>
      <ComboBox ref={comboBox} />

      <div className="row">
        <div className="row">
          <div className="col-sm-2">
            <Form.Label className="erp-form-label-md">Select Product</Form.Label>
          </div>
          <div className="col-sm-8">
            <div className="erp_form_radio">
              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Raw Material" type="radio" value="smv_product_rm_summary" name="chk_product" checked={chk_product === "smv_product_rm_summary"} onClick={() => { setProduct("smv_product_rm_summary"); clearFilters("smv_product_rm_summary"); }} /> </div>
              <div className="ms-2"> <Form.Check className="erp_radio_button" label="Finish Goods" type="radio" value="smv_product_fg_summary" name="chk_product" checked={chk_product === "smv_product_fg_summary"} onClick={() => { setProduct("smv_product_fg_summary"); clearFilters("smv_product_fg_summary"); }} /> </div>
              <div className="ms-2"> <Form.Check className="erp_radio_button" label="Services" type="radio" value="smv_product_sr_summary" name="chk_product" checked={chk_product === "smv_product_sr_summary"} onClick={() => { setProduct("smv_product_sr_summary"); clearFilters("smv_product_sr_summary"); }} /> </div>
              <div className="ms-2"> <Form.Check className="erp_radio_button" label="Projects" type="radio" value="smv_product_pr_summary" name="chk_product" checked={chk_product === "smv_product_pr_summary"} onClick={() => { setProduct("smv_product_pr_summary"); clearFilters("smv_product_pr_summary"); }} /> </div>
              <div className="ms-2"> <Form.Check className="erp_radio_button" label="All" type="radio" value="smv_product_rm_fg_sr" name="chk_product" checked={chk_product === "smv_product_rm_fg_sr"} onClick={() => { setProduct("smv_product_rm_fg_sr"); clearFilters('smv_product_rm_fg_sr'); }} /> </div>
            </div>
          </div>

          <div className="col-sm-2">
            <MDButton type="button" className="erp-gb-button text-end" onClick={FnAddProduct} variant="button"
              fontWeight="regular" >Add Product</MDButton>
          </div>
        </div>
      </div>

      <div className="card filter">
        <div className='row'>
          <Form.Label className="erp-form-label-md">Filters:</Form.Label>
        </div>
        <div className='row'>
          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-2'>
                <Form.Label className="erp-form-label">Masters:</Form.Label>
              </div>
              <div className='col'>
                <select id="cmb_master_name" className="form-select form-select-sm" onChange={FnMasterOnChange}>
                  <option value="0"></option>
                  {masterList?.map((item) => (
                    <option value={item.property_name} master_field={item.remark}>{item.property_value}</option>

                  ))}
                </select>
              </div>
            </div>


          </div>


          <div className='col-sm-4 erp_form_col_div'>
            <div className='row'>
              <div className='col-sm-2'>
                <Form.Label className="erp-form-label">Filters:</Form.Label>
              </div>
              <div className='col'>
                <select id='masterValueId' className="form-select form-select-sm"
                  onChange={createFilterQuery}
                >
                  <option value="0"></option>
                  {masterDataList?.map((item) => (
                    <option value={item.field_id} fieldName={item.field_name}>{item.field_name}</option>

                  ))}

                </select>

              </div>
            </div>
          </div>


        </div>
        <div className="row">
          {/* <div className='col-sm-4 erp_form_col_div'> */}
          <div className='row'>
            <div className='col-sm-3'>
              <Form.Label className="erp-form-label">Selection Criteria:</Form.Label>
            </div>
            <div className='col-sm-6'>
              <Form.Control as="textarea" id="selctedFilters" rows={1} className="erp_txt_area" readOnly />
            </div>
            <div className='col-sm-3'>
              <MDButton type="button" className="erp-gb-button" onClick={() => clearFilters(chk_product)} variant="button"
                fontWeight="regular" >Clear Filters</MDButton>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>


      <div className="row">
        <div className="row">
          <div className="col-sm-6 erp_form_col_div">

            {
              data.length > 0 ?
                <span>
                  <input type='checkbox' id="chkAllOptions" onClick={(e) => toggleOptionsChkBoxes('checkAll')} /> <label class="erp-form-label pb-1"> Select All Options</label>
                </span>
                : null
            }
          </div>

        </div>

        <span id="bomNoRcrdId" className="no-recrds erp-form-label-md" style={{ display: "none" }}>No records found...</span>
        {/* <div className={`bomFilterData ${data.length !== 0 ? 'display' : 'd-none'}`} > */}
        <div className={`erp_table_scroll ${data.length !== 0 ? 'display' : 'd-none'}`}>
          <Table className="erp_table erp_table_scroll" id='erp-enquirydetails-table' bordered striped hover>
            <thead className="erp_table_head">
              <tr>
                <th className="erp_table_th">Action</th>
                <th className="erp_table_th">Sr. No.</th>
                <th className="erp_table_th">Material Name</th>
                <th className="erp_table_th">Material Technical Specification</th>
                <th className="erp_table_th">Material Unit Name</th>
                <th className="erp_table_th">Material Std. Weight</th>
                <th className="erp_table_th">Stock Quantity</th>
                <th className="erp_table_th">Stock Weight</th>
                <th className="erp_table_th">Lead Time</th>
                <th className="erp_table_th">Material Moq</th>
                <th className="erp_table_th">Material Mrp</th>
                <th className="erp_table_th">Material Landed Price</th>
                <th className="erp_table_th">Material Technical Name</th>
                <th className="erp_table_th">Product Type Group</th>
                <th className="erp_table_th">Product Type Name</th>
                <th className="erp_table_th">Product Type Short</th>
                <th className="erp_table_th">Category-1</th>
                <th className="erp_table_th">Category-2</th>
                <th className="erp_table_th">Category-3</th>
                <th className="erp_table_th">Category-4</th>
                <th className="erp_table_th">Category-5</th>
                <th className="erp_table_th">Packing Name</th>
                <th className="erp_table_th">Make Name</th>
                <th className="erp_table_th">Material Type Name</th>
                <th className="erp_table_th">Grade Name</th>
                <th className="erp_table_th">Shape Name</th>
                <th className="erp_table_th">OEM Part Code</th>
                <th className="erp_table_th">OUR Part Code</th>
                <th className="erp_table_th">Drawing No.</th>
                <th className="erp_table_th">HSN-SAC Code</th>
                <th className="erp_table_th">HSN-SAC Rate</th>
                <th className="erp_table_th">Material Code</th>
                <th className="erp_table_th">Material Id</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((item, index) =>
                  <tr>
                    <td className="erp_table_td">
                      <input type='checkbox' className="option form-check-input" name="checkFilteredData" id={'checkFilteredDataId_' + item.product_id}
                        value={item.product_id} onClick={() => { handleCheckbox(item.product_id); }}>
                      </input>
                    </td>

                    <td className="erp_table_td">{index + 1}</td>
                    <td className="erp_table_td">{item.product_name}</td>
                    <td className="erp_table_td">{item.product_tech_spect}</td>
                    <td className="erp_table_td">{item.product_unit_name}</td>
                    <td className="erp_table_td">{item.product_std_weight}</td>
                    <>
                      {
                        stockType === "own" ?
                          <>
                            <td className="erp_table_td">{item.stock_quantity}</td>
                            <td className="erp_table_td">{item.stock_weight}</td></>
                          : <>
                            <td className="erp_table_td">{item.customer_stock_quantity}</td>
                            <td className="erp_table_td">{item.customer_stock_weight}</td>
                          </>
                      }
                    </>
                    <td className="erp_table_td">{item.product_lead_time}</td>
                    <td className="erp_table_td">{item.product_moq}</td>
                    <td className="erp_table_td">{item.product_mrp}</td>
                    <td className="erp_table_td">{item.product_landed_price}</td>
                    <td className="erp_table_td">{item.product_technical_name}</td>
                    <td className="erp_table_td">{item.product_type_group}</td>
                    <td className="erp_table_td">{item.product_type_name}</td>
                    <td className="erp_table_td">{item.product_type_short_name}</td>
                    <td className="erp_table_td">{item.product_category1_name}</td>
                    <td className="erp_table_td">{item.product_category2_name}</td>
                    <td className="erp_table_td">{item.product_category3_name}</td>
                    <td className="erp_table_td">{item.product_category4_name}</td>
                    <td className="erp_table_td">{item.product_category5_name}</td>
                    <td className="erp_table_td">{item.product_packing_name}</td>
                    <td className="erp_table_td">{item.product_make_name}</td>
                    <td className="erp_table_td">{item.product_material_type_name}</td>
                    <td className="erp_table_td">{item.product_material_grade_name}</td>
                    <td className="erp_table_td">{item.product_material_shape_name}</td>
                    <td className="erp_table_td">{item.product_oem_part_code}</td>
                    <td className="erp_table_td">{item.product_our_part_code}</td>
                    <td className="erp_table_td">{item.product_drawing_no}</td>
                    <td className="erp_table_td">{item.product_hsn_sac_code}</td>
                    <td className="erp_table_td">{item.product_hsn_sac_rate}</td>
                    <td className="erp_table_td">{item.product_code}</td>
                    <td className="erp_table_td">{item.product_id}</td>

                  </tr>
                )
              }
            </tbody>
          </Table>
        </div>
        <div className={`text-center ${data.length !== 0 ? 'display' : 'd-none'}`} >
          <MDButton className="erp-gb-button" variant="button" onClick={applyFilterNShowData} fontWeight="regular">
            Add
          </MDButton>
        </div>
      </div>



    </>
  )
}

export default ProductList;
