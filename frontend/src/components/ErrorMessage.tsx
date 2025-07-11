interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry } : ErrorMessageProps) => {
    return (
        <div className="error">
            {message}
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    다시 시도
                </button>
            )}
        </div>
    ); 
};

export default ErrorMessage;