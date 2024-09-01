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

export interface ChallengeType {
    _id: string;
    challengeData: Date;
    challengedFriend: string;
    challenger: {
        _id: string;
        name: string;
        username: string;
    };
    createdAt: Date;
    status: "pending" | "accepted" | "declined" | "completed";
    typingTestResult: TestResultType;
}

export interface StatusType {
    message: string | null;
    isLoading: boolean | null;
    isFailure: boolean | null;
    isSuccess: boolean | null;
}
