import React, { useRef, useState, useEffect } from "react";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css' // important: this line must be placed after react-table css import

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const Datatable = ({ data, columns, freezeColumnCount = 3, stateValue, showTotals = false }) => {
    const tableRef = useRef(null);
    const [isTabletSize, setIsTabletSize] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsTabletSize(window.innerWidth <= 768); // Adjust this value based on your tablet breakpoint
        };
        handleResize(); // Check on initial render
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let modifiedColumns = columns.map((column, index) => {
        const isFrozenColumn = columns.length > 11 && index <= freezeColumnCount;
        const isFirstColumn = index === 0;
        const isFewColumns = columns.length < 11;

        const modifiedColumn = {
            ...column,
            Header: column.Headers, // Assuming this is a typo, should be 'Header' not 'Headers'
            Cell: row => {
                if (index === 0 && row.index === data.length - 1 && showTotals) {
                    return <span style={{ color: 'black', fontWeight: 'bold', padding: '5px', }}>Totals:</span>;
                }
                else if (column.Cell) {
                    return column.Cell(row);
                } else {
                    return row.value === 0 ? '0' : row.value || null
                }
                // return column.Cell ? column.Cell(row) : (row.original[column.accessor] || null);
            },
            width: column.width ? column.width : isFirstColumn ? 70 : (isFewColumns ? undefined : 150),
            minWidth: isFewColumns ? (2000 / columns.length - 1) : undefined,
            fixed: isTabletSize ? undefined : (isFrozenColumn ? 'left' : undefined),
            className: isFrozenColumn && index === freezeColumnCount ? 'last-frozen-column' : undefined
        };
        return modifiedColumn;
    });

    let modifiedData = [...data];

    return (
        <>
            <ReactTableFixedColumns
                ref={tableRef}
                className="erp_table -striped -highlight" // Apply your custom class to the ReactTable component
                data={modifiedData.flat()}
                columns={modifiedColumns}
                style={{ maxHeight: '500px', overflowY: 'auto' }}
                pageSize={data.length}
                defaultPageSize={data.length}   // If pagination enable then set default record size per page.
                showPagination={false} // Disable pagination
                resizable={true} // Disable column resizing if needed
                sortable={true} // Disable column sorting if needed

                // *** For Access the Table Props    // Apply props to the table
                getTableProps={(state, rowInfo, column, instance) => ({
                    className: 'erp_table', // Apply custom table class
                })}
                // *** For Access the Table Heads Props  // Apply props to the thead element
                getTheadProps={(state, rowInfo, column, instance) => ({
                    className: '', // Apply custom thead class
                })}
                // *** For Access the Table Heads's Column Props // Apply props to the th elements in the thead
                getTheadThProps={(state, rowInfo, column, instance) => ({
                    className: 'erp_table_th text-dark text-start', // Apply custom th class
                    style: {
                        color: 'black', // Set the text color of header columns
                        fontWeight: 'bold', // Make the text bold
                        padding: '5px',
                    },
                })}
                // *** For Access the Table Body's rows Props   // Apply props to the tr elements
                // getTrProps={(state, rowInfo, column, instance) => ({
                //     className: '', // Apply custom tr class
                // })}
                // For Row (tr) Props - conditionally apply class
                getTrProps={(state, rowInfo, column, instance) => {
                    // Check if indent_priority_desc is 'High-Priority'
                    const isHighPriority = rowInfo &&  rowInfo.original && 
                       rowInfo.original.indent_priority_desc === 'High-Priority' && 
                      ((rowInfo.original.grn_status !== undefined && rowInfo.original.grn_status !== 'G') || 
                      (rowInfo.original.grn_item_status !== undefined && rowInfo.original.grn_item_status !== 'G')) && 
                      
                      ((rowInfo.original.indent_status !== undefined && rowInfo.original.indent_status !== 'X') || 
                      (rowInfo.original.indent_item_status !== undefined && rowInfo.original.indent_item_status !== 'X'))&& 

                      ((rowInfo.original.indent_status !== undefined && rowInfo.original.indent_status !== 'R') || 
                      (rowInfo.original.indent_item_status !== undefined && rowInfo.original.indent_item_status !== 'R'))&& 

                      ((rowInfo.original.indent_status !== undefined && rowInfo.original.indent_status !== 'Z') || 
                      (rowInfo.original.indent_item_status !== undefined && rowInfo.original.indent_item_status !== 'Z'));

                    return {
                        className: isHighPriority ? 'highlightHighPriorityTr' : '', // Conditionally apply class
                    };
                }}
                // *** For Access the Table Body's rows's Column Props  // Apply props to the td elements
                // getTdProps={(state, rowInfo, column, instance) => ({
                //     className: 'erp_table_td table-cell', // Apply custom td class
                //     style: {
                //         color: 'black', // Set the text color of header columns
                //         padding: '5px',
                //         borderRight: rowInfo && rowInfo.index === freezeColumnCount ? '1px solid #ccc' : 'none',
                //         transition: 'all .2s ease-out',
                //     },
                //     title: rowInfo ? rowInfo.row[column.accessor] : null, // Set the title to the cell content
                // })}
                // handleTdClick({row: row}, column)

                getTdProps={(state, rowInfo, column, instance) => {
                    // const isHighPriority = column.Header == "Priority" && rowInfo && rowInfo.original && rowInfo.original.indent_priority_desc === 'High-Priority'  && rowInfo.original.grn_status !== 'G';
                    return {
                        onClick: (e, handleOriginal) => {
                            if (handleOriginal) {
                                handleOriginal();
                            }
                        },
                    
                        // Apply props to the td elements
                        // className: `erp_table_td text-dark  table-cell ${isHighPriority ? 'badge badge-danger' : ''}`, // Apply custom td class ,
                        className: `erp_table_td text-dark  table-cell`, // Apply custom td class ,

                        style: {
                            color: 'black', // Set the text color of header columns
                            padding: '5px',
                            borderRight: rowInfo && rowInfo.index === freezeColumnCount ? '1px solid #ccc !important' : 'none',
                        },
                    }
                }}

            />
        </>
    )
}

export const DatatableWithId = ({ data, columns, tableId }) => {
    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     rows,
    //     prepareRow
    // } = useTable({
    //     columns,
    //     data
    // })

    return (
        <>
            {/* <Table className="erp_table" id={tableId} responsive bordered striped  {...getTableProps()}>
                <thead className="erp_table_head">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th className="erp_table_th" {...column.getHeaderProps()}>{column.render('Headers')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row)

                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td className="erp_table_td" {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table> */}
        </>
    )
}

// Custom Tooltip Component
export const Tooltip = ({ content }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            style={{ position: 'relative', display: 'inline-block' }}
        >
            <span>{content}</span>
            {show && <div style={{ position: 'absolute', backgroundColor: 'white', padding: '5px', border: '1px solid black' }}>{content}</div>}
        </div>
    );
};

// Custom Cell Renderer with Tooltip
export const CustomCellRenderer = ({ value }) => {
    return <Tooltip content={value} />;
};
export default Datatable


// // ********** this modified columns working properly above code will be optimized and below block is un-optimized.
// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,
//         width: (index === 0) ? 70 : (columns.length < 8 ? 2000 / columns.length : 150),
//         Header: column.Headers,
//         Cell: row => {
//             if (index === 0 && row.index === data.length - 1 && showTotals) {
//                 return <span style={{ color: 'black', fontWeight: 'bold', padding: '5px', }}>Totals:</span>;
//             } else {
//                 return column.Cell ? column.Cell(row) : (row.original[column.accessor] || null);
//             }
//         }
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) {
//         modifiedColumn.fixed = 'left';
//         if (index === freezeColumnCount) {
//             modifiedColumn.className = 'last-frozen-column';
//         }
//     }
//     if(columns.length < 8 && index !== 0){
//         modifiedColumn.minWidth = 2000 / columns.length - 1
//         modifiedColumn.width = undefined
//     }
//     return modifiedColumn;
// });



// For call the function on td click
// getTdProps={(state, rowInfo, column, instance) => {
//     return {
//         onClick: (e, handleOriginal) => {
//             console.log('A Td Element was clicked!')
//             console.log('it produced this event:', e)
//             console.log('It was in this column:', column)
//             console.log('It was in this row:', rowInfo)
//             console.log('It was in this table instance:', instance)
//         },
//         // Apply props to the td elements
//         className: 'erp_table_td text-dark', // Apply custom td class
//         style: {
//             color: 'black', // Set the text color of header columns
//             padding: '5px',
//             borderRight: rowInfo && rowInfo.index === freezeColumnCount ? '1px solid #ccc' : 'none',
//             transition: 'all .2s ease-out',
//         },
//     }
// }}



// *** Rough code;
// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,  // Copy all properties from the original column
//         width: 150,
//         Header: column.Headers
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) { modifiedColumn.fixed = 'left'; }
//     if (columns.length < 8) {
//         modifiedColumn.width = 2000 / columns.length;
//     }
//     if (index === 0) { modifiedColumn.width = 70; }
//     return modifiedColumn;
// });

// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,
//         width: (index === 0) ? 70 : (columns.length < 8 ? 2000 / columns.length : 150),
//         Header: column.Headers
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) {
//         modifiedColumn.fixed = 'left';
//     }
//     return modifiedColumn;
// });

// // Working but showing only Totals not showing icons.
// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,
//         width: (index === 0) ? 70 : (columns.length < 8 ? 2000 / columns.length : 150),
//         Header: column.Headers,
//         Cell: row => {
//             if (index === 0 && row.index === data.length - 1) {
//                 return <span>Total</span>;
//             } else {
//                 return <>{row.original[column.accessor] || null}</>; // Render content directly without wrapping div
//             }
//         }
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) {
//         modifiedColumn.fixed = 'left';
//     }
//     return modifiedColumn;
// });

// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,
//         width: (index === 0) ? 70 : (columns.length < 8 ? 2000 / columns.length : 150),
//         Header: column.Headers,
//         Cell: row => {
//             if (index === 0) {
//                 if (typeof column.Cell === 'function') {
//                     // If Cell is a function, execute it passing row as argument
//                     return column.Cell(row);
//                 } else {
//                     // If Cell is not a function, render the default content
//                     if (row.index === data.length - 1) {
//                         return <span>Total</span>;
//                     } else {
//                         return <span>other col</span>;
//                     }
//                 }
//             } else {
//                 // Render other cells as they were
//                 return row.original[column.accessor] || null; // Return null if the cell content is undefined
//             }
//         }
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) {
//         modifiedColumn.fixed = 'left';
//     }
//     return modifiedColumn;
// });


// let modifiedColumns = columns.map((column, index) => {
//     const modifiedColumn = {
//         ...column,
//         width: (index === 0) ? 70 : (columns.length < 8 ? 2000 / columns.length : 150),
//         Header: column.Headers,
//         // Cell: (index === 0 && typeof column.Cell === 'function')
//         //     ? column.Cell // Use the provided Cell function if it exists
//         //     : (row) => {
//         //         if (index === 0 && row.index === data.length - 1) {
//         //             return <span>Total</span>;
//         //         } else if (index === 0) {
//         //             return <span>other col</span>;
//         //         } else {
//         //             // Render other cells as they were
//         //             return row.original[column.accessor] || null; // Return null if the cell content is undefined
//         //         }
//         //     }
//     };
//     if (columns.length > 8 && index <= freezeColumnCount) {
//         modifiedColumn.fixed = 'left';
//     }
//     return modifiedColumn;
// });