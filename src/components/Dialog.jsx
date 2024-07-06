import React from 'react';
import './style.scss';

const Dialog = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="dialog-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Dialog;
