import { createBrowserRouter } from "react-router-dom";
import OpenSeadragonViewer1 from "./OpenSeadragonViewer";
import OpenSeadragonSync from "./OpenSeaDragonSync";
import OpenSeadragonViewer from "./OpenSeaViewer";
import OpenSeaDragonProvider from "./OpenSeaDragonContext";
import SyncButton from "./Sync";
import ViewPortControls from "./Control";
import ImageViewerTray from "./ImageViewerTray";
const tileSource =
  "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi";
const Approch1 = () => {
  return (
    <div className="App">
      <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>
          <a href={`/`}>Approch1</a>
        </div>

        <div>
          <a href={`/approch-2`}>Approch2</a>
        </div>

        <div>
          <a href={`/approch-3`}>Approch3</a>
        </div>
      </nav>
      <h1>OpenSeadragon in React</h1>

      <OpenSeaDragonProvider>
        <SyncButton></SyncButton>
        <div style={{ display: "flex" }}>
          <OpenSeadragonViewer1
            tileSource={tileSource}
            viewPortName={"viewport-1"}
          ></OpenSeadragonViewer1>
          <OpenSeadragonViewer1
            tileSource={tileSource}
            viewPortName={"viewport-2"}
          ></OpenSeadragonViewer1>
        </div>
      </OpenSeaDragonProvider>
    </div>
  );
};

const Approch2 = () => {
  return (
    <div className="App">
      <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>
          <a href={`/`}>Approch1</a>
        </div>

        <div>
          <a href={`/approch-2`}>Approch2</a>
        </div>

        <div>
          <a href={`/approch-3`}>Approch3</a>
        </div>
      </nav>
      <h1>OpenSeadragon in React</h1> <ImageViewerTray />
    </div>
  );
};

const Approch3 = () => {
  return (
    <div className="App">
      <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>
          <a href={`/`}>Approch1</a>
        </div>

        <div>
          <a href={`/approch-2`}>Approch2</a>
        </div>

        <div>
          <a href={`/approch-3`}>Approch3</a>
        </div>
      </nav>
      <h1>OpenSeadragon in React</h1>
      <OpenSeaDragonProvider>
        <SyncButton></SyncButton>
        <div style={{ display: "flex" }}>
          <OpenSeadragonViewer
            tileSource={tileSource}
            viewPortName={"viewport-1"}
          ></OpenSeadragonViewer>
          <OpenSeadragonViewer
            tileSource={tileSource}
            viewPortName={"viewport-2"}
          ></OpenSeadragonViewer>
        </div>
      </OpenSeaDragonProvider>
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Approch1 />,
  },
  {
    path: "/approch-2",
    element: <Approch2 />,
  },
  {
    path: "/approch-3",
    element: <Approch3 />,
  },
]);

export default router;
