import { useRef, createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import "./Modal.css";

const ModalContext =createContext();


export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null); //clear modal contents
    // if callback function is truthy, call it and reset it to null
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef, // reference to modal dif
    modalContent, // react component to render inside modal
    setModalContent, //  function to set the React component to render inside modal 
    setOnModalClose, // func sets callback function to call when modal close
    closeModal 
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  // if nodiv ref's modalRef or modalContext != truthy, render nothing
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // render this to the div ref'd by modalRef
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  )
}

export const useModal = () => useContext(ModalContext);
