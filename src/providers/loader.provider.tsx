import Loader from "@/components/ui/loader";
import classNames from "classnames";
import { createContext, useContext, useState } from "react";

interface StartLoadingOption {
  isCover: boolean;
}

interface LoaderContextType {
  isLoading: boolean;
  startLoading: (option?: StartLoadingOption) => void;
  stopLoading: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCover, setIsCover] = useState(false);

  const startLoading = (option?: StartLoadingOption): void => {
    const currentOption = option || ({} as StartLoadingOption);

    setIsLoading(true);
    currentOption.isCover && setIsCover(true);
  };

  const stopLoading = (): void => {
    setIsLoading(false);
    setIsCover(false);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && (
        <div
          className={classNames("loader-container", {
            "cover-background": isCover,
          })}
        >
          <Loader></Loader>
        </div>
      )}

      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;

export const useLoader = () => {
  return useContext(LoaderContext);
};
