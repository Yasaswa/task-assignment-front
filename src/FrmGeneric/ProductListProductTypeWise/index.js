import React, { useState, useEffect, useRef, useMemo } from "react";
import $ from 'jquery';
import { useTable } from 'react-table'

// Material Dashboard 2 PRO React components
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import ConfigConstants from "assets/Constants/config-constant";
import { Table } from "react-bootstrap";
import { CircularProgress } from "@material-ui/core";


function ProductListProductTypeWise({ closeModal, props, stockType = 'own' }) {
    const configConstants = ConfigConstants();
    const { COMPANY_ID } = configConstants;
    const { product_type_id } = props;
    // Table Data
    const [data, setFilteredData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [localStorageKeyArr, setLocalStrKeyArr] = useState([])
    const [isPropsExist, setIsPropsExist] = useState(false)

    // Get Checked data
    const [checkedData, setCheckedData] = useState([]);
    const [selectedProductTypesArray, setSelectedProductType] = useState([])

    // Filter Master Combo
    const [cmbMasterOptions, setCmbMasterOptions] = useState([]);

    // use refs
    const comboBox = useRef();


    // Select box
    var expanded = false;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const functionCall = async () => {
            debugger
            await FnFillCombos();
        }
        functionCall()
        $(document).mouseup(function (e) {
            var container = $("#erp-checkboxes, #erp-checkboxes-pt");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });

    }, [stockType])

    const FnFillCombos = async () => {
        // Fill filter Master Combo
        resetGlobalQuery();
        globalQuery.columns.push("property_name");
        globalQuery.columns.push("property_value");

        // globalQuery.conditions.push({
        //     field: "company_id",
        //     operator: "=",
        //     value: COMPANY_ID
        // });
        globalQuery.conditions.push({
            field: "properties_master_name",
            operator: "=",
            value: "RMFilterMasters"
        });
        globalQuery.table = "amv_properties";

        comboBox.current.fillFiltersCombo(globalQuery).then((apiCall) => {
            setCmbMasterOptions(apiCall)
        })

        // get product Types
        comboBox.current.fillMasterData("smv_product_type", "", "")
            .then(getProductType => {
                setSelectedProductType(getProductType)
                const ulElement = document.getElementById('erp-checkboxes-pt');

                // Empty the ulElement
                ulElement.innerHTML = '';

                getProductType.forEach((item, index) => {
                    const liElement = document.createElement('li');
                    liElement.className = 'item ptItems';

                    const spanCheckbox = document.createElement('span');
                    spanCheckbox.className = 'checkbox';

                    const checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.setAttribute('fieldName', item.field_name); // Use data-* attribute to store additional data

                    //   checkboxInput.fieldName = item.field_name; // You can set any other properties if needed
                    checkboxInput.name = 'ptCheckBox';
                    checkboxInput.value = item.field_id;
                    checkboxInput.id = `filterCheck-${item.field_id}`;
                    checkboxInput.className = 'erp_radio_button ptCheckBox';
                    checkboxInput.addEventListener('change', (event) => selectProductTypes(event.target.value, 'smv_product_type'));

                    spanCheckbox.appendChild(checkboxInput);

                    const spanItemText = document.createElement('span');
                    spanItemText.className = 'item-text';
                    spanItemText.textContent = item.field_name;

                    liElement.appendChild(spanCheckbox);
                    liElement.appendChild(spanItemText);

                    ulElement.appendChild(liElement);
                });
                // $('input[type="checkbox"][name="ptCheckBox"][value="' + product_type_id + '"]').prop('checked', true);
                // selectProductTypes(product_type_id, 'smv_product_type')
            });
        // Category display
        const catCount = sessionStorage.getItem('compRMCatCount')
        const cmbMasterElements = document.getElementById('cmb_master_name');
        var counter = 1;

        for (let cmbMasterEleInd = 0; cmbMasterEleInd < cmbMasterElements.length; cmbMasterEleInd++) {
            if (cmbMasterElements[cmbMasterEleInd].value === 'smv_product_category' + counter + '') {
                if (counter > parseInt(catCount)) {
                    cmbMasterElements[cmbMasterEleInd].style.display = 'none'
                    counter++;
                } else {
                    counter++;
                    cmbMasterElements[cmbMasterEleInd].style.display = 'block'
                }
            }
        }
    }

    const showCheckboxes = (id, className) => {
        var checkboxes = document.getElementById(`${id}`);
        const items = document.querySelectorAll(`.${className}`);

        if (!expanded) {
            if (items.length !== 0) {
                checkboxes.style.display = "block";
                expanded = true;
            }
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }

    }

    const masterOnChange = async () => {
        debugger
        let IsProductTypePresent = sessionStorage.getItem('smv_product_type');
        let IsCategory1Present = sessionStorage.getItem('smv_product_category1');
        let IsCategory2Present = sessionStorage.getItem('smv_product_category2');
        let IsCategory3Present = sessionStorage.getItem('smv_product_category3');
        let IsCategory4Present = sessionStorage.getItem('smv_product_category4');
        let IsCategory5Present = sessionStorage.getItem('smv_product_category5');
        let IsMaterialMakePresent = sessionStorage.getItem('smv_product_make');
        let IsMaterialTypePresent = sessionStorage.getItem('smv_product_material_type');
        let IsMaterialGradePresent = sessionStorage.getItem('smv_product_material_grade');
        let IsMaterialShapePresent = sessionStorage.getItem('smv_product_material_shape');

        $('#erp-checkboxes').empty();
        var masterValue = $('#cmb_master_name').val();

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

    // const [master_value, setMasterValue] = useState('')
    const createWhereJson = async (masterValue, count) => {
        var IsProductTypePresent = JSON.parse(sessionStorage.getItem('smv_product_type'));

        resetGlobalQuery();
        globalQuery.columns.push("field_id");
        globalQuery.columns.push("field_name");
        // globalQuery.conditions.push({
        //     field: "company_id",
        //     operator: "=",
        //     value: COMPANY_ID
        // });
        globalQuery.table = masterValue


        var createJson = { 'viewOrTable': {}, 'selectQuery': {}, 'whereQuery': {} }
        createJson['viewOrTable'][masterValue] = masterValue
        createJson['selectQuery']["field_id, field_name"] = "field_id, field_name"
        if (count !== 'productTpDependent') {
            for (let countIndex = 1; countIndex <= count; countIndex++) {
                if (countIndex === 1) {
                    if (IsProductTypePresent !== '' && IsProductTypePresent !== null && IsProductTypePresent.length !== 0) {
                        globalQuery.conditions.push({ field: "product_type_id", operator: "IN", values: JSON.parse(sessionStorage.getItem('smv_product_type')) });
                    }
                }
                if (sessionStorage.getItem('smv_product_category' + countIndex) !== null && sessionStorage.getItem('smv_product_category' + countIndex) !== '') {
                    globalQuery.conditions.push({ field: 'product_category' + countIndex + '_id', operator: "IN", values: JSON.parse(sessionStorage.getItem('smv_product_category' + countIndex)) });
                }
            }
        } else {
            if (masterValue !== 'smv_product_type') {
                if (IsProductTypePresent !== '' && IsProductTypePresent !== null && IsProductTypePresent.length !== 0) {
                    globalQuery.conditions.push({ field: "product_type_id", operator: "IN", values: JSON.parse(sessionStorage.getItem('smv_product_type')) });
                }
            } else if (masterValue === 'smv_product_type') {
                if (isPropsExist) {
                    globalQuery.conditions.push({ field: "product_type_group", operator: "IN", values: ['RM', 'GN', 'TM'] });
                }
            }
        }
        // APi Call
        let itemsList = await comboBox.current.fillFiltersCombo(globalQuery)

        const ulElement = document.getElementById('erp-checkboxes');

        // Empty the ulElement
        ulElement.innerHTML = '';

        itemsList.forEach((item, index) => {
            const liElement = document.createElement('li');
            liElement.className = 'item bomItems';

            const spanCheckbox = document.createElement('span');
            spanCheckbox.className = 'checkbox';

            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.setAttribute('fieldName', item.field_name); // Use data-* attribute to store additional data

            //   checkboxInput.fieldName = item.field_name; // You can set any other properties if needed
            checkboxInput.name = 'filterCheckBox';
            checkboxInput.value = item.field_id;
            checkboxInput.id = `filterCheck-${item.field_id}`;
            checkboxInput.className = 'erp_radio_button filterCheckBox';
            checkboxInput.addEventListener('change', (event) => checkFilterCheckbox(event.target.value, masterValue));

            spanCheckbox.appendChild(checkboxInput);

            const spanItemText = document.createElement('span');
            spanItemText.className = 'item-text';
            spanItemText.textContent = item.field_name;

            liElement.appendChild(spanCheckbox);
            liElement.appendChild(spanItemText);

            ulElement.appendChild(liElement);
        });

        return data;

    }

    const checkFilterCheckbox = async (checkboxVal, masterValue) => {
        debugger
        if (parseInt(checkboxVal) === 0) {
            if ($("#All").is(":checked") === false) {
                checkAllFieldsFrFiltrList('uncheck');
            } else {
                checkAllFieldsFrFiltrList('check');
            }
        }
        var checkedList = [];
        $("input:checkbox[name=filterCheckBox]:checked").each(async function () {
            const value = $(this).val()
            if (parseInt(value) !== 0) {
                checkedList.push(value);
            }
        });
        sessionStorage.setItem(masterValue, JSON.stringify(checkedList))
        await createFilterQuery();
    }

    const selectProductTypes = async () => {

        var checkedList = [];
        let ptObject = {}
        $("input:checkbox[name=ptCheckBox]:checked").each(async function () {
            const value = $(this).val()
            const text = $(this).attr('fieldName');
            if (parseInt(value) !== 0) {
                ptObject = { 'value': value, "text": text };
                checkedList.push(ptObject);
            }
        });
        setSelectedProductType(checkedList)
        let chk_value = [];
        checkedList.forEach((ptObject) => {
            chk_value.push(ptObject.value)
        })
        sessionStorage.setItem('smv_product_type', JSON.stringify(chk_value))
        await createFilterQuery(checkedList);
    }


    const checkAllFieldsFrFiltrList = (key) => {
        const fliterCheckbox = document.getElementsByName('filterCheckBox');
        if (key === 'check') {
            for (var checkbox of fliterCheckbox) {
                $('input:checkbox[name="filterCheckBox"][value="' + checkbox.value + '"]').attr('checked', true);
                if (parseInt(checkbox.value) !== 0)
                    $('input:checkbox[name="filterCheckBox"][value="' + checkbox.value + '"]').attr('disabled', true);
            }
        } else {
            for (var checkbox of fliterCheckbox) {
                $('input:checkbox[name="filterCheckBox"][value="' + checkbox.value + '"]').attr('checked', false);
                $('input:checkbox[name="filterCheckBox"][value="' + checkbox.value + '"]').attr('disabled', false);

            }
        }

    }

    const checkedSelectedFilterFields = (sesssionVal, filterList) => {
        if (sesssionVal !== '' && sesssionVal !== null) {
            var fliterCheckbox = document.getElementsByName('filterCheckBox');
            let IsSessionvalPresentParse = JSON.parse(sesssionVal)
            for (let index = 0; index < filterList.length; index++) {
                for (var checkbox of fliterCheckbox) {
                    if (parseInt(checkbox.value) === filterList[index].field_id) {
                        $('input:checkbox[name="filterCheckBox"][value="' + IsSessionvalPresentParse[index] + '"]').attr('checked', true);
                    }
                }
            }
        }

    }


    const createFilterQuery = async (selectedProductTypes) => {
        debugger
        setIsLoading(true)
        var checkedList = [];
        var checkListName = [];
        $("input:checkbox[name=filterCheckBox]:checked").each(function () {
            const checkbValue = $(this).val()
            if (parseInt(checkbValue) !== 0) {
                checkedList.push(checkbValue);
                checkListName.push($(this).attr('fieldName'));
            }
        });

        localStorage.setItem($('#cmb_master_name').val(), JSON.stringify(checkedList))
        localStorage.setItem($('#cmb_master_name').val() + "Name", JSON.stringify(checkListName))

        localStorageKeyArr.push($('#cmb_master_name').val())
        localStorageKeyArr.push($('#cmb_master_name').val() + "Name")
        localStorage.setItem(`localStorageKeyArr`, JSON.stringify(localStorageKeyArr))


        var query = ""
        if (selectedProductTypes === undefined) {
            selectedProductTypes = selectedProductTypesArray
        }
        resetGlobalQuery();
        if (selectedProductTypes.length !== 0) {
            globalQuery.columns = [`rm_fg_sr.*, IFNULL((SELECT SUM(st.closing_balance_quantity) FROM sm_product_rm_stock_summary st WHERE st.product_rm_id = rm_fg_sr.product_material_id  AND st.company_id = ${COMPANY_ID} ), 0) AS closing_balance_quantity,
                IFNULL((SELECT SUM(st.closing_balance_weight) FROM sm_product_rm_stock_summary st WHERE st.product_rm_id = rm_fg_sr.product_material_id AND  AND st.company_id = ${COMPANY_ID} ), 0) AS closing_balance_weight`
            ];
            // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.table = "smv_product_rm_fg_sr as rm_fg_sr"
            let chk_value = [];
            let chk_text = [];
            selectedProductTypes.forEach((ptObject) => {
                chk_value.push(ptObject.value)
                chk_text.push(ptObject.text)
            })
            globalQuery.conditions.push({ field: "rm_fg_sr.product_type_id", operator: "IN", values: chk_value });

            query += "product_type_id IN" + "(" + chk_text + ")\n"

            // }
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

                        globalQuery.conditions.push({ field: 'rm_fg_sr.product_material_category' + catIndex + '_id', operator: "IN", values: catStr });
                        query += 'product_material_category' + catIndex + '_id IN' + "(" + catStrName + ")\n"
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
                    globalQuery.conditions.push({ field: "rm_fg_sr.product_material_make_id", operator: "IN", values: productMakeStr });
                    query += "product_material_make_id IN" + "(" + productMakeNameStr + ")\n"
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

                    globalQuery.conditions.push({ field: "rm_fg_sr.product_material_type_id", operator: "IN", values: materialTPStr });
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
                    globalQuery.conditions.push({ field: "rm_fg_sr.product_material_grade_id", operator: "IN", values: materialGRStr });

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
                    globalQuery.conditions.push({ field: "rm_fg_sr.product_material_shape_id", operator: "IN", values: materialShStr });
                    query += "product_material_shape_id IN" + "(" + materialShNameStr + ")\n"
                }
            }
            $('#selctedFilters').text(query)
            // globalQuery.joins.push({
            //     "table": "smv_product_rm_stock_summary as ss",
            //     "type": "left",
            //     "on": [{
            //         "left": "rm_fg_sr.product_material_id",
            //         "right": "ss.product_rm_id"
            //     },
            //     // {
            //     //     "left": "rm_fg_sr.product_material_id",
            //     //     "right": "ss.product_rm_id"
            //     // },
            //     {
            //          "left": COMPANY_ID ,
            //         "right": "ss.company_id"
            //     }
            //     ]}
            // )
            // APi Call
            // if (query !== "") {
            const responceOfFilteredData = await comboBox.current.fillFiltersCombo(globalQuery);

            let productData = responceOfFilteredData
            if (productData.length !== 0) {
                //                 resetGlobalQuery();
                //                 globalQuery.columns.push("*");
                //                 globalQuery.table = "smv_product_rm_stock_summary"
                //                 let chk_value = [];
                //                 let chk_text = [];
                //                 selectedProductTypes.forEach((ptObject) => {
                //                     chk_value.push(ptObject.value)
                //                     chk_text.push(ptObject.text)
                //                 })
                //                 globalQuery.conditions.push({ field: "product_type_id", operator: "IN", values: chk_value });
                //                 const stockArrayList = await comboBox.current.fillFiltersCombo(globalQuery);
                // debugger
                //                 const updateStockQuantities = (productData, stockArrayList) => {
                //                     productData.forEach(item => {
                //                         const stockItem = stockArrayList.find(stock =>  stock.product_rm_id === item.product_material_id &&  stock.product_type_id === item.product_type_id);
                //                         if (stockItem) {
                //                             item.stock_quantity = stockItem.closing_balance_quantity;
                //                             item.stock_weight = stockItem.closing_balance_weight;
                //                         }
                //                     });
                //                     return productData;
                //                 };
                //                 productData = updateStockQuantities(productData, stockArrayList);

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
                        stock_quantity: item.closing_balance_quantity || 0,
                        stock_weight: item.closing_balance_weight || 0,
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
                setFilteredData(productData)
                await checkIfBomFilterDataIsExist(productData);
            }
        } else {
            setFilteredData([])
        }
        setIsLoading(false)

    }

    const handleCheckbox = (product_id) => {
        $('input:checkbox[name="checkFilteredData"][value="' + product_id + '"]').attr('checked', false);
    }

    const checkIfBomFilterDataIsExist = async () => {
        $('input:checkbox[name="checkFilteredData"]').prop("checked", false);
        const getDataIfExist = JSON.parse(sessionStorage.getItem('filteredMaterialData'))
        if (getDataIfExist !== null && getDataIfExist !== '') {
            const valuesToCheck = getDataIfExist.map(item => item.product_id);
            $('input:checkbox[name="checkFilteredData"]').each(function () {
                if (valuesToCheck.includes($(this).val())) {
                    $(this).prop('checked', true);
                }
            });
            $('#chkAllOptions').prop('checked', $('input:checkbox.option:checked').length == $('input:checkbox.option').length);
        }

    }

    const applyFilterNShowData = () => {
        const requiredCols = JSON.parse(sessionStorage.getItem('requiredCols'));
        const checked = $("input:checkbox[name=checkFilteredData]:checked")

        const selectedProductIds = [];
        let availableBomData = JSON.parse(sessionStorage.getItem('filteredMaterialData')) || [];

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

        sessionStorage.setItem('filteredMaterialData', JSON.stringify(productItemList))
        closeModal();
    }

    function toggleOptionsChkBoxes(key) {
        switch (key) {
            case "checkAll":
                $('.option').prop('checked', $('#chkAllOptions').is(":checked"))
                break;
        }
    }

    $('.option').change(function () {
        $('#chkAllOptions').prop('checked', $('input:checkbox.option:checked').length == $('input:checkbox.option').length);
    });

    const FnaddnewrawMaterial = async (key) => {
        switch (key) {
            case 'newrawmaterial':
                const newTab = window.open('/Masters/Material', '_blank');
                if (newTab) {
                    newTab.focus();
                }

                break;
            default:
                break;
        }
    }

    const renderDetailsTable = useMemo(() => {
        return <Table className="erp_table" bordered striped hover>
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
                            {/* <td className="erp_table_td">{item.stock_quantity}</td>
                            <td className="erp_table_td">{item.stock_weight}</td> */}
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
    }, [data])

    return (
        <>
            <ComboBox ref={comboBox} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span id="spinner_text" className="text-dark">Loading...</span>
                    </div>
                </div> :
                ''}
            <div className="card filter">
                <div className='row'>
                    <div className='col-sm-6 erp_form_col_div'>
                        <div className='row'>
                            <div className='col-sm-3'>
                                <Form.Label className="erp-form-label">Product Type:</Form.Label>
                            </div>
                            <div className='col-sm-4'>
                                <div className="erp-container">
                                    <div className="select-btn" onClick={() => showCheckboxes('erp-checkboxes-pt', 'productTpUl')} >
                                        <span className="form-select form-select-sm" >Select</span>
                                    </div>
                                    <ul className="list-items productTpUl" id="erp-checkboxes-pt">

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 erp_form_col_div">
                        <div className="text-end ">
                            <MDButton type="button" className="erp-gb-button" onClick={() => FnaddnewrawMaterial("newrawmaterial")} variant="button"
                                fontWeight="regular" >New Material</MDButton>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-4 erp_form_col_div'>
                        <div className='row'>
                            <div className='col-sm-2'>
                                <Form.Label className="erp-form-label">Masters:</Form.Label>
                            </div>
                            <div className='col'>
                                <select id="cmb_master_name" className="form-select form-select-sm" onChange={() => masterOnChange()} disabled={isPropsExist ? true : false}>
                                    <option value=""></option>
                                    {cmbMasterOptions?.map((masterVal) => (
                                        // {
                                        masterVal.property_name !== 'smv_product_type' ?
                                            <option value={masterVal.property_name}>{masterVal.property_value}</option>
                                            : null
                                        // }

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
                                <div className="erp-container">
                                    <div className="select-btn" onClick={() => showCheckboxes('erp-checkboxes', 'bomItemsUL')} >
                                        <span className="form-select form-select-sm" >Select</span>
                                    </div>
                                    <ul className="list-items bomItemsUL" id="erp-checkboxes">

                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 erp_form_col_div'>
                        <div className='row'>
                            <div className='col-sm-2'>
                                <Form.Label className="erp-form-label">Selection Criteria:</Form.Label>
                            </div>
                            <div className='col'>
                                <Form.Control as="textarea" id="selctedFilters" rows={1} className="erp_txt_area" readOnly />

                            </div>
                        </div>


                    </div>

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
                                : ""
                        }
                    </div>
                  
                </div>
                <span className={`no-recrds erp-form-label-md ${data.length === 0 ? 'display' : 'd-none'}`} >No records found...</span>
                <div className={`erp_table_scroll ${data.length !== 0 ? 'display' : 'd-none'}`}>
                    {renderDetailsTable}
                </div>

            </div>
            <div className={`text-center ${data.length === 0 ? 'd-none' : 'display'}`} >
                <MDButton className="erp-gb-button ms-2" variant="button" onClick={applyFilterNShowData} fontWeight="regular">
                    Add
                </MDButton>
            </div>
        </>
    )
}
export default ProductListProductTypeWise;