import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function UserListModal({show, users, title, onHide}: {
  show: boolean,
  users: any[],
  title: string,
  onHide: () => void
}) {
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
          {users.length > 0 && <ul>
            {users.map(user => (
                <li><Link to={`/Profile/${user._id}`} onClick={onHide}>@{user.username}</Link></li>
            ))}
          </ul>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
}