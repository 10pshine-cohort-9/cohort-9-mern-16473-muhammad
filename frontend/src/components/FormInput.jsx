const FormInput = ({ label, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
          error ? 'border-red-500/50' : 'border-white/10'
        } text-white placeholder-slate-500 outline-none focus:border-violet-400/60 focus:bg-white/[0.08] transition-colors`}
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default FormInput;