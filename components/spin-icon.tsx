import { FC, SVGAttributes } from "react";
import { CubeTransparentSolid } from "./icons/solid/cube-transparent";
import { sizeIcon } from "./icons/solid/types/size-icon";
import classNames from "classnames";

export const SpinIcon: FC<SVGAttributes<SVGSVGElement> & {
  size?: sizeIcon | undefined;
  spinning: boolean;
}> = ({ spinning, children, className, ...props }) => {
  if (spinning) return <CubeTransparentSolid className={classNames(className, 'animate-spin')} {...props} />;
  return <>{children}</>;
}
