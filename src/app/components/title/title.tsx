import './title.css';
import { MainMenu } from '../menu/main-menu/main-menu';
import { useCloseMenuItems } from './use-close-menu-items';
import { useFileMenuItems } from './use-file-menu-items';

export const Title = () => {
  const fileMenuItems = useFileMenuItems();
  const closeMenuItems = useCloseMenuItems();

  return (
    <div className={'main-title'}>
      <MainMenu items={fileMenuItems} />
      <div className={'main-title__title dx-theme-material-typography'}>ETA rescue dump manager </div>
      <MainMenu items={closeMenuItems} />
    </div>
  );
};
