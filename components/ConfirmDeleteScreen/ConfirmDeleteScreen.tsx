import React from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const ConfirmDeleteScreen = ({ onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p>Are you sure you want to delete this item?</p>
                <div className={styles.buttonContainer}>
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteScreen;