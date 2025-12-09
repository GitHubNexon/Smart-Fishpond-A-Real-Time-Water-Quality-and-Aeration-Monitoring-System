//src/utils/modules/file-upload.module.ts

import { Module } from '@nestjs/common';
import { FileUploadService } from '../services/file-upload.service';

@Module({
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
