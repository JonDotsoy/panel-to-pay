import { createElement, FC, SVGAttributes } from "react";
import classNames from "classnames";
import { sizeIcon } from "./types/size-icon";

export const SvgIcon = (elm: JSX.Element) => {
  const el: FC<SVGAttributes<SVGSVGElement> & { size?: sizeIcon; }> = ({ className, size = "5", ...props }) => {
    return (
      createElement(elm.type, {
        ...elm.props,
        ...props,
        className: classNames(className, `w-${size} h-${size}`),
      })
    );
  };

  return el;
};
