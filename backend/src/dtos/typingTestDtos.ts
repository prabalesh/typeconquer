export interface CreateTypingTestResultRequestDto {
    accuracy: number;
    wpm: number;
    duration: number;
    errorPoints: number;
    text: string;
}