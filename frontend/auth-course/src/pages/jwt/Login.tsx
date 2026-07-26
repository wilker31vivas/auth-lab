import LoginForm from "../Login";

function JwtLogin() {
  const { login, loginError } = useJwtAuth();
  return <LoginForm onSubmit={login} error={loginError} />;
}