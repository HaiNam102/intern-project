import React from 'react';
import { Shelf, RealtimeShelfDetail } from '../../services/types';

interface Props {
    shelf: Shelf;
    detail: RealtimeShelfDetail | undefined;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
            className="bg-red-500 h-4 rounded-full"
            style={{ width: `${value}%` }}
        ></div>
    </div>
);

export const ShelfDetailRow: React.FC<Props> = React.memo(({ shelf, detail }) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{shelf.name}</td>
            <td className="py-3 px-6 text-center">{detail?.shelfOperatingHours.toFixed(2) || 'N/A'}</td>
            <td className="py-3 px-6 text-center">{detail?.shelfShortageHours.toFixed(2) || 'N/A'}</td>
            <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                    <div className="w-24 mr-2">
                        <ProgressBar value={detail?.shelfShortageRate || 0} />
                    </div>
                    <span className="font-semibold">{`${(detail?.shelfShortageRate || 0).toFixed(2)}%`}</span>
                </div>
            </td>
            <td className="py-3 px-6 text-center">{detail?.timesAlerted || 'N/A'}</td>
            <td className="py-3 px-6 text-center">{detail?.timesReplenished || 'N/A'}</td>
        </tr>
    );
});
