import { UserType } from './user-type.type';

export type ProfileRole = Exclude<UserType, 'guest'>;

export type UserProfile = {
    name: string;
    email: string;
    role: ProfileRole;
};
