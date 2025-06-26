import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from 'react-router-dom';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// React bootstrap Imports
import Form from 'react-bootstrap/Form';
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";

// File Imports
import ComboBox from "Features/ComboBox";
import ConfigConstants from 'assets/Constants/config-constant';
import { validate } from 'uuid';
import FrmValidations from 'FrmGeneric/FrmValidations';

export default function FrmDistrict({ btn_disabled, cityInfo }) {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;

    // get cityInfo 
    const { country, state_val,  key } = cityInfo || ''

    const { state } = useLocation();
    let { distId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    const validate = useRef();
    const [district_id, setCityId] = useState(distId)
    // To navigate 
    const navigate = useNavigate();
    const comboDataAPiCall = useRef();

    // Error Handling
    const [cityErrMsg, setCityErrMsg] = useState('');

    // option Box 
    const [CountryOptions, setCountryOptions] = useState([]);
    const [DistrictOptions, setDistrictOptions] = useState([]);
    const [StateOptions, setStateOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);

    // Add Company Form Fields
    const [masterCity, setMasterCity] = useState('');
    const [cityShortName, setCityShortName] = useState('');
    const [CountryId, setCountryId] = useState(country || '');
    const [StateId, setStateId] = useState(state_val || '');
    const [DistrictId, setDistrictId] = useState('');
    const [cityRegionName, setCityRegionName] = useState('');
    const [cityPincode, setCityPincode] = useState('');

    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MDistrict/FrmDistrictList`)
        }
    }

    useEffect(() => {
        const functionCall = async () => {
            await ActionType()
            await FnFetchPropertyRecords();
            if (distId !== 0) {
                await FnCheckUpdateResponce();
            }
        }
        functionCall();
    }, [])


    const FnFetchPropertyRecords = async () => {
        var controlName = ["cmv_country", "Regions"];
        if (comboDataAPiCall.current) {
            const countryList = await comboDataAPiCall.current.fillMasterData(controlName[0], "", "")
            setCountryOptions(countryList)
            if (StateId !== '' && StateId !== undefined) {
                await fetchCityComboVal('cityCountry')
            }

            if (DistrictId !== '' && DistrictId !== undefined) {
                await fetchCityComboVal('cityState')
                setDistrictId(DistrictId)
            }

            comboDataAPiCall.current.fillComboBox(controlName[1]).then((regionList) => {
                setRegionOptions(regionList)
            })
        }

    }

    const ActionType = async () => {
        if (key === 'Add') {
            keyForViewUpdate = 'Add'
        }
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update')
                $('#masterCity').attr('disabled', true)
                $('#cityShortName').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');
                await validate.current.readOnly("cityFormId");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }

    };


    const addCity = async () => {
        debugger
        try {
            var checkCityIsValidate = await validate.current.validateForm("cityFormId");

            if (checkCityIsValidate === true) {
                const cityData = {
                    company_id: COMPANY_ID,
                    created_by: UserName,
                    modified_by: district_id === 0 ? null : UserName,
                    district_id : keyForViewUpdate === 'Add' ? 0 : distId,
                    district_short_name: cityShortName,
                    country_id: CountryId,
                    state_id: StateId,
                    district_name: DistrictId,
                    district_code: cityPincode
                }
                console.log("city data: ", cityData)
                const forwardingData = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cityData)
                };
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/district/FnAddUpdateRecord`, forwardingData)
                const responce = await apiCall.json()
                const result = responce.data
                console.log("response error: ", result);
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    console.log("city", result);
                    const evitCache = await comboDataAPiCall.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                    // await FnCheckUpdateResponce();

                }
                console.log("responce: ", responce)
            }

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    }

    const validateCityFields = () => {
        validate.current.validateFieldsOnChange('cityMErrMsg')
    }


    const fetchCityComboVal = async (key) => {
        switch (key) {
            case 'cityCountry':
                var countryId = $('#CountryId').val();
                setCountryId(countryId)
                if (countryId !== '') {
                    $('#error_CountryId').hide()
                    var stateList = await comboDataAPiCall.current.fillMasterData("cmv_state", "country_id", countryId)
                    setStateOptions(stateList)
                    setDistrictOptions([])
                } else {
                    setStateOptions([])
                    setStateId('')
                    setDistrictOptions([])
                    setDistrictId('')
                }
                break;

            case 'cityState':
                var StateId = $('#StateId').val();
                setStateId(StateId)
                if (StateId !== '') {
                    $('#error_StateId').hide()
                    var districtList = await comboDataAPiCall.current.fillMasterData("cmv_district", "state_id", StateId)
                    setDistrictOptions(districtList)
                    setDistrictId('')
                } else {
                    setDistrictOptions([])
                    setDistrictId('')
                }
                break;

            case 'cityDistricts':
                var DistrictId = $('#DistrictId').val();
                setDistrictId(DistrictId)
                if (DistrictId !== '') { $('#error_DistrictId').hide() }
                break;

            case 'Region':
                var regionVal = $('#cityRegionId').val();
                setCityRegionName(regionVal)
                if (regionVal !== '') { $('#error_cityRegionId').hide() }
                break;
        }
    }

    const FnCheckUpdateResponce = async () => {
        debugger
        try {
            if (district_id !== "undefined" && district_id !== '' && district_id !== null) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/district/FnShowParticularRecordForUpdate/${district_id}`)
                const updateRes = await apiCall.json();
                console.log(updateRes)

                var stateList = await comboDataAPiCall.current.fillMasterData("cmv_state", "country_id", JSON.stringify(updateRes.data.country_id))
                setStateOptions(stateList)


                setCityShortName(updateRes.data.district_short_name)
                setCountryId(updateRes.data.country_id)
                setStateId(updateRes.data.state_id)
                setDistrictId(updateRes.data.district_name)
                setCityPincode(updateRes.data.district_code)

            }
        } catch (error) {
            console.log('error', error)
            navigate('/Error')
        }
    }

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataAPiCall} />
            <div className='erp_top_Form'>
                <div className='card p-1'>
                    <div className='card-header text-center py-1'>
                        <label className='erp-form-label-lg text-center'>District Information{actionType} </label>
                    </div>
                    <form id='cityFormId'>
                        <div className='row erp_transporter_div'>
                            <div className='col-sm-6 erp_city_form_col'>
                                {/* <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">City Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" className="erp_input_field" id="masterCity" value={masterCity} onChange={e => { setMasterCity(e.target.value); validateCityFields() }} maxLength="255" />
                                        <MDTypography variant="button" id="error_masterCity" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div> */}

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Country<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Select size="sm" id="CountryId" className="form-select form-select-sm" value={CountryId} onChange={() => fetchCityComboVal("cityCountry")}>
                                            <option value="">Select</option>
                                            {CountryOptions?.map(country => (
                                                <option value={country.field_id}>{country.field_name}</option>

                                            ))}

                                        </Form.Select>
                                        <MDTypography variant="button" id="error_CountryId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">State<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Select size="sm" id="StateId" className="form-select form-select-sm" value={StateId} onChange={() => fetchCityComboVal("cityState")}>
                                            <option value="">Select</option>
                                            {StateOptions?.map(city => (
                                                <option value={city.field_id}>{city.field_name}</option>

                                            ))}
                                        </Form.Select>
                                        <MDTypography variant="button" id="error_StateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">District Name<span className="required">*</span></Form.Label>
                                    </div>

                                    <div className='col'>
                                        <Form.Control type="text" className="erp_input_field" id="DistrictId" value={DistrictId} onChange={e => { setDistrictId(e.target.value.toUpperCase()); validateCityFields() }} maxLength="50" />
                                        <MDTypography variant="button" className="erp_validation" id="error_DistrictId" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>

                            </div>

                            <div className='col-sm-6 erp_city_form_col'>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" className="erp_input_field" id="cityShortName" value={cityShortName} onChange={e => { setCityShortName(e.target.value.toUpperCase()); validateCityFields() }} maxLength={4} />
                                        <MDTypography variant="button" id="error_cityShortName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>

                                {/* <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Region</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select size="sm" id="cityRegionId" value={cityRegionName} className="form-select form-select-sm" onChange={e => { fetchCityComboVal('Region'); validateCityFields() }} optional='optional'>
                                            <option value="">Select</option>
                                            {regionOptions?.map(region => (
                                                <option value={region.field_name}>{region.field_name}</option>

                                            ))}

                                        </select>
                                        <MDTypography variant="button" className="erp_validation" id="error_cityRegionId" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div> */}

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">District code<span className="required">*</span></Form.Label>
                                    </div>



                                    <div className='col'>
                                        <Form.Control type="text" className="erp_input_field" id="cityPincode" value={cityPincode} onChange={e => { setCityPincode(e.target.value.toUpperCase()); validateCityFields() }} maxLength="50" />
                                        <MDTypography variant="button" id="error_cityPincode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <Form.Label className="erp-form-label">Is Active<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <div className="erp_form_radio">
                                            <div className="fCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Yes"
                                                    type="radio"
                                                    value="1"
                                                    name="isCityActive"
                                                    defaultChecked

                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isCityActive"
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
                                const path = compType === 'Register' ? '/Masters/MDistrict/FrmDistrictList' : '/Masters/MDistrict/FrmDistrictList';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="button" id="btn_savecity" onClick={addCity} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular">
                            {actionLabel}
                        </MDButton>
                    </div>
                    <div>
                        <MDTypography variant="button" id="cityMErrMsg" className="erp_validation erp_cityerrmsg" fontWeight="regular" color="error" style={{ display: "none" }} >
                            {cityErrMsg}
                        </MDTypography>
                    </div>
                </div>
                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            </div>
        </>
    )
}
