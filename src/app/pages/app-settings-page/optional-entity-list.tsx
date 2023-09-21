import { List } from 'devextreme-react/list';
import { OptionalEntityModel } from '../../models/optional-entity-model';
import { useSharedContext } from '../../contexts/shared-context';
import { OptionalEntityListItem } from './optional-entity-list-item';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';

export const OptionalEntityList = () => {
    const { appSettings } = useSharedContext();

    return (
        <>
            <PageToolbar title={'Optional serviced entity items'} menuItems={null} />
            <List
                className='rescue-dump-server-list'
                height={250}
                dataSource={appSettings ? appSettings.optionalEntities : []}
                selectionMode={'single'}
                itemRender={(item: OptionalEntityModel) => <OptionalEntityListItem optionalEntity={item} />}
                onItemClick={(e) => {
                    console.log(e);
                }}
            />
        </>
    );
};
