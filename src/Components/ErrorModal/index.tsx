import {useNavigate} from "react-router";
import BaseModal from "../BaseModal";

export default function ErrorModal({error}: { error: Error }) {
  const navigate = useNavigate();

  if (error.message.includes("401")) {
    return <BaseModal title="Error" message="Unauthorized. Please try again after logging in."
                      btnTitle="Login" btnFunction={() => navigate('/Login')} closeButton={false}/>
  }
  return <BaseModal title="Error" message={error.message}/>
}