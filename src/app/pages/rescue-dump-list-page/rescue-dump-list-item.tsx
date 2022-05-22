import './rescue-dump-list-item.css';
import { DateIcon, HashIcon, SizeIcon, PackageIcon } from '../../components/icons';
import { RescueDumpListItemProps } from '../../models/rescue-dump-list-item-props';
import { MainMenu } from '../../components/menu/main-menu/main-menu';
import { useRescueDumpListRowMenuItems } from './use-rescue-dump-list-row-menu-items';
import { useRescueDumpListPageContext } from './rescue-dump-list-page-context';

export const RescueDumpListItem = ({ item }: RescueDumpListItemProps) => {
  const { selectedRescueDumpListItem } = useRescueDumpListPageContext();
  const rowMenuItems = useRescueDumpListRowMenuItems({ item });

  return (
    <div className={'rescue-dump-list-item'}>
      <div className={'rescue-dump-list-item__content'}>
        <>
          <PackageIcon size={20} />
          <div>Name:</div>
          <div>{item.description}</div>
        </>
        <>
          <DateIcon size={20} />
          <div>Date:</div>
          <div>{item.date.toLocaleString('ru-RU')}</div>
        </>
        <>
          <SizeIcon size={20} />
          <div>Size:</div>
          <div>{item.size} kB</div>
        </>
        <>
          <HashIcon size={20} />
          <div>Id:</div>
          <div>{item.fileId}</div>
        </>
      </div>
      <div className={'rescue-dump-list-item__button'}>
        {selectedRescueDumpListItem && selectedRescueDumpListItem.fileId === item.fileId
          ? <MainMenu items={rowMenuItems as any} />
          : null
        }
      </div>
    </div>
  );
};