import React from 'react'
import { useTable } from 'react-table'

// React Bootstrap imports
import { Table } from "react-bootstrap"

const FrmMBankList = ({ data, columns }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    })


    return (
        <>
            <Table className='erp_table' responsive bordered  {...getTableProps()}>
                <thead className='erp_table_head'>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th className='erp_table_th' {...column.getHeaderProps()}>{column.render('Headers')}</th>
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
                                        <td className='erp_table_td' {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>

            </Table>

        </>
    )
}

export default FrmMBankList
