import React from "react";
import PropTypes from "prop-types";
import { cn } from "../lib/utils"; // Assuming you have this utility; see note below

const Label = React.forwardRef(({ htmlFor, className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium text-zinc-400",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

Label.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { Label };