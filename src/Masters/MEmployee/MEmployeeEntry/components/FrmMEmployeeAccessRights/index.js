import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDButton from 'components/MDButton';
import MDTypography from "components/MDTypography";
import { CircularProgress } from '@mui/material';


// React Bootstrap imports
import { Table } from "react-bootstrap"
import Form from 'react-bootstrap/Form';

//File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import { useNavigate } from 'react-router-dom';
import ConfigConstants from 'assets/Constants/config-constant';

function FrmEmployeeAccessRights({ goBack, employeeID, compType, keyForViewUpdate, employeeCode, employeeName, gradeId }) {
  // Config Constant
  const configConstants = ConfigConstants();
  const { COMPANY_ID, COMPANY_BRANCH_ID, UserName, COMPANY_ACCESS } = configConstants;

  const [rowCount, setRowCount] = useState();
  const [cmb_user_type, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [menuList, setMenuList] = useState([])
  const [subMenuList, setSubMenuList] = useState([])

  const [cmb_menu, setMenu] = useState('')
  const [cmb_sub_menu, setSubMenu] = useState('')

  const [cmb_company_access, setCompanyAccess] = useState(COMPANY_ACCESS)



  // Error Msg HANDLING
  const handleCloseErrModal = () => setShowErrorMsgModal(false);
  const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Success Msg HANDLING
  const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
  const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
  const [succMsg, setSuccMsg] = useState('');

  const comboBox = useRef();
  const navigate = useNavigate();

  // Access rights states
  const [allFormsList, setAllFormsList] = useState([]);
  const [formsList, setFormsList] = useState([]);
  const [accessByDesignation, setAccessByDesignation] = useState([]);
  const [accessByUser, setAccessByUser] = useState([]);

  const [readAllChecked, setReadAllChecked] = useState(false);
  const [allAccessChecked, setAllAccessChecked] = useState(false);
  const [addAllChecked, setAddAllChecked] = useState(false);
  const [modifyAllChecked, setModifyAllChecked] = useState(false);
  const [deleteAllChecked, setDeleteAllChecked] = useState(false);
  const [approveAllChecked, setApproveAllChecked] = useState(false);
  const [specialAllChecked, setSpecialAllChecked] = useState(false);


  useEffect(() => {
    const loadDataOnLoad = async () => {
      setIsLoading(true)
      FnGetModulesList()
      await FnShowDesignationWiseFormAccessData();
      setIsLoading(false)
    }
    loadDataOnLoad()
  }, [])

  const FnGetModulesList = () => {
    try {
      comboBox.current.fillMasterData("amv_modules_menu", "", "").then((menuList) => {
        setMenuList(menuList);
      })
    } catch (error) {
      console.log('error: ', error);
    }
  }

  useEffect(() => {
    const checkAllAccess = (accessType) => {
      return formsList.every(form => {
        const userAccess = accessByUser.find(access => access.modules_forms_id === form.modules_forms_id) || {};
        const designationAccess = accessByDesignation.find(access => access.modules_forms_id === form.modules_forms_id) || {};
        return userAccess[accessType] || designationAccess[accessType] || false;
      });
    };

    setReadAllChecked(checkAllAccess('read_access'));
    setAllAccessChecked(checkAllAccess('all_access'));
    setAddAllChecked(checkAllAccess('add_access'));
    setModifyAllChecked(checkAllAccess('modify_access'));
    setDeleteAllChecked(checkAllAccess('delete_access'));
    setApproveAllChecked(checkAllAccess('approve_access'));
    setSpecialAllChecked(checkAllAccess('special_access'));
  }, [formsList, accessByUser]);

  const FnShowDesignationWiseFormAccessData = async () => {
    try {
      debugger;
      const getFormsApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesForms/FnShowAllActiveRecords/${parseInt(COMPANY_ID)}`)
      const formsResponse = await getFormsApi.json();

      const getOldAceesDataByDesignationApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employeegrade/FnShowAllActiveRecords/${parseInt(gradeId)}/${parseInt(COMPANY_ID)}`)
      let accessByDesignationResponse = await getOldAceesDataByDesignationApi.json();

      const getOldAceesByUserDataApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesFormsUserAccess/FnShowAllActiveRecords/${employeeCode}/${parseInt(COMPANY_ID)}`);
      const accessByUserResponse = await getOldAceesByUserDataApi.json();

      if (accessByUserResponse.length === 0) {
        const defaultAccessByUser = formsResponse.map(form => ({
          all_access: false,
          read_access: false,
          add_access: false,
          modify_access: false,
          delete_access: false,
          approve_access: false,
          special_access: false,
          modules_forms_id: form.modules_forms_id,
          module_id: form.parent_module_id,
          sub_module_id: form.sub_module_id,
          modules_sub_menu_id: form.modules_sub_menu_id,
          modules_menu_id: form.modules_menu_id,
          company_id: form.company_id,
          user_code: employeeCode,
          user_type: '',
        }));
        setAccessByUser(defaultAccessByUser);
      } else {
        // If accessByUserResponse has data, update access settings accordingly
        const updatedAccessByUser = formsResponse.map(form => {
          const accessRecord = accessByUserResponse.find(access => access.modules_forms_id === form.modules_forms_id);
          if (accessRecord) {
            return {
              ...accessRecord,
              module_id: accessRecord.parent_module_id, // adding the new key
              parent_module_id: undefined // removing the old key
            };
          } else {
            return {
              all_access: false,
              read_access: false,
              add_access: false,
              modify_access: false,
              delete_access: false,
              approve_access: false,
              special_access: false,
              modules_forms_id: form.modules_forms_id,
              module_id: form.parent_module_id,
              sub_module_id: form.sub_module_id,
              modules_sub_menu_id: form.modules_sub_menu_id,
              modules_menu_id: form.modules_menu_id,
              company_id: form.company_id,
              user_code: employeeCode,
              user_type: '',
            };
          }
        });

        setAccessByUser(updatedAccessByUser);
        setUserType(accessByUserResponse[0].user_type);
      }

      setFormsList(formsResponse);
      setAllFormsList(formsResponse)
      setAccessByDesignation(accessByDesignationResponse);

    } catch (error) {
      console.log('error: ', error);
      navigate('/Error')

    }
  }

  const setPermissions = (switchType, formId) => {
    let updatedAccessByUser = [...accessByUser];
    const formAccessIndex = updatedAccessByUser.findIndex(access => access.modules_forms_id === formId);

    if (formAccessIndex !== -1) {
      let formAccess = updatedAccessByUser[formAccessIndex];

      if (switchType === 'allAccess') {
        const allChecked = document.getElementById(`allAccessSwitch-${formId}`).checked;
        formAccess = {
          ...formAccess,
          all_access: allChecked,
          read_access: allChecked,
          add_access: allChecked,
          modify_access: allChecked,
          delete_access: allChecked,
          approve_access: allChecked,
          special_access: allChecked,
        };
      } else {
        formAccess = {
          ...formAccess,
          read_access: document.getElementById(`readAccessSwitch-${formId}`).checked,
          add_access: document.getElementById(`addAccessSwitch-${formId}`).checked,
          modify_access: document.getElementById(`modifyAccessSwitch-${formId}`).checked,
          delete_access: document.getElementById(`deleteAccessSwitch-${formId}`).checked,
          approve_access: document.getElementById(`approveAccessSwitch-${formId}`).checked,
          special_access: document.getElementById(`specialAccessSwitch-${formId}`).checked,
        };
        formAccess.all_access = formAccess.read_access && formAccess.add_access && formAccess.modify_access &&
          formAccess.delete_access && formAccess.approve_access && formAccess.special_access;
        document.getElementById(`allAccessSwitch-${formId}`).checked = formAccess.all_access;
      }

      updatedAccessByUser[formAccessIndex] = formAccess;
      setAccessByUser(updatedAccessByUser);
    }
  }

  const setPermissionsForAllForms = (accessType, checked) => {
    let updatedAccessByUser = [...accessByUser];

    switch (accessType) {
      case "allformsAllAccess":
        const allChecked = $('#allformsAllAccess').is(":checked");
        updatedAccessByUser = updatedAccessByUser.map(access => {
          // Find the corresponding form in formsList based on modules_forms_id
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            // If a corresponding form is found, update the access properties accordingly
            return {
              ...access,
              all_access: allChecked,
              read_access: allChecked,
              add_access: allChecked,
              modify_access: allChecked,
              delete_access: allChecked,
              approve_access: allChecked,
              special_access: allChecked,
            };
          } else {
            // If no corresponding form is found, return the original access object
            return access;
          }
        });
        setAllAccessChecked(allChecked);
        setReadAllChecked(allChecked);
        setAddAllChecked(allChecked);
        setModifyAllChecked(allChecked);
        setDeleteAllChecked(allChecked);
        setApproveAllChecked(allChecked);
        setSpecialAllChecked(allChecked);
        break;
      case "addAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          // Find the corresponding form in formsList based on modules_forms_id
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);
          if (correspondingForm) {
            // If a corresponding form is found, update the access properties accordingly
            return {
              ...access,
              add_access: $('#addAllFormsAccess').is(":checked"),
            };
          } else {
            // If no corresponding form is found, return the original access object
            return access;
          }
        });
        setAddAllChecked(!addAllChecked);
        break;

      case "modifyAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            return {
              ...access,
              modify_access: $('#modifyAllFormsAccess').is(":checked"),
            };
          } else {
            return access;
          }
        });
        setModifyAllChecked(!modifyAllChecked);
        break;

      case "readAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            return {
              ...access,
              read_access: document.getElementById('readAllFormsAccess').checked,
            };
          } else {
            return access;
          }
        });
        setReadAllChecked(!readAllChecked);
        break;

      case "deleteAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            return {
              ...access,
              delete_access: $('#deleteAllFormsAccess').is(":checked"),
            };
          } else {
            return access;
          }
        });
        setDeleteAllChecked(!deleteAllChecked);
        break;

      case "approveAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            return {
              ...access,
              approve_access: $('#approveAllFormsAccess').is(":checked"),
            };
          } else {
            return access;
          }
        });
        setApproveAllChecked(!approveAllChecked);
        break;

      case "specialAllFormsAccess":
        updatedAccessByUser = updatedAccessByUser.map(access => {
          const correspondingForm = formsList.find(form => form.modules_forms_id === access.modules_forms_id);

          if (correspondingForm) {
            return {
              ...access,
              special_access: $('#specialAllFormsAccess').is(":checked"),
            };
          } else {
            return access;
          }
        });
        setSpecialAllChecked(!specialAllChecked);
        break;
      default:
        break;
    }

    console.log('updatedAccessByUser: - ', updatedAccessByUser);
    if (accessType !== "allformsAllAccess") {
      const allAccessChecked = updatedAccessByUser.every(access =>
        access.read_access && access.add_access && access.modify_access &&
        access.delete_access && access.approve_access && access.special_access
      );

      if (allAccessChecked) {
        updatedAccessByUser = updatedAccessByUser.map(access => ({
          ...access,
          all_access: true,
        }));

      } else {
        updatedAccessByUser = updatedAccessByUser.map(access => ({
          ...access,
          all_access: false,
        }));
        document.getElementById('allformsAllAccess').checked = false;
      }
      setAllAccessChecked(allAccessChecked)
    }

    setAccessByUser(updatedAccessByUser)
  }

  const FnUserTypeOnChange = (user_type) => {
    $('#error_cmb_user_type').hide()
    $(".switch").prop('checked', user_type === 'Administrators');
  }

  const constructAccessControl = (allAccess, readAccess, addAccess, modifyAccess, deleteAccess, approvalAccess, specialAccess) => {
    return `${allAccess ? "Y:" : "N:"}${readAccess ? "Y:" : "N:"}${addAccess ? "Y:" : "N:"}${modifyAccess ? "Y:" : "N:"}${deleteAccess ? "Y:" : "N:"}${approvalAccess ? "Y:" : "N:"}${specialAccess ? "Y" : "N"}`;
  };

  // For add user access entry.
  const addEmployeeDesignationAccessEntryData = async () => {
    try {
      setIsLoading(true)
      let UserAccessJson = { 'userAcessRecords': [], 'commonIds': {} }
      if (cmb_user_type === '') {
        $('#error_cmb_user_type').show()
        $('#cmb_user_type').focus()
        return false
      }

      const allFormAccessElementIds = ['allformsAllAccess', "readAllFormsAccess", "addAllFormsAccess", "modifyAllFormsAccess", "deleteAllFormsAccess", "approveAllFormsAccess", "specialAllFormsAccess"];
      let addAllFormOrNot = allFormAccessElementIds.some(element => $(`#${element}`).is(":checked"));

      accessByUser.map(accesses => {
        const { all_access,
          read_access,
          add_access,
          modify_access,
          delete_access,
          approve_access,
          special_access,
          modules_forms_id,
          module_id,
          sub_module_id,
        } = accesses

        const accessConditions = all_access || read_access || add_access || modify_access || delete_access || approve_access || special_access;

        const condition = formsList === allFormsList
          ? (addAllFormOrNot ^ accessConditions)  // Adjust XOR for `formsList === allFormsList`
          : !(addAllFormOrNot ^ accessConditions);  // Use XOR for `formsList !== allFormsList`

        if (accessConditions) {
          const access_control = constructAccessControl(all_access, read_access, add_access, modify_access, delete_access, approve_access, special_access);

          const acceesRecord = {
            company_id: parseInt(COMPANY_ID),
            company_branch_id: parseInt(COMPANY_BRANCH_ID),
            user_type: cmb_user_type,
            user_id: employeeID,
            user_code: employeeCode,
            module_id: module_id,
            sub_module_id: sub_module_id,
            modules_forms_id: modules_forms_id,
            all_access: all_access,
            read_access: read_access,
            add_access: add_access,
            modify_access: modify_access,
            delete_access: delete_access,
            approve_access: approve_access,
            special_access: special_access,
            access_control: access_control,
            created_by: UserName,
            company_access: cmb_company_access,
          };

          UserAccessJson['userAcessRecords'].push(acceesRecord);
        }
      })

      UserAccessJson['commonIds']['company_id'] = parseInt(COMPANY_ID);
      UserAccessJson['commonIds']['company_branch_id'] = parseInt(COMPANY_BRANCH_ID);
      UserAccessJson['commonIds']['user_code'] = employeeCode;
      UserAccessJson['commonIds']['user_id'] = employeeID;
      UserAccessJson['commonIds']['user_type'] = cmb_user_type;

      console.log("UserAccessData: ", UserAccessJson)
      const formData = new FormData();
      formData.append(`UserAccessData`, JSON.stringify(UserAccessJson))
      const requestOptions = {
        method: 'POST',
        body: formData
      };

      const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmModulesFormsUserAccess/FnAddUpdateRecord`, requestOptions)
      const resp = await apiCall.json()
      if (resp.success === '0') {
        setErrMsg(resp.error)
        setShowErrorMsgModal(true)
      } else {
        console.log("resp: ", resp)
        setSuccMsg(resp.message)
        setShowSuccessMsgModal(true)
      }

    } catch (error) {
      console.log('error: ', error);
      navigate('/Error')
    } finally {
      setIsLoading(false)
    }
  }

  const renderAccessSwitch = (access, key, type, modules_forms_id) => (
    <div className="form-check form-switch d-flex justify-content-center align-items-center">
      <input
        className={`form-check-input switch`}
        id={`${type}Switch-${modules_forms_id}`}
        type="checkbox"
        key={key}
        checked={access}
        onChange={() => { setPermissions(type, modules_forms_id) }}
        disabled={keyForViewUpdate === 'view'}
      />
    </div>
  );

  const renderTableRows = () => {
    return formsList.map((form, index) => {
      const rowKey = index + 1;
      const userAccess = accessByUser?.find(access => access.modules_forms_id === form.modules_forms_id) || {};
      const designationAccess = accessByDesignation?.find(access => access.modules_forms_id === form.modules_forms_id) || {};

      const allAccess = userAccess.all_access || designationAccess.all_access || false;
      const readAccess = userAccess.read_access || designationAccess.read_access || false;
      const addAccess = userAccess.add_access || designationAccess.add_access || false;
      const modifyAccess = userAccess.modify_access || designationAccess.modify_access || false;
      const deleteAccess = userAccess.delete_access || designationAccess.delete_access || false;
      const approveAccess = userAccess.approve_access || designationAccess.approve_access || false;
      const specialAccess = userAccess.special_access || designationAccess.special_access || false;

      return (
        <tr key={rowKey} id={`Record-tr-${rowKey}`}>
          <td>
            <span>
              {form.menu_type}
              <input type="hidden" fieldKey={`module_${form.parent_module_id}`} value={form.parent_module_id} id={`parentModuleId-${rowKey}`} />
            </span>
          </td>
          <td>
            <span>
              {form.modules_sub_menu_name}
              <input type="hidden" fieldKey={`subModule_${form.sub_module_id}`} value={form.sub_module_id} id={`subModuleId-${rowKey}`} />
            </span>
          </td>
          <td>
            <span>
              {form.modules_forms_name}
              <input type="hidden" fieldKey={`form_${form.modules_forms_id}`} value={form.modules_forms_id} id={`formId-${rowKey}`} />
            </span>
          </td>
          <td>{renderAccessSwitch(allAccess, rowKey, 'allAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(readAccess, rowKey, 'readAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(addAccess, rowKey, 'addAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(modifyAccess, rowKey, 'modifyAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(deleteAccess, rowKey, 'deleteAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(approveAccess, rowKey, 'approveAccess', form.modules_forms_id)}</td>
          <td>{renderAccessSwitch(specialAccess, rowKey, 'specialAccess', form.modules_forms_id)}</td>
        </tr>
      );
    });
  };

  const FnShowModuleWiseTblRows = (key) => {
    switch (key) {
      case 'module':
        const module = parseInt(document.getElementById('module').value)
        if (module !== 0) {
          comboBox.current.fillMasterData("amv_modules_sub_menu", "modules_menu_id", module)
            .then((subMenuList) => {
              setSubMenuList(subMenuList);
            })
          const getUserAccess = [...allFormsList]
          const updatedlist = getUserAccess.filter(access => access.modules_menu_id === module)
          setFormsList(updatedlist)

        } else {
          setSubMenuList([])
          setFormsList(allFormsList)
        }
        break;

      case 'subModule':
        const subModule = parseInt(document.getElementById('subModule').value)
        if (subModule !== 0) {
          const getUserAccess = [...allFormsList]
          const updatedlist = getUserAccess.filter(access => access.modules_sub_menu_id === subModule)
          setFormsList(updatedlist)
        } else {
          FnShowModuleWiseTblRows(key)
        }
        break;

      default:
        break;
    }
  }

  return (
    <>
      <ComboBox ref={comboBox} />
      {isLoading ?
        <div className="spinner-overlay"  >
          <div className="spinner-container">
            <CircularProgress />
            <span>Loading...</span>
          </div>
        </div> : null}
      <div className='main_heding'>
        <label className='erp-form-label-lg main_heding'>Access Rights For Employee: {employeeName}</label>
      </div>
      <div className='row'>
        <div className='col-sm-6'>
          <div className='row'>
            <div className="col-sm-2">
              <Form.Label className="erp-form-label-md">User Type</Form.Label>
            </div>
            <div className="col-sm-10">
              <select id="cmb_user_type" className="form-select form-select-sm" value={cmb_user_type} onChange={(event) => { setUserType(event.target.value); FnUserTypeOnChange(event.target.value) }} disabled={keyForViewUpdate === 'view'}>
                <option value="">Select</option>
                <option value="Administrators">Administrators</option>
                <option value="ITAdministrators">ITAdministrators</option>
                <option value="Employees">Employees</option>
              </select>
              <MDTypography variant="button" id="error_cmb_user_type" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                Please select user type!...
              </MDTypography>
            </div>
          </div>
        </div>
        <div className='col-sm-6'>
          <div className='row'>
            <div className="col-sm-2">
              <Form.Label className="erp-form-label-md">Company Access</Form.Label>
            </div>
            <div className="col-sm-10">
              <select id="cmb_company_access" className="form-select form-select-sm" value={cmb_company_access}
                onChange={(event) => { setCompanyAccess(event.target.value); }} >
                {/* <option value={0}></option> */}
                <option value={1}>Pashupati Cotspin Ltd - Spinning</option>
                <option value={2}>Pashupati Texspin Export LLP</option>
                <option value={3}>Pashupati Cotspin Ltd - Ginning</option>
                <option value={0}>All</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      <div className='row'>
        <div className='col-sm-6'>
          <div className='row'>
            <div className="col-sm-2">
              <Form.Label className="erp-form-label-md">Module</Form.Label>
            </div>
            <div className="col-sm-10">
              <select id="module" className="form-select form-select-sm" value={cmb_menu} onChange={(event) => {
                setMenu(event.target.value);
                FnShowModuleWiseTblRows('module');
              }} >
                <option value={0}>All</option>
                {
                  menuList.map(item =>
                    <option value={item.field_id} menuId={item.field_id}>
                      {item.field_name}
                    </option>)
                }
              </select>
            </div>
          </div>
        </div>
        <div className='col-sm-6'>
          <div className='row'>
            <div className="col-sm-2">
              <Form.Label className="erp-form-label-md">Sub-Module</Form.Label>
            </div>
            <div className="col-sm-10">
              <select id="subModule" className="form-select form-select-sm" value={cmb_sub_menu}
                onChange={(event) => { setSubMenu(event.target.value); FnShowModuleWiseTblRows('subModule'); }} >
                <option value={0}>All</option>
                {
                  subMenuList.map(item => <option value={item.field_id}>{item.field_name}</option>)
                }
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='responsive' style={{ height: '300px', overflow: 'auto' }}>
        <Table className="erp_table" id="FormsTbl" bordered striped>
          <thead className='erp_table_head erp_table_th'>
            <tr>
              <th className='col-2'>Module</th>
              <th className='col-2'>Sub-Module</th>
              <th className='col-2'>Form</th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input switch"
                    type="checkbox"
                    role="switch"
                    id="allformsAllAccess"
                    checked={allAccessChecked}
                    onChange={() => setPermissionsForAllForms("allformsAllAccess")}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="allformsAllAccess">All</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    id="readAllFormsAccess"
                    checked={readAllChecked}
                    onChange={(event) => { setPermissionsForAllForms("readAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="readAllFormsAccess">Read</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    checked={addAllChecked}
                    id="addAllFormsAccess"
                    onChange={() => { setPermissionsForAllForms("addAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="addAllFormsAccess">Add</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    checked={modifyAllChecked}
                    id="modifyAllFormsAccess"
                    onChange={() => { setPermissionsForAllForms("modifyAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="modifyAllFormsAccess">Modify</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    checked={deleteAllChecked}
                    id="deleteAllFormsAccess"
                    onChange={(event) => { setDeleteAllChecked(event.target.checked); setPermissionsForAllForms("deleteAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="deleteAllFormsAccess">Delete</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    checked={approveAllChecked}
                    id="approveAllFormsAccess"
                    onChange={(event) => { setApproveAllChecked(event.target.checked); setPermissionsForAllForms("approveAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="approveAllFormsAccess">Approve</label>
                </div>
              </th>
              <th className='text-center'>
                <div className="form-switch justify-content-center">
                  <input
                    className="form-check-input headerSwitch switch"
                    type="checkbox"
                    role="switch"
                    id="specialAllFormsAccess"
                    checked={specialAllChecked}
                    onChange={(event) => { setSpecialAllChecked(event.target.checked); setPermissionsForAllForms("specialAllFormsAccess") }}
                    disabled={keyForViewUpdate === 'view'}
                  />
                  <label className="form-check-label ms-1" htmlFor="specialAllFormsAccess">Special</label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="erp_table_td">
            {renderTableRows()}
          </tbody>
        </Table>
      </div>
      <div className='text-center'>
        <MDButton type="button" onClick={() => goBack(employeeID)} className="erp-gb-button" variant="button"
          fontWeight="regular" >Back</MDButton>
        <MDButton type="button" onClick={() => addEmployeeDesignationAccessEntryData()} className={`erp-gb-button ms-2 ${keyForViewUpdate === "view" ? 'd-none' : 'display'}`} variant="button"
          fontWeight="regular" >Save</MDButton>
        <MDButton type="button" className="erp-gb-button ms-2" onClick={() => {
          const path = compType === 'Register' ? '/Masters/EmployeesListing/reg' : '/Masters/EmployeesListing';
          navigate(path);
        }} variant="button" fontWeight="regular">Home</MDButton>



      </div>

      {/* Success Msg Popup */}
      <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
      {/* Error Msg Popup */}
      <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
    </>
  );
}

export default FrmEmployeeAccessRights;