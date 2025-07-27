export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "Business category": {
        Row: {
          business_category: string | null
          created_at: string
          id: number
        }
        Insert: {
          business_category?: string | null
          created_at?: string
          id: number
        }
        Update: {
          business_category?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      Businesses: {
        Row: {
          accounting_integration: boolean | null
          active: boolean | null
          bank_account_name: string | null
          bank_account_number: number | null
          bill_number: number | null
          business_category: number | null
          business_name: string | null
          business_name_lowercase: string | null
          business_payment_responsible_email: string | null
          business_setup_completion: string | null
          business_type: Database["public"]["Enums"]["BusinessType"] | null
          city: string | null
          countryCode: number | null
          created_at: string
          created_by: string | null
          createdBy: string | null
          creation_type: Database["public"]["Enums"]["CreationType"] | null
          currency: Database["public"]["Enums"]["CurrencyType"] | null
          email: string | null
          fax: number | null
          fax_code_area: number | null
          guest_customers_payment_form: string | null
          id: number
          invoice_number: number | null
          is_deleted: boolean | null
          isNotSelect: boolean | null
          isPrimaryBusiness: boolean | null
          last_sync: string | null
          lastname: string | null
          mobile_code_area: number | null
          mobile_phone_number: number | null
          name: string | null
          OLD_createdBy: string | null
          "OLD_Document ID": string | null
          OLD_ownerId: string | null
          ownerId: string | null
          partial_payments: boolean | null
          payment_integration: boolean | null
          payment_request_tax: number | null
          payment_terms: string | null
          planning_number: number | null
          postal_code: string | null
          registration_number: string | null
          request_number: number | null
          sort_code: number | null
          street_1: string | null
          street_2: string | null
          telephone_code_area: number | null
          telephone_number: number | null
          trade_name: string | null
          updated_by: string | null
          vat_number: string | null
          website: string | null
          xero_integration_consent: boolean | null
          xeroContactId: string | null
        }
        Insert: {
          accounting_integration?: boolean | null
          active?: boolean | null
          bank_account_name?: string | null
          bank_account_number?: number | null
          bill_number?: number | null
          business_category?: number | null
          business_name?: string | null
          business_name_lowercase?: string | null
          business_payment_responsible_email?: string | null
          business_setup_completion?: string | null
          business_type?: Database["public"]["Enums"]["BusinessType"] | null
          city?: string | null
          countryCode?: number | null
          created_at?: string
          created_by?: string | null
          createdBy?: string | null
          creation_type?: Database["public"]["Enums"]["CreationType"] | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          email?: string | null
          fax?: number | null
          fax_code_area?: number | null
          guest_customers_payment_form?: string | null
          id?: number
          invoice_number?: number | null
          is_deleted?: boolean | null
          isNotSelect?: boolean | null
          isPrimaryBusiness?: boolean | null
          last_sync?: string | null
          lastname?: string | null
          mobile_code_area?: number | null
          mobile_phone_number?: number | null
          name?: string | null
          OLD_createdBy?: string | null
          "OLD_Document ID"?: string | null
          OLD_ownerId?: string | null
          ownerId?: string | null
          partial_payments?: boolean | null
          payment_integration?: boolean | null
          payment_request_tax?: number | null
          payment_terms?: string | null
          planning_number?: number | null
          postal_code?: string | null
          registration_number?: string | null
          request_number?: number | null
          sort_code?: number | null
          street_1?: string | null
          street_2?: string | null
          telephone_code_area?: number | null
          telephone_number?: number | null
          trade_name?: string | null
          updated_by?: string | null
          vat_number?: string | null
          website?: string | null
          xero_integration_consent?: boolean | null
          xeroContactId?: string | null
        }
        Update: {
          accounting_integration?: boolean | null
          active?: boolean | null
          bank_account_name?: string | null
          bank_account_number?: number | null
          bill_number?: number | null
          business_category?: number | null
          business_name?: string | null
          business_name_lowercase?: string | null
          business_payment_responsible_email?: string | null
          business_setup_completion?: string | null
          business_type?: Database["public"]["Enums"]["BusinessType"] | null
          city?: string | null
          countryCode?: number | null
          created_at?: string
          created_by?: string | null
          createdBy?: string | null
          creation_type?: Database["public"]["Enums"]["CreationType"] | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          email?: string | null
          fax?: number | null
          fax_code_area?: number | null
          guest_customers_payment_form?: string | null
          id?: number
          invoice_number?: number | null
          is_deleted?: boolean | null
          isNotSelect?: boolean | null
          isPrimaryBusiness?: boolean | null
          last_sync?: string | null
          lastname?: string | null
          mobile_code_area?: number | null
          mobile_phone_number?: number | null
          name?: string | null
          OLD_createdBy?: string | null
          "OLD_Document ID"?: string | null
          OLD_ownerId?: string | null
          ownerId?: string | null
          partial_payments?: boolean | null
          payment_integration?: boolean | null
          payment_request_tax?: number | null
          payment_terms?: string | null
          planning_number?: number | null
          postal_code?: string | null
          registration_number?: string | null
          request_number?: number | null
          sort_code?: number | null
          street_1?: string | null
          street_2?: string | null
          telephone_code_area?: number | null
          telephone_number?: number | null
          trade_name?: string | null
          updated_by?: string | null
          vat_number?: string | null
          website?: string | null
          xero_integration_consent?: boolean | null
          xeroContactId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Businesses_business_category_fkey"
            columns: ["business_category"]
            isOneToOne: false
            referencedRelation: "Business category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_countryCode_fkey"
            columns: ["countryCode"]
            isOneToOne: false
            referencedRelation: "Country code"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "Businesses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_fax_code_area_fkey"
            columns: ["fax_code_area"]
            isOneToOne: false
            referencedRelation: "Phone area code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_mobile_code_area_fkey"
            columns: ["mobile_code_area"]
            isOneToOne: false
            referencedRelation: "Phone area code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_payment_request_tax_fkey"
            columns: ["payment_request_tax"]
            isOneToOne: false
            referencedRelation: "Tax options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_telephone_code_area_fkey"
            columns: ["telephone_code_area"]
            isOneToOne: false
            referencedRelation: "Phone area code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_updated by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Businesses_updated by_fkey1"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Card Type": {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "Country code": {
        Row: {
          countryCode: string | null
          countryName: string | null
          created_at: string
          icon: string | null
          ID: number
          phone_code: number | null
        }
        Insert: {
          countryCode?: string | null
          countryName?: string | null
          created_at?: string
          icon?: string | null
          ID: number
          phone_code?: number | null
        }
        Update: {
          countryCode?: string | null
          countryName?: string | null
          created_at?: string
          icon?: string | null
          ID?: number
          phone_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Country Code_phone_code_fkey"
            columns: ["phone_code"]
            isOneToOne: false
            referencedRelation: "Phone area code"
            referencedColumns: ["id"]
          },
        ]
      }
      Currency: {
        Row: {
          created_at: string
          currency: string | null
          Description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          currency?: string | null
          Description?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          currency?: string | null
          Description?: string | null
          id?: number
        }
        Relationships: []
      }
      "Document items": {
        Row: {
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["CurrencyType"] | null
          doucment_header_id: number
          id: number
          name: string | null
          note: string | null
          price: number | null
          quantity: number | null
          tax: number | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          doucment_header_id: number
          id?: number
          name?: string | null
          note?: string | null
          price?: number | null
          quantity?: number | null
          tax?: number | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          doucment_header_id?: number
          id?: number
          name?: string | null
          note?: string | null
          price?: number | null
          quantity?: number | null
          tax?: number | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Document items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document items_doucment_header_id_fkey"
            columns: ["doucment_header_id"]
            isOneToOne: false
            referencedRelation: "Document_header"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Document transactions": {
        Row: {
          amount: number | null
          card_type: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          description: string | null
          header_id: number
          id: number
          method: string | null
          paymentDate: string | null
          status: string | null
          type: string | null
          updated_by: string | null
        }
        Insert: {
          amount?: number | null
          card_type?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          header_id: number
          id?: number
          method?: string | null
          paymentDate?: string | null
          status?: string | null
          type?: string | null
          updated_by?: string | null
        }
        Update: {
          amount?: number | null
          card_type?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          header_id?: number
          id?: number
          method?: string | null
          paymentDate?: string | null
          status?: string | null
          type?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Document transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document transactions_header_id_fkey"
            columns: ["header_id"]
            isOneToOne: false
            referencedRelation: "Document_header"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document transactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Document_header: {
        Row: {
          amount: number | null
          changes_log: Json[] | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          created_by_business: number | null
          currency: Database["public"]["Enums"]["CurrencyType"] | null
          customer_id: number | null
          customer_owner_id: string | null
          description: string | null
          document_number: string | null
          document_type: Database["public"]["Enums"]["DocumentType"] | null
          due_date: string | null
          email_code: string | null
          email_to_verify: string | null
          guest_user: string | null
          id: number
          initial_amount: number | null
          initial_due_date: string | null
          initial_supply_date: string | null
          note: string | null
          "OLD_Document ID": string | null
          opened_by: Json[] | null
          paid_amount: number | null
          partial_payments: boolean | null
          payment_done: boolean | null
          payment_method: Database["public"]["Enums"]["PaymentMethod"] | null
          payment_request_tax: Database["public"]["Enums"]["TaxOptions"] | null
          payment_service_provider:
            | Database["public"]["Enums"]["PaymentServiceType"]
            | null
          plan_due_date: string | null
          receiving_date: string | null
          reference_number: string | null
          remainder: number | null
          req_number: number | null
          request_date: string | null
          sent_to_client: boolean | null
          status: Database["public"]["Enums"]["DocumentStatus"] | null
          supply_date: string | null
          terms: string | null
          updated_by: string | null
          vendor_id: number | null
          vendor_owner_id: string | null
          wasDeleted: boolean | null
          xeroContactId: string | null
          xeroInvoiceId: string | null
          xeroInvoiceNumber: string | null
        }
        Insert: {
          amount?: number | null
          changes_log?: Json[] | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          created_by_business?: number | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          customer_id?: number | null
          customer_owner_id?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["DocumentType"] | null
          due_date?: string | null
          email_code?: string | null
          email_to_verify?: string | null
          guest_user?: string | null
          id?: number
          initial_amount?: number | null
          initial_due_date?: string | null
          initial_supply_date?: string | null
          note?: string | null
          "OLD_Document ID"?: string | null
          opened_by?: Json[] | null
          paid_amount?: number | null
          partial_payments?: boolean | null
          payment_done?: boolean | null
          payment_method?: Database["public"]["Enums"]["PaymentMethod"] | null
          payment_request_tax?: Database["public"]["Enums"]["TaxOptions"] | null
          payment_service_provider?:
            | Database["public"]["Enums"]["PaymentServiceType"]
            | null
          plan_due_date?: string | null
          receiving_date?: string | null
          reference_number?: string | null
          remainder?: number | null
          req_number?: number | null
          request_date?: string | null
          sent_to_client?: boolean | null
          status?: Database["public"]["Enums"]["DocumentStatus"] | null
          supply_date?: string | null
          terms?: string | null
          updated_by?: string | null
          vendor_id?: number | null
          vendor_owner_id?: string | null
          wasDeleted?: boolean | null
          xeroContactId?: string | null
          xeroInvoiceId?: string | null
          xeroInvoiceNumber?: string | null
        }
        Update: {
          amount?: number | null
          changes_log?: Json[] | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          created_by_business?: number | null
          currency?: Database["public"]["Enums"]["CurrencyType"] | null
          customer_id?: number | null
          customer_owner_id?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["DocumentType"] | null
          due_date?: string | null
          email_code?: string | null
          email_to_verify?: string | null
          guest_user?: string | null
          id?: number
          initial_amount?: number | null
          initial_due_date?: string | null
          initial_supply_date?: string | null
          note?: string | null
          "OLD_Document ID"?: string | null
          opened_by?: Json[] | null
          paid_amount?: number | null
          partial_payments?: boolean | null
          payment_done?: boolean | null
          payment_method?: Database["public"]["Enums"]["PaymentMethod"] | null
          payment_request_tax?: Database["public"]["Enums"]["TaxOptions"] | null
          payment_service_provider?:
            | Database["public"]["Enums"]["PaymentServiceType"]
            | null
          plan_due_date?: string | null
          receiving_date?: string | null
          reference_number?: string | null
          remainder?: number | null
          req_number?: number | null
          request_date?: string | null
          sent_to_client?: boolean | null
          status?: Database["public"]["Enums"]["DocumentStatus"] | null
          supply_date?: string | null
          terms?: string | null
          updated_by?: string | null
          vendor_id?: number | null
          vendor_owner_id?: string | null
          wasDeleted?: boolean | null
          xeroContactId?: string | null
          xeroInvoiceId?: string | null
          xeroInvoiceNumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Document header_created_by_business_fkey"
            columns: ["created_by_business"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_customer_owner_id_fkey"
            columns: ["customer_owner_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_guest_user_fkey"
            columns: ["guest_user"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Document header_vendor_owner_id_fkey"
            columns: ["vendor_owner_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Legal agreements": {
        Row: {
          agreed_on: string | null
          agreement: string | null
          created_at: string
          id: number
          revision_date: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          agreed_on?: string | null
          agreement?: string | null
          created_at?: string
          id?: number
          revision_date?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          agreed_on?: string | null
          agreement?: string | null
          created_at?: string
          id?: number
          revision_date?: string | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Legal agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Messages: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
          request_id: number | null
          sender_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          request_id?: number | null
          sender_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          request_id?: number | null
          sender_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      "Payment method": {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "Payment services": {
        Row: {
          business_id: number | null
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          business_id?: number | null
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          business_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Payment services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      "Payment type": {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "Phone area code": {
        Row: {
          country: string | null
          created_at: string
          id: number
          phone_code: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id: number
          phone_code?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: number
          phone_code?: string | null
        }
        Relationships: []
      }
      "Static data": {
        Row: {
          created_at: string
          id: number
          key: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          key?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          key?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      "Tax options": {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "Tax percentage": {
        Row: {
          country: number | null
          created_at: string
          description: string | null
          id: number
          tax: number
        }
        Insert: {
          country?: number | null
          created_at?: string
          description?: string | null
          id: number
          tax: number
        }
        Update: {
          country?: number | null
          created_at?: string
          description?: string | null
          id?: number
          tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "Tax percentage_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "Country code"
            referencedColumns: ["ID"]
          },
        ]
      }
      "User - Business": {
        Row: {
          active: boolean | null
          business: number
          created_at: string
          id: string
        }
        Insert: {
          active?: boolean | null
          business: number
          created_at?: string
          id?: string
        }
        Update: {
          active?: boolean | null
          business?: number
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User - Business_business_fkey1"
            columns: ["business"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User - Business_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "User plans": {
        Row: {
          active: boolean | null
          id: number
          paid_amount: number | null
          plan: string | null
          sms: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          id: number
          paid_amount?: number | null
          plan?: string | null
          sms?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          id?: number
          paid_amount?: number | null
          plan?: string | null
          sms?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          city: string | null
          countryCode: number | null
          created_at: string
          defaultPaymentDocument: number | null
          email: string | null
          firebase_code: string | null
          guest_user: boolean
          id: string
          label: number | null
          lastname: string | null
          name: string | null
          phone: string | null
          postal_code: string | null
          street_1: string | null
          street_2: string | null
          xero_userid: string | null
        }
        Insert: {
          city?: string | null
          countryCode?: number | null
          created_at?: string
          defaultPaymentDocument?: number | null
          email?: string | null
          firebase_code?: string | null
          guest_user: boolean
          id?: string
          label?: number | null
          lastname?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          street_1?: string | null
          street_2?: string | null
          xero_userid?: string | null
        }
        Update: {
          city?: string | null
          countryCode?: number | null
          created_at?: string
          defaultPaymentDocument?: number | null
          email?: string | null
          firebase_code?: string | null
          guest_user?: boolean
          id?: string
          label?: number | null
          lastname?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          street_1?: string | null
          street_2?: string | null
          xero_userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_duplicate_area_code_fkey"
            columns: ["label"]
            isOneToOne: false
            referencedRelation: "Phone area code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Users_duplicate_countryCode_fkey"
            columns: ["countryCode"]
            isOneToOne: false
            referencedRelation: "Country code"
            referencedColumns: ["ID"]
          },
        ]
      }
      "Vendor - Customer": {
        Row: {
          active: boolean | null
          created_at: string
          customerId: number
          vendorId: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          customerId: number
          vendorId: number
        }
        Update: {
          active?: boolean | null
          created_at?: string
          customerId?: number
          vendorId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Vendor - Customer_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Vendor - Customer_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "Businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      "Verify email": {
        Row: {
          code: string | null
          email: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          code?: string | null
          email?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          code?: string | null
          email?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      "Verify phone": {
        Row: {
          code: string | null
          created_at: string
          id: number
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_paid_amount: {
        Args: { payment_request_id: number; p_amount: number }
        Returns: number
      }
      append_changes_log: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      subtract_amount: {
        Args: { payment_request_id: number; amount: number }
        Returns: number
      }
    }
    Enums: {
      AgreementType: "privacy_agreement" | "user_agreement"
      BusinessType:
        | "Sole Trader"
        | "Limited Company"
        | "Limited Liability Partnership (LLP)"
        | "Public sector organization"
        | "Private customer"
      CreationType: "manually" | "by other user"
      CurrencyType: "GBP" | "EUR" | "USD"
      DocumentStatus: "Draft" | "Open" | "Paid" | "Delayed" | "Late payment"
      DocumentType: "Payment request" | "Invoice" | "Planning Payment" | "Bill"
      PaymentMethod:
        | "Open banking"
        | "Debit / Credit Card"
        | "Bank transfer"
        | "Cash"
        | "Cheque"
      PaymentServiceType: "GlobalPay" | "Crezco"
      Plan:
        | "FREE"
        | "BRONZE"
        | "SILVER"
        | "GOLD"
        | "FREE SMS"
        | "STANDARD"
        | "PREMIUM"
      TaxOptions: "Tax exclusive" | "Tax inclusive" | "No tax"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AgreementType: ["privacy_agreement", "user_agreement"],
      BusinessType: [
        "Sole Trader",
        "Limited Company",
        "Limited Liability Partnership (LLP)",
        "Public sector organization",
        "Private customer",
      ],
      CreationType: ["manually", "by other user"],
      CurrencyType: ["GBP", "EUR", "USD"],
      DocumentStatus: ["Draft", "Open", "Paid", "Delayed", "Late payment"],
      DocumentType: ["Payment request", "Invoice", "Planning Payment", "Bill"],
      PaymentMethod: [
        "Open banking",
        "Debit / Credit Card",
        "Bank transfer",
        "Cash",
        "Cheque",
      ],
      PaymentServiceType: ["GlobalPay", "Crezco"],
      Plan: [
        "FREE",
        "BRONZE",
        "SILVER",
        "GOLD",
        "FREE SMS",
        "STANDARD",
        "PREMIUM",
      ],
      TaxOptions: ["Tax exclusive", "Tax inclusive", "No tax"],
    },
  },
} as const 