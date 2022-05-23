import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';
import { RescueDumpServerDialog } from '../../components/dialogs/rescue-dump-server-dialog/rescue-dump-server-dialog';
import { DialogProps } from '../../models/dialog-props';
import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';

export type AppSettingPageContextModel = {
  showDialog: (name: string, dialogProps: DialogProps) => void;
  selectedRescueDumpServer: RescueDumpServerModel | null;
  setSelectedRescueDumpServer: Dispatch<SetStateAction<RescueDumpServerModel>>
};

const AppSettingPageContext = createContext({} as AppSettingPageContextModel);

function AppSettingPageContextProvider (props: any) {
  const [selectedRescueDumpServer, setSelectedRescueDumpServer] = useState<RescueDumpServerModel | null>(null);
  const [addServerDialogProps, setAddServerDialogProps] = useState<DialogProps>();

  const showDialog = useCallback((name: string, dialogProps: DialogProps) => {

    switch (name) {
      case 'RescueDumpServerDialog':
        setAddServerDialogProps(dialogProps);
        break;
      default:
        break;
    }
  }, []);

  return (
    <AppSettingPageContext.Provider value={{
      showDialog,
      selectedRescueDumpServer, setSelectedRescueDumpServer
    }} {...props}>
      {props.children}
      {addServerDialogProps && addServerDialogProps.visible ? <RescueDumpServerDialog /> : null}
    </AppSettingPageContext.Provider>
  );
}

const useAppSettingPageContext = () => useContext(AppSettingPageContext);

export { AppSettingPageContextProvider, useAppSettingPageContext };