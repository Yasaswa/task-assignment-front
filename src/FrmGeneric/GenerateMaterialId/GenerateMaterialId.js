import React from 'react'
import { forwardRef, useImperativeHandle } from "react"
import ConfigConstants from "assets/Constants/config-constant"
import { useNavigate } from "react-router-dom";

const GenerateMaterialId = forwardRef((props, ref) => {

    const configConstants = ConfigConstants();
    const { COMPANY_ID } = configConstants;
    const navigate = useNavigate();

    let generatedAutoNo = "0";
    useImperativeHandle(ref, () => ({

        async GenerateCode(tblName, fieldName, conditionsKey = '', productTpVal, product_typeShortName, Length, extraPrefix = "") {
            const data = {
                tblName: tblName,
                fieldName: fieldName,
                Length: Length,
                conditionsKey: { key: conditionsKey, value: productTpVal },
                company_id: COMPANY_ID,
            }
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            const requestOptions = { method: 'POST', body: formData };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/GenerateNo/FnGenerateMaterialId`, requestOptions)
                const resp = await fetchResponse.text();
                console.log("GenerateTAuto Api: ", resp)
                if (product_typeShortName === " ") {
                    generatedAutoNo = extraPrefix + product_typeShortName + resp;
                    return generatedAutoNo;
                }
                else {
                    generatedAutoNo = extraPrefix + product_typeShortName + resp;
                    return generatedAutoNo;
                }
            } catch (error) {
                console.error(error);
                return generatedAutoNo;
                navigate('/Error')
            }
        },
        async GenerateTechnicalSpecName(productTpText, productCat1Text, productCat2Text, productCat3Text, productCat4Text, productCat5Text, productMakeText, productMaterialGradeText, material_code, material_name = "") {
            let techSpecName = "";
            try {
                if (productTpText !== "" || productTpText !== "Select" || productTpText !== "NA") {
                    techSpecName += `${productTpText}`;
                    techSpecName += productCat1Text !== "" && productCat1Text !== "Select" && productCat1Text !== "NA" && productCat1Text !== undefined ? `-${productCat1Text}` : '';
                    techSpecName += productCat2Text !== "" && productCat2Text !== "Select" && productCat2Text !== "NA" ? `-${productCat2Text}` : '';
                    // techSpecName += productCat3Text !== "" && productCat3Text !== "Select" && productCat3Text !== "NA" ? `-${productCat3Text}` : '';
                    // techSpecName += productCat4Text !== "" && productCat4Text !== "Select" && productCat4Text !== "NA" ? `-${productCat4Text}` : '';
                    // techSpecName += productCat5Text !== "" && productCat5Text !== "Select" && productCat5Text !== "NA" ? `-${productCat5Text}` : '';
                    techSpecName += productMakeText !== "" && productMakeText !== "Select" && productMakeText !== "NA" && productMakeText !== undefined ? `-${productMakeText}` : '';
                    techSpecName += productMaterialGradeText !== "" && productMaterialGradeText !== "Select" && productMaterialGradeText !== "NA" && productMaterialGradeText !== undefined ? `-${productMaterialGradeText}` : '';
                    techSpecName += material_code !== "" && material_code !== undefined ? `-${material_code}` : '';
                    techSpecName += material_name !== "" && material_name !== undefined ? `-${material_name}` : '';
                }

                console.log("GenerateText: ", techSpecName);
                return techSpecName;
            } catch (error) {
                console.error(error);
                return techSpecName;
            }

        },
        async generateProductionCode(prodCodeObj) {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(prodCodeObj)
                };
                const generateCodeApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/GenerateNo/FnGenerateTransactionNo`, requestOptions)
                const response = await generateCodeApi.json();
                if (generateCodeApi.status === 200 && response.success === 1) {
                    return response.data.production_code
                } else {
                    return '';
                }

            } catch (error) {
                console.error(error);
                navigate('/Error')
            }
        },
        async GenerateMaterialCode(tblName, fieldName, conditionsKey = '', productTpVal, Length) {
            const data = {
                tblName: tblName,
                fieldName: fieldName,
                Length: Length,
                conditionsKey: { key: conditionsKey, value: productTpVal },
                company_id: COMPANY_ID,
            }
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            const requestOptions = { method: 'POST', body: formData };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/GenerateNo/FnGenerateMaterialId`, requestOptions)
                const resp = await fetchResponse.text();
                console.log("GenerateTAutoIncrement No for Material Code : ", resp)
                generatedAutoNo = resp;
                return generatedAutoNo;
            } catch (error) {
                console.error(error);
                return generatedAutoNo;
                navigate('/Error')
            }
        },

    }))
    return <div> </div>
})

export default GenerateMaterialId
