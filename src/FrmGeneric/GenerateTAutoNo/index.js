import React from 'react'
import { forwardRef, useImperativeHandle } from "react"
import ConfigConstants from "assets/Constants/config-constant"
import { useNavigate } from "react-router-dom";

const GenerateTAutoNo = forwardRef((props, ref) => {
    // For navigate
    const navigate = useNavigate();
    const configConstants = ConfigConstants();
    const { SHORT_FINANCIAL_YEAR, COMPANY_ID, FINANCIAL_SHORT_NAME, SHORT_COMPANY , COMPANY_BRANCH_SHORT_NAME} = configConstants;

    let generatedAutoTransactionNo = "0";
    useImperativeHandle(ref, () => ({

        async generateTAutoNo(tblName, fieldName, productTypeShortName, autoNoShortName, Length, column_name = "", column_value = "" ) {
             
            const data = {
                financialShortYear: FINANCIAL_SHORT_NAME,
                tblName: tblName,
                fieldName: fieldName,
                Length: Length,
                company_id: COMPANY_ID,
                column_value: column_value === "" ? "" : `${column_value}`,
                column_name: column_name,
            }
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            const requestOptions = { method: 'POST', body: formData };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/GenerateNo/FnGenerateAutoTransactionNo`, requestOptions)
                const resp = await fetchResponse.text();
                if (productTypeShortName === "") {
                    // generatedAutoTransactionNo = SHORT_COMPANY + "/"+ COMPANY_BRANCH_SHORT_NAME + "/" + SHORT_FINANCIAL_YEAR + "/" + autoNoShortName + resp;
                    generatedAutoTransactionNo = SHORT_COMPANY + "/" + SHORT_FINANCIAL_YEAR + "/" + autoNoShortName + resp;
                }
                else {
                    // generatedAutoTransactionNo = SHORT_COMPANY + "/" + COMPANY_BRANCH_SHORT_NAME + "/" + SHORT_FINANCIAL_YEAR + "/" + productTypeShortName + "/" + autoNoShortName + resp;
                    generatedAutoTransactionNo = SHORT_COMPANY  + "/" + SHORT_FINANCIAL_YEAR + "/" + productTypeShortName + "/" + autoNoShortName + resp;

                }
                return generatedAutoTransactionNo;
            } catch (error) {
                console.error(error);
                return generatedAutoTransactionNo;
                navigate('/Error')
            }
        }
    }))
    return <div> </div>
})

export default GenerateTAutoNo
