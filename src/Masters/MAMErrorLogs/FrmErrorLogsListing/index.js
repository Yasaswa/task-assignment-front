import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';


// Material Dashboard 2 PRO React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Datatable from 'components/DataTable'
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

// Bootstrap Imports
import Form from 'react-bootstrap/Form';
import ConfigConstants from 'assets/Constants/config-constant';

function FrmErrorLogsListing() {
    const configConstants = ConfigConstants();
    const { COMPANY_ID } = configConstants;

    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    // Pagination Variables 
    const pageEntriesOptions = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "50", value: 50 },
        { label: "100", value: 100 },
        { label: "500", value: 500 },
    ]

    const [entriesPerPage, setEntriesPerPage] = useState(pageEntriesOptions[0].value);
    const [pageCount, setpageCount] = useState(0);
    const [pageCurrent, setcurrentPage] = useState(0);

    useEffect(() => {
        FnShowErrorLogRecords(pageCurrent, entriesPerPage)
    }, [pageCurrent, entriesPerPage])

    const FnShowErrorLogRecords = async (page, size) => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/AmApplicationErrorLogs/FnShowAllActiveRecords/${COMPANY_ID}?page=${page}&size=${size}`)
            const response = await apiCall.json();
            const total = response.totalElements;
            setpageCount(Math.ceil(total / size));
            const columns = Object.keys(response.content[0]);
            const tempColumns = columns
                .filter(column => !column.includes('_by') && !column.includes('_on') && !column.includes('is_'))
                .map(column => ({ Headers: column, accessor: column }));
            setColumns(tempColumns)
            setData(response.content)


        } catch (error) {
            console.log("error: ", error);
        }

    }

    const handlePageClick = async (pageNo) => {
        setcurrentPage(pageNo.selected);
    }

    const handlePageCountClick = async () => {
        var count = document.getElementById("page_entries_id").value;
        setEntriesPerPage(count)
        setcurrentPage(0)
    }
    return (
        <>
            <DashboardLayout>
                <div className="row btn_row_class">
                    <div className="col-sm-8" >
                        <MDButton class="btn erp-gb-button" variant="button" fontWeight="regular" onClick={() => FnShowErrorLogRecords(pageCurrent, entriesPerPage)}>Refresh</MDButton> &nbsp;
                        <span className="page_entries">
                            <MDTypography component="label" variant="button" className="erp-form-label-md">Entries per page</MDTypography>

                            <Form.Select onChange={handlePageCountClick} className="erp_page_select erp_form_control" id="page_entries_id" >
                                {pageEntriesOptions.map(pageEntriesOptions => (
                                    <option value={pageEntriesOptions.value}>{pageEntriesOptions.label}</option>

                                ))}
                            </Form.Select>
                        </span>
                    </div>
                </div>
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
                    activeClassName={"active"} />
            </DashboardLayout>
        </>
    )
}

export default FrmErrorLogsListing
