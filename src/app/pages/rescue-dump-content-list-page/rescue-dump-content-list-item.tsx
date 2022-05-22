import '../rescue-dump-list-page/rescue-dump-list-item.css';
import { RescueDumpContentListItemProps } from '../../models/rescue-dump-content-list-item-props';
import { FileIcon, DateIcon, SizeIcon } from '../../components/icons';
import { MainMenu } from '../../components/menu/main-menu/main-menu';
import { useRescueDumpContentListRowMenuItems } from './use-rescue-dump-content-list-row-menu-items';
import { useRescueDumpContentListPage } from './rescue-dump-content-list-page-context';

export const RescueDumpContentListItem = ({ rescueDumpEntry }: RescueDumpContentListItemProps) => {
  const { selectedDumpFileName } = useRescueDumpContentListPage();
  const rowMenuItems = useRescueDumpContentListRowMenuItems(rescueDumpEntry);

  return (
    <div className={'rescue-dump-list-item'}>
      <div className={'rescue-dump-list-item__content'}>
        <>
          <FileIcon size={20} />
          <div>File:</div>
          <div>{rescueDumpEntry.name}</div>
        </>
        <>
          <DateIcon size={20} />
          <div>Date:</div>
          <div>{rescueDumpEntry.date.toLocaleString('ru-RU')}</div>
        </>
        <>
          <SizeIcon size={20} />
          <div>Size:</div>
          <div>{rescueDumpEntry.compressedSize} / {rescueDumpEntry.size} B</div>
        </>
      </div>
      <div className={'rescue-dump-list-item__button'}>
        {selectedDumpFileName === rescueDumpEntry.name
          ? <MainMenu items={rowMenuItems} />
          : null
        }
      </div>
    </div>
  );
};