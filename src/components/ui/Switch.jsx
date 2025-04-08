import React from "react";
import PropTypes from "prop-types";
import { cn } from "../lib/utils"; // Assuming you have a utility for classNames; if not, see note below

const Switch = React.forwardRef(({ checked, onCheckedChange, className, id, disabled = false, ...props }, ref) => {
  const handleChange = (e) => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <label
      className={cn(
        "relative inline-flex items-center cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only peer"
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "w-11 h-6 bg-zinc-700 rounded-full peer",
          "peer-checked:bg-yellow-500",
          "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400",
          "transition-colors duration-200 ease-in-out"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 bg-white rounded-full shadow-md transform",
            "translate-x-1 translate-y-[2px]",
            "peer-checked:translate-x-6",
            "transition-transform duration-200 ease-in-out"
          )}
        />
      </div>
    </label>
  );
});

Switch.displayName = "Switch";

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export { Switch };