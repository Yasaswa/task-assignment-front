import React from 'react'

// Material Dashboard 2 PRO React page layout routes
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import ConfigConstants from 'assets/Constants/config-constant';


export default function MenuNavbar({ routes }) {
    const configConstants = ConfigConstants();
    const { PAGE_ROUTES } = configConstants;

    return (
        <>
            <DefaultNavbar
                routes={PAGE_ROUTES}
                action={{
                    type: "external",
                    route: "https://creative-tim.com/product/material-dashboard-pro-react",
                    label: "buy now",
                }}
            />
        </>
    )
}
