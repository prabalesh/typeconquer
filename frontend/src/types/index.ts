export interface TestResultType {
    _id: string;
    userID: string;
    accuracy: number;
    wpm: number;
    duration: number;
    testDate: Date;
    errorPoints: number[];
    text: string;
}

export interface BestWpmResultType {
    _id: string;
    userID: string;
    bestWPM: number;
    testResultID: string;
}
