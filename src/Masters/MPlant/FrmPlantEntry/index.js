import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from 'jquery';
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 PRO React components

import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';


// File Imports
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import DepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry";
import { MdRefresh } from "react-icons/md";
import ConfigConstants from "assets/Constants/config-constant";
import { resetGlobalQuery, globalQuery } from "assets/Constants/config-constant";


function FrmPlantEntry(props) {

  const validate = useRef();
  const [plant_id, setPlant_id] = useState(0);
  const [plant_name, setPlant_name] = useState('');
  const [txt_plant_shortname, setPlantShortName] = useState();
  const [plant_area, setPlant_area] = useState('');
  const [plant_production_capacity, setPlant_production_capacity] = useState('');
  const [plant_start_date, setPlant_start_date] = useState('');
  const [plant_head_id, setPlant_head_id] = useState('');
  const [plant_status, setPlant_status] = useState('');
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')


  // UseRefs
  const combobox = useRef();
  const navigate = useNavigate()


  const { state } = useLocation();
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
  const { PlantId = 0, keyForViewUpdate, compType = 'Masters' } = state || {}


  //option Box 
  const [departHeadOption, setDepartHeadOption] = useState([]);

  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  //MODEL
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [modalHeaderName, setHeaderName] = useState('')

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    setShowSuccessMsgModal(false);
    if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
      navigate(`/Masters/FrmPlantlist`)
    }
  }


  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    switch (modalHeaderName) {
      case 'Department Head':

        await FillDepartmentHeads();
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


  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');



  useEffect(async () => {
    await FillDepartmentHeads();
    if (PlantId !== 0) {
      await FnCheckUpdateResponce();
    }
    await ActionType();

  }, [])

  const FillDepartmentHeads = async () => {
    resetGlobalQuery();
    globalQuery.columns = ["field_id", "field_name"];
    globalQuery.table = "cmv_employee"
    globalQuery.conditions.push({ field: "company_id", operator: "=", value: parseInt(COMPANY_ID) });
    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    const getEmployeesApiCall = await combobox.current.removeCatcheFillCombo(globalQuery);
    setDepartHeadOption(getEmployeesApiCall)
  }

  const addRecordInProperty = async (key) => {
    switch (key) {
      case 'PlantHead':
        const plantHeadId = document.getElementById('plantHeadId').value;
        if (plantHeadId === '0') {

          const newTab = window.open('/Masters/Employees', '_blank');
          if (newTab) {
            newTab.focus();
          }
        }
        setPlant_head_id(plantHeadId)
        $('#error_plantHeadId').hide();
        break;

    }
  }






  const addPlant = async () => {
    try {
      const checkIsValidate = await validate.current.validateForm("plantform");
      if (checkIsValidate === true) {
        var active;
        var activeValue = document.querySelector('input[name=isPlantActive]:checked').value
        switch (activeValue) {
          case '0': active = false; break;
          case '1': active = true; break;
        }

        var plantStatus = document.querySelector('input[name=plantStatus]:checked').value
        setPlant_status(plantStatus);
        console.log("plantStatus: ", plantStatus);
        const data = {
          company_branch_id: COMPANY_BRANCH_ID,
          company_id: COMPANY_ID,
          plant_id: plant_id,
          plant_name: plant_name,
          plant_short_name: txt_plant_shortname,
          plant_area: plant_area,
          plant_production_capacity: plant_production_capacity,
          plant_start_date: plant_start_date,
          plant_head_id: plant_head_id,
          plant_status: plantStatus,
          created_by: UserName,
          modified_by: plant_id === 0 ? null : UserName,
          is_active: active
        };
        console.log(data);

        const requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmPlant/FnAddUpdateRecord`, requestOptions)
        const responce = await apicall.json()
        console.log("response error: ", responce.data);
        if (responce.error !== "") {
          console.log("response error: ", responce.error);
          setErrMsg(responce.error)
          setShowErrorMsgModal(true)

        } else {
          console.log("plantId", responce.data);
          const evitCache = combobox.current.evitCache();
          console.log(evitCache);
          setSuccMsg(responce.message)
          setShowSuccessMsgModal(true);
          await FnCheckUpdateResponce();

        }

      }
    } catch (error) {
      console.log("error: ", error);
      navigate('/Error')
    }
  }
  {/* Function for fetch details for view or edit */ }
  const FnCheckUpdateResponce = async () => {
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmPlant/FnShowParticularRecordForUpdate/${PlantId}/${COMPANY_ID}`)
      const updateRes = await apiCall.json();
      const data = updateRes.data
      if (data !== null && data !== "") {
        setPlant_id(PlantId)
        setPlant_name(data.plant_name)
        setPlantShortName(data.plant_short_name)
        setPlant_area(data.plant_area)
        setPlant_production_capacity(data.plant_production_capacity)
        setPlant_start_date(data.plant_start_date)
        setPlant_head_id(data.plant_head_id)

        switch (data.plant_status) {
          case 'Functional':
            document.querySelector('input[name="plantStatus"][value="Functional"]').checked = true;
            break;
          case 'Closed':
            document.querySelector('input[name="plantStatus"][value="Closed"]').checked = true;
            break;
        }

        switch (data.is_active) {
          case true:
            document.querySelector('input[name="isPlantActive"][value="1"]').checked = true;
            break;
          case false:
            document.querySelector('input[name="isPlantActive"][value="0"]').checked = true;
            break;
        }
        sessionStorage.removeItem('PlantName')
        sessionStorage.setItem("PlantName", data.plant_name);

      }

    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }

  }
  const ActionType = async () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modification)');
        setActionLabel('Update')

        $('#plantName').attr('disabled', true);
        $("input[type=radio]").attr('disabled', false);
        $('#btn_save').attr('disabled', false);
        $('#btn_upload_doc').attr('disabled', false)
        break;
      case 'view':
        setActionType('(View)');
        $("input[type=radio]").attr('disabled', true);
        $('#btn_upload_doc').attr('disabled', true)
        await validate.current.readOnly("plantform");
        break;
      default:
        setActionType('(Creation)');
        break;
    }
  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange('plantform')
  }

  {/* test case 8 shivanjali 5/2/24 */ }
  const validateNo = (key) => {
    const numCheck = /^[0-9]*\.?[0-9]*$/;
    const regexNo = /^[0-9]*\.[0-9]{5}$/

    var dot = '.';

    switch (key) {
      case 'Plant_area':
        var Plant_area = $('#plantArea').val();
        if (!regexNo.test(Plant_area) && Plant_area.length <= 14 || Plant_area.indexOf(dot) === 14) {
          if (numCheck.test(Plant_area)) {
            setPlant_area(Plant_area)
          }

        }
        break;
      case 'Plant_production_capacity':
        var Plant_production_capacity = $('#plantProductionCapacity').val();
        if (!regexNo.test(Plant_production_capacity) && Plant_production_capacity.length <= 14 || Plant_production_capacity.indexOf(dot) === 14) {
          if (numCheck.test(Plant_production_capacity)) {
            setPlant_production_capacity(Plant_production_capacity)
          }

        }
        break;
    }
  }


  const displayRecordComponent = () => {
    switch (modalHeaderName) {
      case 'Department':
        return <DepartmentEntry />;

      default:
        return null;
    }
  }



  return (
    <>
      <ComboBox ref={combobox} />
      <FrmValidations ref={validate} />
      <DashboardLayout asModal={props.btn_disabled}>
        <div className='card p-1'>
          <div className='card-header text-center py-0'>
            <label className='erp-form-label-lg main_heding'>Plant Information {actionType}</label>
          </div>
          <form id="plantform">
            <div className="row erp_transporter_div">
              {/* First Collumn */}
              <div className="col-sm-6 erp_form_col_div">
                {/* Plant Name Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Plant Name <span className="required">*</span></Form.Label>
                  </div>
                  {/* test case 3 shivanjali */}
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field" id="plantName" value={plant_name} onChange={e => { setPlant_name(e.target.value); validateFields(); }} maxLength="500" />
                    <MDTypography variant="button" id="error_plantName" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4">
                    {/* test case 1 shivanjali */}
                    <Form.Label className="erp-form-label">Plant Short Name</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      className="erp_input_field text-end"
                      id="txt_plant_shortname"
                      value={txt_plant_shortname}
                      onChange={(e) => {
                        let value = e.target.value;
                        setPlantShortName(value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));}}
                      maxLength="5"
                    />
                    <MDTypography variant="button" id="error_txt_plant_shortname" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                {/* Plant Area Row */}
                <div className="row">
                  <div className="col-sm-4">
                    {/* test case 1 shivanjali */}
                    <Form.Label className="erp-form-label">Plant Area</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field text-end" id="plantArea" value={plant_area} onChange={e => { validateNo('Plant_area'); }} maxLength="19" optional="optional" />
                    <MDTypography variant="button" id="error_plantArea" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                {/* Plant Prodcution Capacity Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Plant Production Capacity</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control type="text" className="erp_input_field text-end" id="plantProductionCapacity" value={plant_production_capacity} onChange={e => { validateNo('Plant_production_capacity'); }} maxLength="19" optional="optional" />
                    <MDTypography variant="button" id="error_plantProductionCapacity" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>


              </div>
              {/* second column */}
              <div className="col-sm-6 erp_form_col_div">
                {/* Plant Start Date Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Plant Start Date <span className="required">*</span></Form.Label>
                  </div>

                  <div className="col">
                    <Form.Control type="date" id="plantStartDate" className="erp_input_field optional" value={plant_start_date} onChange={e => { setPlant_start_date(e.target.value); validateFields() }} />
                    <MDTypography variant="button" id="error_plantStartDate" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>

                {/* Department Head Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Department Head</Form.Label>
                  </div>

                  <div className="col">
                    <select id="plantHeadId" className="form-select form-select-sm" value={plant_head_id} onChange={() => { addRecordInProperty("PlantHead") }} optional="optional">
                      <option value="">Select</option>
                      <option value="0">Add New Record+</option>
                      {departHeadOption.length !== 0 ? (
                        <>
                          {departHeadOption?.map(plantHead => (
                            <option value={plantHead.field_id}>{plantHead.field_name}</option>

                          ))}
                        </>
                      ) : null

                      }
                    </select>
                    <MDTypography variant="button" id="error_plantHeadId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                  {/* <div className="col-sm-1 ">
                    <MdRefresh className="erp-view-btn" onClick={FillDepartmentHeads} style={{ color: 'black' }} />
                  </div> */}

                  <Tooltip title="Refresh" placement="top">
                    <div className="col-sm-1 ">
                      <MdRefresh className={`${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={FillDepartmentHeads} style={{ color: 'black' }} />
                    </div>
                  </Tooltip>
                </div>


                {/* Plant Status Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Plant Status</Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check className="erp_radio_button" label="Functional" type="radio" value="Functional" name="plantStatus" defaultChecked />
                      </div>
                      <div className="sCheck">
                        <Form.Check className="erp_radio_button" label="Closed" value="Closed" type="radio" name="plantStatus" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plant Active Row */}
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Label className="erp-form-label">Is Active</Form.Label>
                  </div>
                  <div className="col">

                    <div className="erp_form_radio">
                      <div className="fCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="Yes"
                          type="radio"
                          value="1"
                          name="isPlantActive"
                          defaultChecked

                        />
                      </div>
                      <div className="sCheck">
                        <Form.Check
                          className="erp_radio_button"
                          label="No"
                          value="0"
                          type="radio"
                          name="isPlantActive"
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
                const path = compType === 'Register' ? '/Masters/FrmPlantlist/reg' : '/Masters/FrmPlantlist';
                navigate(path);
              }}
              variant="button"
              fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
            <MDButton type="submit" onClick={addPlant} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
              fontWeight="regular">{actionLabel}</MDButton>

          </div >
        </div>

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
      </DashboardLayout>
    </>
  )
}

export default FrmPlantEntry
