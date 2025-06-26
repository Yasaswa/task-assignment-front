import React from "react";
import { Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
}));

const darkListItemStyle = {
    color: 'black'
};

const WeavingHelp = () => {

    return (
        <DashboardLayout>
            <StyledPaper>
                <MDTypography variant="h4" component="h1" gutterBottom>
                    Steps to create Entry for Weaving.
                </MDTypography>

                <List component="ol">
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="1. Navigate to Beam (Loading / Un-Loading)."
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Production' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Weaving'</li>
                                    <li style={darkListItemStyle}>Under  'Weaving' click on  'Beam (Loading / Un-Loading)'</li>
                                    <li style={darkListItemStyle}>Select Set No, Beam No. , Loom No , Process Type.</li>
                                </ul>
                            }
                        />
                    </ListItem>
                    <MDTypography variant="h6" component="h2" gutterBottom>Note :- After save you can do Cut-beam and empty for particular saved Entry.</MDTypography>


                    <Divider />
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="2. Navigate to Loom Production."
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Production' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Weaving'.</li>
                                    <li style={darkListItemStyle}>Under  'Weaving' click on  'Loom Production'.</li>
                                    <li style={darkListItemStyle}>Import Toyota machine Excel file Shift wise.</li>
                                    <li style={darkListItemStyle}>Select Machine Operator name and save..</li>
                                </ul>
                            }
                        />
                    </ListItem>
                    <MDTypography variant="h6" component="h2" gutterBottom>Note :- Once one excel is imported and saved same file will not import again.</MDTypography>


                    <Divider />
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="3.Navigate to Inspection."
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Production' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Weaving'.</li>
                                    <li style={darkListItemStyle}>Under  'Weaving' click on  'Weaving Inspection'.</li>
                                    <li style={darkListItemStyle}>Select Set No which loom production is done. , Book Type,.</li>
                                    <li style={darkListItemStyle}>In Details select Sort No, Beam No , Enter Inputs.</li>
                                </ul>
                            }
                        />
                    </ListItem>
                    <MDTypography variant="h6" component="h2" gutterBottom>Note :- After Approve the Inspection Record Particular Product Stock Will be Increased.</MDTypography>


                    <Divider />
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="5.Navigate to Dispatch Challan Fabric."
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Sales' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Dipatch Challan'.</li>
                                    <li style={darkListItemStyle}>Under  'Dipatch Challan' click on  'Dipatch Challan(Fabric)'</li>
                                    <li style={darkListItemStyle}>Select Customer Name and Customer Order No's.</li>
                                    <li style={darkListItemStyle}>Enter Dipatch Quantity and Dipatch Weight in Dispatch Challan Details</li>
                                    <li style={darkListItemStyle}>In Inspection Details select Roll No.</li>
                                </ul>
                            }
                        />
                    </ListItem>
                    <MDTypography variant="h6" component="h2" gutterBottom>Note :- After Approve the Dispatch Challan Fabric Record, It will be Dispatched.</MDTypography>


                    <Divider />
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="5.Navigate to Fabric Production Stock Report(Rolls Wise)."
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Registers' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Stock Registers'.</li>
                                    <li style={darkListItemStyle}>Under  'Stock Registers' click on  'Fabric Production Stock Report'</li>
                                    <li style={darkListItemStyle}>Select Date Range From & To Click On Show Data.</li>
                                    <li style={darkListItemStyle}>Filters Like Set No , Sort No , Roll No.</li>
                                    <li style={darkListItemStyle}>You Can Select Limited Column as shown there.</li>
                                </ul>
                            }
                        />
                    </ListItem>

                    <Divider />
                    <ListItem style={darkListItemStyle}>
                        <ListItemText
                            primary="6.Navigate to Fabric Stock Report(Sort Wise):"
                            primaryTypographyProps={{ style: { color: "black" } }}
                            secondary={
                                <ul>
                                    <li style={darkListItemStyle}>Go to the  'Registers' menu in the menu-bar.</li>
                                    <li style={darkListItemStyle}>From the dropdown, select  'Stock Registers'.</li>
                                    <li style={darkListItemStyle}>Under  'Stock Registers' click on  'Fabric Stock Report'.</li>
                                    <li style={darkListItemStyle}>Select Date Range From & To Click On Show Data.</li>
                                    <li style={darkListItemStyle}>Filters Sort No.</li>
                                </ul>
                            }
                        />
                    </ListItem>
                </List>
            </StyledPaper>

        </DashboardLayout>
    );

}

export default WeavingHelp