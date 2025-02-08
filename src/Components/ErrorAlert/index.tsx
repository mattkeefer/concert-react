import {Alert} from "react-bootstrap";

export default function ErrorAlert({message}: { message: string }) {

  if (message.includes("400")) {
    message = "Something went wrong with the information you gave. Please fix and try again."
  } else if (message.includes("500")) {
    message = "Something went wrong. Please try again."
  }
  return (
      <Alert variant="danger">
        {message}
      </Alert>
  )
}