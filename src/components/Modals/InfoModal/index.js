import React from 'react'
import { Button, Modal } from 'react-bootstrap'

function InfoModal(props) {
    return (
        <>
            <Modal show={props.show[0]} onHide={props.closeModal} backdrop="static" keyboard={false} centered>
                <Modal.Body className='erp_city_modal_body'>
                    <div className='row'>
                        <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={props.closeModal}></button></div>
                    </div>
                    <h6>{props.show[1]}</h6>

                </Modal.Body>
                <Modal.Footer className='erp-modal-footer'>
                    <Button variant="success" className="erp-gb-button" onClick={props.closeModal}>
                        ok
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default InfoModal
