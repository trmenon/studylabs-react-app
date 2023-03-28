import React, { useState, forwardRef, useImperativeHandle} from 'react';
import { v4 } from 'uuid';

// Legacy Imports
import Stack from '@mui/material/Stack';

// HOC Imports
import { CustomTextField } from '../../../../common';

const LoginComponent = forwardRef((props, ref)=> {
    // States
    const [state, setState] = useState({
        checkSubmission: false,
        fields: {
            email: {render: '', value: '', error: false, errorText: ''}, 
            password: {render: '', value: '', error: false, errorText: ''}
        }
    });

    // Imperative Handle
    useImperativeHandle(ref, () => ({
        formSubmit: () => {
          submitFormPresets();
          if(
            // state?.checkSubmission === true &&
            state?.fields['email']?.value.length > 0 &&
            state?.fields['password']?.value.length > 0
          ) {
            const data = {
                email: state?.fields['email']?.value,
                password: state?.fields['password']?.value,
            }
            return {validation: true, data: data};
          }
          return {validation: false, data: {}};
        }
    }));

    

    // Event Handlers
    const handleFieldChange = ({field, value})=> {
        let current = state?.fields;
        current[`${field}`] =  {...current[`${field}`], value: value};
        setState({...state, fields: current});
    }

    const submitFormPresets = ()=> {
        try{
            setState({
                ...state,
                checkSubmission: true,
                fields: {
                    email: {
                        ...state.fields['email'],
                        render: v4(), 
                        error: state.fields['email'].value.length < 1? true: false, 
                        errorText: state.fields['email'].value.length < 1? 'Email can not be empty':''
                    },
                    password: {
                        ...state.fields['password'],
                        render: v4(), 
                        error: state.fields['password'].value.length < 1? true: false, 
                        errorText: state.fields['password'].value.length < 1? 'Password can not be empty':''
                    },
                }
            })
        }catch(err) {
            console.log('[ERROR] Login form presets');
            console.log(err)
        }
    }

    return(
        <Stack spacing = {'24px'} sx={{my: '24px'}}>
            <CustomTextField
                name = {'email'}
                type = {'text'}
                label = {'email'}
                placeholder = {'Enter registered email'}
                value = {state?.fields['email']?.value || ''}
                disabled = {false}
                error = {state?.fields['email']?.error}
                required = {true}
                helperText = {state?.fields['email']?.errorText || ''}
                changeHandler = {handleFieldChange}
            />
            <CustomTextField
                name = {'password'}
                type = {'password'}
                label = {'Password'}
                placeholder = {'Enter password'}
                value = {state?.fields['password']?.value || ''}
                disabled = {false}
                error = {state?.fields['password']?.error}
                required = {true}
                helperText = {state?.fields['password']?.errorText || ''}
                changeHandler = {handleFieldChange}
            />
        </Stack>
    )
});

export default LoginComponent;