import React from 'react'

// Import React icons
import { RxCheckCircled } from "react-icons/rx";

// React Bootstrap imports
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';

function SuccessModal(props) {
    return (
        <>
            <Modal show={props.show[0]} onHide={props.handleCloseSuccessModal} backdrop="static" keyboard={false} centered>
                <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={props.handleCloseSuccessModal}></button></span>
                <Modal.Body className='erp_modal_body'>
                    <span className='erp_modal_success_icon'><RxCheckCircled /></span>
                    <h6>{props.show[1]}</h6>
                    {
                        props.show.length > 2
                            ? <h6>{props.show[2]}</h6>
                            : ""
                    }
                </Modal.Body>
                <Modal.Footer className='erp-modal-footer'>
                    <Button variant="success" className="erp-gb-button" onClick={props.handleCloseSuccessModal}>
                        ok
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SuccessModal
