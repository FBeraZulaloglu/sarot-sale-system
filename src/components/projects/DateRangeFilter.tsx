import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, CloudSnowIcon, Leaf, Wind, SunIcon, Home, BedDouble, BadgeCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  onFilter: (
    startDate: Date | undefined, 
    endDate: Date | undefined, 
    season?: string,
    roomCount?: string,
    roomType?: string,
    weekNumber?: string,
    donem?: string | string[],
    donemType?: 'single' | 'multiple' | 'all'
  ) => void;
}

export function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const [roomCount, setRoomCount] = useState<string | undefined>(undefined);
  const [roomType, setRoomType] = useState<string | undefined>(undefined);
  const [donemType, setDonemType] = useState<'single' | 'multiple' | 'all'>('multiple');
  const [selectedDonem, setSelectedDonem] = useState<string | undefined>(undefined);
  const [selectedDonems, setSelectedDonems] = useState<string[]>([]);

  const handleClear = () => {
    setRoomCount(undefined);
    setRoomType(undefined);
    setSelectedDonem(undefined);
    setSelectedDonems([]);
    onFilter(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  };

  const handleApplyFilter = () => {
    if (donemType === 'single') {
      onFilter(undefined, undefined, undefined, roomCount, roomType, undefined, selectedDonem, 'single');
    } else if (donemType === 'multiple') {
      // Use the selectedDonems array for multiple individual selections
      onFilter(undefined, undefined, undefined, roomCount, roomType, undefined, selectedDonems, 'multiple');
    } else { // 'all'
      onFilter(undefined, undefined, undefined, roomCount, roomType, undefined, 'all', 'all');
    }
  };

  // Helper function to calculate the date range for each dönem (week)
  const calculateDonemDates = (donemNumber: number) => {
    // Each dönem is approximately 7 days (1 week)
    // Calculate the start date: January 1st + (donemNumber - 1) * 7 days
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1 + (donemNumber - 1) * 7);
    
    // Calculate the end date: start date + 6 days (to make a full week)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // Format the dates as DD.MM
    const formatShortDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}.${month}`;
    };
    
    return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
  };
  
  // Helper function to get the season abbreviation based on the dönem number
  const getSeasonAbbreviation = (donemNumber: number) => {
    // Winter: December (12) - February (2) - Dönem 48-52, 1-8
    // Spring: March (3) - May (5) - Dönem 9-22
    // Summer: June (6) - August (8) - Dönem 23-35
    // Fall: September (9) - November (11) - Dönem 36-47
    
    let seasonWeek = 0;
    let season = '';
    let icon = null;
    let color = '';
    
    if (donemNumber >= 48 || donemNumber <= 8) {
      // Winter season
      if (donemNumber >= 48) {
        // Weeks 48-52 are the first 5 weeks of winter
        seasonWeek = donemNumber - 47;
      } else {
        // Weeks 1-8 are the last 8 weeks of winter (after week 5)
        seasonWeek = donemNumber + 5;
      }
      season = 'Kış';
      icon = <CloudSnowIcon className="h-3 w-3 text-blue-500" />;
      color = 'text-blue-500';
      return { 
        abbr: 'K', 
        name: season, 
        icon: icon, 
        tooltip: 'Kış Dönemi', 
        seasonWeek: seasonWeek,
        yearWeek: donemNumber,
        color: color
      };
    } else if (donemNumber >= 9 && donemNumber <= 22) {
      // Spring season - 14 weeks total
      seasonWeek = donemNumber - 8; // 9 becomes 1, 22 becomes 14
      season = 'İlkbahar';
      icon = <Leaf className="h-3 w-3 text-green-500" />;
      color = 'text-green-500';
      return { 
        abbr: 'İ', 
        name: season, 
        icon: icon, 
        tooltip: 'İlkbahar Dönemi', 
        seasonWeek: seasonWeek,
        yearWeek: donemNumber,
        color: color
      };
    } else if (donemNumber >= 23 && donemNumber <= 35) {
      // Summer season - 13 weeks total
      seasonWeek = donemNumber - 22; // 23 becomes 1, 35 becomes 13
      season = 'Yaz';
      icon = <SunIcon className="h-3 w-3 text-yellow-500" />;
      color = 'text-yellow-500';
      return { 
        abbr: 'Y', 
        name: season, 
        icon: icon, 
        tooltip: 'Yaz Dönemi', 
        seasonWeek: seasonWeek,
        yearWeek: donemNumber,
        color: color
      };
    } else {
      // Fall season - 12 weeks total
      seasonWeek = donemNumber - 35; // 36 becomes 1, 47 becomes 12
      season = 'Sonbahar';
      icon = <Wind className="h-3 w-3 text-orange-500" />;
      color = 'text-orange-500';
      return { 
        abbr: 'S', 
        name: season, 
        icon: icon, 
        tooltip: 'Sonbahar Dönemi', 
        seasonWeek: seasonWeek,
        yearWeek: donemNumber,
        color: color
      };
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Search className="h-5 w-5" />
          Konut Arama Filtreleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden selection type - default to multiple */}
        <div className="hidden">
          <RadioGroup value={donemType} onValueChange={(value) => setDonemType(value as 'single' | 'multiple' | 'all')}>
            <RadioGroupItem value="multiple" id="multiple-donem" />
          </RadioGroup>
        </div>
        
        {/* Display all 52 dönems as individual selectable items */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <p className="text-base font-medium">Dönem Takvimi (52 hafta)</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
                onClick={() => {
                  // Select all dönems
                  const allDonems = Array.from({ length: 52 }, (_, i) => (i + 1).toString());
                  setSelectedDonems(allDonems);
                  setDonemType('multiple');
                  onFilter(undefined, undefined, undefined, roomCount, roomType, undefined, allDonems, 'multiple');
                }}
              >
                Hepsini Seç
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
                onClick={() => {
                  // Clear all selections
                  setSelectedDonem(undefined);
                  setSelectedDonems([]);
                }}
              >
                Seçimi Temizle
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3 max-h-[600px] overflow-y-auto p-3 border rounded-md">
            {Array.from({ length: 52 }, (_, i) => i + 1).map(num => {
              // Check if this dönem is selected based on the selection mode
              const isSelected = 
                (donemType === 'single' && selectedDonem === num.toString()) || 
                (donemType === 'multiple' && selectedDonems.includes(num.toString())) ||
                donemType === 'all';
                
              return (
                <div
                  key={`donem-${num}`}
                  className={`
                    p-3 rounded-md cursor-pointer text-center transition-all relative
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1' 
                      : 'bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground hover:shadow-md'}
                  `}
                  onClick={() => {
                    // Always use multiple selection mode
                    setDonemType('multiple');
                    // Toggle individual dönems
                    setSelectedDonems(prev => {
                      if (prev.includes(num.toString())) {
                        // If already selected, remove it
                        return prev.filter(d => d !== num.toString());
                      } else {
                        // If not selected, add it
                        return [...prev, num.toString()].sort((a, b) => parseInt(a) - parseInt(b));
                      }
                    });
                  }}
                >
                  {/* Calendar-like number in the top right */}
                  <div className={`absolute top-0 right-1 text-[12px] font-medium ${getSeasonAbbreviation(num).color}`}>
                    {num}
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-sm font-medium" title={`${getSeasonAbbreviation(num).tooltip} - Hafta ${num}`}>
                    {React.cloneElement(getSeasonAbbreviation(num).icon, { className: "h-4 w-4" })}
                    <span>{getSeasonAbbreviation(num).abbr}{getSeasonAbbreviation(num).seasonWeek}</span>
                  </div>
                  <div className="text-xs mt-1 font-medium" title="Tarih Aralığı">{calculateDonemDates(num)}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Room Count Filter */}
        <div className="w-full">
          <p className="text-base font-medium mb-2">Oda Sayısı</p>
          <Select value={roomCount} onValueChange={setRoomCount}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Oda sayısı seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Oda Sayısı</SelectLabel>
                <SelectItem value="1+0">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span>1+0 (Stüdyo)</span>
                  </div>
                </SelectItem>
                <SelectItem value="1+1">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span>1+1</span>
                  </div>
                </SelectItem>
                <SelectItem value="2+1">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span>2+1</span>
                  </div>
                </SelectItem>
                <SelectItem value="3+1">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span>3+1</span>
                  </div>
                </SelectItem>
                <SelectItem value="4+1">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span>4+1</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Room Type Filter */}
        <div className="w-full">
          <p className="text-base font-medium mb-2">Oda Tipi</p>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Oda tipi seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Oda Tipleri</SelectLabel>
                <SelectItem value="standart">
                  <div className="flex items-center">
                    <BedDouble className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Standart</span>
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center">
                    <BadgeCheck className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Premium</span>
                  </div>
                </SelectItem>
                <SelectItem value="engelli">
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 flex items-center justify-center text-green-500">♿</span>
                    <span>Engelli</span>
                  </div>
                </SelectItem>
                <SelectItem value="king-suit">
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 flex items-center justify-center text-purple-500">👑</span>
                    <span>King Suit</span>
                  </div>
                </SelectItem>
                <SelectItem value="suit">
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 flex items-center justify-center text-amber-500">⭐</span>
                    <span>Suit</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={handleClear} className="gap-1 text-sm font-medium">
            <X className="h-4 w-4" />
            Temizle
          </Button>
          <Button onClick={handleApplyFilter} className="gap-1 text-sm font-medium">
            <Search className="h-4 w-4" />
            Filtrele ({selectedDonems.length} dönem seçili)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}