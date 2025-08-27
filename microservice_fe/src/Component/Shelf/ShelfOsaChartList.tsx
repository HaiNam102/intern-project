import React from 'react';
import { Shelf, RealtimeShelfOsaRate } from '../../services/types';
import { ShelfOsaChart } from './OSARateChart';

interface Props {
    shelves: Shelf[];
    osaData: Map<string, RealtimeShelfOsaRate[]>;
}

export const ShelfOsaChartList: React.FC<Props> = ({ shelves, osaData }) => {
    return (
        <div className="mb-10">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800">OSA Rate by Shelf</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {shelves.map(shelf => (
                    <ShelfOsaChart key={shelf.shelfId} shelf={shelf} data={osaData.get(shelf.shelfId) || []} />
                ))}
            </div>
        </div>
    );
};
