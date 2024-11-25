import { useState, useEffect } from "react";
import { useOpenSeaDragonContext } from "./OpenSeaDragonContext";

const SyncButton = () => {
  const { syncState, setSyncState, syncStateRef } = useOpenSeaDragonContext();
  const [isSyncOn, setIsSyncOn] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsSyncOn(!syncStateRef.current);
          syncStateRef.current = !syncStateRef.current;
          setSyncState(!syncState);
        }}
      >
        Sync {isSyncOn ? "on" : "off"}
      </button>
    </>
  );
};

export default SyncButton;
