import { Route, Routes } from 'react-router-dom';
import { AppSettingsPage } from './pages/app-settings-page/app-settings-page';
import { DeviceReadersHealthStatusPage } from './pages/device-readers-health-status-page/device-readers-health-status-page';
import { RescueDumpContentListPage } from './pages/rescue-dump-content-list-page/rescue-dump-content-list-page';
import { RescueDumpListPage } from './pages/rescue-dump-list-page/rescue-dump-list-page';
import { TextFileViewerPage } from './pages/text-file-viewer-page/text-file-viewer-page';
import { TraceMessageViewer } from './pages/trace-message-viewer-page/trace-message-viewer-page';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={'/'} element={<RescueDumpListPage />} />
      <Route path={'/rescue-dump-content-list'} element={<RescueDumpContentListPage />} />
      <Route path={'/text-file-viewer'} element={<TextFileViewerPage />} />
      <Route path={'/trace-message-viewer'} element={<TraceMessageViewer />} />
      <Route path={'/app-settings'} element={<AppSettingsPage />} />
      <Route path={'/device-readers-health-status'} element={<DeviceReadersHealthStatusPage />} />
    </Routes>
  );
};