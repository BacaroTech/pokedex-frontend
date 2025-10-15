export interface IApiResource {
    url: string;
}

export interface IApiResourceList {
    count: number;
    next: string;
    previous: string;
    results: Array<IApiResource>;
}