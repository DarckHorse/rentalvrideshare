function SelectField({ label, value, onChange, options, helpText }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        <select className="input" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {helpText ? <span className="help-text">{helpText}</span> : null}
    </div>
  );
}

export default SelectField;