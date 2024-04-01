import { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { stringIsNullUndefOrEmpty } from "../../utils/textUtils";

type TextInputProps = {
  value?: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isPassword?: boolean;
};

const TextInput = ({
  value,
  label,
  onChange,
  isPassword = false,
}: TextInputProps) => {
  const type = isPassword ? "password" : "text";

  if (label === null || stringIsNullUndefOrEmpty(label)) {
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
