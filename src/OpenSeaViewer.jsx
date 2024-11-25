import OpenSeadragon, { Point } from "openseadragon";
import React, { useEffect, useRef } from "react";
import { useOpenSeaDragonContext } from "./OpenSeaDragonContext";

const getMaxPanValues = (imageBounds, viewportBounds) => {
  // Calculate the max movement in percentage
  const maxMoveX = imageBounds.width - viewportBounds.width;
  const maxMoveY = imageBounds.height - viewportBounds.height;

  return new Point(maxMoveX, maxMoveY);
};

const calculateRelativePanCoordinates = (currentPan, diff, maxPanLevel) => {
  const { x, y } = currentPan;
  const { x: diffX, y: diffY } = diff;
  const { x: maxMoveX, y: maxMoveY } = maxPanLevel;

  // Calculate percentage movement
  const percentX = Math.max(-1, Math.min(1, diffX / maxMoveX));
  const percentY = Math.max(-1, Math.min(1, diffY / maxMoveY));

  // Apply the peercentage movement and clamp values between 0 and 1
  const clampedX = Math.max(0, Math.min(1, x + percentX));
  const clampedY = Math.max(0, Math.min(1, y + percentY));

  return new Point(clampedX, clampedY);
};

const OpenSeadragonViewer = ({ tileSource, viewPortName }) => {
  const viewerRef = useRef(null); // Reference for the OpenSeadragon container
  const osdViewer = useRef(null);

  const {
    focusedViewPort,
    setFocusViewPort,
    setPan,
    pan,
    syncState,
    viewPorts,
    lastStateViewPorts,
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
          Width: "13920",
          Height: "10200",
        },
      },
    };

    // Initialize OpenSeadragon viewer when component mounts
    osdViewer.current = OpenSeadragon({
      element: viewerRef.current,
      tileSources: duomo,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // Set control icons URL
      defaultZoomLevel: 1, // Optional: sets the default zoom level
      showNavigationControl: false,
      zoomPerScroll: 1.2,
      immediateRender: false, // Set to false to improve performance contrary to its documentation.
      loadTilesWithAjax: true,
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      gestureSettingsMouse: {
        clickToZoom: false,
      },
      animationTime: 0.8,
      maxZoomLevel: 2,
    });

    // register viewer at context lvl
    viewPorts.current = {
      ...viewPorts.current,
      [viewPortName]: osdViewer.current,
    };

    const panHandler = (e) => {
      const { x: newX, y: newY } = e.center;
      const { x: prevX, y: prevY } = pan;

      if (
        prevX.toFixed(4) !== newX.toFixed(4) ||
        prevY.toFixed(4) !== newY.toFixed(4)
      ) {
        // Calculate the difference in position
        const diff = new Point(newX - prevX, newY - prevY);

        lastStateViewPorts.current = {
          ...(lastStateViewPorts.current ?? {}),
          [viewPortName]: {
            ...(lastStateViewPorts.current[viewPortName] ?? {}),
            pan: e.center,
          },
          diff,
        };
      } else {
        lastStateViewPorts.current = {
          ...(lastStateViewPorts.current ?? {}),
          [viewPortName]: {
            ...(lastStateViewPorts.current[viewPortName] ?? {}),
            pan,
          },
          diff: null,
        };
      }

      setPan(e.center);
    };

    const addZoomPanEvent = () => {
      setFocusViewPort(viewPortName);
      if (osdViewer.current) {
        osdViewer.current.addHandler("pan", panHandler, { viewPortName });
      }
    };

    const removeZoomPanHandler = () => {
      if (osdViewer.current) {
        osdViewer.current.removeHandler("pan", panHandler);
      }
    };

    const handleUpdateViewport = () => {
      // Get the bounds of the current viewer
      const imageBounds = osdViewer.current?.world.getItemAt(0).getBounds(true);
      const viewportBounds = osdViewer.current?.viewport.getBounds(true);
      const maxPanValues = getMaxPanValues(imageBounds, viewportBounds);

      lastStateViewPorts.current = {
        ...(lastStateViewPorts.current ?? {}),
        [viewPortName]: {
          ...(lastStateViewPorts.current[viewPortName] ?? {}),
          maxPanValues,
        },
      };
    };

    osdViewer.current.addHandler("container-enter", addZoomPanEvent, {
      viewPortName,
    });

    osdViewer.current.addHandler("container-exit", removeZoomPanHandler, {
      viewPortName,
    });

    osdViewer.current.addHandler("update-viewport", handleUpdateViewport, {
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
    if (
      syncState &&
      osdViewer.current &&
      viewPortName !== focusedViewPort &&
      lastStateViewPorts.current[viewPortName]
    ) {
      const diff = lastStateViewPorts.current?.diff;
      if (diff) {
        const otherPanLevel = lastStateViewPorts.current[viewPortName]?.pan;
        const maxPanLevel =
          lastStateViewPorts.current[viewPortName]?.maxPanValues;

        if (!otherPanLevel) {
          lastStateViewPorts.current = {
            ...(lastStateViewPorts.current ?? {}),
            [viewPortName]: {
              ...(lastStateViewPorts.current[viewPortName] ?? {}),
              pan,
            },
          };

          osdViewer.current.viewport.panTo(pan);
        }

        if (
          otherPanLevel?.x < maxPanLevel?.x ||
          otherPanLevel?.y < maxPanLevel?.y
        ) {
          const { x: newOtherX, y: newOtherY } =
            calculateRelativePanCoordinates(otherPanLevel, diff, maxPanLevel);
          if (
            newOtherX.toFixed(4) !== otherPanLevel?.x.toFixed(4) ||
            newOtherY.toFixed(4) !== otherPanLevel?.y.toFixed(4)
          ) {
            console.log("**************************************************");
            const updatedPan = new Point(newOtherX, newOtherY);
            osdViewer.current.viewport.panTo(updatedPan);
            osdViewer.current.viewport.applyConstraints(true);
            lastStateViewPorts.current = {
              ...(lastStateViewPorts.current ?? {}),
              [viewPortName]: {
                ...(lastStateViewPorts.current[viewPortName] ?? {}),
                pan: updatedPan,
              },
            };
          }
        }
      }
    }
  }, [pan, syncState]);

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
