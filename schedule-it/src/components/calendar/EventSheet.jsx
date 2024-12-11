import React from 'react'
import { Input } from "@/components/ui/input"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MONTHS } from '@/lib/constants'

const EventSheet = ({ searchQuery, onSearchChange, filteredEvents }) => {
    return (
        <SheetContent className="h-full flex flex-col [&>button]:bg-inherit">
            <SheetHeader>
                <SheetTitle>All Events</SheetTitle>
                <Input
                    type="text"
                    placeholder="Search events"
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="mt-2 p-2 border border-gray-300 rounded"
                />
            </SheetHeader>
            <div className="overflow-y-auto flex-grow">
                {filteredEvents.map(event => (
                    <div key={event.id} className="p-2 border-b border-gray-200">
                        <div className="font-bold">{event.name}</div>
                        <div className="text-sm">{event.date} {MONTHS[event.month]} {event.year}</div>
                        <div className="text-xs">{event.startTime} - {event.endTime}</div>
                        <div className="text-xs">{event.description}</div>
                        <div className="text-xs">{event.type}</div>
                    </div>
                ))}
            </div>
        </SheetContent>
    )
}

export default EventSheet