/**
 * Get all validation functions
 * @returns Object
 */
const getValidators = () => {
    return {
        /**
         * Checks if the value is not undefined/null/empty
         * @param {*} value 
         * @returns bool
         */
        required: (value) => {
            return value !== undefined && value !== null && value !== "";
        },
    
        /**
         * Checks if value is of type string
         * @param {*} value 
         * @returns bool
         */
        string: (value) => {
            return typeof value === 'string';
        },
    
        /**
         * Checks if value matches email regex
         * @param {*} value 
         * @returns bool
         */
        email: (value) => {
            // Code copied from: https://stackoverflow.com/a/46181
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        },
    
        /**
         * Checks if value is in values
         * @param {*} value 
         * @param {Array} values 
         * @returns bool
         */
        in: (value, values) => {
            return values.includes(value);
        },
    };
}

/**
 * Validate specific field
 * @param {*} field 
 * @param {*} validationRules 
 * @param {boolean} silent 
 * @returns 
 */
const validateField = (field, validationRules, silent = false) => {
    const validators = getValidators(); // Fns
    const name = field.getAttribute('name');

    // Make each field valid again, so red outline does not persist
    if(!silent) {
        field.classList.remove('invalid');
        field.addEventListener('input', function() {
            field.classList.remove('invalid');
        });
    }

    // Assume field is valid (if no rules are defined)
    let isValid = true;

    // Get an array of validation rules based on field name
    const validation = validationRules[name];

    // Check if rules actually exists
    if(validation) {
        // Go through each rule and validate the fields value against them
        for(const rule of validation) {
            if(rule.includes(":")) { // Handle parametrized rules with ':' that need to be split into fn (before ':') and parameters (after ':')
                const parts = rule.split(":");
                const validatorName = parts[0];
                const fn = validators[validatorName];
                if(fn) {
                    const values = parts[1].split(',');
                    isValid = fn(field.value, values);
                } else {
                    console.error(`Parametrized validator '${validatorName}' does not exist!`);
                }
            } else {
                // Handle simple rules (one word = validator name)
                const fn = validators[rule];
                if(fn) {
                    isValid = fn(field.value);
                } else {
                    console.error(`Validator '${rule}' does not exist!`);
                }
            }

            // Break as soon as possible if invalid, do not check other validators
            if(!isValid) {
                break;
            }
        }
    }

    return isValid;
}

/**
 * Validates whole form, given as html DOM element, and not jQuery object
 * @param {*} form 
 * @param {Object} validationRules 
 * @param {boolean} silent 
 * @returns 
 */
const validateForm = (form, validationRules, silent = false) => {
    const formData = []; // Data that gets submitted after validation
    const fieldsToSend = form.querySelectorAll("[name]"); // All fields with name attribute inside the form
    let formIsValid = true; // Form valid check

    // Validate each field in form against defined validation rules
    for(let i = 0; i < fieldsToSend.length; i++) {
        const field = fieldsToSend[i];
        if(!validateField(field, validationRules, silent)) {
            formIsValid = false;
            if(!silent) {
                field.classList.add('invalid');
            }
        } else if(Object.keys(validationRules).includes(field.getAttribute("name"))) {
            formData.push(field);
        }
    }

    return { formData, formIsValid };
};

const rules = {
    /**
     * Generate 'in' validation rule string
     * @param {Array} values 
     */
    in: (values) => {
        if(Array.isArray(values)) {
            return "in:" + values.join(',');
        }

        console.error(`${values} is not an array.`);
        return "";
    },

    required: () => { return "required" },
    string: () => { return "string" },
    email: () => { return "email" },
};

export {
    validateForm,
    rules,
}; 