import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';


// Legacy Imports
import TextField from '@mui/material/TextField';

// Constants
import { custom_textfield_designs } from './designs';

const CustomTextField = (props)=> {
    // State
    const [state, setState] = useState({
        name:'', 
        type: 'text', 
        label: '', 
        placeholder: '', 
        value: '', 
        disabled: false, 
        required: false,
        error: false, 
        helperText: ''
    });

    // Effects
    useEffect(()=> {
        try{
            setState({
                ...state,
                name: props?.name || '', 
                type: props?.type || 'text', 
                label: props?.label || '', 
                placeholder: props?.placeholder || '', 
                value: props?.value || '', 
                disabled: props?.disabled,
                required: props?.required,
                error: props?.error,
                helperText: props?.helperText || ''
            })
        }catch(err) {
            console.log('[ERROR] Mounting textfield on props');
            console.log(err);
        }
    }, [props]);

    // Event Handlers
    const handleChange = (event)=> {
        const newValue = event.target.value;
        props?.changeHandler({field: state?.name, value: newValue});
    }

    // Renderer
    return(
        <TextField
            name= {state?.name}
            type= {state?.type || 'text'}
            label= {state?.label}
            placeholder= {state?.placeholder}
            variant= {"outlined"}
            value = {state?.value}
            fullWidth = {true}
            margin = {'dense'}
            disabled= {state?.disabled}
            required= {state?.required}
            error={state?.error}
            helperText={state?.helperText || ''}
            sx={custom_textfield_designs}
            onChange = {handleChange}
        />
    )
}

CustomTextField.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    required: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    helperText: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired
};
CustomTextField.defaultProps = {
    name: '',
    type: 'text',
    label: '',
    placeholder: '',
    value: '',
    disabled: false,
    required: false,
    error: false,
    helperText: '',
    changeHandler: ()=> {}
};

export default CustomTextField;