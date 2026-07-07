interface Props {
  message: string;
  onRetry?: () => void;
}
export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <p className="text-red-500 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#a85432] text-white rounded-lg text-sm hover:bg-[#8f4328]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
