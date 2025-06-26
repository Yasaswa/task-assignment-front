export default function style({ theme }) {
    console.log("theme: ", theme)
    switch (theme) {
        case 'themeGreen':
            import(`./custom_theme_green.css`);
            import(`./erp_custom.css`);
            break;

        case 'themeDark':
            import(`./custom_theme_dark.css`);
            import(`./erp_custom.css`);
            break;

        default:
            import(`./custom_theme_dark.css`);
            import(`./erp_custom.css`);
            break;
    }
    return null; // Fixed!  

}

