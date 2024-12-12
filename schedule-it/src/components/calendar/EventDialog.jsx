import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MONTHS } from '@/lib/constants'
import { generateTimeOptions } from '@/lib/calendarHelpers'

const EventDialog = ({
    isOpen,
    onOpenChange,
    currentDate,
    selectedDay,
    initialData = {},
    onSave,
    onDelete,
    isEditMode = false
}) => {
    const [name, setName] = useState(initialData.name || '')
    const [startTime, setStartTime] = useState(initialData.startTime || '09:00')
    const [endTime, setEndTime] = useState(initialData.endTime || '10:00')
    const [description, setDescription] = useState(initialData.description || '')
    const [type, setType] = useState(initialData.type || '')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (isOpen) {
            setErrorMessage('')
        }
    }, [isOpen])
    
    const handleStartTimeChange = (time) => {
        setStartTime(time)
        if (time >= endTime) {
            setEndTime(time)
        }
    }

    const handleEndTimeChange = (time) => {
        if (time > startTime) {
            setEndTime(time)
        }
    }

    const handleTypeChange = (type) => {
        setType(type)
    }

    const handleSave = () => {
        const eventData = {
            name,
            startTime,
            endTime,
            description,
            date: selectedDay,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            type,
        }

        const result = onSave(eventData, isEditMode ? initialData : null)

        if (result.success) {
            // Reset form and close dialog
            setName('')
            setDescription('')
            setStartTime('09:00')
            setEndTime('10:00')
            onOpenChange(false)
            setType('')
        } else {
            setErrorMessage(result.message)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden p-4">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
                    <DialogDescription>
                        {`${selectedDay} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Name Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

                    {/* Start Time Select */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-time" className="text-right">Start Time</Label>
                        <Select value={startTime} onValueChange={handleStartTimeChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a start time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {generateTimeOptions().map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* End Time Select */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-time" className="text-right">End Time</Label>
                        <Select value={endTime} onValueChange={handleEndTimeChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an end time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {generateTimeOptions().map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

                    {/* Type Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={handleTypeChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem key={"Work"} value={"Work"}>{"Work"}</SelectItem>
                                    <SelectItem key={"Personal"} value={"Personal"}>{"Personal"}</SelectItem>
                                    <SelectItem key={"Other"} value={"Other"}>{"Other"}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {errorMessage && <div className="text-xs text-red-500 mt-1">{errorMessage}</div>}
                    {isEditMode && (
                        <Button
                            className="bg-red-600"
                            onClick={() => {
                                onDelete(initialData.id)
                                onOpenChange(false)
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    <Button onClick={handleSave}>
                        {isEditMode ? 'Save' : 'Add'}
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EventDialog