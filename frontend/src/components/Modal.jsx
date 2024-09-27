import React from 'react';
import '../style/Modal.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                {children}
                <div className="modal-actions">
                    <button onClick={onClose}>Avbryt</button>
                    <button onClick={onConfirm}>Bekräfta</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
