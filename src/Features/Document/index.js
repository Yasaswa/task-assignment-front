import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import $ from 'jquery';

// @mui material components
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";

//React Bootstrap
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';


// File Imports
import FrmValidations from "FrmGeneric/FrmValidations";
import ComboBox from "Features/ComboBox";
import PdfExport from 'Features/Exports/PdfExport';
import ExcelExport from "Features/Exports/ExcelExport";
import JsonExport from "Features/Exports/JsonExport";
import CSVExport from "Features/Exports/CSVExport";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";

// React icons
import { RxCrossCircled } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import Datatable from "components/DataTable";
import { FiDownload } from "react-icons/fi";
import ConfigConstants from "assets/Constants/config-constant";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";


const Document = ({ document_group, group_id }) => {
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName, COMPANY_NAME } = configConstants;

    const comboBox = useRef();
    const validate = useRef();
    const navigate = useNavigate();

    const [document_id, setDocument_id] = useState(0)
    const [docFormHeading, setDocFormHeading] = useState('Document Information');

    // Pagination Variables 
    const pageEntriesOptions = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "50", value: 50 },
        { label: "100", value: 100 },
        { label: "500", value: 500 },
    ]
    var [entriesPerPage, setEntriesPerPage] = useState(pageEntriesOptions[0].value);
    const [pageCount, setpageCount] = useState(0);
    const [PageCurrent, setcurrentPage] = useState(0);

    //React Table data & column fields
    const [data, setDocumentData] = useState([]);
    const [columns, setColumns] = useState([]);
    var columnHeads;

    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [docSuccMsg, setdocSuccMsg] = useState('');


    //Insert Document Form Fields
    const [documentGroup, setDocumentGroup] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [documentRegistrationNo, setDocumentRegistrationNo] = useState('');
    const [documentRegistrationDate, setDocumentRegistrationDate] = useState('');
    const [documentRenewalDate, setDocumentRenewalDate] = useState('');
    const [documentFile, setDocument] = useState('');
    const [remark, setRemark] = useState('');
    const [document_path, setDocumentPath] = useState('');
    const [is_active, setIsActive] = useState(false);
    const [file_name, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // keys for update or view 
    const [docViewUpdateKey, setDocViewUpdateKey] = useState('');

    // Export Fields
    var dataExport = [];
    var columnExport = [];
    const pdfExp = useRef();
    const exlsExp = useRef();
    const jsonExp = useRef();
    const csvExp = useRef();
    var reportName = "Document"


    useEffect(() => {
        const functionCall = async () => {
            await showDocumentRecords();
            // await FnShowDocumentRecordsToExport();
        }
        functionCall();
    }, [])


    const showDocumentRecords = async () => {
        try {
            if (COMPANY_ID !== null) {
                const res = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/api/Documents/FnShowParticularRecord?document_group=${document_group}&group_id=${group_id}&page=0&size=${entriesPerPage}`
                );
                const resp = await res.json();
                if (resp.content.length > 0) {

                    let column = [];
                    const total = resp.totalElements;
                    setpageCount(Math.ceil(total / entriesPerPage));
                    columnHeads = Object.keys(resp.content[0]);
                    console.log("Document Records: ", resp)
                    for (let colKey = 0; colKey < columnHeads.length; colKey++) {
                        if (colKey === 0) {
                            column.push({
                                Headers: "Action", accessor: "Action",
                                Cell: row => (
                                    <div style={{ display: "flex" }}>
                                        <MdModeEdit className="erp-edit-btn" onClick={e => viewUpdateDelete(row.original, 'update')} />
                                        <MdDelete className="erp-delete-btn" onClick={e => viewUpdateDelete(row.original, 'delete')} />
                                        <AiFillEye className="erp-view-btn" onClick={e => viewUpdateDelete(row.original, 'view')} />
                                    </div>
                                ),
                            });
                        }
                        if (!columnHeads[colKey].includes('_id'))
                            column.push({ Headers: columnHeads[colKey], accessor: columnHeads[colKey] });

                    }
                    setDocumentData(resp.content);
                    setColumns(column);
                }
            }

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }


    const FnShowDocumentRecordsToExport = async () => {
        try {
            const apiCallDocExport = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnShowParticularRecord?group_id=${group_id}&document_group=${document_group}`)
            const responce = await apiCallDocExport.json();
            if (responce.content.length !== 0) {
                return responce.content
            }

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    }

    const fetchComments = async (currentPage) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnShowParticularRecord?document_group=${document_group}&group_id=${group_id}&page=0&size=${entriesPerPage}`);
            const resp = await res.json();
            console.log("Responce when fetch comments : ", resp)
            const data = resp.content
            if (data.length === 0) {
                showAddDocumentForm();
            }
            setDocumentData(data);
            return data;

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };

    const handlePageClick = async (pageNo) => {
        let currentPage = pageNo.selected;
        setcurrentPage(currentPage);
        await fetchComments(currentPage);
    }

    const handlePageCountClick = () => {
        var count = document.getElementById("page_entries_id").value;
        setEntriesPerPage(count)
        showDocumentRecords();
    }

    const infoForUpdate = async (document_id, key) => {
        try {
            setIsLoading(true)
            const docInfoApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnShowParticularRecordForUpdate/${document_id}`)
            const responce = await docInfoApiCall.json();

            setDocumentGroup(responce.document_group)
            setDocumentName(responce.document_name)
            setDocumentRegistrationNo(responce.document_registration_no)
            setDocumentRegistrationDate(responce.document_registration_date)
            setDocumentRenewalDate(responce.document_renewal_date)
            setDocumentPath(responce.document_path)
            setRemark(responce.remark)
            setIsActive(responce.is_active)
            setFileName(responce.file_name)

            if (key === "view") {
                setDocFormHeading('View Document')
                setDocViewUpdateKey("view")
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly('docFormId')
            } else if (key === "update") {
                setDocViewUpdateKey("update")
                setDocFormHeading('Modify Document')
                await validate.current.removeReadOnlyAttr('docFormId')
                $("input[type=radio]").attr('disabled', false);

            }

        } catch (error) {
            console.log("error: ", error);
            navigate('/Error')
        }

        setIsLoading(false)
    }

    function viewUpdateDelete(data, key) {
        var document_id = data.document_id
        setDocument_id(document_id)
        switch (key) {
            case 'delete': setShow(true); break;
            case 'update': infoForUpdate(document_id, "update"); break;
            case 'view': infoForUpdate(document_id, "view"); break;
            default: break;
        }
    }

    async function deleteDocument() {
        try {
            const method = { method: 'POST' }
            const deleteApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnDeleteRecord/${document_id}/${UserName}`, method)
            const responce = await deleteApiCall.json();
            if (responce.success === 1) {
                if (responce.data.document_id === document_id) {
                    clearDocFormFields()
                }
                fetchComments(PageCurrent);
                setShow(false)
            } else {
                setErrMsg(responce.error)
                setShowErrorMsgModal(true)
            }
        } catch (error) {
            console.log("error: ", error);
            navigate('/Error')
        }

    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            var fileName = e.target.files[0];
            setDocument(fileName);
            $('#error_document').hide();
        }
    };

    const validateDocFormFields = () => {
        var formObj = $('#docFormId');
        var inputObj;

        for (var i = 0; i <= formObj.get(0).length - 1; i++) {
            inputObj = formObj.get(0)[i];
            if (inputObj.type === 'text' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'select-one' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'textarea' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            } else if (inputObj.type === 'date' && inputObj.value !== '') {
                $("#error_" + inputObj.id).hide();
            }
        }
    }


    const addDocument = async () => {
        try {
            setIsLoading(true)
            // event.preventDefault(); // 👈️ prevent page refresh
            let isValid = await validate.current.validateForm("docFormId");

            if (isValid === false && documentFile === null && document_id !== 0) {
                isValid = true;
                $('#error_document').hide();
            }

            if (isValid) {
                const data = {
                    document_id: document_id,
                    company_id: COMPANY_ID,
                    group_id: group_id,
                    document_group: document_group,
                    document_name: documentName,
                    document_registration_no: documentRegistrationNo,
                    document_registration_date: documentRegistrationDate,
                    document_renewal_date: documentRenewalDate,
                    remark: remark,
                    is_active: is_active,
                    created_by: UserName,
                    modified_by: document_id !== 0 ? UserName : null
                };
                const formData = new FormData();

                formData.append(`file`, documentFile)
                formData.append(`data`, JSON.stringify(data))

                const requestOptions = {
                    method: 'POST',
                    body: formData
                };

                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Documents/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json();
                // check for error response
                if (responce.success === 0) {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    console.log("search", responce);
                    setdocSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                    clearDocFormFields();
                    await showDocumentRecords();
                    // await FnShowDocumentRecordsToExport();

                }

            }
        } catch (error) {
            console.log("error: ", error);
            navigate('/Error')
        }
        setIsLoading(false)
    };

    const clearDocFormFields = async () => {
        setDocumentName('');
        setDocumentRegistrationNo('');
        setDocumentRegistrationDate('');
        setDocumentRenewalDate('');
        setDocument('');
        setRemark('');
        setDocumentPath('')
        setFileName('')
        $('#document').val('')
        await validate.current.removeReadOnlyAttr('docFormId')
        $("input[type=radio]").attr('disabled', false);
    }


    async function showAddDocumentForm() {
        clearDocFormFields();
        setDocument_id(0)
        setDocFormHeading('Document Information')
        setDocViewUpdateKey("")
        await validate.current.removeReadOnlyAttr('docFormId')
        $("input[type=radio]").attr('disabled', false);
    }

    const fetchDocument = async () => {
        try {
            const formData = new FormData()
            const data = {
                document_group: documentGroup,
                group_id: group_id,
                document_path: document_path
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
            link.setAttribute('download', `${file_name}`,);
            document.body.appendChild(link);

            link.click();
            link.parentNode.removeChild(link);


        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }


    }

    const exporttoPdf = async () => {
        const exportData = await FnShowDocumentRecordsToExport();
        if (exportData.length !== 0) {
            var columnExport = [];
            for (let keys in exportData[0]) {
                if (!keys.includes('_id'))
                    columnExport.push({ Headers: keys, accessor: keys })
            };
            pdfExp.current.pdf(exportData, columnExport, reportName, "")
        }

    }

    async function exporttoExcel() {
        const exportData = await FnShowDocumentRecordsToExport();
        let columnExport = Object.keys(exportData[0]);

        let jsonToExportExcel = { 'allData': {}, 'columns': [], 'filtrKeyValue': {}, 'headings': {}, 'key': 'reportExport' }

        // columns
        for (let col = 0; col < columnExport.length; col++) {
            if (!columnExport[col].includes('_id'))
                jsonToExportExcel.columns.push({ "Headers": columnExport[col], "accessor": columnExport[col] })
        }

        for (let arrKey = 0; arrKey < exportData.length; arrKey++) {
            jsonToExportExcel['allData'][arrKey] = exportData[arrKey];
        }
        jsonToExportExcel['headings']['ReportName'] = reportName
        jsonToExportExcel['headings']['CompanyName'] = COMPANY_NAME
        jsonToExportExcel['headings']['CompanyAddress'] = sessionStorage.getItem('companyAddress')

        console.log("jsonToExportExcel: ", jsonToExportExcel)

        exlsExp.current.excel(jsonToExportExcel, reportName)

    }

    const exporttoJSON = async () => {
        const exportData = await FnShowDocumentRecordsToExport();
        if (exportData.length !== 0)
            jsonExp.current.json(exportData, reportName)

    }

    const exportToCSV = async () => {
        debugger;
        const exportData = await FnShowDocumentRecordsToExport();
        var columnExport = [];
        if (exportData.length !== 0) {
            let data = exportData.map(element => {
                return columnExport.reduce((dataJson, col) => {
                    dataJson[col.accessor] = element[col.accessor];
                    return dataJson;
                }, {});
            });
            csvExp.current.csv(exportData, columnExport, reportName)
        }
    }


    return (
        <>
            <ComboBox ref={comboBox} />
            <PdfExport ref={pdfExp} />
            <ExcelExport ref={exlsExp} />
            <JsonExport ref={jsonExp} />
            <CSVExport ref={csvExp} />
            <FrmValidations ref={validate} />
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span id="spinner_text" className="text-dark">Loading...</span>
                    </div>
                </div> :
                null}

            <div className="row btn_row_class">
                <div className={`col-sm-6 add_btn ${data.length === 0 ? 'd-none' : 'display'}`}>
                    <MDButton className="btn erp-gb-button" variant="button" fontWeight="regular" onClick={showAddDocumentForm}>Add Document</MDButton>&nbsp;
                    <span>
                        <span className="page_entries">
                            <MDTypography component="label" variant="button" className="erp-form-label-md" >Entries per page: </MDTypography>

                            <select onChange={handlePageCountClick} className="erp_page_select erp_form_control" id="page_entries_id" >
                                {pageEntriesOptions.map(pageEntriesOptions => (
                                    <option value={pageEntriesOptions.value}>{pageEntriesOptions.label}</option>

                                ))}
                            </select>
                        </span>
                    </span>
                </div>
                <div className={`col-sm-6 pagination_id ${data.length === 0 ? 'd-none' : 'display'}`}>
                    <span className="exports">
                        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoPdf()}>PDF<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoExcel()}>EXCEL<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exportToCSV()}>CSV<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => exporttoJSON()}>JSON<FiDownload className="erp-download-icon-btn" /></MDButton> &nbsp;
                    </span>
                </div>
            </div >

            {data.length !== 0 ? <>
                <Datatable data={data} columns={columns} />

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
                    activeClassName={"active"} /></> : null
            }

            {/* Add Document Form */}
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{docFormHeading}</Accordion.Header>
                    <Accordion.Body>
                        <form id="docFormId">
                            <div className="row">
                                <div className="col-sm-6">

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Document Group<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id="document_group_id" className="erp_input_field" value={document_group} readOnly optional='optional' />
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Document Name<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id="documentName_id" value={documentName} className="erp_input_field" onChange={e => { setDocumentName(e.target.value); validateDocFormFields() }} maxLength="255" disabled={docViewUpdateKey === 'update'} />
                                            <MDTypography variant="button" id="error_documentName_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Registration No</Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" id="documentRegistrationNoId" className="erp_input_field" value={documentRegistrationNo} onChange={e => { setDocumentRegistrationNo(e.target.value); validateDocFormFields() }} maxLength="200" optional='optional' />
                                            <MDTypography variant="button" id="error_documentRegistrationNoId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Registration Date</Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control type="date" id="docregistrationDateId" className="erp_input_field" value={documentRegistrationDate} onChange={e => { setDocumentRegistrationDate(e.target.value); validateDocFormFields() }} optional='optional' />
                                            <MDTypography variant="button" id="error_docregistrationDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>

                                    </div>



                                </div>

                                <div className="col-sm-6">

                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Renewal Date</Form.Label>

                                        </div>
                                        <div className="col">
                                            <Form.Control type="date" id="docrenewalDateId" className="erp_input_field" value={documentRenewalDate} onChange={e => { setDocumentRenewalDate(e.target.value); validateDocFormFields() }} optional='optional' />
                                            <MDTypography variant="button" id="error_docrenewalDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>

                                    </div>

                                    <div className={`row ${docViewUpdateKey === 'view' ? 'd-none' : 'display'}`} id="docUploadId">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Document Upload<span className="required">*</span></Form.Label>

                                        </div>
                                        <div className="col">
                                            <Form.Control type="file" id="document" className="erp_input_field" onChange={handleFileChange} />
                                            <MDTypography variant="button" id="error_document" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                            </MDTypography>
                                        </div>

                                    </div>

                                    <div className={`row ${docViewUpdateKey === 'view' || docViewUpdateKey === 'update' ? 'display' : 'd-none'}`} >
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Document</Form.Label>

                                        </div>
                                        <div className="col">
                                            <MDTypography component="label" className="erp-form-label" variant="button" id="logoFile" fontWeight="regular" color="info" >
                                                <Link to="#" onClick={fetchDocument}>
                                                    {file_name}
                                                </Link>
                                            </MDTypography>
                                        </div>

                                    </div>



                                    <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Remark</Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form.Control as="textarea" id="docremarkId" rows={1} className="erp_txt_area" value={remark} onChange={e => { setRemark(e.target.value); validateDocFormFields() }} maxlength="255" optional='optional' />
                                            <MDTypography variant="button" id="error_docremarkId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                            </MDTypography>
                                        </div>

                                    </div>

                                    {/* <div className="row">
                                        <div className="col-sm-4">
                                            <Form.Label className="erp-form-label">Document Active<span className="required">*</span></Form.Label>
                                        </div>
                                        <div className="col">
                                            <Form>
                                                <div className="erp_form_radio">
                                                    <div className="fCheck">
                                                        <Form.Check
                                                            className="erp_radio_button"
                                                            label="Yes"
                                                            type="radio"
                                                            value="true"
                                                            name="isDocumentActive"
                                                            checked={is_active === true} onClick={() => { setIsActive(true); }}
                                                            disabled={docViewUpdateKey === 'view'}
                                                        />
                                                    </div>
                                                    <div className="sCheck">
                                                        <Form.Check
                                                            className="erp_radio_button"
                                                            label="No"
                                                            value="false"
                                                            type="radio"
                                                            name="isDocumentActive"
                                                            checked={is_active === false} onClick={() => { setIsActive(false); }}
                                                            disabled={docViewUpdateKey === 'view'}


                                                        />
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>

                                    </div> */}
                                </div>

                            </div>
                        </form>
                        <div className="text-center">
                            <MDButton
                                type="button" onClick={addDocument}
                                className="erp-gb-button" variant="button" disabled={docViewUpdateKey === 'view' ? true : false}>
                                save
                            </MDButton>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>



            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, docSuccMsg]} />

            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


            {/* Delete Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={handleClose}></button></span>
                <Modal.Body className='text-center'>
                    <span className='erp_modal_delete_icon'><RxCrossCircled /></span>
                    <h6>Do you wish to delete this record ?</h6>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="success" className='btn erp-gb-button' onClick={handleClose}>
                        Cancel
                    </Button>&nbsp;
                    <Button variant="danger" className='btn erp-gb-button' onClick={deleteDocument}>Delete</Button>
                </Modal.Footer>

            </Modal>



        </>
    );
}

export default Document;
