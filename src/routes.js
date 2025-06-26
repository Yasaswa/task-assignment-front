// Login
import Login from "Authentication/Login";
// Invoice Template

//HelpCenter from FrmGeneric/Help/helpCenter
import HelpCenter from "FrmGeneric/Help/helpCenter";
import WeavingSizingHelp from "Help/HWeavingProduction/WeavingSizingHelp";
import WeavingHelp from "Help/HWeavingProduction/WeavingHelp";
import HrPolicyHelp from "Help/HR/HrPolicyHelp";

// import InvoiceTemplate from "FrmGeneric/InvoiceTemplate";
// Error 500
import Error_500 from "components/Errors/Error_500";
import Netcheck from "components/NetworkCheck/Netcheck";
// Dashboard
import DashBoard from "DashBoard";
// Company
import FrmMCompanyList from "Masters/MCompany/FrmMComapnyList";
import FrmMComapny from "Masters/MCompany/FrmCompany";
// Financial Year
import FrmFinancialYearListing from "Masters/MFinancialYear/FrmFinancialYearEntry";
import FrmFinancialYearEntry from "Masters/MFinancialYear/FrmFinancialYearEntry";
// Banks
import FrmMBankList from "Masters/MBanks/FrmMBankList";
import FrmMBankEntry from "Masters/MBanks/FrmBank/components/FrmMBankEntry";
// Departments
import FrmMDepartmentList from "Masters/MDepartment/FrmMDepartmentList";
import FrmDepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry";
// Designations
import FrmMDesignationList from "Masters/MDesignation/FrmMDesingnationList";
import FrmDesignation from "Masters/MDesignation/FrmDesignation";
// Employees
import FrmMEmployeeList from "Masters/MEmployee/FrmMEmployeesList";
import MEmployeeEntry from "Masters/MEmployee/MEmployeeEntry";
import MEmployeePrint from "Masters/MEmployee/MEmployeePrint";
import MEmployeeWorkerPrint from "Masters/MEmployee/MEmployeeWorkerPrint";
import FrmPayrollSettingEntry from "./Masters/MPayrollSetting/FrmPayrollSettingEntry"
import FrmPayrollSettingListing from "./Masters/MPayrollSetting/FrmPayrollSettingListing";

// Customers
// import FrmMCustomerList from "Masters/MCustomer/FrmMCustomerList";
// import FrmCustomerEntry from "Masters/MCustomer/FrmCustomerEntry";
// Suppliers
// import FrmSpplierList from "Masters/MSupplier/FrmSupplierList";
// import FrmSupplier from "Masters/MSupplier/FrmSupplier";
// Agents
import FrmAgentList from "Masters/MAgent/FrmAgentList";
import FrmMAgent from "Masters/MAgent/FrmMAgent";
// Contractors
import FrmMContractorList from "Masters/MContractor/FrmMContractorList";
import FrmContractorEntry from "Masters/MContractor/FrmContractorEntry";
// Transporter
import FrmMTransporterList from "Masters/MTransporter/FrmMTransporterList";
import FrmTransporter from "Masters/MTransporter/FrmTransporter";
// City
import FrmCityList from "Masters/MCity/FrmCityList";
import FrmCity from "FrmGeneric/MCity/FrmCity";

// Destinations
import FrmMDestinationList from "Masters/MDestination/FrmMDestinationList";
import FrmDestinationEntry from "Masters/MDestination/FrmDestinationEntry";

// HSN-SAC Codes
import FrmMHSNSACList from "Masters/MHSN-SAC/FrmMHSN-SACList";
import FrmHSNSAC from "Masters/MHSN-SAC/FrmHSN-SAC";
// Payment Schedules
import FrmPaymentScheduleListing from "Masters/MPaymentSchedule/FrmPaymentScheduleListing";
import FrmPaymentScheduleEntry from "Masters/MPaymentSchedule/FrmPaymentScheduleEntry";
// Payments Terms
import FrmPaymentTemrsListing from "Masters/MPaymentTerms/FrmPaymentTermsListing";
import FrmPaymentTermsEntry from "Masters/MPaymentTerms/FrmPaymentTermsEntry";
// Tax Types
import FrmMTaxtypeList from "Masters/MTaxtype/FrmMTaxtypeListing";
import FrmMTaxtypeEntry from "Masters/MTaxtype/FrmMTaxtypeEntry";
// Taxations
import FrmMTaxationList from "Masters/MTaxation/FrmMTaxationList";
import FrmTaxationEntry from "Masters/MTaxation/FrmTaxationEntry";
// Shifts
import FrmShiftListing from "Masters/MShift/FrmShiftListing";
import FrmShiftEntry from "Masters/MShift/FrmShiftEntry";
// Holidays
import FrmHolidayListing from "Masters/MHoliday/FrmHolidayListing";
import FrmHolidayEntry from "Masters/MHoliday/FrmHolidayEntry"
// Product-Raw Materials
// Product Unit Conversions
// Product- Services
import FrmMServiceListing from "Masters/MService/FrmMServiceListing";
import FrmMServiceEntry from "Masters/MService/FrmMServiceEntry"

// Product Unit

// Properties
import FrmPropertyListing from "Masters/MProperty/FrmPropertyListing";
import FrmPropertyEntry from "Masters/MProperty/FrmPropertyEntry";
// Communication Templates
import FrmCommunicationsMasterList from "Masters/MCommunicationsMaster/FrmCommunicationsMasterList";
import FrmCommunicationsMasterEntry from "Masters/MCommunicationsMaster/FrmCommunicationsMasterEntry";
// Common Parameters
import CommonParamterListing from "Masters/MCommonParameter/CommonParamterListing";
import CommonParamterEntry from "Masters/MCommonParameter/CommonParamterEntry"
// Modules
import ModuleFormListing from "Masters/MAMModuleForm/ModuleFormListing";
import ModuleFormEntry from "Masters/MAMModuleForm/ModuleFormEntry";

// Profit Centers
import ProfitCenterListing from "Masters/ProfitCenter/ProfitCenterListing";
import ProfitCenterEntry from "Masters/ProfitCenter/ProfitCenterEntry";
// Schedules
import MFMScheduleLedgerListing from "Masters/MFMScheduleLedger/MFMScheduleLedgerListing";
import MFMScheduleLedgerEntry from "Masters/MFMScheduleLedger/MFMScheduleLedgerEntry";
// Generals
import MFMGeneralLedgerListing from "Masters/MFMGeneralLedger/MFMGeneralLedgerListing";
import MFMGeneralLedgerEntry from "Masters/MFMGeneralLedger/MFMGeneralLedgerEntry";
// Plants
import FrmPlantlist from "Masters/MPlant/FrmPlantList";
import FrmPlantEntry from "Masters/MPlant/FrmPlantEntry";



// Maintainance Tasks Master
import FrmMaintenanceTaskMasterListing from "Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing";
import FrmMaintenanceTaskMasterEntry from "Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterEntry";
// Maintainance Tasks Activity
import MmaintenanceTaskActivityListing from "Masters/MaintenanceTaskActivity/MmaintenanceTaskActivityListing";
import MmaintenanceTaskActivityEntry from "Masters/MaintenanceTaskActivity/MmaintenanceTaskActivityEntry";
// Electrical Meters
import MFrmProductionElectricalMeterListing from "Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing";
import MFrmProductionElectricalMeterEntry from "Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterEntry";
// Earning Heads
import FrmMHMEarningHeadsListing from "Masters/MHMEarningHeads/FrmMHMEarningHeadsListing";
import FrmMHMEarningHeadsEntry from "Masters/MHMEarningHeads/FrmMHMEarningHeadsEntry"
// Deductions Heads
import FrmMHMDeductionHeadsListing from "Masters/MHMDeductionHeads/FrmMHMDeductionHeadsListing";
import FrmMHMDeductionHeadsEntry from "Masters/MHMDeductionHeads/FrmMHMDeductionHeadsEntry"

// Employee Type
import MEmployeeTypeListing from "Masters/MEmployeeType/MEmployeeTypeListing";

// Production Section
// import FrmProductionSectionListing from "Masters/MProductionSection/FrmProductionSectionListing/Index";
// import FrmProductionSectionEntry from "Masters/MProductionSection/FrmProductionSectionEntry";
// Production Sub Section

import FrmProfessionalTaxationEntry from "Masters/MProfessionalTaxation/FrmProfessionalTaxationEntry";

import FrmMCodificationEntry from "Masters/MCodification/FrmMCodificationEntry";
import MCodificationListing from "Masters/MCodification/MCodificationList";
import FrmJobTypeListing from "Masters/MJobType/FrmJobTypeListing";
import FrmJobTypeEntry from "Masters/MJobType/FrmJobTypeEntry";
import FrmLeavesEntry from "Masters/MLeaves/FrmLeavesEntry";


import ProductionRegister from "Masters/ProductionRegister";


// bank List form
import FrmBankListListing from "Masters/MBankList/FrmBankListListing";
import FrmBankListEntry from "Masters/MBankList/FrmBankListEntry";
// Leave Application
import FrmLeavesApplicationListing from "./Masters/MLeavesApplication/FrmLeavesApplicationListing";
import FrmLeavesApplicationEntry from "./Masters/MLeavesApplication/FrmLeavesApplicationEntry";

// Attendance Device
import FrmAttendanceDeviceListing from "Masters/MAttendanceDevice/FrmAttendanceDeviceListing";
import FrmAttendanceDeviceEntry from "Masters/MAttendanceDevice/FrmAttendanceDeviceEntry";
// Leave Type 
import FrmLeaveTypeEntry from "Masters/MLeaveType/FrmLeaveTypeEntry";
import FrmLeaveTypeListing from "Masters/MLeaveType/FrmLeaveTypeListing";


// For Service Activity Master
import FrmMServiceActivityListing from "Masters/MServiceActivity/MServiceActivityListing";
import FrmMServiceActivityEntry from "Masters/MServiceActivity/MServiceActivityEntry";

// Sizing Production

import FrmRateEntry from "Masters/MRate/FrmRateEntry";

// Product Material Type
import FrmCostCenterHeadsListing from "Masters/MCostCenterHeads/FrmCostCenterHeadsListing";
import FrmCostCenterHeadsEntry from "Masters/MCostCenterHeads/FrmCostCenterHeadsEntry";


// E-invoicing & E-Way billing 
import MFrmProductionLotEntry from "Masters/MProductionLot/MFrmProductionLotEntry";
import MFrmProductionLotListing from "Masters/MProductionLot/MFrmProductionLotListing";
import FrmEmployeeGradeListing from "Masters/MEmployeeGrade/FrmEmployeeGradeListing";
import FrmEmployeeGrade from "Masters/MEmployeeGrade/FrmEmployeeGrade";
import FrmJobAssignEntry from "Masters/MJobAssign/FrmJobAssignEntry";
import FrmJobAssignListing from "Masters/MJobAssign/FrmJobAssignListing";

import FrmShiftRosterListing from "Masters/MShiftRoster/MShiftRosterListing";
import FrmShiftRosterEntry from "Masters/MShiftRoster/MShiftRosterEntry";

import MUserPasswordChange from "Masters/MUserPasswordChange";
// import FrmDailyAttendanceEntry from "Masters/MDailyAttendanceProcess/FrmDailyAttendanceEntry";

import FrmContractorCommissionEntry from "./Masters/MContractorCommission/FrmContractorCommissionEntry";
import FrmContractorCommissionList from "./Masters/MContractorCommission/FrmContractorCommissionList";
import FrmCompOffLeaveList from "./Masters/MCompOffLeaveRequest/FrmCompOffLeaveList";
import FrmCompOffLeaveEntry from "./Masters/MCompOffLeaveRequest/FrmCompOffLeaveEntry";
import Reset from "Authentication/Reset"




//Task Master
import FrmTaskMasterEntry from "Masters/MTaskMaster/MTaskMasterEntry";
import FrmTaskMasterListing from "Masters/MTaskMaster/MTaskMasterListing";


const routes = [

    {
        type: "Masters",
        name: "Task Master",
        route: "/Master/MTaskMaster/MTaskMasterListing",
        component: <FrmTaskMasterListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MTaskMaster/MTaskMasterEntry",
        component: <FrmTaskMasterEntry />,
        header: true,
        footer: true,
        protected: false
    },

    {
        route: "/login",
        component: <Login />,
        header: false,
        footer: true,
        protected: true
    }, {
        route: "/Authentication/Reset",
        component: <Reset />,
        header: false,
        footer: true,
        protected: true
    },

    // {
    //     route: "/Invoice",
    //     component: <InvoiceTemplate />,
    //     header: false,
    //     footer: false,
    //     protected: true
    // },
    {
        route: "/Error",
        component: <Error_500 />,
        header: false,
        footer: false,
        protected: true
    },
    {
        route: "/DashBoard",
        component: <DashBoard />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Company",
        route: "/Masters/CompanyListing",
        component: <FrmMCompanyList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Company",
        component: <FrmMComapny />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Financial Year",
        route: "/Masters/MFinancialYear/FrmFinancialYearListing",
        component: <FrmFinancialYearListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MFinancialYear/FrmFinancialYearEntry",
        component: <FrmFinancialYearEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Banks",
        route: "/Masters/BankListing",
        component: <FrmMBankList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MBanks/FrmBank/FrmMBankEntry",
        component: <FrmMBankEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Departments",
        route: "/Masters/DepartmentListing",
        component: <FrmMDepartmentList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Department",
        component: <FrmDepartmentEntry />,
        header: true,
        footer: true,
        protected: false
    },
    // {
    //     type: "Masters",
    //     name: "Designations",
    //     route: "/Masters/MDesignation/FrmMDesingnationList",
    //     component: <FrmMDesignationList />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    // {
    //     route: "/Masters/Designation",
    //     component: <FrmDesignation />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    //employee grade
    {
        type: "Masters",
        name: "Employee Grade",
        route: "/Masters/MEmployeeGrade/FrmEmployeeGradeListing",
        component: <FrmEmployeeGradeListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MEmployeeGrade/FrmEmployeeGrade",
        component: <FrmEmployeeGrade />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Employees",
        route: "/Masters/EmployeesListing",
        component: <FrmMEmployeeList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Employees",
        component: <MEmployeeEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MEmployee/MEmployeePrint",
        component: <MEmployeePrint />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MEmployee/MEmployeeWorkerPrint",
        component: <MEmployeeWorkerPrint />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Payroll Settings",
        route: "/Masters/MPayrollSetting/FrmPayrollSettingEntry",
        component: <FrmPayrollSettingEntry />,
        header: true,
        footer: true,
        protected: false,
    },
    {
        type: "Masters",
        name: "Payroll Settings",
        route: "/Masters/MPayrollSetting/FrmPayrollSettingListing",
        component: <FrmPayrollSettingListing />,
        header: true,
        footer: true,
        protected: false,
    },

    // {
    //     type: "Masters",
    //     name: "Customers",
    //     route: "/Masters/CustomerListing",
    //     component: <FrmMCustomerList />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    // {
    //     route: "/Masters/Customer",
    //     component: <FrmCustomerEntry />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
   
    {
        type: "Masters",
        name: "Agents",
        route: "/Masters/AgentListing",
        component: <FrmAgentList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Agent",
        component: <FrmMAgent />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Contractors",
        route: "/Masters/ContractorListing",
        component: <FrmMContractorList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Contractor",
        component: <FrmContractorEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Transporter",
        route: "/Masters/TransporterListing",
        component: <FrmMTransporterList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Transporter",
        component: <FrmTransporter />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "City",
        route: "/Masters/CityListing",
        component: <FrmCityList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/City",
        component: <FrmCity />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Destinations",
        route: "/Masters/DestinationListing",
        component: <FrmMDestinationList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Destination",
        component: <FrmDestinationEntry />,
        header: true,
        footer: true,
        protected: false
    },

    {
        type: "Masters",
        name: "HSN-SAC Codes",
        route: "/Masters/HSNSACListing",
        component: <FrmMHSNSACList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/HSNSAC",
        component: <FrmHSNSAC />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Payment Schedules",
        route: "/Masters/FrmPaymentScheduleListing",
        component: <FrmPaymentScheduleListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPaymentScheduleEntry",
        component: <FrmPaymentScheduleEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Payments Terms",
        route: "FrmPaymentTemrsListing",
        component: <FrmPaymentTemrsListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPaymentTermsEntry",
        component: <FrmPaymentTermsEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Tax Types",
        route: "/Masters/TaxtypeListing",
        component: <FrmMTaxtypeList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Taxtype",
        component: <FrmMTaxtypeEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Taxations",
        route: "/Masters/TaxationListing",
        component: <FrmMTaxationList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Taxation",
        component: <FrmTaxationEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Shifts",
        route: "Masters/MShift/FrmShiftListing",
        component: <FrmShiftListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmShiftEntry",
        component: <FrmShiftEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Holidays",
        route: "/Masters/MHoliday/FrmHolidayListing",
        component: <FrmHolidayListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MHoliday/FrmHolidayEntry",
        component: <FrmHolidayEntry />,
        header: true,
        footer: true,
        protected: false
    },

    {
        type: "Masters",
        name: "Product- Services",
        route: "Masters/MService/FrmMServiceListing",
        component: <FrmMServiceListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MService/FrmMServiceEntry",
        component: <FrmMServiceEntry />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        type: "Masters",
        name: "Company Settings",
        route: "/Masters/CompanyListing",
        component: <FrmMCompanyList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Company",
        component: <FrmMComapny />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Properties",
        route: "/Masters/FrmPropertyListing",
        component: <FrmPropertyListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPropertyEntry",
        component: <FrmPropertyEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Communication Templates",
        route: "/Masters/MCommunicationsMaster/FrmCommunicationsMasterList",
        component: <FrmCommunicationsMasterList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MCommunicationsMaster/FrmCommunicationsMasterEntry",
        component: <FrmCommunicationsMasterEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Common Parameters",
        route: "/Masters/MCommonParameter/CommonParamterListing",
        component: <CommonParamterListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MCommonParameter/CommonParamterEntry",
        component: <CommonParamterEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Modules",
        route: "/Masters/ModuleFormListing",
        component: <ModuleFormListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/ModuleFormEntry",
        component: <ModuleFormEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Financial Year",
        route: "/Masters/MFinancialYear/FrmFinancialYearListing",
        component: <FrmFinancialYearListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MFinancialYear/FrmFinancialYearEntry",
        component: <FrmFinancialYearEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Profit Centers",
        route: "/Masters/ProfitCenterListing",
        component: <ProfitCenterListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/ProfitCenterEntry",
        component: <ProfitCenterEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "HSN-SAC Codes",
        route: "/Masters/HSNSACListing",
        component: <FrmMHSNSACList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/HSNSAC",
        component: <FrmHSNSAC />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Payment Schedules",
        route: "/Masters/FrmPaymentScheduleListing",
        component: <FrmPaymentScheduleListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPaymentScheduleEntry",
        component: <FrmPaymentScheduleEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Payments Terms",
        route: "/Masters/FrmPaymentTermsListing",
        component: <FrmPaymentTemrsListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPaymentTermsEntry",
        component: <FrmPaymentTermsEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Tax Types",
        route: "/Masters/TaxtypeListing",
        component: <FrmMTaxtypeList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Taxtype",
        component: <FrmMTaxtypeEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Taxations",
        route: "/Masters/TaxationListing",
        component: <FrmMTaxationList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Taxation",
        component: <FrmTaxationEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Schedules",
        route: "/Masters/MFMScheduleLedgerListing",
        component: <MFMScheduleLedgerListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MFMScheduleLedgerEntry",
        component: <MFMScheduleLedgerEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Generals",
        route: "/Masters/MFMGeneralLedgerListing",
        component: <MFMGeneralLedgerListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MFMGeneralLedgerEntry",
        component: <MFMGeneralLedgerEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Plants",
        route: "/Masters/FrmPlantlist",
        component: <FrmPlantlist />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmPlantEntry",
        component: <FrmPlantEntry />,
        header: true,
        footer: true,
        protected: false
    },
   
    {
        type: "Masters",
        name: "Shifts",
        route: "/Masters/FrmShiftListing",
        component: <FrmShiftListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmShiftEntry",
        component: <FrmShiftEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Production Holidays",
        route: "/Masters/MHoliday/FrmHolidayListing",
        component: <FrmHolidayListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MHoliday/FrmHolidayEntry",
        component: <FrmHolidayEntry />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        type: "Masters",
        name: "Maintainance Tasks Master",
        route: "/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing",
        component: <FrmMaintenanceTaskMasterListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterEntry",
        component: <FrmMaintenanceTaskMasterEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Maintainance Tasks Activity",
        route: "/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing",
        component: <MmaintenanceTaskActivityListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MaintenanceTaskActivity/MmaintenanceTaskActivityEntry",
        component: <MmaintenanceTaskActivityEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Electrical Meters",
        route: "/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing",
        component: <MFrmProductionElectricalMeterListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterEntry",
        component: <MFrmProductionElectricalMeterEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Departments",
        route: "/Masters/DepartmentListing",
        component: <FrmMDepartmentList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Department",
        component: <FrmDepartmentEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Designations",
        route: "/Masters/DesignationListing",
        component: <FrmMDesignationList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Designation",
        component: <FrmDesignation />,
        header: true,
        footer: true,
        protected: false
    },
    // {
    //     route: "/Masters/Destination",
    //     component: <FrmDestinationEntry />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    {
        type: "Masters",
        name: "Holidays",
        route: "/Masters/MHoliday/FrmHolidayListing",
        component: <FrmHolidayListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MHoliday/FrmHolidayEntry",
        component: <FrmHolidayEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Employees",
        route: "/Masters/EmployeesListing",
        component: <FrmMEmployeeList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/Employees",
        component: <MEmployeeEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Shifts",
        route: "/Masters/FrmShiftListing",
        component: <FrmShiftListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/FrmShiftEntry",
        component: <FrmShiftEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Earning Heads",
        route: "/Masters/MHMEarningHeads/MHMEarningHeadsListing",
        component: <FrmMHMEarningHeadsListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MHMEarningHeads/FrmMHMEarningHeadsEntry",
        component: <FrmMHMEarningHeadsEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "Deductions Heads",
        route: "/Masters/MHMDeductionHeads/FrmMHMDeductionHeadsListing",
        component: <FrmMHMDeductionHeadsListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MHMDeductionHeads/FrmMHMDeductionHeadsEntry",
        component: <FrmMHMDeductionHeadsEntry />,
        header: true,
        footer: true,
        protected: false
    },
    {
        type: "Masters",
        name: "City",
        route: "/Masters/CityListing",
        component: <FrmCityList />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/City",
        component: <FrmCity />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        type: "Masters",
        name: "Product- Services",
        route: "/Masters/FrmMServiceListing",
        component: <FrmMServiceListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/MService/FrmMServiceEntry",
        component: <FrmMServiceEntry />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        type: "Masters",
        name: "Employee Type",
        route: "/Masters/MEmployeeType/MEmployeeTypeListing",
        component: <MEmployeeTypeListing />,
        header: true,
        footer: true,
        protected: false
    },
    // {
    //     type: "Masters",
    //     name: "Production Section",
    //     route: "/Masters/MProductionSection/FrmProductionSectionListing",
    //     component: <FrmProductionSectionListing />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    // {
    //     route: "/Masters/MProductionSection/FrmProductionSectionEntry",
    //     component: <FrmProductionSectionEntry />,
    //     header: true,
    //     footer: true,
    //     protected: false
    // },
    

    // Job Type Master
    {
        type: "Masters",
        name: "Job Type",
        key: "Job Type",
        route: "/Masters/MJobType/FrmJobTypeListing",
        component: <FrmJobTypeListing />,
        noCollapse: true,
    },
    {
        name: "Job Type",
        route: "/Masters/MJobType/FrmJobTypeEntry",
        component: <FrmJobTypeEntry />,
    },

    //Leaves master
    {
        type: "Masters",
        name: "Leaves",
        key: "Leaves",
        route: "/Masters/MLeaves/FrmLeavesEntry",
        component: <FrmLeavesEntry />,
    },

    // //DailyAttendance process master
    // {
    //     type: "Masters",
    //     name: "DailyAttendance Process",
    //     key: "DailyAttendance Process",
    //     route: "/Masters/MDailyAttendanceProcess/FrmDailyAttendanceEntry",
    //     component: <FrmDailyAttendanceEntry />,
    //     noCollapse: true,
    // },
    // Leves Application
    {
        type: "masters",
        name: "Leaves Application",
        key: "Leaves Application",
        route: "/Masters/MLeavesApplication/FrmLeavesApplicationListing",
        component: <FrmLeavesApplicationListing />,
        noCollapse: true,
    },
    {
        name: "Leaves Application",
        route: "/Masters/MLeavesApplication/FrmLeavesApplicationEntry",
        component: <FrmLeavesApplicationEntry />,
    },



    // Attendance Device Master
    {
        type: "masters",
        name: "Attendance Device",
        key: "Attendance Device",
        route: "/Masters/MAttendanceDevice/FrmAttendanceDeviceListing",
        component: <FrmAttendanceDeviceListing />,
        noCollapse: true,
    },
    {
        name: "Attendance Device",
        route: "/Masters/MAttendanceDevice/FrmAttendanceDeviceEntry",
        component: <FrmAttendanceDeviceEntry />,
    },

    // Leave Type Master
    {
        type: "masters",
        name: "Leave Type",
        key: "Leave Type",
        route: "/Masters/MLeaveType/FrmLeaveTypeListing",
        component: <FrmLeaveTypeListing />,
        noCollapse: true,
    },
    {
        name: "Leave Type",
        route: "/Masters/MLeaveType/FrmLeaveTypeEntry",
        component: <FrmLeaveTypeEntry />,
    },

    // Bank List Master
    {
        type: "Masters",
        name: "Bank List",
        route: "/Masters/MBankList/FrmBankListListing",
        component: <FrmBankListListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        name: "Bank List",
        route: "/Masters/MBankList/FrmBankListEntry",
        component: <FrmBankListEntry />,
    },

    {
        type: "Masters",
        name: "Professional Taxation",
        route: "/Masters/MProfessionalTaxation/FrmProfessionalTaxationEntry",
        component: <FrmProfessionalTaxationEntry />,
        header: true,
        footer: true,
        protected: false
    },


    // Codification Master
    {
        type: "Masters",
        name: "Codification",
        route: "/Masters/MCodification/MCodificationList",
        component: <MCodificationListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        name: "Production",
        route: "/Masters/MCodification/FrmMCodificationEntry",
        component: <FrmMCodificationEntry />,
    },

    // Product Register 
    {
        type: "Masters",
        name: "Production Register",
        key: "Production Register",
        route: "Masters/ProductionRegister",
        component: <ProductionRegister />,
        header: true,
        footer: true,
        protected: false
    },


    // For Service Activity Master
    {
        type: "Masters",
        name: "Service Activity",
        route: "/Masters/ServiceActivityListing",
        component: <FrmMServiceActivityListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "/Masters/ServiceActivity",
        component: <FrmMServiceActivityEntry />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        route: "/Masters/MProductionLot/MFrmProductionLotEntry",
        component: <MFrmProductionLotEntry />,
        header: true,
        footer: true,
        protected: false
    },
    //  production lot
    {
        type: "Production",
        name: "Production Lot",
        route: "/Masters/MProductionLot/MFrmProductionLotListing",
        component: <MFrmProductionLotListing />,
        header: true,
        footer: true,
        protected: false
    },

    {
        type: "Masters",
        name: "Rate",
        route: "/Masters/MRate/FrmRateEntry",
        component: <FrmRateEntry />,
        header: true,
        footer: true,
        protected: false
    },

    
    

    // -----------------------------------------Registers-----------------------------------------------------------

    {
        type: "registers",
        name: "Companies Register",
        key: "Registers",

        route: "/Masters/CompanyListing/reg",
        component: <FrmMCompanyList compType='Register' />,
        noCollapse: true,
    },

    // {
    //     type: "registers",
    //     name: "Customers Register",
    //     key: "Customers",

    //     route: "/Masters/CustomerListing/reg",
    //     component: <FrmMCustomerList compType='Register' />,
    //     noCollapse: true,
    // },


    // bank 
    {
        type: "registers",
        name: "Bank Register",
        key: "Bank",
        route: "/Masters/BankListing/reg",
        component: <FrmMBankList compType='Register' />,
        noCollapse: true,
    },

    // Transporter
    {
        type: "registers",
        name: "Transporter Register",
        key: "Transporter",

        route: "/Masters/TransporterListing/reg",
        component: <FrmMTransporterList compType='Register' />,
        noCollapse: true,
    },
    //comman Paramitar Master
    {
        type: "registers",
        name: "Common Parameter Register",
        key: "CommonParameter",

        route: "/Masters/MCommonParameter/CommonParamterListing/reg",
        component: <CommonParamterListing compType='Register' />,
        noCollapse: true,
    },



    // Contractor
    {
        type: "registers",
        name: "Contractors Register",
        key: "Contractors",

        route: "/Masters/ContractorListing/reg",
        component: <FrmMContractorList compType='Register' />,
        noCollapse: true,
    },

    //department
    {
        type: "registers",
        name: "Department Register",
        key: "Department",

        route: "/Masters/DepartmentListing/reg",
        component: <FrmMDepartmentList compType='Register' />,
        noCollapse: true,
    },
    // Designation 
    {
        type: "registers",
        name: "Designation Register",
        key: "Designation",

        route: "/Masters/DesignationListing/reg",
        component: <FrmMDesignationList compType='Register' />,
        noCollapse: true,
    },

    // City 
    {
        type: "registers",
        name: "City Register",
        key: "City",

        route: "/Masters/CityListing/reg",
        component: <FrmCityList compType='Register' />,
        noCollapse: true,
    },

    // Supplier Masters
    // {
    //     type: "registers",
    //     name: "Supplier Register",
    //     key: "Supplier",

    //     route: "/Masters/SupplierListing/reg",
    //     component: <FrmSpplierList compType='Register' />,
    //     noCollapse: true,
    // },

    // Destination
    {
        type: "registers",
        name: "Destination Register",
        key: "Destination",

        route: "/Masters/DestinationListing/reg",
        component: <FrmMDestinationList compType='Register' />,
        noCollapse: true,
    },


    // Agent 

    {
        type: "registers",
        name: "Agent Register",
        key: "Agent",

        route: "/Masters/AgentListing/reg",
        component: <FrmAgentList compType='Register' />,
        noCollapse: true,
    },


    // Taxation
    {
        type: "registers",
        name: "Taxation Register",
        key: "Taxation",

        route: "/Masters/TaxationListing/reg",
        component: <FrmMTaxationList compType='Register' />,
        noCollapse: true,
    },

    // Taxtype 
    {
        type: "registers",
        name: "Taxtype Register",
        key: "Taxtype",

        route: "/Masters/TaxtypeListing/reg",
        component: <FrmMTaxtypeList compType='Register' />,
        noCollapse: true,
    },
    // HSN-SAC
    {
        type: "registers",
        name: "HSN-SAC Register",
        key: "HSN-SAC",

        route: "/Masters/HSNSACListing/reg",
        component: <FrmMHSNSACList compType='Register' />,
        noCollapse: true,
    },

    //Employees 

    {
        type: "registers",
        name: "Employees Register",
        key: "Employees",

        route: "/Masters/EmployeesListing/reg",
        component: <FrmMEmployeeList compType='Register' />,
        noCollapse: true,
    },
   

    // Property
    {
        type: "registers",
        name: "Property Register",
        key: "PropertyMaster",

        route: "/Masters/FrmPropertyListing/reg",
        component: <FrmPropertyListing compType='Register' />,
        noCollapse: true,
    },

    //Shift 
    {
        type: "registers",
        name: "Shift Register",
        key: "Shift",

        route: "/Masters/FrmShiftListing/reg",
        component: <FrmShiftListing compType='Register' />,
        noCollapse: true,
    },

    //profit center
    {
        type: "registers",
        name: "Profit Center Register",
        key: "ProfitCenter",

        route: "/Masters/ProfitCenterListing/reg",
        component: <ProfitCenterListing compType='Register' />,
        noCollapse: true,
    },

    //ScheduleLedger
    {
        type: "registers",
        name: "Schedule Ledger Register",
        key: "ScheduleLedgerMaster",

        route: "/Masters/MFMScheduleLedgerListing/reg",
        component: <MFMScheduleLedgerListing compType='Register' />,
        noCollapse: true,
    },

    //General ScheduleLedger
    {
        type: "registers",
        name: "General Ledger Register",
        key: "GeneralLedgerMaster",

        route: "/Masters/MFMGeneralLedgerListing/reg",
        component: <MFMGeneralLedgerListing compType='Register' />,
        noCollapse: true,
    },
    //module form
    // {
    //   type: "registers",
    //   name: "Module Form Register",
    //   key: "ModuleForm",
    //   
    //   route: "/Masters/ModuleFormListing/reg",
    //   component: <ModuleFormListing compType='Register'/>,
    //   noCollapse: true,
    // },

    //service 
    {
        type: "registers",
        name: "Service Register",
        key: "Service",

        route: "/Masters/FrmMServiceListing/reg",
        component: <FrmMServiceListing compType='Register' />,
        noCollapse: true,
    },

    //PaymentTerms
    {
        type: "registers",
        name: "Payment Terms Register",
        key: "PaymentTerms",

        route: "/Masters/FrmPaymentTermsListing/reg",
        component: <FrmPaymentTemrsListing compType='Register' />,
        noCollapse: true,
    },

    //MPaymentSchedule
    {
        type: "registers",
        name: "Payment Schedule Register",
        key: "PaymentSchedule",

        route: "/Masters/FrmPaymentScheduleListing/reg",
        component: <FrmPaymentScheduleListing compType='Register' />,
        noCollapse: true,
    },

    //Plant
    {
        type: "registers",
        name: "Plant Register",
        key: "Plant Master",

        route: "/Masters/FrmPlantlist/reg",
        component: <FrmPlantlist compType='Register' />,
        noCollapse: true,
    },

    //bank Listing 
    {
        type: "registers",
        name: "Bank Listing  Register",
        key: "Bank Listing ",

        route: "/Masters/MBankList/FrmBankListListing/reg",
        component: <FrmBankListListing compType='Register' />,
        noCollapse: true,
    },
    // Job Type Master
    {
        type: "registers",
        name: "Job Type Register",
        key: "Job Type",

        route: "/Masters/MJobType/FrmJobTypeListing/reg",
        component: <FrmJobTypeListing compType='Register' />,
        noCollapse: true,
    },
    //Templates Communications Master
    {
        type: "registers",
        name: "Templates Communications Register",
        key: "Templates Communications",

        route: "/Masters/MCommunicationsMaster/FrmCommunicationsMasterList/reg",
        component: <FrmCommunicationsMasterList compType='Register' />,
        noCollapse: true,
    },

    // hm_earning_heads 
    {
        type: "registers",
        name: "Earning Heads Register",
        key: "Earning Heads",
        route: "/Masters/MHMEarningHeads/MHMEarningHeadsListing/reg",
        component: <FrmMHMEarningHeadsListing compType='Register' />,
        noCollapse: true,
    },

    //Production Holiday 
    {
        type: "registers",
        name: "Production Holiday Register",
        key: "Production Holiday",

        route: "/Masters/MHoliday/FrmHolidayListing/reg",
        component: <FrmHolidayListing compType='Register' />,
        noCollapse: true,
    },

    // hm_Deduction_heads
    {
        type: "registers",
        name: "Deduction Heads Register",
        key: "Deduction Heads ",

        route: "/Masters/MHMDeductionHeads/FrmMHMDeductionHeadsListing/reg",
        component: <FrmMHMDeductionHeadsListing compType='Register' />,
        noCollapse: true,
    },

    //Production Electrical Meter Entry 
    {
        type: "registers",
        name: "Production Electrical Meter Register",
        key: "Production Electrical Meter",

        route: "/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing/reg",
        component: <MFrmProductionElectricalMeterListing compType='Register' />,
        noCollapse: true,
    },

    //Maintance task activity
    {
        type: "registers",
        name: "Maintenance Task Activity Register",
        key: "Maintenance Task Activity",

        route: "/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing/reg",
        component: <MmaintenanceTaskActivityListing compType='Register' />,
        noCollapse: true,
    },

    //Maintance master and details
    {
        type: "registers",
        name: "Maintenance Task Master Register",
        key: "Maintenance Task Master",

        route: "/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing/reg",
        component: <FrmMaintenanceTaskMasterListing compType='Register' />,
        noCollapse: true,
    },

    

    //  Below registers by shivanjali
    {
        type: "registers",
        name: "Schedules Register",
        route: "/Masters/MFMScheduleLedgerListing/reg",
        component: <MFMScheduleLedgerListing compType='Register' />,
        noCollapse: true,
    },

    {
        type: "registers",
        name: "Generals Register",
        route: "/Masters/MFMGeneralLedgerListing/reg",
        component: <MFMGeneralLedgerListing compType='Register' />,
        noCollapse: true,
    },
    {
        type: "registers",
        name: "Modules Register",
        route: "/Masters/ModuleFormListing/reg",
        component: <ModuleFormListing compType='Register' />,
        noCollapse: true,
    },
    //Production Holiday 
    {
        type: "registers",
        name: "Production Holiday Register",
        key: "Production Holiday",
        route: "/Masters/MHoliday/FrmHolidayListing/reg",
        component: <FrmHolidayListing compType='Register' />,
        noCollapse: true,
    },

    // Attendance Device Master
    {
        type: "registers",
        name: "Attendance Device Register",
        key: "Attendance Device",
        route: "/Masters/MAttendanceDevice/FrmAttendanceDeviceListing/reg",
        component: <FrmAttendanceDeviceListing compType='Register' />,
        noCollapse: true,
    },

    {
        type: "registers",
        name: "Departments Register",
        key: "Departments",
        route: "/Masters/DepartmentListing/reg",
        component: <FrmMDepartmentList compType='Register' />,
        noCollapse: true,
    },
   

    {
        type: "registers",
        name: "Codification Register",
        route: "/Masters/MCodification/MCodificationList/reg",
        component: <MCodificationListing compType='Register' />,
        header: true,
        footer: true,
        protected: false
    },
    
    {
        type: "registers",
        name: "Service Activity Register",
        route: "/Masters/ServiceActivityListing/reg",
        component: <FrmMServiceActivityListing compType='Register' />,
        header: true,
        footer: true,
        protected: false
    },


    {
        type: "Masters",
        name: "Cost Centers",
        route: "/Masters/MCostCenterHeads/FrmCostCenterHeadsListing",
        component: <FrmCostCenterHeadsListing />,
        header: true,
        footer: true,
        protected: false
    },


    {
        route: "/Masters/MCostCenterHeads/FrmCostCenterHeadsEntry",
        component: <FrmCostCenterHeadsEntry />,
        header: true,
        footer: true,
        protected: false
    },
   

    //Job Assign
    {
        type: "Masters",
        name: "Job Assign Master",
        route: "Masters/MJobAssign/FrmJobAssignListing",
        component: <FrmJobAssignListing />,
        header: true,
        footer: true,
        protected: false
    },
    {
        route: "Masters/MJobAssign/FrmJobAssignEntry",
        component: <FrmJobAssignEntry />,
        header: true,
        footer: true,
        protected: false

    },

    {
        type: "Masters",
        name: "Password Reset",
        route: "/Masters/MUserPasswordChange",
        component: <MUserPasswordChange />,
        header: true,
        footer: true,
        protected: false
    },

    // contractor Commission Master
    {
        type: "Masters",
        name: "Contractor Commission",
        key: "Contractor Commission",
        route: "/Masters/MContractorCommission/FrmContractorCommissionList",
        component: <FrmContractorCommissionList />,
        noCollapse: true,
    },
    {
        name: "Contractor Commission",
        route: "/Masters/MContractorCommission/FrmContractorCommissionEntry",
        component: <FrmContractorCommissionEntry />,
    },



    
    // Help Forms
    {
        route: "/FrmGeneric/Help/helpCenter",
        component: <HelpCenter />,
        header: true,
        footer: true,
        protected: false,
    },
    {
        route: "/NetworkCheck",
        component: <Netcheck />,
        header: false,
        footer: false,
        protected: true
    },

];

export default routes;