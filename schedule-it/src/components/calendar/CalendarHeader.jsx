import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import EventSheet from './EventSheet'
import { exportToCsv, exportToJson } from '@/lib/exportUtils'
import { MONTHS } from '@/lib/constants'

const handleExport = (format, month, year) => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const fileName = `events-${MONTHS[month]}-${year}`;
    if (format === 'json') {
        exportToJson(events, fileName, month, year);
    } else if (format === 'csv') {
        exportToCsv(events, fileName, month, year);
    }
};

const CalendarHeader = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    searchQuery,
    onSearchChange,
    filteredEvents
}) => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex flex-row items-center mb-2 sm:mb-0">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
                <div className="ml-2 flex space-x-1">
                    <Button variant="outline" size="icon" onClick={onPrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={onNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Events</Button>
                    </SheetTrigger>
                    <EventSheet
                        searchQuery={searchQuery}
                        onSearchChange={onSearchChange}
                        filteredEvents={filteredEvents}
                    />
                </Sheet>
                <Button onClick={() => handleExport('json', month, year)}>Export JSON</Button>
                <Button onClick={() => handleExport('csv', month, year)}>Export CSV</Button>
            </div>
        </div>
    )
}

export default CalendarHeader