// Gedeelde form section component voor status en labels
export const FormSection = ({ label, isLoading, error, loadingText, errorText, children }) => (
  <div className="form-group">
    <label>{label}</label>
    {isLoading ? <p>{loadingText}</p> : error ? <p>{errorText}</p> : children}
  </div>
);
