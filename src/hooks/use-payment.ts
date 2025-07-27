import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentIntent,
  deletePaymentRequest,
  updatePaymentRequest,
  reopenRequest,
  deleteDraftDocument,
  cancelOpenDocument,
} from "@/lib/supabase/payment";
import { handleApiCall } from "@/lib/utils/api";
import {
  sendPaymentRequestEmail,
  markAsPaid,
  getPaymentsIn,
  getPaymentsOut,
  sendLetter,
  sendLateLetter,
  sendMessage,
} from "@/lib/supabase/payment";
import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@/constants/tables";
import { useEffect } from "react";
import { TransactionSummaryStatus } from "@/types/payments";

export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(async () => await createPaymentIntent(data), data),
    onSuccess: (data: any, variables: any) => {
      console.log("Payment request created, variables:", variables);

      // Invalidate all payments-related queries broadly first
      queryClient.invalidateQueries({ queryKey: ["payments-out"] });
      queryClient.invalidateQueries({ queryKey: ["payments-in"] });

      // Based on the backend function `create_payment_request_to_receive`:
      // - Current business (businessId) becomes the vendor (requesting payment)
      // - Selected customer becomes the customer (who will pay)
      // - Record: vendor_id = businessId, customer_id = customer.id
      // - This should appear in payments-in for the vendor (businessId)
      // - This should appear in payments-out for the customer (customer.id)

      if (variables?.businessId) {
        // Invalidate payments-in for the vendor (current business creating the request)
        queryClient.invalidateQueries({
          queryKey: ["payments-in", variables.businessId],
        });
        queryClient.invalidateQueries({
          queryKey: ["payments-in", variables.businessId.toString()],
        });
      }

      if (variables?.paymentReq) {
        // Get customer ID from the payment request
        if (variables.paymentReq.customer_id) {
          // Invalidate payments-out for the customer (who will receive the payment request)
          queryClient.invalidateQueries({
            queryKey: ["payments-out", variables.paymentReq.customer_id],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "payments-out",
              variables.paymentReq.customer_id.toString(),
            ],
          });
        }
      }

      console.log("Cache invalidated after payment request creation");
    },
  });
};

export const useSendPaymentRequestEmail = () => {
  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(
        async () => await sendPaymentRequestEmail(data),
        data
      ),
  });
};

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from(TABLES.DocumentItems)
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      throw new Error(error.message);
    },
  });
};

export const useDeletePaymentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      await handleApiCall(async () => await deletePaymentRequest(id), {
        errorMessage: "Failed to delete payment request",
        loadingMessage: "Deleting payment request...",
        successMessage: "Payment request deleted successfully",
      }),
    onSuccess: (data: any) => {
      // Invalidate payments cache to refresh the list after deletion
      queryClient.invalidateQueries({ queryKey: ["payments-out"] });
      queryClient.invalidateQueries({ queryKey: ["payments-in"] });
      return data;
    },
    onError: (error: any) => {
      throw new Error(error.message);
    },
  });
};

export const usePaymentsIn = (vendorId: string) => {
  return useQuery({
    queryKey: ["payments-in", vendorId],
    queryFn: async () => {
      if (vendorId === "") return [];
      return await getPaymentsIn(vendorId);
    },
  });
};

export const usePaymentsOut = (customerId: string) => {
  return useQuery({
    queryKey: ["payments-out", customerId],
    queryFn: async () => {
      if (customerId === "") return [];
      return await getPaymentsOut(customerId);
    },
  });
};

export const useMarkAsPaid = () => {
  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(async () => await markAsPaid(data), data),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(
        async () => {
          const { data: res, error } = await supabase
            .from(TABLES.DocumentTransactions)
            .insert(data)
            .select()
            .single();
          const { data: updatedDocumentHeader, error: updateError } =
            await supabase.rpc("add_to_paid_amount", {
              payment_request_id: data.header_id,
              p_amount: data.amount,
            });
          if (error || updateError) {
            throw new Error(error?.message || updateError?.message);
          }
          return res;
        },
        {
          errorMessage: "Failed to create payment",
          loadingMessage: "Creating payment...",
          successMessage: "Payment created successfully",
        }
      ),
    onSuccess: (data: any, variables: any) => {
      // Invalidate relevant caches when a payment is created
      queryClient.invalidateQueries({ queryKey: ["payments-out"] });
      queryClient.invalidateQueries({ queryKey: ["payments-in"] });

      // Invalidate the specific payment request and transactions
      if (variables?.header_id) {
        queryClient.invalidateQueries({
          queryKey: ["payment-request", variables.header_id.toString()],
        });
        queryClient.invalidateQueries({
          queryKey: ["transactions", variables.header_id.toString()],
        });
      }

      console.log("Payment created");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useGetPaymentRequest = (id: string) => {
  return useQuery({
    queryKey: ["payment-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.DocumentHeader)
        .select(
          "*, customer:customer_id(*, country:countryCode(*)), vendor:vendor_id(*, country:countryCode(*))"
        )
        .eq("id", id)
        .single();
      const { data: items, error: itemsError } = await supabase
        .from(TABLES.DocumentItems)
        .select("*")
        .eq("document_header_id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { ...data, items };
    },
  });
};

export const useUpdatePaymentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(async () => await updatePaymentRequest(data), {
        errorMessage: "Failed to update payment request",
        loadingMessage: "Updating payment request...",
        successMessage: "Payment request updated successfully",
      }),
    onSuccess: (data: any, variables: any) => {
      // Invalidate payments cache to refresh the list after update
      queryClient.invalidateQueries({ queryKey: ["payments-out"] });
      queryClient.invalidateQueries({ queryKey: ["payments-in"] });

      // Also invalidate the specific payment request
      if (variables?.paymentRequestId) {
        queryClient.invalidateQueries({
          queryKey: ["payment-request", variables.paymentRequestId.toString()],
        });
      }

      console.log("Payment request updated");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useUpdatePaymentRequestForVendor = () => {
  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(
        async () => await updatePaymentRequestForVendor(data),
        {
          errorMessage: "Failed to update payment request for vendor",
          loadingMessage: "Updating payment request for vendor...",
          successMessage: "Payment request for vendor updated successfully",
        }
      ),
    onSuccess: () => {
      console.log("Payment request for vendor updated");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useReopenRequest = () => {
  return useMutation({
    mutationFn: async (id: number) =>
      await handleApiCall(async () => await reopenRequest(id), {
        errorMessage: "Failed to reopen request",
        loadingMessage: "Reopening request...",
        successMessage: "Request reopened successfully",
      }),
  });
};

export const useUploadPDF = () => {
  return useMutation({
    mutationFn: async ({
      data,
      fileName,
    }: {
      data: Blob;
      fileName: string;
    }) => {
      const { data: res, error } = await supabase.storage
        .from("documents")
        .upload(`${fileName}`, data, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }
      const { data: url } = await supabase.storage
        .from("documents")
        .getPublicUrl(fileName);
      return url.publicUrl;
    },
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useSendLetter = () => {
  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(async () => await sendLetter(data), {
        errorMessage: "Failed to send letter",
        loadingMessage: "Sending letter...",
        successMessage: "Letter sent successfully",
      }),
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useSendLateLetter = () => {
  return useMutation({
    mutationFn: async (data: any) =>
      await handleApiCall(async () => await sendLateLetter(data), {
        errorMessage: "Failed to send late letter",
        loadingMessage: "Sending late letter...",
        successMessage: "Late letter sent successfully",
      }),
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const usePaymentRequestRealtime = (onChange: (msg: any) => void) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:payment_requests")
      .on(
        "postgres_changes",
        {
          event: "*", // or 'INSERT' | 'UPDATE' | 'DELETE'
          schema: "public",
          table: TABLES.DocumentHeader,
        },
        (payload: any) => {
          console.log("Change received!", payload);
          onChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
};

export const useTransactions = (paymentReqId: string) => {
  return useQuery({
    queryKey: ["transactions", paymentReqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.DocumentTransactions)
        .select("*")
        .eq("header_id", paymentReqId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (data: any) => await sendMessage(data),
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useMessages = (paymentReqId: string) => {
  return useQuery({
    queryKey: ["messages", paymentReqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.Messages)
        .select("*, user:sender_id(*)")
        .eq("request_id", paymentReqId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useCancelTransaction = () => {
  return useMutation({
    mutationFn: async ({
      transactionId,
      amount,
      paymentReqId,
    }: {
      transactionId: number;
      amount: number;
      paymentReqId: string;
    }) => {
      const { error } = await supabase
        .from(TABLES.DocumentTransactions)
        .delete()
        .eq("id", transactionId);

      const { error: updateError } = await supabase.rpc("sub_to_paid_amount", {
        payment_request_id: paymentReqId,
        p_amount: amount,
      });

      if (error) throw new Error(error.message);
      if (updateError) throw new Error(updateError.message);
      return transactionId;
    },
  });
};

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: async ({
      files,
      folder,
      bucket,
    }: {
      files: File[];
      folder: string;
      bucket: string;
    }) => {
      const uploads = [];

      for (const file of files) {
        const filePath = `${folder}/${file.name}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: false });

        if (error) {
          throw new Error(error.message);
        }
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploads.push({
          fileName: file.name,
          storagePath: filePath,
          publicUrl: publicUrlData.publicUrl,
        });
      }
      return uploads;
    },
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: async ({ id, item }: { id: number; item: any }) => {
      const { error } = await supabase.rpc("remove_json_from_array", {
        task_id: id,
        target_item: item,
      });
      if (error) throw new Error(error.message);
      return id;
    },
  });
};

// Phase 2: Cancel Open Document Hook
export const useCancelOpenDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqId: number) =>
      await handleApiCall(async () => await cancelOpenDocument(reqId), {
        errorMessage: "Failed to cancel open document",
        loadingMessage: "Cancelling document...",
        successMessage: "Document cancelled successfully",
      }),
    onSuccess: (data: any, variables: any) => {
      // Invalidate payments cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["payments-in"] });
      queryClient.invalidateQueries({ queryKey: ["payments-out"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Cancel open document error:", error);
    },
  });
};

export const useAddAttachment = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: res, error } = await supabase.rpc("add_to_attachments", {
        payment_request_id: data.id,
        attachments: data.attachments,
      });
      if (error) throw new Error(error.message);
      return res;
    },
  });
};
