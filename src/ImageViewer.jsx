import OpenSeadragon from "openseadragon";
import { useEffect, useRef, memo, forwardRef } from "react";

const ImageViewer = forwardRef(({ id, path }, ref) => {
  console.log(`rendered-->${id}`, ref);

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

    ref.current = OpenSeadragon({
      id,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: duomo,
      crossOriginPolicy: "Anonymous",
    //   constrainDuringPan: true,
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

    return () => {
      ref.current.destroy();
    };
  }, []);

  return (
    <>
      <div
        id={id}
        style={{
          width: "500px",
          height: "400px",
          margin: "20px",
          border: "1px solid red",
        }}
      ></div>
    </>
  );
});

export default memo(ImageViewer);
