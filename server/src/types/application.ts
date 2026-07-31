export interface Application {
    _id: string;
    fullname: string;
    registerNumber: string;
    email: string;
    phoneNumber: string;
    dept: string;
    year: "1st" | "2nd" | "3rd" | "4th";
    linkedin: string;
    github?: string;
    resume: string;
    portfolio?: string;
    domainOfInterest: string;
    programmingLanguages: string[];
    whyJoin: string;
    hoursPerWeek: number;
    howDidYouHear: string;
    status: "Pending" | "Interviewed" | "Approved" | "Rejected";
    interviewDate?: string;
    interviewTime?: string;
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}
