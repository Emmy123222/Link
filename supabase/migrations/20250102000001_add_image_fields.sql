-- Add avatar_url field to Users table
ALTER TABLE "public"."Users" 
ADD COLUMN "avatar_url" TEXT;

-- Add logo_url field to Businesses table  
ALTER TABLE "public"."Businesses"
ADD COLUMN "logo_url" TEXT;

-- Add comments for documentation
COMMENT ON COLUMN "public"."Users"."avatar_url" IS 'URL for user profile image/avatar';
COMMENT ON COLUMN "public"."Businesses"."logo_url" IS 'URL for business logo image'; 