import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';
import { LoginDialogProps } from '../../models/login-dialog-props';
import { TargetDialogProps } from '../../models/target-dialog-props';
import { LoginDialog } from '../../components/dialogs/login-dialog/login-dialog';
import { TargetServerDialog } from '../../components/dialogs/target-server-dialog/target-server-dialog';
import { DialogProps } from '../../models/dialog-props';
import { RescueDumpListItemModel } from '../../models/rescue-dump-list-item-model';

export type RescueDumpListPageContextModel = {
  showDialog: (name: string, dialogProps: DialogProps) => void;
  selectedRescueDumpListItem: RescueDumpListItemModel | null;
  setSelectedRescueDumpListItem: Dispatch<SetStateAction<RescueDumpListItemModel>>
};

const RescueDumpListPageContext = createContext({} as RescueDumpListPageContextModel);

function RescueDumpListPageProvider (props: any) {
  const [selectedRescueDumpListItem, setSelectedRescueDumpListItem] = useState<RescueDumpListItemModel | null>(null);
  const [loginDialogProps, setLoginDialogProps] = useState<LoginDialogProps>();
  const [targetDialogProps, setTargetDialogProps] = useState<TargetDialogProps>();

  const showDialog = useCallback((name: string, dialogProps: DialogProps) => {
    switch (name) {
      case 'LoginDialog':
        setLoginDialogProps(dialogProps as LoginDialogProps);
        break;
      case 'TargetServerDialog':
        setTargetDialogProps(dialogProps as TargetDialogProps);
        break;
      default:
        break;
    }
  }, []);

  return (
    <RescueDumpListPageContext.Provider
      value={{ showDialog, selectedRescueDumpListItem, setSelectedRescueDumpListItem }}
      {...props}
    >
      {props.children}
      {loginDialogProps && loginDialogProps.visible ? <LoginDialog  {...loginDialogProps} /> : null}
      {targetDialogProps?.visible === true ? <TargetServerDialog {...targetDialogProps} /> : null}
    </RescueDumpListPageContext.Provider>
  );
}

const useRescueDumpListPageContext = () => useContext(RescueDumpListPageContext);

export { RescueDumpListPageProvider, useRescueDumpListPageContext };