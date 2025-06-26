import { useAppContext } from 'context/AppContext';

const ConfigConstants = () => {
  const { state } = useAppContext();

  return {
    IS_AUTHENTICATED: state.isAuthenticated === null
      ? (() => {
        const storedValue = localStorage.getItem('isAuthenticated');
        return storedValue !== undefined && storedValue !== null && storedValue !== '' ? JSON.parse(storedValue) : false;
      })()
      : state.isAuthenticated,
    COMPANY_ID: state.companyId === null ? localStorage.getItem('companyID') : state.companyId,
    COMPANY_BRANCH_ID: state.companyBranchId === null ? localStorage.getItem('companyBranchID') : state.companyBranchId,
    COMPANY_NAME: state.company_name === null ? localStorage.getItem('company_name') : state.company_name,
    COMPANY_BRANCH_NAME: state.company_branch_name === null ? localStorage.getItem('company_branch_name') : state.company_branch_name,
    COMPANY_ADDRESS: state.company_address === null ? localStorage.getItem('companyAddress') : state.company_address,
    COMPANY_BRANCH_SHORT_NAME: state.branch_short_name === null ? localStorage.getItem('branch_short_name') : state.branch_short_name,
    DEPARTMENT_ID: state.department_id === null ? localStorage.getItem('department_id') : state.department_id,
    DEPARTMENT_NAME: state.department_name === null ? localStorage.getItem('department_name') : state.department_name,
    SHORT_FINANCIAL_YEAR: state.financialShortYear === null ? localStorage.getItem('financialShortYear') : state.financialShortYear,
    SHORT_COMPANY: state.companyShortName === null ? localStorage.getItem('companyShortName') : state.companyShortName,
    FINANCIAL_YEAR: state.financialYear === null ? localStorage.getItem('financialYear') : state.financialYear,
    FINANCIAL_SHORT_NAME: state.financial_short_name === null ? localStorage.getItem('financial_short_name') : state.financial_short_name,
    UserId: state.userId === null ? localStorage.getItem('userId') : state.userId,
    USER_CODE: state.user_code === null ? localStorage.getItem('user_code') : state.user_code,
    UserName: state.userName === null ? localStorage.getItem('userName') : state.userName,
    USER: state.user === null ? localStorage.getItem('user') : state.user,
    IS_EXCESS_ALLOWED: state.is_excess_allowed === null ? localStorage.getItem('is_excess_allowed') : state.is_excess_allowed,
    ERP_VERSION: state.erp_version === null ? localStorage.getItem('erp_version') : state.erp_version,
    COMPANY_BRANCH_TYPE: state.company_branch_type === null ? localStorage.getItem('company_branch_type') : state.company_branch_type,
    COMPANY_CATEGORY_COUNT: state.company_category_count === null ? localStorage.getItem('company_category_count') : state.company_category_count,
    EARNING_DEDUCTION_MAPPING_BASE: state.earning_deduction_mapping_base === null ? localStorage.getItem('earning_deduction_mapping_base') : state.earning_deduction_mapping_base,
    USER_ACCESS: state.user_access === null ? JSON.parse(localStorage.getItem('user_access')) : state.user_access,
    PAGE_ROUTES: state.page_routes === null ? JSON.parse(localStorage.getItem('page_routes')) : state.page_routes,
    AFTER_DECIMAL_PLACES: state.after_decimal_places === null ? JSON.parse(localStorage.getItem('after_decimal_places')) : state.after_decimal_places,
    LISTING_FILTERPREFERENCEDETAILS: state.Listing_FilterPreferenceDetails === null ? JSON.parse(localStorage.getItem('Listing_FilterPreferenceDetails')) : state.Listing_FilterPreferenceDetails,
    COMPANY_LIST: state.company_list?.length === 0 ? JSON.parse(localStorage.getItem('company_list')) : state.company_list,
    COMPANY_BRANCH_LIST: state.company_branch_list?.length === 0 ? JSON.parse(localStorage.getItem('company_branch_list')) : state.company_branch_list,
    FINANCIAL_YEAR_LIST: state.financial_year_list?.length === 0 ? JSON.parse(localStorage.getItem('financial_year_list')) : state.financial_year_list,
    STORE_CONTACT_NO: state.stores_contact_no === null ? localStorage.getItem('stores_contact_no') : state.stores_contact_no,
    STORES_EMAIL_ID: state.stores_email_id === null ? localStorage.getItem('stores_email_id') : state.stores_email_id,
    COMPANY_ACCESS: state.company_access === null ? localStorage.getItem('company_access') : state.company_access,
    GRN_EXCESS_PERCENT: state.grn_excess_percent === null ? localStorage.getItem('grn_excess_percent') : state.grn_excess_percent,

  };
};

export default ConfigConstants;

// globalQueryObject.js
export var globalQuery = {
  operation: "select",
  columns: [],
  table: "",
  conditions: [],
  joins: [],
  groupBy: [],
  orderBy: []
};

export const resetGlobalQuery = () => {
  globalQuery = {
    operation: "select",
    columns: [],
    table: "",
    conditions: [],
    joins: []
  };
}


//Sample JSON
//{
//  "operation": "select",
//  "columns": ["column1", "column2"],
//  "table": "tablename",
//  "conditions": [
//    {
//      "field": "column1",
//      "operator": "=",
//      "value": "some_value"
//    },
//    {
//      "field": "column2",
//      "operator": ">",
//      "value": 100
//    }
//  ],
// "groupBy": ["column1"],
// "orderBy": ["column2 ASC"],
//  "joins": [
//    {
//      "table": "another_table",
//      "type": "inner",
//      "on": [{
//        "left": "tablename.column_id",
//        "right": "another_table.id"
//      },
//     {
//        "left": "tablename.column_id",
//        "right": "another_table.id"
//      }
// ]
//    }
//  ]
//}

//How to Append values to the global JSON

//  globalQuery.columns.push("column1");
//  globalQuery.columns.push("column2");

//  globalQuery.table = "table_name"

//  globalQuery.conditions.push({
//    field: "column1",
//    operator: "=",
//    value: "some_value"
//  });
//  globalQuery.conditions.push({
//    field: "column1",
//    operator: "=",
//    value: "some_value"
//  });
//
//  globalQuery.joins.push({
//    table: "another_table",
//    type: "inner",
//    on: {
//      left: "tablename.column_id",
//      right: "another_table.id"
//    }
//  });