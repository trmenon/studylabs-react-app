import React, { useState, forwardRef, useImperativeHandle} from 'react';
import { v4 } from 'uuid';

// Legacy Imports
import Grid from '@mui/material/Grid';

// HOC Imports
import { CustomTextField } from '../../../../common';

const RegisterComponent = forwardRef((props, ref)=> {
    // States
    const [state, setState] = useState({
        checkSubmission: false,
        fields: {
            firstName: {render: '', value: '', error: false, errorText: ''},
            lastName: {render: '', value: '', error: false, errorText: ''},
            email: {render: '', value: '', error: false, errorText: ''}, 
            password: {render: '', value: '', error: false, errorText: ''},
            confirm_password: {render: '', value: '', error: false, errorText: ''}
        }
    });

    // Imperative Handle
    useImperativeHandle(ref, () => ({
        formSubmit: () => {
            submitFormPresets();
            if(
                // state?.checkSubmission === true &&
                state?.fields['firstName']?.value.length > 0 &&
                state?.fields['lastName']?.value.length > 0 &&
                state?.fields['email']?.value.length > 0 &&
                state?.fields['password']?.value.length > 0 &&
                state?.fields['confirm_password']?.value.length > 0 &&
                state?.fields['confirm_password']?.value === state?.fields['password']?.value
            ) {
                const data = {
                    firstName: state?.fields['firstName']?.value,
                    lastName: state?.fields['lastName']?.value,
                    email: state?.fields['email']?.value,
                    password: state?.fields['password']?.value,
                };
                return {validation: true, data: data};
            }
        return {validation: false, data: {}};
        }
    }));

    

    // Event Handlers
    const handleFieldChange = ({field, value})=> {
        let current = state?.fields;
        current[`${field}`] = {...current[`${field}`], value: value};
        setState({...state, fields: current});
    }

    const submitFormPresets = ()=> {
        setState({
            ...state,
            checkSubmission: true,
            fields: {
                firstName: {
                    ...state.fields['firstName'],
                    render: v4(), 
                    error: state.fields['firstName'].value.length < 1? true: false, 
                    errorText: state.fields['firstName'].value.length < 1?'First name can not be empty':''
                },
                lastName: {
                    ...state.fields['lastName'],
                    render: v4(), 
                    error: state.fields['lastName'].value.length < 1? true: false, 
                    errorText: state.fields['lastName'].value.length < 1?'Last name can not be empty':''
                },
                email: {
                    ...state.fields['email'],
                    render: v4(), 
                    error: state.fields['email'].value.length < 1? true: false, 
                    errorText: state.fields['email'].value.length < 1?'Email can not be empty':''
                },
                password: {
                    ...state.fields['password'],
                    render: v4(), 
                    error: state.fields['password'].value.length < 1? true: false, 
                    errorText: state.fields['password'].value.length < 1?'Password can not be empty':''
                },
                confirm_password: {
                    ...state.fields['confirm_password'],
                    render: v4(), 
                    error: state.fields['confirm_password'].value !== state.fields['password'].value? true: false, 
                    errorText: state.fields['confirm_password'].value !== state.fields['password'].value?'Passwords dont match':''
                },
            }
        })
    }

    // Renderer
    return(
        <Grid container spacing={'12px'}>
            <Grid item xs={12} md={6}>
                <CustomTextField
                    key = {state?.fields['firstName']?.render}
                    name = {'firstName'}
                    type = {'text'}
                    label = {'First Name'}
                    placeholder = {'Enter first name'}
                    value = {state?.fields['firstName']?.value || ''}
                    disabled = {false}
                    required = {true}
                    error = {state?.fields['firstName']?.error}
                    helperText = {state?.fields['firstName']?.errorText || ''}
                    changeHandler = {handleFieldChange}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <CustomTextField
                    key = {state?.fields['lastName']?.render}
                    name = {'lastName'}
                    type = {'text'}
                    label = {'Last Name'}
                    placeholder = {'Enter last name'}
                    value = {state?.fields['lastName']?.value || ''}
                    disabled = {false}
                    required = {true}
                    error = {state?.fields['firstName']?.error}
                    helperText = {state?.fields['lastName']?.errorText || ''}
                    changeHandler = {handleFieldChange}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <CustomTextField
                    key = {state?.fields['email']?.render}
                    name = {'email'}
                    type = {'text'}
                    label = {'Email'}
                    placeholder = {'Enter email'}
                    value = {state?.fields['email']?.value || ''}
                    disabled = {false}
                    required = {true}
                    error = {state?.fields['email']?.error}
                    helperText = {state?.fields['email']?.errorText || ''}
                    changeHandler = {handleFieldChange}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <CustomTextField
                    key = {state?.fields['password']?.render}
                    name = {'password'}
                    type = {'password'}
                    label = {'Password'}
                    placeholder = {'Enter password'}
                    value = {state?.fields['password']?.value || ''}
                    disabled = {false}
                    required = {true}
                    error = {state?.fields['password']?.error}
                    helperText = {state?.fields['password']?.errorText || ''}
                    changeHandler = {handleFieldChange}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <CustomTextField
                    key = {state?.fields['confirm_password']?.render}
                    name = {'confirm_password'}
                    type = {'password'}
                    label = {'Confirm Password'}
                    placeholder = {'Confirm your password'}
                    value = {state?.fields['confirm_password']?.value || ''}
                    disabled = {false}
                    required = {true}
                    error = {state?.fields['confirm_password']?.error}
                    helperText = {state?.fields['confirm_password']?.errorText || ''}
                    changeHandler = {handleFieldChange}
                />
            </Grid>
        </Grid>
    )
});

export default RegisterComponent;