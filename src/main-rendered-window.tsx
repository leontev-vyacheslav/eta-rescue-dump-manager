import './index.css';
import 'devextreme/dist/css/dx.material.orange.dark.css';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { App } from './app/app';

const container = document.getElementById('app-container');

render(
  <HashRouter>
    <App />
  </HashRouter>,
  container
);