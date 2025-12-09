//src/utils/services/file-upload-service.ts

import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as streamifier from 'streamifier';

interface UploadOptions {
  folderName?: string;
  fileNames?: string[]; // Optional custom names
  isMultiple?: boolean;
}

@Injectable()
export class FileUploadService {
  constructor() {
    // Configure Cloudinary only if env vars exist (Sandbox)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  /**
   * Uploads single or multiple files
   */
  async uploadFiles(
    files: Buffer[] | Buffer,
    options: UploadOptions = {},
  ): Promise<string[] | string> {
    const { folderName = 'uploads', fileNames, isMultiple = false } = options;
    const fileArray = Array.isArray(files) ? files : [files];

    if (!isMultiple && fileArray.length > 1) {
      throw new BadRequestException(
        'isMultiple=false but multiple files provided',
      );
    }

    const uploadedPaths: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const buffer = fileArray[i];
      const fileName =
        (fileNames && fileNames[i]) ||
        `file-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;

      const shouldUseCloud = this.shouldUseCloudinary();

      if (shouldUseCloud) {
        const result = await this.uploadToCloudinary(
          buffer,
          folderName,
          fileName,
        );
        uploadedPaths.push(result);
      } else {
        const result = await this.saveToLocal(buffer, folderName, fileName);
        uploadedPaths.push(result);
      }
    }

    return isMultiple ? uploadedPaths : uploadedPaths[0];
  }

  /**
   * Decide whether to use Cloudinary
   * (only when running in sandbox)
   */
  private shouldUseCloudinary(): boolean {
    const env = process.env.NODE_ENV?.toLowerCase();
    const deployment = process.env.DEPLOYMENT_ENV?.toLowerCase(); // custom optional var
    // Example: DEPLOYMENT_ENV=sandbox
    return deployment === 'sandbox' || env === 'sandbox';
  }

  /**
   * Upload file buffer to Cloudinary (for sandbox)
   */
  private async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    filename: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: path.parse(filename).name,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(
                `Cloudinary upload failed: ${error?.message || 'No result returned'}`,
              ),
            );
          }

          // ✅ result is guaranteed to exist here
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Save file locally (for Dev and AWS production)
   */
  private async saveToLocal(
    buffer: Buffer,
    folder: string,
    filename: string,
  ): Promise<string> {
    const dirPath = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, filename);
    await fs.promises.writeFile(filePath, buffer);

    // Return relative path to serve later (e.g. via StaticAssets)
    return `/uploads/${folder}/${filename}`;
  }

  /**
   * Delete a file from local storage or Cloudinary
   */
  async deleteFile(filePathOrUrl: string) {
    if (!filePathOrUrl) return;

    // 🔹 Local file
    if (filePathOrUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), filePathOrUrl);
      if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
      }
    }

    // 🔹 Cloudinary file
    if (filePathOrUrl.includes('res.cloudinary.com')) {
      const publicId = this.extractCloudinaryPublicId(filePathOrUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
  }

  /**
   * Extract Cloudinary public_id from URL
   */
  private extractCloudinaryPublicId(url: string): string | null {
    try {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v123456/inventory_qr/asset-INV-1.png
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((p) => p === 'upload');
      if (uploadIndex === -1) return null;

      // Everything after 'upload/v123456/' is public_id with folder
      const publicIdParts = parts.slice(uploadIndex + 2); // skip 'upload' + 'v123456'
      const fileNameWithExt = publicIdParts.join('/');
      const publicId = fileNameWithExt.replace(/\.[^/.]+$/, ''); // remove extension
      return publicId;
    } catch (err) {
      console.error('Failed to extract Cloudinary public_id', err);
      return null;
    }
  }
}
