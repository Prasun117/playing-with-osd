import "./styles.css";
import OpenSeadragonViewer from "./OpenSeadragonViewer";
import OpenSeadragonSync from "./OpenSeaDragonSync";
// import OpenSeadragonViewer from "./OpenSeaViewer";
import OpenSeaDragonProvider from "./OpenSeaDragonContext";
import SyncButton from "./Sync";
import ViewPortControls from "./Control";
import ImageViewerTray from "./ImageViewerTray";
export default function App() {
  const tileSource =
    "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi";

  return (
    <div className="App">
      <h1>OpenSeadragon in React</h1>

      {/* <OpenSeaDragonProvider>
        <SyncButton></SyncButton>
        <ViewPortControls />
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
      </OpenSeaDragonProvider> */}

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
          <OpenSeadragonViewer
            tileSource={tileSource}
            viewPortName={"viewport-3"}
          ></OpenSeadragonViewer>
        </div>
      </OpenSeaDragonProvider>

      {/* <OpenSeadragonViewer tileSource={tileSource} />  */}
      {/* <OpenSeadragonSync /> */}
      {/* <ImageViewerTray /> */}
    </div>
  );
}
