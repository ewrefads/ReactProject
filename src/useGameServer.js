import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useCallback, useEffect, useState } from "react";

function useGameServer(gameHubUrl, authToken, onConnectionClosed) {
  const [connection] = useState(
    new HubConnectionBuilder()
      .withUrl(gameHubUrl, { accessTokenFactory: () => authToken })
      .build()
  );

  let isConnectionNot = useCallback(state => {
    return !connection || connection.state !== state;
  }, [connection]);

  let disconnect = useCallback(() => {
    if (isConnectionNot(HubConnectionState.Connected))
      return;

    console.log("Closing connection to gameserver...");
    connection.stop();
  }, [connection, isConnectionNot]);

  useEffect(() => {
    console.warn("Auth token changed!");
    disconnect();
  }, [authToken, disconnect]);

  let connect = useCallback(() => {
    if (isConnectionNot(HubConnectionState.Disconnected))
      return;

    console.log("Connecting to gameserver...");
    connection.start()
      .then(() => console.log("Successfully connected to gameserver!"))
      .catch(onConnectionClosed);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, isConnectionNot]);

  useEffect(() => {
    if (isConnectionNot(HubConnectionState.Disconnected))
      return;

    connection.on("ServerError", response => {
      console.error(response.error);
    });

    connection.onclose(error => {
      console.warn("Connection to gameserver closed!");
      onConnectionClosed(error);
    });

    return disconnect;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, disconnect, isConnectionNot]);

  const [gameServerObject] = useState({
    connect: connect,
    invoke: (methodName, ...args) => {
      if (isConnectionNot(HubConnectionState.Connected))
        return;
      connection.invoke(methodName, ...args)
        .catch(onConnectionClosed);
    },
    onEvent: (eventName, callback) => {
      console.log(eventName);
      connection.off(eventName);
      connection.on(eventName, callback);
    },
    disconnect: disconnect
  });

  return gameServerObject;
}

export default useGameServer;