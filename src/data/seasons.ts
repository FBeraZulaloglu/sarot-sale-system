import { Season, Period } from "@/types";

/**
 * Mock seasons data for the Sarot Sale System
 * This data represents seasons and periods (dönem) for reservations
 */

// Define seasons
export const MOCK_SEASONS: Season[] = [
  {
    id: "season-1",
    name: "Kış 2023-2024",
    season_start: new Date(2023, 11, 1), // December 1, 2023
    season_end: new Date(2024, 1, 29),  // February 29, 2024
    periods: [] // Will be populated after periods are defined
  },
  {
    id: "season-2",
    name: "İlkBahar 2024",
    season_start: new Date(2024, 2, 1),  // March 1, 2024
    season_end: new Date(2024, 4, 31),   // May 31, 2024
    periods: []
  },
  {
    id: "season-3",
    name: "Yaz 2024",
    season_start: new Date(2024, 5, 1),  // June 1, 2024
    season_end: new Date(2024, 7, 31),   // August 31, 2024
    periods: []
  },
  {
    id: "season-4",
    name: "Sonbahar 2024",
    season_start: new Date(2024, 8, 1),  // September 1, 2024
    season_end: new Date(2024, 10, 30),  // November 30, 2024
    periods: []
  }
];

// Define periods (dönem)
export const MOCK_PERIODS: Period[] = [
  // Winter periods (Dönem 48-52, 1-8)
  {
    id: "period-48",
    name: "Dönem 48",
    weekNumber: 48,
    startDate: new Date(2023, 11, 1),  // December 1, 2023
    endDate: new Date(2023, 11, 7),    // December 7, 2023
    seasonId: "season-1"
  },
  {
    id: "period-49",
    name: "Dönem 49",
    weekNumber: 49,
    startDate: new Date(2023, 11, 8),  // December 8, 2023
    endDate: new Date(2023, 11, 14),   // December 14, 2023
    seasonId: "season-1"
  },
  {
    id: "period-50",
    name: "Dönem 50",
    weekNumber: 50,
    startDate: new Date(2023, 11, 15), // December 15, 2023
    endDate: new Date(2023, 11, 21),   // December 21, 2023
    seasonId: "season-1"
  },
  {
    id: "period-51",
    name: "Dönem 51",
    weekNumber: 51,
    startDate: new Date(2023, 11, 22), // December 22, 2023
    endDate: new Date(2023, 11, 28),   // December 28, 2023
    seasonId: "season-1"
  },
  {
    id: "period-52",
    name: "Dönem 52",
    weekNumber: 52,
    startDate: new Date(2023, 11, 29), // December 29, 2023
    endDate: new Date(2024, 0, 4),     // January 4, 2024
    seasonId: "season-1"
  },
  {
    id: "period-1",
    name: "Dönem 1",
    weekNumber: 1,
    startDate: new Date(2024, 0, 5),   // January 5, 2024
    endDate: new Date(2024, 0, 11),    // January 11, 2024
    seasonId: "season-1"
  },
  {
    id: "period-2",
    name: "Dönem 2",
    weekNumber: 2,
    startDate: new Date(2024, 0, 12),  // January 12, 2024
    endDate: new Date(2024, 0, 18),    // January 18, 2024
    seasonId: "season-1"
  },
  {
    id: "period-3",
    name: "Dönem 3",
    weekNumber: 3,
    startDate: new Date(2024, 0, 19),  // January 19, 2024
    endDate: new Date(2024, 0, 25),    // January 25, 2024
    seasonId: "season-1"
  },
  {
    id: "period-4",
    name: "Dönem 4",
    weekNumber: 4,
    startDate: new Date(2024, 0, 26),  // January 26, 2024
    endDate: new Date(2024, 1, 1),     // February 1, 2024
    seasonId: "season-1"
  },
  {
    id: "period-5",
    name: "Dönem 5",
    weekNumber: 5,
    startDate: new Date(2024, 1, 2),   // February 2, 2024
    endDate: new Date(2024, 1, 8),     // February 8, 2024
    seasonId: "season-1"
  },
  {
    id: "period-6",
    name: "Dönem 6",
    weekNumber: 6,
    startDate: new Date(2024, 1, 9),   // February 9, 2024
    endDate: new Date(2024, 1, 15),    // February 15, 2024
    seasonId: "season-1"
  },
  {
    id: "period-7",
    name: "Dönem 7",
    weekNumber: 7,
    startDate: new Date(2024, 1, 16),  // February 16, 2024
    endDate: new Date(2024, 1, 22),    // February 22, 2024
    seasonId: "season-1"
  },
  {
    id: "period-8",
    name: "Dönem 8",
    weekNumber: 8,
    startDate: new Date(2024, 1, 23),  // February 23, 2024
    endDate: new Date(2024, 1, 29),    // February 29, 2024
    seasonId: "season-1"
  },
  
  // Spring periods (Dönem 9-22)
  {
    id: "period-9",
    name: "Dönem 9",
    weekNumber: 9,
    startDate: new Date(2024, 2, 1),   // March 1, 2024
    endDate: new Date(2024, 2, 7),     // March 7, 2024
    seasonId: "season-2"
  },
  {
    id: "period-10",
    name: "Dönem 10",
    weekNumber: 10,
    startDate: new Date(2024, 2, 8),   // March 8, 2024
    endDate: new Date(2024, 2, 14),    // March 14, 2024
    seasonId: "season-2"
  },
  {
    id: "period-11",
    name: "Dönem 11",
    weekNumber: 11,
    startDate: new Date(2024, 2, 15),  // March 15, 2024
    endDate: new Date(2024, 2, 21),    // March 21, 2024
    seasonId: "season-2"
  },
  // ... more spring periods (12-22)
  
  // Summer periods (Dönem 23-35)
  {
    id: "period-23",
    name: "Dönem 23",
    weekNumber: 23,
    startDate: new Date(2024, 5, 1),   // June 1, 2024
    endDate: new Date(2024, 5, 7),     // June 7, 2024
    seasonId: "season-3"
  },
  {
    id: "period-24",
    name: "Dönem 24",
    weekNumber: 24,
    startDate: new Date(2024, 5, 8),   // June 8, 2024
    endDate: new Date(2024, 5, 14),    // June 14, 2024
    seasonId: "season-3"
  },
  {
    id: "period-25",
    name: "Dönem 25",
    weekNumber: 25,
    startDate: new Date(2024, 5, 15),  // June 15, 2024
    endDate: new Date(2024, 5, 21),    // June 21, 2024
    seasonId: "season-3"
  },
  {
    id: "period-26",
    name: "Dönem 26",
    weekNumber: 26,
    startDate: new Date(2024, 5, 22),  // June 22, 2024
    endDate: new Date(2024, 5, 28),    // June 28, 2024
    seasonId: "season-3"
  },
  {
    id: "period-27",
    name: "Dönem 27",
    weekNumber: 27,
    startDate: new Date(2024, 5, 29),  // June 29, 2024
    endDate: new Date(2024, 6, 5),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-28",
    name: "Dönem 28",
    weekNumber: 28,
    startDate: new Date(2024, 6, 6),  // June 29, 2024
    endDate: new Date(2024, 6, 12),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-29",
    name: "Dönem 29",
    weekNumber: 29,
    startDate: new Date(2024, 6, 6),  // June 29, 2024
    endDate: new Date(2024, 6, 12),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-30",
    name: "Dönem 30",
    weekNumber: 30,
    startDate: new Date(2024, 6, 13),  // June 29, 2024
    endDate: new Date(2024, 6, 19),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-31",
    name: "Dönem 31",
    weekNumber: 31,
    startDate: new Date(2024, 6, 20),  // June 29, 2024
    endDate: new Date(2024, 6, 26),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-32",
    name: "Dönem 32",
    weekNumber: 32,
    startDate: new Date(2024, 6, 27),  // June 29, 2024
    endDate: new Date(2024, 7, 3),     // July 5, 2024
    seasonId: "season-3"
  }, 
  {
    id: "period-33",
    name: "Dönem 33",
    weekNumber: 33,
    startDate: new Date(2024, 7, 4),  // June 29, 2024
    endDate: new Date(2024, 7, 10),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-34",
    name: "Dönem 34",
    weekNumber: 34,
    startDate: new Date(2024, 7, 11),  // June 29, 2024
    endDate: new Date(2024, 7, 17),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-35",
    name: "Dönem 35",
    weekNumber: 35,
    startDate: new Date(2024, 7, 18),  // June 29, 2024
    endDate: new Date(2024, 7, 24),     // July 5, 2024
    seasonId: "season-3"
  },
  {
    id: "period-36",
    name: "Dönem 36",
    weekNumber: 36,
    startDate: new Date(2024, 8, 1),   // September 1, 2024
    endDate: new Date(2024, 8, 7),     // September 7, 2024
    seasonId: "season-4"
  },
  {
    id: "period-37",
    name: "Dönem 37",
    weekNumber: 37,
    startDate: new Date(2024, 8, 8),   // September 8, 2024
    endDate: new Date(2024, 8, 14),    // September 14, 2024
    seasonId: "season-4"
  },
  {
    id: "period-40",
    name: "Dönem 40",
    weekNumber: 40,
    startDate: new Date(2024, 9, 1),   // October 1, 2024
    endDate: new Date(2024, 9, 7),     // October 7, 2024
    seasonId: "season-4"
  },
  {
    id: "period-45",
    name: "Dönem 45",
    weekNumber: 45,
    startDate: new Date(2024, 10, 5),  // November 5, 2024
    endDate: new Date(2024, 10, 11),   // November 11, 2024
    seasonId: "season-4"
  }
];

// Populate the periods in each season
MOCK_SEASONS.forEach(season => {
  season.periods = MOCK_PERIODS.filter(period => period.seasonId === season.id);
});

// Helper function to find a period by week number
export function getPeriodByWeekNumber(weekNumber: number): Period | undefined {
  return MOCK_PERIODS.find(period => period.weekNumber === weekNumber);
}

// Helper function to find a season by date
export function getSeasonByDate(date: Date): Season | undefined {
  return MOCK_SEASONS.find(season => 
    date >= season.season_start && date <= season.season_end
  );
}

// Helper function to find a period by date
export function getPeriodByDate(date: Date): Period | undefined {
  return MOCK_PERIODS.find(period => 
    date >= period.startDate && date <= period.endDate
  );
}
