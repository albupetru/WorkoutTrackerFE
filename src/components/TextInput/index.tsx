import { ChangeEvent } from "react";
import { stringIsNullUndefOrEmpty } from "../../utils/textUtils";

type TextInputProps = {
  value?: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isPassword?: boolean;
  placeholder?: string;
};

const TextInput = ({
  value,
  label,
  onChange,
  isPassword = false,
  placeholder,
}: TextInputProps) => {
  const type = isPassword ? "password" : "text";

  if (label === null || stringIsNullUndefOrEmpty(label)) {
    return (
      <div className="text-input">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="text-input">
      <label>
        {label}:{" "}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default TextInput;
