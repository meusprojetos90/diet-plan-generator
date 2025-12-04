/**
 * S3 Storage Service
 * Upload PDFs to AWS S3 or compatible storage
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "";

/**
 * Upload file to S3
 */
export async function uploadToS3(
    buffer: Buffer,
    key: string
): Promise<string> {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: "application/pdf",
            ACL: "public-read", // Make file publicly accessible
        });

        await s3Client.send(command);

        // Return public URL
        const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
        return url;
    } catch (error) {
        console.error("S3 upload error:", error);
        throw new Error("Failed to upload to S3");
    }
}

/**
 * Alternative: Upload to Supabase Storage
 */
export async function uploadToSupabase(
    buffer: Buffer,
    path: string
): Promise<string> {
    // This is a placeholder - implement based on your Supabase setup
    // Example:
    // const { data, error } = await supabase.storage
    //   .from('meal-plans')
    //   .upload(path, buffer, { contentType: 'application/pdf' })

    throw new Error("Supabase upload not implemented yet");
}
