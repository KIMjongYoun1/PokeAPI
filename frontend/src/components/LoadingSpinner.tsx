// frontend/src/components/LoadingSpinner.tsx

interface LoadingSpinnerProps {
    message? : string;
}

const LoadingSpinner = ({ message = "loading..." } : LoadingSpinnerProps) => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingSpinner;