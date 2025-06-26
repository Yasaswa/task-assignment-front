import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { List, ListItem, ListItemText, Divider, Typography, } from "@mui/material";

function ScrollDialog({ isOpen, bdayEmployees = [], overdueSalesOrders = [], handleCloseDialog, setSelEmployeeData, handleOpenBdayModal }) {
    const descriptionElementRef = useRef(null);
    const dialogRef = useRef(null);
    const [isOverduePopupOpen, setIsOverduePopupOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [isOpen]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                handleCloseDialog();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleCloseDialog]);

    return (
        isOpen && (
            <div
                ref={dialogRef}
                style={{
                    position: "absolute",
                    top: "35px",
                    right: "30px",
                    backgroundColor: "white",
                    width: "270px",
                    overflowY: "scroll",
                    maxHeight: "250px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    borderRadius: "5px",
                    scrollbarWidth: "thin",
                }}
            >
                {/* Close button */}
                <button
                    type="button"
                    className="erp-modal-close btn-close"
                    aria-label="Close"
                    onClick={handleCloseDialog}
                    style={{ position: "absolute", top: "10px", right: "10px" }}
                ></button>

                {/* Title */}
                <h6 style={{ margin: "15px 16px", color: '#831657', fontWeight: "700", fontSize: "12px" }}>
                    Activity
                </h6>
                <hr style={{ margin: "8px 16px" }} />

                {/* Employee Birthday List */}
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {bdayEmployees.map((emp, i) => (
                        <React.Fragment key={i}>
                            <ListItem
                                alignItems="flex-start"
                                style={{
                                    lineHeight: "5px",
                                    cursor: "pointer",
                                    padding: "10px 15px",
                                    borderRadius: "0.5rem",
                                    transition: "background-color 0.3s ease",
                                }}
                                onClick={() => {
                                    setSelEmployeeData(emp);
                                    handleOpenBdayModal();
                                    handleCloseDialog();
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(67, 67, 67, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <ListItemText
                                    primary={emp.employee_name}
                                    secondary={
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                color: "#831657",
                                                fontWeight: "400",
                                                fontSize: "11px",
                                            }}
                                        >
                                            It's their Birthday! Wish them happy birthday!
                                        </Typography>
                                    }
                                    primaryTypographyProps={{
                                        sx: { color: "#333333", fontSize: "12px", fontWeight: "500" },
                                    }}
                                />
                            </ListItem>
                            {i < bdayEmployees.length - 1 && <Divider style={{ margin: "2px" }} variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
                {overdueSalesOrders.length > 0 && (
                    <div
                        style={{
                            margin: "15px 16px",
                            color: "#d32f2f",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                        onClick={() => setIsOverduePopupOpen(true)}  // Open popup on click
                        title="Click to see all overdue sales orders"
                    >
                        Overdue Sales Orders ({overdueSalesOrders.length})
                    </div>
                )}

                {/* Overdue Sales Orders List */}

                {isOverduePopupOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 2000,
                        }}
                        onClick={() => setIsOverduePopupOpen(false)} // close on background click
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "6px",
                                width: "350px",
                                maxHeight: "400px",
                                overflowY: "auto",
                                padding: "20px",
                                position: "relative",
                            }}
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup
                        >
                            <button
                                style={{
                                    position: "absolute",
                                    top: "-2px",
                                    right: "10px",
                                    cursor: "pointer",
                                    background: "transparent",
                                    border: "none",
                                    // fontSize: "16px",
                                    // fontWeight: "bold",
                                    margin: "15px 16px", color: '#831657', fontWeight: "700", fontSize: "30px"
                                }}
                                onClick={() => setIsOverduePopupOpen(false)}
                                aria-label="Close overdue sales order list"
                            >
                                &times;
                            </button>

                            <h4 style={{ marginBottom: "10px", color: "#d32f2f" }}>
                                Overdue Sales Orders
                            </h4>

                            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                                {overdueSalesOrders.map((order, i) => (
                                    <React.Fragment key={i}>
                                        <ListItem
                                            alignItems="flex-start"
                                            style={{
                                                cursor: "pointer",
                                                padding: "10px 15px",
                                                borderRadius: "0.5rem",
                                                transition: "background-color 0.3s ease",
                                                color: "#b71c1c",
                                            }}
                                            onClick={() => {
                                                console.log("Clicked overdue order:", order.sales_order_no);
                                                navigate("/Transactions/TSalesOrder/SalesOrderEntry", {
                                                    state: {
                                                        idList: order, keyForViewUpdate: 'view', compType: 'Transactions',
                                                        requestfor: order.sales_order_type_id ? order.sales_order_type_id === 9 ? "GF" : "SB" : "SB",
                                                        deletionKey: false, modules_forms_id: 285
                                                    }
                                                })

                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "rgba(183, 28, 28, 0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }}
                                        >
                                            <ListItemText
                                                primary={`Order No: ${order.sales_order_no}`}
                                                secondary={`Order Date: ${order.sales_order_date}`}
                                                primaryTypographyProps={{
                                                    sx: { fontSize: "13px", fontWeight: "600" },
                                                }}
                                                secondaryTypographyProps={{
                                                    sx: { fontSize: "12px", fontWeight: "500" },
                                                }}
                                            />
                                        </ListItem>
                                        {i < overdueSalesOrders.length - 1 && (
                                            <Divider style={{ margin: "2px" }} variant="inset" component="li" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </div>
                    </div>
                )}

            </div>

        )
    );
}

export default ScrollDialog;
