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
  color:'black'
};

const HelpCenter = () => {
  return (
    <DashboardLayout>
      <StyledPaper>
        <MDTypography variant="h4" component="h1" gutterBottom>
          Help Center
        </MDTypography>
        <MDTypography variant="h6" component="h2" gutterBottom>
          Steps to Process Monthly Employee Attendance:
        </MDTypography>
        <List component="ol">
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="1. Navigate to Daily Shift Management:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the "HR Payroll" menu in the menubar.</li>
                  <li style={darkListItemStyle}>From the dropdown, select "Attendance."</li>
                  <li style={darkListItemStyle}>Under "Attendance," click on "Daily Shift Management."</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="2. Process Daily Shift Attendance:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Select Employee Type:
                    <ul>
                      <li style={darkListItemStyle}>Choose the relevant employee type (e.g., Staff, Worker) for which you want to process attendance.</li>
                    </ul>
                  </li>
                  <li style={darkListItemStyle}>Select Attendance Date:
                    <ul>
                      <li style={darkListItemStyle}>Enter the date for which you want to process the attendance. This is a mandatory field.</li>
                    </ul>
                  </li>
                  <li style={darkListItemStyle}>Optional Filters:
                    <ul>
                      <li style={darkListItemStyle}>Department: Filter the attendance data by selecting a specific department.</li>
                      <li style={darkListItemStyle}>Sub-Department: Further refine the data by choosing a sub-department.</li>
                      <li style={darkListItemStyle}>Shift: Select a shift if necessary.</li>
                      <li style={darkListItemStyle}>Note: While Department, Sub-Department, and Shift are optional, selecting the Employee Type and Attendance Date is required to proceed.</li>
                    </ul>
                  </li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="3. Show Attendance Data:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Click the "Show" button to display the employee's punching details based on your selected criteria.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="4. Review Employee Punching Details:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>The system will display the following details:
                    <ul>
                      <li style={darkListItemStyle}>In Time & Out Time: The times when the employee clocked in and out.</li>
                      <li style={darkListItemStyle}>Worked Hours: The total hours worked.</li>
                      <li style={darkListItemStyle}>Present Status: Indicates whether the employee was present, absent, or on half-day leave.</li>
                      <li style={darkListItemStyle}>Job Code: Applicable only to workers (not relevant for staff).</li>
                    </ul>
                  </li>
                  <li style={darkListItemStyle}>Extra Remark: Displays "L" for Late Mark or "E" for Early Leave.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="5. Attendance Correction:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>If an employee has missed a punch or is marked absent but should not be, you can correct it directly.</li>
                  <li style={darkListItemStyle}>In the "In Time" and "Out Time" columns, you will see a time selection box where you can adjust the times as needed.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="6. Save Processed Attendance:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>After reviewing and making any necessary corrections to the punching details, click the "Save" button at the bottom of the page.</li>
                  <li style={darkListItemStyle}>This will finalize and process the attendance for the selected Employee Type and Attendance Date.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>Note: You need to perform this process daily for both the Staff and Workers in the company to be able to accurately track and review the monthly attendance of employees.</ListItem>
        </List>
      </StyledPaper>
    </DashboardLayout>
  );
};

export default HelpCenter;
