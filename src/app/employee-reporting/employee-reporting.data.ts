export interface Report {
    id? : string, // FirebaseId
    author?: string,
    recipient?: string[],
    date?: string, //Format YYYYMMDD
    content?: string 
}