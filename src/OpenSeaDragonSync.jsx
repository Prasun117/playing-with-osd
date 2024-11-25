import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

const ViewerComponent = ({ tileSource, zoom, pan, onViewportChange }) => {
  const viewerRef = useRef(null);
  const osdViewer = useRef(null);

  // Initialize the OpenSeadragon viewer on mount
  useEffect(() => {
    console.log("yoo");
    osdViewer.current = OpenSeadragon({
      element: viewerRef.current,
      tileSources: tileSource,
      prefixUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/",
      showNavigator: true,
    });

    
    // Handle zoom and pan changes
    const syncHandler = () => {
      if (osdViewer.current) {
        onViewportChange({
          zoom: osdViewer.current.viewport.getZoom(),
          pan: osdViewer.current.viewport.getCenter(),
        });
      }
    };

    osdViewer.current.addHandler("zoom", syncHandler);
    osdViewer.current.addHandler("pan", syncHandler);

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
      }
    };
  }, [tileSource]);

  // Sync zoom and pan with the centralized state
  useEffect(() => {
    if (osdViewer.current) {
      osdViewer.current.viewport.zoomTo(zoom);
      osdViewer.current.viewport.panTo(pan);
    }
  }, [zoom, pan]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
};

const OpenSeadragonSync = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(new OpenSeadragon.Point(0.5, 0.5));
  const [syncing, setSyncing] = useState(false);

  const handleViewportChange = ({ zoom, pan }) => {
    console.log("triggered");
    if (!syncing) {
      console.log("triggered...1");
      setSyncing(true);
      setZoom(zoom);
      setPan(pan);
      setSyncing(false);
    }
  };

  return (
    <div>
      <ViewerComponent
        tileSource="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        zoom={zoom}
        pan={pan}
        onViewportChange={handleViewportChange}
      />
      <ViewerComponent
        tileSource="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        zoom={zoom}
        pan={pan}
        onViewportChange={handleViewportChange}
      />
      <ViewerComponent
        tileSource="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        zoom={zoom}
        pan={pan}
        onViewportChange={handleViewportChange}
      />
      <ViewerComponent
        tileSource="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        zoom={zoom}
        pan={pan}
        onViewportChange={handleViewportChange}
      />
      <ViewerComponent
        tileSource="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        zoom={zoom}
        pan={pan}
        onViewportChange={handleViewportChange}
      />
      {/* Add more <ViewerComponent /> as needed */}
    </div>
  );
};

export default OpenSeadragonSync;
