function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  helpText,
  type = "number",
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        <input
          className="input"
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      </label>
      {helpText ? <span className="help-text">{helpText}</span> : null}
    </div>
  );
}

export default InputField;