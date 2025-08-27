import React from "react";
import { Shelf, RealtimeShelfDetail, RealtimeShelfOsaRate } from "../../services/types";

interface ShelfTableProps {
  shelves: Shelf[];
  details: Map<string, RealtimeShelfDetail>;
  osaData: Map<string, RealtimeShelfOsaRate[]>;
}

export const ShelfTable: React.FC<ShelfTableProps> = ({ shelves, details, osaData }) => {
  return (
    <div className="bg-white p-4 border rounded overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Shelf</th>
            <th className="p-2">Shelf operating hours</th>
            <th className="p-2">Shelf shortage hours</th>
            <th className="p-2">Shelf shortage rate</th>
            <th className="p-2">Number of times being alerted</th>
            <th className="p-2">Number of shelf replenishment</th>
          </tr>
        </thead>
        <tbody>
          {shelves.map((shelf) => {
            const detail = details.get(shelf.shelfId);
            const osaList = osaData.get(shelf.shelfId) || [];
            const latestOsa = osaList.length > 0 ? osaList[osaList.length - 1].osaRatePct : null;

            return (
              <tr key={shelf.shelfId} className="border-t">
                <td className="p-2">{shelf.name}</td>
                <td className="p-2">{detail?.shelfOperatingHours ?? "-"}</td>
                <td className="p-2">{detail?.shelfShortageHours ?? "-"}</td>
                <td className="p-2">{latestOsa !== null ? `${latestOsa}%` : "-"}</td>
                <td className="p-2">{detail?.timesAlerted ?? "-"}</td>
                <td className="p-2">{detail?.timesReplenished ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
