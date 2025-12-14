import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!keycloak.authenticated) {
      keycloak.login();
    } else {
      navigate("/board");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="fw-bold mb-4">Welcome to Real-Time Collaborative Whiteboard</h1>

      <p className="lead mb-4">
        Draw together, chat together, collaborate in real time — powered by WebSockets & Keycloak.
      </p>

      <button className="btn btn-primary btn-lg px-5 py-3" onClick={handleStart}>
        Enter Whiteboard
      </button>
    </div>
  );
}
