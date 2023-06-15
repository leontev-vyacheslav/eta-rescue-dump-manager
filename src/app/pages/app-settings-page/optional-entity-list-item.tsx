import CheckBox from 'devextreme-react/check-box';
import { useSharedContext } from '../../contexts/shared-context';
import { EntityIcon } from '../../components/icons';
import { OptionalEntityModel } from '../../models/optional-entity-model';


export type OptionalEntityListItemProps = {
    optionalEntity: OptionalEntityModel
}

export const OptionalEntityListItem = ({ optionalEntity }: OptionalEntityListItemProps) => {
    const { appSettings } = useSharedContext();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '80px 200px 125px 125px', alignItems: 'center', height: 50 }}>
            <EntityIcon size={24} />
            <div>{optionalEntity.entityTypeName}</div>

            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <CheckBox
                    defaultValue={optionalEntity.isReserved}
                    onValueChange={(value: boolean) => {
                        const optionalEntityItem = appSettings.optionalEntities.find(o => o.entityTypeName === optionalEntity.entityTypeName);
                        if (optionalEntityItem) {
                            optionalEntityItem.isReserved = value;
                        }
                    }}
                />
                <div>Reserved</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <CheckBox
                    defaultValue={optionalEntity.isRestored}
                    onValueChange={(value: boolean) => {
                        const optionalEntityItem = appSettings.optionalEntities.find(o => o.entityTypeName === optionalEntity.entityTypeName);
                        if (optionalEntityItem) {
                            optionalEntityItem.isRestored = value;
                        }
                    }}
                />
                <div>Restored</div>
            </div>

        </div>
    );
};