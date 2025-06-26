import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { RxCrossCircled } from 'react-icons/rx'

const DeleteModal = ({ show, closeModal, deleteRecord}) => {
    return (
        <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <span><button type="button" class="erp-modal-close btn-close" aria-label="Close" onClick={closeModal}></button></span>
            <Modal.Body className='erp_modal_body'>
                <span className='erp_modal_delete_icon'><RxCrossCircled /></span>
                <h6>Are you sure?</h6>
                <div className="erp-form-label">Do you wish to delete this record ?</div>
            </Modal.Body>
            <Modal.Footer className='justify-content-center'>
                <Button variant="success" className='erp-gb-button' onClick={closeModal}>
                    Cancel
                </Button>&nbsp;
                <Button variant="danger" className='erp-gb-button' onClick={deleteRecord}>Delete</Button>
            </Modal.Footer>
        </Modal>

    )
}

export default DeleteModal
