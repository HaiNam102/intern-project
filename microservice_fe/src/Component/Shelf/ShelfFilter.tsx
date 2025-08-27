import React from 'react';
import { Shelf } from '../../services/types';

interface Props {
    allShelves: Shelf[];
    selectedShelfIds: string[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onFilterChange: (shelfId: string) => void;
}

export const FilterSidebar: React.FC<Props> = ({ allShelves, selectedShelfIds, searchTerm, onSearchChange, onFilterChange }) => {
    return (
        <div>
            <h3 className="font-bold text-xl mb-4">Filters</h3>
            <div className="mb-4">
                <p className="font-semibold text-gray-600">Total Shelves: <span className="text-blue-500 font-bold">{allShelves.length}</span></p>
            </div>
            <div className="mb-4">
                <input 
                    type="text"
                    placeholder="Search by shelf name..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
            </div>
            <div>
                <h4 className="font-semibold mb-2 text-gray-800">Filter by Shelf</h4>
                <div className="max-h-96 overflow-y-auto pr-2">
                    {allShelves.map(shelf => (
                        <label key={shelf.shelfId} htmlFor={`shelf-${shelf.shelfId}`} className="flex items-center mb-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <input 
                                type="checkbox"
                                id={`shelf-${shelf.shelfId}`}
                                checked={selectedShelfIds.includes(shelf.shelfId)}
                                onChange={() => onFilterChange(shelf.shelfId)}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{shelf.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};