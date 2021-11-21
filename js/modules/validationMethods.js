/**
 * Get all validation functions
 * @returns Object
 */
const validationFunctions = {
    /**
     * Checks if the value is not undefined/null/empty
     * @param {*} value 
     * @returns boolean
     */
    required: (value) => {
        return value !== undefined && value !== null && value !== "";
    },

    /**
     * Checks if value is of type string
     * @param {*} value 
     * @returns boolean
     */
    string: (value) => {
        return typeof value === 'string';
    },

    /**
     * Checks if value matches email regex
     * @param {*} value 
     * @returns boolean
     */
    email: (value) => {
        // Code copied from: https://stackoverflow.com/a/46181
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    },

    /**
     * Checks if value is in an array of other values
     * @param {*} value 
     * @param {Array} values 
     * @returns boolean
     */
    in: (value, values) => {
        return values.includes(value);
    },

    /**
     * Example fns
     */
    
    // Between two values
    between: (value, values) => {
        const numVal = Number(value);
        return numVal >= values[0] && numVal <= values[1];
    },
    
    // Greater
    gt: (value, comparisonValue) => {
        return Number(value) > comparisonValue[0]
    },

    // Greater or equal
    gte: (value, comparisonValue) => {
        return Number(value) >= comparisonValue[0];
    },
    
    // Less then
    lt: (value, comparisonValue) => {
        return Number(value) > comparisonValue[0];
    },

    // Less then or equal
    lte: (value, comparisonValue) => {
        return Number(value) >= comparisonValue[0];
    },
}

/**
 * Defines default validation failure messages for each validation rule
 */
const defaultValidationMessages = {
    "required": (fieldName) => `${fieldName} field is required`,
    "string": (fieldName) => `${fieldName} must be string`,
    "email": (fieldName) => `${fieldName} must be an email string`,
    "in": (fieldName) => `${fieldName} value is invalid`,
    "between": (fieldName, params) => `${fieldName} value must be between ${params[0]} and ${params[1]}`,
    "gt": (fieldName, params) => `${fieldName} value must be greater then ${params[0]}`,
    "gte": (fieldName, params) => `${fieldName} value must be greater then or equal to ${params[0]}`,
    "lt": (fieldName, params) => `${fieldName} value must be greater then ${params[0]}`,
    "lte": (fieldName, params) => `${fieldName} value must be less then or equal to ${params[0]}`,
};

/**
 * Validate specific field
 * @param {HTMLElement} field Field to be validated
 * @param {Object} validationRules Validation rules for all fields
 * @param {boolean} silent Defines if validation should be silent, meaning that fields will not be highlighted on frontend
 * @returns 
 */
const validateField = (field, validationRules, validationMessages = {}, silent = false) => {
    const name = field.getAttribute('name');

    // Make each field valid again, so red outline does not persist
    if(!silent) {
        const removeExistingValidationErrorLabel = function(field) {
            const existingValidationErrorMessage = field.parentNode.querySelector('[data-is-validation-error]');
            if(existingValidationErrorMessage) {
                existingValidationErrorMessage.parentNode.removeChild(existingValidationErrorMessage);
            }
        };

        removeExistingValidationErrorLabel(field);
        field.classList.remove('invalid');
        field.addEventListener('input', function() {
            removeExistingValidationErrorLabel(field);
            field.classList.remove('invalid');
        });
    }

    // Assume field is valid (if no rules are defined)
    let isValid = true;

    // Get an array of validation rules based on field name
    let validation = validationRules[name];

    // Check if rules actually exists
    if(validation) {
        // Filter out rules that are not of string type
        validation = validation.filter(v => typeof v === 'string');

        // Go through each rule and validate the fields value against them
        for(const rule of validation) {
            let validatorName = rule;
            let parametersForValidator = undefined;

            if(rule.includes(":")) { // Handle parametrized rules with ':' that need to be split into fn (before ':') and parameters (after ':')
                const parts = rule.split(":");
                validatorName = parts[0];
                parametersForValidator = parts[1].split(',');
            }
            
            const fn = validationFunctions[validatorName];
            if(fn) {
                isValid = fn(field.value, parametersForValidator);
            } else {
                throw new Error(`Validator '${validatorName}' does not exist!`);
            }

            // Break as soon as possible if invalid, do not check other validators
            if(!isValid) {
                if(!silent) {
                    let readableName = name.split('_').join(" "); // field_name -> field name
                    readableName = readableName.charAt(0).toUpperCase() + readableName.slice(1); // capitalize the name
                    const customMessage = validationMessages[name] ? validationMessages[name][validatorName] : undefined;
                    const finalMessage = customMessage || defaultValidationMessages[validatorName](readableName, parametersForValidator); // get the translation based on validator name if custom message is not defined

                    // Create error message
                    const textNode = document.createElement('p');
                    textNode.setAttribute('data-is-validation-error', '1');
                    textNode.style.color = 'red';
                    textNode.innerText = finalMessage;
                    field.parentNode.appendChild(textNode);
                }

                break;
            }
        }
    }

    return isValid;
}

/**
 * Gets all HTMLElement fields from form that need to be validated
 * This excludes unchecked checkboxes and radio buttons
 * @param {HTMLElement} form
 * @returns {HTMLElement[]} An array of elements
 */
const getFieldsToValidateFromForm = (form) => {
    const result = Array.from(form.querySelectorAll("[name]:not([type='checkbox']):not([type='radio'])"));

    // Add checked checkboxes and radios
    const addChecked = (type) => {
        form.querySelectorAll(`[type=${type}]:checked`).forEach(el => { result.push(el); });
    };
    addChecked('radio');
    addChecked('checkbox');

    return result;
}

/**
 * Validates whole form, given as HTML element
 * @param {HTMLElement} form 
 * @param {Object} validationRules 
 * @param {boolean} silent 
 * @returns 
 */
const validateForm = (form, validationRules, validationMessages = {}, silent = false) => {
    const formData = []; // Data that gets submitted after validation
    const fieldsToSend = getFieldsToValidateFromForm(form);
    let formIsValid = true; // Form valid check

    // Validate each field in form against defined validation rules
    for(let i = 0; i < fieldsToSend.length; i++) {
        const field = fieldsToSend[i];
        if(!validateField(field, validationRules, validationMessages, silent)) {
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

/**
 * @returns {Object} An object that contains functions that generate validation rules strings
 */
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