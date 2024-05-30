import { ZoomOutEasyDown } from "react-native-reanimated";


// Inteface dos usuarios
export interface User {
        name: {
            first: string;
            last: string;
        };
        gender: string,
        email: string;
        picture: {
            large: string; 
        };
        dob:{
            date: string
        }
        location: {
            street: {
              number: number,
              name: string,
            },
            city: string,
            state: string ,
            country: string,
            postcode: number,
         }
         nat : string,
         id :{
            value: string
         } 
}



// Interface da API
export interface UserResponse {
    results: User[];
    info: {
        seed: string;
        results: number;
        page: number;
        version: string;
    };
}

// Interface do filter
export interface UserFilter {
    name: {
        first: string;
        last: string;
    };
}
