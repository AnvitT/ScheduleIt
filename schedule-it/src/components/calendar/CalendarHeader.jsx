import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import EventSheet from './EventSheet'

const CalendarHeader = ({ 
    currentDate, 
    onPrevMonth, 
    onNextMonth, 
    searchQuery, 
    onSearchChange, 
    filteredEvents 
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
            </h2>
            <div className="flex space-x-2">
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
                <Button variant="outline" size="icon" onClick={onPrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={onNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default CalendarHeader