interface Props {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

const PredictButton = ({ disabled, loading, onClick }: Props) => (
  <div className="flex justify-center mt-6">
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-primary-foreground font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:brightness-110"
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {loading ? "Analyzing..." : "Predict Disease"}
    </button>
  </div>
);

export default PredictButton;
