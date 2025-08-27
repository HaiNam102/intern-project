import React from 'react';

interface Props {
    header: React.ReactNode;
    sidebar: React.ReactNode;
    mainContent: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ header, sidebar, mainContent }) => {
    return (
        <div className="bg-slate-50 min-h-screen p-8">
            {header}
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-lg">
                    {sidebar}
                </aside>
                <main className="w-full lg:w-3/4 bg-white p-6 rounded-xl shadow-lg">
                    {mainContent}
                </main>
            </div>
        </div>
    );
};
