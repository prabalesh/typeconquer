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

export type NotificationType = {
    _id: string;
    user: string;
    type: "challenge" | "friend_request" | "test_result" | "general";
    message: string;
    read: boolean;
    createdAt: Date;
};

export interface Challenge {
    _id: string;
    challenger: {
        _id: string;
        name: string;
    };
    challengedFriend: {
        _id: string;
        name: string;
    };
    typingTestResult: {
        wpm: number;
        accuracy: number;
    };
    friendTestResult?: {
        wpm: number;
        accuracy: number;
    };
    status: "pending" | "accepted" | "declined" | "completed";
    challengeDate: Date;
    completedDate?: Date;
    winner?: {
        _id: string;
        name: string;
    };
}

export interface SubmitChallengeResponse {
    success: boolean;
    challenge: {
        _id: string;
        challenger: { _id: string; name: string; username: string };
        challengedFriend: { _id: string; name: string; username: string };
        typingTestResult: {
            _id: string;
            wpm: number;
            accuracy: number;
            text: string;
            duration: number;
        };
        friendTestResult?: {
            _id: string;
            wpm: number;
            accuracy: number;
            text: string;
            duration: number;
        };
        status: "pending" | "accepted" | "declined" | "completed";
        challengeDate: string;
        completedDate?: string;
        winner: { _id: string };
    };
}

export interface Lesson {
    id: number;
    slug: string;
    name: string;
    words: string;
    mode: "introduction" | "practice";
}

export interface Module {
    id: number;
    slug: string;
    name: string;
    lessons: Lesson[];
}
