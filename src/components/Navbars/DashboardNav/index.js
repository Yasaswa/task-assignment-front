import React, { useEffect, useRef, useState } from 'react'

// React bootstrap imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import MDBox from "components/MDBox";
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import ConfigConstants from 'assets/Constants/config-constant';
import ComboBox from 'Features/ComboBox';
import Logout from 'Authentication/Logout';
import { resetGlobalQuery, globalQuery } from "assets/Constants/config-constant";
import { useAppContext } from "context/AppContext";
import { Button, Card, ListGroup } from 'react-bootstrap';
import PahupatiLogo from 'assets/images/logos/pahupati.jpeg'



function DashboardNav() {
    const configConstants = ConfigConstants();
    const { COMPANY_NAME, COMPANY_BRANCH_NAME, ERP_VERSION, FINANCIAL_SHORT_NAME, UserName,
        COMPANY_LIST, COMPANY_BRANCH_LIST, FINANCIAL_YEAR_LIST, USER, COMPANY_ID, COMPANY_BRANCH_ID , COMPANY_ACCESS} = configConstants;
    const [html, setHtml] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [financialYear, setFinancialYear] = useState([]);

    // Use Refs
    const comboBoxRef = useRef()
    const logoutRef = useRef()
    const navBarCollapseRef = useRef(null);
    const navigate = useNavigate()

    // Set values in the context
    const { dispatch } = useAppContext();
    const [showProfile, setShowProfile] = useState(false);
    const [companyAccess, setCompanyAccess] = useState(null);

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    useEffect(() => {
        const login_company_id = JSON.parse(localStorage.getItem("companyID"));
        console.log("login_company_id at dashboard: " + login_company_id);

        FnGetCompanyData()

        const handleClickOutside = (event) => {
            // Check if the clicked element is inside the navBarCollapse or the RxAvatar button
            if (navBarCollapseRef.current && !navBarCollapseRef.current.contains(event.target) && !event.target.classList.contains('head_nav_brand')) {
                setHtml(null);
            }
        };

        // Add the event listener to the document body
        document.body.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component is unmounted
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const FnGetCompanyData = async () => {
        // Get company & settings
        if (COMPANY_LIST !== null && COMPANY_LIST.length !== 0) {
            setCompanies(COMPANY_LIST)
            setBranches(COMPANY_BRANCH_LIST)
        } else {
            resetGlobalQuery();
            globalQuery.columns = ["field_id", "field_name", "company_short_name", "company_name", 'company_id'];
            globalQuery.table = "cmv_company";

            const getCompanies = await comboBoxRef.current.fillFiltersCombo(globalQuery)
            setCompanies(getCompanies)

            // Set company list in cofig constant
            dispatch({ type: 'SET_COMPANY_LIST', payload: getCompanies });
            localStorage.setItem('company_list', JSON.stringify(getCompanies))

            await FnGetCompanySettings(COMPANY_ID)

            FnSelectCompanyOnChange(COMPANY_ID, getCompanies)

            FnGetCompanyBranchs(COMPANY_ID)
        }




        // Get Financial year
        if (FINANCIAL_YEAR_LIST !== null && FINANCIAL_YEAR_LIST.length !== 0) {
            setFinancialYear(FINANCIAL_YEAR_LIST)
        } else {
            resetGlobalQuery();
            globalQuery.columns = ["field_id", "field_name", "short_year", 'financial_year', 'short_name'];
            globalQuery.table = "amv_financial_year";
            globalQuery.orderBy = ['financial_year_id DESC']

            const getFinanicalyear = await comboBoxRef.current.fillFiltersCombo(globalQuery)
            setFinancialYear(getFinanicalyear)

            // Set financial year list in cofig constant
            dispatch({ type: 'SET_FINANCIAL_YEAR_LIST', payload: getFinanicalyear })
            localStorage.setItem('financial_year_list', JSON.stringify(getFinanicalyear))

            if (getFinanicalyear !== null && getFinanicalyear?.length !== 0) {
                FnSetFinancialYear(getFinanicalyear[0])
            }
        }

    }

    const FnGetCompanySettings = async (company_id) => {
        // Category count from am company settings
        resetGlobalQuery();
        globalQuery.columns.push("*");
        globalQuery.conditions.push({
            field: "company_id",
            operator: "=",
            value: company_id
        });
        globalQuery.table = "am_company_settings"
        let masterList = await comboBoxRef.current.fillFiltersCombo(globalQuery)

        if (masterList.length !== 0) {
            let categoryCount = masterList[0].RawMaterialCategoryCount;

            localStorage.setItem('is_excess_allowed', masterList[0].is_excess_allowed)
            localStorage.setItem('erp_version', masterList[0].erp_version)
            localStorage.setItem('company_category_count', categoryCount)
            localStorage.setItem('after_decimal_places', masterList[0].after_decimal_places)
            localStorage.setItem('stores_email_id', masterList[0].stores_email_id)
            localStorage.setItem('stores_contact_no', masterList[0].stores_contact_no)
            localStorage.setItem('grn_excess_percent', masterList[0].grn_excess_percent)

            dispatch({ type: 'ERP_VERSION', payload: masterList[0].erp_version });
            dispatch({ type: 'IS_EXCESS_ALLOWED', payload: masterList[0].is_excess_allowed });
            dispatch({ type: 'COMPANY_CATEGORY_COUNT', payload: categoryCount });
            dispatch({ type: 'AFTER_DECIMAL_PLACES', payload: masterList[0].after_decimal_places });
            dispatch({ type: 'STORE_EMAIL_ID', payload: masterList[0].stores_email_id });
            dispatch({ type: 'STORE_CONTACT_NO', payload: masterList[0].stores_contact_no });
            dispatch({ type: 'GRN_EXCESS_PERCENT', payload: masterList[0].grn_excess_percent });

        }
    }

    const logout = async () => {
        await logoutRef.current.logoutUser()
        navigate('/login')
    }

    function navBarCollapse() {

        if (html != null) {
            return (setHtml(null))
        } else {
            return (<div id="mySidenav" className="z-1 py-4 border rounded" style={{
                position: "absolute", right: "18px", top: "42px", backgroundColor: "white", width: "230px", height: "250px"
            }}>

                <div><h6 className="mx-3" style={{ color: '#831657' }}>{USER}</h6></div>
                <hr />
                <div className="my-1">
                    <div class="sign-out"><Link to="/Masters/MUserPasswordChange" className="mx-3 my-2 fw-normal">Change Password</Link></div>
                </div>
                <div className="my-1">
                    <div class="sign-out"><Link to="#" onClick={logout} className="mx-3 my-2 fw-normal">Sign Out</Link></div>
                </div>
            </div >)
        }

    }

    const FnSelectCompanyOnChange = async (eventKey, companyList) => {
        let event = '';
        if (companyList?._reactName === 'onClick') {
            event = 'onClick'
            companyList = companies; // Assign branches if companyBranchList is null or undefined
        }

        let companyDetails = companyList.find(item => item.field_id === parseInt(eventKey))

        if (companyDetails) {
            localStorage.setItem('companyID', companyDetails.company_id)
            localStorage.setItem('company_name', companyDetails.company_name)
            localStorage.setItem('companyShortName', companyDetails.company_short_name);

            dispatch({ type: 'SET_COMPANY_ID', payload: companyDetails.company_id });
            dispatch({ type: 'SET_COMPANY_NAME', payload: companyDetails.company_name });
            dispatch({ type: 'SET_SHORT_COMPANY', payload: companyDetails.company_short_name });

            await FnGetCompanyBranchs(companyDetails.field_id)

            await FnGetCompanySettings(companyDetails.field_id)

            if (event === 'onClick') {
                navigate('/DashBoard')
                window.location.reload();
            }

        }

    };

    const FnSelectBranchOnChange = (eventKey, companyBranchList) => {
        let event = '';
        if (companyBranchList?._reactName === 'onClick') {
            event = 'onClick'
            companyBranchList = branches; // Assign branches if companyBranchList is null or undefined
        }
        let companyBranchDetails = companyBranchList.find(item => item.field_id === parseInt(eventKey))

        if (companyBranchDetails) {
            localStorage.setItem('companyBranchID', companyBranchDetails.company_branch_id)
            localStorage.setItem('company_branch_name', companyBranchDetails.company_branch_name)
            localStorage.setItem('companyAddress', companyBranchDetails.branch_address1)
            sessionStorage.setItem('companyAddress', companyBranchDetails.branch_address1)
            localStorage.setItem('company_branch_type', companyBranchDetails.company_branch_type)
            localStorage.setItem('branch_short_name', companyBranchDetails.branch_short_name)

            dispatch({ type: 'SET_COMPANY_BRANCH_ID', payload: companyBranchDetails.company_branch_id });
            dispatch({ type: 'SET_COMPANY_BRANCH_NAME', payload: companyBranchDetails.company_branch_name });
            dispatch({ type: 'SET_COMPANY_ADDRESS', payload: companyBranchDetails.branch_address1 });
            dispatch({ type: 'SET_BRANCH_SHORT_NAME', payload: companyBranchDetails.branch_short_name });
            dispatch({ type: 'SET_COMPANY_BRANCH_TYPE', payload: companyBranchDetails.company_branch_type });

            if (event === 'onClick') {
                navigate('/DashBoard')
                window.location.reload();
            }


        }
    }

    const FnSelectFinancialYearOnChange = (eventKey, event) => {
        let financialYearDetails = financialYear.find(item => item.field_id === eventKey)
        FnSetFinancialYear(financialYearDetails)
        if (event?._reactName === 'onClick') {
            window.location.reload()
            navigate('/DashBoard')
        }
    }

    const FnSetFinancialYear = (financialYearDetails) => {
        if (financialYearDetails) {
            localStorage.setItem('financialShortYear', financialYearDetails.short_year);
            localStorage.setItem('financialYear', financialYearDetails.financial_year);
            localStorage.setItem('financial_short_name', financialYearDetails.field_id);

            dispatch({ type: 'SET_SHORT_FINANCIAL_YEAR', payload: financialYearDetails.short_year });
            dispatch({ type: 'SET_FINANCIAL_YEAR', payload: financialYearDetails.financial_year });
            dispatch({ type: 'SET_FINANCIAL_SHORT_NAME', payload: financialYearDetails.field_id });
        }
    }

    const FnGetCompanyBranchs = async (company_id) => {
        // Get company branchs
        if (COMPANY_BRANCH_LIST !== null && COMPANY_BRANCH_LIST.length !== 0 && COMPANY_BRANCH_LIST[0].company_id === company_id) {
            setBranches(COMPANY_BRANCH_LIST)
            const getMainBranch = COMPANY_BRANCH_LIST.find(item => item.branch_type === 'Main')
            FnSelectBranchOnChange(getMainBranch?.company_branch_id, COMPANY_BRANCH_LIST)
        } else {
            resetGlobalQuery();
            globalQuery.columns = ["field_id", "field_name", 'company_id', 'company_branch_name', 'branch_type', 'branch_short_name',
                'company_branch_id', 'branch_address1', 'branch_address2', 'company_branch_type', 'company_branch_id', 'company_branch_type'];
            globalQuery.conditions.push({
                field: "company_id",
                operator: "=",
                value: company_id
            });
            globalQuery.table = "cmv_company_branch";

            const companyBranchs = await comboBoxRef.current.fillFiltersCombo(globalQuery)
            setBranches(companyBranchs)

            // Set company branch list in cofig constant
            dispatch({ type: 'SET_COMPANY_BRANCH_LIST', payload: companyBranchs });
            localStorage.setItem('company_branch_list', JSON.stringify(companyBranchs))

            const getMainBranch = companyBranchs.find(item => item.branch_type === 'Main')
            FnSelectBranchOnChange(getMainBranch?.company_branch_id, companyBranchs)
        }
    }

    return (
        <>
            <Logout ref={logoutRef} />
            <ComboBox ref={comboBoxRef} />

            <Navbar collapseOnSelect expand="sm" className="erp_Header_navbar mx-0">
                {/* <div className="container-fluid"> */}
                <Navbar.Brand className="head_nav_brand ms-0 ms-md-2">
                    {/* {ERP_VERSION} */}
                    <img src={PahupatiLogo} alt='Pashupati' style={{ height: '40px' }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className='p-0 border-0' />

                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" ref={navBarCollapseRef}>
                    {/* <div className="justify-content-end" ref={navBarCollapseRef}> */}
                    <Nav className="mr-md-auto ms-2 navbar-nav" >
                    {/* disabled = {COMPANY_ACCESS === '0' ? false : true} */}
                        <NavDropdown title={<span style={{ fontWeight: 'bold' }}>{COMPANY_NAME}</span>} disabled = {true}
                            onSelect={FnSelectCompanyOnChange} id="basic-nav-dropdown" className='navbar-dropdown-color' >
                            {companies.map(item => (
                                <NavDropdown.Item className='navbar-dropdown-item-color' key={item.field_id} eventKey={item.field_id}>{item.field_name}</NavDropdown.Item>
                            ))}
                        </NavDropdown>
                        <NavDropdown title={COMPANY_BRANCH_NAME} onSelect={FnSelectBranchOnChange} id="basic-nav-dropdown" className='navbar-dropdown-color'  disabled = {true} >
                            {branches.map(item => (
                                <NavDropdown.Item className='navbar-dropdown-item-color' key={item.field_id} eventKey={item.field_id}>{item.field_name}</NavDropdown.Item>
                            ))} 
                        </NavDropdown>
                        <NavDropdown title={FINANCIAL_SHORT_NAME} onSelect={FnSelectFinancialYearOnChange} id="basic-nav-dropdown" className='navbar-dropdown-color' >
                            {financialYear.map(item => (
                                <NavDropdown.Item className='navbar-dropdown-item-color' key={item.field_id} eventKey={item.field_id}>{item.financial_year}</NavDropdown.Item>
                            ))}
                        </NavDropdown>

                        <div onClick={(() => setHtml(navBarCollapse()))} className="head_nav_brand ms-0"><RxAvatar size="1.7em" /></div>
                    </Nav>
                    {/* </div> */}
                    {html}
                </Navbar.Collapse>
                {/* </div> */}
            </Navbar >

        </>
    )
}

export default DashboardNav;