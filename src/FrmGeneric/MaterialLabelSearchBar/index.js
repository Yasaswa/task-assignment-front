import React from 'react'
import $ from 'jquery';
import { useState, useRef } from "react";

// import icons
import { Form, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

// import files
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from "Features/ComboBox";
import FrmValidations from 'FrmGeneric/FrmValidations';

function MaterialLabelSearchBar(props) {
    const configConstants = ConfigConstants();
    const { COMPANY_ID } = configConstants;
    const { formIdForValidate, requiredCols, companyId = COMPANY_ID, godownId = 0, product_type_id = 0, product_category1_id = 0, product_category2_id = 0, searchBarInputText } = props

    // use refs
    const comboBox = useRef();
    const validate = useRef();
    const typeaheadRef = useRef();

    // const [searchState, setSearchState] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState([])


    // fn for get search results
    const FnSearchOnChange = async (searchText) => {
        try {
            searchBarInputText.current = searchText;
            if (searchText.trim() !== "") {
                const materialSearchObject = {
                    searchInput: searchText,
                    company_id: companyId,
                    godown_id: godownId,
                    product_type_id: product_type_id,
                    product_category1_id: product_category1_id,
                    product_category2_id: product_category2_id,
                }
                const formData = new FormData();
                formData.append(`materialSearchObject`, JSON.stringify(materialSearchObject))
                const requestOptions = { method: 'POST', body: formData };

                const responceOfSearchedData = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/FnShowSearchMaterialItems`, requestOptions);
                const responce = await responceOfSearchedData.json();

                if (responce.success === "0") {
                    setSearchResults([])
                    setOptions([])
                    console.log(responce.error);
                } else {
                    let productData = responce.data
                    if (productData.length > 0) {
                        productData = productData.map(item => {
                            // Create a new object with the updated key name
                            const newItem = {
                                // ...item,
                                product_type_name: item.product_type_name,
                                product_type_short_name: item.product_material_type_short_name,
                                product_id: item.product_material_id,
                                product_code: item.product_material_code,
                                product_name: item.product_material_name,
                                product_category1_name: item.product_material_category1_name,
                                product_category2_name: item.product_material_category2_name,
                                product_unit_name: item.product_material_stock_unit_name,
                                product_type_id: item.product_type_id,
                                product_category1_id: item.product_material_category1_id,
                                product_category2_id: item.product_material_category2_id,
                                product_unit_id: item.product_material_stock_unit_id,
                                product_packing_id: item.product_material_packing_id,
                                product_hsn_sac_code_id: item.product_material_hsn_sac_code_id,
                                product_tech_spect: item.product_material_tech_spect,
                                godown_id: item.godown_id,
                                godown_section_id: item.godown_section_id,
                                godown_section_beans_id: item.godown_section_beans_id,
                                stock_quantity: item.closing_balance_quantity || 0,
                                stock_weight: item.closing_balance_weight || 0,
                                reserve_quantity: item.reserve_quantity || 0,
                                reserve_weight: item.reserve_weight || 0,
                                total_box_weight: item.total_box_weight || 0,
                                total_quantity_in_box: item.total_quantity_in_box || 0,
                                weight_per_box_item: item.weight_per_box_item || 0,
                                cost_center_id: item.cost_center_id,

                            };
                            return newItem;
                        })
                        setSearchResults(productData)
                        console.log('MaterialSearchData: ', productData);
                        // set options data for suggestions
                        let optionsData = productData.map(item => {
                            const optionItem = {
                                name: item.product_code === null || item.product_code === '' ? "" : `[${item.product_code}] ${item.product_name}`,
                                value: item.product_id,
                                product_id: item.product_id
                            };
                            return optionItem;
                        })
                        setOptions(optionsData)
                    } else {
                        console.log('productData else : ', productData);
                        setSearchResults([])
                        setOptions([])

                    }
                }
            } else {
                console.log('productData  : ', searchText);
                setSearchResults([])
                setOptions([])
            }
        } catch (error) {
            console.log("Error On search material: ", error);
        }
    }

    // get matreial data on select
    const selectMaterial = (productId) => {
        let selectedData = [];
        if (productId !== undefined) {
            const tdData = searchResults.find(item => item.product_id === productId)
            if (tdData) {
                const filteredDataRecord = requiredCols.reduce((acc, col) => {
                    acc[col] = tdData.hasOwnProperty(col) ? tdData[col] : 0;
                    return acc;
                }, {});

                selectedData.push(filteredDataRecord);
            }
            if (typeaheadRef.current) {
                typeaheadRef.current.clear();
            }
        }
        console.log("selectedData: ", selectedData);
        // setSearchState("")
        props.getSearchData(selectedData)

    }

    //Fn for check validation befor search and call search func
    const FncheckValidate = async (searchText) => {
        let checkIsValidate = false;
        if (formIdForValidate !== "") {
            checkIsValidate = await validate.current.validateForm(formIdForValidate);
            if (checkIsValidate) {
                if (searchText.trim().length >= 2) {
                    FnSearchOnChange(searchText)
                } else {
                    setSearchResults([])
                    setOptions([])
                }
            }
        } else {
            if (searchText.trim().length >= 2) {
                FnSearchOnChange(searchText)
            } else {
                setSearchResults([])
                setOptions([])
            }
        }
    }

    return (
        <>
            <ComboBox ref={comboBox} />
            <FrmValidations ref={validate} />
            <Form.Group>
                <InputGroup className="mt-1">
                    <Typeahead
                        className="custom-typeahead-class"
                        id="search-input-id"
                        labelKey="name" 
                        placeholder="Search item..."
                        onChange={(selected) => {
                            if (selected.length > 0) {
                                setSelectedOption(selected);
                                selectMaterial(selected[0].product_id);
                            }
                        }}
                        selected={selectedOption}
                        onInputChange={(input) => {
                            FncheckValidate(input);
                        }}
                        onKeyDown={(e) => e.key === 'Backspace' ? (setSelectedOption(prev => prev.slice(0, -1)),searchBarInputText.current="",props.getSearchData([])): null}
                        options={options || []}
                        filterBy={() => true}
                        minLength={2}
                        ref={typeaheadRef}
                    />
                </InputGroup>
            </Form.Group>
        </>
    )
}
export default MaterialLabelSearchBar