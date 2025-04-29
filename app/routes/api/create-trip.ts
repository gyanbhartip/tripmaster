import { appwriteConfig, database } from '@/appwrite/client';
import { generateItineraryPrompt, parseMarkdownToJson } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ID } from 'appwrite';
import { data, type ActionFunctionArgs } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    try {
        const prompt = generateItineraryPrompt({
            numberOfDays,
            country,
            budget,
            interests,
            travelStyle,
            groupType,
        });
        const textResult = await genAI
            .getGenerativeModel({ model: 'gemini-2.0-flash' })
            .generateContent([prompt]);
        const trip = parseMarkdownToJson(textResult.response.text());

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`,
        );

        const imageUrls = (await imageResponse.json()).results
            .slice(0, 3)
            .map(
                result =>
                    result.urls?.regular.replace('fm=jpg', 'fm=webp') || null,
            );

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            },
        );
        return data({
            id: result.$id,
        });
    } catch (error) {
        console.error('Error generating travel plan: ', error);
    }
};
