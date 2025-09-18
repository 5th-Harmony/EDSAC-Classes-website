import { LiveClass } from "@/components/LiveClass";
import { useParams } from "react-router-dom";

const LiveClassPage = () => {
  const { roomId } = useParams();
  const token = "dummy-token"; //localStorage.getItem("authToken");

  if (!roomId || !token) {
    return <div>Loading...</div>;
  }

  return <LiveClass roomId={roomId} token={token} />;
};

export default LiveClassPage;
