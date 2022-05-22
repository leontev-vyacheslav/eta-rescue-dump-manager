import ProgressGear from '../../assets/progress-gears.svg';
import LoadPanel from 'devextreme-react/ui/load-panel';
import './loader.css';

export const Loader = () => {
  return (
    <LoadPanel
      visible={true}
      position={{ of: 'body', offset: { x: 0, y: -10 } }}
      showPane={true}
      shading={true}
      width={180}
      height={70}
      maxWidth={200} maxHeight={70}
      shadingColor={'rgba(0, 0, 0, 0.15)'}
    >
      <img src={ProgressGear}  alt={''}/>
      <span>Loading...</span>
    </LoadPanel>
  );
};