import { React, forwardRef, useImperativeHandle } from "react"
import ConfigConstants from "assets/Constants/config-constant";

const ComboBox = forwardRef((props, ref) => {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID } = configConstants;

    useImperativeHandle(ref, () => ({
        async fillComboBox(controlName) {
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/properties/FnShowGroupRecord/${controlName}/${COMPANY_ID}`)
                const data = await fetchResponse.json();
                return data;
            } catch (error) {
                console.error(error);
                return [];
            }

        },

        async fillMasterData(viewName, colName, identityValue) {
            const data = {
                viewName: viewName,
                colName: colName,
                identityValue: identityValue
            }
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            const requestOptions = { method: 'POST', body: formData };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/FnShowParticularRecord/${COMPANY_ID}`, requestOptions)
                const responce = await fetchResponse.json();
                if (responce.success === '0') {
                    return [];
                } else {
                    // console.log("comboData: ", responce.data)
                    return responce.data;
                }
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async fillMasterDataWithOperator(viewName, colName, operator, identityValue) {
            const data = {
                viewName: viewName,
                colName: colName,
                operator: operator,
                identityValue: identityValue,
            }
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(data))
            const requestOptions = { method: 'POST', body: formData };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/FnShowParticularRecordByOperator/${COMPANY_ID}`, requestOptions)
                const responce = await fetchResponse.json();
                if (responce.success === '0') {
                    return [];
                } else {
                    // console.log("comboData: ", responce.data)
                    return responce.data;
                }

            } catch (error) {
                console.error(error);
                return [];
            }
        },


        async fillFiltersCombo(json) {
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(json))
            const requestOptions = {
                method: 'POST',
                body: formData
            };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/FnShowRecords`, requestOptions)
                const data = await fetchResponse.json();
                // console.log("comboData: ", data)
                return data;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async removeCatcheFillCombo(json) {
            const formData = new FormData();
            formData.append(`data`, JSON.stringify(json))
            const requestOptions = {
                method: 'POST',
                body: formData
            };
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/FnEvictRecords`, requestOptions)
                const data = await fetchResponse.json();
                // console.log("comboData: ", data)
                return data;
            } catch (error) {
                console.error(error);
                return [];
            }
        },


        async evitCache() {
            const requestOptions = { method: 'POST'};
            try {
                const fetchResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/masterData/EvictCatche`, requestOptions)
                const responce = await fetchResponse.text();
                return responce;
            } catch (error) {
                console.error(error);
                return [];
            }
        }




    }))





    return <div> </div>
})

export default ComboBox;