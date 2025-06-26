import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import $ from "jquery";

// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Card from "react-bootstrap/Card";
import Datatable from "components/DataTable";
import ConfigConstants from "assets/Constants/config-constant";

// File Imports
import Form from "react-bootstrap/Form";
// React icons
import { AiFillEye, AiOutlineDownCircle } from "react-icons/ai";
import { TbArrowsRight } from "react-icons/tb";
import { TbArrowsLeft } from "react-icons/tb";
import { TbArrowsDown } from "react-icons/tb";
import { TbArrowsUp } from "react-icons/tb";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { HiOutlineArrowNarrowUp } from "react-icons/hi";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";

//File Imports
import ComboBox from "Features/ComboBox";

//Export Related imports
import PdfExport from "Features/Exports/PdfExport";
import ExcelExport from "Features/Exports/ExcelExport";
import JsonExport from "Features/Exports/JsonExport";
import CSVExport from "Features/Exports/CSVExport";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import { resetGlobalQuery } from "assets/Constants/config-constant";
import { globalQuery } from "assets/Constants/config-constant";
import { FiDownload, FiX, FiFileText } from "react-icons/fi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import DeleteModal from "components/Modals/DeleteModal";
import { CircularProgress } from "@material-ui/core";
import Tooltip from "@mui/material/Tooltip";
import { FaTimes } from "react-icons/fa";
import { RiSearchLine } from "react-icons/ri";
import { BsFillCheckCircleFill } from "react-icons/bs";

import MEmployeePrint from "Masters/MEmployee/MEmployeePrint";
import MEmployeeWorkerPrint from "Masters/MEmployee/MEmployeeWorkerPrint";
import MEmployeeOfferLetter from "../MEmployeeOfferLetter";
import MRelievingLetter from "../FrmMRelievingLetter";
import MExperienceLetter from "../FrmMExperienceLetter";
import MEmployeeAppointmentLetter from "Masters/MEmployee/MEmployeeAppointmentLetter";
import { Button, Modal } from "react-bootstrap";
import { FiPrinter } from "react-icons/fi";
import { MdPrint, MdOutlineDescription, MdWorkOff } from "react-icons/md";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { useMemo } from "react";

export default function FrmMEmployeeList({ compType = "Masters" }) {
  const configConstants = ConfigConstants();
  const { COMPANY_ID, UserName, COMPANY_NAME, USER_ACCESS } = configConstants;

  const [employeesId, setEmployeesId] = useState();
  var storeSelectedValues = [];

  const borderedSectionStyle = {
    border: "1px solid black",
    marginBottom: "-1px", // To ensure no gap between sections
    pageBreakAfter: "always", // Force a page break after each section
  };

  const [showModal, setShowModal] = useState(false);
  const [showOfferLetter, setShowOfferLetter] = useState(false);
  const [showRelievingLetter, setShowRelievingLetter] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const[showExperienceLetter, setShowExperienceLetter] = useState(false);

  // const handleShow = () => setShowModal(true);
  // const handleCloses = () => setShowModal(false);
  // Table Data
  const [data, setEmployeesData] = useState([]);
  const [columns, setColumns] = useState([]);
  var columnHeads;
  var rptColumnHeads;
  // Pagination Variables
  const pageEntriesOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "500", value: 500 },
    { label: "All", value: 0 },
  ];
  var [entriesPerPage, setEntriesPerPage] = useState(
    pageEntriesOptions[2].value
  );
  const [pageCount, setpageCount] = useState(0);
  const [PageCurrent, setcurrentPage] = useState(0);
  // Filter Fields
  const [filterComboBox, setFilterComboBox] = useState([]);
  const [recordData, setRecordData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [reportType, setReportType] = useState("summary");
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [groupByColumns, setGroupByColumns] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [searchState, setGlobalFilterSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //field for print
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const showRef = useRef(null);
  const promiseResolveRef = useRef(null);

  const [currentLanguage, setCurrentLanguage] = useState("hindi");

  // Employee type
  const [employeeTypes, setEmployeeTypes] = useState([]);

  const handleLanguageChange = (event) => {
    setCurrentLanguage(event.target.value);
  };

  const validateNumberDateInput = useRef();
  var dataExport = [];
  var columnExport = [];
  const pdfExp = useRef();
  const exlsExp = useRef();
  const jsonExp = useRef();
  const csvExp = useRef();
  const pdfExpFilters = {};

  var reportName = "Employees Report";

  var operatorLabels = {
    "=": "is",
    "!=": "is not",
    1: "active",
    0: "closed",
    o: "open",
    "!*": "none",
    "*": "any",
    "~": "contains",
    "!~": "doesn't contain",
    "^": "starts with",
    $: "ends with",
    "<=": "less than or equal",
    ">=": "greater than or equal",
    "<>=": "BETWEEN",
  };
  var operatorByType = {
    list: ["=", "!="],
    status: ["1", "0"],
    list_status: ["o", "=", "!", "c", "*"],
    list_optional: ["=", "!", "!*", "*"],
    list_subprojects: ["*", "!*", "=", "!"],
    string: ["~", "=", "!~", "!=", "^", "$"],
    text: ["~", "!~", "^", "$", "!*", "*"],
    integer: ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"],
    float: ["=", "\u003e=", "\u003c=", "\u003e\u003c", "!*", "*"],
    relation: ["=", "!", "=p", "=!p", "!p", "*o", "!o", "!*", "*"],
    tree: ["=", "~", "!*", "*"],
    date: ["=", "<=", ">=", "<>="],
  };
  // Popup Fields
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const comboBox = useRef();
  const navigate = useNavigate();
  const handlePageClick = async (pageNo) => {
    let currentPage = pageNo.selected;
    setcurrentPage(currentPage);
    const commentsFormServer = await fetchFilteredData(
      currentPage,
      entriesPerPage,
      selectedColumns.length !== 0 ? selectedColumns : availableColumns
    );
    console.log("commentsFormServer: ", commentsFormServer);
  };

  const handlePageCountClick = async () => {
    let count = document.getElementById("page_entries_id").value;
    setEntriesPerPage(count);
    setcurrentPage(0);
    await fetchFilteredData(
      0,
      count,
      selectedColumns.length !== 0 ? selectedColumns : availableColumns
    );
  };

  useEffect(async () => {
    $(".hide-show-filters").hide();

    const employeetypeList = await comboBox.current.fillComboBox(
      "EmployeeTypeGroup"
    );
    setEmployeeTypes(employeetypeList);
    // employeeTypeRef.current.value = 'Staffs';

    const availCols = await FnShowEmployeesRptRecords(reportType);
    await fetchFilteredData(PageCurrent, entriesPerPage, availCols);
  }, [compType]);

  const printInvoice = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        $("#chooseLanguageId").hide();
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
      // buttonsRef.current.focus();
    },
    documentTitle:  "Experience Letter",
  });

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting, currentLanguage]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [selectedEmployeeType, setSelectedEmployeeType] = useState(null);

  const handleShow = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setSelectedEmployeeType(employee_type);
    setShowModal(true);
  };
  const handleShowOfferLetter = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setShowOfferLetter(true);
  };
  const handleShowRelievingLetter = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setShowRelievingLetter(true);
  };

  const handleShowAppointment = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setSelectedEmployeeType(employee_type);
    setShowAppointmentModal(true);
  };

  const handleShowExperienceLetter = (employee_id, employee_type) => {
    setSelectedEmployeeId(employee_id);
    setShowExperienceLetter(true);
  };

  const handleCloses = () => {
    setShowModal(false);
    setShowAppointmentModal(false);
    setShowOfferLetter(false);
    setShowRelievingLetter(false);
    setShowExperienceLetter(false);
    // setSelectedEmployeeId(null);
    // setSelectedEmployeeType(null);
  };

  const fetchFilteredData = async (page, size, availCols) => {
    try {
      if (searchState !== "") {
        setEntriesPerPage(0);
      }
      setIsLoading(true);
      const executeQuery = await submitQuery(availCols);

      const formData = new FormData();
      formData.append(`jsonQuery`, executeQuery);
      const requestOptions = { method: "POST", body: formData };
      const fetchResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/filter/FnMShowFilterRecords/${page}/${size}`,
        requestOptions
      );
      const responce = await fetchResponse.json();
      let nColumn = [];
      if (responce.content.length > 0) {
        // This for pagination
        const access_control = FnCheckUserAccess() || {
          all_access: false,
          read_access: false,
          modify_access: false,
          delete_access: false,
        }; // Setting default access control when USER_ACCESS is undefined
        const total = responce.totalElements;
        setpageCount(parseInt(size) !== 0 ? Math.ceil(total / size) : 1);

        // Get column Name & Accessor
        let colNameAccessor;
        let colNameHeader;

        for (let colKey = 0; colKey < availCols.length; colKey++) {
          colNameAccessor = availCols[colKey].accessor;
          colNameHeader = availCols[colKey].Headers;
          if (colKey === 0) {
            nColumn.push({
              Headers: "Action",
              accessor: "Action",
              width: 118,
              Cell: (row) => (
                <div style={{ display: "flex" }}>
                  <Tooltip title="view" placement="top">
                    <MDTypography className="erp-view-btn">
                      <AiFillEye
                        className={`erp-view-btn ${
                          access_control.all_access ||
                          access_control.read_access
                            ? "display"
                            : "d-none"
                        }`}
                        onClick={() => viewUpdateDelete(row.original, "view")}
                      />
                    </MDTypography>
                  </Tooltip>
                  {compType === "Register" ? null : (
                    <>
                      <Tooltip
                        title={
                          row.original.employee_status === "Permanent" &&
                          row.original.Active === "Active"
                            ? "Employee Approved"
                            : "Approved"
                        }
                        placement="top"
                      >
                        <MDTypography
                          className={`erp-view-btn ${
                            access_control.approve_access ? "display" : "d-none"
                          }`}
                        >
                          <BsFillCheckCircleFill
                            className="erp-view-btn"
                            onClick={(e) => {
                              if (
                                row.original.employee_status !== "Permanent"
                              ) {
                                viewUpdateDelete(row.original, "approve");
                              }
                            }}
                            disabled={
                              row.original.employee_status === "Permanent"
                            }
                          />
                        </MDTypography>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top">
                        <MDTypography className="erp-view-btn">
                          <MdModeEdit
                            className={`erp-edit-btn ${
                              access_control.all_access ||
                              access_control.modify_access
                                ? "display"
                                : "d-none"
                            }`}
                            onClick={(e) =>
                              viewUpdateDelete(row.original, "update")
                            }
                          />
                        </MDTypography>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <MDTypography className="erp-view-btn">
                          <MdDelete
                            className={`erp-delete-btn ${
                              access_control.all_access ||
                              access_control.delete_access
                                ? "display"
                                : "d-none"
                            }`}
                            onClick={() =>
                              viewUpdateDelete(row.original, "delete")
                            }
                          />
                        </MDTypography>
                      </Tooltip>
                      <Tooltip title="Entry Form" placement="top">
                        <MDTypography className="erp-view-btn">
                          {/* <MdPrint className="erp-print-btn" fontWeight="regular" onClick={() => handleShow(row.original.employee_id)} /> */}
                          <MdPrint
                            className="erp-print-btn"
                            fontWeight="regular"
                            onClick={() =>
                              handleShow(
                                row.original.employee_id,
                                row.original.employee_type
                              )
                            }
                          />
                        </MDTypography>
                      </Tooltip>
                      <Tooltip title="Offer Letter" placement="top">
                        <MDTypography className="erp-view-btn">
                          {/* <MdPrint className="erp-print-btn" fontWeight="regular" onClick={() => handleShow(row.original.employee_id)} /> */}
                          <MdOutlineDescription
                            className="erp-print-btn"
                            fontWeight="regular"
                            onClick={() =>
                              handleShowOfferLetter(
                                row.original.employee_id,
                                row.original.employee_type
                              )
                            }
                          />
                        </MDTypography>
                      </Tooltip>
                      <Tooltip title="Experience Letter" placement="top">
                        <MDTypography className="erp-view-btn">
                          <MdWorkOff
                            className="erp-print-btn"
                            fontWeight="regular"
                            onClick={() =>
                              handleShowRelievingLetter(
                                row.original.employee_id,
                                row.original.employee_type
                              )
                            }
                          />
                        </MDTypography>
                      </Tooltip>

                      <Tooltip title="Appointment Letter" placement="top">
                        <MDTypography className="erp-view-btn">
                          {/* <MdPrint className="erp-print-btn" fontWeight="regular" onClick={() => handleShow(row.original.employee_id)} /> */}
                          <FiFileText
                            className="erp-print-btn"
                            fontWeight="regular"
                            onClick={() =>
                              handleShowAppointment(
                                row.original.employee_id,
                                row.original.employee_type
                              )
                            }
                          />
                        </MDTypography>
                      </Tooltip>

                      {/* <Tooltip title="Experience Letter" placement="top">
                        <MDTypography className="erp-view-btn">
                          <MdWorkOff
                            className="erp-print-btn"
                            fontWeight="regular"
                            onClick={() =>
                              handleShowExperienceLetter(
                                row.original.employee_id,
                                row.original.employee_type
                              )
                            }
                          />
                        </MDTypography>
                      </Tooltip> */}
                    </>
                  )}
                </div>
              ),
            });
          }
          nColumn.push({ Headers: colNameHeader, accessor: colNameAccessor });
        }
        setColumns(nColumn);
        setEmployeesData(responce.content);
      } else {
        setColumns([]);
        setEmployeesData([]);
      }
      return responce;
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.key === "Enter" && searchState !== "") {
        await fetchFilteredData(
          PageCurrent,
          0,
          selectedColumns.length !== 0 ? selectedColumns : availableColumns
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchState]);

  const reload = () => {
    window.location.reload();
  };

  const fetchFilteredDataToExport = async (availCols) => {
    try {
      setIsLoading(true);
      const executeQuery = await submitQuery(availCols);
      const formData = new FormData();
      formData.append(`jsonQuery`, executeQuery);
      const requestOptions = { method: "POST", body: formData };
      try {
        const fetchResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/filter/FnShowFilterRecords`,
          requestOptions
        );
        const responce = await fetchResponse.json();

        let filterColumnsToExport = [];

        if (responce.content.length > 0) {
          // var newColumnHeads = responce.Headerkeys

          // Get column Name & Accessor
          let colNameAccessor;
          let colNameHeader;

          for (let colKey = 0; colKey < availCols.length; colKey++) {
            colNameAccessor = availCols[colKey].accessor;
            colNameHeader = availCols[colKey].Headers;

            if (colNameAccessor !== "Action") {
              filterColumnsToExport.push({
                Headers: colNameHeader,
                accessor: colNameAccessor,
              });
            }
          }

          dataExport = responce.content;
          columnExport = filterColumnsToExport;
        } else {
          dataExport = [];
          columnExport = [];
        }
        return responce;
      } catch (error) {
        console.log("error: ", error);
        navigate("/Error");
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
  };

  const exporttoPdf = async () => {
    try {
      setIsLoading(true);
      await fetchFilteredData(
        PageCurrent,
        entriesPerPage,
        selectedColumns.length !== 0 ? selectedColumns : availableColumns
      );
      const filtrdata = await fetchFilteredDataToExport(
        selectedColumns.length !== 0 ? selectedColumns : availableColumns
      );

      if (filtrdata.length !== 0) {
        var filtrObjKeys = Object.keys(pdfExpFilters);
        for (let objKey = 0; objKey < filtrObjKeys.length; objKey++) {
          var key = filtrObjKeys[objKey];
          var value = pdfExpFilters[key];
        }
      }
      if (dataExport.length !== 0) {
        pdfExp.current.pdf(dataExport, columnExport, reportName, pdfExpFilters);
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
  };

  const exporttoExcel = async () => {
    try {
      setIsLoading(true);
      await fetchFilteredData(
        PageCurrent,
        entriesPerPage,
        selectedColumns.length !== 0 ? selectedColumns : availableColumns
      );
      const filtrdata = await fetchFilteredDataToExport(
        selectedColumns.length !== 0 ? selectedColumns : availableColumns
      );
      if (dataExport.length !== 0) {
        exlsExp.current.exportToExcel(
          filtrdata.content,
          columnExport,
          reportName
        );
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
  };

  const FnShowEmployeesRptRecords = async (reportIdentifierKey) => {
    try {
      const summaryRptApiCall = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/api/report/FnShowAllReportRecords?reportType=${"summary"}&viewName=${"cmv_employee_rpt"}`
      );
      const summaryResponce = await summaryRptApiCall.json();
      console.log("summaryResponce responce: ", summaryResponce);
      if (summaryResponce.content.length !== 0) {
        var rptColumnHeads = summaryResponce.headerKeys;
        setRecordData(summaryResponce.content);
        let filterBox = [];
        let tempOptionBox = [];
        for (let colKey = 0; colKey < rptColumnHeads.length; colKey++) {
          const content = summaryResponce.content;
          const columnName = rptColumnHeads[colKey];
          const value = content[columnName];
          if (value !== null) {
            const myArray = value.split(":");

            switch (myArray[2]) {
              case "Y":
                filterBox.push({ Headers: myArray[1], accessor: columnName });
                tempOptionBox.push({
                  Headers: myArray[1],
                  accessor: columnName,
                });
                break;
              case "O":
                tempOptionBox.push({
                  Headers: myArray[1],
                  accessor: columnName,
                });
                break;
              default:
                break;
            }
          }
        }
        setFilterComboBox(filterBox);
        setAvailableColumns(tempOptionBox);
        setGroupByColumns(tempOptionBox);
        return tempOptionBox;
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    }
  };
  const infoForUpdate = (data, key) => {
    navigate("/Masters/Employees", {
      state: {
        employeeID: data.employee_id,
        keyForViewUpdate: key,
        compType: compType,
        employee_code: data.employee_code,
        employee_name: data.employee_name,
        employee_type: data.employee_type,
        gradeId: data.grade_id,
      },
    });
  };

  function viewUpdateDelete(data, key) {
    setEmployeesId(data.employee_id);
    switch (key) {
      case "update":
        infoForUpdate(data, "update");
        break;
      case "delete":
        setShow(true);
        break;
      case "view":
        infoForUpdate(data, "view");
        break;
      case "approve":
        infoForUpdate(data, "approve");
        break;
    }
  }
  async function DeleteEmployee() {
    try {
      const method = { method: "DELETE" };
      const deleteApiCall = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/employees/FnDeleteRecord/${employeesId}/${UserName}`,
        method
      );
      const responce = await deleteApiCall.json();
      console.log("Employee Deleted: ", responce);
      setShow(false);
      fetchFilteredData(
        PageCurrent,
        entriesPerPage,
        selectedColumns.length !== 0 ? selectedColumns : availableColumns
      );
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    }
  }
  const openForm = () => {
    navigate("/Masters/Employees", {
      state: { employeeID: 0, keyForViewUpdate: "Add", compType: compType },
    });
  };

  const addSelectedColumns = () => {
    const selectedOption = document.getElementById("availableColumns");
    const selectedValue = selectedOption.value;
    if (selectedValue) {
      const selectedColumn = availableColumns.find(
        (column) => column.accessor === selectedValue
      );
      if (selectedColumn) {
        setAvailableColumns(
          availableColumns.filter((column) => column.accessor !== selectedValue)
        );
        setSelectedColumns([...selectedColumns, selectedColumn]);
      }
    }
  };
  const moveAllToSelectedColumns = () => {
    setSelectedColumns([...selectedColumns, ...availableColumns]);
    setAvailableColumns([]);
  };
  const addAvailableColumns = () => {
    const selectedOption = document.getElementById("selectedColumns");
    const selectedValue = selectedOption.value;
    if (selectedValue) {
      const selectedColumn = selectedColumns.find(
        (column) => column.accessor === selectedValue
      );
      if (selectedColumn) {
        setAvailableColumns([...availableColumns, selectedColumn]);
        setSelectedColumns(
          selectedColumns.filter((column) => column.accessor !== selectedValue)
        );
      }
    }
  };

  const moveAllToAvailableColumns = () => {
    // Move all selected columns to available columns
    setAvailableColumns([...availableColumns, ...selectedColumns]);

    // Clear the selected columns
    setSelectedColumns([]);
  };

  const moveOptionUp = () => {
    const selectedIndex = selectedColumns.findIndex(
      (column) => column.accessor === selectedValue
    );

    if (selectedIndex > 0) {
      const newSelectedColumns = [...selectedColumns];
      [
        newSelectedColumns[selectedIndex],
        newSelectedColumns[selectedIndex - 1],
      ] = [
        newSelectedColumns[selectedIndex - 1],
        newSelectedColumns[selectedIndex],
      ];
      setSelectedColumns(newSelectedColumns);
    }
  };

  const moveOptionDown = () => {
    const selectedIndex = selectedColumns.findIndex(
      (column) => column.accessor === selectedValue
    );

    if (selectedIndex < selectedColumns.length - 1 && selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      [
        newSelectedColumns[selectedIndex],
        newSelectedColumns[selectedIndex + 1],
      ] = [
        newSelectedColumns[selectedIndex + 1],
        newSelectedColumns[selectedIndex],
      ];
      setSelectedColumns(newSelectedColumns);
    }
  };

  const moveOptionTop = () => {
    const selectedIndex = selectedColumns.findIndex(
      (column) => column.accessor === selectedValue
    );
    if (selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      const movedColumn = newSelectedColumns.splice(selectedIndex, 1)[0];
      setSelectedColumns([movedColumn, ...newSelectedColumns]);
    }
  };

  const moveOptionBottom = () => {
    const selectedIndex = selectedColumns.findIndex(
      (column) => column.accessor === selectedValue
    );
    if (selectedIndex !== -1) {
      const newSelectedColumns = [...selectedColumns];
      const movedColumn = newSelectedColumns.splice(selectedIndex, 1)[0];
      setSelectedColumns([...newSelectedColumns, movedColumn]);
    }
  };
  function toggleFilter() {
    $(this).text(function (_, currentText) {
      return currentText == "▼" ? "▲" : "▼";
    });
    $(".hide-show-filters").toggle("fast");
  }

  const addFilterSelect = async () => {
    let masterList;
    let filterText = document.getElementById("add_filter_select");
    if (filterText.value !== "0") {
      document.querySelectorAll("#add_filter_select option").forEach((opt) => {
        if (opt.value === filterText.value) {
          opt.disabled = true;
        }
      });
      const value = recordData[filterText.value];
      const myArray = value.split(":");
      const newFilter = {
        id: filterText.value,
        label: myArray[1],
        type: myArray[3],
        dataKey: myArray[5],
        operatorArray: [],
        dataArray: [],
      };
      switch (myArray[3]) {
        case "C":
          if (myArray[5] === "O") {
            resetGlobalQuery();
            globalQuery.columns.push(`DISTINCT (${filterText.value})`);
            globalQuery.conditions.push({
              field: "company_id",
              operator: "=",
              value: COMPANY_ID,
            });
            globalQuery.conditions.push({
              field: "is_delete",
              operator: "=",
              value: 0,
            });
            globalQuery.table = myArray[4];
            masterList = await comboBox.current.fillFiltersCombo(globalQuery);
          } else {
            if (
              filterText.value === "department_name" ||
              filterText.value === "sub_department_name"
            ) {
              resetGlobalQuery();
              globalQuery.columns = ["field_id", "field_name"];
              globalQuery.conditions.push({
                field: "company_id",
                operator: "IN",
                values: [0, COMPANY_ID],
              });
              globalQuery.conditions.push({
                field: "department_type",
                operator: "=",
                value: filterText.value === "department_name" ? "M" : "S",
              });
              globalQuery.conditions.push({
                field: "is_delete",
                operator: "=",
                value: 0,
              });
              globalQuery.table = myArray[4];
              masterList = await comboBox.current.fillFiltersCombo(globalQuery);
            } else {
              masterList = await comboBox.current.fillMasterData(
                myArray[4],
                "",
                ""
              );
            }
          }

          newFilter.operatorArray = operatorByType.list;
          newFilter.dataArray = masterList;
          break;
        case "P":
          let propertyList = await comboBox.current.fillComboBox(myArray[4]);
          newFilter.operatorArray = operatorByType.list;
          newFilter.dataArray = propertyList;
          break;
        case "T":
          newFilter.operatorArray = operatorByType.string;
          break;
        case "H":
          // Extracting values within parentheses from the last element
          const valuesInParentheses = myArray[myArray.length - 1].slice(1, -1);
          // Splitting the string into an array of values
          const resultArray = valuesInParentheses.split(",");
          console.log(resultArray);
          newFilter.operatorArray = operatorByType.list;
          newFilter.dataArray = resultArray;
          break;
        case "D":
          newFilter.operatorArray = operatorByType.date;
          break;
      }
      // Update the state with the new filter
      setSelectedFilters((prevFilters) => [...prevFilters, newFilter]);
    }
  };

  const removeFilter = (filterId) => {
    // Remove the filter from the state
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.id !== filterId)
    );
    document.querySelectorAll("#add_filter_select option").forEach((opt) => {
      if (opt.value === filterId) {
        opt.disabled = false;
      }
    });
    $("#add_filter_select").val("0");
  };

  const submitQuery = async (availCols) => {
    try {
      const requiredColumns = [
        "employee_id",
        "employee_workprofile_id",
        "employee_salary_id",
        "grade_id",
      ];

      let selectBox = document.getElementById("selectedColumns");
      let group_by = document.getElementById("group_by").value;
      let jsonQuery = {
        viewname: {},
        selectQuery: {},
        whereQuery: {},
        operators: {},
        group_by: {},
        additionalParam: {},
        orderBy: {},
        CONDITIONS: [],
      };
      storeSelectedValues = [];
      if (selectBox.length !== 0) {
        let selectOrder = []; // Array to store the order of elements,
        let storeSelectedValues = []; // Assuming this is defined somewhere in your code

        // Loop through selectBox to populate selectQuery and selectOrder
        for (let index = 0; index < selectBox.length; index++) {
          let optionValue = selectBox.options[index].value;
          jsonQuery["selectQuery"][index] = optionValue;
          selectOrder.push(index); // Store the index in the order array
          storeSelectedValues.push(optionValue);
        }

        // Loop through requiredColumns to add missing elements in the specified order
        for (let index = 0; index < requiredColumns.length; index++) {
          const element = requiredColumns[index];
          if (!jsonQuery.selectQuery.hasOwnProperty(element)) {
            // Add the element at the end of the order array and assign the value
            selectOrder.push(selectOrder.length);
            jsonQuery["selectQuery"][selectOrder.length - 1] = element;
          }
        }

        // Now, construct the final selectQuery object using the specified order
        let finalSelectQuery = {};
        for (let orderIndex of selectOrder) {
          finalSelectQuery[orderIndex] = jsonQuery["selectQuery"][orderIndex];
        }

        // Replace the original selectQuery with the finalSelectQuery
        jsonQuery["selectQuery"] = finalSelectQuery;
      } else {
        for (let index = 0; index < availCols.length; index++) {
          let optionValue = availCols[index].accessor;
          jsonQuery["selectQuery"][optionValue] = optionValue;
        }
      }

      for (let selIndex = 0; selIndex < selectedFilters.length; selIndex++) {
        let fieldvalue = selectedFilters[selIndex].id.trim();
        let operatorSelectValue = document.getElementById(
          `operators_${fieldvalue}_id`
        ).value;
        let valueSelectValue = document.getElementById(
          `values_${fieldvalue}_id`
        ).value;
        if (selectedFilters[selIndex].type === "T") {
          switch (operatorSelectValue) {
            case "~":
              operatorSelectValue = "LIKE";
              valueSelectValue = "%" + valueSelectValue + "%";
              break;
            case "!~":
              operatorSelectValue = "NOT LIKE";
              valueSelectValue = "%" + valueSelectValue + "%";
              break;
            case "^":
              operatorSelectValue = "LIKE";
              valueSelectValue = "%" + valueSelectValue;
              break;
            case "$":
              operatorSelectValue = "LIKE";
              valueSelectValue = valueSelectValue + "%";
              break;
            default:
              break;
          }
        }

        if (
          selectedFilters[selIndex].type === "D" &&
          operatorSelectValue === "<>="
        ) {
          if (
            document.getElementById(`values_${fieldvalue}_id_2`).value !== "" &&
            document.getElementById(`values_${fieldvalue}_id`).value !== ""
          ) {
            valueSelectValue = `${
              document.getElementById(`values_${fieldvalue}_id_2`).value
            }`;
            operatorSelectValue = `BETWEEN '${
              document.getElementById(`values_${fieldvalue}_id`).value
            }' AND `;
            // this for display filters on reports
            pdfExpFilters[selectedFilters[selIndex].label] =
              valueSelectValue +
              ` BETWEEN ` +
              `${document.getElementById(`values_${fieldvalue}_id`).value}`;
          } else {
            continue;
          }
        } else {
          // this for display filters on reports
          pdfExpFilters[selectedFilters[selIndex].label] = valueSelectValue;
        }
        jsonQuery["whereQuery"][fieldvalue] = valueSelectValue?.trim();
        jsonQuery["operators"][fieldvalue] = operatorSelectValue;
      }
      jsonQuery["group_by"]["GROUP BY"] = group_by;
      jsonQuery["additionalParam"]["is_delete"] = "0";
      if (!jsonQuery.whereQuery.hasOwnProperty("Active")) {
        jsonQuery["additionalParam"]["is_active"] = "1";
      }
      jsonQuery["additionalParam"]["company_id"] = COMPANY_ID;
      // if (employeeTypeRef.current.value === 'All') {
      //     jsonQuery['additionalParam']['employee_type'] = employeeTypeRef.current.value;
      // }
      jsonQuery["viewname"]["cmv_employee"] = "cmv_employee";
      jsonQuery["orderBy"]["ORDER BY"] = "employee_id";

      console.log("Where query: - ", jsonQuery);

      // For search box
      if (searchState !== "") {
        jsonQuery.CONDITIONS = [
          {
            field: "employee_name",
            value: searchState,
            operator: "LIKE",
            logicalOperator: "OR",
          },
          {
            field: "old_employee_code",
            value: searchState,
            operator: "LIKE",
            logicalOperator: "OR",
          },
          {
            field: "machine_employee_code",
            value: searchState,
            operator: "LIKE",
            logicalOperator: "OR",
          },
          {
            field: "department_name",
            value: searchState,
            operator: "LIKE",
            logicalOperator: "OR",
          },
          {
            field: "sub_department_name",
            value: searchState,
            operator: "LIKE",
            logicalOperator: "OR",
          },
        ];
      }

      let executeQuery = JSON.stringify(jsonQuery);
      return executeQuery;
    } catch (error) {
      console.log("error", error);
      navigate("/Error");
    }
  };
  const FnCheckUserAccess = () => {
    const currentRoute = window.location.pathname;
    const obj = USER_ACCESS
      ? USER_ACCESS.find((item) => item.listing_navigation_url === currentRoute)
      : null;
    console.log("Particular Page user access: ", obj);
    return obj;
  };

  const FnRenderAdditionalInputsOnDateChange = (filter) => {
    if (
      filter.type === "D" &&
      document.getElementById(`operators_${filter.id}_id`).value === "<>="
    ) {
      const filterTblRow = document.getElementById(`${filter.id}`);
      const filterTblRowTd = document.createElement("td");

      // Create the first input element
      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.id = `values_${filter.id}_id_2`;
      dateInput.className =
        "erp_form_control erp_input_field inputValue erp_operator_val ms-4";

      filterTblRowTd.appendChild(dateInput);
      filterTblRow.appendChild(filterTblRowTd);
    } else {
      // Remove the existing td if it exists
      const existingTd = document.getElementById(`values_${filter.id}_id_2`);
      if (existingTd) {
        existingTd.parentNode.removeChild(existingTd);
      }
    }
    return null;
  };

  const labels = {
    hindi: {
      language: "भाषा",
    },
    gujarati: {
      language: "ભાષા",
    },
  };
  const currentLabels = labels[currentLanguage] || labels.hindi;

  const memoizedContent = useMemo(() => {
    return (
      <>
        {data.length !== 0 ? (
          <>
            <Datatable data={data} columns={columns} freezeColumnCount={5} />
            {pageCount !== 1 && (
              <ReactPaginate
                className="erp_pagination"
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link erp-gb-button"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link erp-gb-button"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link erp-gb-button"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            )}
          </>
        ) : (
          <Card id="NoRcrdId">
            <Card.Body>No records found...</Card.Body>
          </Card>
        )}
      </>
    );
  }, [data, columns]); // Dependencies for memoization

  return (
    <>
      <ComboBox ref={comboBox} />
      <PdfExport ref={pdfExp} />
      <ExcelExport ref={exlsExp} />
      <JsonExport ref={jsonExp} />
      <ValidateNumberDateInput ref={validateNumberDateInput} />
      <CSVExport ref={csvExp} />
      <ReactToPrint content={() => printRef.current} />

      {isLoading ? (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <CircularProgress color="primary" />
            <span id="spinner_text" className="text-dark">
              Loading...
            </span>
          </div>
        </div>
      ) : null}
      <DashboardLayout>
        <div className="main_heding">
          <label className="erp-form-label-lg">Employee Information</label>
        </div>

        <button className="erp_toggle-filter" onClick={toggleFilter}>
          <AiOutlineDownCircle className="rotate_filtr_arrow" />
          <MDTypography
            component="label"
            variant="button"
            className="erp-form-label-md-lg"
          >
            &nbsp; filters
          </MDTypography>
        </button>

        <div className="hide-show-filters card filter">
          <div className="row">
            <div className="col-sm-6 erp_filter_table_avl_col">
              <div className="container shadow h-100 rounded erp_group-resl_container">
                <div className="row erp_filter_row_tab_view">
                  <div className="col-sm-4">
                    <span>
                      <MDTypography
                        component="label"
                        variant="button"
                        className="erp-form-label-md"
                      >
                        Available Columns
                      </MDTypography>
                      <select
                        size="10"
                        id="availableColumns"
                        className="erp_form-select-sm-filter erp_form-select-filter"
                      >
                        {availableColumns?.map((column) => (
                          <option value={column.accessor}>
                            {" "}
                            {column.Headers}{" "}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>

                  <div className="col-sm-1">
                    <div className="buttons" id="buttons_row1">
                      <TbArrowsRight
                        size={15}
                        className="buttons_move erp_filtr_moveBtn"
                        onClick={moveAllToSelectedColumns}
                      />
                      <br></br>
                      <HiOutlineArrowNarrowRight
                        size={15}
                        className="buttons_move erp_filtr_moveBtn"
                        onClick={addSelectedColumns}
                      />
                      <br></br>
                      <HiOutlineArrowNarrowLeft
                        size={15}
                        className="buttons_move erp_filtr_moveBtn"
                        onClick={addAvailableColumns}
                      />
                      <br></br>
                      <TbArrowsLeft
                        size={15}
                        className="buttons_move erp_filtr_moveBtn"
                        onClick={moveAllToAvailableColumns}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="col">
                      <MDTypography
                        component="label"
                        variant="button"
                        className="erp-form-label-md"
                      >
                        Selected Columns
                      </MDTypography>

                      <select
                        size="10"
                        id="selectedColumns"
                        className="erp_form-select-sm-filter erp_form-select-filter"
                        onChange={(e) => setSelectedValue(e.target.value)}
                      >
                        {selectedColumns.map((column, index) => (
                          <option key={index} value={column.accessor}>
                            {column.Headers}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-1">
                    <div className="buttons" id="buttons_row2">
                      <TbArrowsUp
                        size={15}
                        className="erp_filtr_moveBtn"
                        onClick={moveOptionTop}
                      />
                      <br></br>
                      <HiOutlineArrowNarrowUp
                        size={15}
                        className="erp_filtr_moveBtn"
                        onClick={moveOptionUp}
                      />
                      <br></br>
                      <HiOutlineArrowNarrowDown
                        size={15}
                        className="erp_filtr_moveBtn"
                        onClick={moveOptionDown}
                      />
                      <br></br>
                      <TbArrowsDown
                        size={15}
                        className="erp_filtr_moveBtn"
                        onClick={moveOptionBottom}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 erp_filter_group-by-result">
              <div className="container shadow h-100 rounded erp_group-resl_container">
                <div className="row erp_group-reslut-by">
                  <div className="col-sm-3 filtr_gropBy">
                    <MDTypography
                      className="erp-form-label-md"
                      component="label"
                      variant="button"
                    >
                      Group results by
                    </MDTypography>
                  </div>
                  <div className="col filtr_gropBy">
                    <Form.Select
                      size="sm"
                      className="erp_form_control operatorSelect"
                      id="group_by"
                    >
                      <option value=""></option>
                      {groupByColumns?.map((column) => (
                        <option value={column.accessor}>
                          {" "}
                          {column.Headers}{" "}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div className="row add-filter add_filter_div">
                  <div className="col-sm-3">
                    <MDTypography
                      component="label"
                      variant="button"
                      className="erp-form-label-md"
                    >
                      Add Filter
                    </MDTypography>
                  </div>
                  <div className="col">
                    <Form.Select
                      size="sm"
                      onChange={addFilterSelect}
                      className="erp_form_control group_by operatorSelect erp_add_filter"
                      id="add_filter_select"
                    >
                      <option value="0"></option>
                      {filterComboBox?.map((column) => (
                        <option value={column.accessor}>
                          {column.Headers}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>

                <table id="filters-table" className="erp-filters-table-scroll">
                  <tbody>
                    {selectedFilters.map((filter) => (
                      <tr id={filter.id} key={filter.id}>
                        <td>
                          <input
                            type="checkbox"
                            id={`cb_${filter.id}_id`}
                            value={filter.id}
                            checked
                            onClick={() => removeFilter(filter.id)}
                          />
                          <label className="erp-form-label">
                            &nbsp;{filter.label}
                          </label>
                        </td>
                        {/* Operators */}
                        <td>
                          {(filter.type === "C" ||
                            filter.type === "P" ||
                            filter.type === "H") && (
                            <select
                              id={`operators_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                            >
                              {filter.operatorArray.map((operator) => (
                                <option key={operator} value={operator}>
                                  {operatorLabels[operator]}
                                </option>
                              ))}
                            </select>
                          )}
                          {filter.type === "T" && (
                            <select
                              id={`operators_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                            >
                              {filter.operatorArray.map((operator) => (
                                <option key={operator} value={operator}>
                                  {operatorLabels[operator]}
                                </option>
                              ))}
                            </select>
                          )}

                          {filter.type === "D" && (
                            <select
                              id={`operators_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                              onChange={() =>
                                FnRenderAdditionalInputsOnDateChange(filter)
                              }
                            >
                              {filter.operatorArray.map((operator) => (
                                <option key={operator} value={operator}>
                                  {operatorLabels[operator]}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        {/* Values */}
                        <td>
                          {filter.type === "C" && (
                            <select
                              id={`values_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                            >
                              {filter.dataArray.map((item, index) => (
                                <option
                                  key={index}
                                  value={
                                    filter.dataKey === "O"
                                      ? item[filter.id]
                                      : item.field_name
                                  }
                                >
                                  {filter.dataKey === "O"
                                    ? item[filter.id]
                                    : item.field_name}
                                </option>
                              ))}
                            </select>
                          )}

                          {filter.type === "P" && (
                            <select
                              id={`values_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                            >
                              {filter.dataArray.map((item, index) => (
                                <option key={index} value={item.field_name}>
                                  {item.field_name}
                                </option>
                              ))}
                            </select>
                          )}
                          {filter.type === "T" && (
                            <input
                              type="text"
                              id={`values_${filter.id}_id`}
                              className="erp_form_control erp_input_field inputValue erp_operator_val"
                            />
                          )}
                          {filter.type === "D" && (
                            <>
                              <input
                                type="date"
                                id={`values_${filter.id}_id`}
                                className="erp_form_control erp_input_field inputValue erp_operator_val"
                              />
                            </>
                          )}
                          {filter.type === "H" && (
                            <select
                              id={`values_${filter.id}_id`}
                              className="form-select form-select-sm operatorSelect erp_operator_val erp_form_control"
                            >
                              {filter.dataArray.map((operator, index) => (
                                <option key={index} value={operator}>
                                  {operator}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="row btn_row_class">
                    <div className="col-sm-10" >
                        <MDButton className={`btn erp-gb-button ${compType === 'Register' ? 'd-none' : 'display'}`} variant="button" fontWeight="regular" onClick={openForm}>Add</MDButton> &nbsp;
                        <MDButton class="btn erp-gb-button" variant="button" fontWeight="regular" onClick={() => fetchFilteredData(PageCurrent, entriesPerPage, selectedColumns.length !== 0 ? selectedColumns : availableColumns)}>Apply Filter</MDButton> &nbsp;
                        <MDButton class="btn erp-gb-button" variant="button" fontWeight="regular" onClick={reload}>Clear Filter</MDButton>&nbsp;

                        <span className="page_entries">
                            <MDTypography component="label" className="erp-form-label-md" variant="button" fontWeight="regular" color="dark" textTransform="capitalize">Entries per page</MDTypography>

                            <Form.Select onChange={handlePageCountClick} value={entriesPerPage} className="erp_page_select erp_form_control" id="page_entries_id" >
                                {pageEntriesOptions.map(pageEntriesOptions => (
                                    <option value={pageEntriesOptions.value}>{pageEntriesOptions.label}</option>

                                ))}
                            </Form.Select>
                        </span>
                        <Form.Select size="sm" className="erp_form_control group_by operatorSelect erp_add_filter" >
                            <option value="0"></option>
                            {employeeTypes?.map(empType => (
                                <option value={empType.field_name}>{empType.field_name}</option>

                            ))}
                        </Form.Select>
                    </div>
                    <div className="col-2 pagination_id">

                        <span className="exports">
                            <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoPdf()}>PDF<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                            <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoExcel()}>EXCEL<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                            <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exportToCSV()}>CSV<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                            <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoJSON()}>JSON<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;

                        </span>
                    </div>
                </div> */}

        <div className="row btn_row_class">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <MDButton
                className={`btn erp-gb-button ${
                  compType === "Register" ? "d-none" : "d-block"
                }`}
                variant="button"
                fontWeight="regular"
                onClick={openForm}
              >
                Add
              </MDButton>{" "}
              &nbsp;
              <MDButton
                className="btn erp-gb-button"
                variant="button"
                fontWeight="regular"
                onClick={() =>
                  fetchFilteredData(
                    PageCurrent,
                    entriesPerPage,
                    selectedColumns.length !== 0
                      ? selectedColumns
                      : availableColumns
                  )
                }
              >
                Apply Filter
              </MDButton>{" "}
              &nbsp;
              <MDButton
                className="btn erp-gb-button"
                variant="button"
                fontWeight="regular"
                onClick={reload}
              >
                Clear Filter
              </MDButton>{" "}
              &nbsp;
              <span className="page_entries d-flex align-items-center">
                <MDTypography
                  component="label"
                  className="erp-form-label-md"
                  variant="button"
                  fontWeight="regular"
                  color="dark"
                  textTransform="capitalize"
                >
                  Entries per page
                </MDTypography>
                <Form.Select
                  onChange={handlePageCountClick}
                  value={entriesPerPage}
                  className="erp_page_select erp_form_control"
                  id="page_entries_id"
                >
                  {pageEntriesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </span>
              &nbsp;
            </div>
            <div className="d-flex align-items-center">
              <MDButton
                className="erp-gb-button"
                variant="button"
                fontWeight="regular"
                onClick={() => exporttoPdf()}
              >
                PDF
                <FiDownload className="erp-download-icon-btn" />
              </MDButton>{" "}
              &nbsp;
              <MDButton
                className="erp-gb-button"
                variant="button"
                fontWeight="regular"
                onClick={() => exporttoExcel()}
              >
                EXCEL
                <FiDownload className="erp-download-icon-btn" />
              </MDButton>
            </div>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col-sm-3">
            <div class="input-group">
              <input
                type="text"
                className="erp_input_field form-control"
                style={{ height: "30px" }}
                value={searchState}
                onChange={(e) => setGlobalFilterSearch(e.target.value)}
                placeholder="Search!..."
              />
              <span class="input-group-text" id="basic-addon2" onClick={reload}>
                <FaTimes />
              </span>
            </div>
          </div>
          <div className="col-sm-1">
            <MDButton
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={() =>
                fetchFilteredData(
                  PageCurrent,
                  0,
                  selectedColumns.length !== 0
                    ? selectedColumns
                    : availableColumns
                )
              }
            >
              {" "}
              <RiSearchLine className="erp-download-icon-btn" />{" "}
            </MDButton>
          </div>
        </div>

        {memoizedContent}
      </DashboardLayout>

      <div>
        <Modal show={showModal} size="lg">
          {selectedEmployeeType !== "Worker" && (
            <span>
              <button
                type="button"
                class="erp-modal-close btn-close"
                aria-label="Close"
                onClick={handleCloses}
              ></button>
            </span>
          )}
          {selectedEmployeeType === "Worker" && (
            <div className="row mt-3">
              <div className="col-7"></div>
              <div className="col-sm-2 text-end">
                <Form.Label className="erp-form-label text-end">
                  {currentLabels.language} / Language :
                </Form.Label>
              </div>
              <div className="col-2  text-end">
                <select
                  className="form-select form-select-sm"
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                >
                  {/* <option value="english">English</option> */}
                  <option value="hindi">हिंदी</option>
                  <option value="gujarati">ગુજરાતી</option>
                </select>
              </div>
              <div className="col-1">
                <span>
                  <button
                    type="button"
                    class="erp-modal-close btn-close"
                    aria-label="Close"
                    onClick={handleCloses}
                  ></button>
                </span>
              </div>
            </div>
          )}
          <Modal.Body>
            <div ref={printRef}>
              {/* <MEmployeePrint employeeId={selectedEmployeeId} /> */}
              {selectedEmployeeType === "Worker" ? (
                <MEmployeeWorkerPrint
                  employeeId={selectedEmployeeId}
                  currentLanguage={currentLanguage}
                />
              ) : (
                <MEmployeePrint employeeId={selectedEmployeeId} />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={handleCloses}
            >
              Back
            </Button>

            <MDButton
              className="erp-gb-button erp_MLeft_btn"
              variant="button"
              fontWeight="regular"
              onClick={() => printInvoice()}
            >
              Print &nbsp;
              <FiPrinter className="erp-download-icon-btn" />
            </MDButton>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <Modal show={showOfferLetter} size="lg">
          <span>
            <button
              type="button"
              class="erp-modal-close btn-close"
              aria-label="Close"
              onClick={handleCloses}
            ></button>
          </span>
          <Modal.Body>
            <div ref={printRef}>
              <MEmployeeOfferLetter employeeId={selectedEmployeeId} />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={handleCloses}
            >
              Back
            </Button>

            <MDButton
              className="erp-gb-button erp_MLeft_btn"
              variant="button"
              fontWeight="regular"
              onClick={() => printInvoice()}
            >
              Print &nbsp;
              <FiPrinter className="erp-download-icon-btn" />
            </MDButton>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <Modal show={showRelievingLetter} size="lg">
          <span>
            <button
              type="button"
              class="erp-modal-close btn-close"
              aria-label="Close"
              onClick={handleCloses}
            ></button>
          </span>
          <Modal.Body>
            <div ref={printRef}>
              <MRelievingLetter employeeId={selectedEmployeeId} />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={handleCloses}
            >
              Back
            </Button>

            <MDButton
              className="erp-gb-button erp_MLeft_btn"
              variant="button"
              fontWeight="regular"
              onClick={() => printInvoice()}
            >
              Print &nbsp;
              <FiPrinter className="erp-download-icon-btn" />
            </MDButton>
          </Modal.Footer>
        </Modal>
      </div>
      

      <div>
        <Modal show={showAppointmentModal} size="lg">
          <span>
            <button
              type="button"
              class="erp-modal-close btn-close"
              aria-label="Close"
              onClick={handleCloses}
            ></button>
          </span>
          <Modal.Body>
            <div ref={printRef}>
              <MEmployeeAppointmentLetter employeeId={selectedEmployeeId} />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={handleCloses}
            >
              Back
            </Button>

            <MDButton
              className="erp-gb-button erp_MLeft_btn"
              variant="button"
              fontWeight="regular"
              onClick={() => printInvoice()}
            >
              Print &nbsp;
              <FiPrinter className="erp-download-icon-btn" />
            </MDButton>
          </Modal.Footer>
        </Modal>
      </div>

<div>
      <Modal show={showExperienceLetter} size="lg">
          <span>
            <button
              type="button"
              class="erp-modal-close btn-close"
              aria-label="Close"
              onClick={handleCloses}
            ></button>
          </span>
          <Modal.Body>
            <div ref={printRef}>
              <MExperienceLetter employeeId={selectedEmployeeId} />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              className="erp-gb-button"
              variant="button"
              fontWeight="regular"
              onClick={handleCloses}
            >
              Back
            </Button>

            <MDButton
              className="erp-gb-button erp_MLeft_btn"
              variant="button"
              fontWeight="regular"
              onClick={() => printInvoice()}
            >
              Print &nbsp;
              <FiPrinter className="erp-download-icon-btn" />
            </MDButton>
          </Modal.Footer>
        </Modal>
      </div>

      <DeleteModal
        show={show}
        closeModal={handleClose}
        deleteRecord={DeleteEmployee}
      />
    </>
  );
}
