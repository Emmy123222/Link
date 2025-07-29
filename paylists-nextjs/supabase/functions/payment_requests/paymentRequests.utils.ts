import { create_verification_code_for_payment_request } from "../business/business_helper.ts";
import { general, requests, ui_paths } from "../constants.ts";
import { supabase } from "../config.ts";
import { TABLES } from "../db.ts";
import { fetchHTML, send_email } from "../email_sending/index.ts";
import { createLog } from "./changesLog.ts";

interface RequestChange {
  changerId: string;
  req: {
    id: string;
    customerId: string;
    vendorId: string;
    document_type: string;
  };
}

export async function handle_req_change({ changerId, req }: RequestChange) {
  console.log("=>0")
  const businessIdToUpdate = req.customerId === changerId ? req.vendorId : req.customerId;
  console.log("=>1")
  // Update document with latest change
  const { error: updateError } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ new_change_for: businessIdToUpdate })
    .eq('id', req.id);

  console.log("=>2")

  if (updateError) throw new Error(updateError.message);

  // Get related businesses
  const { data: vendor } = await supabase
    .from(TABLES.Business)
    .select()
    .eq('id', req.vendorId)
    .single();

  console.log("=>3")

  const { data: customer } = await supabase
    .from(TABLES.Business)
    .select()
    .eq('id', req.customerId)
    .single();

  if (!vendor || !customer) throw new Error("Business not found");
  try {
    console.log("=>4")
    const replyTo = businessIdToUpdate === vendor.id ? customer.email : vendor.email;
    const businessToUpdate = businessIdToUpdate === vendor.id ? vendor : customer;
    const subject = getSubjectForUpdateEmail({ vendor, businessIdToUpdate, req });
    const html = await getHTMLForUpdateEmail({ req, changerId, businessToUpdate, vendor });
    const senderBusinessName = changerId === req.customerId ? customer.business_name : vendor.business_name;

    console.log("=>5")

    await send_email({
      to: businessToUpdate.email,
      subject,
      html: html || "",
      replyTo,
      senderBusinessName,
      business_name: businessToUpdate.business_name
    });

  } catch (error) {
    console.error(error);
  }
}
function getSubjectForUpdateEmail({ vendor, businessIdToUpdate, req }: { vendor: any; businessIdToUpdate: string; req: any }) {
  if (vendor.id === businessIdToUpdate) {
    return `Update in your ${req.document_type.toLowerCase()}`;
  }
  return `Your ${req.document_type.toLowerCase()} from ${vendor.business_name}`;
}

async function getHTMLForUpdateEmail({ req, changerId, businessToUpdate, vendor }: { req: any; changerId: string; businessToUpdate: any; vendor: any }) {
  try {
    if (req.vendorId === changerId) {
      const code = await create_verification_code_for_payment_request({
        business: businessToUpdate,
        req
      });

      return await fetchHTML(
        "payment_request_update",
        [
          {
            patternToReplace: "%%vendor%%",
            replaceWith: vendor.business_name
          },
          {
            patternToReplace: "%%request_url%%",
            replaceWith: `${general.our_domain}/${ui_paths.payments_to_pay}/${req.id}?email_code=${code}`
          },
          {
            patternToReplace: "%%document_type%%",
            replaceWith: req.document_type.toLowerCase()
          },
          {
            patternToReplace: "%%document_type_upper%%",
            replaceWith: req.document_type.toUpperCase()
          }
        ]
      );
    }

    return await fetchHTML(
      "payment_request_update_for_vendor",
      [
        {
          patternToReplace: "%%customer%%",
          replaceWith: businessToUpdate.business_name
        },
        {
          patternToReplace: "%%request_url%%",
          replaceWith: `${general.our_domain}/${ui_paths.payments_to_receive}/${req.id}`
        },
        {
          patternToReplace: "%%document_type%%",
          replaceWith: req.document_type.toLowerCase()
        },
        {
          patternToReplace: "%%document_type_upper%%",
          replaceWith: req.document_type.toUpperCase()
        }
      ]
    );
  } catch (error) {
    console.error(error);
  }
}

export function shouldUpdateOnChange(doNotNotify: boolean, req: any) {
  return req.status !== requests.statuses.DRAFT && !doNotNotify;
} 