
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onFilter: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateView, setDateView] = useState<'start' | 'end'>('start');

  const handleDateSelect = (date: Date | undefined) => {
    if (dateView === 'start') {
      setStartDate(date);
      setDateView('end');
    } else {
      // Ensure end date is not before start date
      if (startDate && date && date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setDateView('start');
    }
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFilter(undefined, undefined);
  };

  const handleApplyFilter = () => {
    onFilter(startDate, endDate);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="py-4">
        <CardTitle className="text-md flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Date Range Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <p className="text-sm text-muted-foreground mb-1.5">Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="w-full sm:w-1/2">
            <p className="text-sm text-muted-foreground mb-1.5">End Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleDateSelect}
                  disabled={date => startDate ? date < startDate : false}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClear} className="gap-1">
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Button onClick={handleApplyFilter} className="gap-1">
            <Search className="h-4 w-4" />
            Apply Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
