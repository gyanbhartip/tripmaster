import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
    return dayjs(dateString).format('MMMM DD, YYYY');
};

export function parseMarkdownToJson(markdownText: string): unknown | null {
    const regex = /```json\n([\s\S]+?)\n```/;
    const match = markdownText.match(regex);

    if (match?.[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }
    console.error('No valid JSON found in markdown text.');
    return null;
}

export function parseTripData(jsonString: string): Trip | null {
    try {
        const data: Trip = JSON.parse(jsonString);

        return data;
    } catch (error) {
        console.error('Failed to parse trip data:', error);
        return null;
    }
}

export function getFirstWord(input = ''): string {
    return input.trim().split(/\s+/)[0] || '';
}

export const calculateTrendPercentage = (
    countOfThisMonth: number,
    countOfLastMonth: number,
): TrendResult => {
    if (countOfLastMonth === 0) {
        return countOfThisMonth === 0
            ? { trend: 'no change', percentage: 0 }
            : { trend: 'increment', percentage: 100 };
    }

    const change = countOfThisMonth - countOfLastMonth;
    const percentage = Math.abs((change / countOfLastMonth) * 100);

    if (change > 0) {
        return { trend: 'increment', percentage };
    }
    if (change < 0) {
        return { trend: 'decrement', percentage };
    }
    return { trend: 'no change', percentage: 0 };
};

export const formatKey = (key: keyof TripFormData) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
};

export const generateItineraryPrompt = ({
    numberOfDays,
    country,
    budget,
    interests,
    travelStyle,
    groupType,
}) => `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interests},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;
