function CheckboxField({ label, checked, onChange }) {
  return (
    <div className="checkbox-row">
      <label className="checkbox-label">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>{label}</span>
      </label>
    </div>
  );
}

export default CheckboxField;