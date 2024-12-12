import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import EventSheet from './EventSheet'
import { exportToCsv, exportToJson } from '@/lib/exportUtils'
import { MONTHS } from '@/lib/constants'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

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
    const [menuOpen, setMenuOpen] = useState(false);
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const menuItemClass = "flex justify-center items-center h-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer";

    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold min-w-[200px]">
                    {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
                </h2>
                <div className="flex space-x-1">
                    <Button variant="outline" size="icon" onClick={onPrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={onNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="hidden sm:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
            <div className="sm:hidden">
                <DropdownMenu onOpenChange={(open) => setMenuOpen(open)}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-2">
                        <DropdownMenuItem onSelect={() => handleExport('json', month, year)} className={menuItemClass}>Export JSON</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleExport('csv', month, year)} className={menuItemClass}>Export CSV</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <div className={menuItemClass}>
                                        Events
                                    </div>
                                </SheetTrigger>
                                <EventSheet
                                    searchQuery={searchQuery}
                                    onSearchChange={onSearchChange}
                                    filteredEvents={filteredEvents}
                                />
                            </Sheet>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default CalendarHeader