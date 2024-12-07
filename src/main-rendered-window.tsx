import './index.css';
import 'devextreme/dist/css/dx.material.orange.dark.css';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/app';

const container = document.getElementById('app-container');
const root = createRoot(container);

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);