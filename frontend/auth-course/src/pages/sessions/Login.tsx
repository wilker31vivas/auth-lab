import LoginForm from "../Login";
import { useSessionsAuth } from "../../context/SessionsAuthContext";

function SessionsLogin() {
  const { login, loginError } = useSessionsAuth();
  return <LoginForm onSubmit={login} error={loginError} />;
}