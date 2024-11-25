import { createContext, useContext, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
const intialState = {
  syncState: false,
};

const OpenSeadragonContext = createContext(intialState);

const OpenSeaDragonProvider = ({ children }) => {
  const [syncState, setSyncState] = useState(false);
  const [focusedViewPort, setFocusViewPort] = useState(null);
  const focusedViewPortRef = useRef(null);
  const lastStateViewPorts = useRef({});
  const viewPorts = useRef({});
  const syncStateRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(new OpenSeadragon.Point(0.5, 0.5));

  console.log("focusedViewPort", focusedViewPort);
  return (
    <OpenSeadragonContext.Provider
      value={{
        syncState,
        setSyncState,
        setFocusViewPort,
        focusedViewPort,
        zoom,
        setZoom,
        pan,
        setPan,
        viewPorts,
        lastStateViewPorts,
        syncStateRef,
        focusedViewPortRef,
      }}
    >
      <>{children}</>
    </OpenSeadragonContext.Provider>
  );
};

export const useOpenSeaDragonContext = () => {
  const context = useContext(OpenSeadragonContext);
  if (!context) {
    throw new Error(
      "useOpenSeaDragonContext hook can't be used outside OpenSeaDragonProvider "
    );
  }
  return context;
};

export default OpenSeaDragonProvider;
