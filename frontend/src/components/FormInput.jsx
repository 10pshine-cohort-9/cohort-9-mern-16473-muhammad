const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, error }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={errorId}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
          error ? 'border-red-500/50' : 'border-white/10'
        } text-white placeholder-slate-500 outline-none focus:border-violet-400/60 focus:bg-white/[0.08] transition-colors`}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;