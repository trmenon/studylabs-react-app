import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { 
    GateComponent, 
    AdminContainerComponent, 
    TutorContainerComponent, 
    StudentContainerComponent
} from "../components/pages";

// Mounts
// Admin Mounts
import { 
    AdminHomeMount,
    AdminUsersMount,
    AdminSubjectsMount,
    AdminClassesMount,
    AdminReportsMount
} from "../components/mounts/admin-mounts";
// Student Mounts
import {
    StudentHomeMount,
    StudentWalletMount,
    StudentClassMount,
    StudentSessionMount
} from "../components/mounts/student-mounts";
// Tutor Mounts
import { 
    TutorHomeMount,
    TutorClassesMount,
    ClassSessionMount,
    TutorWalletMount 
} from "../components/mounts/tutor-mounts";


function Router(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GateComponent/> }/>
                <Route path="/admin" element={<AdminContainerComponent/>}>
                    <Route path="home" element={<AdminHomeMount/>}/>
                    <Route path="users" element={<AdminUsersMount/>}/>
                    <Route path="subjects" element={<AdminSubjectsMount/>}/>
                    <Route path="classes" element={<AdminClassesMount/>}/>
                    <Route path="reports" element={<AdminReportsMount/>}/>
                </Route>
                <Route path="/tutor" element={<TutorContainerComponent/>}>
                    <Route path="home" element={<TutorHomeMount/>}/>
                    <Route path="classes" element={<TutorClassesMount/>}/>
                    <Route path="classes/:id" element={<ClassSessionMount/>}/>
                    <Route path="wallet" element={<TutorWalletMount/>}/>
                </Route>
                <Route path="/student" element={<StudentContainerComponent/>}>
                    <Route path="home" element={<StudentHomeMount/>}/>
                    <Route path="classes" element={<StudentClassMount/>}/>
                    <Route path="classes/:id" element={<StudentSessionMount/>}/>
                    <Route path="wallet" element={<StudentWalletMount/>}/>
                </Route>
            </Routes>        
        </BrowserRouter>
    );
}


export default Router;