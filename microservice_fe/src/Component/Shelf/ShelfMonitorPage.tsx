import React, { useState, useMemo, useEffect } from 'react';
import { useShelfWebSocket } from '../../hooks/useShelfWebSocket';
import { DashboardLayout } from './DashboardLayout';
import { Header } from './HeaderShelf';
import { FilterSidebar } from './ShelfFilter';
import { ShelfOsaChartList } from './ShelfOsaChartList';
import { ShelfTable } from './ShelfTable';

interface Shelf {
  shelfId: string;
  name: string;
  area: string;
  emptyRatioThreshold: number;
  isActive: boolean;
  createdAt: number;
}

const ShelfMonitorPage: React.FC = () => {
  const { osaRateData, shelfDetails, isConnected } = useShelfWebSocket();

  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShelfIds, setSelectedShelfIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const res = await fetch('http://localhost:8085/api/shelves');
        console.log('Fetching shelves from API...' + res);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Shelf[] = await res.json();
        setShelves(data);
      } catch (err) {
        console.error('Failed to fetch shelves:', err);
      }
    };

    fetchShelves();
  }, []);

  const allShelves = useMemo(
    () => [...shelves].sort((a, b) => a.name.localeCompare(b.name)),
    [shelves]
  );

  const handleFilterChange = (shelfId: string) => {
    setSelectedShelfIds(prev =>
      prev.includes(shelfId)
        ? prev.filter(id => id !== shelfId)
        : [...prev, shelfId]
    );
  };

  const filteredShelves = useMemo(() => {
    return allShelves.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedShelfIds.length === 0 || selectedShelfIds.includes(s.shelfId))
    );
  }, [allShelves, searchTerm, selectedShelfIds]);

  return (
    <DashboardLayout
      header={<Header isConnected={isConnected} />}
      sidebar={
        <FilterSidebar
          allShelves={allShelves}
          selectedShelfIds={selectedShelfIds}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
        />
      }
      mainContent={
        <div>
          <ShelfOsaChartList shelves={filteredShelves} osaData={osaRateData} />
          <ShelfTable shelves={filteredShelves} details={shelfDetails} osaData={osaRateData}/>
        </div>
      }
    />
  );
};

export default ShelfMonitorPage;
