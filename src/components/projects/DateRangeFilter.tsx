import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, CloudSnowIcon, Leaf, Wind, SunIcon, Home, Calendar, Building2 } from "lucide-react";
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
    roomType?: string, // Keeping for backward compatibility
    weekNumber?: string,
    donem?: string | string[],
    donemType?: 'single' | 'multiple' | 'all',
    floorType?: string
  ) => void;
  onFilterChange?: (filterInfo: {
    selectedDonems: string[];
    roomCount?: string;
    floorType?: string;
  }) => void;
  projectName?: string; // Proje adını ekledik
  projectId?: string; // Proje ID'sini ekledik
}

export function DateRangeFilter({ onFilter, onFilterChange, projectName = 'Sarot Palace', projectId = '1' }: DateRangeFilterProps) {
  const [roomCount, setRoomCount] = useState<string | undefined>(undefined);
  // Removed roomType state as requested
  const [donemType, setDonemType] = useState<'single' | 'multiple' | 'all'>('multiple');
  const [selectedDonem, setSelectedDonem] = useState<string | undefined>(undefined);
  const [selectedDonems, setSelectedDonems] = useState<string[]>([]);
  const [selectedFloorType, setSelectedFloorType] = useState<string>('penthouse');

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        selectedDonems,
        roomCount,
        floorType: selectedFloorType
      });
    }
  }, [selectedDonems, roomCount, selectedFloorType, onFilterChange]);

  const handleClear = () => {
    setRoomCount(undefined);
    // Removed roomType reset as it's no longer needed
    setSelectedDonem(undefined);
    setSelectedDonems([]);
    setSelectedFloorType('penthouse');
    onFilter(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  };

  const handleApplyFilter = () => {
    if (donemType === 'single') {
      onFilter(undefined, undefined, undefined, roomCount, undefined, undefined, selectedDonem, 'single', selectedFloorType);
    } else if (donemType === 'multiple') {
      // Use the selectedDonems array for multiple individual selections
      onFilter(undefined, undefined, undefined, roomCount, undefined, undefined, selectedDonems, 'multiple', selectedFloorType);
    } else { // 'all'
      onFilter(undefined, undefined, undefined, roomCount, undefined, undefined, 'all', 'all', selectedFloorType);
    }
  };

  // Helper function to calculate the date range for each dönem (week)
  const calculateDonemDates = (donemNumber: number, floorType?: string) => {
    // Each dönem is approximately 7 days (1 week)
    const currentYear = new Date().getFullYear();
    let startDate: Date;
    
    // For Sarot Palace, different floors have different starting dates
    // Use the currently selected floor type if none is provided
    const effectiveFloorType = floorType || selectedFloorType;
    
    if (effectiveFloorType === 'A-C') {
      // A, A1, B, C floors start with December 30th of previous year
      startDate = new Date(currentYear - 1, 11, 30); // December 30th of previous year
    } else if (effectiveFloorType === 'D-F') {
      // D, E, F floors start with December 31st of previous year
      startDate = new Date(currentYear - 1, 11, 31); // December 31st of previous year
    } else {
      // Penthouse and other floors start with January 1st
      startDate = new Date(currentYear, 0, 1); // January 1st of current year
    }
    
    // Add (donemNumber - 1) * 7 days to the start date
    startDate.setDate(startDate.getDate() + (donemNumber - 1) * 7);
    
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
        <div className="mb-4">
          <h3 className="text-base font-medium mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            {projectName} Kat Tipi Seçimi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Proje tiplerine göre farklı kat seçimleri göster */}
            {projectId === '1' ? (
              <>
                {/* Sarot Palace için kat tipleri */}
                <div 
                  onClick={() => {
                    setSelectedFloorType('A-C');
                    // Notify parent component about floor type change
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'A-C'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'A-C' 
                      ? 'bg-blue-50 border-blue-300 shadow-sm ring-2 ring-blue-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">A</div>
                    <h4 className="font-medium">A, A1, B, C Katları</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Dönem başlangıcı: <span className="font-medium">30 Aralık</span></p>
                </div>
                
                <div 
                  onClick={() => {
                    setSelectedFloorType('D-F');
                    // Notify parent component about floor type change
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'D-F'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'D-F' 
                      ? 'bg-green-50 border-green-300 shadow-sm ring-2 ring-green-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">D</div>
                    <h4 className="font-medium">D, E, F Katları</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Dönem başlangıcı: <span className="font-medium">31 Aralık</span></p>
                </div>
                
                <div 
                  onClick={() => {
                    setSelectedFloorType('penthouse');
                    // Notify parent component about floor type change
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'penthouse'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'penthouse' 
                      ? 'bg-purple-50 border-purple-300 shadow-sm ring-2 ring-purple-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">P</div>
                    <h4 className="font-medium">Penthouse</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Dönem başlangıcı: <span className="font-medium">1 Ocak</span></p>
                </div>
              </>
            ) : projectId === '2' ? (
              <>
                {/* Sarot Teras Evler için kat tipleri */}
                
                <div
                  onClick={() => {
                    setSelectedFloorType('I-J');
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'I-J'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'I-J' 
                      ? 'bg-cyan-50 border-cyan-300 shadow-sm ring-2 ring-cyan-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold">I</div>
                    <h4 className="font-medium">G, H, I, J Katları</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Dönem başlangıcı: <span className="font-medium">31 Ocak</span></p>
                </div>
              </>
            ) : projectId === '4' ? (
              <>
                {/* Sarot Termal Country için kat tipleri */}
                <div
                  onClick={() => {
                    setSelectedFloorType('A-D-V');
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'A-D-V'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'A-D-V' 
                      ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-2 ring-emerald-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">A</div>
                    <h4 className="font-medium">A, B, C, D, V Katları</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Country Blokları: <span className="font-medium">Grup 1</span></p>
                </div>
                
                <div
                  onClick={() => {
                    setSelectedFloorType('E-H');
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'E-H'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'E-H' 
                      ? 'bg-purple-50 border-purple-300 shadow-sm ring-2 ring-purple-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">E</div>
                    <h4 className="font-medium">E, F, G, H Katları</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Country Blokları: <span className="font-medium">Grup 2</span></p>
                </div>
              </>
            ) : (
              <>
                {/* Diğer projeler için varsayılan kat tipi */}
                <div
                  onClick={() => {
                    setSelectedFloorType('all');
                    if (onFilterChange) {
                      onFilterChange({
                        selectedDonems,
                        roomCount,
                        floorType: 'all'
                      });
                    }
                  }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedFloorType === 'all' 
                      ? 'bg-slate-50 border-slate-300 shadow-sm ring-2 ring-slate-300' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">T</div>
                    <h4 className="font-medium">Tüm Katlar</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-10">Dönem başlangıcı: <span className="font-medium">1 Şubat</span></p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden selection type - default to multiple */}
        <div className="hidden">
          <RadioGroup value={donemType} onValueChange={(value) => setDonemType(value as 'single' | 'multiple' | 'all')}>
            <RadioGroupItem value="multiple" id="multiple-donem" />
          </RadioGroup>
        </div>
        

        
        {/* Display all 52 dönems as individual selectable items */}
        <div className="w-full border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-600" />
              Dönem Takvimi (52 hafta)
            </p>
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
                  onFilter(undefined, undefined, undefined, roomCount, undefined, undefined, allDonems, 'multiple', selectedFloorType);
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
                  <div className="text-xs mt-1 font-medium" title="Tarih Aralığı">{calculateDonemDates(num, selectedFloorType)}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Apartment Type Filter */}
        <div className="w-full mt-6">
          <p className="text-base font-medium mb-2 flex items-center gap-2">
            <Home className="h-5 w-5 text-slate-600" />
            Daire Tipi
          </p>
          <Select value={roomCount} onValueChange={setRoomCount}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Daire tipi seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Daire Tipi</SelectLabel>
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