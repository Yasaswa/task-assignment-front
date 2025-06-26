import ConfigConstants from "assets/Constants/config-constant";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

const ValidateNumberDateInput = forwardRef((props, ref) => {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { AFTER_DECIMAL_PLACES } = configConstants;

    useImperativeHandle(ref, () => ({
        validateNumber(numberValue) {
            const numericValue = numberValue.replace(/[^0-9]/g, '');
            return numericValue;
        },

        decimalNumber(decimalValue, afterDecimal = AFTER_DECIMAL_PLACES) {
            // let inputText = decimalValue.replace(/[^0-9.-]/g, ''); // Include '-' to allow negative numbers
            // const pattern = `(-?\\d+\\.\\d{0,${afterDecimal}})`; // Allow up to 'afterDecimal' digits after the decimal point
            // const match = inputText.match(new RegExp(pattern));
            // if (match) {
            //     inputText = match[0];
            // }
            // return inputText;
            if (decimalValue === null) { return '';}
                if (decimalValue[decimalValue.length - 1] === '.') {

                    return decimalValue;
                    // If the last character is a point, return the input as it is
                    // console.log(input);
                } else {
                    // If the last character is not a point, round the number to four decimal places
                    // if (decimalValue !== "") {
                    let num = parseFloat(decimalValue);
                    let roundedNum = Math.round(num * (10 ** AFTER_DECIMAL_PLACES)) / (10 ** AFTER_DECIMAL_PLACES);
                    // console.log(roundedNum);
                    if (roundedNum === undefined || roundedNum === null || isNaN(roundedNum)) {
                        roundedNum = '';
                    }
                    return roundedNum;

                }
            
        },


        isInteger(value) {
            return Number.isInteger(Number(value));
        },

        formatDateToDDMMYYYY(inputDate) {
            // Check if the input date is in the 'yyyy-mm-dd' format
            const isYMDFormat = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

            if (isYMDFormat) {
                const parts = inputDate.split('-');
                if (parts.length === 3) {
                    const [year, month, day] = parts;
                    return `${day}-${month}-${year}`;
                }
            }
            else {
                //     // Check if the input date is in the 'dd-mm-yyyy' format
                const isDMYFormat = /^\d{2}-\d{2}-\d{4}$/.test(inputDate);

                if (isDMYFormat) {
                    const parts = inputDate.split('-');
                    if (parts.length === 3) {
                        const [day, month, year] = parts;
                        return `${year}-${month}-${day}`;
                    }
                }
            }
            // If the input format is invalid or doesn't match either, return the original input
            return inputDate;
        },

        percentValidate(inputValue) {
            const percentageRegex = /^(100(\.0{1,2})?|\d{0,2}(\.\d{1,2})?)$/;
            return percentageRegex.test(inputValue);
        },

        validateEmail(email) {
            // Regular expression for a simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

    }))

    return (<></>)
})

export default ValidateNumberDateInput;