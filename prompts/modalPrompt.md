# Prompt

```
Provide me with a basic modal implementation in react without using any external libraries
```

# output

```js
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
    background: "#fff",
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

const Modal = (isOpen, onClose, children) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <span style={modalStyles.closeBtn} onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};
```
