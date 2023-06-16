import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error('路由错误：',error);

  return (
    <div id="error-page" style={{margin:"30vh 0", textAlign: "center"}}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i style={{color: "#e8bf6a", textDecoration: "underline"}}>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
