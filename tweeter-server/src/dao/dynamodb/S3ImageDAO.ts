import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3DAO } from "../interfaces/S3DAO";

const REGION = "us-east-1";
const BUCKET = "tytweeter-images-12345";

export class S3ImageDAO implements S3DAO {
    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        const decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");

        const params = {
            Bucket: BUCKET,
            Key: `image/${fileName}`,
            Body: decodedImageBuffer,
            ContentType: "image/png",
        };

        const client = new S3Client({ region: REGION });
        await client.send(new PutObjectCommand(params));

        return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    }
}