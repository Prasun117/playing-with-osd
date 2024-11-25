import { useState } from "react";
import { useOpenSeaDragonContext } from "./OpenSeaDragonContext";
import { Point } from "openseadragon";

// todo check the formulae for getBounds from existing center points.
// getBounds can give x, y, width and height.
// to calaculate x = center.x - width/2;
// to calaculate y = center.y -height/2;
// width = 1/zoom;
// width = 1/aspectRatio;

// const getMaxPanValues = (imageBounds, viewportBounds) => {
//   // Calculate the max movement in percentage
//   const maxMoveX = imageBounds.width - viewportBounds.width;
//   const maxMoveY = imageBounds.height - viewportBounds.height;

//   return new Point(maxMoveX, maxMoveY);
// };

const getMaxPanValues = (viewer) => {
  const viewport = viewer.viewport;
  const imageBounds = viewer.world.getItemAt(0).getBounds();
  const image = viewer.world.getItemAt(0);
  const viewportBounds = viewer.viewport.getBounds();
  const center = viewer.viewport.getCenter();
  const constrainedBounds = viewer.viewport.getConstrainedBounds();
  const imageWidth = imageBounds.width;
  // const imageBounds = viewport.getHomeBounds(); // Image bounds in viewport coordinates
  // const viewportBounds = viewport.getBounds(); // Current visible bounds in viewport coordinates

  // const maxPanX =
  //   imageBounds.x + (imageBounds.width - viewportBounds.width) / 2;

  // const maxPanY =
  //   imageBounds.y + (imageBounds.height - viewportBounds.height) / 2;

  const midPointX = imageBounds.width / 2;
  const midPonitY = imageBounds.height / 2;
  const width = 1 / viewport.getZoom();
  const height = 1 / viewport.getAspectRatio();
  console.log("image", image.getBounds());
  // const maxX =
  //   midPointX +
  //   midPointX *
  //     ((imageBounds.width - viewportBounds.width) / viewportBounds.width);

  // const maxY =
  //   midPonitY +
  //   midPonitY *
  //     ((imageBounds.height - viewportBounds.height) / viewportBounds.height) -
  //   viewportBounds.y;

  // const minX =
  //   midPointX -
  //   midPointX *
  //     ((imageBounds.width - viewportBounds.width) / viewportBounds.width);
  // const minY =
  //   midPonitY -
  //   midPonitY *
  //     ((imageBounds.height - viewportBounds.height) / viewportBounds.height);

  return {
    // minX: imageBounds.x - maxPanX, // Minimum X panning value
    // maxX: maxPanX, // Maximum X panning value
    // minY: imageBounds.y - maxPanY, // Minimum Y panning value
    // maxY: maxPanY, // Maximum Y panning value,
    // minX: minX,
    // minY: minY,
    // maxX: maxX,
    // maxY: maxY,
    // imageBounds: imageBounds,
    // viewportBounds: viewportBounds,
    center,
    width,
    height,
    imageBounds,
    viewportBounds,
    viewPortaspectRatio: viewport.getAspectRatio(),
    constrainedBounds
  };
};
const ViewPortControls = () => {
  const { setZoom, setPan, zoom, focusedViewPort, pan, viewPorts } =
    useOpenSeaDragonContext();

  const getViewPortDetails = Object.keys(viewPorts.current).map((vp) => {
    const pan = viewPorts.current[vp].viewport.getCenter();
    const zoom = viewPorts.current[vp].viewport.getZoom();
    const imageBounds = viewPorts.current[vp]?.world
      .getItemAt(0)
      .getBounds(true);
    const viewportBounds = viewPorts.current[vp]?.viewport.getBounds(true);
    console.log(imageBounds, viewportBounds);
    const maxPanValues = getMaxPanValues(viewPorts.current[vp]);
    return (
      <>
        <div>view port: {vp}</div>
        <label> zoom:</label>
        <input disabled type="text" value={zoom} />
        <label>x:</label>
        <input disabled type="text" value={pan.x} />
        <label>y:</label>
        <input disabled type="text" value={pan.y} />
        <label>maxPanValues</label>
        {JSON.stringify(maxPanValues)}
      </>
    );
  });
  return (
    <div style={{ display: "flex" }}>
      <div>focused view port: {focusedViewPort}</div>
      <label> zoom:</label>
      <input
        type="text"
        value={zoom}
        onChange={(e) => setZoom(e.target.value)}
      />
      <label>x:</label>
      <input
        type="text"
        value={pan.x}
        onChange={(e) => setPan({ ...pan, x: e.target.value })}
      />
      <label>y:</label>
      <input
        type="text"
        value={pan.y}
        onChange={(e) => setPan({ ...pan, y: e.target.value })}
      />
      <div>{getViewPortDetails}</div>
    </div>
  );
};

export default ViewPortControls;
