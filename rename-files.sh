#!/bin/bash

# Components directory
cd src/components

# Rename files
mv auto-complete-address.tsx autoCompleteAddress.tsx
mv auto-complete-company.tsx autoCompleteCompany.tsx
mv business-category.tsx businessCategory.tsx
mv business-item.tsx businessItem.tsx
mv business-type.tsx businessType.tsx
mv card-list.tsx cardList.tsx
mv change-password-modal.tsx changePasswordModal.tsx
mv circular-loading-bar.tsx circularLoadingBar.tsx
mv confirm-send-email-modal.tsx confirmSendEmailModal.tsx
mv contact-drawer.tsx contactDrawer.tsx
mv country-list.tsx countryList.tsx
mv country-selector.tsx countrySelector.tsx
mv filter-collapse.tsx filterCollapse.tsx
mv filter-panel.tsx filterPanel.tsx
mv input-phone-number.tsx inputPhoneNumber.tsx
mv menu-list-dropdown.tsx menuListDropdown.tsx
mv phone-input.tsx phoneInput.tsx
mv progress-bar.tsx progressBar.tsx
mv radio-button.tsx radioButton.tsx
mv register-confirm-modal.tsx registerConfirmModal.tsx
mv theme-provider.tsx themeProvider.tsx
mv user-account-dropdown.tsx userAccountDropdown.tsx

# Constants directory
cd ../constants
mv business-config.ts businessConfig.ts
mv initial-datas.ts initialDatas.ts

# Types directory
cd ../types
mv country-code.ts countryCode.ts
mv legal-agreement.ts legalAgreement.ts
mv payment-requests.ts paymentRequests.ts
mv phone-area-code.ts phoneAreaCode.ts
mv tax-option.ts taxOption.ts 