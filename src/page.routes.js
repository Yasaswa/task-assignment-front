// @mui material components
import Icon from "@mui/material/Icon";
const pageRoutes =
  [
    {
      columns: 6,
      name: "Masters",
      rowsPerColumn: 1,
      collapse: [
        {
          name: "Common Masters",
          collapse: [
            {
              route: "/Masters/CompanyListing",
              name: "Company"
            },
            {
              route: "/Masters/MFinancialYear/FrmFinancialYearListing",
              name: "Financial Year"
            },
            {
              route: "/Masters/BankListing",
              name: "Banks"
            },
            {
              route: "/Masters/Department",
              name: "Departments"
            },
            {
              route: "/Masters/MDesignation/FrmMDesingnationList",
              name: "Designations"
            },
            {
              route: "/Masters/EmployeesListing",
              name: "Employees"
            },
            {
              route: "/Masters/CustomerListing",
              name: "Customers"
            },
            {
              route: "/Masters/SupplierListing",
              name: "Suppliers"
            },
            {
              route: "/Masters/AgentListing",
              name: "Agents"
            },
            {
              route: "/Masters/ContractorListing",
              name: "Contractors"
            },
            {
              route: "/Masters/TransporterListing",
              name: "Transporter"
            },
            {
              route: "/Masters/CityListing",
              name: "City"
            },
            {
              route: "/Masters/DestinationListing",
              name: "Destinations"
            },
            {
              route: "/Masters/GodownListing",
              name: "Godown"
            },
            {
              route: "/Masters/HSNSACListing",
              name: "HSN-SAC Codes"
            },
            {
              route: "/Masters/FrmPaymentScheduleListing",
              name: "Payment Schedules"
            },
            {
              route: "FrmPaymentTemrsListing",
              name: "Payments Terms"
            },
            {
              route: "/Masters/TaxtypeListing",
              name: "Tax Types"
            },
            {
              route: "/Masters/TaxationListing",
              name: "Taxations"
            },
            {
              route: "Masters/MShift/FrmShiftListing",
              name: "Shifts"
            },
            {
              route: "/Masters/MHoliday/FrmHolidayListing",
              name: "Holidays"
            },
            {
              route: "/Masters/Material/FrmMaterialList",
              name: "Materials"
            },
            {
              route: "Masters/MProductUnitConversion/FrmproductUnitConversionListing",
              name: "Product Unit Conversions"
            },
            {
              route: "Masters/MService/FrmMServiceListing",
              name: "Product- Services"
            },
            {
              route: "Masters/MProductCategory1/FrmProductCategory1Listing",
              name: "Product Category 1"
            },
            {
              route: "Masters/MProductCategory2/FrmMProductCategory2Listing",
              name: "Product Category 2"
            },
            {
              route: "Masters/MProductUnit/FrmProductUnitListing",
              name: "Product Unit"
            },
            {
              route: "Masters/MProductUnitConversion/FrmproductUnitConversionListing",
              name: "Product Unit Conversions"
            },
            {
              route: "Masters/MProductPacking/FrmMProductPackingListing",
              name: "Product Packing"
            },
            {
              route: "Masters/MProductMake/FrmMProductMakeListing",
              name: "Product Makes"
            },
            {
              route: "Masters/MProductMaterialGrade/FrmMProductMaterialGradeListing",
              name: "Product Grades"
            },
            {
              route: "/Masters/MEmployeeType/MEmployeeTypeListing",
              name: "Employee Type"
            },
            {
              route: "/Masters/MCodification/MCodificationList",
              name: "Codification"
            }
          ]
        },
        {
          name: "Administration Masters",
          collapse: [
            {
              route: "/Masters/CompanyListing",
              name: "Company Settings"
            },
            {
              route: "/Masters/FrmPropertyListing",
              name: "Properties"
            },
            {
              route: "/Masters/MCommunicationsMaster/FrmCommunicationsMasterList",
              name: "Communication Templates"
            },
            {
              route: "/Masters/MCommonParameter/CommonParamterListing",
              name: "Common Parameters"
            },
            {
              route: "/Masters/ModuleFormListing",
              name: "Modules"
            },
            {
              route: "",
              name: "Menues"
            },
            {
              route: "",
              name: "Sub Menues"
            }
          ]
        },
        {
          name: "Finance Masters",
          collapse: [
            {
              route: "/Masters/MFinancialYear/FrmFinancialYearListing",
              name: "Financial Year"
            },
            {
              route: "/Masters/MCostCenterListing",
              name: "Cost Centers"
            },
            {
              route: "/Masters/ProfitCenterListing",
              name: "Profit Centers"
            },
            {
              route: "/Masters/HSNSACListing",
              name: "HSN-SAC Codes"
            },
            {
              route: "/Masters/FrmPaymentScheduleListing",
              name: "Payment Schedules"
            },
            {
              route: "/Masters/FrmPaymentTermsListing",
              name: "Payments Terms"
            },
            {
              route: "/Masters/TaxtypeListing",
              name: "Tax Types"
            },
            {
              route: "/Masters/TaxationListing",
              name: "Taxations"
            },
            {
              route: "",
              name: "Currency"
            },
            {
              route: "/Masters/MFMScheduleLedgerListing",
              name: "Schedules"
            },
            {
              route: "/Masters/MFMGeneralLedgerListing",
              name: "Generals"
            },
            {
              route: "",
              name: "SL-GL Mapping"
            },
            {
              route: "",
              name: "SL Opening Balances"
            },
            {
              route: "",
              name: "GL Opening Balances"
            }
            ,
            {
              route: "",
              name: "GL Opening Balances"
            },
            {
              route: "/Masters/MProfessionalTaxation/FrmProfessionalTaxationEntry",
              name: "Professional Taxation"
            }
          ]
        },
        {
          name: "Production Masters",
          collapse: [
            {
              route: "/Masters/FrmPlantlist",
              name: "Plants"
            },
            {
              route: "/Masters/FrmMachineListing",
              name: "Machines"
            },
            {
              route: "/Masters/FrmShiftListing",
              name: "Shifts"
            },
            {
              route: "/Masters/MHoliday/FrmHolidayListing",
              name: "Production Holidays"
            },
            {
              route: "/Masters/MProductionProcess/MFrmProductionProcessListing",
              name: "Production Process"
            },
            {
              route: "/Masters/MXMProductionSpinningPlanParameter/FrmMProductionSpinningPlanParameterListing",
              name: "Spinning Plan"
            },
            {
              route: "/Masters/MProductionStoppageReasons/MFrmProductionStoppageReasonsListing",
              name: "Production Stopage Reasons"
            },
            {
              route: "/Masters/MProductionWastageType/MFrmProductionWastageTypesListing",
              name: "Production Wastage Types"
            },
            {
              route: "/Masters/MCount/FrmCountListing",
              name: "Spinning Counts"
            },
            {
              route: "/Masters/MmaintenanceTaskMaster/FrmMaintenanceTaskMasterListing",
              name: "Maintainance Tasks Master"
            },
            {
              route: "/Masters/MmaintenanceTaskActivity/MmaintenanceTaskActivityListing",
              name: "Maintainance Tasks Activity"
            },
            {
              route: "/Masters/MProductionElectricalMeter/MFrmProductionElectricalMeterListing",
              name: "Electrical Meters"
            },
            {
              route: "/Masters/MProductionSection/FrmProductionSectionListing",
              name: "Production Section"
            },
            {
              route: "/Masters/MProductionSubSection/FrmProductionSubSectionListing",
              name: "Production Sub Section"
            },
            {
              route: "/Masters/MProductionSpinPlan/MProductionSpinPlanListing",
              name: "Spin Plan"
            },

            {
              route: "/Masters/MWeavingproductionPlan",
              name: "Weaving Production plan"
            }
          ]
        },
        {
          name: "HR Payroll Masters",
          collapse: [
            {
              route: "/Masters/DepartmentListing",
              name: "Departments"
            },
            {
              route: "/Masters/DesignationListing",
              name: "Designations"
            },
            {
              route: "",
              name: "Weekly Offs"
            },
            {
              route: "/Masters/MHoliday/FrmHolidayListing",
              name: "Holidays"
            },
            {
              route: "/Masters/EmployeesListing",
              name: "Employees"
            },
            {
              route: "/Masters/FrmShiftListing",
              name: "Shifts"
            },
            {
              route: "/Masters/MHMEarningHeads/MHMEarningHeadsListing",
              name: "Earning Heads"
            },
            {
              route: "",
              name: "Earning Formullations"
            },
            {
              route: "/Masters/MHMDeductionHeads/FrmMHMDeductionHeadsListing",
              name: "Deductions Heads"
            },
            {
              route: "",
              name: "Deduction Formullations"
            },
            {
              route: "/Masters/CityListing",
              name: "City"
            },
            {
              route: "",
              name: "District"
            },
            {
              route: "",
              name: "State"
            },
            {
              route: "",
              name: "Country"
            },
            {
              route: "/Masters/DesignationListing",
              name: "Destinations"
            }
          ]
        },
        {
          name: "Products Masters",
          collapse: [
            {
              route: "/Masters/ProductTypeListing",
              name: "Product Type"
            },
            {
              route: "/Masters/MaterialListing",
              name: "Product-Raw Materials"
            },
            {
              route: "/Masters/FinishGoodsListing",
              name: "Product- Finish Goods"
            },
            {
              route: "/Masters/FrmMServiceListing",
              name: "Product- Services"
            },
            {
              route: "/Masters/ProductCategory1Listing",
              name: "Product Category 1"
            },
            {
              route: "/Masters/ProductCategory2Listing",
              name: "Product Category 2"
            },
            {
              route: "/Masters/ProductCategory3Listing",
              name: "Product Category 3"
            },
            {
              route: "/Masters/ProductCategory4Listing",
              name: "Product Category 4"
            },
            {
              route: "/Masters/ProductCategory5Listing",
              name: "Product Category 5"
            },
            {
              route: "/Masters/FrmProductUnitListing",
              name: "Product Unit"
            },
            {
              route: "/Masters/FrmproductUnitConversionListing",
              name: "Product Unit Conversions"
            },
            {
              route: "/Masters/ProductPackingListing",
              name: "Product Packing"
            },
            {
              route: "/Masters/ProductMakeListing",
              name: "Product Makes"
            },
            {
              route: "/Masters/ProductMaterialGradeListing",
              name: "Product Grades"
            },
            {
              route: "/Masters/FrmMProductProcessListing",
              name: "Product Process"
            },
            {
              route: "/Masters/ProductQaParametersListing",
              name: "Product QA Parameters"
            },
            {
              route: "/Masters/ProductRejectionParametersListing",
              name: "Product Rejection Parameters"
            },
            {
              route: "/Masters/ProductMaterialMeasureParametersListing",
              name: "Product Measure Parameters"
            },
            {
              route: "/Masters/ProductMaterialMeasureShapeListing",
              name: "Product Shape"
            },
            {
              route: "/Masters/MManualAttendance/FrmManualAttendanceEntry",
              name: "Manual Attendance"
            }
          ]
        }
      ]
    },
    {
      name: "Purchase",
      collapse: [
        {
          route: "/Transactions/TPurchaseOrder/Indent/IndentListing",
          name: "Purchase Requisition"
        },
        {
          route: "/Transactions/TPurchaseOrder/PurchaseRequisition/FrmPurchaseRequisitionListing",
          name: "PurchaPurchase Requisition (BOM)"
        },
        {
          route: "/Transactions/TPurchaseOrder/ManualPO/POListing",
          name: "Purchase Order (Trading)"
        },
        {
          route: "/Transactions/TPurchaseOrder/GoodsReceiptNote/GoodsReceiptNoteListing",
          name: "Goods Receipt Notes"
        },
        {
          route: "/Transactions/TCustomerReciept/FrmTCustomerRecieptEntry",
          name: "Customer Material Reciept"
        },
        {
          route: "/Transactions/TPurchaseOrder/TBillBook/BillBookListing",
          name: "Purchase Bill Book(Auto)"
        },
        {
          route: "/Transactions/TPurchaseOrder/TManualBillBook/FrmManualBillBookListing",
          name: "Purchase Bill Book(Manual)"
        },
        {
          route: "/Transactions/TPurchaseOrder/TPurchasePaymentSupplier/FrmPurchasePaymentSupplierListing",
          name: "Purchase Payment Supplier"
        },
        {
          route: "/Transactions/TIndentMaterialIssue/FrmIndentMaterialIssueListing",
          name: "Indent Material Issue"
        },
        {
          route: "/Transactions/TCustomerMaterialIssue/TCustomerMaterialIssueListing",
          name: "Customer Material Issue"
        },
        {
          route: "/Transactions/TCustomerMaterialReturn/TCustomerMaterialReturnListing",
          name: "Customer Material Return"
        }
      ]
    },
    {
      name: "Sales",
      collapse: [
        {
          route: "/Transactions/TEnquiryManagement/FrmEnquiryListing",
          name: "Enquiry Management (Trading)"
        },
        {
          route: "/Transactions/TEnquiryServiceManagement/FrmEnquiryServiceListing",
          name: "Enquiry Management (Service)"
        },
        {
          route: "/Transactions/TEnquiryProjectsManagement/FrmEnquiryProjectListing",
          name: "Enquiry Management (Project)"
        },
        {
          route: "/Transactions/TQuotation/FrmQuotationListing",
          name: "Quotation (Trading)"
        },
        {
          route: "/Transactions/TQuotationService/FrmQuotationServiceListing",
          name: "Quotation (Service)"
        },
        {
          route: "/Transactions/TQuotationProjects/FrmQuotationProjectListing",
          name: "Quotation (Projects)"
        },
        {
          route: "/Transactions/TSalesOrder/SalesOrderListing",
          name: "Sales Order (Trading)"
        },
        {
          route: "/Transactions/TSalesOrder/Services/SOServiceListing",
          name: "Sales Order (Services)"
        },
        {
          route: "/Transactions/TSalesOrder/Projects/SalesOrderProjectsListing",
          name: "Sales Order (Projects)"
        },
        {
          route: "/Transactions/TWorkOrder/Trading/WorkOrderListing",
          name: "Work Order (Trading)"
        },
        {
          route: "/Transactions/TDispatchNote/TDispatchNoteListing",
          name: "Dispatch Note (Trading)"
        },
        {
          route: "/Transactions/TDispatchNoteProjects/FrmDispatchNoteProjectsListing",
          name: "Dispatch Note (Projects)"
        },
        {
          route: "/Transactions/TDispatchChallan/TDispatchChallanListing",
          name: "Dispatch Challan (Trading)"
        },
        {
          route: "/Transactions/TDispatchChallan/FrmDispatchChallanProjectsListing",
          name: "Dispatch Challan (Projects)"
        },
        {
          route: "/Transactions/TDispatchChallan/TDispatchChallanWorkOrderListing",
          name: "Dispatch Challan (Work Order)"
        },
        {
          route: "/Transactions/SalesInvoiceListing",
          name: "Sales Invoice (Trading)"
        },
        {
          route: "/Transactions/SalesInvoiceProjectsListing",
          name: "Sales Invoice (Projects)"
        },
        {
          route: "/Transactions/SalesInvoiceJobWorkListing",
          name: "Sales Invoice (Job Work)"
        },
        {
          route: "/Transactions/SalesInvoiceServicesListing",
          name: "Sales Invoice (Services)"
        },
        {
          route: "/Transactions/TPurchaseOrder/TPurchasePaymentCustomer/FrmCustomerSalesReceiptListing",
          name: "Customer Sales Receipt"
        }
      ]
    }
  ];

export default pageRoutes;