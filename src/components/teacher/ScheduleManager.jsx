import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ScheduleManager = () => {
  const [schedule, setSchedule] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1); // Monday
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [privateClasses, setPrivateClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  useEffect(() => {
    fetchSchedule();
    fetchPrivateClasses();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      // In a real app, this would filter by the current teacher's ID
      const { data, error } = await supabase
        .from("teacher_schedule")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivateClasses = async () => {
    try {
      // In a real app, this would filter by the current teacher's ID
      const { data, error } = await supabase
        .from("private_lessons")
        .select(
          `*, users!private_lessons_student_id_fkey(name), languages(name)`,
        )
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      setPrivateClasses(data || []);
    } catch (error) {
      console.error("Error fetching private classes:", error);
    }
  };

  const handleAddTimeSlot = () => {
    setSelectedDay(1);
    setStartTime("09:00");
    setEndTime("10:00");
    setIsAvailable(true);
    setIsDialogOpen(true);
  };

  const handleSaveTimeSlot = async () => {
    try {
      // Validate time slot
      if (startTime >= endTime) {
        toast({
          title: "Invalid Time Slot",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }

      // Check for overlapping slots
      const overlapping = schedule.some(
        (slot) =>
          slot.day_of_week === selectedDay &&
          ((startTime >= slot.start_time && startTime < slot.end_time) ||
            (endTime > slot.start_time && endTime <= slot.end_time) ||
            (startTime <= slot.start_time && endTime >= slot.end_time)),
      );

      if (overlapping) {
        toast({
          title: "Time Slot Overlap",
          description: "This time slot overlaps with an existing one",
          variant: "destructive",
        });
        return;
      }

      // In a real app, this would use the current teacher's ID
      const teacherId = "current-teacher-id";

      const { error } = await supabase.from("teacher_schedule").insert([
        {
          teacher_id: teacherId,
          day_of_week: selectedDay,
          start_time: startTime,
          end_time: endTime,
          is_available: isAvailable,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Time slot added to your schedule",
      });

      setIsDialogOpen(false);
      fetchSchedule();
    } catch (error) {
      console.error("Error saving time slot:", error);
      toast({
        title: "Error",
        description: "Failed to save time slot",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (slotId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("teacher_schedule")
        .update({ is_available: !currentStatus })
        .eq("id", slotId);

      if (error) throw error;

      setSchedule(
        schedule.map((slot) =>
          slot.id === slotId
            ? { ...slot, is_available: !slot.is_available }
            : slot,
        ),
      );

      toast({
        title: "Success",
        description: `Time slot ${!currentStatus ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimeSlot = async (slotId) => {
    try {
      const { error } = await supabase
        .from("teacher_schedule")
        .delete()
        .eq("id", slotId);

      if (error) throw error;

      setSchedule(schedule.filter((slot) => slot.id !== slotId));

      toast({
        title: "Success",
        description: "Time slot removed from your schedule",
      });
    } catch (error) {
      console.error("Error deleting time slot:", error);
      toast({
        title: "Error",
        description: "Failed to delete time slot",
        variant: "destructive",
      });
    }
  };

  const getUpcomingClasses = () => {
    return privateClasses.filter((lesson) => {
      const lessonDate = new Date(lesson.scheduled_at);
      return (
        lessonDate.getDate() === selectedDate.getDate() &&
        lessonDate.getMonth() === selectedDate.getMonth() &&
        lessonDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teaching Schedule</h1>
        <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Weekly Availability</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading schedule...
                  </TableCell>
                </TableRow>
              ) : schedule.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No time slots added yet. Add your availability to start
                    teaching.
                  </TableCell>
                </TableRow>
              ) : (
                schedule.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{dayNames[slot.day_of_week]}</TableCell>
                    <TableCell>{formatTime(slot.start_time)}</TableCell>
                    <TableCell>{formatTime(slot.end_time)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={slot.is_available}
                          onCheckedChange={() =>
                            handleToggleAvailability(slot.id, slot.is_available)
                          }
                        />
                        <Label>
                          {slot.is_available ? "Available" : "Unavailable"}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">
              Classes on{" "}
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {getUpcomingClasses().length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No classes scheduled for this day
              </p>
            ) : (
              getUpcomingClasses().map((lesson) => {
                const lessonTime = new Date(lesson.scheduled_at);
                return (
                  <div
                    key={lesson.id}
                    className="p-3 border rounded-md bg-slate-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lessonTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          • {lesson.duration_minutes} minutes
                        </p>
                        <p className="text-sm">Student: {lesson.users?.name}</p>
                        <p className="text-sm">
                          Language: {lesson.languages?.name}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
            <DialogDescription>
              Set your availability for teaching private lessons
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day of Week</Label>
              <Select
                value={selectedDay.toString()}
                onValueChange={(value) => setSelectedDay(parseInt(value))}
              >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="available">
                {isAvailable ? "Available" : "Unavailable"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTimeSlot}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManager;
