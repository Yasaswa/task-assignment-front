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

const HrPolicyHelp = () => {
  return (
    <DashboardLayout>
      <StyledPaper>
        <MDTypography variant="h4" component="h1" gutterBottom>
        अवकाश व ड्यूटी समय संबंधित दिशा निर्देश
        </MDTypography>

        <List component="ol">
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="1.पंचिंग समय (PUNCHING TIME) :"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>सभी कर्मचारियों को अपनी शिफ्ट समयनुसार ड्यूटी पर आते और जाते समय पंचिंग करना अनिवार्य है ! 
                    तकनिकी विभाग कर्मियों के लिए महीने में तीन बार तक 15 मिनट व अन्य के लिए 20 मिनट की देरी को पूर्ण उपस्तिथ माना जायेगा और चौथी बार देर से पंचिंग करने पर ½ दिन के लिए अनुपस्थित माना जायेगा तथा महीने में चार से ज्यादा देर से पंचिंग करने को पुरे दिने के लिए अनुपस्थित माना जायेगा ! 
                    यह मानदंड केवल एक दिशानिर्देश है और किसी कर्मचारी को देर से आने का अधिकार नहीं देता है।.</li>
                </ul>
              }
            />
          </ListItem>
          <Divider /> <Divider /> <Divider />
          
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="2. मिस पंच - MISS PUNCH :"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>छुट्टी से पहले या बाद में मिस पंच को आधा दिन  माना जाएगा, ERP में इस तरह के मिस पंच के सन्दर्भ में मैनुअल मिस पंच सुधार की अनुमति नहीं है।</li>
                  <li style={darkListItemStyle}>अन्य दिनों के मिस पंच सुधार का अधिकार विभाग प्रमुख के पास 24 घंटे के लिए सुरक्षित रहेगा, यदि मिस पंच से 24 घंटे के अंदर विभाग प्रमुख द्वारा सुधार नहीं किया जाता हे तो यह अधिकार H. R. एडमिन के पास हस्तांतरण हो जायेगा तथा कर्मचारी द्वारा लिखित में एप्लिकेशन देने पर सुरक्षा विभाग से सत्यापित करने के उपरांत ही सुधार हो पायेगा, यदि ऐसा नहीं होता हे तो उस दिन की अनुपस्थिति मानी जाएगी !</li>
                </ul>
              }
            />
          </ListItem>
          <Divider /> <Divider /> <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="3. अल्प अवकाश – SHORT LEAVE :"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>यदि किसी कारणवश कर्मचारी को समय से पहले जाना हे तो ERP में शॉर्ट लीव फॉर्म भर कर अपने विभाग प्रमुख से अप्रूव करवा कर महीने में दो बार 2 घंटे पहले जा सकते हैं, उपरोक्त छूट का लाभ लेने के लिए ERP में गेट पास लेकर जाना अनिवार्य हे ! ।</li>
                </ul>
              }
            />
          </ListItem>
          <Divider /> <Divider /> <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="4. साप्ताहिक अवकाश (WEEKLY OFF) :"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>प्रत्येक कर्मचारी को महीने में चार साप्ताहिक अवकाश का अधिकार है, यदि किसी कारणवश विभाग प्रमुख द्वारा साप्ताहिक अवकाश के दिन कर्मचारी को ड्यूटी पर बुलाया जाता हैं तो उसके स्थान पर उस दिन से एक महीने के भीतर अर्जित अवकाश के एवज में अवकाश देकर उसकी क्षतिपूर्ति की जा सकती है !</li>
                </ul>
              }
            />
          </ListItem>
          <Divider /> <Divider /> <Divider />
          <ListItem style={darkListItemStyle}>
            <ListItemText
              primary="5. पी. एल. / सी. एल.   (PL / CL):"
              primaryTypographyProps={{ style: { color: "black" } }}
              secondary={
                <ul>
                  <li style={darkListItemStyle}>प्रत्येक कर्मचारी एक वर्ष में 6 PL तथा 6 CL का अधिकारी हे।</li>
                  <li style={darkListItemStyle}>प्रत्येक कर्मचारी के अवकाश रजिस्टर में हर तिमाही में 3 PL/ CL अर्जित होगी, इस प्रकार 4 तिमाही में 12 CL/PL अर्जित होगी !</li>
                  <li style={darkListItemStyle}>उपरोक्त वर्णित अवकाश का लाभ कर्मचारी द्वारा ERP में अग्रिम LEAVE फॉर्म भर कर तथा विभाग प्रमुख की अनुमति लेकर लिया जा सकता हे !</li>
                </ul>
              }
            />
          </ListItem>
          <Divider /> <Divider /> <Divider />
         
         
        </List>
      </StyledPaper>
     
    </DashboardLayout>
  );
};

export default HrPolicyHelp;
