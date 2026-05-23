import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitBar } from './submit';

function App() {
  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          vector
          <small>pipelines / untitled-7</small>
        </div>
        <div className="topbar-tabs">
          <button className="active">Build</button>
          <button>Test</button>
          <button>Deploy</button>
          <button>Logs</button>
        </div>
        <div className="topbar-right">
          <span className="pill"><span className="dot" /> autosaved</span>
        </div>
      </div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitBar />
    </div>
  );
}

export default App;
