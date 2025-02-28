import {Button, Modal} from "react-bootstrap";
import {useState} from "react";

export default function BaseModal(details: {
  title: string,
  message: string,
  btnTitle?: string,
  btnFunction?: () => void,
  closeButton?: boolean,
  onHide?: () => void,
}) {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    if (details.onHide) {
      details.onHide();
    }
  }

  return (
      <>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            data-bs-theme="dark"
            className="text-white-50"
        >
          <Modal.Header closeButton={details.closeButton !== false}>
            <Modal.Title className="text-danger">{details.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {details.message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={details.btnFunction || handleClose}>
              {details.btnTitle || "Close"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
}