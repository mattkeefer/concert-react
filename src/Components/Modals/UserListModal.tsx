import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import SimpleList from "../Lists/SimpleList";
import {useNavigate} from "react-router";

export default function UserListModal({show, users, title, onHide}: {
  show: boolean,
  users: any[],
  title: string,
  onHide: () => void
}) {
  const navigate = useNavigate();
  const handleUserClick = (id: string) => {
    navigate(`/Profile/${id}`);
    onHide();
  }
  const listItems: any[] = users.map(u => ({name: '@' + u.username, image: u.profilePicture, onClick: () => handleUserClick(u._id)}));

  return (
      <Modal
          show={show}
          onHide={onHide}
          backdrop="static"
          keyboard={false}
          data-bs-theme="dark"
          className="text-white-50"
      >
        <Modal.Header>
          <Modal.Title className="text-accent">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users.length == 0 && "No one yet..."}
          {users.length > 0 && <SimpleList listItems={listItems} clickable className={"bg-body-secondary"}/>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
}