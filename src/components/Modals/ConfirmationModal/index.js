import React from 'react'
// Import React icons
import { RxCheckCircled } from "react-icons/rx";

// React Bootstrap imports
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

function ConfirmationModal({ close, confirmation, show }) {
    return (
        <>
            <Modal show={show[0]} onHide={close} backdrop="static" keyboard={false} centered>
                <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={close}></button></span>
                <Modal.Body className='erp_modal_body'>
                    <span className='erp_modal_success_icon'><RxCheckCircled /></span>
                    <h6>{show[1]}</h6>
                    {
                        show.length > 2
                            ? <h6>{show[2]}</h6>
                            : null
                    }

                    <h6>{show[3]}</h6>
                    <Modal.Footer className='erp-modal-footer'>
                        {show[3] !== '' && show[3] !== null ?
                            <Button variant="success" className="erp-gb-button" onClick={confirmation}> Yes </Button> : null}
                        <Button variant="success" className="erp-gb-button ms-2" onClick={close}>
                            {show[3] === '' ? 'Ok' : 'NO'}
                        </Button>
                    </Modal.Footer>
                </Modal.Body>

            </Modal >
        </>
    )
}

export default ConfirmationModal;
