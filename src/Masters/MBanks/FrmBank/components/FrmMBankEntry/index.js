import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from "react-router-dom";
import React, { useLayoutEffect, useMemo } from 'react'

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';

// File Imports
import ComboBox from "Features/ComboBox";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// import react icons
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmBankListEntry from "Masters/MBankList/FrmBankListEntry";
import Tooltip from "@mui/material/Tooltip";
import { MdRefresh } from "react-icons/md";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from "FrmGeneric/FrmValidations";
import { CircularProgress } from "@material-ui/core";
import { Accordion, Table } from "react-bootstrap";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";


function FrmMBankEntry() {
    const accnoRegex = /^[0-9+\(\)#\.\s\/ext-]+$/;
    const regexNo = /^[0-9\b]+$/;

    const [isLoading, setIsLoading] = useState(false);

    const validate = useRef();
    const child = useRef();
    const navigate = useNavigate();
    const validateNumberDateInput = useRef();


    //case no. 1 chnges by ujjwala 10/1/2024 Start
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { bankID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    const AuthorizedPersonCountOption = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
    ]

    // ADD Bank Feilds
    const [bank_id, setBankId] = useState(bankID)
    const [accountType, setAccountType] = useState('');
    const [bankNameId, setBankNameID] = useState('');
    const [bankBranchName, setBankBranchName] = useState('');
    const [bankBranchAddress, setBankBranchAddress] = useState('');
    const [bankBranchEmailId, setBankBranchEmailId] = useState('');
    const [bankBranchContactNo, setBankBranchContactNo] = useState('');
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [bankIfscNo, setBankIfscNo] = useState('');
    const [bankSwiftCode, setBankSwiftCode] = useState('');
    const [bankGstNo, setBankGStNo] = useState('');
    const [currencyType, setCurrencyType] = useState('Rupees');
    const [authorizedPersonCount, setAuthorizedPersonCount] = useState(1);
    const [authorizedPerson, setAuthorizedPerson] = useState([]);
    const [authorizedPerson1, setAuthorizedPerson1] = useState('');
    const [authorizedPerson2, setAuthorizedPerson2] = useState('');
    const [authorizedPerson3, setAuthorizedPerson3] = useState('');
    const [bankGlCodeOption, setBankGlCodeOption] = useState([]);
    const [bankGlCode, setBankGlcode] = useState('Bank Account');
    const [bankAccountsId, setBankAccountsId] = useState('');
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    // bank contacts 
    const [rowCount, setRowCount] = useState(1)
    const [bankContactData, setbankContactData] = useState([])

    // Option Box
    const [currencyTypeOption, setCurrencyTypeOption] = useState([]);
    const [countryCodeOptions, setCountryCodeOptions] = useState([]);
    const [bankAccountTypeOption, setBankAccountTypeOption] = useState([]);
    const [bankNameOptionList, setBankNameOptionList] = useState([]);
    // to add new records in combo box 
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    // const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    // setShowSuccessMsgModal(false);
    // navigate(`/Masters/BankListing`)

    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        navigate(`/Masters/BankListing`)

    }


    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    //case no. 1 chnges by ujjwala 10/1/2024 Start
    useEffect(() => {
        setIsLoading(true);
        const loadDataOnload = async () => {
            try {
                await ActionType();
                await FillComobos();
                if (bankID !== 0) {
                    await FnCheckUpdateResponce()
                }
            } catch (error) {
                console.error(error);
                navigate('/Error')
            } finally {
                setIsLoading(false);
            }
        }
        loadDataOnload()
    }, [])

    //end by ujjwala

    //case no. 1 chnges by ujjwala 10/1/2024 Start
    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':

                setActionType('(Modification)');
                setActionLabel('Update')
                $('#bankNameId').attr('disabled', true)
                $('#bankBranchName').attr('disabled', true)
                $('#bankAccountNo').attr('disabled', true)
                $('#bankIfscNo').attr('disabled', true)
                $('#accountCatId').attr('disabled', true)

                $("input[type=radio][name=isAccountCategoryActive]").attr('disabled', true);


                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("bankform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };
    //end by ujjwala

    const FillComobos = async () => {
        try {
            const controlName = ["BankAccountsType", "fmv_general_ledger", "cmv_employee_summary", "fmv_currency", "cmv_banks_List"];
            if (child.current) {
                child.current.fillComboBox(controlName[0]).then((propertyList1) => {
                    setBankAccountTypeOption(propertyList1)
                })

                child.current.fillMasterData(controlName[1], "", "").then((propertyList2) => {
                    setBankGlCodeOption(propertyList2)
                })

                child.current.fillMasterData(controlName[2], "", "").then((vEmployeeSummary) => {
                    setAuthorizedPerson(vEmployeeSummary)
                })

                child.current.fillMasterData(controlName[3], "", "").then((vCurrencyType) => {
                    setCurrencyTypeOption(vCurrencyType)
                })

                resetGlobalQuery();
                globalQuery.columns = ['field_id', 'field_name'];
                globalQuery.table = "cmv_banks_List"
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: '0' });
                globalQuery.conditions.push({ field: "bank_name", operator: "!=", value: 'CASH' });
                child.current.removeCatcheFillCombo(globalQuery).then((bankList) => {
                    setBankNameOptionList(bankList);
                })
            }

            const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
            const respCountryCode = await apiCallCountryCodeList.json();
            console.log("apiCallCountryCodeList: ", respCountryCode)
            setCountryCodeOptions(respCountryCode)

        } catch (error) {
            console.log('error: ', error.message)
            navigate('/Error')
        }
    }

    const FnAddbank = async () => {
        debugger
        try {
            let active;
            // let accCategory;
            let activeValue;
            // const checkIsValidate = await validate.current.validateForm("bankform");
            const checkIsValidate = await FnValidateForm()


            if (checkIsValidate === true) {
                const json = { 'BankData': {}, 'BContactJsons': [], 'commonIds': { 'company_id': COMPANY_ID, 'company_branch_id': COMPANY_BRANCH_ID, 'bank_id': bank_id } }

                setIsLoading(true)

                // activeValue = document.querySelector('input[name=isAccountCategoryActive]:checked').value
                // switch (activeValue) {
                //     case '1': accCategory = 'O'; break;
                //     case '0': accCategory = 'X'; break;
                //     default: break;
                // }

                activeValue = document.querySelector('input[name=isBankActive]:checked').value
                switch (activeValue) {
                    case '0': active = false; break;
                    case '1': active = true; break;
                    default: break;
                }

                const data = {
                    company_branch_id: COMPANY_BRANCH_ID,
                    company_id: COMPANY_ID,
                    bank_id: bank_id,
                    created_by: UserName,
                    modified_by: bank_id === 0 ? null : UserName,
                    account_type: accountType,
                    account_category: document.querySelector('input[name=isAccountCategoryActive]:checked').value,
                    bank_list_id: bankNameId,
                    bank_name: $('#bankNameId option:selected').text(),
                    bank_branch_name: bankBranchName,
                    bank_branch_address: bankBranchAddress,
                    bank_branch_email_id: bankBranchEmailId,
                    bank_branch_contact_no: bankBranchContactNo,
                    bank_account_no: bankAccountNo,
                    bank_ifsc_code: bankIfscNo,
                    bank_swift_code: bankSwiftCode,
                    bank_gst_no: bankGstNo,
                    currency_type: currencyType,
                    bank_gl_codes: bankGlCode,
                    authorized_person_count: authorizedPersonCount,
                    authorized_person1: authorizedPerson1,
                    authorized_person2: authorizedPerson2,
                    authorized_person3: authorizedPerson3,
                    bank_accounts_id: bankAccountsId,
                    is_active: active,

                };

                json.BankData = data
                json.BContactJsons = bankContactData

                console.log(bankContactData);


                const formData = new FormData()
                formData.append('BankData', JSON.stringify(json))

                const forwardData = {
                    method: 'POST',
                    body: formData,
                }


                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/bank/FnAddUpdateRecord`, forwardData)
                const responce = await apiCall.json();
                console.log("response error: ", responce.data);
                if (responce.success === "0") {
                    console.log("response error: ", responce.error);
                    setIsLoading(false);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    setBankId(responce.data.bank_id);
                    // Backend Catche Evict
                    const evitCache = await child.current.evitCache();
                    console.log(evitCache);

                    setIsLoading(false);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }

        } catch (error) {
            setIsLoading(false);
            console.log("error", error);
            navigate('/Error')
        }
    }


    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/bank/FnShowParticularRecordForUpdate/${bank_id}/${COMPANY_ID}`)
            const responce = await apiCall.json();
            if (responce.data !== null && responce.data !== '') {

                setbankContactData(responce.BankContactData)

                const updateRes = responce.data
                setBankId(updateRes.bank_id)
                setAccountType(updateRes.account_type)
                setBankNameID(updateRes.bank_list_id)
                setBankBranchName(updateRes.bank_branch_name)
                setBankBranchAddress(updateRes.bank_branch_address)
                setBankBranchEmailId(updateRes.bank_branch_email_id)
                setBankBranchContactNo(updateRes.bank_branch_contact_no)
                setBankAccountNo(updateRes.bank_account_no)
                setBankIfscNo(updateRes.bank_ifsc_code)
                setBankSwiftCode(updateRes.bank_swift_code)
                setBankGStNo(updateRes.bank_gst_no)
                setCurrencyType(updateRes.currency_type)
                setBankGlcode(updateRes.bank_gl_codes)
                setBankAccountsId(updateRes.bank_accounts_id)
                setAuthorizedPersonCount(updateRes.authorized_person_count)

                switch (updateRes.authorized_person_count) {
                    case 1:
                        $('#authorizedPerson2').attr('disabled', true);
                        $('#authorizedPerson3').attr('disabled', true);
                        setAuthorizedPerson1(updateRes.authorized_person1)

                    case 2:
                        $('#authorizedPerson3').attr('disabled', true);
                        setAuthorizedPerson1(updateRes.authorized_person1)
                        setAuthorizedPerson2(updateRes.authorized_person2)

                    case 3:
                        setAuthorizedPerson1(updateRes.authorized_person1)
                        setAuthorizedPerson2(updateRes.authorized_person2)
                        setAuthorizedPerson3(updateRes.authorized_person3)

                }

                switch (updateRes.account_category) {
                    case 'O':
                        document.querySelector('input[name="isAccountCategoryActive"][value="1"]').checked = true;
                        break;
                    case 'X':
                        document.querySelector('input[name="isAccountCategoryActive"][value="0"]').checked = true;
                        break;
                    default: break;
                }

                switch (updateRes.is_active) {
                    case true:
                        document.querySelector('input[name="isBankActive"][value="1"]').checked = true;
                        break;
                    case false:
                        document.querySelector('input[name="isBankActive"][value="0"]').checked = true;
                        break;
                    default: break;
                }
            }
        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }


    const validateFields = () => {
        validate.current.validateFieldsOnChange('bankform')
    }

    const validateNo = (noKey) => {
        var accNo = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
        const regexNo = /^[0-9\b]+$/;
        switch (noKey.target.id) {

            case 'bankAccountNo':
                if (noKey.target.value !== '' || accNo.test(noKey.target.value)) {
                    if (noKey.target.value === 'NaN') {
                        setBankAccountNo("")
                    } else {
                        setBankAccountNo(noKey.target.value)
                    }
                }
                break;
            case 'bankBranchContactNo':
                if (noKey.target.value !== '' || regexNo.test(noKey.target.value)) {
                    if (noKey.target.value === 'NaN') {
                        setBankBranchContactNo("")
                    } else {
                        setBankBranchContactNo(noKey.target.value)
                    }
                }
                break;

            default: break;
        }
    }

    const addRecordInProperty = async (key) => {

        switch (key) {

            case 'BankAccountsType':
                var accountTypeSelect = document.getElementById('accountTypeId').value;
                setAccountType(accountTypeSelect)
                if (accountTypeSelect !== "") {
                    $('#error_accountTypeId').hide();
                }
                break;
            case 'cmv_banks_List':
                var bankNameSelect = document.getElementById('bankNameId').value;
                setBankNameID(bankNameSelect)
                if (bankNameSelect !== "") {
                    $('#error_bankNameId').hide();
                }
                break;

            case 'fmv_general_ledger':
                var generalLeadgers = document.getElementById('bankGlCodeId').value;
                setBankGlcode(generalLeadgers)
                if (generalLeadgers !== "") {
                    $('#error_bankGlCodeId').hide();
                }
                if (generalLeadgers === '0') {
                    const newTab = window.open('/Masters/MFMGeneralLedgerEntry', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                break;

            case 'authorized_person1':
                const vEmpSummary = document.getElementById('authorizedPerson1').value;
                setAuthorizedPerson1(vEmpSummary)

                if (vEmpSummary === '0') {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                if (vEmpSummary !== "") {
                    $('#error_authorizedPerson1').hide();
                }
                break;

            case 'authorized_person2':
                const vEmpSummary2 = document.getElementById('authorizedPerson2').value;
                setAuthorizedPerson2(vEmpSummary2)

                if (vEmpSummary2 === '0') {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                if (vEmpSummary2 !== "") {
                    $('#error_authorizedPerson2').hide();
                }
                break;

            case 'authorized_person3':
                const vEmpSummary3 = document.getElementById('authorizedPerson3').value;
                setAuthorizedPerson3(vEmpSummary3)

                if (vEmpSummary3 === '0') {
                    const newTab = window.open('/Masters/Employees', '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }
                if (vEmpSummary3 !== "") {
                    $('#error_authorizedPerson3').hide();
                }
                break;

            case 'fmv_currency':
                var vCurrencyType = document.getElementById('currencyType').value;
                setCurrencyType(vCurrencyType)
                if (vCurrencyType !== "") {
                    $('#error_currencyType').hide();
                }
                break;
            default: break;
        }
    }


    const switchField = () => {
        var fields = document.getElementById("authorizedPersonCount").value;
        setAuthorizedPersonCount(fields)
        console.log(fields);

        // if (fields === '1') {
        //     $('#authorizedPerson1').removeAttr('disabled', true);
        //     setAuthorizedPerson1('');
        //     // $('#authorizedPerson2').attr('disabled', 'disabled');
        //     // $('#authorizedPerson3').attr('disabled', 'disabled');
        //     setAuthorizedPerson2('');
        //     setAuthorizedPerson3('');

        // } else if (fields === '2') {
        //     $('#authorizedPerson1').removeAttr('disabled', 'disabled');
        //     $('#authorizedPerson2').removeAttr('disabled', 'disabled');
        //     setAuthorizedPerson1('');
        //     setAuthorizedPerson2('');
        //     setAuthorizedPerson3('');
        //     $('#authorizedPerson3').attr('disabled', 'disabled');

        // } else if (fields === '3') {
        //     $('#authorizedPerson1').removeAttr('disabled', 'disabled');
        //     $('#authorizedPerson2').removeAttr('disabled', 'disabled');
        //     $('#authorizedPerson3').removeAttr('disabled', 'disabled');
        //     setAuthorizedPerson1('');
        //     setAuthorizedPerson2('');
        //     setAuthorizedPerson3('');
        // }  

    };



    // Show ADd record Modal
    const handleCloseRecModal = async () => {
        switch (modalHeaderName) {
            case 'Bank List':
                await addRecordInProperty("cmv_banks_List");
                break;

            default:
                break;
        }
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").css({ "padding-top": "0px" });
        }, 200)

    }

    const displayRecordComponent = () => {
        switch (modalHeaderName) {

            case 'Bank List':
                return <FrmBankListEntry btn_disabled={true} />;

            default:
                return null;
        }
    }


    const FnRefreshbtn = async (key) => {
        switch (key) {

            case 'authorizedperson1':
                child.current.fillMasterData("cmv_employee_summary", "", "").then((authorizedperson1List) => {
                    setAuthorizedPerson(authorizedperson1List)
                })

                break;

            case 'authorizedperson2':
                child.current.fillMasterData("cmv_employee_summary", "", "").then((authorizedperson2List) => {
                    setAuthorizedPerson(authorizedperson2List)
                })
                break;

            case 'authorizedperson3':
                child.current.fillMasterData("cmv_employee_summary", "", "").then((authorizedperson3List) => {
                    setAuthorizedPerson(authorizedperson3List)
                })

                break;
            default:
                break;
        }

    }

    // ----------------------------------------------------------------------------------------------------------------------------
    //------------------- Bank Contact Functionality --------------------------------------- //
    const FnUpdateBankContactTblRows = (rowData, event) => {
        let eventId = document.getElementById(event.target.id);
        let clickedColName = event.target.getAttribute('Headers');
        let enteredValue = event.target.value;

        switch (clickedColName) {
            case 'bank_contact_person':
                rowData[clickedColName] = enteredValue;
                if (enteredValue !== "")
                    delete document.querySelector('input[id^="bank_contact_person_"]').parentElement.dataset.tip;
                break;
            case 'designation':
            case 'contact_no':
            case 'alternate_contact':
                if (enteredValue !== "") {
                    rowData[clickedColName] = enteredValue;
                    if (enteredValue.length >= 10) {
                        delete eventId.parentElement.dataset.tip;
                    }
                }
                break;

            case 'email_id':
            case 'alternate_EmailId':
                rowData[clickedColName] = enteredValue;
                if (!validateNumberDateInput.current.validateEmail(enteredValue)) {
                    eventId.parentElement.dataset.tip = 'Please enter valid mail...!';
                } else {
                    delete eventId.parentElement.dataset.tip;
                }
                if (event._reactName === 'onBlur' && enteredValue === '') {
                    delete eventId.parentElement.dataset.tip;
                }
                break;
        }

        const bankContactDetails = [...bankContactData]
        const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
        bankContactDetails[arrayIndex] = rowData
        setbankContactData(bankContactDetails);
    }

    const removeFirstRow = (indexToRemove) => {
        if (indexToRemove !== 0) {
            const updatedbankContactData = bankContactData.filter((item, index) => index !== indexToRemove);
            setbankContactData(updatedbankContactData)
        }
        else {
            const updatedbankContactData = [...bankContactData];  // Create a copy of the array
            updatedbankContactData[0] = { ...contactBlankObject }; // Set values of 0th index to the contactBlankObject
            setbankContactData(updatedbankContactData);
        }
    }

    const contactBlankObject = {
        company_id: COMPANY_ID,
        company_branch_id: COMPANY_BRANCH_ID,
        bank_contact_id: 0,
        bank_id: bank_id,
        bank_contact_person: '',
        designation: '',
        contact_no: '',
        email_id: '',
        alternate_contact: '',
        alternate_EmailId: '',
        created_by: UserName,
    }

    useLayoutEffect(() => {
        const getExistingbankContactData = [...bankContactData]
        getExistingbankContactData.push(contactBlankObject)
        setbankContactData(getExistingbankContactData)
    }, [rowCount])


    const setRowCountAndAddRow = () => {
        const lastRowIndex = bankContactData.length - 1;
        const lastRowContactPerson = bankContactData[lastRowIndex].bank_contact_person;
        if (lastRowContactPerson !== "") {
            setRowCount(rowCount + 1);
        } else {
            const tableRows = document.querySelectorAll('#bankContactTbl tbody tr');
            tableRows.forEach(row => {
                const bankContactName = row.querySelector('input[id^="bank_contact_person_"]').value;
                if (bankContactName === "") {
                    row.querySelector('input[id^="bank_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                    row.querySelector('input[id^="bank_contact_person_"]').focus();
                    return;
                } else {
                    delete row.querySelector('input[id^="bank_contact_person_"]').parentElement.dataset.tip;
                }
            }
            )
        }
    };


    const renderbankContactTable = useMemo(() => {
        return <Table id='bankContactTbl' className={`erp_table ${bankContactData.length !== 0 ? 'display' : 'd-none'}`} responsive bordered striped>
            <thead className="erp_table_head">
                <tr>
                    <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
                    <th className="erp_table_th">Contact Person </th>
                    <th className="erp_table_th">Designation </th>
                    <th className="erp_table_th">Contact no </th>
                    <th className="erp_table_th">Alternate Contact </th>
                    <th className="erp_table_th">Email </th>
                    <th className="erp_table_th">Alternate Email </th>
                </tr>
            </thead>
            <tbody>
                {bankContactData.map((item, index) =>
                    <tr rowindex={index} className="sticky-column">
                        <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
                            <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
                            <IoAddCircleOutline className='erp_trAdd_icon' onClick={setRowCountAndAddRow} />
                            {/* <IoAddCircleOutline className='erp_trAdd_icon' onClick={() => setRowCount(rowCount + 1)} /> */}

                        </td>
                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`bank_contact_person_${index}`} value={item.bank_contact_person}
                                            onChange={(e) => { FnUpdateBankContactTblRows(item, e); }} Headers='bank_contact_person' />
                                    </>
                                    : item.bank_contact_person
                            }
                        </td>

                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" className="erp_input_field mb-0"
                                            id={`designation_${index}`} value={item.designation}
                                            onChange={(e) => { FnUpdateBankContactTblRows(item, e); }} Headers='designation' />
                                    </>
                                    : item.designation
                            }
                        </td>

                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" id={`contact_no_${index}`} className="erp_input_field mb-0"
                                            value={item.contact_no} Headers='contact_no' maxLength="10" min="10"
                                            onChange={(e) => {
                                                if (validateNumberDateInput.current.isInteger(e.target.value)) {
                                                    FnUpdateBankContactTblRows(item, e);
                                                }

                                            }} />
                                    </>
                                    : item.contact_no
                            }
                        </td>

                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="text" id={`alternate_contact_${index}`} className="erp_input_field mb-0"
                                            value={item.alternate_contact} Headers='alternate_contact' maxLength="10"
                                            onChange={(e) => {
                                                if (validateNumberDateInput.current.isInteger(e.target.value)) {
                                                    FnUpdateBankContactTblRows(item, e);
                                                }
                                            }} />
                                    </>
                                    : item.alternate_contact
                            }
                        </td>

                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="email" id={`email_id_${index}`} className="erp_input_field mb-0" value={item.email_id} Headers='email_id'
                                            onChange={(e) => { FnUpdateBankContactTblRows(item, e); }} onBlur={(e) => { FnUpdateBankContactTblRows(item, e); }}
                                        />
                                    </>
                                    : item.email_id
                            }
                        </td>

                        <td className='erp_table_td'>
                            {
                                keyForViewUpdate !== 'view'
                                    ? <>
                                        <input type="email" id={`alternate_EmailId_${index}`} className="erp_input_field mb-0"
                                            value={item.alternate_EmailId} Headers='alternate_EmailId'
                                            onChange={(e) => { FnUpdateBankContactTblRows(item, e); }} onBlur={(e) => { FnUpdateBankContactTblRows(item, e); }}
                                        /></>
                                    : item.alternate_EmailId
                            }
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    }, [bankContactData])

    //------------------- Bank Contact Functionality Ends --------------------------------------- //

    const FnValidateForm = async () => {
        const checkIsValidate = await validate.current.validateForm("bankform");
        if (!checkIsValidate) {
            return false;
        }
        let bankContactValid = true;
        const tableRows = document.querySelectorAll('#bankContactTbl tbody tr');
        tableRows.forEach(row => {
            const bankContactName = row.querySelector('input[id^="bank_contact_person_"]').value;
            if (bankContactName === '') {
                row.querySelector('input[id^="bank_contact_person_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                row.querySelector('input[id^="bank_contact_person_"]').focus();
                bankContactValid = false;
                return;
            } else {
                delete row.querySelector('input[id^="bank_contact_person_"]').parentElement.dataset.tip;
            }

            const bankContactNo = row.querySelector('input[id^="contact_no_"]').value;
            if (bankContactNo === "") {
                row.querySelector('input[id^="contact_no_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                row.querySelector('input[id^="contact_no_"]').focus();
                bankContactValid = false;
                return;
            } else if (bankContactNo !== "") {
                if (bankContactNo.length < 10) {
                    row.querySelector('input[id^="contact_no_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
                    row.querySelector('input[id^="contact_no_"]').focus();
                    return bankContactValid = false;
                }
            }


            const bankAlternateContactNo = row.querySelector('input[id^="alternate_contact_"]').value;
            if (bankAlternateContactNo !== "") {
                if (bankAlternateContactNo.length < 10) {
                    row.querySelector('input[id^="alternate_contact_"]').parentElement.dataset.tip = 'Contact number must be at least 10 digits...!';
                    row.querySelector('input[id^="alternate_contact_"]').focus();
                    return bankContactValid = false;
                }
            }

            const emailId = row.querySelector('input[id^="email_id_"]').value;
            if (emailId === '') {
                row.querySelector('input[id^="email_id_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                row.querySelector('input[id^="email_id_"]').focus();
                bankContactValid = false;
                return;
            } else if (emailId !== '') {
                if (!validateNumberDateInput.current.validateEmail(emailId)) {
                    row.querySelector('input[id^="email_id_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                    row.querySelector('input[id^="email_id_"]').focus();
                    return bankContactValid = false;
                }
                // delete row.querySelector('input[id^="email_id_"]').parentElement.dataset.tip;
            }

            const alternateEmail = row.querySelector('input[id^="alternate_EmailId_"]').value;
            if (alternateEmail !== '') {
                if (!validateNumberDateInput.current.validateEmail(alternateEmail)) {
                    row.querySelector('input[id^="alternate_EmailId_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                    row.querySelector('input[id^="alternate_EmailId_"]').focus();
                    return bankContactValid = false;
                } else if (validateNumberDateInput.current.validateEmail(alternateEmail)) {
                    delete row.querySelector('input[id^="alternate_EmailId_"]').parentElement.dataset.tip;
                }
            }
        })

        // if (agentContactData.length === 1 && agentContactData[0].agent_contact_person === '') {
        //   agentContactValid = true;
        // }
        return bankContactValid;

    }
    // ----------------------------------------------------------------------------------------------------------------------------

    return (
        <>
            <ComboBox ref={child} />
            <FrmValidations ref={validate} />
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <div className="erp_top_Form">

                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Bank {actionType}  </label>
                    </div>
                    <div className='row erp_transporter_div'>

                        {isLoading ?
                            <div className="spinner-overlay"  >
                                <div className="spinner-container">
                                    <CircularProgress color="primary" />
                                    <span>Loading...</span>
                                </div>
                            </div> :
                            ''}
                        <form id="bankform">
                            <div className="row">
                                <div className="col-sm-6 erp_form_col_div">

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Account Category : <span className="required">*</span></Form.Label>
                                        </div>

                                        <div className="col">
                                            <div className="erp_form_radio">
                                                <div className="fCheck">
                                                    <Form.Check className="erp_radio_button" label="Own" value="Own" type="radio" name="isAccountCategoryActive" defaultChecked />
                                                </div>
                                                <div className="sCheck">
                                                    <Form.Check
                                                        className="erp_radio_button" label="Others" value="Other" type="radio" name="isAccountCategoryActive" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Account Type : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select size="sm" id="accountTypeId" value={accountType} className="form-select form-select-sm erp_input_field" onChange={() => addRecordInProperty('BankAccountsType')}>
                                                <option value="">Select</option>
                                                {bankAccountTypeOption?.map(bankAcc => (
                                                    <option value={bankAcc.field_name}>{bankAcc.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_accountTypeId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>

                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Bank Name : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <select size="sm" id="bankNameId" value={bankNameId} className="form-select form-select-sm erp_input_field" onChange={() => addRecordInProperty('cmv_banks_List')}>
                                                <option value="">Select</option>
                                                {bankNameOptionList?.map(bankName => (
                                                    <option value={bankName.field_id}>{bankName.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_bankNameId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>


                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Branch Name : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankBranchName" value={bankBranchName} onChange={e => { setBankBranchName(e.target.value); validateFields() }} maxLength="255" />
                                            <MDTypography variant="button" id="error_bankBranchName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Branch Address : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankBranchAddress" value={bankBranchAddress} onChange={e => { setBankBranchAddress(e.target.value); validateFields() }} maxLength="500" />
                                            <MDTypography variant="button" id="error_bankBranchAddress" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Branch Email : </Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="email" className="erp_input_field" id="bankBranchEmailId" value={bankBranchEmailId} onChange={e => { setBankBranchEmailId(e.target.value); validateFields() }} maxLength="50" optional='optional' />
                                            <MDTypography variant="button" id="error_bankBranchEmailId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Branch Contact No : </Form.Label>
                                        </div>
                                        <div className='col'>
                                            <span className='erp_phone' >
                                                <select size="sm" id='phoneCntryId' className='form-select-phone'>
                                                    {countryCodeOptions?.map(option => (
                                                        <option value={option}>{option}</option>

                                                    ))}
                                                </select>
                                                <Form.Control type="text" className="erp_input_field erp_phn_border" id="bankBranchContactNo" value={bankBranchContactNo} onChange={e => {
                                                    if (regexNo.test(e.target.value) || e.target.value === '') { setBankBranchContactNo(e.target.value) }
                                                    validateFields(e)
                                                }} maxLength="10" min="10" optional='optional' />
                                            </span>
                                            <MDTypography variant="button" id="error_bankBranchContactNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Bank Account No : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankAccountNo" value={bankAccountNo} onChange={e => {
                                                if (accnoRegex.test(e.target.value) || e.target.value === '') { setBankAccountNo(e.target.value) }
                                                validateFields(e);
                                            }} maxLength="17" />
                                            <MDTypography variant="button" id="error_bankAccountNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">IFSC No : <span className="required">*</span></Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankIfscNo" value={bankIfscNo} onChange={e => { setBankIfscNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="11" />
                                            <MDTypography variant="button" id="error_bankIfscNo" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Swift Code : </Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankSwiftCode" value={bankSwiftCode} onChange={e => { setBankSwiftCode(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="11" optional='optional' />
                                            <MDTypography variant="button" id="error_bankSwiftCode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>
                                </div>


                                {/* Second column  */}

                                <div className="col-sm-6 erp_form_col_div">
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">GST No : </Form.Label>
                                        </div>
                                        <div className='col'>
                                            <Form.Control type="text" className="erp_input_field" id="bankGstNo" value={bankGstNo} onChange={e => { setBankGStNo(e.target.value.split(' ').join('').toUpperCase()); validateFields() }} maxLength="15" optional='optional' />
                                            <MDTypography variant="button" id="error_bankGstNo" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Currency Type : </Form.Label>
                                        </div>

                                        <div className='col'>
                                            <select size="sm" id="currencyType" value={currencyType} className="form-select form-select-sm" onChange={() => addRecordInProperty('fmv_currency')} optional='optional'>
                                                <option value="">Select</option>
                                                {currencyTypeOption?.map(option => (
                                                    <option value={option.field_name}>{option.field_name}</option>
                                                ))}

                                            </select>
                                            <MDTypography variant="button" id="error_currencyType" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}  >
                                            </MDTypography>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Person Count : </Form.Label>
                                        </div>

                                        <div className='col'>
                                            <Form.Select size="sm" id="authorizedPersonCount" value={authorizedPersonCount} className="form-select form-select-sm" onChange={() => switchField()} optional='optional'>
                                                {/* <option value="">Select</option> */}
                                                {AuthorizedPersonCountOption.map(option => (
                                                    <option value={option.value}>{option.label}</option>
                                                ))}
                                            </Form.Select>
                                            <MDTypography variant="button" id="error_authorizedPersonCount" className="erp_validation error-msg" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                    </div>



                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Authorized Person 1 : {authorizedPersonCount >= 1 && <span className="required">*</span>}</Form.Label>
                                        </div>

                                        <div className='col'>
                                            <select size="sm" id="authorizedPerson1" value={authorizedPerson1} className="form-select form-select-sm" onChange={() => addRecordInProperty('authorized_person1')} optional={authorizedPersonCount >= 1 ? '' : 'optional'}>
                                                <option value="">Select</option>
                                                <option value="0">Add New Record+</option>
                                                {authorizedPerson?.map(authorPerson => (
                                                    <option value={authorPerson.field_name}>{authorPerson.field_name}</option>
                                                ))}

                                            </select>
                                            <MDTypography variant="button" id="error_authorizedPerson1" className="erp_validation error-msg" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                        <div className="col-sm-1 ">
                                            {/* <Tooltip title="Refresh" placement="top">
                                    <MDTypography className="erp-view-btn" >
                                        <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("authorizedperson1")} style={{ color: 'black' }} />
                                    </MDTypography>
                                </Tooltip> */}

                                            <Tooltip title="Refresh" placement="top">
                                                <MDTypography>
                                                    <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("authorizedperson1"); }} style={{ color: 'black' }} />
                                                </MDTypography>
                                            </Tooltip>

                                        </div>

                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label"> Authorized Person 2 : {authorizedPersonCount >= 2 && <span className="required">*</span>}</Form.Label>
                                        </div>

                                        <div className='col'>
                                            <select size="sm" id="authorizedPerson2" value={authorizedPerson2} className="form-select form-select-sm" onChange={() => addRecordInProperty('authorized_person2')} optional={authorizedPersonCount >= 2 ? '' : 'optional'}>
                                                <option value="">Select</option>
                                                <option value="0">Add New Record+</option>
                                                {authorizedPerson?.map(authorPerson => (
                                                    <option value={authorPerson.field_name}>{authorPerson.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_authorizedPerson2" className="erp_validation" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                        <div className="col-sm-1 ">
                                            {/* <Tooltip title="Refresh" placement="top">
                                    <MDTypography className="erp-view-btn" >
                                        <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("authorizedperson2")} style={{ color: 'black' }} />
                                    </MDTypography>
                                </Tooltip> */}

                                            <Tooltip title="Refresh" placement="top">
                                                <MDTypography>
                                                    <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("authorizedperson2"); }} style={{ color: 'black' }} />
                                                </MDTypography>
                                            </Tooltip>

                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Authorized Person 3 : {authorizedPersonCount >= 3 && <span className="required">*</span>} </Form.Label>
                                        </div>

                                        <div className='col'>
                                            <select size="sm" id="authorizedPerson3" value={authorizedPerson3} className="form-select form-select-sm" onChange={() => addRecordInProperty('authorized_person3')} optional={authorizedPersonCount >= 3 ? '' : 'optional'}>
                                                <option value="">Select</option>
                                                <option value="0">Add New Record+</option>

                                                {authorizedPerson?.map(authorPerson => (
                                                    <option value={authorPerson.field_name}>{authorPerson.field_name}</option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_authorizedPerson3" className="erp_validation error-msg" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>
                                        <div className="col-sm-1 ">
                                            {/* <Tooltip title="Refresh" placement="top">
                                    <MDTypography className="erp-view-btn" >
                                        <MdRefresh className="erp-view-btn" onClick={() => FnRefreshbtn("authorizedperson3")} style={{ color: 'black' }} />
                                    </MDTypography>
                                </Tooltip> */}

                                            <Tooltip title="Refresh" placement="top">
                                                <MDTypography>
                                                    <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => { FnRefreshbtn("authorizedperson3"); }} style={{ color: 'black' }} />
                                                </MDTypography>
                                            </Tooltip>
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Bank Gl Code : </Form.Label>
                                        </div>

                                        <div className='col'>
                                            <select size="sm" id="bankGlCodeId" value={bankGlCode} className="form-select form-select-sm" onChange={() => addRecordInProperty('fmv_general_ledger')} optional='optional'>
                                                <option value="">Select</option>
                                                <option value="0">Add New Record+</option>

                                                {bankGlCodeOption?.map(bankGLcodes => (
                                                    <option value={bankGLcodes.field_name}>{bankGLcodes.field_name} </option>
                                                ))}
                                            </select>
                                            <MDTypography variant="button" id="error_bankGlCodeId" className="erp_validation" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <Form.Label className="erp-form-label">Bank Accounts Id : </Form.Label>
                                        </div>

                                        <div className='col'>
                                            <Form.Control as="textarea" rows={1} className="erp_txt_area" id="bankAccountsId" value={bankAccountsId} onChange={e => { setBankAccountsId(e.target.value); validateFields() }} maxlength="255" optional='optional' />
                                            <MDTypography c variant="button" id="error_bankAccountsId" className="erp_validation" fontWeight="regular" color="error" textTransform="capitalize" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Is Active : </Form.Label>
                                        </div>

                                        <div className="col">
                                            <Form>

                                                <div className="erp_form_radio">
                                                    <div className="fCheck">
                                                        <Form.Check
                                                            className="erp_radio_button"
                                                            label="Yes"
                                                            type="radio"
                                                            value="1"
                                                            name="isBankActive"
                                                            defaultChecked


                                                        />
                                                    </div>
                                                    <div className="sCheck">
                                                        <Form.Check
                                                            className="erp_radio_button"
                                                            label="No"
                                                            value="0"
                                                            type="radio"
                                                            name="isBankActive"

                                                        />
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div >

                        </form >

                        <Accordion defaultActiveKey="0" className="mt-3">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="erp-form-label-md">Bank Contact Details</Accordion.Header>
                                <Accordion.Body className="p-0">
                                    <div className="mt-10">
                                        <>
                                            {renderbankContactTable}
                                        </>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>







                        <div className="card-footer py-0 text-center">
                            <MDButton type="button" className="erp-gb-button"
                                onClick={() => {
                                    const path = compType === 'Register' ? '/Masters/BankListing/reg' : '/Masters/BankListing';
                                    navigate(path);
                                }}

                                variant="button"
                                fontWeight="regular">Back</MDButton>
                            <MDButton type="submit" onClick={FnAddbank} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                                fontWeight="regular">{actionLabel}</MDButton>
                        </div>
                    </div >
                </div>
            </div >

            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            {/* Add new Record Popup */}
            <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className='erp_modal_title'>{modalHeaderName}</Modal.Title>
                    <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                </Modal.Header>
                <Modal.Body className='erp_city_modal_body'>
                    {displayRecordComponent()}
                </Modal.Body>
                <Modal.Footer>
                    <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
                        fontWeight="regular">Close</MDButton>

                </Modal.Footer>
            </Modal >



        </>
    )

}

export default FrmMBankEntry
