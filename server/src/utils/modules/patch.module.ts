//src/utils/modules/patch.module.ts
import { Module, Global } from "@nestjs/common";
import { PatchService } from "../services/patch.service";

@Global()
@Module({
  providers: [PatchService],
  exports: [PatchService],
})
export class PatchModule {}
