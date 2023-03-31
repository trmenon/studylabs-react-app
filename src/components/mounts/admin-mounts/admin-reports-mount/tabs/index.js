import UserReport from "./user-reports";
import CourseReport from "./course-reports";
import SubjectReport from "./subject-reports";

export const TABS = [
    {
        key: 'ADMIN-REPORTS-USER-REPORT-KEY',
        label: 'User Reports',
        value: 'USER',
        node: <UserReport/>
    },
    {
        key: 'ADMIN-REPORTS-SUBJECT-REPORT-KEY',
        label: 'Subject Reports',
        value: 'SUBJECT',
        node: <SubjectReport/>,
    },
    {
        key: 'ADMIN-REPORTS-COURSE-REPORT-KEY',
        label: 'Course Reports',
        value: 'COURSE',
        node: <CourseReport/>,
    },
]