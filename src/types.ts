export enum ResourceState {
    META = 1,
    SUMMARY = 2,
    DETAIL = 3
}

export enum Sex {
    MALE = "M",
    FEMALE = "F"
}

export  type SummaryAthlete = {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
    city: string;
    state: string;
    country: string;
    sex: Sex;
    summit: boolean;
}
