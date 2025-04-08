import React, { createContext, useContext, useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
    const dialogRef = useRef(null);

    const confirmAction = ({
        message,
        header = 'Confirmación',
        icon = 'pi pi-exclamation-triangle',
        acceptLabel = 'Sí',
        rejectLabel = 'Cancelar',
        acceptClassName = 'p-button-danger',
        rejectClassName = '',
        onAccept,
        onReject,
    }) => {
        confirmDialog({
            message,
            header,
            icon,
            acceptLabel,
            rejectLabel,
            acceptClassName,
            rejectClassName,
            accept: onAccept,
            reject: onReject,
        });
    };

    return (
        <>
            <ConfirmDialog ref={dialogRef} />
            <ConfirmDialogContext.Provider value={{ confirmAction }}>
                {children}
            </ConfirmDialogContext.Provider>
        </>
    );
};

export const useConfirmDialog = () => useContext(ConfirmDialogContext);
