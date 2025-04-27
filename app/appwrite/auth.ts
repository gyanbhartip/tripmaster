import { ID, OAuthProvider, Query } from 'appwrite';
import { account, appwriteConfig, database } from './client';
import { redirect } from 'react-router';

const { databaseId, userCollectionId } = appwriteConfig;

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(OAuthProvider.Google);
    } catch (error) {
        console.error('Error during OAuth2 session creation: ', error);
    }
};

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error('Error during logout: ', error);
    }
};

export const getUser = async () => {
    try {
        const user = account.get();
        if (!user) {
            return redirect('/sign-in');
        }
        const { documents } = await database.listDocuments(
            databaseId,
            userCollectionId,
            [
                Query.equal('accountId', (await user).$id),
                Query.select([
                    'name',
                    'email',
                    'imageUrl',
                    'joinedAt',
                    'accountId',
                ]),
            ],
        );
        return documents.length > 0 ? documents[0] : redirect('/sign-in');
    } catch (error) {
        console.error('Error fetching user: ', error);
        return null;
    }
};

export const getGooglePicture = async () => {
    try {
        const session = await account.getSession('current');
        const OAuthToken = session.providerAccessToken;
        if (!OAuthToken) {
            console.warn('No OAuth token available');
            return null;
        }
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${OAuthToken}`,
                },
            },
        );

        if (!response.ok) {
            console.warn(
                'Failed to fetch profile photo from Google People API',
            );
            return null;
        }
        const data = await response.json();

        const photoUrl =
            data?.photos?.length > 0 ? (data.photos[0].url as string) : null;

        return photoUrl;
    } catch (error) {
        console.error('Error fetching Google picture: ', error);
        return null;
    }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();

        const { documents } = await database.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', user.$id)],
        );
        if (documents.length > 0) {
            return documents[0];
        }

        const imageUrl = await getGooglePicture();

        const newUser = await database.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || '',
                joinedAt: new Date().toISOString(),
            },
        );

        return newUser;
    } catch (error) {
        console.error('Error storing user data: ', error);
    }
};

export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', id)],
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.error('Error fetching user: ', error);
    }
};
