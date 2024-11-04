import { UserRegisterDto } from "src/auth/dto/auth.dto";
import { User } from "src/modules/home/types/home";


export function mostLiked(users: User[]){

    const mostLikedUsers = users.sort((a, b) => b.totalLikes - a.totalLikes);

    return mostLikedUsers

}