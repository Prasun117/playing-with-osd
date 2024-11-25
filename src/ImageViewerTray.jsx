import { useEffect, useRef, useState } from "react";
import ImageViewer from "./ImageViewer";

const ImageViewerTray = () => {
  const [isSync, setIsSync] = useState(false);

  const view1Ref = useRef(null);
  const view2Ref = useRef(null);

  // Track each viewer's state in ref NOT STATE to avoid unnecessary rerender
  const lastStateRef = useRef({
    viewer1: { zoom: 1, center: null },
    viewer2: { zoom: 1, center: null },
  });

  // const selectedRef = useRef({ viewer1: false, viewer2: false });
  const selectedIdRef = useRef();
  const syncStateRef = useRef({ zoom: null, pan: null });

  const syncViewers = (sourceViewer, targetViewer, sourceViewerId) => {
    console.log("sync triggered ", sourceViewerId);
    if (selectedIdRef.current && selectedIdRef.current !== sourceViewerId)
      return;

    const sourceLastState = lastStateRef.current?.[sourceViewerId];

    const newZoom = sourceViewer.viewport.getZoom();
    // console.log('j newZoom', newZoom);
    const newCenter = sourceViewer.viewport.getCenter();
    // console.log('j newCenter', newCenter);

    const zoomChange = newZoom / sourceLastState.zoom;
    // console.log('j zoom changed', zoomChange);
    const centerOffset = newCenter.minus(sourceLastState.center);

    console.log(
      "j centerOffset",
      centerOffset,
      targetViewer.viewport.getCenter()
    );
    selectedIdRef.current = sourceViewerId;
    targetViewer.viewport.zoomTo(targetViewer.viewport.getZoom() * zoomChange);
    targetViewer.viewport.panTo(
      targetViewer.viewport.getCenter().plus(centerOffset)
    );
    targetViewer.viewport.applyConstraints();
    // Update the last state
    sourceLastState.zoom = newZoom;
    sourceLastState.center = newCenter;
    selectedIdRef.current = null;
  };

  const handleChange = () => {
    if (!isSync) {
      // Capture initial states when enabling sync
      lastStateRef.current.viewer1 = {
        zoom: view1Ref.current.viewport.getZoom(),
        center: view1Ref.current.viewport.getCenter(),
      };
      lastStateRef.current.viewer2 = {
        zoom: view2Ref.current.viewport.getZoom(),
        center: view2Ref.current.viewport.getCenter(),
      };
    }
    setIsSync((prevSync) => !prevSync);
  };

  useEffect(() => {
    if (isSync) {
      console.log("yaha aya isSync = true");
      view1Ref.current.addHandler("zoom", () => {
        syncViewers(view1Ref.current, view2Ref.current, "viewer1");
        // syncViewers(view1Ref.current, view2Ref.current, 'viewer1');
      });
      view1Ref.current.addHandler("pan", () => {
        syncViewers(view1Ref.current, view2Ref.current, "viewer1");
      });

      view2Ref.current.addHandler("zoom", () => {
        syncViewers(view2Ref.current, view1Ref.current, "viewer2");
      });
      view2Ref.current.addHandler("pan", () => {
        syncViewers(view2Ref.current, view1Ref.current, "viewer2");
      });
    }

    return () => {
      console.log("hai call hotay ka", view1Ref.current);
      view1Ref.current.removeAllHandlers("zoom");
      view1Ref.current.removeAllHandlers("pan");

      view2Ref.current.removeAllHandlers("zoom");
      view2Ref.current.removeAllHandlers("pan");
    };
  }, [view1Ref, view2Ref, isSync]);

  return (
    <>
      <input
        type="checkbox"
        name="Sync"
        value={isSync}
        onChange={handleChange}
      />{" "}
      Sync
      <br />
      {isSync ? "yes" : "no"}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ImageViewer key="viewer1" id="viewer1" ref={view1Ref} />
        <ImageViewer key="viewer2" id="viewer2" ref={view2Ref} />
      </div>
    </>
  );
};

export default ImageViewerTray;
