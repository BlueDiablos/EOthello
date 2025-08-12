import type { ReactNode } from "react";

export interface ModalState {
  isOpen: boolean;
  onClose: () => boolean;
  children: ReactNode;
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#3498db",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    cursor: "pointer",
    fontSize: "18px",
  },
};

const Modal = (modalState: ModalState) => {
  if (!modalState.isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <span style={modalStyles.closeBtn} onClick={modalState.onClose}>
          &times;
        </span>
        {modalState.children}
      </div>
    </div>
  );
};

export default Modal;
