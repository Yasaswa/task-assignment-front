import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import $ from 'jquery';

import MDTypography from "components/MDTypography";

// Import React icons
import { RxCheckCircled } from "react-icons/rx";

// React Bootstrap imports
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

function MailSentModal(props) {

    let check_status = props.show[3] || [];

    const [check_send_mail, setCheckSendMail] = useState(() => props.show[3] || []);
    // useEffect(() => {
    //     debugger
    //     console.log("props.show[3]:", props.show[3]);
    //     if (Array.isArray(props.show[3])) {
    //         setCheckSendMail(props.show[3]);
    //     } else {
    //         console.error("props.show[3] is not an array:", props.show[3]);
    //     }
    // }, [props.show]);


    const handleCheckboxChange = (e, value) => {
        const isChecked = e.target.checked;
        $("#error_txt").hide();
        if (isChecked) {
            // Add the value if checked
            setCheckSendMail((prev) => [...prev, value]);
        } else {
            // Remove the value if unchecked
            setCheckSendMail((prev) => prev.filter((item) => item !== value));
        }
    };

    const validateForm = () => {
        if (check_send_mail.includes("C") || check_send_mail.includes("A")) {
            $("#error_txt").hide();
            props.sendConfirm(check_send_mail)
        } else {
            $("#error_txt").text("Select atleast one").show();
        }
    }

    return (
        <>
            <Modal show={props.show[0]} onHide={props.handleCloseMailSentModal} backdrop="static" keyboard={false} centered>
                <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={props.handleCloseMailSentModal}></button></span>
                <Modal.Body className='erp_modal_body'>
                    <span className='erp_modal_success_icon'><RxCheckCircled /></span>
                    <h6>{props.show[1]}</h6>
                    {
                        props.show.length > 2
                            ? <h6>{props.show[2]}</h6>
                            : ""
                    }
                    <h6>Do you wish to Send Mail...?</h6>
                    {check_status.length > 0 ?
                        <>
                            <div className="erp_form_radio">
                                {check_status.includes("C") ?
                                    <div className="fCheck me-2">
                                        <Form.Check
                                            className={`erp_radio_button`}

                                            type="checkbox"
                                            value="C"
                                            name="check_send_mail_customer"
                                            checked={Array.isArray(check_send_mail) && check_send_mail.includes("C")}
                                            onChange={(e) => handleCheckboxChange(e, "C")}
                                            label={<h6>Customer</h6>}
                                        />

                                    </div>
                                    : null}

                                {check_status.includes("A") ?
                                    <div className="fCheck">
                                        <Form.Check
                                            className="erp_radio_button"
                                            type="checkbox"
                                            value="A"
                                            name="check_send_mail_agent"
                                            checked={Array.isArray(check_send_mail) && check_send_mail.includes("A")}

                                            onChange={(e) => handleCheckboxChange(e, "A")}
                                            label={<h6>Agent</h6>}
                                        />
                                    </div>
                                    : null}

                            </div>
                            <MDTypography id="error_txt" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
                        </>
                        :
                        null
                    }
                    <Modal.Footer className="erp-modal-footer">
                        {check_status && (check_status.includes("A") || check_status.includes("C"))? (
                            <>
                                <Button
                                    variant="success"
                                    className="erp-gb-button"
                                    onClick={() => validateForm()}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="success"
                                    className="erp-gb-button ms-2"
                                    onClick={props.handleCloseMailSentModal}
                                >
                                    No
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="success"
                                    className="erp-gb-button"
                                    onClick={() =>  props.sendConfirm()}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="success"
                                    className="erp-gb-button ms-2"
                                    onClick={props.handleCloseMailSentModal}
                                >
                                    No
                                </Button>
                            </>
                        )}
                    </Modal.Footer>

                </Modal.Body>

            </Modal >
        </>
    )
}

export default MailSentModal