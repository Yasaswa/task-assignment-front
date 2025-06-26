import { React } from "react"

// React Icons
import { RxCrossCircled } from "react-icons/rx";

// React Bootstrap imports
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';


export default function ErrorModal(props) {
    return (
        <>
            {/* Error Msg Popup */}
            <Modal show={props.show[0]} onHide={props.handleCloseErrModal} backdrop="static" keyboard={false} centered>
                <Modal.Header className="erp-modal-header">
                    <Modal.Title className='erp_modal_title'>Error</Modal.Title>
                    <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={props.handleCloseErrModal}></button></span>
                </Modal.Header>
                <Modal.Body className='erp_modal_body'>
                    <span className='erp_modal_delete_icon'><RxCrossCircled /></span>
                    <div>  {props.show[1]} </div>
                </Modal.Body>
                <Modal.Footer className='erp-modal-footer'>
                    <Button variant="success" className="btn erp-gb-button" onClick={props.handleCloseErrModal}>
                        ok
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}


