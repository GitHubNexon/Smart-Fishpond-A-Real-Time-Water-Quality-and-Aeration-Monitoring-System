//src/shared.module.ts

import { Module } from '@nestjs/common';
// ==== Start of Module Imports ====
import { HashingModule } from './utils/modules/hashing.module';
import { PaginationModule } from './utils/modules/pagination.module';
import { PatchModule } from './utils/modules/patch.module';
import { FileUploadModule } from './utils/modules/file-upload.module';
// === End of Module Import ===

// === Start of Service Import for Providers ===
import { HashingService } from './utils/services/hashing.service';
import { PaginationService } from './utils/services/pagination.service';
import { PatchService } from './utils/services/patch.service';
import { FileUploadService } from './utils/services/file-upload.service';

@Module({
  imports: [HashingModule, PaginationModule, PatchModule, FileUploadModule],
  providers: [
    HashingService,
    PaginationService,
    PatchService,
    FileUploadService,
  ],
  exports: [
    HashingModule,
    PaginationModule,
    PatchModule,
    HashingService,
    PaginationService,
    PatchService,
    FileUploadModule,
  ],
})
export class SharedModule {}
