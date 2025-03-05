import {useNavigate} from "react-router";
import BaseModal from "./BaseModal";

export default function ErrorModal({error}: { error: Error }) {
  const navigate = useNavigate();

  if (error.message.includes("401") || error.message.includes("403")) {
    return <BaseModal title="Error"
                      message="You must be logged in to perform this action."
                      btnTitle="Login" btnFunction={() => navigate('/Login')} closeButton={false}/>
  }
  return <BaseModal title="Error" message={error.message}/>
}