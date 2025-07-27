-- Add new statuses to DocumentStatus enum for soft delete implementation
ALTER TYPE "public"."DocumentStatus" ADD VALUE 'Cancelled';
ALTER TYPE "public"."DocumentStatus" ADD VALUE 'Deleted'; 