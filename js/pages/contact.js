import { validateForm } from "./../modules/validationMethods.js";
import { isCompany } from "./../modules/utils.js";


$(document).ready(function() {
    // Handle service type change, show notes for work
    const serviceTypeField = $("select[id=service_type]");
    serviceTypeField.change(function(e) {
        const field = $(this);
        const serviceTypeValue = field.val();

        // Hide all existing notes
        field.parent().find("[id$=_service_type]").hide();

        // Show notes for this value
        const notesToShow = $(`#${serviceTypeValue}_service_type`);
        if(notesToShow) {
            notesToShow.show();
        }
    });

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

    // Handle form "submit"
    $("#contact-us-button").click(validateContactUsForm);
});

/**
 * Get field validation rules
 * @returns Object
 */
function getValidationRules() {
    let result = {
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
        result = {
            ...result,
            'company_name': ['required', 'string'],
            'pib': ['required', 'string'],
        }
    }
    return result;
}

/**
 * Alter the page to show valid response after form "submission"
 * @param {*} formData
 */
function showValidResponse(formData) {
    const success = $("#contact-form-success");
    const seenLabels = {};
    formData.forEach(field => {
        let label = field.getAttribute('placeholder'); // Firstly look in placeholder attribute for a label
        if(!label) { // Look for label in custom 'data-placeholde attribute' (i.e. if <select> element is in question, it does not have a placeholder value)
            label = field.getAttribute('data-placeholder');
        }
        const value = field.value;
        if(!seenLabels[label]) { // If this label was not already printed out (handle the case of multiple checkboxes / radio buttons in one form with same name / label)
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
    const monthText = monthNames[month]; // We can do this as 'getMonth()' returns months zero-based index
    const year = todaysDate.getFullYear();
    const hour = todaysDate.getHours();
    const minutes = todaysDate.getMinutes();

    success.append(`<strong><p>
    Prosleđeno dana: ${day}. ${monthText} ${year} u ${hour}:${minutes} časova</p></strong>`);

    success.slideDown();
}

function validateContactUsForm() {
    const form = $("#contact-form");

    // Converts the form to html dom element, as validator works with vanilla js
    const { formData, formIsValid } = validateForm(form[0], getValidationRules());

    // If form is valid after all fields have been processed, show the results
    if(formIsValid) {
        form.slideUp(); // Hides the form
        showValidResponse(formData);
    }
}