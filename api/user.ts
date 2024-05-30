// # Faço a requição na API

import axios from "axios";
import {UserResponse} from '@/Interfaces/UserInterface'
import {useInfiniteQuery } from '@tanstack/react-query'

const API_URL = 'https://randomuser.me/api/';

export function UseUsersData(){
    const getUsers = async({ pageParam= 20  }): Promise<UserResponse>=> {
        const { data } = await axios.get<UserResponse>(`${API_URL}`,{

            params:{
                results: pageParam
            }
        });
        // Introduz um atraso de 2 segundos (2000 milissegundos)
        await new Promise(resolve => setTimeout(resolve, 3000));
        return data
    }
    
     
    return useInfiniteQuery<UserResponse>({
        queryKey: ['users'],
        queryFn: getUsers,
        getNextPageParam: () =>  + 20
        //getNextPageParam: (lastPage,pages) => lastPage.info.results + 20
    });

}



/*
    export async function getUsers(): Promise<UserResponse> {
    const { data } = await axios.get<UserResponse>(`${API_URL}?results=${RESULTS_PER_PAGE}`);
    // Introduz um atraso de 2 segundos (2000 milissegundos)
       await new Promise(resolve => setTimeout(resolve, 3000));
    return data;
}



export function UseUsersData(){
    
    const userQuery = useQuery<UserResponse>({
        queryKey: ['users'],
        queryFn: getUsers,
    });

        if (userQuery.isLoading) {
            // Loading state
            return { isLoading: true };
        }

        if (userQuery.error) {
            // Error state
            //console.error("Error fetching product data:", userQuery.error);
            return { error: userQuery.error };
        }
        // Successful state
        return {
            data: userQuery.data?.results,
            isLoading: userQuery.isLoading,
        };
    }

*/