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

const WeavingSizingHelp = () => {
  return (
    <DashboardLayout>
      <StyledPaper>
        <MDTypography variant="h4" component="h1" gutterBottom>
        Steps For Job Work / Sales Purchase Sizing.
        </MDTypography>

        <List component="ol">
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="1. Navigate to Sales Order (Sized Yarn):"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Sales' -&gt; 'Sales Order' -&gt; 'Sales Order (Sized Yarn)'.</li>
                  <li style={darkListItemStyle}>Select Job Type, Customer, Department and Sub-Department.</li>
                  <li style={darkListItemStyle}>Search for Material, fill details and Save.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="2. Navigate to Purchase Order(Raw Material):"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Purchase Order' -&gt; 'Purchase Order(Raw Material)'.</li>
                  <li style={darkListItemStyle}>Select Supplier , Material, fill details and save.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="3. Navigate to Goods Receipt Note(Raw Material):"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase'  -&gt; 'Goods Receipt Note' -&gt; 'Goods Receipt Note(Raw Material)'.</li>
                  <li style={darkListItemStyle}>Select the supplier of the particular PO, select PO No., QA by, Material (Total boxes, Weight, Cones, Weight/Cone), fill in the details, and save.</li>
                  <li style={darkListItemStyle}>After Approval only stock will Increased.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="4. Navigate to Raw Material Stock Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Raw Material Stock Report'.</li>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Yarn Closing Balance Report'.</li>
                  <li style={darkListItemStyle}>Filter by Date, Count (Material).</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="5. Navigate to Yarn Closing Balance Report:"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Yarn Closing Balance Report'.</li>
                  <li style={darkListItemStyle}>Filter by Date, Count (Material).</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="6. Navigate to Beam Inwards (Customer Beams for Sized Yarn)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Beam Inwards'.</li>
                  <li style={darkListItemStyle}>Select Customer, Beam Type. Enter Beam Width and Tare Weight.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="7. Navigate to Warping Production Plan."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Warping Production Plan'.</li>
                  <li style={darkListItemStyle}>Select Product Type - 'Sized Yarn', Select Customer, Customer Order No.</li>
                  <li style={darkListItemStyle}>Select Product. Enter Total Ends, Creels, Schedule Mtr.</li>
                  <li style={darkListItemStyle}>Then Click On 'Add Materials', Search Material Name.</li>
                  <li style={darkListItemStyle}>Against Supplier Name and Lot No., enter the number of cones and click 'OK'</li>
                  <li style={darkListItemStyle}>In Creel Details, enter Cone/Creel and Beam/Creel. Click 'Save'.</li>
                  <li style={darkListItemStyle}>Approve Plan.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>
          Note :- Without Approve Plan it will not Auto generate Yarn Requisition.
        </MDTypography>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="8. Navigate to Yarn Requisition Slip."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Requisition' -&gt; 'Yarn Requisition Slip'</li>
                  <li style={darkListItemStyle}>If you want to edit the requisition, click on Edit or click on the Approve icon and approve.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note: Only after approval will it be displayed to the Commercial Dept.</MDTypography>
            <ListItem style={darkListItemStyle}></ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="9. Navigate to Yarn Issue Slip (For Commercial Use Only):"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Yarn Issue Slip'.</li>
                  <li style={darkListItemStyle}>Click on Issue Icon and Issue in form.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note: The Material Issue Listing will only include approved requisitions by materials.</MDTypography>
            <ListItem style={darkListItemStyle}></ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="10. Navigate to Warping Production."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Warping Production'.</li>
                  <li style={darkListItemStyle}>Select Set No , Enter Production Details also Enter Bottom Details & Save. </li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="11. Navigate to Sizing Production."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the  menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Sizing Production'.</li>
                  <li style={darkListItemStyle}>Select Set No and Fill Production Details Fields.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note: After saving, the Sized Beam Stock will increase.</MDTypography>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="12. Navigate to Sized Beam Stock Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Sized Beam Stock Report'.</li>
                  <li style={darkListItemStyle}>Filter by Custom Date, Job Type, Beam Status, Set No, Beam No.</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="13. Navigate to Beam Inwards (Customer Beams for Sized Yarn)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Production Register' -&gt; 'Sizing Reconciliation Report'.</li>
                  <li style={darkListItemStyle}>Select Set No.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="14. Navigate to Warping Bottom Return (For Commercial Use Only)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Warping Bottom Return'.</li>
                  <li style={darkListItemStyle}>Click on Receive Icon check details and Click on Receive.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note: Only after receiving will the bottom be shown in RM Bottom Godown.</MDTypography>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="15. Navigate to Sizing Production."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the  menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Sizing Production'.</li>
                  <li style={darkListItemStyle}>Select Set No and Fill Production Details Fields.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note:- After save Sized Beam Stock Will Increased.</MDTypography>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="16. Navigate to Sized Beam Stock Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Sized Beam Stock Report'.</li>
                  <li style={darkListItemStyle}>Filter by Custom Date, Job Type, Beam Status, Set No, Beam No.</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="17. Navigate to Sizing Reconciliation Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Production Register' -&gt; 'Sizing Reconciliation Report'.</li>
                  <li style={darkListItemStyle}>Select Set No.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="18. Dispatch Challan (Sized Yarn)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Sales' -&gt; 'Dispatch Challan' -&gt; 'Dispatch Challan (Sized Yarn).</li>
                  <li style={darkListItemStyle}>Select Job Type, Set No., select the beams to be dispatched, fill in the details, and save.</li>
                </ul>
              }
            />
          </ListItem>
          <MDTypography variant="h6" component="h2" gutterBottom>Note :- After Approval Only Sized Beams Stock Decrease.</MDTypography>
        </List>
      </StyledPaper>
      <StyledPaper>
      <MDTypography variant="h4" component="h1" gutterBottom>
      Steps For In-House Sizing.
        </MDTypography>
      <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="1. Navigate to Finish Goods (Sort/Products)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Master' -&gt; 'Product' -&gt; 'Product Finish Goods'.</li>
                  <li style={darkListItemStyle}>Fill details and Save.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="2. Navigate to Raw Material."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Master' -&gt; 'Product' -&gt; 'Raw Material'.</li>
                  <li style={darkListItemStyle}>Fill details and Save.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="3. Navigate to Sales Order (Greige Fabric)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Sales' -&gt; 'Sales Order' -&gt; 'Sales Order (Greige Yarn)'.</li>
                  <li style={darkListItemStyle}>Select Job Type, Customer, Department and Sub-Department.</li>
                  <li style={darkListItemStyle}>Search for Product(Sort No), fill details and Save.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="4. Navigate to Purchase Order(Raw Material) (For Commercial Use Only)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Purchase Order' -&gt; 'Purchase Order(Raw Material)'.</li>
                  <li style={darkListItemStyle}>Select Supplier, Material, fill details and save.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="5. Navigate to Goods Receipt Note(Raw Material) (For Commercial Use Only)."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Goods Receipt Note' -&gt; 'Goods Receipt Note(Raw Material)'.</li>
                  <li style={darkListItemStyle}>Select Supplier of particular PO, select PO no, QA by, Material (Total boxes, Weight, Cones, Weight/Cone), fill details and save.</li>
                  <li style={darkListItemStyle}>After Approval only stock will Increase.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="6. Navigate to Raw Material Stock Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Raw Material Stock Report'.</li>
                  <li style={darkListItemStyle}>Filter by Date, Count (Material).</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="7. Navigate to Yarn Closing Balance Report."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Yarn Closing Balance Report'.</li>
                  <li style={darkListItemStyle}>Filter by Date, Count (Material).</li>
                  <li style={darkListItemStyle}>Click on Show button to get data.</li>
                </ul>
              }
            />
          </ListItem>
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="8. Navigate to Warping Production Plan."
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Warping Production Plan'.</li>
                  <li style={darkListItemStyle}>Select Product Type - 'Greige Fabric', Select Customer, Customer Order No (Greige Fabric sales orders).</li>
                  <li style={darkListItemStyle}>Select Product. Enter Total Ends, Creels, Schedule Mtr.</li>
                  <li style={darkListItemStyle}>Then Click On 'Add Materials', Search Material Name.</li>
                  <li style={darkListItemStyle}>Against Supplier Name and Lot No. Enter No of Cones and On Click 'OK'.</li>
                  <li style={darkListItemStyle}>In Creel Details Enter Cone/Creel, Beam/Creel. On Click 'Save'.</li>
                  <li style={darkListItemStyle}>Approve Plan.</li>
                </ul>
              }
            />
          </ListItem>
          
          <MDTypography variant="h6" component="h2" gutterBottom>
            Note :- 1. Without Approve Plan it will not Auto generate Yarn Requisition.
          </MDTypography>
          <Divider />
          <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="9. Navigate to Yarn Requisition Slip."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Requisition' -&gt; 'Yarn Requisition Slip'.</li>
              <li style={darkListItemStyle}>If You want to Edit Requisition click on edit Or Click on Approve Icon and Approve.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- After Approval only it will be displayed to Commercial Dept.
      </MDTypography>
      <Divider />
      
      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="10. Navigate to Yarn Issue Slip (For Commercial Use Only)."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Yarn Issue Slip'.</li>
              <li style={darkListItemStyle}>Click on Issue Icon and Issue in form.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- Material Issue Listing only those Approved Requisitions by materials. Until Yarn Requisition gets Issued.
      </MDTypography>
      <Divider />
      
      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="11. Navigate to Warping Production."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Warping Production'.</li>
              <li style={darkListItemStyle}>Select Set No, Enter Production Details also Enter Bottom Details & Save.</li>
            </ul>
          }
        />
      </ListItem>
      <Divider />
      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="12. Navigate to Yarn Return From Dept. To Stores."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Yarn Return From Dept. To Stores'.</li>
              <li style={darkListItemStyle}>Select Issue Return Type , Department , Sub-Department , Count & lot for filter Issue No. , select Issue No.</li>
              <li style={darkListItemStyle}>Fill Details Return Quantity , Weight.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- Return transaction will edit or delete until it's received by Commercial dept.
      </MDTypography>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="13. Navigate to Yarn Return From Dept. To Stores (For Commercial Use Only)."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Yarn Return From Dept. To Stores'.</li>
              <li style={darkListItemStyle}>Click on Receipt Icon check details and click on Receive button.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- Received Stock will be Increased in main store.
      </MDTypography>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="14. Navigate to Warping Bottom Return."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Warping Bottom Return'.</li>
              <li style={darkListItemStyle}>Select Set No.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- Warping Production bottom details will be reflect on selecting Set No.
      </MDTypography>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="15. Navigate to Warping Bottom Return (For Commercial Use Only)."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Purchase' -&gt; 'Material Issue / Return' -&gt; 'Warping Bottom Return'.</li>
              <li style={darkListItemStyle}>Click on Receive Icon check details and Click on Receive.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note :- After Received only Bottom will get Shown in Rm Bottom Godown.
      </MDTypography>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="16. Navigate to Sizing Production."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Production' -&gt; 'Warping/Sizing' -&gt; 'Sizing Production'.</li>
              <li style={darkListItemStyle}>Select Set No and Fill Production Details Fields.</li>
            </ul>
          }
        />
      </ListItem>
      <MDTypography variant="h6" component="h2" gutterBottom>
        Note:- After save Sized Beam Stock Will Increased.
      </MDTypography>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="17. Navigate to Sized Beam Stock Report."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Stock Register' -&gt; 'Sized Beam Stock Report'.</li>
              <li style={darkListItemStyle}>Filter by Custom Date, Job Type, Beam Status, Set No, Beam No.</li>
              <li style={darkListItemStyle}>Click on Show button to get data.</li>
            </ul>
          }
        />
      </ListItem>
      <Divider />

      <ListItem style={darkListItemStyle}>
        <ListItemText
          primary="18. Navigate to Sizing Reconciliation Report."
          primaryTypographyProps={{ style: { color: "black" } }}
          secondary={
            <ul>
              <li style={darkListItemStyle}>Go to the menu 'Register' -&gt; 'Production Register' -&gt; 'Sizing Reconciliation Report'.</li>
              <li style={darkListItemStyle}>Select Set No.</li>
            </ul>
          }
        />
      </ListItem>
      <Divider />
      </StyledPaper>
    </DashboardLayout>
  );
};

export default WeavingSizingHelp;
