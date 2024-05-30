import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    name: {
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
    };
}

interface RandomUserResponse {
    results: User[];
    info: {
        page: number;
        seed: string;
        results: number;
    };
}

const fetchRandomUsers = async ({ pageParam = 1 }): Promise<RandomUserResponse> => {
    const { data } = await axios.get<RandomUserResponse>(`https://randomuser.me/api/?results=20&page=${pageParam}`);
    return data;
};

const useFetchRandomUsers = (): UseInfiniteQueryResult<RandomUserResponse, Error> => {
    return useInfiniteQuery<RandomUserResponse, Error>({
        queryKey: ['randomUsers'],
        queryFn: fetchRandomUsers,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage;
        },
        onSuccess: async (data) => {
            if (data.pageParams[0] === 1) {
                // Cache only the first page of results
                await AsyncStorage.setItem('cachedUsers', JSON.stringify(data.pages[0]));
            }
        },
        initialData: async () => {
            const cachedData = await AsyncStorage.getItem('cachedUsers');
            if (cachedData) {
                return {
                    pageParams: [1],
                    pages: [JSON.parse(cachedData)]
                };
            }
            return undefined;
        }
    });
};

export default useFetchRandomUsers;
