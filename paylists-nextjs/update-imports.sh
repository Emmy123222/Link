#!/bin/bash

# Function to convert kebab-case to camelCase
kebab_to_camel() {
    echo "$1" | sed -E 's/-([a-z])/\U\1/g'
}

# Update imports in all TypeScript/JavaScript files
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" | while read -r file; do
    # Skip the file if it's being renamed
    if [[ "$file" != *"-"* ]]; then
        continue
    fi
    
    # Get the new filename
    new_name=$(kebab_to_camel "$(basename "$file")")
    
    # Update imports in the file
    sed -i "s/from ['\"].*\/$(basename "$file" | sed 's/\./\\\./g')['\"]/from \"@\/components\/${new_name%.*}\"/g" "$file"
done

# Update specific imports
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" | while read -r file; do
    # Update component imports
    sed -i 's/from ["'\''].*\/auto-complete-address["'\'']/from "@\/components\/autoCompleteAddress"/g' "$file"
    sed -i 's/from ["'\''].*\/auto-complete-company["'\'']/from "@\/components\/autoCompleteCompany"/g' "$file"
    sed -i 's/from ["'\''].*\/business-category["'\'']/from "@\/components\/businessCategory"/g' "$file"
    sed -i 's/from ["'\''].*\/business-item["'\'']/from "@\/components\/businessItem"/g' "$file"
    sed -i 's/from ["'\''].*\/business-type["'\'']/from "@\/components\/businessType"/g' "$file"
    sed -i 's/from ["'\''].*\/card-list["'\'']/from "@\/components\/cardList"/g' "$file"
    sed -i 's/from ["'\''].*\/change-password-modal["'\'']/from "@\/components\/changePasswordModal"/g' "$file"
    sed -i 's/from ["'\''].*\/circular-loading-bar["'\'']/from "@\/components\/circularLoadingBar"/g' "$file"
    sed -i 's/from ["'\''].*\/confirm-send-email-modal["'\'']/from "@\/components\/confirmSendEmailModal"/g' "$file"
    sed -i 's/from ["'\''].*\/contact-drawer["'\'']/from "@\/components\/contactDrawer"/g' "$file"
    sed -i 's/from ["'\''].*\/country-list["'\'']/from "@\/components\/countryList"/g' "$file"
    sed -i 's/from ["'\''].*\/country-selector["'\'']/from "@\/components\/countrySelector"/g' "$file"
    sed -i 's/from ["'\''].*\/filter-collapse["'\'']/from "@\/components\/filterCollapse"/g' "$file"
    sed -i 's/from ["'\''].*\/filter-panel["'\'']/from "@\/components\/filterPanel"/g' "$file"
    sed -i 's/from ["'\''].*\/input-phone-number["'\'']/from "@\/components\/inputPhoneNumber"/g' "$file"
    sed -i 's/from ["'\''].*\/menu-list-dropdown["'\'']/from "@\/components\/menuListDropdown"/g' "$file"
    sed -i 's/from ["'\''].*\/phone-input["'\'']/from "@\/components\/phoneInput"/g' "$file"
    sed -i 's/from ["'\''].*\/progress-bar["'\'']/from "@\/components\/progressBar"/g' "$file"
    sed -i 's/from ["'\''].*\/radio-button["'\'']/from "@\/components\/radioButton"/g' "$file"
    sed -i 's/from ["'\''].*\/register-confirm-modal["'\'']/from "@\/components\/registerConfirmModal"/g' "$file"
    sed -i 's/from ["'\''].*\/theme-provider["'\'']/from "@\/components\/themeProvider"/g' "$file"
    sed -i 's/from ["'\''].*\/user-account-dropdown["'\'']/from "@\/components\/userAccountDropdown"/g' "$file"
    
    # Update constants imports
    sed -i 's/from ["'\''].*\/business-config["'\'']/from "@\/constants\/businessConfig"/g' "$file"
    sed -i 's/from ["'\''].*\/initial-datas["'\'']/from "@\/constants\/initialDatas"/g' "$file"
    
    # Update types imports
    sed -i 's/from ["'\''].*\/country-code["'\'']/from "@\/types\/countryCode"/g' "$file"
    sed -i 's/from ["'\''].*\/legal-agreement["'\'']/from "@\/types\/legalAgreement"/g' "$file"
    sed -i 's/from ["'\''].*\/payment-requests["'\'']/from "@\/types\/paymentRequests"/g' "$file"
    sed -i 's/from ["'\''].*\/phone-area-code["'\'']/from "@\/types\/phoneAreaCode"/g' "$file"
    sed -i 's/from ["'\''].*\/tax-option["'\'']/from "@\/types\/taxOption"/g' "$file"
    sed -i 's/from ["'\''].*\/creation-type["'\'']/from "@\/types\/creationType"/g' "$file"
done 