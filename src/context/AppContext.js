import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
    isAuthenticated: null,
    companyId: null,
    companyBranchId: null,
    company_name: null,
    company_branch_name: null,
    company_address: null,
    department_id: null,
    department_name: null,
    branch_short_name: null,
    financialShortYear: null,
    companyShortName: null,
    financialYear: null,
    userId: null,
    user_code: null,
    userName: null,
    is_excess_allowed: null,
    erp_version: null,
    company_branch_type: null,
    company_category_count: null,
    earning_deduction_mapping_base: null,
    user_access: null,
    financial_short_name: null,
    page_routes: null,
    after_decimal_places: null,
    Listing_FilterPreferenceDetails: null,
    company_list: [],
    company_branch_list: [],
    financial_year_list: [],
    user: null,
    stores_email_id: null,
    company_access: null,
    grn_excess_percent: null,
    // ... other state properties
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_IS_AUTHENTICATED':
            return { ...state, isAuthenticated: action.payload };
        case 'SET_COMPANY_ID':
            return { ...state, companyId: action.payload };
        case 'SET_COMPANY_BRANCH_ID':
            return { ...state, companyBranchId: action.payload };
        case 'SET_COMPANY_NAME':
            return { ...state, company_name: action.payload };
        case 'SET_COMPANY_BRANCH_NAME':
            return { ...state, company_branch_name: action.payload };
        case 'SET_COMPANY_ADDRESS':
            return { ...state, company_address: action.payload };
        case 'SET_BRANCH_SHORT_NAME':
            return { ...state, branch_short_name: action.payload };
        case 'SET_SHORT_FINANCIAL_YEAR':
            return { ...state, financialShortYear: action.payload };
        case 'SET_SHORT_COMPANY':
            return { ...state, companyShortName: action.payload };
        case 'SET_FINANCIAL_YEAR':
            return { ...state, financialYear: action.payload };
        case 'SET_UserId':
            return { ...state, userId: action.payload };
        case 'SET_USER_CODE':
            return { ...state, user_code: action.payload };
        case 'SET_UserName':
            return { ...state, userName: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'IS_EXCESS_ALLOWED':
            return { ...state, is_excess_allowed: action.payload };
        case 'ERP_VERSION':
            return { ...state, erp_version: action.payload };
        case 'COMPANY_BRANCH_TYPE':
            return { ...state, company_branch_type: action.payload };
        case 'COMPANY_CATEGORY_COUNT':
            return { ...state, company_category_count: action.payload };
        case 'EARNING_DEDUCTION_MAPPING_BASE':
            return { ...state, earning_deduction_mapping_base: action.payload };
        case 'SET_USER_ACCESS':
            return { ...state, user_access: action.payload };
        case 'LISTING_FILTERPREFERENCEDETAILS':
            return { ...state, Listing_FilterPreferenceDetails: action.payload };
        case 'SET_FINANCIAL_SHORT_NAME':
            return { ...state, financial_short_name: action.payload };
        case 'SET_PAGE_ROUTES':
            return { ...state, page_routes: action.payload };
        case 'SET_DEPARTMENT_ID':
            return { ...state, department_id: action.payload };
        case 'SET_DEPARTMENT_NAME':
            return { ...state, department_name: action.payload };
        case 'AFTER_DECIMAL_PLACES':
            return { ...state, after_decimal_places: action.payload }
        case 'SET_COMPANY_LIST':
            return { ...state, company_list: action.payload }
        case 'SET_COMPANY_BRANCH_LIST':
            return { ...state, company_branch_list: action.payload }
        case 'SET_FINANCIAL_YEAR_LIST':
            return { ...state, financial_year_list: action.payload }
        case 'STORE_EMAIL_ID':
            return { ...state, stores_email_id: action.payload }
        case 'STORE_CONTACT_NO':
            return { ...state, stores_contact_no: action.payload }
        case 'SET_COMPANY_ACCESS':
            return { ...state, company_access: action.payload }
        case 'SET_GRN_EXCESS_PERCENT':
            return { ...state, grn_excess_percent: action.payload }

        case 'LOGOUT':
            sessionStorage.clear()
            localStorage.clear()
            return initialState;
        default:
            return state;
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };
