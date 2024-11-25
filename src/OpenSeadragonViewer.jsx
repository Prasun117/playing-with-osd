import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon, { Point } from "openseadragon";
import { useOpenSeaDragonContext } from "./OpenSeaDragonContext";

const OpenSeadragonViewer = ({ tileSource, viewPortName }) => {
  const viewerRef = useRef(null); // Reference for the OpenSeadragon container
  const osdViewer = useRef(null);

  const {
    focusedViewPort,
    focusedViewPortRef,
    setFocusViewPort,
    setZoom,
    setPan,
    zoom,
    pan,
    syncState,
    viewPorts,
    lastStateViewPorts,
    syncStateRef,
  } = useOpenSeaDragonContext(); // Reference to store the OpenSeadragon viewer instance

  useEffect(() => {
    const duomo = {
      Image: {
        xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        Url: "https://openseadragon.github.io/example-images/duomo/duomo_files/",
        Format: "jpg",
        Overlap: "1",
        TileSize: "256",
        Size: {
          Width: "16920",
          Height: "16200",
        },
      },
    };

    // Initialize OpenSeadragon viewer when component mounts
    osdViewer.current = OpenSeadragon({
      element: viewerRef.current,
      tileSources: duomo,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // Set control icons URL
      defaultZoomLevel: 1, // Optional: sets the default zoom level
      maxZoomLevel: 2,
      defaultZoomLevel: 1, // Optional: sets the default zoom level
      showNavigationControl: false,
      zoomPerScroll: 1.2,
      // immediateRender: false, // Set to false to improve performance contrary to its documentation.
      loadTilesWithAjax: true,
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      gestureSettingsMouse: {
        clickToZoom: false,
      },
      animationTime: 0.8,
    });

    // register viewer at context lvl
    viewPorts.current = {
      ...viewPorts.current,
      [viewPortName]: osdViewer.current,
    };

    const zoomHandler = (e) => {
      console.log(e.userData);
      setZoom(e.zoom);
    };
    const panHandler = (e) => {
      console.log(e.userData);
      setPan(e.center);
    };
    const addZoomPanEvent = () => {
      setFocusViewPort(viewPortName);
      focusedViewPortRef.current = viewPortName;
      console.log("added event handler", viewPortName);
      if (osdViewer.current) {
        osdViewer.current.addHandler("zoom", zoomHandler, { viewPortName });
        osdViewer.current.addHandler("pan", panHandler, { viewPortName });
      }
    };
    const removeZoomPanHandler = () => {
      console.log("remove event handler", viewPortName);
      if (osdViewer.current) {
        osdViewer.current.removeHandler("zoom", zoomHandler);
        osdViewer.current.removeHandler("pan", panHandler);
      }
    };

    osdViewer.current.addHandler("container-enter", addZoomPanEvent, {
      viewPortName,
    });

    osdViewer.current.addHandler("container-exit", removeZoomPanHandler, {
      viewPortName,
    });

    // Clean up the viewer instance on component unmount
    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
      }
    };
  }, [tileSource]); // Reinitialize if tileSource changes

  useEffect(() => {
    console.log(
      "#############",
      syncStateRef.current &&
        osdViewer.current &&
        viewPortName !== focusedViewPortRef.current,
      viewPortName
    );
    if (
      syncStateRef.current &&
      osdViewer.current &&
      viewPortName !== focusedViewPortRef.current
    ) {
      const sourceViewPort =
        lastStateViewPorts.current[focusedViewPortRef.current];
      console.log(sourceViewPort, pan);
      const sourcePanDiff = {
        x: pan.x - sourceViewPort.pan.x,
        y: pan.y - sourceViewPort.pan.y,
      };
      console.log(sourcePanDiff);
      const currentTargetZoom = osdViewer.current.viewport.getZoom();
      const sourceZoom = sourceViewPort.zoom;
      const zoomLvl = currentTargetZoom / sourceZoom;
      const targetPan = osdViewer.current.viewport
        .getCenter()
        .plus(sourcePanDiff);
      osdViewer.current.viewport.panTo(targetPan);
      osdViewer.current.viewport.applyConstraints(true);
      lastStateViewPorts.current = {
        ...lastStateViewPorts.current,
        [viewPortName]: {
          pan: osdViewer.current.viewport.getCenter(),
          zoom: osdViewer.current.viewport.getZoom(),
        },
      };
    } else if (
      !syncStateRef.current ||
      viewPortName == focusedViewPortRef.current
    ) {
      setTimeout(() => {
        lastStateViewPorts.current = {
          ...lastStateViewPorts.current,
          [viewPortName]: {
            pan: osdViewer.current.viewport.getCenter(),
            zoom: osdViewer.current.viewport.getZoom(),
          },
        };
      }, 10);
    }
  }, [pan]);

  useEffect(() => {
    if (
      syncStateRef.current &&
      osdViewer.current &&
      viewPortName !== focusedViewPortRef.current
    ) {
      const currentViewPortZoom = osdViewer.current.viewport.getZoom();
      const newZoomChange = zoom / currentViewPortZoom;
      osdViewer.current.viewport.zoomTo(zoom);
      osdViewer.current.viewport.applyConstraints(true);
    } else if (!syncStateRef.current) {
      lastStateViewPorts.current = {
        ...lastStateViewPorts.current,
        [viewPortName]: {
          pan: osdViewer.current.viewport.getCenter(),
          zoom: osdViewer.current.viewport.getZoom(),
        },
      };
    }
  }, [zoom]);

  return (
    <div
      style={{
        margin: "20px",
        border: "1px solid black",
      }}
    >
      <div
        ref={viewerRef}
        style={{ width: "600px", height: "600px" }} // Adjust height and width as needed
      />
    </div>
  );
};

export default OpenSeadragonViewer;
