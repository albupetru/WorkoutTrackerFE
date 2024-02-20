import React from "react";
import PropTypes from "prop-types";
import { stringIsNullUndefOrEmpty } from "../../utils/textUtils";

const TextInput = ({ value, label, onChange, isPassword = false }) => {
  const type = isPassword ? "password" : "text";

  if (stringIsNullUndefOrEmpty(label)) {
    return (
      <div className="text-input">
        <input type={type} value={value} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="text-input">
      <label>
        {label}: <input type={type} value={value} onChange={onChange} />
      </label>
    </div>
  );
};

TextInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isPassword: PropTypes.bool,
};

export default TextInput;
