import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';



function Toasts() {
    return (
        <>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
                <Toast>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default Toasts
