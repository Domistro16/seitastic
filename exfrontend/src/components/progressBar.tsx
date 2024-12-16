import React from 'react';

type ProgressBarProps = {
    progress: number; // Value between 0 and 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    console.log("progress:", progress)
    return (
        <div className="w-full bg-white rounded-full h-4 overflow-hidden">
            <div
                className="bg-green-700 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            >
            </div>
        </div>
    );
};

export default ProgressBar;
