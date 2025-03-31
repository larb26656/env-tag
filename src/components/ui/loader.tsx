import loaderAnimation from "@/assets/lotties/loader.json";
import { useLottie } from "lottie-react";

enum LoaderSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
}

interface LoaderProps {
  size?: LoaderSize;
}

const sizeMap = {
  [LoaderSize.XS]: 50,
  [LoaderSize.SM]: 100,
  [LoaderSize.MD]: 150,
  [LoaderSize.LG]: 200,
};

const Loader: React.FC<LoaderProps> = ({ size = LoaderSize.MD }) => {
  const options = {
    animationData: loaderAnimation,
    loop: true,
  };

  const loaderSize = sizeMap[size];
  const { View } = useLottie(options);

  return (
    <>
      <div style={{ width: loaderSize, height: loaderSize }}>{View}</div>
    </>
  );
};

export default Loader;