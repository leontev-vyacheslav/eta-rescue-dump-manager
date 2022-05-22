import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type RescueDumpContentListPageContextModel = {

  selectedDumpFileName: string | null;
  setSelectedDumpFileName: Dispatch<SetStateAction<string>>;
};

const RescueDumpContentListPageContext = createContext({} as RescueDumpContentListPageContextModel);

function RescueDumpContentListPageContextProvider (props: any) {
  const [selectedDumpFileName, setSelectedDumpFileName] = useState<string | null>(null);

  return (
    <RescueDumpContentListPageContext.Provider value={{
      selectedDumpFileName, setSelectedDumpFileName
    }} {...props}/>
  );
}

const useRescueDumpContentListPage = () => useContext(RescueDumpContentListPageContext);

export { RescueDumpContentListPageContextProvider,  useRescueDumpContentListPage };