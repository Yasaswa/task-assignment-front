import { React, useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import $ from 'jquery';
import Tooltip from "@mui/material/Tooltip";
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { parseISO, parse } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import DocumentF from "Features/Document";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Accordion } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

// import files
import ComboBox from "Features/ComboBox";
import { resetGlobalQuery, globalQuery } from 'assets/Constants/config-constant';
import FrmCity from 'FrmGeneric/MCity/FrmCity';
import FrmValidations from 'FrmGeneric/FrmValidations';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import ConfigConstants from "assets/Constants/config-constant";
import GenerateMaterialId from "FrmGeneric/GenerateMaterialId/GenerateMaterialId";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmDestinationEntry from "Masters/MDestination/FrmDestinationEntry";
import DepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry";
// import MCostCenterEntry from "Masters/MFMCostCenter/MCostCenterEntry/Index";
import MProfitCenterEntry from "Masters/ProfitCenter/ProfitCenterEntry";
import FrmShiftEntry from "Masters/MShift/FrmShiftEntry"

// Import React icons
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { CircularProgress } from "@mui/material";

// Import for the searchable combo box.
import Select from 'react-select';

import MEmployeePrint from "Masters/MEmployee/MEmployeePrint";
import MEmployeeWorkerPrint from "Masters/MEmployee/MEmployeeWorkerPrint";

import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { Button } from "react-bootstrap";
import { FiPrinter } from "react-icons/fi";

//import District Page
import FrmDistrict from "Masters/MDistrict/FrmDistrict";


export default function FrmMEmployeesEntry(props) {
  // Config Constant
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, EARNING_DEDUCTION_MAPPING_BASE, UserId } = configConstants;

  // Set Default JobType if not selected then set General As JobType by using JobTypeId told by prashant sir; on 30/07/2024
  const defaultJobTypeId = 110;

  const [isLoading, setIsLoading] = useState(false);

  const { state } = useLocation();
  let { keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

  let docGroup = "Emplyoee"


  const validateNumberDateInput = useRef();
  const combobox = useRef();
  const frmValidation = useRef();

  const defaultOptions = [
    { value: '', label: 'Select' },
    { value: '0', label: 'Add New Record +' },
  ];


  //changes by ujjwala on 8/1/2024 case no 1
  // Call ConfigConstants to get the configuration constants
  // For navigate
  const navigate = useNavigate();
  const generateMaterialIdAPiCall = useRef();

  // combobox Option hooks
  const [employeeGroupTypeOptions, setEmployeeGroupTypeOptions] = useState([]);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [employeeStatusOptions, setEmployeeStatusOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [employeeReferenceOptions, setEmployeeReferenceOptions] = useState([]);
  const [salutationOptions, setSalutationOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]);
  const [bloodGroupsOptions, setBloodGroupOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [bankNamesOptions, setBankNameOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState(defaultOptions);
  const [cityOptions, setCityOptions] = useState(defaultOptions);

  // Employee Forms Fields
  // Employment Info Section
  const [employee_id, setEmployee_id] = useState(props.employeeID);

  const [txt_employee_code, setEmployeeCode] = useState('');
  const [txt_old_employee_code, setOldEmployeeCode] = useState('');
  const [txt_employee_machine_code, setEmployeeMachineCode] = useState('');
  const [cmb_employee_group_type, setEmployeeGroupType] = useState('');
  const [cmb_employee_type, setEmployeeType] = useState('');
  const [cmb_employee_status, setEmployeeStatus] = useState('Pending');
  const [cmb_destination_id, setDestionationId] = useState();
  // const [cmb_reference_id, setReferenceId] = useState('NA');
  const [txt_reference_id, setReferenceId] = useState('');
  const [txt_username, setUserName] = useState('');
  const [txt_password, setPassword] = useState('');

  const [txt_prim_account_holder_name, setprim_account_holder_name] = useState('');
  const [txt_sec_account_holder_name, setsec_account_holder_name] = useState('');


  // Personal Info Section
  const [cmb_salutation, setSalutation] = useState('1');
  const [txt_last_name, setLastName] = useState('');
  const [txt_first_name, setFirstName] = useState('');
  const [txt_middle_name, setMiddleName] = useState('');
  const [txt_employee_name, setEmployeeName] = useState('');
  const [dt_date_of_birth, setDateOfBirth] = useState('');
  const [cmb_gender, setGender] = useState('NA');
  const [cmb_religion, setReligion] = useState('NA');
  const [cmb_category_id, setCategoryId] = useState('NA');
  const [cmb_caste_id, setCasteId] = useState('NA');
  const [cmb_blood_group, setBloodGroupId] = useState('');
  const [cmb_marital_status, setMaritalStatus] = useState('');
  const [txt_email_id1, setEmailId1] = useState('');
  const [txt_email_id2, setEmailId2] = useState('');
  const [txt_phone_no, setPhoneNo] = useState('');
  const [txt_cell_no1, setCellNo1] = useState('');
  const [txt_cell_no2, setCellNo2] = useState('');

  const [chk_pmt_add, setPermanentAddressChechBox] = useState(false)

  // employee Qualification states
  const [employeeQualificationData, setemployeeQualificationData] = useState([])
  const [rowCount, setRowCount] = useState(1)

  const [employeeExperienceData, setemployeeExperienceData] = useState([])
  const [experienceRowCount, setexperienceexperienceRowCount] = useState(1)

  //changes by vishal for print

  const [showModal, setShowModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const buttonsRef = useRef(null);
  const promiseResolveRef = useRef(null);
  // const handleShow = () => setShowModal(true);
  const handleCloses = () => setShowModal(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('hindi');

  const handleShow = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setSelectedEmployeeType(employee_type);
    setShowModal(true);
  };
  const handleLanguageChange = (event) => {
    setCurrentLanguage(event.target.value);
  };
  const labels = {
    hindi: {
      language: 'भाषा',
    },
    gujarati: {
      language: 'ભાષા',
    },
  };
  const currentLabels = labels[currentLanguage] || labels.hindi;
  const printInvoice = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
      // buttonsRef.current.focus();
    },
    documentTitle: 'Employee Info Print'
  });

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);


  const handleDateChange = (key, date) => {
    switch (key) {
      case 'DOB':
        const DOB = document.getElementById('dt_date_of_birth').value;
        // if (DOB !== '') {
        $('#error_dt_date_of_birth').hide();
        setDateOfBirth(date);
        validateEmpInfoFields();
        validateDOB(date);
        // }
        break;

      case 'DateJoining':
        const DateJoining = document.getElementById('dt_date_joining')
        if (DateJoining !== '') {
          $('#error_dt_date_joining').hide();
          setDateJoining(date);
          validateEmpWorkProfFields();
        }
        break;

      case 'DateExit':
        const DateExit = document.getElementById('dt_date_exit')
        if (DateExit !== '') {
          $('#error_dt_date_exit').hide();
          setDateExist(date);
          validateEmpWorkProfFields();
        }
        break;

      case 'ContractStartDate':
        const ContractStartDate = document.getElementById('dt_contract_start_date')
        if (ContractStartDate !== '') {
          $('#error_dt_contract_start_date').hide();
          setContractStartDate(date);
          validateEmpWorkProfFields();
        }
        break;

      case 'ContractEndDate':
        const ContractEndDate = document.getElementById('dt_contract_end_date')
        if (ContractEndDate !== '') {
          $('#error_dt_contract_end_date').hide();
          setContractEndDate(date);
          validateEmpWorkProfFields();
        }
        break;

      case 'PFDate':
        const PFDate = document.getElementById('dt_pf_date')
        if (PFDate !== '') {
          $('#error_dt_pf_date').hide();
          setPFDate(date);
          validateEmpWorkProfFields();
        }
        break;

      case 'ESICDate':
        const ESICDate = document.getElementById('dt_esic_date')
        if (ESICDate !== '') {
          $('#error_dt_esic_date').hide();
          setESICDate(date);
          validateEmpSalaryFields();
        }
        break;

      case 'EffectiveDate':
        const EffectiveDate = document.getElementById('effective_date')
        if (EffectiveDate !== '') {
          $('#error_effective_date').hide();
          setEffectiveDate(date);
        }
        break;

      case 'leftdate':
        const leftdate = document.getElementById('dt_leftorSuspended_date')
        if (leftdate !== '') {
          $('#error_dt_leftorSuspended_date').hide();
          setLeftorSuspendedDate(leftdate);
        }
        break;

      case 'father_DOB':
        const fatherDOB = document.getElementById('dt_father_DOB_date')
        if (fatherDOB !== '') {
          $('#error_dt_father_DOB_date').hide();
          setfather_DOB_date(date);
          validateEmpSalaryFields();
        }
        break;

      case 'mother_DOB':
        const motherDOB = document.getElementById('dt_mother_DOB_date')
        if (motherDOB !== '') {
          $('#error_dt_mother_DOB_date').hide();
          setmother_DOB_date(date);
          validateEmpSalaryFields();
        }
        break;

      case 'spouse_DOB':
        const spouseDOB = document.getElementById('dt_spouse_DOB_date')
        if (spouseDOB !== '') {
          $('#error_dt_spouse_DOB_date').hide();
          setspouse_DOB_date(date);
          validateEmpSalaryFields();
        }
        break;

      case 'Son_DOB':
        const SonDOB = document.getElementById('dt_Son_DOB_date')
        if (SonDOB !== '') {
          $('#error_dt_Son_DOB_date').hide();
          setSon_DOB_date(date);
          validateEmpSalaryFields();
        }
        break;

      case 'daughter_DOB':
        const daughterDOB = document.getElementById('dt_daughter_DOB_date')
        if (daughterDOB !== '') {
          $('#error_dt_daughter_DOB_date').hide();
          setdaughter_DOB_date(date);
          validateEmpSalaryFields();
        }
        break;

      default:
        break;
    }
  };

  // fn to farmat date into string
  const formatDate = (date) => {
    if (date !== null && date !== "") {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').reverse().join('-'); // dd-mm-yyyy format
    }
  };


  // Document Form
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const handleCloseDocumentForm = async () => {
    await showDocumentRecords();
    setShowDocumentForm(false)
  };
  const viewDocumentForm = () => {
    if (keyForViewUpdate !== 'view') {
      setShowDocumentForm(true);
    }
  }

  // doc list
  const [docData, setDocumentData] = useState([]);

  // Document Info Section
  const [txt_aadhar_card_no, setAadharCardNo] = useState('');
  const [txt_passport_no, setPassportNo] = useState('');
  const [txt_pan_no, setPanNo] = useState('');
  const [txt_driving_licence, setDrivingLicence] = useState('');
  const [cmb_bank_id_1, setBankId1] = useState('1');
  const [txt_account_no1, setAccountNo1] = useState('');
  const [txt_ifsc_code1, setIFSCCode1] = useState('');
  const [cmb_bank_id_2, setBankId2] = useState('1');
  const [txt_account_no2, setAccountNo2] = useState('');
  const [txt_ifsc_code2, setIFSCCode2] = useState('');
  const [finance_account_no, setFinanceAccountNo] = useState('');

  // Resident Info Section
  const [txt_current_address, setCurrentAddress] = useState('');
  const [txt_current_pincode, setCurrentPincode] = useState('');
  const [txt_permanant_address, setPermanantAddress] = useState('');
  const [txt_permanant_pincode, setPermanantPincode] = useState('');
  const [cmb_country_id, setCountryId] = useState('India');
  const cmb_country_id_ref = useRef()
  const [cmb_state_id, setStateId] = useState('');
  const cmb_state_id_ref = useRef()
  const [cmb_city_id, setCityId] = useState('');
  const cmb_city_id_ref = useRef()
  const [cmb_district_id, setDistrictId] = useState('');
  const cmb_district_id_ref = useRef()
  const [actionType, setActionType] = useState('')
  const [actionLabel, setActionLabel] = useState('Save')
  const [uploadImage, setImage] = useState();
  const [uploadImageFile, setImageFile] = useState();
  const [image_path, setImagePath] = useState(null);

  // family Details 
  const [txt_father_Name, setfather_Name] = useState('');
  const [txt_mother_Name, setmother_Name] = useState('');
  const [txt_spouse_Name, setspouse_Name] = useState('');
  const [txt_Son_Name, setSon_Name] = useState('');
  const [txt_daughter_Name, setdaughter_Name] = useState('');

  const [dt_father_DOB_date, setfather_DOB_date] = useState('');
  const [dt_mother_DOB_date, setmother_DOB_date] = useState('');
  const [dt_spouse_DOB_date, setspouse_DOB_date] = useState('');
  const [dt_Son_DOB_date, setSon_DOB_date] = useState('');
  const [dt_daughter_DOB_date, setdaughter_DOB_date] = useState('');

  //Employee Workprofile ......!!
  // Employee WorkProfile Form Combos Options
  const [departmentGroupOptions, setDepartmentGroupOptions] = useState(defaultOptions);
  const [departmentOptions, setDepartmentOptions] = useState(defaultOptions);
  const [subDepartmentGroupOptions, setSubDepartmentGroupOptions] = useState(defaultOptions);
  const [designationIdOptions, setDesignationOptions] = useState([]);
  const [reportingToOptions, setReportingToOptions] = useState([]);
  const [weeklyOffOptions, setWeeklyOffOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState(defaultOptions);
  const [contractorOptions, setContractorOption] = useState(defaultOptions);
  const [regionOptions, setRegionOptions] = useState([]);
  const [costCenterOptions, setCostCenterOptions] = useState(defaultOptions);
  const [profitCenterOptions, setProfitCenterOptions] = useState(defaultOptions);
  const [jobTypeOpts, setJobTypeOpts] = useState([]);

  // Employee WorkProfile Form Fields
  const [emplWorkPrfileID, setemplWorkPrfileID] = useState(0);
  const [cmb_department_group_id, setDepartmentGroupId] = useState('');
  const cmb_department_group_id_ref = useRef()
  const [cmb_department_id, setDepartmentId] = useState('');
  const cmb_department_id_ref = useRef()
  const [cmb_subdepartment_group_id, setSubDepartmentGroupId] = useState('');
  const cmb_subdepartment_group_id_ref = useRef()
  const [txt_designation, setDesignation] = useState('')
  const [cmb_designation_id, setDesignationId] = useState('');
  const cmb_designation_id_ref = useRef()
  const [cmb_reproting_to_id, setReportingToId] = useState('');
  const cmb_reproting_to_id_ref = useRef()
  const [cmb_job_type_id, setJobTypeId] = useState(defaultJobTypeId);
  const jobTypeComboRef = useRef();
  const [cmb_weeklyoff_id, setWeeklyOffId] = useState('');
  const cmb_weeklyoff_id_ref = useRef()
  const [cmb_shift_id, setShiftId] = useState('');
  const [cmb_current_shift_id, setCurrentShiftId] = useState('');
  const cmb_shift_id_ref = useRef()
  const cmb_current_shift_id_ref = useRef()
  const cmb_bank_id_1_ref = useRef()
  const cmb_bank_id_2_ref = useRef()

  const [dt_date_joining, setDateJoining] = useState('');
  const [dt_date_exit, setDateExist] = useState('');
  const [cmb_contractor_id, setContractorId] = useState('001');
  const cmb_contractor_id_ref = useRef()
  const [dt_contract_start_date, setContractStartDate] = useState('');
  const [dt_contract_end_date, setContractEndDate] = useState('');
  const [cmb_region_id, setRegionId] = useState('1');
  const [cmb_cost_center_id, setCostCenterId] = useState('');
  const cmb_cost_center_id_ref = useRef()
  const [cmb_profit_center_id, setProfitCenterId] = useState('');
  const cmb_profit_center_id_ref = useRef()
  const [bondIsApplicable, setBondIsApplicable] = useState(false);
  const [attendance_exclude_flag, setAttendance_exclude_flag] = useState(false);
  const [txt_current_job, setCurrentJob] = useState('');
  const [residentTypeOption, setResidentTypeOption] = useState([]);
  const [cmb_resident_type, setResidentType] = useState('Resident');

  //Employee Salary Hooks.......
  // combobox Option hooks
  const [salaryBands, setSalaryBands] = useState([]);
  const [salaryGrades, setSalaryGrades] = useState([]);

  // Employment Salary Section Forms Fields]
  const [salaryId, setSalaryId] = useState(0);
  const [cmb_band_id, setBandId] = useState();
  const [cmb_grade_id, setGradeId] = useState();
  const cmb_grade_id_ref = useRef()
  const [txt_ctc, setCTC] = useState('');
  const [txt_salary, setSalary] = useState('');
  const [chk_ot_flag, setOTFlag] = useState(false);
  const [txt_ot_amount, setOTAmmount] = useState('');
  const [chk_gratuity_applicable, setGratuityIsApplicable] = useState(false);

  const [txt_uan_no, setUANNum] = useState('');
  const [chk_esic_flag, setESICIsApplicable] = useState(false);
  const [txt_esic_no, setESICNum] = useState('');
  const [dt_esic_date, setESICDate] = useState('');

  const [chk_pf_flag, setPFIsApplicable] = useState(false);
  const [dt_pf_date, setPFDate] = useState('');
  const [txt_pf_no, setPFnum] = useState('');
  const [ApproveFlag, setApproveFlag] = useState(false);

  const [chk_mlwf_flag, setMLWFIsApplicable] = useState(false);
  const [txt_mlwf_no, setMLWFNum] = useState('');

  //hide and show password 
  const [showPassword, setShowPassword] = useState(false);
  const [dt_leftorSuspended_date, setLeftorSuspendedDate] = useState('');
  const validateNumberPercentInput = useRef();
  const today = new Date().toISOString().split('T')[0];
  const [deductionData, setDeductionData] = useState([]);
  const [earningData, setEarningData] = useState([]);
  const [effective_date, setEffectiveDate] = useState(today);

  const togglePasswordhideandshow = () => {
    setShowPassword(!showPassword);
  };

  //case no. 1 chnges by ujjwala 10/1/2024 Start
  useEffect(() => {
    const loadDataOnload = async () => {
      try {
        setIsLoading(true);
        await FnFillComboBoxes();
        await FnShowEarningAndDeductionRecrd();
      } catch (error) {
        console.error(error);
        navigate('/Error')
      } finally {
        setIsLoading(false);
      }
      await ActionType();
    }
    loadDataOnload()

  }, [])

  //end
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [modalHeaderName, setHeaderName] = useState('')

  //case no. 1 chnges by ujjwala 10/1/2024 Start
  const ActionType = async () => {
    $('#employee_code').attr('readonly', true);
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modify)');
        setActionLabel('Update')
        $('#employee_code').attr('readonly', true)
        // $('#txt_last_name').attr('readonly', true)
        // $('#txt_first_name').attr('readonly', true)
        // $('#txt_middle_name').attr('readonly', true)
        $('#txt_employee_name').attr('readonly', true)
        // $('#cmb_employee_type').prop('disabled', true);
        $('#cmb_employee_group_type').prop('disabled', true);

        // document.getElementById('nxtBtn').disabled = false;
        break;
      case 'view':
        setActionType('(View)');
        await frmValidation.current.readOnly("employeeFormId");
        await frmValidation.current.readOnly("employeeWorkProfFormId");
        await frmValidation.current.readOnly("employeeSalaryInfoFormId");
        $('#permt_add_chechbox').attr('disabled', true);
        $("input[type=radio]").attr('disabled', true);
        break;
      case 'approve':
        setActionType('(Approve)');
        setActionLabel('Approve');
        setApproveFlag(true);
        setEmployeeStatus('Permanent');
        // $('#dt_date_of_birth').attr('disabled', true);
        const activeRadioButton = document.querySelector('input[name="employeeIsActive"][value="1"]');
        if (activeRadioButton) {
          activeRadioButton.checked = true;
          activeRadioButton.disabled = false;
        }
        $("input[type=radio]").attr('disabled', true);
        await frmValidation.current.readOnly("employeeFormId");
        await frmValidation.current.readOnly("employeeWorkProfFormId");
        await frmValidation.current.readOnly("employeeSalaryInfoFormId");
        break;
      default:
        setActionType('(Create)');
        break;
    }
  };

  // Show ADd record Modal
  const handleCloseRecModal = async () => {
    debugger
    switch (modalHeaderName) {
      case 'City':
        if (cmb_district_id !== '' && cmb_district_id !== undefined) {
          combobox.current.fillMasterData("cmv_city", "district_id", cmb_district_id).then((cityList) => {
            const cities = [
              { value: '', label: 'Select', city_pincode: '' },
              { value: '0', label: 'Add New Record +', city_pincode: '' },
              ...cityList.map((city) => ({ ...city, value: city.field_id, label: city.field_name, city_pincode: city.city_pincode })),
            ];
            setCityOptions(cities)
          })

        }
        setShowAddRecModal(false);
        break;

      case 'District':
        if (cmb_state_id !== '' && cmb_state_id !== undefined) {
          combobox.current.fillMasterData("cmv_district", "state_id", cmb_state_id).then((districtList) => {
            const districtOptions = [
              { value: '', label: 'Select' },
              { value: '0', label: 'Add New Record +' },
              ...districtList.map((district) => ({ ...district, value: district.field_id, label: district.field_name })),
            ];
            setDistrictOptions(districtOptions)
          })

        }
        setShowAddRecModal(false);
        break;

      case 'Employee Destination':
        // combobox.current.fillMasterData("cmv_destination", "", "").then((destinationsApiCall) => {
        //   setDestinationOptions(destinationsApiCall);
        // })
        resetGlobalQuery();
        globalQuery.columns.push("field_id");
        globalQuery.columns.push("field_name");
        globalQuery.table = "cmv_destination"
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        combobox.current.fillFiltersCombo(globalQuery).then((destinationsApiCall) => {
          setDestinationOptions(destinationsApiCall);
        })
        break;
      case 'Department':
        await comboBoxesOnChange("DepartmentGroup");
        break;

      case 'Sub Department':
        await comboBoxesOnChange("Department");
        break;

      case 'Contractor Information':
        combobox.current.fillMasterData("cmv_contractor", "", "").then((contractorList) => {
          const contractors = [
            { value: '', label: 'Select' },
            { value: '0', label: 'Add New Record+' },
            { value: '001', label: 'Self' },
            ...contractors.map((contractor) => ({ ...contractor, value: contractor.field_id, label: contractor.field_name, })),
          ];
          setContractorOption(contractors);
        });
        break;

      case 'Designation':
        combobox.current.fillMasterData("cmv_designation", "", "").then((designations) => {
          setDesignationOptions(designations);
        });
        break;

      case 'Shift':
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'start_time', 'end_time']
        globalQuery.table = "cmv_shift"
        globalQuery.conditions = [
          // { field: "company_id", operator: "=", value: COMPANY_ID }, // Commented the company based dependency.
          { field: "is_delete", operator: "=", value: 0 }
        ];
        combobox.current.fillFiltersCombo(globalQuery).then((workingShifts) => {
          const shiftsList = [
            { value: '', label: 'Select' },
            ...workingShifts.map((shifts) => ({
              ...shifts,
              value: shifts.field_id,
              // label: shifts.field_name, 
              label: shifts.field_name + ` [${shifts.start_time} - ${shifts.end_time}]`,   // Without Am/Pm
              // label: shifts.field_name + ` [${convertTo12HourFormatWithAMPM(shifts.start_time)} - ${convertTo12HourFormatWithAMPM(shifts.end_time)}]`,      // With Am/Pm
            })),
          ];
          setShiftOptions(shiftsList);
        });
        // combobox.current.fillMasterData("cmv_shift", "", "").then((workingShifts) => {
        //   setShiftOptions(workingShifts);
        // });
        break;

      case 'Cost Center':
        combobox.current.fillMasterData("fmv_cost_center", "", "").then((constCenterOptions) => {
          const costCenters = [
            { value: '', label: 'Select' },
            { value: '0', label: 'Add New Record+' },
            ...constCenterOptions.map((costCenter) => ({ ...costCenter, value: costCenter.field_id, label: costCenter.field_name, })),
          ];
          setCostCenterOptions(costCenters);
        });
        break;
      case 'Profit Center':
        combobox.current.fillMasterData("fmv_profit_center", "", "").then((profitCenterOptions) => {
          const profitCenters = [
            { value: '', label: 'Select' },
            { value: '0', label: 'Add New Record+' },
            ...profitCenterOptions.map((profitCenter) => ({ ...profitCenter, value: profitCenter.field_id, label: profitCenter.field_name, })),
          ];
          setProfitCenterOptions(profitCenters);
        });
        break;
      default:
        break;
    }
    setShowAddRecModal(false);
    sessionStorage.removeItem('dataAddedByCombo')
    setTimeout(() => { $(".erp_top_Form").css({ "padding-top": "0px" }); }, 200)

  }

  const displayRecordComponent = () => {
    switch (modalHeaderName) {
      case 'City':
        return <FrmCity btn_disabled={true} cityInfo={{ country: cmb_country_id_ref.current.field_id, state_val: cmb_state_id, district: cmb_district_id, key: 'Add' }} />;

      case 'District':
        return <FrmDistrict btn_disabled={true} cityInfo={{ country: cmb_country_id_ref.current.field_id, state_val: cmb_state_id, key: 'Add' }} />;


      case 'Employee Destination':
        return <FrmDestinationEntry btn_disabled={true} />;
      case 'Department':
        return <DepartmentEntry btn_disabled={true} />;
      case 'Sub Department':
        return <DepartmentEntry btn_disabled={true} departmentType="S" />;
      // case 'Cost Center':
      //   return <MCostCenterEntry btn_disabled={true} />;
      case 'Profit Center':
        return <MProfitCenterEntry btn_disabled={true} />;
      case 'Shift':
        return <FrmShiftEntry btn_disabled={true} />

      default:
        return null;
    }
  }

  const usernameRef = useRef();

  const handleCloseErrModal = () => {
    if (errMsg === "User Name is already exist!") {
      setShowErrorMsgModal(false);
      usernameRef.current.focus();
    } else {
      setShowErrorMsgModal(false);
    }
  }

  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => {
    navigate('/Masters/EmployeesListing')
    setShowSuccessMsgModal(false)
  };
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  // Fill the combo boxes from property table.
  const FnFillComboBoxes = async () => {
    // debugger
    try {
      // combobox.current.fillMasterData("cmv_destination", "", "").then((destinationsApiCall) => {
      //   setDestinationOptions(destinationsApiCall);
      // })

      resetGlobalQuery();
      globalQuery.columns.push("field_id");
      globalQuery.columns.push("field_name");
      globalQuery.table = "cmv_destination"
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      combobox.current.fillFiltersCombo(globalQuery).then((destinationsApiCall) => {
        setDestinationOptions(destinationsApiCall);
      })

      const apiCallCountryCodeList = await fetch(`${process.env.REACT_APP_BASE_URL}/api/country/FnFetchCountryCodes`)
      const respCountryCode = await apiCallCountryCodeList.json();
      setCountryCodeOptions(respCountryCode)

      // combobox.current.fillMasterData("cmv_banks_List", "", "").then((bankOptionsApiCall) => {
      //   setBankNameOptions(bankOptionsApiCall);
      // })
      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name',]
      globalQuery.conditions = [

        { field: "is_delete", operator: "=", value: 0 },
      ]
      globalQuery.table = "cmv_banks_List";
      combobox.current.fillFiltersCombo(globalQuery).then((bankOptionsApiCall) => {
        const bankList = [
          { value: '', label: 'Select' },
          ...bankOptionsApiCall.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
        ];
        setBankNameOptions(bankList);
      })

      const countriesApiCall = await combobox.current.fillMasterData("cmv_country", "", "")
      const countries = [
        { value: '', label: 'Select' },
        ...countriesApiCall.map((country) => ({ ...country, value: country.field_name, label: country.field_name, field_id: country.field_id })),
      ];
      setCountryOptions(countries);
      setCountryId('India');
      cmb_country_id_ref.current.value = 'India';
      cmb_country_id_ref.current.field_id = 1
      await comboBoxesOnChange("Country")

      //Employee Salary 
      combobox.current.fillMasterData("cmv_employee_band", "", "").then((employeeBands) => {
        setSalaryBands(employeeBands);
      })

      //Employee Work Profile
      combobox.current.fillComboBox('DepartmentGroup').then((departmentGroups) => {
        const deptGroupToList = [
          { value: '', label: 'Select' },
          ...departmentGroups.map((deptGroup) => ({ ...deptGroup, value: deptGroup.field_id, label: deptGroup.field_name, })),
        ];
        setDepartmentGroupOptions(deptGroupToList);
      })

      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name',]
      globalQuery.conditions = [
        { field: "department_type", operator: "=", value: "M" },
        // { field: "company_id", operator: "=", value: COMPANY_ID }
        { field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] },
        { field: "is_delete", operator: "=", value: 0 },
      ]
      globalQuery.table = "cmv_department";
      combobox.current.fillFiltersCombo(globalQuery).then((deptOptions) => {
        const departmentOptions = [
          { value: '', label: 'Select' },
          { value: '0', label: 'Add New Record+' },
          ...deptOptions.map((department) => ({ ...department, value: department.field_id, label: department.field_name, })),
        ];
        setDepartmentOptions(departmentOptions);
      });

      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name', 'parent_department_id', 'parent_department']
      globalQuery.conditions = [
        { field: "department_type", operator: "=", value: "S" },
        // { field: "company_id", operator: "=", value: COMPANY_ID }
        { field: "company_id", operator: "IN", values: [0, parseInt(COMPANY_ID)] },
        { field: "is_delete", operator: "=", value: 0 },
      ]
      globalQuery.table = "cmv_department";
      combobox.current.fillFiltersCombo(globalQuery).then((deptOptions) => {
        const departmentOptions = [
          { value: '', label: 'Select' },
          { value: '0', label: 'Add New Record+' },
          ...deptOptions.map((department) => ({
            ...department, value: department.field_id, label: department.field_name,
            parent_department_id: department.parent_department_id, parent_department: department.parent_department
          })),
        ];
        setSubDepartmentGroupOptions(departmentOptions);
      });

      resetGlobalQuery();
      globalQuery.columns = ["designation_id", "designation_name"]
      globalQuery.table = "cmv_designation"
      globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      combobox.current.fillFiltersCombo(globalQuery).then((desigantionOptions) => {
        const desigantions = [
          { value: '', label: '' },
          ...desigantionOptions.map((desigantion) => ({ ...desigantion, value: desigantion.designation_id, label: desigantion.designation_name, })),
        ];
        setDesignationOptions(desigantions);
      });

      resetGlobalQuery();
      globalQuery.columns = ["field_id", "field_name"]
      globalQuery.table = "cmv_employee"
      globalQuery.conditions.push({ field: "employee_type", operator: "=", value: "Staff" });
      combobox.current.fillFiltersCombo(globalQuery).then((reportingToOptions) => {
        const reportingToList = [
          { value: '', label: 'Select' },
          // { value: '0', label: 'Add New Record+' },
          ...reportingToOptions.map((reporting) => ({ ...reporting, value: reporting.field_id, label: reporting.field_name, })),
        ];
        setReportingToOptions(reportingToList);
      });

      combobox.current.fillMasterData("hmv_weeklyoff", "", "").then((weeklyoffs) => {
        const weeklyoffList = [
          { value: '', label: 'Select' },
          ...weeklyoffs.map((weeklyOff) => ({ ...weeklyOff, value: weeklyOff.field_id, label: weeklyOff.field_name, })),
        ];
        setWeeklyOffOptions(weeklyoffList);
      })

      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name', 'start_time', 'end_time']
      globalQuery.table = "cmv_shift"
      globalQuery.conditions = [
        // { field: "company_id", operator: "=", value: COMPANY_ID },   // Commented the company based dependency.
        { field: "is_delete", operator: "=", value: 0 }
      ];
      combobox.current.fillFiltersCombo(globalQuery).then((workingShifts) => {
        const shiftsList = [
          { value: '', label: 'Select' },
          ...workingShifts.map((shifts) => ({
            ...shifts,
            value: shifts.field_id,
            // label: shifts.field_name, 
            label: shifts.field_name + ` [${shifts.start_time} - ${shifts.end_time}]`,   // Without Am/Pm
            // label: shifts.field_name + ` [${convertTo12HourFormatWithAMPM(shifts.start_time)} - ${convertTo12HourFormatWithAMPM(shifts.end_time)}]`,      // With Am/Pm
          })),
        ];
        setShiftOptions(shiftsList);
      });

      // combobox.current.fillMasterData("cmv_banks_List", "", "").then((primariBank) => {
      //   const bankList = [
      //     { value: '', label: 'Select' },
      //     ...primariBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
      //   ];
      //   setBankNameOptions(bankList);
      // })

      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name',]
      globalQuery.conditions = [

        { field: "is_delete", operator: "=", value: 0 },
      ]
      globalQuery.table = "cmv_banks_List";
      combobox.current.fillFiltersCombo(globalQuery).then((primariBank) => {
        const bankList = [
          { value: '', label: 'Select' },
          ...primariBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
        ];
        setBankNameOptions(bankList);
      })

      resetGlobalQuery();
      globalQuery.columns = ["field_id", "field_name"]
      globalQuery.table = "cmv_contractor"
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: "0" });
      combobox.current.fillFiltersCombo(globalQuery).then((contractorList) => {
        // combobox.current.fillMasterData("cmv_contractor", "", "").then((contractorList) => {
        const contractors = [
          { value: '', label: 'Select' },
          { value: '0', label: 'Add New Record+' },
          { value: '001', label: 'Self' },
          ...contractorList.map((contractor) => ({ ...contractor, value: contractor.field_id, label: contractor.field_name, })),
        ];
        setContractorOption(contractors);
      })

      combobox.current.fillComboBox("Regions").then((workingRegions) => {
        setRegionOptions(workingRegions);
      })

      combobox.current.fillMasterData("fmv_cost_center", "", "").then((constCenterOptions) => {
        const costCenters = [
          { value: '', label: 'Select' },
          { value: '0', label: 'Add New Record+' },
          ...constCenterOptions.map((costCenter) => ({ ...costCenter, value: costCenter.field_id, label: costCenter.field_name, })),
        ];
        setCostCenterOptions(costCenters);
      })

      // combobox.current.fillMasterData("fmv_profit_center", "", "").then((profitCenterOptions) => {
      //   const profitCenters = [
      //     { value: '', label: 'Select' },
      //     { value: '0', label: 'Add New Record+' },
      //     ...profitCenterOptions.map((profitCenter) => ({ ...profitCenter, value: profitCenter.field_id, label: profitCenter.field_name, })),
      //   ];
      //   setProfitCenterOptions(profitCenters);
      // });

      resetGlobalQuery();
      globalQuery.columns = ["field_id", "field_name"]
      globalQuery.table = "fmv_profit_center"
      globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [parseInt(COMPANY_ID), 0] });
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      combobox.current.fillFiltersCombo(globalQuery).then((profitCenterOptions) => {
        const profitCenters = [
          { value: '', label: 'Select' },
          { value: '0', label: 'Add New Record+' },
          ...profitCenterOptions.map((profitCenter) => ({ ...profitCenter, value: profitCenter.field_id, label: profitCenter.field_name, })),
        ];
        setProfitCenterOptions(profitCenters);

      })


      resetGlobalQuery();
      globalQuery.columns.push("field_id");
      globalQuery.columns.push("field_name");
      globalQuery.columns.push("property_value");
      globalQuery.table = "amv_properties"
      // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'EmployeeTypeGroup' });
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

      combobox.current.fillFiltersCombo(globalQuery).then((employeeGroupTypeList) => {
        setEmployeeGroupTypeOptions(employeeGroupTypeList);
      })

      combobox.current.fillComboBox('EmployeeStatus').then((employeeStatusOptionsApiCall) => {
        setEmployeeStatusOptions(employeeStatusOptionsApiCall);
      })

      combobox.current.fillComboBox('EmployeeReference').then((employeeReferencesApiCall) => {
        setEmployeeReferenceOptions(employeeReferencesApiCall);
      })

      combobox.current.fillComboBox('Salutations').then((salutationsApiCall) => {
        setSalutationOptions(salutationsApiCall)
      })

      combobox.current.fillComboBox('Gender').then((gendersApiCall) => {
        setGenderOptions(gendersApiCall);
      })

      combobox.current.fillComboBox('Religion').then((religionsApiCall) => {
        setReligionOptions(religionsApiCall);
      })

      combobox.current.fillComboBox('EmployeeCategory').then((categoriesApiCall) => {
        setCategoryOptions(categoriesApiCall);

      })

      combobox.current.fillComboBox('EmployeeCaste').then((casteOptionsApiCall) => {
        setCasteOptions(casteOptionsApiCall)
      })

      combobox.current.fillComboBox('BloodGroups').then((bloodGroupsApiCall) => {
        setBloodGroupOptions(bloodGroupsApiCall);
      })

      combobox.current.fillComboBox('MaritalStatus').then((maritalStatusApiCall) => {
        setMaritalStatusOptions(maritalStatusApiCall);
      })

      resetGlobalQuery();
      globalQuery.columns = ['job_type_id', 'job_type_name', 'job_type_short_name', 'job_type_rate'];
      globalQuery.table = "hm_job_type";
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
      // globalQuery.conditions.push({ field: "department_id", operator: "=", value: department_id });
      // globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: sub_department_id });
      combobox.current.fillFiltersCombo(globalQuery).then((jobTypes) => {
        // jobTypes = jobTypes?.map(prop => ({ ...prop, value: prop.job_type_id, label: prop.job_type_name }));
        // setJobTypeOpts(jobTypes);
        const jobTypeOpt = [
          { value: '', label: 'Select' },
          ...jobTypes.map((prop) => ({ ...prop, value: prop.job_type_id, label: `${prop.job_type_name} [${prop.job_type_rate}]` })),
        ];
        setJobTypeOpts(jobTypeOpt);
      })

      resetGlobalQuery();
      globalQuery.columns = ['field_id', 'field_name', 'property_value'];
      globalQuery.table = "amv_properties"
      globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
      globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "Resident Type" });
      const residentType = await combobox.current.removeCatcheFillCombo(globalQuery)
      setResidentTypeOption(residentType)


    } catch (error) {
      console.log("error : ", error)
      navigate('/Error')
    }
  }

  function convertTo12HourFormatWithAMPM(time) {
    let [hours, minutes, seconds] = time.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }

  // Earning And Deduction Section 
  const FnShowEarningAndDeductionRecrd = async () => {
    try {
      const earnHeadDataApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnShowEarningAndDeductionRecords/${(COMPANY_ID)}`)
      const { EarningMappingRecords, DeductionMappingRecords } = await earnHeadDataApiCall.json();

      if (employee_id !== 0) {
        await FnCheckUpdateResponce(EarningMappingRecords, DeductionMappingRecords)
      } else {
        setEarningData(EarningMappingRecords)
        setDeductionData(DeductionMappingRecords)
      }
    } catch (error) {
      console.log("error: ", error)
      navigate('/Error')
    }
  }


  const FnCheckUpdateResponce = async (earningHeadData, deductionHeadData) => {
    debugger
    try {
      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/FnShowSalaryAndWorkProfileRecords/${employee_id}`)
      const apiResponse = await apiCall.json();
      let employee_master_data = apiResponse.EmployeeMasterRecords;
      let employee_workprofile_data = apiResponse.EmployeeWorkprofileRecords;
      let employee_salary_data = apiResponse.EmployeeSalaryRecords;
      let employee_earnings_data = apiResponse.EarningMappingRecords
      let employee_deductions_data = apiResponse.DeductionMappingRecords

      if (apiResponse.EmployeesQualificationDetails.length === 0) {
        const updatedempeduactionData = [...employeeQualificationData];  // Create a copy of the array
        updatedempeduactionData[0] = { ...educationBlankObject }; // Set values of 0th index to the contactBlankObject
        setemployeeQualificationData(updatedempeduactionData);
      } else {
        setemployeeQualificationData(apiResponse.EmployeesQualificationDetails)
      }

      if (apiResponse.EmployeeExperiencedetails.length === 0) {
        const updatedEmpExeperienceData = [...employeeExperienceData];  // Create a copy of the array
        updatedEmpExeperienceData[0] = { ...experienceBlankObject }; // Set values of 0th index to the contactBlankObject
        setemployeeExperienceData(updatedEmpExeperienceData);
      } else {
        setemployeeExperienceData(apiResponse.EmployeeExperiencedetails)
      }



      //Setting employee master data
      setEmployee_id(employee_master_data.employee_id);
      if (employee_master_data.encodedImage !== null) {
        setImage(`data:image/jpeg;base64,${employee_master_data.encodedImage}`)
        setImagePath(employee_master_data.image_path)
      }
      setEmployeeGroupType(employee_master_data.employee_type_group);
      await comboBoxesOnChange('Employee_group');
      setEmployeeType(employee_master_data.employee_type);
      await comboBoxesOnChange('Employee_type');
      setEmployeeCode(employee_master_data.employee_code);
      setOldEmployeeCode(employee_master_data.old_employee_code);
      setEmployeeMachineCode(employee_master_data.machine_employee_code);
      setEmployeeStatus(employee_master_data.employee_status);
      setDestionationId(employee_master_data.destination_id);
      setReferenceId(employee_master_data.reference);
      setAadharCardNo(employee_master_data.aadhar_card_no);
      setPanNo(employee_master_data.pan_no);
      setPassportNo(employee_master_data.passport_no);
      setDrivingLicence(employee_master_data.driving_licence);

      cmb_bank_id_1_ref.current.field_id = parseInt(employee_master_data.bank_id1)
      cmb_bank_id_1_ref.current.field_name = employee_master_data.bank_name1
      setBankId1(parseInt(employee_master_data.bank_id1));
      cmb_bank_id_2_ref.current.field_id = parseInt(employee_master_data.bank_id2)
      cmb_bank_id_2_ref.current.field_name = employee_master_data.bank_name2
      setBankId2(parseInt(employee_master_data.bank_id2));
      setAccountNo1(employee_master_data.account_no1);
      setIFSCCode1(employee_master_data.ifsc_code1);

      setprim_account_holder_name(employee_master_data.account_name1);
      setsec_account_holder_name(employee_master_data.account_name2);

      setAccountNo2(employee_master_data.account_no2);
      setIFSCCode2(employee_master_data.ifsc_code2);
      setFinanceAccountNo(employee_master_data.finance_account_no);
      setSalutation(employee_master_data.salutation);
      setLastName(employee_master_data.last_name);
      setFirstName(employee_master_data.first_name);
      setMiddleName(employee_master_data.middle_name);
      setEmployeeName(employee_master_data.employee_name);
      setLeftorSuspendedDate(employee_master_data.left_suspended_date);
      // setDateOfBirth(parseISO(employee_master_data.date_of_birth));
      setGender(employee_master_data.gender);
      setReligion(employee_master_data.religion);
      setCategoryId(employee_master_data.employee_category);
      setCasteId(employee_master_data.employee_caste);
      setBloodGroupId(employee_master_data.blood_group);
      setMaritalStatus(employee_master_data.marital_status);
      setEmailId1(employee_master_data.email_id1);
      setEmailId2(employee_master_data.email_id2);
      setPhoneNo(employee_master_data.phone_no);
      setCellNo1(employee_master_data.cell_no1);
      setCellNo2(employee_master_data.cell_no2);

      setfather_Name(employee_master_data.father_name);
      setmother_Name(employee_master_data.mother_name);
      setspouse_Name(employee_master_data.spouse_name);
      setSon_Name(employee_master_data.son_name);
      setdaughter_Name(employee_master_data.daughter_name);
      // Set father's date of birth if it's not null or empty
      if (employee_master_data.father_dob) {
        setfather_DOB_date(parseISO(employee_master_data.father_dob));
      }

      // Set mother's date of birth if it's not null or empty
      if (employee_master_data.mother_dob) {
        setmother_DOB_date(parseISO(employee_master_data.mother_dob));
      }

      // Set spouse's date of birth if it's not null or empty
      if (employee_master_data.spouse_dob) {
        setspouse_DOB_date(parseISO(employee_master_data.spouse_dob));
      }

      // Set son's date of birth if it's not null or empty
      if (employee_master_data.son_dob) {
        setSon_DOB_date(parseISO(employee_master_data.son_dob));
      }

      // Set daughter's date of birth if it's not null or empty
      if (employee_master_data.daughter_dob) {
        setdaughter_DOB_date(parseISO(employee_master_data.daughter_dob));
      }

      setCurrentAddress(employee_master_data.current_address);
      setCurrentPincode(employee_master_data.current_pincode);
      if (employee_master_data.current_address === employee_master_data.permanant_address) {
        setPermanentAddressChechBox(true)
      }
      setPermanantAddress(employee_master_data.permanant_address);
      setPermanantPincode(employee_master_data.permanant_pincode);
      cmb_country_id_ref.current.value = employee_master_data.country
      cmb_country_id_ref.current.field_name = employee_master_data.country
      await comboBoxesOnChange("Country")
      setCountryId(employee_master_data.country);
      setStateId(employee_master_data.state_id);
      if (cmb_state_id_ref.current) {
        cmb_state_id_ref.current.value = employee_master_data.state_id;
      }
      await comboBoxesOnChange("State");

      setDistrictId(employee_master_data.district_id);
      if (cmb_district_id_ref.current) {
        cmb_district_id_ref.current.value = employee_master_data.district_id;
      }

      await comboBoxesOnChange("District");
      setCityId(employee_master_data.city_id);
      if (cmb_city_id_ref.current) {
        cmb_city_id_ref.current.value = employee_master_data.city_id
      }

      setUserName(employee_master_data.username);
      setPassword(employee_master_data.password);

      switch (employee_master_data.is_active) {
        case true:
          document.querySelector('input[name="employeeIsActive"][value="1"]').checked = true;
          break;
        case false:
          document.querySelector('input[name="employeeIsActive"][value="0"]').checked = true;
          break;
      }

      //Setting employee workprofile data
      setDepartmentGroupId(employee_workprofile_data.department_group_id);
      if (cmb_department_group_id_ref.current) {
        cmb_department_group_id_ref.current.value = employee_workprofile_data.department_group_id
        cmb_department_group_id_ref.current.field_name = employee_master_data.department_group
      }

      setDepartmentId(employee_master_data.department_id);
      cmb_department_id_ref.current.field_id = employee_master_data.department_id
      cmb_department_id_ref.current.field_name = employee_master_data.department_name

      // await comboBoxesOnChange("Department");
      setemplWorkPrfileID(employee_workprofile_data.employee_workprofile_id);
      setSubDepartmentGroupId(employee_workprofile_data.sub_department_id);
      if (cmb_subdepartment_group_id_ref.current) {
        cmb_subdepartment_group_id_ref.current.value = employee_workprofile_data.sub_department_id
      }

      FnGetJobTypes(employee_master_data.department_id, employee_workprofile_data.sub_department_id);

      setDesignationId(employee_workprofile_data.designation_id);
      setDesignation(employee_master_data.designation_name)
      setReportingToId(employee_workprofile_data.reporting_to);
      setAttendance_exclude_flag(employee_workprofile_data.attendance_exclude_flag);

      setJobTypeId(employee_workprofile_data.job_type_id);
      jobTypeComboRef.current = {
        job_type_id: employee_workprofile_data.job_type_id,
        job_type_short_name: employee_workprofile_data.job_type_short_name,
      }
      // await comboBoxesOnChange("resident_type") 
      setResidentType(employee_workprofile_data.resident_type);
      setWeeklyOffId(employee_workprofile_data.weeklyoff);
      setShiftId(employee_workprofile_data.shift_id);
      setCurrentShiftId(employee_workprofile_data.current_shift_id);
      // setDateJoining(parseISO(employee_workprofile_data.date_joining));
      setDateExist(employee_workprofile_data.date_exit);
      setContractorId(employee_workprofile_data.contractor_id);
      // setContractStartDate(parseISO(employee_workprofile_data.contract_startdate));
      // setContractEndDate(parseISO(employee_workprofile_data.contract_enddate));
      setRegionId(employee_workprofile_data.region_id);
      setCostCenterId(employee_workprofile_data.cost_center_id);
      setProfitCenterId(employee_master_data.profit_center_id)
      setBondIsApplicable(employee_workprofile_data.bond_applicable);
      setCurrentJob(employee_workprofile_data.current_job);

      //Setting employee salary data.........
      if (employee_salary_data !== null) {
        setSalaryId(employee_salary_data.employee_salary_id);
        setBandId(employee_salary_data.band_id);
        setGradeId(employee_salary_data.grade_id);
        if (cmb_grade_id_ref.current) {
          // cmb_grade_id_ref.current.value = employee_salary_data.grade_id
          if (salaryGrades.length > 2) {
            cmb_grade_id_ref.current = salaryGrades.find(option => option.value === employee_salary_data.grade_id) || null;
          } else {
            resetGlobalQuery();
            globalQuery.columns = ['employee_grade_id as field_id', 'employee_grade_name as field_name', 'short_name', 'employee_grade_id'];
            globalQuery.table = "cm_employee_grade";
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "employee_grade_id", operator: "=", value: employee_salary_data.grade_id });
            let employeeGrades = await combobox.current.fillFiltersCombo(globalQuery);
            if (employeeGrades.length > 0) {
              employeeGrades[0].value = employeeGrades[0].field_id
              employeeGrades[0].label = employeeGrades[0].field_name
              cmb_grade_id_ref.current.value = employeeGrades[0].field_id;
              cmb_grade_id_ref.current.label = employeeGrades[0].field_name;
              cmb_grade_id_ref.current.short_name = employeeGrades[0].short_name;
            } else {
              cmb_grade_id_ref.current.value = employee_salary_data.grade_id
            }
          }
        }
        setCTC(employee_salary_data.ctc);
        setSalary(employee_salary_data.salary);
        setOTFlag(employee_salary_data.ot_flag);
        setOTAmmount(employee_salary_data.ot_amount);
        setGratuityIsApplicable(employee_salary_data.gratuity_applicable);
        setPFIsApplicable(employee_salary_data.pf_flag);
        setPFnum(employee_salary_data.pf_no);
        setUANNum(employee_salary_data.uan_no);
        setPFDate(employee_salary_data.pf_date);
        setESICIsApplicable(employee_salary_data.esic_flag);
        setESICNum(employee_salary_data.esic_no);
        // setESICDate(parseISO(employee_salary_data.esic_date));
        setMLWFIsApplicable(employee_salary_data.mlwf_flag);
        setMLWFNum(employee_salary_data.mlwf_no);

        // Setting employee master data

        // Set date of birth if it's not null or empty
        if (employee_master_data.date_of_birth) {
          setDateOfBirth(parseISO(employee_master_data.date_of_birth));
        }

        // Set date of joining if it's not null or empty
        if (employee_workprofile_data.date_joining) {
          setDateJoining(parseISO(employee_workprofile_data.date_joining));
        }

        // Set contract start date if it's not null or empty
        if (employee_workprofile_data.contract_startdate) {
          setContractStartDate(parseISO(employee_workprofile_data.contract_startdate));
        }

        // Set contract end date if it's not null or empty
        if (employee_workprofile_data.contract_enddate) {
          setContractEndDate(parseISO(employee_workprofile_data.contract_enddate));
        }

      }
      // Now Enable the Next tab button;
      // document.getElementById('nxtBtn').disabled = false;

      updateEarningRecords(earningHeadData, employee_earnings_data)
      updateDeductionRecords(deductionHeadData, employee_deductions_data)
    } catch (error) {
      console.log("error", error)
      navigate('/Error')
    }
  }

  const designationCheck = async (designation) => {
    if (designation === '' || designation === null || designation === undefined) {
      setDesignationId(0);
      return '';
    }

    resetGlobalQuery();
    globalQuery.columns.push("designation_id");
    globalQuery.table = "cmv_designation"
    globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
    globalQuery.conditions.push({ field: "designation_name", operator: "=", value: designation });
    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    const designationCheckApiCall = await combobox.current.fillFiltersCombo(globalQuery)

    // // **************** If designation is not available then save it ******************
    if (designationCheckApiCall.length === 0) {
      const data = {
        company_id: COMPANY_ID,
        designation_id: 0,
        created_by: UserName,
        designation_name: designation,
        short_name: designation,
        employee_type: cmb_employee_type,
        is_active: true,
      };
      const method = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
      const saveDesignationApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnAddUpdateRecord`, method);
      const responce = await saveDesignationApiCall.json();
      if (responce.success === "1") {
        resetGlobalQuery();
        globalQuery.columns = ["designation_id", "designation_name"]
        globalQuery.table = "cmv_designation"
        globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        const designationCheckApiCall = await combobox.current.fillFiltersCombo(globalQuery)
        const desigantions = [
          { value: '', label: '' },
          ...designationCheckApiCall?.map((desigantion) => ({ ...desigantion, value: desigantion.designation_id, label: desigantion.designation_name, })),
        ];
        setDesignationOptions(desigantions);
        setDesignationId(responce.data.designation_id);
        setDesignation(responce.data.designation_name);
      }
    } else {
      setDesignationId(designationCheckApiCall.length !== 0 ? designationCheckApiCall[0].designation_id : 0);
    }
  }

  // Function to construct the designation string conditionally
  const getDesignation = (shortname, department_Selected) => {
    const shortnamePart = shortname ? shortname : '';
    const departmentPart = department_Selected ? ` - ${department_Selected}` : '';
    return [shortnamePart, departmentPart].filter(Boolean).join(' ');
  };


  // Fill the combo boxes from property table.
  const comboBoxesOnChange = async (key) => {
    try {
      switch (key) {
        case 'Employee_group':
          var selectElement = document.getElementById('cmb_employee_group_type');
          var selectedOption = selectElement.options[selectElement.selectedIndex];
          var propertyValue = selectedOption.getAttribute('property_value');
          setEmployeeGroupType(selectElement.value)
          if (selectElement.value !== '') {
            $('#error_cmb_employee_group_type').hide();
            // Shift options
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'start_time', 'end_time']
            globalQuery.table = "cmv_shift"
            globalQuery.conditions = [
              { field: "employee_type_group", operator: "=", value: selectElement.value }, // Commented the company based dependency.
              { field: "is_delete", operator: "=", value: 0 }
            ];
            combobox.current.fillFiltersCombo(globalQuery).then((workingShifts) => {
              const shiftsList = [
                { value: '', label: 'Select' },
                ...workingShifts.map((shifts) => ({
                  ...shifts,
                  value: shifts.field_id,
                  label: shifts.field_name + ` [${shifts.start_time} - ${shifts.end_time}]`,   // Without Am/Pm
                })),
              ];
              setShiftOptions(shiftsList);
            });

            resetGlobalQuery();
            globalQuery.columns.push("field_id");
            globalQuery.columns.push("field_name");
            globalQuery.columns.push("property_value");
            globalQuery.table = "amv_properties"
            // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "property_group", operator: "=", value: propertyValue });
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'EmployeeType' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });

            const employeeGroupTypeResponse = await combobox.current.fillFiltersCombo(globalQuery)
            setEmployeeTypeOptions(employeeGroupTypeResponse)
            setEmployeeType('')

            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'short_name', 'employee_grade_id'];
            globalQuery.table = "cmv_employee_grade";
            // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "employee_group_type", operator: "=", value: selectElement.value });
            let employeeGrades = await combobox.current.fillFiltersCombo(globalQuery);
            const grades = [
              { value: '', label: 'Select' },
              { value: '0', label: 'Add New Record+' },
              ...employeeGrades.map((grade) => ({ ...grade, value: grade.field_id, label: grade.field_name })),
            ];
            if (grades.length === 2 && cmb_grade_id_ref.current) {
              cmb_grade_id_ref.current = ''
            }
            setSalaryGrades(grades);
            await comboBoxesOnChange('cmb_grade_id')
          } else {
            setEmployeeTypeOptions([]);
            setEmployeeType();
          }
          setEmployeeCode('')
          setEmployeeMachineCode('')
          break;

        case 'Employee_type':
          var empTypeElement = document.getElementById('cmb_employee_type');
          var empTypeSelectedOption = empTypeElement.options[empTypeElement.selectedIndex];
          var empTypePropertyValue = empTypeSelectedOption.getAttribute('property_value');
          setEmployeeType(empTypeElement.value)

          if (empTypeElement.value !== '') {
            if (employee_id === 0 || employee_id === undefined || employee_id === null) {
              await FnGenerateEmployeeCode(empTypeSelectedOption.text, empTypePropertyValue);
            }
          } else {
            setEmployeeCode('')
            setEmployeeMachineCode('')
          }

          break;
        case 'resident_type':
          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name', 'property_value'];
          globalQuery.table = "amv_properties"
          globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
          globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: "Resident Type" });
          const residentType = await combobox.current.removeCatcheFillCombo(globalQuery)
          setResidentTypeOption(residentType)

          break;

        case 'Country':
          const getCountryId = cmb_country_id_ref.current.value || '';
          if (getCountryId !== '') {
            $('#error_cmb_country_id').hide();
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name']
            globalQuery.table = "cmv_state"
            globalQuery.conditions.push({ field: "country_name", operator: "=", value: getCountryId });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            const stateList = await combobox.current.fillFiltersCombo(globalQuery)
            const states = [
              { value: '', label: 'Select' },
              ...stateList.map((state) => ({ ...state, value: state.field_id, label: state.field_name })),
            ];
            setStateOptions(states)
            setStateId('')
            setDistrictOptions([])
            setCityOptions(defaultOptions)
            setDistrictId('')
            setCityId('')
            if (cmb_state_id_ref.current) cmb_state_id_ref.current.value = '';
            if (cmb_district_id_ref.current) cmb_district_id_ref.current.value = '';
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';
          } else {
            setStateOptions([]);
            setDistrictOptions([])
            setCityOptions(defaultOptions);
            setStateId('')
            setDistrictId('');
            setCityId('');
            if (cmb_state_id_ref.current) cmb_state_id_ref.current.value = '';
            if (cmb_district_id_ref.current) cmb_district_id_ref.current.value = '';
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';

          }
          break;
        case 'State':
          const getStateId = cmb_state_id_ref.current.value || ''
          if (getStateId !== '') {
            $('#error_cmb_state_id').hide();
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name']
            globalQuery.table = "cmv_district"
            globalQuery.conditions.push({ field: "state_id", operator: "=", value: getStateId });
            const districtList = await combobox.current.fillFiltersCombo(globalQuery)
            const districts = [
              { value: '', label: 'Select' },
              { value: '0', label: 'Add New Record +' },

              ...districtList.map((district) => ({ ...district, value: district.field_id, label: district.field_name })),
            ];
            setDistrictOptions(districts)
            setDistrictId('')
            setCityId('')
            if (cmb_district_id_ref.current) cmb_district_id_ref.current.value = '';
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';
            setCityOptions(defaultOptions)
          } else {
            setDistrictOptions([])
            setCityOptions(defaultOptions);
            if (cmb_district_id_ref.current) cmb_district_id_ref.current.value = '';
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';
            setDistrictId('');
            setCityId('')
          }
          break;
        case 'District':
          const getDistrictId = cmb_district_id_ref.current.value || '';
          if (getDistrictId === "0") {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            $('#error_cmb_district_id').hide();
            setHeaderName('District')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)

            setCityOptions(defaultOptions)
            setCityId('')
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';
          } else {
            // $('#error_cmb_district_id').hide();
            // setHeaderName('District')
            // setShowAddRecModal(true)
            // setTimeout(() => {
            //   $(".erp_top_Form").eq(0).css("padding-top", "0px");
            // }, 100)
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'city_pincode'];
            globalQuery.table = "cmv_city"
            globalQuery.conditions.push({ field: "district_id", operator: "=", value: getDistrictId });
            const cityList = await combobox.current.fillFiltersCombo(globalQuery)
            const cities = [
              { value: '', label: 'Select', city_pincode: '' },
              { value: '0', label: 'Add New Record +', city_pincode: '' },
              ...cityList.map((city) => ({ ...city, value: city.field_id, label: city.field_name, city_pincode: city.city_pincode })),
            ];
            setCityOptions(cities)
            setCityId('')
            if (cmb_city_id_ref.current) cmb_city_id_ref.current.value = '';
          }
          break;
        case 'City':
          const propertyValCity = cmb_city_id_ref.current.value || '';
          if (propertyValCity === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('City')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else {
            setCityId(propertyValCity)
            // const selectedCity = cityOptions.find(city => city.value === parseInt(propertyValCity));
            // setCurrentPincode(selectedCity.city_pincode);
            // if (document.getElementById("permt_add_chechbox").checked) {
            //   setPermanantPincode(selectedCity.city_pincode);
            // }
          }
          if (propertyValCity !== '0' && propertyValCity !== '')
            $('#error_cmb_city_id').hide();
          break;

        case 'EmployeeDestination':
          let EmployeeDestinationval = document.getElementById('cmb_destination_id').value.trim();
          if (EmployeeDestinationval === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Employee Destination')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          }
          break;

        case 'PrimaryBankName':
          let PrimaryBankNameval = document.getElementById('cmb_bank_id_1').value.trim();
          setStateId(PrimaryBankNameval)
          if (PrimaryBankNameval === '0') {
            const newTab = window.open('/Masters/MBanks/FrmBank/FrmMBankEntry', '_blank');
            if (newTab) {
              newTab.focus();
            }
          }

          break;

        case 'SecondaryBankName':
          let SecondaryBankNameval = document.getElementById('cmb_bank_id_2').value.trim();
          setStateId(SecondaryBankNameval)
          if (SecondaryBankNameval === '0') {
            const newTab = window.open('/Masters/MBanks/FrmBank/FrmMBankEntry', '_blank');
            if (newTab) {
              newTab.focus();
            }
          }

          break;

        case 'DepartmentGroup':
          const departmentGrp = cmb_department_group_id_ref.current.value;
          var selectedGroupFieldName = cmb_department_group_id_ref.current.field_name;
          if (departmentGrp !== "") {
            setDepartmentGroupId(departmentGrp);
            $('#error_department_group_id').hide();
            try {
              // // ** Load the department list from the department-group
              // resetGlobalQuery();
              // globalQuery.columns.push("field_id");
              // globalQuery.columns.push("field_name");
              // globalQuery.conditions.push({ field: "department_group", operator: "=", value: selectedGroupFieldName });
              // globalQuery.conditions.push({ field: "department_type", operator: "=", value: "M" });
              // globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
              // globalQuery.table = "cmv_department";
              // var deptOptions = await combobox.current.fillFiltersCombo(globalQuery);
              // const departmentOptions = [
              //   { value: '', label: 'Select' },
              //   { value: '0', label: 'Add New Record+' },
              //   ...deptOptions.map((department) => ({ ...department, value: department.field_id, label: department.field_name, })),
              // ];
              // setDepartmentOptions(departmentOptions);
              // setSubDepartmentGroupOptions(defaultOptions);
              // setDepartmentId('');
              // setSubDepartmentGroupId('');
            } catch (error) {
              console.log('Error: ' + error);
            }
          } else {
            // // ** Load the department list from the department-group
            // setDepartmentOptions(defaultOptions);
            // setSubDepartmentGroupOptions(defaultOptions);
            // setDepartmentId('');
            // setSubDepartmentGroupId('');
          }
          break;

        case 'cmb_grade_id':
          let shortname = cmb_grade_id_ref.current.short_name || '';;
          let cmb_grade_id = cmb_grade_id_ref.current.value;
          let department_Selected = cmb_department_id_ref.current.field_name || '';

          if (cmb_grade_id !== '0' && cmb_grade_id !== '') {
            const designation = getDesignation(shortname, department_Selected);
            setDesignation(designation);
            if (shortname !== '' && department_Selected !== '') {
              await designationCheck(designation);
            }
          } else if (cmb_grade_id === '' && cmb_grade_id_ref.current) {
            cmb_grade_id_ref.current = '';
            const designation = getDesignation(shortname, department_Selected);
            setDesignation(designation);
          }

          if (cmb_grade_id !== undefined && cmb_grade_id !== '0' && cmb_grade_id !== '') {
            $("#error_cmb_grade_id").hide();
          }

          if (cmb_grade_id === '0') {
            const newTab = window.open('/Masters/MEmployeeGrade/FrmEmployeeGrade', '_blank');
            if (newTab) {
              newTab.focus();
            }
          }
          break;

        case 'Department': {
          const departmentId = cmb_department_id_ref.current.value;
          let shortname = cmb_grade_id_ref.current.short_name || '';
          let department_Selected = cmb_department_id_ref.current.field_name || '';

          if (departmentId === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Department')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else if (departmentId !== "") {

            const designation = getDesignation(shortname, department_Selected);

            // Set the designation and check it
            setDesignation(designation);
            if (shortname !== '' && department_Selected !== '') {
              await designationCheck(designation);
            }

            setDepartmentId(departmentId);
            $('#error_cmb_department_id').hide();

          } else {
            const designation = getDesignation(shortname, department_Selected);
            setDesignation(designation);
            if (shortname !== '' && department_Selected !== '') {
              await designationCheck(designation);
            }
          }
          break;
        }

        case 'SubDepartment': {
          const SubDepartmentval = cmb_subdepartment_group_id_ref.current.value;
          if (SubDepartmentval === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Sub Department')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else {
            setSubDepartmentGroupId(SubDepartmentval);
          }

          let shortname = cmb_grade_id_ref.current.short_name || '';
          let department_Selected = cmb_subdepartment_group_id_ref.current?.parent_department || '';

          if (cmb_subdepartment_group_id_ref.current && SubDepartmentval !== '0') {
            setDepartmentId(cmb_subdepartment_group_id_ref.current?.parent_department_id)
            cmb_department_id_ref.current.field_name = cmb_subdepartment_group_id_ref.current?.parent_department
            cmb_department_id_ref.current.field_id = cmb_subdepartment_group_id_ref.current?.parent_department_id

            // Get job type based on department
            FnGetJobTypes(cmb_subdepartment_group_id_ref.current?.parent_department_id, SubDepartmentval);

            const designation = getDesignation(shortname, department_Selected);

            // Set the designation and check it
            setDesignation(designation);
            if (shortname !== '' && department_Selected !== '') {
              await designationCheck(designation);
            }
          } else {
            const designation = getDesignation(shortname, department_Selected);
            setDesignation(designation);
            if (shortname !== '' && department_Selected !== '') {
              await designationCheck(designation);
            }
          }
        }
          break;
        case 'Contractor':
          const contractorId = cmb_contractor_id_ref.current.value;
          if (contractorId === '0') {
            const newTab = window.open('/Masters/Contractor', '_blank');
            if (newTab) {
              newTab.focus();
            }
          }
          else if (contractorId === "001") {
            document.getElementById("dt_contract_start_date").setAttribute("optional", "optional");
            setContractStartDate('');
            document.getElementById("dt_contract_end_date").setAttribute("optional", "optional");
            setContractEndDate('');
            $('#error_dt_contract_start_date').hide()
            $('#error_dt_contract_end_date').hide()
          } else {
            document.getElementById("dt_contract_start_date").removeAttribute("optional");
            document.getElementById("dt_contract_end_date").removeAttribute("optional");
          }

          if (contractorId !== '0') {
            setContractorId(contractorId);
          }
          break;

        case 'Shift':
          const ShiftVal = cmb_shift_id_ref.current.value;

          if (ShiftVal === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Shift')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else if (ShiftVal !== '') {
            $('#error_cmb_shift_id').hide()
          }
          break;
        case 'CurrentShift':
          const CurrentShiftVal = cmb_current_shift_id_ref.current.value;

          if (CurrentShiftVal === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Shift')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else if (CurrentShiftVal !== '') {
            $('#error_cmb_current_shift_id').hide()
          }
          break;
        case 'primaryBank':
          const primariBank = cmb_bank_id_1_ref.current.value;

          if (primariBank === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Primary Bank')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else if (primariBank !== '') {
            $('#error_cmb_bank_id_1').hide()
          }
          break;
        case 'primaryBankList':

          resetGlobalQuery();
          globalQuery.columns = ['field_id', 'field_name',]
          globalQuery.conditions = [

            { field: "is_delete", operator: "=", value: 0 },
          ]
          globalQuery.table = "cmv_banks_List";
          combobox.current.fillFiltersCombo(globalQuery).then((primariBank) => {
            const bankList = [
              { value: '', label: 'Select' },
              ...primariBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
            ];
            setBankNameOptions(bankList);
          })
          break;

        case 'secdBank':
          const secondaryBank = cmb_bank_id_2_ref.current.value;
          if (secondaryBank === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Secondary Bank')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").eq(0).css("padding-top", "0px");
            }, 100)
          } else if (secondaryBank !== '') {
            $('#error_cmb_bank_id_2').hide()
          }
          break;
        case 'weeklyOff':
          const weeklyOff = cmb_weeklyoff_id_ref.current.value;
          if (weeklyOff !== '' && weeklyOff !== '0') {
            $('#error_cmb_weeklyoff_id').hide()
          }
          break;
        case 'Reportingto':
          const ReportingtoVal = document.getElementById('cmb_reproting_to_id').value;

          if (ReportingtoVal === '0') {
            const newTab = window.open('/Masters/Employees', '_blank');
            if (newTab) {
              newTab.focus();
            }
          }

          break;


        case 'CostCenter':
          const CostCenterVal = cmb_cost_center_id_ref.current.value;
          if (CostCenterVal === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Cost Center')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").css("padding-top", "0px");
            }, 100)
          } else {
            setCostCenterId(CostCenterVal);
          }
          if (CostCenterVal !== '') {
            $("#error_cmb_cost_center_id").hide()
          }
          break;

        case 'profitCenter':
          const profitCenterVal = cmb_profit_center_id_ref.current.value;

          if (profitCenterVal === '0') {
            sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
            setHeaderName('Profit Center')
            setShowAddRecModal(true)
            setTimeout(() => {
              $(".erp_top_Form").css("padding-top", "0px");
            }, 100)
          } else {
            setProfitCenterId(profitCenterVal);
          } if (profitCenterVal !== '') {
            $("#error_cmb_profit_center_id").hide()
          }
          break;
      }
    } catch (error) {
      console.log("error : ", error)
      navigate('/Error')
    }
  }

  const FnGetJobTypes = (department_id, sub_department_id) => {
    // // Load JobTypes
    // resetGlobalQuery();
    // globalQuery.columns = ['job_type_id', 'job_type_name', 'job_type_short_name'];
    // globalQuery.table = "hm_job_type";
    // globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    // globalQuery.conditions.push({ field: "department_id", operator: "=", value: department_id });
    // globalQuery.conditions.push({ field: "sub_department_id", operator: "=", value: sub_department_id });
    // combobox.current.fillFiltersCombo(globalQuery).then((jobTypes) => {
    //   jobTypes = jobTypes?.map(prop => ({ ...prop, value: prop.job_type_id, label: prop.job_type_name }));
    //   setJobTypeOpts(jobTypes);
    // })
  }

  const inputBoxesOnChange = async (key) => {
    switch (key) {
      case 'EmployeeName':
        const salutation = document.getElementById('cmb_salutation').value.trim();
        const lastName = document.getElementById('txt_last_name').value.trim();
        const firstName = document.getElementById('txt_first_name').value.trim();
        const middleName = document.getElementById('txt_middle_name').value.trim();
        setEmployeeName(salutation + " " + firstName + " " + middleName + " " + lastName);
        if (salutation !== "" && lastName !== "" && firstName !== "" && middleName !== "") {
          setprim_account_holder_name(salutation + " " + firstName + " " + middleName + " " + lastName);
        }
        document.getElementById('txt_employee_name').disabled = true;
        break;
    }
  }

  //case no. 1 chnges by ujjwala 10/1/2024 Start
  const validateEmployeeForm = async () => {
    debugger
    const employee_form = await frmValidation.current.validateForm('employeeFormId')
    if (!employee_form) {
      return false
    }
    const employee_work_profile = await frmValidation.current.validateForm('employeeWorkProfFormId')
    if (!employee_work_profile) {
      return false
    }

    const employee_salary = $("#cmb_employee_group_type option:selected").attr('property_value') === 'W' ? true : await frmValidation.current.validateForm('employeeSalaryInfoFormId')
    if (!employee_salary) {
      return false
    }

    // Validate searcheable combos
    if (cmb_country_id === '' || cmb_country_id === '0') {
      $("#error_cmb_country_id").text("Please fill this field...!");
      $("#error_cmb_country_id").show();
      $("#cmb_cmb_country_id").focus();
      return false;
    }
    if (cmb_state_id === '' || cmb_state_id === '0') {
      $("#error_cmb_state_id").text("Please fill this field...!");
      $("#error_cmb_state_id").show();
      $("#cmb_state_id").focus();
      return false;
    }

    if (cmb_district_id === '' || cmb_district_id === '0') {
      $("#error_cmb_district_id").text("Please fill this field...!");
      $("#error_cmb_district_id").show();
      $("#cmb_district_id").focus();
      return false;
    }

    if (cmb_city_id === '' || cmb_city_id === '0') {
      $("#error_cmb_city_id").text("Please fill this field...!");
      $("#error_cmb_city_id").show();
      $("#cmb_city_id").focus();
      return false;
    }

    // // *** Department group mandatory validation.
    // if (cmb_department_group_id === '' || cmb_department_group_id === '0') {
    //   $("#error_cmb_department_group_id").text("Please fill this field...!");
    //   $("#error_cmb_department_group_id").show();
    //   $("#cmb_department_group_id").focus();
    //   return false;
    // }
    if (cmb_grade_id === '' || cmb_grade_id === '0' || cmb_grade_id === undefined) {
      $("#error_cmb_grade_id").text("Please fill this field...!");
      $("#error_cmb_grade_id").show();
      $("#cmb_grade_id").focus();
      return false;
    }

    if (cmb_department_id === '' || cmb_department_id === '0') {
      $("#error_cmb_department_id").text("Please fill this field...!");
      $("#error_cmb_department_id").show();
      $("#cmb_department_id").focus();
      return false;
    }

    if (cmb_employee_group_type === 'Workers' && (cmb_job_type_id === '' || cmb_job_type_id === '0')) {
      $("#error_cmb_job_type_id").text("Please fill this field...!");
      $("#error_cmb_job_type_id").show();
      $("#cmb_job_type_id").focus();
      return false;
    }

    // if (cmb_weeklyoff_id === '' || cmb_weeklyoff_id === '0') {
    //   $("#error_cmb_weeklyoff_id").text("Please fill this field...!");
    //   $("#error_cmb_weeklyoff_id").show();
    //   $("#cmb_reproting_to_id").focus();
    //   return false;
    // }

    if (cmb_shift_id === '' || cmb_shift_id === '0') {
      $("#error_cmb_shift_id").text("Please fill this field...!");
      $("#error_cmb_shift_id").show();
      $("#cmb_shift_id").focus();
      return false;
    }

    if (cmb_current_shift_id === '' || cmb_current_shift_id === '0') {
      $("#error_cmb_current_shift_id").text("Please fill this field...!");
      $("#error_cmb_current_shift_id").show();
      $("#cmb_current_shift_id").focus();
      return false;
    }

    // if (cmb_profit_center_id === '' || cmb_profit_center_id === '0') {
    //   $("#error_cmb_profit_center_id").text("Please fill this field...!");
    //   $("#error_cmb_profit_center_id").show();
    //   $("#cmb_profit_center_id").focus();
    //   return false;
    // }

    // if (cmb_cost_center_id === '' || cmb_cost_center_id === '0') {
    //   $("#error_cmb_cost_center_id").text("Please fill this field...!");
    //   $("#error_cmb_cost_center_id").show();
    //   $("#cmb_cost_center_id").focus();
    //   return false;
    // }

    let selectedEarningHead = $('#earningHead-table tbody tr .selectEarning:checked')
    let selectedDuductionHead = $('#deductionHead-table tbody tr .selectDeduction:checked')

    let EarningHead = true;
    if ($("#cmb_employee_group_type option:selected").attr('property_value') !== 'W') {
      if (selectedEarningHead.length === 0 && selectedDuductionHead.length === 0) {
        setErrMsg('Please Select Atleast One Earning Head...!');
        setShowErrorMsgModal(true);
        return EarningHead = false;
      } else {
        selectedEarningHead.each(function () {
          let currentTblRow = $(this.parentElement.parentElement)
          let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
          // let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

          if (calculatedValue === '') {
            $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
            $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
            return EarningHead = false;

          }

          // else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
          //   $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
          //   $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
          //   return EarningHead = false;
          // }

        });
        selectedDuductionHead.each(function () {
          let currentTblRow = $(this.parentElement.parentElement)
          let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
          // let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

          if (calculatedValue === '') {
            $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
            $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
            return EarningHead = false;

          }
          // else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
          //   $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
          //   $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
          //   return EarningHead = false;
          // }

        });
        // return EarningHead;
      }
    }


    return EarningHead;
  }

  const validateEmpInfoFields = () => {
    frmValidation.current.validateFieldsOnChange('employeeFormId')
  }

  const validateEmpWorkProfFields = () => {
    frmValidation.current.validateFieldsOnChange('employeeWorkProfFormId')
  }

  const validateEmpSalaryFields = () => {
    frmValidation.current.validateFieldsOnChange('employeeSalaryInfoFormId')
  }


  //end
  const validateErrorMsgsNumericInput = (event) => {
    var regexNoBank = /^[A-Za-z0-9]+$/;
    const regexNo = /^[0-9\b]+$/;
    var regexPassport = /^[A-Za-z0-9]+$/;
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

    const value = event.target.value
    switch (event.target.id) {
      case 'txt_aadhar_card_no':
        if (regexNo.test(value) || value === '') {
          setAadharCardNo(value);
        }
        break;
      case 'txt_permanant_pincode':
        if (regexNo.test(value) || value === '') {
          setPermanantPincode(value);
        }
        break;
      case 'txt_current_pincode':
        if (regexNo.test(value) || value === '') {
          setCurrentPincode(value);
        }
        break;
      case 'txt_phone_no':
        if (regexNo.test(value) || value === '') {
          setPhoneNo(value);
        }
        break;
      case 'txt_cell_no1':
        if (regexNo.test(value) || value === '') {
          setCellNo1(value);
          setUserName(value);
        }
        break;
      case 'txt_cell_no2':
        if (regexNo.test(value) || value === '') {
          setCellNo2(value);
        }
        break;
      case 'txt_account_no1':
        if (regexNoBank.test(value) || value === '') {
          setAccountNo1(value);
        }
        break;
      case 'txt_account_no2':
        if (regexNoBank.test(value) || value === '') {
          setAccountNo2(value);
        }
        break;
      case 'finance_account_no':
        if (regexNoBank.test(value) || value === '') {
          setFinanceAccountNo(value);
        }
        break;
      case 'txt_passport_no':
        if (regexPassport.test(value) || value === '') {
          setPassportNo(value);
        }
        break;
      case 'txt_email_id1':
        if (emailRegex.test(value) || value === '') {
          setEmailId1(value);
        }
        break;
      case 'txt_email_id2':
        if (emailRegex.test(value) || value === '') {
          setEmailId2(value);
        }
        break;
    }

  }

  const FnAddEmployee = async () => {
    debugger
    setIsLoading(true)
    const checkIsValidate = await validateEmployeeForm();
    if (checkIsValidate === true) {
      try {
        // Set Default JobType if not selected then set General As JobType by using JobTypeId told by prashant sir; on 30/07/2024
        let selectedJobType;
        if (cmb_job_type_id === null || cmb_job_type_id === '') {
          selectedJobType = jobTypeOpts.find(option => option.job_type_id == defaultJobTypeId);
          setJobTypeId(defaultJobTypeId);
        }

        let json = {
          'EmployeeEarningsData': [], 'EmployeeDeductionData': [], 'EmployeeQualificationData': [], 'EmployeeExperienceData': [],
          'EmployeeMasterData': {}, 'EmployeeWorkProfileData': {}, 'EmployeeSalaryData': {}, 'commonIds': {
            'company_id': COMPANY_ID, 'company_branch_id': parseInt(COMPANY_BRANCH_ID), 'employee_id': employee_id, 'userName': UserName, 'designation_id': parseInt(cmb_designation_id || 0),
          }
        }

        //Employee Master Data.............
        let activeValue;
        activeValue = document.querySelector('input[name=employeeIsActive]:checked').value

        switch (activeValue) {
          case '0': activeValue = false; break;
          case '1': activeValue = true; break;
        }

        const emp_master_data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          employee_id: employee_id,
          created_by: UserName,
          modified_by: employee_id === null ? null : UserName,
          employee_code: txt_employee_code,
          old_employee_code: txt_old_employee_code,
          machine_employee_code: txt_employee_machine_code === null || txt_employee_machine_code === '' ? txt_employee_code : txt_employee_machine_code,
          employee_type_group: cmb_employee_group_type,
          employee_type: $('#cmb_employee_type option:selected').text(),
          salutation: $('#cmb_salutation option:selected').val(),
          last_name: txt_last_name,
          first_name: txt_first_name,
          middle_name: txt_middle_name,
          employee_name: txt_employee_name,
          aadhar_card_no: txt_aadhar_card_no,
          passport_no: txt_passport_no,
          pan_no: txt_pan_no,
          current_address: txt_current_address,
          current_pincode: txt_current_pincode,
          city_id: cmb_city_id,
          district_id: cmb_district_id,
          state_id: cmb_state_id,
          country: cmb_country_id,
          permanant_address: txt_permanant_address,
          permanant_pincode: txt_permanant_pincode,
          date_of_birth: formatDate(dt_date_of_birth),
          email_id1: txt_email_id1,
          email_id2: txt_email_id2,
          phone_no: txt_phone_no,
          cell_no1: txt_cell_no1,
          cell_no2: txt_cell_no2,
          bank_id1: cmb_bank_id_1,
          account_no1: txt_account_no1,
          ifsc_code1: txt_ifsc_code1,
          bank_id2: cmb_bank_id_2,
          account_no2: txt_account_no2,
          ifsc_code2: txt_ifsc_code2,
          marital_status: cmb_marital_status,
          reference: txt_reference_id,
          destination_id: cmb_destination_id,
          religion: cmb_religion,
          category: cmb_category_id,
          caste: cmb_caste_id,
          gender: cmb_gender,
          blood_group: cmb_blood_group,
          driving_licence: txt_driving_licence,
          finance_account_no: finance_account_no,
          employee_status: cmb_employee_status,
          left_suspended_date: formatDate(dt_leftorSuspended_date),
          username: txt_username,
          password: txt_password,
          is_active: activeValue,
          image_path: image_path,
          account_name1: txt_prim_account_holder_name,
          account_name2: txt_sec_account_holder_name,

          father_dob: formatDate(dt_father_DOB_date),
          father_name: txt_father_Name,
          mother_name: txt_mother_Name,
          mother_dob: formatDate(dt_mother_DOB_date),
          spouse_name: txt_spouse_Name,
          spouse_dob: formatDate(dt_spouse_DOB_date),
          son_name: txt_Son_Name,
          son_dob: formatDate(dt_Son_DOB_date),
          daughter_name: txt_daughter_Name,
          daughter_dob: formatDate(dt_daughter_DOB_date)

        };
        json.EmployeeMasterData = emp_master_data;

        //Employee Workprofile Data.........
        const emp_workprof_data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          employee_id: employee_id,
          employee_workprofile_id: emplWorkPrfileID,
          department_group_id: cmb_department_group_id,
          department_id: cmb_department_id,
          sub_department_id: cmb_subdepartment_group_id,
          designation_id: cmb_designation_id,
          designation_name: txt_designation,
          reporting_to: cmb_reproting_to_id,
          weeklyoff: cmb_weeklyoff_id,
          shift_id: cmb_shift_id,
          current_shift_id: cmb_current_shift_id,
          date_joining: formatDate(dt_date_joining),
          date_exit: formatDate(dt_date_exit),
          contractor_id: cmb_contractor_id,
          contract_startdate: formatDate(dt_contract_start_date),
          contract_enddate: formatDate(dt_contract_end_date),
          region_id: cmb_region_id,
          cost_center_id: cmb_cost_center_id,
          profit_center_id: cmb_profit_center_id,
          bond_applicable: bondIsApplicable,
          current_job: txt_current_job,
          attendance_exclude_flag: attendance_exclude_flag,
          job_type_id: jobTypeComboRef.current ? jobTypeComboRef.current?.job_type_id : 0,
          job_type_short_name: jobTypeComboRef.current ? jobTypeComboRef.current?.job_type_short_name : null,
          resident_type: cmb_resident_type,
        };
        json.EmployeeWorkProfileData = emp_workprof_data;

        //Employee salary Data
        const emp_salary_data = {
          company_id: COMPANY_ID,
          company_branch_id: COMPANY_BRANCH_ID,
          employee_salary_id: salaryId,
          employee_id: employee_id,
          grade_id: cmb_grade_id,
          band_id: cmb_band_id,
          ctc: txt_ctc,
          salary: txt_salary,
          ot_flag: chk_ot_flag,
          ot_amount: txt_ot_amount,
          gratuity_applicable: chk_gratuity_applicable,
          pf_flag: chk_pf_flag,
          pf_no: txt_pf_no,
          uan_no: txt_uan_no,
          pf_date: formatDate(dt_pf_date),
          esic_flag: chk_esic_flag,
          esic_no: txt_esic_no,
          esic_date: formatDate(dt_esic_date),
          mlwf_flag: chk_mlwf_flag,
          mlwf_no: txt_mlwf_no
        };
        json.EmployeeSalaryData = emp_salary_data;

        //Earning And Deduction data
        $("input:checkbox[name=selectEarning]:checked").each(function () {
          let findEarningData = earningData.find(item => item.earning_heads_id === parseInt($(this).val()));

          const earningDatas = {
            company_id: COMPANY_ID,
            company_branch_id: COMPANY_BRANCH_ID,
            earning_code: findEarningData.earning_code,
            earning_heads_id: findEarningData.earning_heads_id,
            earning_head_short_name: findEarningData.earning_head_short_name,
            earning_type: findEarningData.earning_type,
            calculation_type: findEarningData.calculation_type,
            calculation_value: findEarningData.calculation_value,
            effective_date: findEarningData.effective_date,
            formula: findEarningData.formula,
            effective_date: formatDate(effective_date),
            designation_id: cmb_designation_id,
            created_by: UserName,

          }
          json.EmployeeEarningsData.push(earningDatas);
        });

        $("input:checkbox[name=selectDeduction]:checked").each(function () {
          let findDiductionData = deductionData.find(item => item.deduction_heads_id === parseInt($(this).val()));

          const deductionDatas = {
            company_id: COMPANY_ID,
            company_branch_id: COMPANY_BRANCH_ID,
            deduction_code: findDiductionData.deduction_code,
            deduction_heads_id: findDiductionData.deduction_heads_id,
            deduction_head_short_name: findDiductionData.deduction_head_short_name,
            deduction_type: findDiductionData.deduction_type,
            calculation_type: findDiductionData.calculation_type,
            effective_date: findDiductionData.effective_date,
            calculation_value: findDiductionData.calculation_value,
            formula: findDiductionData.formula,
            effective_date: formatDate(effective_date),
            designation_id: cmb_designation_id,
            created_by: UserName,

          }
          json.EmployeeDeductionData.push(deductionDatas);
        });

        if (employeeQualificationData.length > 0) {
          let lastIndexOfemployeeQualification = employeeQualificationData.length - 1
          if (employeeQualificationData[lastIndexOfemployeeQualification].qualification !== '') {
            json.EmployeeQualificationData = employeeQualificationData
          }
        }

        if (employeeExperienceData.length > 0) {
          let lastIndexOfemployeeExperience = employeeExperienceData.length - 1
          if (employeeExperienceData[lastIndexOfemployeeExperience].previous_organisation !== '') {
            json.EmployeeExperienceData = employeeExperienceData
          }
        }

        console.log('Data: ', json);

        const formData = new FormData();
        formData.append(`EmployeeServiceData`, JSON.stringify(json))
        formData.append(`empImageFile`, uploadImageFile)

        const requestOptions = {
          method: 'POST',
          body: formData
        };

        try {
          const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/FnAddUpdateRecord/${ApproveFlag}`, requestOptions)
          const apiResponse = await apiCall.json();

          if (apiResponse.success === 1) {
            setEmployee_id(apiResponse.data.employee_id);
            setIsLoading(false);
            setSuccMsg(apiResponse.message);
            setShowSuccessMsgModal(true);

            // // Now Enable the Next tab button;
            // document.getElementById('nxtBtn').disabled = false;
          } else if (apiResponse.success === 0) {
            console.log("response error: ", apiResponse.error);
            setIsLoading(false);
            setErrMsg(apiResponse.error)
            setShowErrorMsgModal(true);
          }
        } catch (error) {
          setIsLoading(false);
          console.log("error", error)
          navigate('/Error')
        }

      } catch (error) {
        setIsLoading(false);
        console.log("error", error)
        navigate('/Error')
      }
    } else {
      setIsLoading(false);
    }
  };
  //case no. 4 chnges by ujjwala 10/1/2024 Start
  const validationfornext = () => {
    if (employee_id !== 0 && UserId === 1) {
      props.goToNext(employee_id, keyForViewUpdate, cmb_designation_id, txt_employee_code, txt_employee_name, cmb_grade_id, cmb_employee_type);
    }

  }


  const FnRefreshbtn = async (key) => {
    switch (key) {

      case 'PrimaryBank':
        // combobox.current.fillMasterData("cmv_banks_List", "", "").then((bankOptionsApiCall1) => {
        //   setBankNameOptions(bankOptionsApiCall1);
        // });
        // combobox.current.fillMasterData("cmv_banks_List", "", "").then((primariBank) => {
        //   const bankList = [
        //     { value: '', label: 'Select' },
        //     ...primariBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
        //   ];
        //   setBankNameOptions(bankList);
        // })
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name',]
        globalQuery.conditions = [

          { field: "is_delete", operator: "=", value: 0 },
        ]
        globalQuery.table = "cmv_banks_List";
        combobox.current.fillFiltersCombo(globalQuery).then((primariBank) => {
          const bankList = [
            { value: '', label: 'Select' },
            ...primariBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
          ];
          setBankNameOptions(bankList);
        })
        break;
      case 'SecondaryBank':
        // combobox.current.fillMasterData("cmv_banks_List", "", "").then((bankOptionsApiCall2) => {
        //   setBankNameOptions(bankOptionsApiCall2);
        // });
        // combobox.current.fillMasterData("cmv_banks_List", "", "").then((secondaryBank) => {
        //   const bankList = [
        //     { value: '', label: 'Select' },
        //     ...secondaryBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
        //   ];
        //   setBankNameOptions(bankList);
        // })
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name',]
        globalQuery.conditions = [

          { field: "is_delete", operator: "=", value: 0 },
        ]
        globalQuery.table = "cmv_banks_List";
        combobox.current.fillFiltersCombo(globalQuery).then((secondaryBank) => {
          const bankList = [
            { value: '', label: 'Select' },
            ...secondaryBank.map((bank) => ({ ...bank, value: bank.field_id, label: bank.field_name, })),
          ];
          setBankNameOptions(bankList);
        })
        break;
      case 'Contractor':
        combobox.current.fillMasterData("cmv_contractor", "", "").then((contractorList) => {
          const contractors = [
            { value: '', label: 'Select' },
            { value: '0', label: 'Add New Record+' },
            { value: '001', label: 'Self' },
            ...contractorList.map((contractor) => ({ ...contractor, value: contractor.field_id, label: contractor.field_name, })),
          ];
          setContractorOption(contractors);
        })
        break;
      default:
        break;

    }
  }

  //Employee Salary Starts here..........
  const validateNumericInput = (event, key) => {

    const regexNo = /^\d+(\.\d+)?$/;
    const inputBoxValue = event.target.value;
    switch (key) {
      case 'CTC':
        if (regexNo.test(inputBoxValue) && event.target.maxLength >= event.target.value.length) {
          setCTC(inputBoxValue);
        } else if (inputBoxValue === '') {
          setCTC(inputBoxValue);
        }
        break;
      case 'Salary':
        if (regexNo.test(inputBoxValue) && event.target.maxLength >= event.target.value.length) {
          setSalary(inputBoxValue);
        } else if (inputBoxValue === '') {
          setSalary(inputBoxValue);
        }
        break;
      case 'OTAmount':
        if (regexNo.test(inputBoxValue) && event.target.maxLength >= event.target.value.length) {
          setOTAmmount(inputBoxValue);
        } else if (inputBoxValue === '') {
          setOTAmmount(inputBoxValue);
        }
        break;
    }
  }


  const onRadioBtnChange = async (key) => {
    try {
      switch (key) {
        case 'OTApplicable':  // onRadioBtnChange("OTApplicable")
          var OTIsApplicable = document.querySelector('input[name="chk_ot_flag"]:checked').value;
          if (OTIsApplicable === 'true') {
            document.getElementById("txt_ot_amount").removeAttribute("optional");
          } else {
            document.getElementById("txt_ot_amount").setAttribute("optional", "optional");
          }
          break;

        case 'PFApplicable':   // onRadioBtnChange("PFApplicable")
          var PFIsApplicable = document.querySelector('input[name="chk_pf_flag"]:checked').value;
          if (PFIsApplicable === 'true') {
            document.getElementById("txt_pf_no").removeAttribute("optional");
            document.getElementById("txt_uan_no").removeAttribute("optional");
            document.getElementById("dt_pf_date").removeAttribute("optional");
          } else {
            document.getElementById("txt_pf_no").setAttribute("optional", "optional");
            document.getElementById("txt_uan_no").setAttribute("optional", "optional");
            document.getElementById("dt_pf_date").setAttribute("optional", "optional");
          }
          break;

        case 'ESICApplicable':   // onRadioBtnChange("ESICApplicable")
          var ESICIsApplicable = document.querySelector('input[name="chk_esic_flag"]:checked').value;
          if (ESICIsApplicable === 'true') {
            document.getElementById("txt_esic_no").removeAttribute("optional");
            document.getElementById("dt_esic_date").removeAttribute("optional");
          } else {
            document.getElementById("txt_esic_no").setAttribute("optional", "optional");
            document.getElementById("dt_esic_date").setAttribute("optional", "optional");
          }
          break;

        case 'MLWFApplicable':  // onRadioBtnChange("MLWFApplicable")
          var MLWFIsApplicable = document.querySelector('input[name="chk_mlwf_flag"]:checked').value;
          if (MLWFIsApplicable === 'true') {
            document.getElementById("txt_mlwf_no").removeAttribute("optional");
          } else {
            document.getElementById("txt_mlwf_no").setAttribute("optional", "optional");
          }
          break;
      }
    } catch (error) {
      console.log('error: ' + error)
      navigate('/Error')
    }
  }

  //Validations for Employee Info 
  const validateDOB = (dateofbirth) => {
    var dateOfBirth = dateofbirth;
    var dobDate = new Date(dateOfBirth);
    var today = new Date();
    var minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (dobDate > minDate) {
      $('#error_dt_date_of_birth').css('display', 'block').text('You must be at least 18 years old.');
    } else {
      $('#error_dt_date_of_birth').hide();
    }
  }

  const validateTelePhone = (telephnno) => {
    var input = telephnno;
    var regex = /^(?:\d{11,15}\s?)/;

    if (regex.test(input) && input.length <= 15) {
      $('#error_txt_phone_no').hide();
    } else {
      $('#error_txt_phone_no').css('display', 'block').text('Please Enter Valid phone number.');
    }
  }

  const validateCheckBox = () => {
    let value = $('#permt_add_chechbox').prop('checked');
    if (value) {
      setPermanentAddressChechBox(true)
      setPermanantAddress(txt_current_address)
      setPermanantPincode(txt_current_pincode)
    } else {
      setPermanentAddressChechBox(false)
      setPermanantAddress('')
      setPermanantPincode('')
    }
  }

  const FnGenerateEmployeeCode = async (employeeType, property_value) => {
    // const autoNoApiCall = await generateMaterialIdAPiCall.current.GenerateCode("cm_employee", "employee_code", "employee_type", employeeType, property_value, "5");
    // setEmployeeCode(autoNoApiCall);
    // setEmployeeMachineCode(autoNoApiCall);
    // return autoNoApiCall;

    // *** Generate Employee Code in format (empl_type_shortName + company_id + last_series)     -- for staff from 1-1000 and for worker form 1000 to onwards.
    if (!employeeType || !property_value) {
      setEmployeeCode('');
      setEmployeeMachineCode('');
      return '';
    }
    let fieldNameLastTrnNo = 'employee_code'
    let trnNoAICodelen = 4;   // means last no 0001

    // resetGlobalQuery();
    // globalQuery.columns.push(`COALESCE(MAX(SUBSTRING(${fieldNameLastTrnNo}, LENGTH(${fieldNameLastTrnNo}) - ${trnNoAICodelen} + 1, ${trnNoAICodelen}))+1, 1) As nextAINo`);
    // globalQuery.table = "cm_employee"
    // globalQuery.conditions = [
    //   { field: "employee_type", operator: "=", value: employeeType },
    //   { field: "is_delete", operator: "=", value: 0 },
    //   { field: "company_id", operator: "=", value: COMPANY_ID }
    // ];
    // const generateEmplCodeAPI = await combobox.current.fillFiltersCombo(globalQuery);
    // if (generateEmplCodeAPI.length > 0) {
    //   let latestAINo = (generateEmplCodeAPI[0]?.nextAINo || '').toString();
    //   let reqZerosCount = trnNoAICodelen - latestAINo.length;
    //   if (property_value === 'S') {
    //     let paddedAINo = latestAINo.padStart(reqZerosCount + latestAINo.length, '0');  // Prepend the required number of zeros
    //     paddedAINo = property_value + COMPANY_ID + paddedAINo
    //     setEmployeeCode(paddedAINo)
    //     setEmployeeMachineCode(paddedAINo)
    //     return paddedAINo;
    //   } else if (property_value === 'W') {
    //     let rcvdNextAINo = generateEmplCodeAPI[0]?.nextAINo || 0
    //     if (rcvdNextAINo <= 1000) {
    //       setEmployeeCode(property_value + COMPANY_ID + (1000 + rcvdNextAINo));
    //       setEmployeeMachineCode(property_value + COMPANY_ID + (1000 + rcvdNextAINo));
    //       return property_value + COMPANY_ID + (1000 + rcvdNextAINo);
    //     } else {
    //       setEmployeeCode(property_value + COMPANY_ID + rcvdNextAINo);
    //       setEmployeeMachineCode(property_value + COMPANY_ID + rcvdNextAINo);
    //       return property_value + COMPANY_ID + rcvdNextAINo;
    //     }
    //   } else {
    //     let paddedAINo = latestAINo.padStart(reqZerosCount + latestAINo.length, '0');  // Prepend the required number of zeros
    //     paddedAINo = property_value + paddedAINo
    //     setEmployeeCode(paddedAINo)
    //     setEmployeeMachineCode(paddedAINo)
    //     return paddedAINo;
    //   }
    // } else {
    //   setEmployeeCode('')
    //   setEmployeeMachineCode('')
    //   return '';
    // }



    // *** Optimized Code
    resetGlobalQuery();
    globalQuery.columns.push(`COALESCE(MAX(SUBSTRING(${fieldNameLastTrnNo}, LENGTH(${fieldNameLastTrnNo}) - ${trnNoAICodelen} + 1, ${trnNoAICodelen}))+1, 1) As nextAINo`);
    globalQuery.table = "cm_employee"
    globalQuery.conditions = [
      { field: "employee_type", operator: "=", value: employeeType },
      { field: "is_delete", operator: "=", value: 0 },
      { field: "company_id", operator: "=", value: COMPANY_ID }
    ];
    const generateEmplCodeAPI = await combobox.current.fillFiltersCombo(globalQuery);
    if (generateEmplCodeAPI.length === 0) {
      setEmployeeCode('');
      setEmployeeMachineCode('');
      return '';
    }

    const { nextAINo } = generateEmplCodeAPI[0];
    let employeeCode;
    let employeeMachineCode;
    switch (property_value) {
      case 'S': // Means Staff
      case 'A': // Means Staff (Probation)
        employeeCode = `${property_value}${COMPANY_ID}${nextAINo.toString().padStart(4, '0')}`;
        employeeMachineCode = employeeCode;
        break;

      default:
        const rcvdNextAINo = nextAINo || 0;
        if (rcvdNextAINo <= 1000) {
          employeeCode = `${property_value}${COMPANY_ID}${1000 + rcvdNextAINo}`;
          employeeMachineCode = employeeCode;
        } else {
          employeeCode = `${property_value}${COMPANY_ID}${rcvdNextAINo}`;
          employeeMachineCode = employeeCode;
        }
        break;

    }
    setEmployeeCode(employeeCode);
    setEmployeeMachineCode(employeeMachineCode);
    return employeeCode;
  }

  // This useLayoutEffect render only when cmb_employee_type or cmb_designation_id will change
  useLayoutEffect(() => {
    if (EARNING_DEDUCTION_MAPPING_BASE === 'DW' && keyForViewUpdate === 'Add') {
      FnfillEmployeeTypeOrDesignationEarningAndDeductionRecord(earningData, deductionData, cmb_designation_id)
    } else if (EARNING_DEDUCTION_MAPPING_BASE === 'ETW' && keyForViewUpdate === 'Add') {
      FnfillEmployeeTypeOrDesignationEarningAndDeductionRecord(earningData, deductionData, cmb_employee_type)
    }
  }, [cmb_employee_type, cmb_designation_id])

  const FnfillEmployeeTypeOrDesignationEarningAndDeductionRecord = async (earningHeadData, deductionHeadData, common_id) => {
    try {
      // uncheck all checkboxes of earning & deduction heads 
      $('.selectEarning').prop('checked', false);
      $('.selectDeduction').prop('checked', false);

      if (common_id !== '' && common_id !== '0') {
        const UpadateEmployeeTypeAndDesignationEarningAndDeductionRecordApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/GetDataFromDesignationOrEmplyeeType/${COMPANY_ID}/${common_id}?earning_deduction_mapping_baseKey=${EARNING_DEDUCTION_MAPPING_BASE}`);
        const { ExistingEarningRecords, ExistingDeductionRecords } = await UpadateEmployeeTypeAndDesignationEarningAndDeductionRecordApiCall.json();

        updateEarningRecords(earningHeadData, ExistingEarningRecords)
        updateDeductionRecords(deductionHeadData, ExistingDeductionRecords)
      }
    } catch (error) {
      console.log("error: ", error)
    }

  }

  const updateEarningRecords = (earningHeadData, ExistingEarningRecords) => {
    // Set earning head formula & calculation value
    if (ExistingEarningRecords.length !== 0) {
      let updatedEarningHeadData = earningHeadData.map((rowData) => {
        const correspondingMapRecord = ExistingEarningRecords.find((mapRecord) => mapRecord.earning_heads_id === rowData.earning_heads_id);
        if (correspondingMapRecord) {
          // If a matching mapRecord is found, update calculation_value and formula
          return {
            ...rowData,
            calculation_value: correspondingMapRecord.calculation_value,
            formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
            effective_date: correspondingMapRecord.effective_date,
          };
        }

        // If no matching mapRecord is found, return the original rowData
        return rowData;
      });
      setEarningData(updatedEarningHeadData)

      ExistingEarningRecords.forEach(function (earningHead) {
        $('#selectEarning_' + earningHead.earning_heads_id).prop('checked', true);
      });
      setEffectiveDate(ExistingEarningRecords[0].effective_date)
    } else {
      setEarningData(earningHeadData)
    }
  };

  const updateDeductionRecords = (deductionHeadData, ExistingDeductionRecords) => {
    // Set deduction head formula & calculation value
    if (ExistingDeductionRecords.length !== 0) {
      let updatedDeductionHeadData = deductionHeadData.map((rowData) => {
        const correspondingMapRecord = ExistingDeductionRecords.find((mapRecord) => mapRecord.deduction_heads_id === rowData.deduction_heads_id);

        if (correspondingMapRecord) {
          // If a matching mapRecord is found, update calculation_value and formula
          return {
            ...rowData,
            calculation_value: correspondingMapRecord.calculation_value,
            formula: correspondingMapRecord.formula || '', // Replace with the appropriate field from mapRecord
            effective_date: correspondingMapRecord.effective_date,
          };
        }

        return rowData;
      });

      setDeductionData(updatedDeductionHeadData)

      ExistingDeductionRecords.forEach(function (existingDeduction) {
        $('#selectDeduction_' + existingDeduction.deduction_heads_id).prop('checked', true);
      });
      setEffectiveDate(ExistingDeductionRecords[0].effective_date)
    } else {
      setDeductionData(deductionHeadData)
    }

  }

  function handleEarningCheckbox(id) {
    $('input:checkbox[name="selectEarning"][value="' + id + '"]').attr('checked', false);
    const totalChkBoxes = document.querySelectorAll('input[name=selectEarning]').length;
    const totalChkBoxesChked = document.querySelectorAll('input[name=selectEarning]:checked').length;
    if (totalChkBoxes == totalChkBoxesChked) {
      document.getElementById('selectAllEarning').checked = true;
    } else if (totalChkBoxes > totalChkBoxesChked) {
      document.getElementById('selectAllEarning').checked = false;
    }
  }
  function handleDeductionCheckbox(id) {
    $('input:checkbox[name="selectDeduction"][value="' + id + '"]').attr('checked', false);
    const totalChkBoxes = document.querySelectorAll('input[name=selectDeduction]').length;
    const totalChkBoxesChked = document.querySelectorAll('input[name=selectDeduction]:checked').length;
    if (totalChkBoxes == totalChkBoxesChked) {

      document.getElementById('selectAllDeduction').checked = true;
    } else if (totalChkBoxes > totalChkBoxesChked) {
      ;
      document.getElementById('selectAllDeduction').checked = false;
    }
  }

  const FnUpdateEarningsTblData = (currentPaymentTerm, e) => {
    debugger
    let clickedColName = e.target.getAttribute('Headers');
    delete e.target.parentElement.dataset.tip;
    const updateEarningData = [...earningData]

    switch (clickedColName) {
      case 'earning_head_value':
        let isValidPercentageInput = validateNumberDateInput.current.percentValidate(JSON.stringify(e.target.value));
        if (isValidPercentageInput === true) {
          currentPaymentTerm[clickedColName] = e.target.value
          delete e.target.parentElement.dataset.tip;
        }
        break;
      case 'calculation_value':
        const attrValue = e.target.getAttribute('attr');
        let isValiddecimalNumberInput = validateNumberDateInput.current.decimalNumber(e.target.value, 2);
        let secondRowCalculationValue;
        if (attrValue === 'GRS') {

          if (updateEarningData.length > 1) {
            secondRowCalculationValue = updateEarningData[1].calculation_value;
            console.log('Second row calculation_value:', secondRowCalculationValue);
          } else {
            console.log('There is no second row in updateEarningData.');
          }

          const findOtherAllowanceObj = updateEarningData.find(item => item.earning_head_short_name === 'OA')
          const findOtherAllowanceIndex = updateEarningData.findIndex(item => item.earning_head_short_name === 'OA')
          findOtherAllowanceObj['calculation_value'] = isValiddecimalNumberInput - secondRowCalculationValue
          updateEarningData[findOtherAllowanceIndex] = findOtherAllowanceObj
        }
        if (attrValue === 'BSC') {
          // Other allowance 
          const findOtherAllowanceObj = updateEarningData.find(item => item.earning_head_short_name === 'OA')
          const findOtherAllowanceIndex = updateEarningData.findIndex(item => item.earning_head_short_name === 'OA')
          findOtherAllowanceObj['calculation_value'] = txt_salary - isValiddecimalNumberInput
          updateEarningData[findOtherAllowanceIndex] = findOtherAllowanceObj

          //Calculate PF
          const updateDeductionData = [...deductionData]
          const findPfObj = updateDeductionData.find(item => item.deduction_head_short_name === 'PF')
          const findPfIndex = updateDeductionData.findIndex(item => item.deduction_head_short_name === 'PF')
          const updatedString = findPfObj.formula.replace('P3', isValiddecimalNumberInput || 0);
          const result = eval(updatedString);
          findPfObj['calculation_value'] = result
          updateDeductionData[findPfIndex] = findPfObj
          setDeductionData(updateDeductionData)
        }
        currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
        delete e.target.parentElement.dataset.tip;

        break;
      case 'formula':
        currentPaymentTerm[clickedColName] = e.target.value
        break;
      default:
        break;
    }

    // update the Payment terms table data.
    const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
    updateEarningData[pmtTermIndexInArray] = currentPaymentTerm;
    setEarningData(updateEarningData);

  }


  const updateDeductionTblData = (currentPaymentTerm, e) => {
    let clickedColName = e.target.getAttribute('Headers');
    delete e.target.parentElement.dataset.tip;

    switch (clickedColName) {

      case 'earning_head_value':
        let isValidPercentageInput = validateNumberDateInput.current.percentValidate(JSON.stringify(e.target.value));
        if (isValidPercentageInput === true) {
          currentPaymentTerm[clickedColName] = e.target.value
          delete e.target.parentElement.dataset.tip;
        } else {
          const currentTblRow = e.target.parentElement.parentElement;

        }
        break;
      case 'calculation_value':
        let isValiddecimalNumberInput = validateNumberDateInput.current.decimalNumber(e.target.value, 2);
        currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
        break;
      case 'formula':
        currentPaymentTerm[clickedColName] = e.target.value
        break;
      default:
        break;
    }
    // update the Payment terms table data.
    const updateDeductionData = [...deductionData]
    const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
    updateDeductionData[pmtTermIndexInArray] = currentPaymentTerm;
    setDeductionData(updateDeductionData);

  }

  //function to check All checkBoxes of po terms and payment terms
  function toggleChkAllBoxes(key) {
    switch (key) {
      case "selectAllEarning":
        $('.selectEarning').prop('checked', $('#selectAllEarning').is(":checked"));
        break;
      case 'PartiallyEarningSelection':
        $('#selectAllEarning').prop('checked', $('input:checkbox.selectEarning:checked').length == $('input:checkbox.selectEarning').length);
        break;
      // For customer contact
      case 'selectAllDeduction':
        $('.selectDeduction').prop('checked', $('#selectAllDeduction').is(":checked"));
        break;
      case 'PartiallyDeductionSelection':
        $('#selectAllDeduction').prop('checked', $('input:checkbox.selectDeduction:checked').length === $('input:checkbox.selectDeduction').length);
        break;
    }
  }

  function handleEarningCheckbox(id) {
    $('input:checkbox[name="selectEarning"][value="' + id + '"]').attr('checked', false);
    const totalChkBoxes = document.querySelectorAll('input[name=selectEarning]').length;
    const totalChkBoxesChked = document.querySelectorAll('input[name=selectEarning]:checked').length;
    if (totalChkBoxes == totalChkBoxesChked) {

      document.getElementById('selectAllEarning').checked = true;
    } else if (totalChkBoxes > totalChkBoxesChked) {
      ;
      document.getElementById('selectAllEarning').checked = false;
    }
  }
  function handleDeductionCheckbox(id) {
    $('input:checkbox[name="selectDeduction"][value="' + id + '"]').attr('checked', false);
    const totalChkBoxes = document.querySelectorAll('input[name=selectDeduction]').length;
    const totalChkBoxesChked = document.querySelectorAll('input[name=selectDeduction]:checked').length;
    if (totalChkBoxes == totalChkBoxesChked) {

      document.getElementById('selectAllDeduction').checked = true;
    } else if (totalChkBoxes > totalChkBoxesChked) {
      ;
      document.getElementById('selectAllDeduction').checked = false;
    }
  }

  //Fn for render payment terms static table 
  const renderEarningTable = useMemo(() => {
    return <>
      {earningData.length !== 0 ?
        <Table className="erp_table " id='earningHead-table' bordered striped hover>
          <thead className="erp_table_head">
            <tr>
              <th className="erp_table_th"><input type='checkbox' className="selectAllEarning" id="selectAllEarning" onClick={(e) => toggleChkAllBoxes('selectAllEarning')} disabled={keyForViewUpdate === 'view'} /> &nbsp; Action</th>
              <th className="erp_table_th">Earning Head </th>
              <th className="erp_table_th">Short Name</th>
              <th className="erp_table_th">Calculation Type</th>
              <th className="erp_table_th">Formula</th>
              <th className="erp_table_th">Calculation Value</th>
            </tr>
          </thead>
          <tbody>
            {
              earningData.map((earnItem, Index) =>
                <tr payTermItemIndex={Index} rowIndex={Index}>

                  <td className="erp_table_td">
                    <input type="checkbox" name="selectEarning" className="selectEarning" value={earnItem.earning_heads_id} id={'selectEarning_' + earnItem.earning_heads_id} onClick={() => handleEarningCheckbox(earnItem.earning_heads_id)} disabled={keyForViewUpdate === 'view'} />
                  </td>
                  <td className="erp_table_td">{earnItem.earning_head_name}</td>
                  <td className="erp_table_td">{earnItem.earning_head_short_name}</td>
                  <td className="erp_table_td">{earnItem.calculation_type}</td>
                  <td className="erp_table_td">
                    {earnItem.calculation_type === 'Amount' ? 'NA' : earnItem.formula}
                    {/* <input type="text" className="erp_input_field mb-0" value={earnItem.formula} id={"formula_" + earnItem.earning_heads_id} onChange={(e) => { FnUpdateEarningsTblData(earnItem, e); }}
                        onBlur={(e) => { FnUpdateEarningsTblData(earnItem, e); }}
                        Headers='formula' disabled={keyForViewUpdate === 'view'}
                      />
                    } */}
                  </td>
                  <td className="erp_table_td">
                    <input type="text" className="erp_input_field_table_txt mb-0 text-end" value={earnItem.calculation_value} attr={earnItem.earning_head_short_name} id={"calculation_value_" + earnItem.earning_heads_id} onChange={(e) => { FnUpdateEarningsTblData(earnItem, e); }}
                      onBlur={(e) => { FnUpdateEarningsTblData(earnItem, e); }}
                      Headers='calculation_value' disabled={keyForViewUpdate === 'view'} maxLength='14' />
                  </td>

                </tr>
              )
            }
          </tbody>
        </Table> : null
      }
    </>
  }, [earningData, deductionData]);

  //Fn for render payment terms static table 
  const renderDeductionTable = useMemo(() => {
    return <>
      {deductionData.length !== 0 ?
        <Table className="erp_table " id='deductionHead-table' bordered striped hover>
          <thead className="erp_table_head">
            <tr>
              <th className="erp_table_th"><input type='checkbox' class="selectAllDeduction" id="selectAllDeduction" onClick={(e) => toggleChkAllBoxes('selectAllDeduction')} disabled={keyForViewUpdate === 'view'} /> &nbsp;Action</th>
              <th className="erp_table_th">Deduction Head </th>
              <th className="erp_table_th">Short Name</th>
              <th className="erp_table_th">Calculation Type</th>
              <th className="erp_table_th">Formula</th>
              <th className="erp_table_th">Calculation Value</th>
            </tr>
          </thead>
          <tbody>
            {
              deductionData.map((deductionItem, Index) =>
                <tr payTermItemIndex={Index} >

                  <td className="erp_table_td">
                    <input type="checkbox" name="selectDeduction" className="selectDeduction" value={deductionItem.deduction_heads_id} id={'selectDeduction_' + deductionItem.deduction_heads_id} onClick={() => handleDeductionCheckbox(deductionItem.deduction_heads_id)} disabled={keyForViewUpdate === 'view'} />
                  </td>
                  <td className="erp_table_td">{deductionItem.deduction_head_name}</td>
                  <td className="erp_table_td">{deductionItem.deduction_head_short_name}</td>
                  <td className="erp_table_td">{deductionItem.calculation_type}</td>
                  <td className="erp_table_td">
                    {deductionItem.calculation_type === 'Amount' ? 'NA' : deductionItem.formula}
                  </td>
                  <td className="erp_table_td">
                    <input type="text" className="erp_input_field_table_txt mb-0 text-end" value={deductionItem.calculation_value} id={"calculation_value_" + deductionItem.deduction_heads_id} onChange={(e) => { updateDeductionTblData(deductionItem, e); }}
                      onBlur={(e) => { updateDeductionTblData(deductionItem, e); }}
                      Headers='calculation_value' disabled={keyForViewUpdate === 'view'} maxLength='14' />
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table> : null}
    </>
  }, [deductionData]);

  function uploadPhotoOnChange(event) {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

    if (file && file.size <= maxSize) {
      $("#error_file_image_path").hide();
      setImageFile(file)
      setImage(URL.createObjectURL(event.target.files[0]));
    } else {
      $("#error_file_image_path").text("File size exceeds 2 MB. Please upload a smaller file.");
      $("#error_file_image_path").show();
      $("#file_image_path").focus();
      return false;
    }

  }

  //------------------- Employee Qualification Functionality --------------------------------------- //
  const setRowCountAndAddRow = () => {
    const lastRowIndex = employeeQualificationData.length - 1;
    const lastRowContactPerson = employeeQualificationData[lastRowIndex].qualification;
    if (lastRowContactPerson !== '' && employeeQualificationData.length < 3) {
      setRowCount(rowCount + 1);
    } else {
      const tableRows = document.querySelectorAll('#employeeQualificationDetailsTbl tbody tr');
      tableRows.forEach(row => {
        const bankContactName = row.querySelector('input[id^="qualification_"]').value;
        if (bankContactName === '') {
          row.querySelector('input[id^="qualification_"]').parentElement.dataset.tip = 'Please fill this Field...!';
          row.querySelector('input[id^="qualification_"]').focus();
          return;
        } else {
          delete row.querySelector('input[id^="qualification_"]').parentElement.dataset.tip;
        }
      }
      )
    }
  };





  const FnUpdateEmployeeQualificationTblRows = (rowData, event) => {
    let eventId = document.getElementById(event.target.id);
    let clickedColName = event.target.getAttribute('Headers');
    let enteredValue = event.target.value;

    switch (clickedColName) {
      case 'qualification':
        rowData[clickedColName] = enteredValue;
        if (enteredValue !== '')
          delete document.querySelector('input[id^="qualification_"]').parentElement.dataset.tip;
        break;

      case 'passing_year':
        rowData[clickedColName] = enteredValue;
        if (!validateNumberDateInput.current.isInteger(enteredValue)) {
        } else {
          delete eventId.parentElement.dataset.tip;
        }

      case 'board_university':
        rowData[clickedColName] = enteredValue;
        if (enteredValue !== '')
          delete document.querySelector('input[id^="board_university_"]').parentElement.dataset.tip;
        break;

      case 'mark_percentage':
        rowData[clickedColName] = enteredValue;
        if (!validateNumberDateInput.current.percentValidate(enteredValue)) {
          eventId.parentElement.dataset.tip = 'Please enter valid percent...!';
        } else {
          delete eventId.parentElement.dataset.tip;
        }
        if (event._reactName === 'onBlur' && enteredValue === '') {
          delete eventId.parentElement.dataset.tip;
        }

        break;
    }

    const employeeQualificationDetails = [...employeeQualificationData]
    const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
    employeeQualificationDetails[arrayIndex] = rowData
    setemployeeQualificationData(employeeQualificationDetails);
  }

  const removeFirstRow = (indexToRemove) => {
    if (indexToRemove !== 0) {
      const updatedemployeeQualificationData = employeeQualificationData.filter((item, index) => index !== indexToRemove);
      setemployeeQualificationData(updatedemployeeQualificationData)
    } else {
      const updatedemployeeQualificationData = [...employeeQualificationData];  // Create a copy of the array
      updatedemployeeQualificationData[0] = { ...educationBlankObject }; // Set values of 0th index to the educationBlankObject
      setemployeeQualificationData(updatedemployeeQualificationData);
    }
  }

  const educationBlankObject = {
    company_id: COMPANY_ID,
    company_branch_id: COMPANY_BRANCH_ID,
    employee_academic_id: 0,
    employee_id: 0,
    qualification: '',
    passing_year: '',
    board_university: '',
    mark_percentage: '',
    created_by: UserName,
  }

  useLayoutEffect(() => {
    const getExistingemployeeQualificationData = [...employeeQualificationData]
    getExistingemployeeQualificationData.push(educationBlankObject)
    setemployeeQualificationData(getExistingemployeeQualificationData)
  }, [rowCount])

  const renderEmployeeQualificationTable = useMemo(() => {
    return <Table id='employeeQualificationDetailsTbl' className={`erp_table`} responsive bordered striped>
      <thead className="erp_table_head">
        <tr>
          <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
          <th className="erp_table_th col-4">Qualification</th>
          <th className="erp_table_th col-2">Passing Year	</th>
          <th className="erp_table_th col-5">Borad / University </th>
          <th className="erp_table_th col-2">Percentage</th>

        </tr>
      </thead>
      <tbody>
        {employeeQualificationData.map((item, index) =>
          <tr rowindex={index} className="sticky-column">
            <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
              <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
              <IoAddCircleOutline className='erp_trAdd_icon' onClick={setRowCountAndAddRow} />

            </td>
            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" className="erp_input_field mb-0"
                      id={`qualification_${index}`} value={item.qualification}
                      onChange={(e) => { FnUpdateEmployeeQualificationTblRows(item, e); }} Headers='qualification' />
                  </>
                  : item.qualification
              }
            </td>



            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`passing_year_${index}`} className="erp_input_field mb-0"
                      value={item.passing_year} Headers='passing_year' maxLength="20"
                      onChange={(e) => {
                        if (validateNumberDateInput.current.isInteger(e.target.value)) {
                          FnUpdateEmployeeQualificationTblRows(item, e);
                        }
                      }} />
                  </>
                  : item.passing_year
              }
            </td>


            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`board_university_${index}`} className="erp_input_field mb-0"
                      value={item.board_university} Headers='board_university' maxLength="500"
                      onChange={(e) => { FnUpdateEmployeeQualificationTblRows(item, e); }} />
                  </>
                  : item.board_university
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="email" id={`mark_percentage_${index}`} className="erp_input_field mb-0"
                      value={item.mark_percentage} Headers='mark_percentage'
                      onChange={(e) => { FnUpdateEmployeeQualificationTblRows(item, e); }} />
                  </>
                  : item.mark_percentage
              }
            </td>

          </tr>
        )}
      </tbody>
    </Table>
  }, [employeeQualificationData])
  //---------------------------------------------------- Accordian data load starts --------------------------------------------------------------------------------
  const FnLoadAccordionData = async (eventKey) => {
    switch (eventKey) {
      case 'documentList':
        await showDocumentRecords();
        break;
      default:
        break;
    }

  }
  //---------------------------------------------------- Accordian data load Ends --------------------------------------------------------------------------------
  // Fn for get document list
  const showDocumentRecords = async () => {
    try {
      if (COMPANY_ID !== null) {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/Documents/FnShowParticularRecord?document_group=${docGroup}&group_id=${employee_id !== 0 ? employee_id : null}`
        );
        const resp = await res.json();
        if (resp.content.length > 0) {
          setDocumentData(resp.content);
        }
      }

    } catch (error) {
      console.log("error: ", error)
    }
  }

  // Fn for get document table
  const renderDocumentTable = useMemo(() => {
    return <>
      <Table className="erp_table " id='document-table' responsive bordered striped>
        <thead className="erp_table_head">
          <tr>
            {/* <th className="erp_table_th">Group Id</th> */}
            {/* <th className="erp_table_th">Document Group</th> */}
            <th className="erp_table_th">Document Name</th>
            <th className="erp_table_th">Registration No</th>
            <th className="erp_table_th">Registration Date</th>
            <th className="erp_table_th">Renewal Date</th>
            {/* <th className="erp_table_th">Document Path</th> */}
            <th className="erp_table_th">Remark</th>
            <th className="erp_table_th">File </th>
          </tr>
        </thead>
        <tbody>
          {
            docData.map((docItem, Index) =>
              <tr rowIndex={Index}>
                {/* <td className="erp_table_td"> {docItem.group_id} </td> */}
                {/* <td className="erp_table_td">{docItem.document_group}</td> */}
                <td className="erp_table_td">{docItem.document_name}</td>
                <td className="erp_table_td ">{docItem.document_registration_no}</td>
                <td className="erp_table_td ">{validateNumberDateInput.current.formatDateToDDMMYYYY(docItem.document_registration_date)}</td>
                <td className="erp_table_td ">{validateNumberDateInput.current.formatDateToDDMMYYYY(docItem.document_renewal_date)}</td>
                {/* <td className="erp_table_td ">{docItem.document_path}</td> */}
                <td className="erp_table_td  ">{docItem.remark}</td>
                {/* <td className="erp_table_td ">
                                  <MDTypography component="label" className="erp-form-label" variant="button" id="logoFile" fontWeight="regular" color="info" >
                                      <Link to={{ pathname: '#', state: { idList, keyForViewUpdate, compType, requestfor } }}  onClick={() => { fetchDocument(docItem) }}>
                                          {docItem.file_name}
                                      </Link></MDTypography>
                              </td> */}
                <td className="erp_table_td">
                  <MDTypography
                    component="label"
                    className="erp-form-label"
                    variant="button"
                    id="logoFile"
                    fontWeight="regular"
                    color="blue"
                    onClick={() => fetchDocument(docItem)}
                    style={{ cursor: 'pointer', color: 'blue' }} // Change cursor to pointer to indicate clickable
                  // onMouseEnter={(e) => e.target.style.color = 'blue'} // Change color on hover
                  // onMouseLeave={(e) => e.target.style.color = 'initial'} // Restore original color when not hovering
                  >
                    {docItem.file_name}
                  </MDTypography>
                </td>

              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  }, [docData]);

  // Fn for get document download
  const fetchDocument = async (docItem) => {
    try {

      const formData = new FormData()
      const data = {
        document_group: docItem.documentGroup,
        group_id: docItem.group_id,
        document_path: docItem.document_path
      }
      formData.append(`getFile`, JSON.stringify(data))
      const requestOptions = {
        method: 'POST',
        body: formData
      };

      const getDocApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnGetDocument`, requestOptions)
      const blob = await getDocApiCall.blob()

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${docItem.file_name}`,);
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);


    } catch (error) {
      console.log("error: ", error)
    }
  }


  //------------------- Employee Accordian experience details--------------------------------------- //


  const setexperienceRowCountAndAddRow = () => {
    const lastRowIndex = employeeExperienceData.length - 1;
    const lastRowContactPerson = employeeExperienceData[lastRowIndex].previous_organisation;
    if (lastRowContactPerson !== '') {
      setexperienceexperienceRowCount(experienceRowCount + 1);
    } else {
      const tableRows = document.querySelectorAll('#employeeExperienceDetailsTbl tbody tr');
      tableRows.forEach(row => {
        const bankContactName = row.querySelector('input[id^="previous_organisation_"]').value;
        if (bankContactName === '') {
          row.querySelector('input[id^="previous_organisation_"]').parentElement.dataset.tip = 'Please fill this Field...!';
          row.querySelector('input[id^="previous_organisation_"]').focus();
          return;
        } else {
          delete row.querySelector('input[id^="previous_organisation_"]').parentElement.dataset.tip;
        }
      }
      )
    }
  };





  const FnUpdateEmployeename_of_organisationTblRows = (rowData, event) => {
    let eventId = document.getElementById(event.target.id);
    let clickedColName = event.target.getAttribute('Headers');
    let enteredValue = event.target.value;

    switch (clickedColName) {
      case 'previous_organisation':
      case 'working_experience':

        rowData[clickedColName] = enteredValue;
        if (!validateNumberDateInput.current.isInteger(enteredValue)) {
        } else {
          delete eventId.parentElement.dataset.tip;
        }
      case 'desigantion':
        rowData[clickedColName] = enteredValue;
        if (enteredValue !== '') {
          delete document.querySelector('input[id^="desigantion_"]').parentElement.dataset.tip;
        }
        break;
      case 'previous_salary':

        if (enteredValue !== '') {
          rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue, 2);
          delete document.querySelector('input[id^="previous_salary_"]').parentElement.dataset.tip;
        } else if (enteredValue === '') {
          rowData[clickedColName] = '';
        }
        break;
    }

    const employeename_of_organisationDetails = [...employeeExperienceData]
    const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
    employeename_of_organisationDetails[arrayIndex] = rowData
    setemployeeExperienceData(employeename_of_organisationDetails);
  }

  const removeexperienceFirstRow = (indexToRemove) => {
    if (indexToRemove !== 0) {
      const updatedemployeeExperienceData = employeeExperienceData.filter((item, index) => index !== indexToRemove);
      setemployeeExperienceData(updatedemployeeExperienceData)
    } else {
      const updatedemployeeExperienceData = [...employeeExperienceData];  // Create a copy of the array
      updatedemployeeExperienceData[0] = { ...experienceBlankObject }; // Set values of 0th index to the experienceBlankObject
      setemployeeExperienceData(updatedemployeeExperienceData);
    }
  }

  const experienceBlankObject = {
    company_id: COMPANY_ID,
    company_branch_id: COMPANY_BRANCH_ID,
    employee_work_experience_id: 0,
    employee_id: 0,
    previous_organisation: '',
    working_experience: '',
    desigantion: '',
    previous_salary: '',
    created_by: UserName,
  }

  useLayoutEffect(() => {
    const getExistingemployeeExperienceData = [...employeeExperienceData]
    getExistingemployeeExperienceData.push(experienceBlankObject)
    setemployeeExperienceData(getExistingemployeeExperienceData)
  }, [experienceRowCount])

  const renderEmployeePerviousExperienceTable = useMemo(() => {
    return <Table id='employeeExperienceDetailsTbl' className={`erp_table`} responsive bordered striped>
      <thead className="erp_table_head">
        <tr>
          <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}> Action</th>
          <th className="erp_table_th col-3">Name Of Organisation</th>
          <th className="erp_table_th col-3">Working Duration</th>
          <th className="erp_table_th col-3">Previous Salary</th>
          <th className="erp_table_th col-3">Position</th>
        </tr>
      </thead>
      <tbody>
        {employeeExperienceData.map((item, index) =>
          <tr rowindex={index} className="sticky-column">
            <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`}>
              <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeexperienceFirstRow(index)} />
              <IoAddCircleOutline className='erp_trAdd_icon' onClick={setexperienceRowCountAndAddRow} />
            </td>
            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" className="erp_input_field mb-0"
                      id={`previous_organisation_${index}`} value={item.previous_organisation}
                      onChange={(e) => { FnUpdateEmployeename_of_organisationTblRows(item, e); }} Headers='previous_organisation' />
                  </>
                  : item.previous_organisation
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`working_experience_${index}`} className="erp_input_field mb-0"
                      value={item.working_experience} Headers='working_experience' maxLength="20"
                      onChange={(e) => { FnUpdateEmployeename_of_organisationTblRows(item, e); }} />
                  </>
                  : item.working_experience
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`previous_salary_${index}`} className="erp_input_field mb-0"
                      value={item.previous_salary} Headers='previous_salary' maxLength="500"
                      onChange={(e) => { FnUpdateEmployeename_of_organisationTblRows(item, e); }} />
                  </>
                  : item.previous_salary
              }
            </td>

            <td className='erp_table_td'>
              {
                keyForViewUpdate !== 'view'
                  ? <>
                    <input type="text" id={`desigantion_${index}`} className="erp_input_field mb-0"
                      value={item.desigantion} Headers='desigantion' maxLength="500"
                      onChange={(e) => { FnUpdateEmployeename_of_organisationTblRows(item, e); }} />
                  </>
                  : item.desigantion
              }
            </td>

          </tr>
        )}
      </tbody>
    </Table>
  }, [employeeExperienceData])
  //---------------------------------------------------- Accordian exprince details --------------------------------------------------------------------------------



  return (
    <MDBox>
      <ComboBox ref={combobox} />
      <FrmValidations ref={frmValidation} />
      <GenerateMaterialId ref={generateMaterialIdAPiCall} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <ReactToPrint
        content={() => printRef.current}
      />


      {/* //case no. 1 chnges by ujjwala 10/1/2024 Start */}
      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress />
            <span>Loading...</span>
          </div>
        </div> :
        ''}
      <form id='employeeFormId'>
        <div className='row'>

          {/* 1 st Column */}
          <div className='col-sm-4 erp_form_col_div'>

            {/* Employment Details */}

            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Employee Group<span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <select id="cmb_employee_group_type" className="form-select form-select-sm" value={cmb_employee_group_type} onChange={e => { setEmployeeGroupType(e.target.value); comboBoxesOnChange('Employee_group'); validateEmpInfoFields(); }} maxLength="255" >
                  <option value="" disabled>Select</option>
                  {employeeGroupTypeOptions?.map(groupType => (
                    <option value={groupType.field_name} property_value={groupType.property_value}>{groupType.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cmb_employee_group_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Employee Type <span className="required">*</span></Form.Label>
              </div>
              <div className="col">
                <select id="cmb_employee_type" className="form-select form-select-sm" value={cmb_employee_type} onChange={e => { setEmployeeType(e.target.value); comboBoxesOnChange('Employee_type'); validateEmpInfoFields(); }} maxLength="255" >
                  <option value="" disabled>Select</option>
                  {employeeTypeOptions?.map(employeeTypes => (
                    <option value={employeeTypes.field_name} property_value={employeeTypes.property_value}>{employeeTypes.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cmb_employee_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Employee Code <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="employee_code" className="erp_input_field" value={txt_employee_code} onInput={e => { setEmployeeCode(e.target.value); validateEmpInfoFields(); }} maxLength="255" />
                <MDTypography variant="button" id="error_employee_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Old Employee Code</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_old_employee_code" className="erp_input_field" value={txt_old_employee_code} onChange={e => { setOldEmployeeCode(e.target.value); validateEmpInfoFields(); }} maxLength="255" optional="optional" />
                <MDTypography variant="button" id="error_txt_old_employee_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Punch Code <span className="required">*</span> </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_employee_machine_code" className="erp_input_field" value={txt_employee_machine_code} onChange={e => { setEmployeeMachineCode(e.target.value); validateEmpInfoFields(); }} maxLength="255" />
                <MDTypography variant="button" id="error_txt_employee_machine_code" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Salutation </Form.Label>
              </div>
              <div className="col">
                <select id="cmb_salutation" className="form-select form-select-sm" value={cmb_salutation} onInput={e => { setSalutation(e.target.value); inputBoxesOnChange('EmployeeName'); }} optional="optional" >
                  <option value="" disabled>Select</option>
                  {salutationOptions?.map(salutation => (
                    <option value={salutation.field_name}>{salutation.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cmb_salutation" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">First Name <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_first_name" className="erp_input_field" value={txt_first_name} onInput={e => { setFirstName(e.target.value.trim().charAt(0).toUpperCase() + e.target.value.slice(1)); validateEmpInfoFields(); inputBoxesOnChange('EmployeeName'); }} maxLength="100" />
                <MDTypography variant="button" id="error_txt_first_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Middle Name </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_middle_name" className="erp_input_field" value={txt_middle_name} onInput={e => { setMiddleName(e.target.value.trim().charAt(0).toUpperCase() + e.target.value.slice(1)); inputBoxesOnChange('EmployeeName'); }} maxLength="100" optional="optional" />
                <MDTypography variant="button" id="error_txt_middle_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Last Name <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_last_name" className="erp_input_field" value={txt_last_name} onInput={e => { setLastName(e.target.value.trim().charAt(0).toUpperCase() + e.target.value.slice(1)); validateEmpInfoFields(); inputBoxesOnChange('EmployeeName'); }} maxLength="100" />
                <MDTypography variant="button" id="error_txt_last_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Full Name <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_employee_name" className="erp_input_field" value={txt_employee_name} onChange={e => { validateEmpInfoFields(); }} maxLength="300" />
                <MDTypography variant="button" id="error_txt_employee_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Employee Status <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_employee_status' className='form-select form-select-sm' value={cmb_employee_status} onChange={e => { setEmployeeStatus(e.target.value); validateEmpInfoFields(); }} >
                  <option value="" disabled>Select</option>
                  {employeeStatusOptions?.map(status => (
                    <option value={status.field_name}>{status.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_employee_status" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              {(cmb_employee_status === 'Left' || cmb_employee_status === 'Suspended') && (
                <>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">
                      {cmb_employee_status === 'Left' ? 'Left Date' : 'Suspended Date'}
                      <span className="required">*</span>
                    </Form.Label>
                  </div>
                  <div className='col'>
                    <div className="col-sm-8 mb-1">
                      <DatePicker selected={dt_leftorSuspended_date} id="dt_leftorSuspended_date" onChange={(date) => handleDateChange('leftdate', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" />
                      <MDTypography variant="button" id="error_dt_leftorSuspended_date" className="erp_validation mt-2" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </div>

                    {/* <Form.Control type="date" className="erp_input_field number" id="dt_leftorSuspended_date" value={dt_leftorSuspended_date}
                      onChange={e => { setLeftorSuspendedDate(e.target.value); validateEmpInfoFields(); }}
                    /> */}
                    <MDTypography variant="button" id="error_dt_leftorSuspended_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                    </MDTypography>
                  </div>
                </>
              )}
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Current Address<span className="required">*</span> </Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} id="txt_current_address" className="erp_txt_area" value={txt_current_address} onInput={e => { setCurrentAddress(e.target.value); validateEmpInfoFields(); }} maxlength="1000" />
                <MDTypography variant="button" id="error_txt_current_address" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Current Pincode<span className="required">*</span> </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field number" id="txt_current_pincode" value={txt_current_pincode} onInput={e => { validateErrorMsgsNumericInput(e); validateEmpInfoFields(); }} maxlength="6" />
                <MDTypography variant="button" id="error_txt_current_pincode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm'>
                <Form>
                  <div className="erp_form_radio text-danger">
                    <div className="fCheck"> <Form.Check className="erp_radio_button" id="permt_add_chechbox" label="Is Permanent address, same as current address ?" type="checkbox" value={chk_pmt_add} checked={chk_pmt_add} name="chk_pmt_add" onChange={(e) => validateCheckBox()} /> </div>
                  </div>
                </Form>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Permanant Address{chk_pmt_add == true ? <span className="required">*</span> : ""}</Form.Label>
              </div>
              <div className='col'>
                <Form.Control as="textarea" rows={1} id="txt_permanant_address" className="erp_txt_area" value={txt_permanant_address} onInput={e => { setPermanantAddress(e.target.value); }} onChange={e => { validateEmpInfoFields(); }} maxlength="1000" optional={`${chk_pmt_add !== true ? "optional" : ''}`} />
                <MDTypography variant="button" id="error_txt_permanant_address" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Permanant Pincode{chk_pmt_add == true ? <span className="required">*</span> : ""}</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field number" id="txt_permanant_pincode" value={txt_permanant_pincode} onInput={e => { validateErrorMsgsNumericInput(e); }} onChange={e => { validateEmpInfoFields(); }} maxlength="6" optional={`${chk_pmt_add !== true ? "optional" : ''}`} />
                <MDTypography variant="button" id="error_txt_permanant_pincode" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row  mb-1'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Country <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                {/* <select size="sm" id="cmb_country_id" className="form-select form-select-sm" value={cmb_country_id} onChange={(e) => { comboBoxesOnChange("Country"); validateEmpInfoFields(); }}>
                  <option value="" disabled>Select </option>
                  {countryOptions?.map(country => (
                    <option value={country.field_id} countryname={country.field_name}>{country.field_name}</option>
                  ))}
                </select> */}

                <Select
                  ref={cmb_country_id_ref}
                  options={countryOptions}
                  isDisabled={['view'].includes(keyForViewUpdate)}
                  inputId="cmb_country_id" // Provide the ID for the input box
                  value={countryOptions.find(option => option.value === cmb_country_id)}
                  onChange={(selectedOpt) => {
                    setCountryId(selectedOpt.value);
                    cmb_country_id_ref.current = selectedOpt;
                    comboBoxesOnChange("Country");
                    validateEmpInfoFields();
                  }}
                  placeholder="Search for a country..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view', 'approve'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }}
                />
                <MDTypography variant="button" id="error_cmb_country_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row  mb-1'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">State <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Select
                  ref={cmb_state_id_ref}
                  options={stateOptions}
                  isDisabled={['view'].includes(keyForViewUpdate)}
                  inputId="cmb_state_id" // Provide the ID for the input box
                  value={stateOptions.length > 0 ? stateOptions.find(option => option.value === cmb_state_id) : null}
                  onChange={(selectedOpt) => {
                    setStateId(selectedOpt.value);
                    cmb_state_id_ref.current = selectedOpt;
                    comboBoxesOnChange("State");
                    validateEmpInfoFields();
                  }}
                  placeholder="Search for a state..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }}
                />
                <MDTypography variant="button" id="error_cmb_state_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

          </div>

          {/* 2 nd Column */}
          <div className='col-sm-4 erp_form_col_div'>
            {/* Personal Details */}
            <div className='row  mb-1'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">District <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Select
                  ref={cmb_district_id_ref}
                  options={districtOptions}
                  isDisabled={['view'].includes(keyForViewUpdate)}
                  inputId="cmb_district_id" // Provide the ID for the input box
                  value={districtOptions.length > 0 ? districtOptions.find(option => option.value === cmb_district_id) : null}
                  onChange={(selectedOpt) => {
                    setDistrictId(selectedOpt.value);
                    cmb_district_id_ref.current = selectedOpt;
                    comboBoxesOnChange("District");
                    validateEmpInfoFields();
                  }}
                  placeholder="Search for a district..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }}
                />
                <MDTypography variant="button" id="error_cmb_district_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row  mb-1'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">City <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Select
                  ref={cmb_city_id_ref}
                  options={cityOptions}
                  isDisabled={['view'].includes(keyForViewUpdate)}
                  inputId="cmb_city_id" // Provide the ID for the input box
                  value={cityOptions.length > 2 ? cityOptions.find(option => option.value === cmb_city_id) : null}
                  onChange={(selectedOpt) => {
                    cmb_city_id_ref.current = selectedOpt;
                    comboBoxesOnChange("City");
                    validateEmpInfoFields();
                  }}
                  placeholder="Search for a city..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }}
                />
                <MDTypography variant="button" id="error_cmb_city_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 mt-1">
                <Form.Label className="erp-form-label">Date Of Birth</Form.Label>
              </div>
              <div className="col-sm-8 mb-1">
                <DatePicker selected={dt_date_of_birth} id="dt_date_of_birth" onChange={(date) => handleDateChange('DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" />
                <MDTypography variant="button" id="error_dt_date_of_birth" className="erp_validation mt-2" fontWeight="regular" color="error" style={{ display: "none" }} />
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Gender </Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_gender' className='form-select form-select-sm' value={cmb_gender} onChange={e => { setGender(e.target.value); }} optional="optional">
                  <option value="" disabled>Select</option>
                  {genderOptions?.map(gender => (
                    <option value={gender.field_name}>{gender.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_gender" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Blood Group</Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_blood_group' className='form-select form-select-sm' value={cmb_blood_group} onChange={e => { setBloodGroupId(e.target.value); }} optional="optional">
                  <option value="" disabled>Select </option>
                  {bloodGroupsOptions?.map(bloodGroup => (
                    <option value={bloodGroup.field_name}>{bloodGroup.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_blood_group" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">PAN No. </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id="txt_pan_no" className="erp_input_field" value={txt_pan_no} onInput={e => { setPanNo(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="10" optional="optional" />
                <MDTypography variant="button" id="error_txt_pan_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Passport No. </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='txt_passport_no' className="erp_input_field" value={txt_passport_no} onInput={e => { setPassportNo(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="10" optional='optional' />
                <MDTypography variant="button" id="error_txt_passport_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Driving Licence </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_driving_licence" value={txt_driving_licence} onInput={e => { setDrivingLicence(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="16" optional='optional' />
                <MDTypography variant="button" id="error_txt_driving_licence" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>
            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Region </Form.Label>
              </div>
              <div className="col">
                <select id="cmb_region_id" value={cmb_region_id} className="form-select form-select-sm" onChange={(e) => { setRegionId(e.target.value); }} optional="optional">
                  <option value="" disabled="true">Select</option>
                  {regionOptions?.map(region => (
                    <option value={region.field_id} key={region.field_id}>{region.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cmb_region_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Telephone No.</Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='telPhoneCountryCode' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="txt_phone_no" value={txt_phone_no} onInput={(e) => { validateErrorMsgsNumericInput(e); validateEmpInfoFields(); validateTelePhone(e.target.value) }} maxLength="15" minLength="11" optional='optional' />
                </span>
                <MDTypography variant="button" id="error_txt_phone_no" className="erp_validation mt-2" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Primary Cell No. </Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='priCellCountryCode' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="txt_cell_no1" value={txt_cell_no1} onInput={(e) => { validateErrorMsgsNumericInput(e); validateEmpInfoFields(); }} maxLength="10" minLength="10" optional='optional' />
                </span>
                <MDTypography variant="button" id="error_txt_cell_no1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Secd. Cell No.</Form.Label>
              </div>
              <div className='col'>
                <span className='erp_phone' >
                  <select size="sm" id='secCellCountryCode' className='form-select-phone'>
                    {countryCodeOptions?.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <Form.Control type="text" className="erp_input_field erp_phn_border" id="txt_cell_no2" value={txt_cell_no2} onInput={(e) => { validateErrorMsgsNumericInput(e); }} maxLength="10" minLength="10" optional='optional' />
                </span>
                <MDTypography variant="button" id="error_txt_cell_no2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Primary Email</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="email" id="txt_email_id1" className="erp_input_field" value={txt_email_id1} onInput={e => { setEmailId1(e.target.value); validateEmpInfoFields() }} maxLength="100" optional='optional' />
                <MDTypography variant="button" id="error_txt_email_id1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Secondary Email</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="email" id="txt_email_id2" className="erp_input_field" value={txt_email_id2} onInput={e => { setEmailId2(e.target.value); validateEmpInfoFields() }} maxLength="100" optional="optional" />
                <MDTypography variant="button" id="error1_txt_email_id2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Religion </Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_religion' className='form-select form-select-sm' value={cmb_religion} onChange={e => { setReligion(e.target.value); }} optional="optional">
                  <option value="" disabled>Select</option>
                  {religionOptions?.map(religion => (
                    <option value={religion.field_name}>{religion.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_religion" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Category </Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_category_id' className='form-select form-select-sm' value={cmb_category_id} onChange={e => { setCategoryId(e.target.value); }} optional="optional">
                  <option value="" disabled>Select</option>
                  {categoryOptions?.map(category => (
                    <option value={category.field_name}>{category.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_category_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Caste </Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_caste_id' className='form-select form-select-sm' value={cmb_caste_id} onChange={e => { setCasteId(e.target.value); }} optional="optional">
                  <option value="" disabled>Select</option>
                  {casteOptions?.map(caste => (
                    <option value={caste.field_name}>{caste.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_caste_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Aadhar No.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" id='txt_aadhar_card_no' className="erp_input_field" value={txt_aadhar_card_no} onInput={e => { validateErrorMsgsNumericInput(e); validateEmpInfoFields() }} maxLength="12" optional="optional" />
                <MDTypography variant="button" id="error_txt_aadhar_card_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
          </div>

          {/* 3rd Column */}
          <div className='col-sm-4 erp_form_col_div'>
            {/* Residentail Details */}

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Marital Status </Form.Label>
              </div>
              <div className='col'>
                <select id="empMaritalStatusId" className='form-select form-select-sm' value={cmb_marital_status} onChange={e => { setMaritalStatus(e.target.value); validateEmpInfoFields() }} optional="optional">
                  <option value="" disabled>Select </option>
                  {
                    maritalStatusOptions?.map(maritalStatus => (
                      <option value={maritalStatus.field_name}>{maritalStatus.field_name}</option>
                    ))
                  }
                </select>
                <MDTypography variant="button" id="error_empMaritalStatusId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Emp. Destination </Form.Label>
              </div>
              <div className='col'>
                <select id='cmb_destination_id' className='form-select form-select-sm' value={cmb_destination_id} onChange={e => { setDestionationId(e.target.value); comboBoxesOnChange("EmployeeDestination"); }} optional="optional">
                  <option value="" disabled>Select</option>
                  <option value="0">Add New Record+</option>
                  {destinationOptions?.map(destination => (
                    <option value={destination.field_id}>{destination.field_name}</option>
                  ))
                  }
                </select>
                <MDTypography variant="button" id="error_cmb_destination_id" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Reference </Form.Label>
              </div>

              <div className='col'>
                <Form.Control type="text" id='txt_reference_id' className="erp_input_field" value={txt_reference_id} onChange={e => { setReferenceId(e.target.value); }} maxLength="100" optional="optional" />
                <MDTypography variant="button" id="error_txt_reference_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            {/* Documention Details */}


            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Primary Bank </Form.Label>
              </div>
              <div className="col">
                <Select ref={cmb_bank_id_1_ref}
                  options={bankNamesOptions}
                  isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                  inputId="cmb_bank_id_1" // Provide the ID for the input box
                  value={bankNamesOptions.length > 0 ? bankNamesOptions.find(option => option.value === cmb_bank_id_1) : null}
                  onChange={(selectedOpt) => {
                    cmb_bank_id_1_ref.current = selectedOpt;
                    setBankId1(selectedOpt.value)
                    comboBoxesOnChange("primaryBank");
                  }}
                  placeholder="Search for a bank name..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view', 'approve'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }} optional="optional"
                />
                <MDTypography variant="button" id="error_cmb_bank_id_1" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
              <div className={keyForViewUpdate !== 'view' ? 'col-sm-1' : 'd-none'}>
                <Tooltip title="Refresh" placement="top">
                  <MDTypography>
                    <MdRefresh onClick={() => FnRefreshbtn("PrimaryBank")} style={{ color: 'black' }} />
                  </MDTypography>
                </Tooltip>
              </div>
            </div>

            <div className='row'>
              <div className="col-sm-3 col-lg-4 pe-0">
                <Form.Label className="erp-form-label">Primany A/C Holder Name</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id='txt_prim_account_holder_name' className="erp_input_field" value={txt_prim_account_holder_name} onChange={(e) => { setprim_account_holder_name(e.target.value); validateEmpInfoFields(); }}
                  optional="optional" />
                <MDTypography variant="button" id="error_txt_prim_account_holder_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>
            {/* <div className='row'>
              <div className="col-sm-3 col-lg-4 pe-0">
                <Form.Label className="erp-form-label">Account Holder Name{(cmb_bank_id_1 !== '1' && cmb_bank_id_1 !== 1 && cmb_bank_id_1 !== undefined) ? <span className="required">*</span> : ""}</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id='txt_prim_account_holder_name' className="erp_input_field" value={txt_prim_account_holder_name} onChange={(e) => { setprim_account_holder_name(e.target.value); validateEmpInfoFields(); }}
                  {...((cmb_bank_id_1 === '1' || cmb_bank_id_1 === 1 || cmb_bank_id_1 === undefined) && { optional: 'optional' })} />
                <MDTypography variant="button" id="error_txt_prim_account_holder_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div> */}

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Prim. Bank A/c No.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_account_no1" value={txt_account_no1}
                  onInput={e => { validateErrorMsgsNumericInput(e); validateEmpInfoFields(); }} optional='optional'

                  maxLength="17" />
                <MDTypography variant="button" id="error_txt_account_no1" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>
            {/* <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Prim. Bank A/c No.
                  {(cmb_bank_id_1 !== '1' && cmb_bank_id_1 !== 1 && cmb_bank_id_1 !== undefined) ? <span className="required">*</span> : ""}
                </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_account_no1" value={txt_account_no1}
                  onInput={e => { validateErrorMsgsNumericInput(e); validateEmpInfoFields(); }}
                  {...((cmb_bank_id_1 === '1' || cmb_bank_id_1 === 1 || cmb_bank_id_1 === undefined) && { optional: 'optional' })}
                  maxLength="17" />
                <MDTypography variant="button" id="error_txt_account_no1" className={`erp_validation ${(cmb_bank_id_1 === '1' || cmb_bank_id_1 === 1 || cmb_bank_id_1 === undefined) ? "d-none" : 'display'}`} fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div> */}

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Primary Bank IFSC

                </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_ifsc_code1" value={txt_ifsc_code1} onInput={e => { setIFSCCode1(e.target.value.split(' ').join('').toUpperCase()); validateEmpInfoFields(); }} maxLength="11"
                  optional="optional"

                />
                <MDTypography variant="button" id="error_txt_ifsc_code1" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>

            {/* <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Secd. Bank Name</Form.Label>
              </div>
              <div className="col">
                <select id="cmb_bank_id_2" className="form-select form-select-sm" value={cmb_bank_id_2} onChange={e => { setBankId2(e.target.value); comboBoxesOnChange("SecondaryBankName"); }} optional="optional">
                  <option value="" disabled>Select</option>
                  <option value="0">Add New Record+</option>
                  {bankNamesOptions?.map(bankId => (
                    <option value={bankId.field_id}>{bankId.field_name}</option>
                  ))}
                </select>
                <MDTypography variant="button" id="error_cmb_bank_id_2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
              <div className={keyForViewUpdate !== 'view' ? 'col-sm-1' : 'd-none'}>
                <Tooltip title="Refresh" placement="top">
                  <MDTypography>
                    <MdRefresh onClick={() => FnRefreshbtn("SecondaryBank")} style={{ color: 'black' }} />
                  </MDTypography>
                </Tooltip>
              </div>
            </div> */}
            <div className='row'>
              <div className="col-sm-4">
                <Form.Label className="erp-form-label">Secondary Bank  </Form.Label>
              </div>
              <div className="col">
                <Select ref={cmb_bank_id_2_ref}
                  options={bankNamesOptions}
                  isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                  inputId="cmb_bank_id_2" // Provide the ID for the input box
                  value={bankNamesOptions.length > 0 ? bankNamesOptions.find(option => option.value === cmb_bank_id_2) : null}
                  onChange={(selectedOpt) => {
                    cmb_bank_id_2_ref.current = selectedOpt;
                    setBankId2(selectedOpt.value)
                    comboBoxesOnChange("secdBank");
                  }}
                  placeholder="Search for a bank name..."
                  className="form-search-custom"
                  classNamePrefix="custom-select" // Add custom prefix for class names
                  disabled={['view', 'approve'].includes(keyForViewUpdate)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      fontSize: '12px' // Adjust the font size as per your requirement
                    })
                  }}
                />
                <MDTypography variant="button" id="error_cmb_bank_id_2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
              <div className={keyForViewUpdate !== 'view' ? 'col-sm-1' : 'd-none'}>
                <Tooltip title="Refresh" placement="top">
                  <MDTypography>
                    <MdRefresh onClick={() => FnRefreshbtn("SecondaryBank")} style={{ color: 'black' }} />
                  </MDTypography>
                </Tooltip>
              </div>
            </div>

            <div className='row'>
              <div className="col-sm-3 col-lg-4 pe-0">
                <Form.Label className="erp-form-label">Secondary A/C Holder Name</Form.Label>
              </div>
              <div className="col">
                <Form.Control type="text" id='txt_sec_account_holder_name' className="erp_input_field " value={txt_sec_account_holder_name} onChange={(e) => { setsec_account_holder_name(e.target.value); validateEmpInfoFields(); }} optional="optional" />
                <MDTypography variant="button" id="error_txt_sec_account_holder_name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>


            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Secd. Bank A/c No.</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_account_no2" value={txt_account_no2}
                  onInput={e => { validateErrorMsgsNumericInput(e); }} maxLength="17" optional='optional' />
                <MDTypography variant="button" id="error_txt_account_no2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} maxLength="20" >
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Secd. Bank IFSC</Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="txt_ifsc_code2" value={txt_ifsc_code2} onInput={e => { setIFSCCode2(e.target.value.split(' ').join('').toUpperCase()); }} maxLength="11" optional='optional' />
                <MDTypography variant="button" id="error_txt_ifsc_code2" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Finance A/c No. </Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="text" className="erp_input_field" id="finance_account_no" value={finance_account_no} onInput={e => { validateErrorMsgsNumericInput(e); }} maxLength="10" optional='optional' />
                <MDTypography variant="button" id="error_finance_account_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                </MDTypography>
              </div>
            </div>


            <div className='row d-none'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">UserName <span className="required">*</span></Form.Label>
              </div>
              <div className='col'>
                <Form.Control type="hide" className="erp_input_field" id="txt_username" value={txt_username} onInput={(e) => { setUserName(e.target.value.trim()); }} maxlength="200" optional="optional" ref={usernameRef} />
                <MDTypography variant="button" id="error_txt_username" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            {
              keyForViewUpdate === "update" || keyForViewUpdate === 'view' ?
                <div className='row d-none'>
                  <div className='col-sm-4'>
                    <Form.Label className="erp-form-label">Password <span className="required">*</span></Form.Label>
                  </div>
                  <div className='col-sm-8'>
                    <div className="input-group mb-3">
                      <Form.Control type={showPassword ? 'text' : 'password'} className="erp_input_field number" id="txt_password" value={txt_password} maxLength="50" optional="optional" disabled={keyForViewUpdate === 'view'} />
                      <span className="input-group-text" id="basic-addon2">
                        {showPassword ? (<AiFillEye onClick={togglePasswordhideandshow} />) : (<AiFillEyeInvisible onClick={togglePasswordhideandshow} />)}
                      </span>
                    </div>
                    <MDTypography variant="button" id="error_txt_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                    </MDTypography>
                  </div>
                </div>
                : ""
            }

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Is Active </Form.Label>
              </div>
              <div className='col'>
                <Form>
                  <div className="erp_form_radio">
                    <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="1" name="employeeIsActive" disabled={keyForViewUpdate === "view"} defaultChecked /></div>
                    <div className="sCheck"><Form.Check className="erp_radio_button" label="No" value="0" type="radio" name="employeeIsActive" disabled={keyForViewUpdate === "view"} />  </div>
                  </div>
                </Form>
              </div>
            </div>

            <div className='row'>
              <div className='col-sm-4'>
                <Form.Label className="erp-form-label">Upload Photo</Form.Label>
              </div>
              <div className='col'>
                <Form.Control
                  type="file"
                  id='file_image_path'
                  className="erp_input_field"
                  onChange={e => { uploadPhotoOnChange(e); }}
                  optional='optional'
                  accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .webp"
                />
                <MDTypography variant="button" id="error_file_image_path" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                </MDTypography>
              </div>
            </div>

            <div className={`${uploadImage !== null && uploadImage !== undefined ? 'display row justify-content-end p-3' : 'd-none'}`}>

              <div class="card p-0 m-0" style={{ width: '130px' }}>
                <img src={uploadImage} class="card-img-top" style={{ width: '150px', height: 'auto' }} alt="..." />
              </div>
            </div>
          </div>
        </div>
      </form>
      <hr />

      {/* Employee Work Profile Accordian */}
      <Accordion defaultActiveKey="0" >
        <Accordion.Item eventKey={0}>
          <Accordion.Header className="erp-form-label-md">Workprofile Information</Accordion.Header>
          <Accordion.Body>
            <form id='employeeWorkProfFormId'>
              <div className='row'>
                {/* 1 st Column */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row  mb-1'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Grade <span className="required">*</span></Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_grade_id_ref}
                        options={salaryGrades}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_grade_id" // Provide the ID for the input box
                        value={salaryGrades.length > 2 ? salaryGrades.find(option => option.value === cmb_grade_id) : null}
                        onChange={(selectedOpt) => {
                          if (selectedOpt.value !== '0')
                            setGradeId(selectedOpt.value);
                          cmb_grade_id_ref.current = selectedOpt;
                          comboBoxesOnChange("cmb_grade_id");
                        }}
                        placeholder="Search for a grade..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_grade_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row  mb-1'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Department Group
                        {/* <span className="required">*</span> */}
                      </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_department_group_id_ref}
                        options={departmentGroupOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_department_group_id" // Provide the ID for the input box
                        value={departmentGroupOptions.find(option => option.value === cmb_department_group_id)}
                        onChange={(selectedOpt) => {
                          // setDepartmentGroupId(selectedOpt.value);
                          cmb_department_group_id_ref.current = selectedOpt;
                          comboBoxesOnChange("DepartmentGroup");
                        }}
                        placeholder="Search for a department..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_department_group_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row  mb-1'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Department <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <Select ref={cmb_department_id_ref}
                        options={departmentOptions}
                        // isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        isDisabled={true}
                        inputId="cmb_department_id" // Provide the ID for the input box
                        value={departmentOptions.length > 1 ? departmentOptions.find(option => option.value === cmb_department_id) : null}
                        onChange={(selectedOpt) => {
                          setDepartmentId(selectedOpt.value);
                          cmb_department_id_ref.current = selectedOpt;
                          comboBoxesOnChange("Department");
                        }}
                        placeholder="Search for a department..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_department_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row  mb-1'>

                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Sub-Department
                        {/* <span className="required">*</span> */}
                      </Form.Label>

                    </div>
                    <div className='col'>
                      <Select ref={cmb_subdepartment_group_id_ref}
                        options={subDepartmentGroupOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_subdepartment_group_id" // Provide the ID for the input box
                        value={subDepartmentGroupOptions.length > 1 ? subDepartmentGroupOptions.find(option => option.value === cmb_subdepartment_group_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_subdepartment_group_id_ref.current = selectedOpt;
                          comboBoxesOnChange("SubDepartment");
                        }}
                        placeholder="Search for a Sub-Department..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_subdepartment_group_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  {/* <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Designation </Form.Label>
                    </div>
                    <div className='col'>
                      <Form.Control type="text" id="txt_designation" className="erp_input_field" value={txt_designation} maxLength="10" optional='optional' />
                      <MDTypography variant="button" id="error_txt_designation" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}

                  {/* <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Designation <span className="required">*</span></Form.Label>
                    </div>
                    <div className='col'>
                      <select size="sm" id="cmb_designation_id" className="form-select form-select-sm" value={cmb_designation_id} onChange={(e) => { setDesignationId(e.target.value); comboBoxesOnChange('Designation'); validateEmpWorkProfFields(); }}>
                        <option value="" disabled="true">Select</option>
                        <option value="0">Add New Record+</option>
                        {designationIdOptions?.map(designation => (
                          <option value={designation.field_id} key={designation.field_id}>{designation.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_designation_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}

                  <div className='row  mb-1'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Designation </Form.Label>
                    </div>
                    <div className='col'>
                      <Select ref={cmb_designation_id_ref}
                        options={designationIdOptions}
                        isDisabled={true}
                        inputId="cmb_designation_id" // Provide the ID for the input box
                        value={designationIdOptions.length > 1 ? designationIdOptions.find(option => option.value === cmb_designation_id) : null}
                        onChange={(selectedOpt) => {
                          setDesignationId(selectedOpt.value);
                          setDesignation(selectedOpt.label);
                          cmb_designation_id_ref.current = selectedOpt;
                        }}
                        placeholder="Search for a Designation..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_designation_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
                    </div>
                  </div>

                  <div className='row  mb-1'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Reporting To</Form.Label>
                    </div>
                    <div className='col'>
                      <Select ref={cmb_reproting_to_id_ref}
                        options={reportingToOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_reproting_to_id" // Provide the ID for the input box
                        value={reportingToOptions.length > 1 ? reportingToOptions.find(option => option.value === cmb_reproting_to_id) : null}
                        onChange={(selectedOpt) => {
                          setReportingToId(selectedOpt.value);
                          cmb_reproting_to_id_ref.current = selectedOpt;
                          comboBoxesOnChange("Reportingto");
                        }}
                        placeholder="Search for a Reporting to..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_reproting_to_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                    <div className={keyForViewUpdate !== 'view' ? 'col-sm-1' : 'd-none'}>
                      <Tooltip title="Refresh" placement="top">
                        <MdRefresh onClick={() => FnRefreshbtn("ReportingTo")} style={{ color: 'black' }} />
                      </Tooltip>
                    </div>
                  </div>
                  {(UserId === 1 || UserId === 3 || UserId === "1" || UserId === "3") && (

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Attendance Exclude </Form.Label>
                      </div>
                      <div className='col'>
                        <Form>
                          <div className="erp_form_radio">
                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="attendance_exclude_flag" checked={attendance_exclude_flag} onClick={() => setAttendance_exclude_flag(true)} /> </div>
                            <div className="ms-2"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="attendance_exclude_flag" checked={!attendance_exclude_flag} onClick={() => setAttendance_exclude_flag(false)} /> </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2 nd Column */}
                <div className='col-sm-4 erp_form_col_div'>
                  <div className='row'>
                    <div className="col-sm-4"> <Form.Label className="erp-form-label"> Job Type </Form.Label> {cmb_employee_group_type === 'Workers' ? <span className="required">*</span> : null}</div>
                    <div className="col">
                      <Select ref={jobTypeComboRef}
                        options={jobTypeOpts}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_job_type_id"
                        value={jobTypeOpts.length > 0 ? jobTypeOpts.find(option => option.value === cmb_job_type_id) : null}
                        onChange={(selectedOpt) => {
                          jobTypeComboRef.current = selectedOpt;
                          setJobTypeId(selectedOpt.value)
                        }}
                        placeholder="Search for a Job Type..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({ ...provided, fontSize: '12px' }),
                          singleValue: (provided, state) => ({ ...provided, fontSize: '12px' }),
                          input: (provided, state) => ({ ...provided, fontSize: '12px' })
                        }}
                        optional='optional'
                      />
                      <MDTypography variant="button" id="error_cmb_job_type_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Weekly Off </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_weeklyoff_id_ref}
                        options={weeklyOffOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_weeklyoff_id" // Provide the ID for the input box
                        value={weeklyOffOptions.length > 0 ? weeklyOffOptions.find(option => option.value === cmb_weeklyoff_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_weeklyoff_id_ref.current = selectedOpt;
                          setWeeklyOffId(selectedOpt.value)
                          comboBoxesOnChange('weeklyOff')
                        }}
                        placeholder="Search for a weekly off..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }} optional='optional'
                      />
                      <MDTypography variant="button" id="error_cmb_weeklyoff_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Shift<span className="required">*</span> </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_shift_id_ref}
                        options={shiftOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_shift_id" // Provide the ID for the input box
                        value={shiftOptions.length > 0 ? shiftOptions.find(option => option.value === cmb_shift_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_shift_id_ref.current = selectedOpt;
                          setShiftId(selectedOpt.value)
                          comboBoxesOnChange("Shift");
                        }}
                        placeholder="Search for a shift..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_shift_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                  <div className='row'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Current Shift<span className="required">*</span> </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_current_shift_id_ref}
                        options={shiftOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_current_shift_id" // Provide the ID for the input box
                        value={shiftOptions.length > 0 ? shiftOptions.find(option => option.value === cmb_current_shift_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_current_shift_id_ref.current = selectedOpt;
                          setCurrentShiftId(selectedOpt.value)
                          comboBoxesOnChange("CurrentShift");
                        }}

                        placeholder="Search for a shift..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_current_shift_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  {/* <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Date Joning <span className="required">*</span></Form.Label>
                    </div>
                     <div className="col">
                      <Form.Control type="date" id="dt_date_joining" className="erp_input_field optional" value={dt_date_joining} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setDateJoining(e.target.value) }; validateEmpWorkProfFields(); }} />
                      <MDTypography variant="button" id="error_dt_date_joining" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                   </div> */}
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Date Joining <span className="required">*</span></Form.Label>
                    </div>
                    <div className="col-sm-8 mb-1">
                      <DatePicker selected={dt_date_joining} id="dt_date_joining" onChange={(date) => handleDateChange('DateJoining', date)} dateFormat="dd-MM-yyyy" value={dt_date_joining} placeholderText="dd-mm-yyyy" className="erp_input_field " />
                      <MDTypography variant="button" id="error_dt_date_joining" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Date Exit</Form.Label>
                    </div>
                    <div className="col mb-1">
                      <DatePicker selected={dt_date_exit} id="dt_date_exit" value={dt_date_exit} onChange={(date) => handleDateChange('DateExit', date)}
                        dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional"
                        inputProps={{ 'optional': 'optional' }}
                        customInputAttributes={{ 'data-custom-attribute': 'customValue' }}
                        required={false} />
                      <MDTypography variant="button" id="error_dt_date_exit" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Date Exit </Form.Label>
                    </div>
                    <div className="col  mb-1">
                      <DatePicker selected={dt_date_exit} id="dt_date_joining" onChange={(date) => { setDateExist(date); validateEmpWorkProfFields(); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" optional='optional' />
                      <Form.Control type="date" id="dt_date_exit" className="erp_input_field optional" value={dt_date_exit} onChange={(e) => { setDateExist(e.target.value); }} optional='optional' />
                      <MDTypography variant="button" id="error_dt_date_exit" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}

                  <div className='row  mb-1'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Contractor</Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_contractor_id_ref}
                        options={contractorOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_contractor_id" // Provide the ID for the input box
                        value={contractorOptions.length > 1 ? contractorOptions.find(option => option.value === cmb_contractor_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_contractor_id_ref.current = selectedOpt;
                          comboBoxesOnChange('Contractor')
                        }}
                        placeholder="Search for a contractor..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }}
                      />
                      <MDTypography variant="button" id="error_cmb_contractor_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                    <div className={keyForViewUpdate !== 'view' ? 'col-sm-1' : 'd-none'}>
                      <Tooltip title="Refresh" placement="top">
                        <MdRefresh onClick={() => FnRefreshbtn("Contractor")} style={{ color: 'black' }} />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Resident Type</Form.Label>
                    </div>
                    <div className="col">
                      <select id="cmb_resident_type" className="form-select form-select-sm" value={cmb_resident_type} onChange={(e) => { setResidentType(e.target.value); }} optional="optional" >
                        <option value="">Select</option>
                        {residentTypeOption?.map(residentOption => (
                          <option value={residentOption.field_name}>{residentOption.field_name}</option>
                        ))}
                      </select>
                      <MDTypography variant="button" id="error_cmb_resident_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>


                </div>

                {/* 3rd Column */}
                <div className='col-sm-4 erp_form_col_div'>
                  {/* <div className="row mt-1">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Contract Start Date </Form.Label>
                    </div>
                    <div className="col mb-1">
                      <Form.Control type="date" id="dt_contract_start_date" className="erp_input_field optional" value={dt_contract_start_date} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setContractStartDate(e.target.value) }; validateEmpWorkProfFields(); }} optional="optional" />
                      <DatePicker selected={dt_contract_start_date} id="dt_contract_start_date" onChange={(date) => { setContractStartDate(date); validateEmpWorkProfFields(); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                      <MDTypography variant="button" id="error_dt_contract_start_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}
                  <div className="row mt-1">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Contract Start Date</Form.Label>
                    </div>
                    <div className="col mb-1">
                      <DatePicker selected={dt_contract_start_date} id="dt_contract_start_date" value={dt_contract_start_date}
                        onChange={(date) => handleDateChange('ContractStartDate', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                      <MDTypography variant="button" id="error_dt_contract_start_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Contract End Date </Form.Label>
                    </div>
                    <div className="col mb-1">
                      <Form.Control type="date" id="dt_contract_end_date" className="erp_input_field optional" value={dt_contract_end_date} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setContractEndDate(e.target.value) }; validateEmpWorkProfFields(); }} optional="optional" />
                      <DatePicker selected={dt_contract_end_date} id="dt_contract_end_date" onChange={(date) => { setContractEndDate(date); validateEmpWorkProfFields(); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                      <MDTypography variant="button" id="error_dt_contract_end_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Contract End Date</Form.Label>
                    </div>
                    <div className="col mb-1">
                      <DatePicker selected={dt_contract_end_date} id="dt_contract_end_date" value={dt_contract_end_date} onChange={(date) => handleDateChange('ContractEndDate', date)}
                        dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" />
                      <MDTypography variant="button" id="error_dt_contract_end_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </div>
                  </div>
                  <div className='row  mb-1'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Cost Center </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_cost_center_id_ref}
                        options={costCenterOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_cost_center_id" // Provide the ID for the input box
                        value={costCenterOptions.length > 0 ? costCenterOptions.find(option => option.value === cmb_cost_center_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_cost_center_id_ref.current = selectedOpt;
                          comboBoxesOnChange("CostCenter");
                        }}
                        placeholder="Search for a cost center..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }} optional='optional'
                      />
                      <MDTypography variant="button" id="error_cmb_cost_center_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row  mb-1'>
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label">Profit Center </Form.Label>
                    </div>
                    <div className="col">
                      <Select ref={cmb_profit_center_id_ref}
                        options={profitCenterOptions}
                        isDisabled={['view', 'approve'].includes(keyForViewUpdate)}
                        inputId="cmb_profit_center_id" // Provide the ID for the input box
                        value={profitCenterOptions.length > 0 ? profitCenterOptions.find(option => option.value === cmb_profit_center_id) : null}
                        onChange={(selectedOpt) => {
                          cmb_profit_center_id_ref.current = selectedOpt;
                          comboBoxesOnChange("profitCenter");
                        }}
                        placeholder="Search for a profit center..."
                        className="form-search-custom"
                        classNamePrefix="custom-select" // Add custom prefix for class names
                        disabled={['view', 'approve'].includes(keyForViewUpdate)}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            fontSize: '12px' // Adjust the font size as per your requirement
                          })
                        }} optional='optional'
                      />
                      <MDTypography variant="button" id="error_cmb_profit_center_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4'>
                      <Form.Label className="erp-form-label">Bond Applicable </Form.Label>
                    </div>
                    <div className='col'>
                      <Form>
                        <div className="erp_form_radio">
                          <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="bondIsApplicable" checked={bondIsApplicable === true} onClick={() => setBondIsApplicable(true)} /> </div>
                          <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" value="false" name="bondIsApplicable" checked={bondIsApplicable === false} onClick={() => setBondIsApplicable(false)} /> </div>
                        </div>
                      </Form>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Label className="erp-form-label"> Current Job Responsibilities </Form.Label>
                    </div>
                    <div className="col">
                      <Form.Control as="textarea" id="txt_current_job" rows={4} className="erp_txt_area" value={txt_current_job} onInput={e => { setCurrentJob(e.target.value); }} maxlength="500" optional='optional' />
                      <MDTypography variant="button" id="error_txt_current_job" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                      </MDTypography>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />

      {/*Employee Salary Accordian */}
      <Accordion defaultActiveKey="0" >
        <Accordion.Item eventKey={0}>
          <Accordion.Header className="erp-form-label-md">Salary Infomation</Accordion.Header>
          <Accordion.Body>
            <MDBox>
              <form id='employeeSalaryInfoFormId'>
                <div className='row'>

                  {/* 1 st Column */}
                  <div className='col-sm-4 erp_form_col_div'>

                    <div className='row'>
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">Band</Form.Label>
                      </div>
                      <div className="col">
                        <select id="cmb_band_id" value={cmb_band_id} className="form-select form-select-sm" onChange={(e) => { setBandId(e.target.value); }} optional="optional">
                          <option value="" disabled="true">Select </option>
                          {salaryBands?.map(band => (
                            <option key={band.field_name} value={band.field_id}>{band.field_name}</option>
                          ))}
                        </select>
                        <MDTypography variant="button" id="error_cmb_band_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>


                    <div className='row'>
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> CTC Amount <span className="required">*</span></Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="number" id="txt_ctc" className="erp_input_field" value={txt_ctc} onInput={(e) => { validateNumericInput(e, 'CTC') }} onChange={() => validateEmpSalaryFields()} maxlength="8" />
                        <MDTypography variant="button" id="error_txt_ctc" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> Salary Amount <span className="required">*</span></Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="number" id="txt_salary" className="erp_input_field" value={txt_salary} onInput={(e) => { validateNumericInput(e, 'Salary'); validateEmpSalaryFields(); }} maxlength="8" />
                        <MDTypography variant="button" id="error_txt_salary" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">OT Applicable </Form.Label>
                      </div>
                      <div className='col'>
                        <div className='col'>
                          <Form>
                            <div className="erp_form_radio">
                              <div className="sCheck"> <Form.Check className="erp_radio_button me-1" label="No" type="radio" value="false" name="chk_ot_flag" checked={chk_ot_flag === false} onClick={() => { setOTFlag(false); onRadioBtnChange("OTApplicable") }} /> </div>
                              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_ot_flag" checked={chk_ot_flag === true} onClick={() => { setOTFlag(true); onRadioBtnChange("OTApplicable") }} /> </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> OT Amount per hrs.
                          {chk_ot_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="number" id="txt_ot_amount" className="erp_input_field " value={txt_ot_amount} onInput={(e) => { validateNumericInput(e, 'OTAmount'); validateEmpSalaryFields(); }} optional={`${chk_ot_flag !== true ? "optional" : ''}`} maxlength="8" />
                        <MDTypography variant="button" id="error_txt_ot_amount" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>



                  </div>

                  {/* 2 nd Column */}
                  <div className='col-sm-4 erp_form_col_div'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">Gratuity Applicable </Form.Label>
                      </div>
                      <div className='col'>
                        <div className='col'>
                          <Form>
                            <div className="erp_form_radio">
                              <div className="sCheck"> <Form.Check className="erp_radio_button me-1" label="No" type="radio" value="false" name="chk_gratuity_applicable" checked={chk_gratuity_applicable === false} onClick={() => setGratuityIsApplicable(false)} /> </div>
                              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_gratuity_applicable" checked={chk_gratuity_applicable === true} onClick={() => setGratuityIsApplicable(true)} /> </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">PF Applicable </Form.Label>
                      </div>
                      <div className='col'>
                        <div className='col'>
                          <Form>
                            <div className="erp_form_radio">
                              <div className="sCheck"> <Form.Check className="erp_radio_button me-1" label="No" type="radio" value="false" name="chk_pf_flag" checked={chk_pf_flag === false} onClick={() => { setPFIsApplicable(false); onRadioBtnChange("PFApplicable") }} /> </div>
                              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_pf_flag" checked={chk_pf_flag === true} onClick={() => { setPFIsApplicable(true); onRadioBtnChange("PFApplicable") }} /> </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label"> PF Number {chk_pf_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="text" id="txt_pf_no" className="erp_input_field " value={txt_pf_no} onChange={(e) => { setPFnum(e.target.value); validateEmpSalaryFields(); }} optional={`${chk_pf_flag !== true ? "optional" : ''}`} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_pf_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label"> UAN Number
                          {chk_pf_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="text" id="txt_uan_no" className="erp_input_field" value={txt_uan_no} onChange={(e) => { setUANNum(e.target.value); validateEmpSalaryFields(); }} optional={`${chk_pf_flag !== true ? "optional" : ''}`} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_uan_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> PF Date
                          {chk_pf_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker selected={dt_pf_date} id="dt_pf_date" onChange={(date) => { setPFDate(date); validateEmpWorkProfFields(); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" optional={`${chk_pf_flag !== true ? "optional" : ''}`} />
                        <Form.Control type="date" id="dt_pf_date" className="erp_input_field" value={dt_pf_date} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setPFDate(e.target.value) }; validateEmpSalaryFields(); }} optional={`${chk_pf_flag !== true ? "optional" : ''}`} />
                        <MDTypography variant="button" id="error_dt_pf_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">PF Date {chk_pf_flag === true ? <span className="required">*</span> : ""}</Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker
                          selected={dt_pf_date}
                          id="dt_pf_date"
                          onChange={(date) => handleDateChange('PFDate', date)}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="dd-mm-yyyy"
                          className="erp_input_field optional"
                          optional={`${chk_pf_flag !== true ? "optional" : ''}`}
                        />
                        <MDTypography variant="button" id="error_dt_pf_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>

                  </div>

                  {/* 3rd Column */}
                  <div className='col-sm-4 erp_form_col_div'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">ESIC Applicable </Form.Label>
                      </div>
                      <div className='col'>
                        <div className='col'>
                          <Form>
                            <div className="erp_form_radio">
                              <div className="sCheck"> <Form.Check className="erp_radio_button me-1" label="No" type="radio" value="false" name="chk_esic_flag" checked={chk_esic_flag === false} onClick={() => { setESICIsApplicable(false); onRadioBtnChange("ESICApplicable") }} /> </div>
                              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_esic_flag" checked={chk_esic_flag === true} onClick={() => { setESICIsApplicable(true); onRadioBtnChange("ESICApplicable") }} /> </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">ESIC Number
                          {chk_esic_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="text" id="txt_esic_no" className="erp_input_field" value={txt_esic_no} onChange={(e) => { setESICNum(e.target.value); validateEmpSalaryFields(); }} optional={`${chk_esic_flag !== true ? "optional" : ''}`} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_esic_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">ESIC Date
                          {chk_esic_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="date" id="dt_esic_date" className="erp_input_field" value={dt_esic_date} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setESICDate(e.target.value) }; validateEmpSalaryFields(); }} optional={`${chk_esic_flag !== true ? "optional" : ''}`} />
                        <DatePicker selected={dt_esic_date} id="dt_esic_date" onChange={(date) => { setESICDate(date); validateEmpSalaryFields(); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" optional={`${chk_esic_flag !== true ? "optional" : ''}`} />
                        <MDTypography variant="button" id="error_dt_esic_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">ESIC Date {chk_esic_flag === true ? <span className="required">*</span> : ""}</Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker
                          selected={dt_esic_date} id="dt_esic_date" onChange={(date) => handleDateChange('ESICDate', date)} dateFormat="dd-MM-yyyy"
                          placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional={`${chk_esic_flag !== true ? "optional" : ''}`} />
                        <MDTypography variant="button" id="error_dt_esic_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                    <div className='row d-none'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">MLWF Applicable </Form.Label>
                      </div>
                      <div className='col'>
                        <div className='col'>
                          <Form>
                            <div className="erp_form_radio">
                              <div className="sCheck"> <Form.Check className="erp_radio_button me-1" label="No" type="radio" value="false" name="chk_mlwf_flag" checked={chk_mlwf_flag === false} onClick={() => { setMLWFIsApplicable(false); onRadioBtnChange("MLWFApplicable") }} /> </div>
                              <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" value="true" name="chk_mlwf_flag" checked={chk_mlwf_flag === true} onClick={() => { setMLWFIsApplicable(true); onRadioBtnChange("MLWFApplicable") }} /> </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>

                    <div className='row d-none'>
                      <div className='col-sm-4'>
                        <Form.Label className="erp-form-label">MLWF Number
                          {chk_mlwf_flag == true ? <span className="required">*</span> : ""}
                        </Form.Label>
                      </div>
                      <div className="col">
                        <Form.Control type="text" id="txt_mlwf_no" className="erp_input_field" value={txt_mlwf_no} onChange={(e) => { setMLWFNum(e.target.value); validateEmpSalaryFields(); }} optional={`${chk_mlwf_flag !== true ? "optional" : ''}`} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_mlwf_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                    </div>

                  </div>
                </div>
              </form>
            </MDBox>
            <hr></hr>

            <div>
              <div className='card-header text-center py-0'>
                <label className='erp-form-label-lg text-center'> Employee (Earning Deduction Mapping)</label>
              </div>
              <form id='employeeSalaryInfoFormId'>
                {/* <div className="row erp_transporter_div "> */}
                <div className="col-sm-6 erp_form_col_div">

                  <div className="col-sm-12 erp_form_col_div">
                    <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label">Effective Date</Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker selected={effective_date} id="effective_date" onChange={(date) => handleDateChange('EffectiveDate', date)}
                          dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography
                          variant="button" id="error_effective_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-sm-4">
                        <Form.Label className="erp-form-label"> Effective Date </Form.Label>
                      </div>
                      <div className="col">
                        <DatePicker selected={effective_date} id="effective_date" onChange={(date) => { setEffectiveDate(date); }} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field" optional="optional" />
                        <Form.Control type="date" id="effective_date" className="erp_input_field" value={effective_date} onChange={(e) => { if (validateNumberDateInput.current.formatDateToDDMMYYYY(e.target.value)) { setEffectiveDate(e.target.value) }; }} optional="optional" />
                        <MDTypography variant="button" id="error_effective_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                        </MDTypography>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* </div> */}
              </form>

              <div className="row col-12">
                <div class="col-12 col-lg-12">
                  <div className='erp-form-label-lg'>Earning Heads</div>
                  <div className="row mt-3 gx-3" style={earningData.length > 4 ? { height: '250px', overflowY: 'auto' } : null}>
                    {renderEarningTable}
                    <MDTypography variant="button" id="error_select_earningHead" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}> </MDTypography>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row col-12">
                <div class='col-12 col-lg-12'>
                  <div className='erp-form-label-lg'>Deduction Heads</div>
                  <div className="row  mt-3 gx-3" style={deductionData.length > 4 ? { height: '250px', overflowY: 'auto' } : null}>
                    {renderDeductionTable}
                  </div>
                </div>
              </div>

              {/* <div className="row col-12 mt-2">
                <div className='col'>
                  <Form>
                    <div className="erp_form_radio">
                      <div className="fCheck"> <Form.Check className="erp_radio_button" label='Salary Rules' type="checkbox" value="1" name="salaryRules" /></div>
                    </div>
                  </Form>
                </div>
              </div> */}
            </div>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
          <Accordion.Header className="erp-form-label-md"> Educational Details and Previous Employment </Accordion.Header>
          <Accordion.Body className="p-0">
            <div className="mt-10">
              <div className="col-sm-6 erp_form_col_div ps-2">
                <Form.Label className='erp-form-label-lg'>Employee Details</Form.Label>
              </div>
              <>
                {renderEmployeeQualificationTable}
              </>
            </div>
            <hr />
            <div className="mt-10">
              <div className="col-sm-6 erp_form_col_div ps-2">
                <Form.Label className='erp-form-label-lg'>Previous Employment </Form.Label>
              </div>
              <>
                {renderEmployeePerviousExperienceTable}
              </>
            </div>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <hr />

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
          <Accordion.Header className="erp-form-label-md"> Family Details </Accordion.Header>
          <Accordion.Body >
            <div className='row'>
              <div className='col-sm-6 erp_form_col_div'>

                <div className='row  mb-1'>
                  <div className='col-sm-3 col-12'>
                    <Form.Label className="erp-form-label">Father's Name & DOB</Form.Label>
                  </div>
                  <div className='col-sm-9 col-12'>
                    <div className="row">
                      <div className="col-12 col-md-8 mt-1 pe-md-0">
                        <Form.Control type="text" id='txt_father_Name' className="erp_input_field" value={txt_father_Name} onChange={e => { setfather_Name(e.target.value); validateEmpInfoFields(e) }} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_father_Name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-12 col-md-4 pt-md-0 pt-3 ps-md-1">
                        <DatePicker selected={dt_father_DOB_date} id="dt_father_DOB_date" value={dt_father_DOB_date} onChange={(date) => handleDateChange('father_DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography variant="button" id="error_dt_father_DOB_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>


                <div className='row  mb-1'>
                  <div className='col-sm-3 col-12'>
                    <Form.Label className="erp-form-label"> Mother's Name & DOB </Form.Label>
                  </div>
                  <div className='col-sm-9 col-12'>
                    <div className="row">
                      <div className="col-12 col-md-8 mt-1 pe-md-0">
                        <Form.Control type="text" id='txt_mother_Name' className="erp_input_field" value={txt_mother_Name} onChange={e => { setmother_Name(e.target.value); validateEmpInfoFields(e) }} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_mother_Name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-12 col-md-4 pt-md-0 pt-3 ps-md-1">
                        <DatePicker selected={dt_mother_DOB_date} id="dt_mother_DOB_date" value={dt_mother_DOB_date} onChange={(date) => handleDateChange('mother_DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography variant="button" id="error_dt_mother_DOB_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row  mb-1'>
                  <div className='col-sm-3 col-12'>
                    <Form.Label className="erp-form-label">Spouse's Name & DOB </Form.Label>
                  </div>
                  <div className='col-sm-9 col-12'>
                    <div className="row">
                      <div className="col-12 col-md-8 mt-1 pe-md-0">
                        <Form.Control type="text" id='txt_spouse_Name' className="erp_input_field" value={txt_spouse_Name} onChange={e => { setspouse_Name(e.target.value); validateEmpInfoFields(e) }} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_spouse_Name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-12 col-md-4 pt-md-0 pt-3 ps-md-1">
                        <DatePicker selected={dt_spouse_DOB_date} id="dt_spouse_DOB_date" value={dt_spouse_DOB_date} onChange={(date) => handleDateChange('spouse_DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography variant="button" id="error_dt_spouse_DOB_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className='col-sm-6 erp_form_col_div'>
                <div className='row  mb-1'>
                  <div className='col-sm-3 col-12'>
                    <Form.Label className="erp-form-label">Son's Name & DOB </Form.Label>
                  </div>
                  <div className='col-sm-9 col-12'>
                    <div className="row">
                      <div className="col-12 col-md-8 mt-1 pe-md-0">
                        <Form.Control type="text" id='txt_Son_Name' className="erp_input_field" value={txt_Son_Name} onChange={e => { setSon_Name(e.target.value); validateEmpInfoFields(e) }} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_Son_Name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-12 col-md-4 pt-md-0 pt-3 ps-md-1">
                        <DatePicker selected={dt_Son_DOB_date} id="dt_Son_DOB_date" value={dt_Son_DOB_date} onChange={(date) => handleDateChange('Son_DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography variant="button" id="error_dt_Son_DOB_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row  mb-1'>
                  <div className='col-sm-3 col-12'>
                    <Form.Label className="erp-form-label"> Daughter's Name & DOB </Form.Label>
                  </div>
                  <div className='col-sm-9 col-12'>
                    <div className="row">
                      <div className="col-12 col-md-8 mt-1 pe-md-0">
                        <Form.Control type="text" id='txt_daughter_Name' className="erp_input_field" value={txt_daughter_Name} onChange={e => { setdaughter_Name(e.target.value); validateEmpInfoFields(e) }} maxlength="255" />
                        <MDTypography variant="button" id="error_txt_daughter_Name" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                        </MDTypography>
                      </div>
                      <div className="col-12 col-md-4 pt-md-0 pt-3 ps-md-1">
                        <DatePicker selected={dt_daughter_DOB_date} id="dt_daughter_DOB_date" value={dt_daughter_DOB_date} onChange={(date) => handleDateChange('daughter_DOB', date)} dateFormat="dd-MM-yyyy" placeholderText="dd-mm-yyyy" className="erp_input_field optional" optional="optional" />
                        <MDTypography variant="button" id="error_dt_daughter_DOB_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {keyForViewUpdate !== 'Add' ?
        <> <hr />
          <Accordion defaultActiveKey="0" onSelect={FnLoadAccordionData}>
            <Accordion.Item eventKey="documentList">
              <Accordion.Header className="erp-form-label-md p-0">Document List</Accordion.Header>
              <Accordion.Body>
                {docData.length !== 0 ? (
                  renderDocumentTable
                ) : (
                  <div className='row text-center'>
                    <div className="col-12 text-center">
                      <span className="erp_validation text-center" fontWeight="regular" color="error">
                        No Records Found...
                      </span>
                    </div>
                  </div>
                )}
                <div className="text-center my-2">
                  <MDButton className={`erp-gb-button erp_MLeft_btn ${keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" id='viewdocument-id' onClick={viewDocumentForm} >Upload Document</MDButton>&nbsp;
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </>
        : null
      }

      {/* //case no. 1 chnges by ujjwala 10/1/2024 Start */}
      <div className="card-footer py-0 text-center">
        <MDButton type="button" className="erp-gb-button"
          onClick={() => {
            const path = compType === 'Register' ? '/Masters/EmployeesListing/reg' : '/Masters/EmployeesListing';
            navigate(path);
          }} variant="button"
          fontWeight="regular">Back</MDButton>
        <MDButton type="submit" onClick={FnAddEmployee} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === "view" ? 'd-none' : 'display'}`} variant="button"
          fontWeight="regular">{actionLabel}</MDButton>
        <MDButton className={`erp-gb-button erp_MLeft_btn ${(keyForViewUpdate === 'view') || keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" onClick={() => handleShow(employee_id, cmb_employee_type)}>Print &nbsp;<FiPrinter className="erp-download-icon-btn" />
        </MDButton>
        <MDButton
          type="button"
          onClick={validationfornext}
          id="nxtBtn"
          className={`ms-2 erp-gb-button ${UserId === 1 ? 'display' : 'd-none'}`}
          variant="button"
          fontWeight="regular"
          disabled={employee_id === 0 || employee_id === ''}
        // cmb_employee_type !== 'Staff' -> removed this condition as per the discussion with prashant sir. on 10-07-24
        >
          Next
        </MDButton>
        {/* <MDButton className={`erp-gb-button erp_MLeft_btn ${(keyForViewUpdate === 'view') || keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" onClick={() => handleShow(employee_id)}>Print &nbsp;<FiPrinter className="erp-download-icon-btn" />
        </MDButton> */}
        {/* <MDButton className={`erp-gb-button erp_MLeft_btn ${keyForViewUpdate === 'update' ? 'display' : 'd-none'}`} variant="button" fontWeight="regular" id='viewdocument-id' onClick={viewDocumentForm} >Upload Document</MDButton>&nbsp; */}
      </div >

      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />

      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

      <Modal show={showModal} size="lg">
        {selectedEmployeeType !== 'Worker' && (<span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={handleCloses}></button></span>
        )}
        {selectedEmployeeType === 'Worker' && (
          <div className="row mt-3">
            <div className="col-7">
            </div>
            <div className="col-sm-2 text-end">
              <Form.Label className="erp-form-label text-end">{currentLabels.language} / Language :</Form.Label>
            </div>
            <div className="col-2  text-end">
              <select className="form-select form-select-sm" value={currentLanguage} onChange={handleLanguageChange}>
                {/* <option value="english">English</option> */}
                <option value="hindi">हिंदी</option>
                <option value="gujarati">ગુજરાતી</option>
              </select>
            </div>
            <div className="col-1">
              <span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={handleCloses}></button></span>

            </div>
          </div>
        )}

        <Modal.Body>
          <div ref={printRef} >
            {selectedEmployeeType === 'Worker' ? (
              <MEmployeeWorkerPrint employeeId={selectedEmployeeId} currentLanguage={currentLanguage} />
            ) : (
              <MEmployeePrint employeeId={selectedEmployeeId} />
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button className="erp-gb-button" variant="button" fontWeight="regular" onClick={handleCloses}>
            Back
          </Button>

          <MDButton className='erp-gb-button erp_MLeft_btn' variant="button" fontWeight="regular" onClick={() => printInvoice()}>Print &nbsp;<FiPrinter className="erp-download-icon-btn" />
          </MDButton>
        </Modal.Footer>
      </Modal>


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

      {/* Document modal */}
      <Modal size="lg" className='erp_document_Form' show={showDocumentForm} onHide={handleCloseDocumentForm} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title className='erp_modal_title'>Document Form</Modal.Title>
          <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseDocumentForm}></button></span>
        </Modal.Header>
        <Modal.Body>
          <DocumentF group_id={employee_id !== 0 ? employee_id : null} document_group={docGroup} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="btn erp-gb-button" onClick={handleCloseDocumentForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </MDBox >
  )
}
