import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export function useSocket(url = "http://localhost:4000") {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(url, {
      transports: ["websocket"],
      reconnection: true,
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [url]);

  return socket;
}
