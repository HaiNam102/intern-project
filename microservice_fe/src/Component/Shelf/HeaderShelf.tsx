import React from 'react';

interface Props {
    isConnected: boolean;
}

export const Header: React.FC<Props> = ({ isConnected }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = `From 7:00 AM Apr 8, 2025 to ${currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg p-6 mb-8 rounded-xl flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-extrabold">Real-time Shelf Monitoring</h1>
                <p className="text-sm text-blue-100">{formattedDate}</p>
            </div>
            <div className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-3 ${isConnected ? 'bg-green-400 animate-pulse-green' : 'bg-red-500'}`}></span>
                <span className="font-semibold">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </header>
    );
};