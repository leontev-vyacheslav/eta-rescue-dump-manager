import { createContext, useContext, useState, useCallback } from 'react';
import { AboutDialog } from '../components/dialogs/about-dialog/about-dialog';
import { DialogProps } from '../models/dialog-props';

type CommonDialogsContextModel = {
  showDialog: (name: string, dialogProps: DialogProps) => void;
};

const CommonDialogsContext = createContext({} as CommonDialogsContextModel);

function CommonDialogsContextProvider(props: any) {
  const [aboutDialogProps, setAboutDialogProps] = useState<DialogProps>();

  const showDialog = useCallback((name: string, dialogProps: DialogProps) => {
    switch (name) {
      case AboutDialog.name:
        setAboutDialogProps(dialogProps);
        break;
      default:
        break;
    }
  }, []);

  return (
    <CommonDialogsContext.Provider value={{ showDialog }} {...props}>
      {props.children}
      {aboutDialogProps && aboutDialogProps.visible ? <AboutDialog /> : null}
    </CommonDialogsContext.Provider>
  );
}

const useCommonDialogsContext = () => useContext(CommonDialogsContext);

export { CommonDialogsContextProvider, useCommonDialogsContext };
