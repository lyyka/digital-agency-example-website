$(document).ready(function() {
    // Handle individual type change, show additional fields for companies
    const individualTypeCheck = $("input[name=individual_type]");
    individualTypeCheck.change(function() {
        const value = $(this).val();
        const companyData = $("#contact-us-company-data");
        if(isCompany(value)) {
            companyData.show();
        } else {
            companyData.hide();
        }
    });

    $("#contact-us-button").click(validateForm);
});

function isCompany(value) {
    return value === 'company';
}

function validateForm(buttonClickEvent) {
    console.log('click');

    // --- Define validatio functions that will handle later defined rules
    const validators = {
        required: (value) => {
            return value !== undefined && value !== null && value !== "";
        },

        string: (value) => {
            return typeof value === 'string';
        },

        email: (value) => {
            // Code copied from: https://stackoverflow.com/a/46181
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        },

        in: (value, values) => {
            return values.includes(value);
        },
    }

    // --- Define validation rules
    let validationRules = {
        'service_type': ["required", "in:work,careers,support,complaint,other"],
        'individual_type': ["required", "in:individual,company"],
        'first_name': ["required", "string"],
        'last_name': ["required", "string"],
        'phone_number': ["required", "string"],
        'email': ["required", "email"],
        'message': ["required", "string"],
    };
    const individualTypeCheck = $("input[name=individual_type]:checked");
    if(isCompany(individualTypeCheck.val())) {
        validationRules = {
            ...validationRules,
            'company_name': ['required', 'string'],
            'pib': ['required', 'string'],
        }
    }

    // --- Define form
    const form = $("#contact-form");
    const formData = [];
    const fieldsToSend = form.find("[name]");
    let formIsValid = true;

    // --- Validate each field in form against defined validation rules
    fieldsToSend.each(function() {
        const field = $(this);
        const name = field.attr('name');

        field.removeClass('invalid');
        field.on('input', function() {
            $(this).removeClass('invalid');
        });

        // Assume field is not valid (if no rules are defined)
        let isValid = false;

        // Get an array of validation rules based on field name
        const validation = validationRules[name];

        // Check for rules
        if(validation) {
            // Go through each rule and validate
            for(const rule of validation) {
                // Handle "in_array" rule
                if(rule.includes("in:")) {
                    const parts = rule.split(":");
                    const fn = validators[parts[0]];
                    const values = parts[1].split(',');
                    isValid = fn(field.val(), values);
                } else {
                    // Handle simple rules (one word)
                    const fn = validators[rule];
                    isValid = fn(field.val());
                }

                if(!isValid) {
                    console.log(name);
                    break;
                }
            }
        
            formIsValid = formIsValid && isValid;
        }

        if(!isValid) {
            field.addClass('invalid');
        } else {
            formData.push(field);
        }
    });

    // If form is valid, show results
    if(formIsValid) {
        form.slideUp();
        const success = $("#contact-form-success");
        const seenLabels = {};
        formData.forEach(field => {
            let label = field.attr('placeholder');
            if(!label) {
                label = field.attr('data-placeholder');
            }
            const value = field.val();
            if(validators['required'](value) && !seenLabels[label]) {
                seenLabels[label] = true;
                success.append(`<p>${label}: ${value}</p>`);
            }
        });

        const todaysDate = new Date();
        const monthNames = [
            'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
        ]
        const day = todaysDate.getDay();
        const month = todaysDate.getMonth();
        const monthText = monthNames[month];
        const year = todaysDate.getFullYear();

        success.append(`<strong><p>
        Prosleđeno dana: ${day}. ${monthText} ${year}
    </p></strong>`);

        success.show();
    }
}