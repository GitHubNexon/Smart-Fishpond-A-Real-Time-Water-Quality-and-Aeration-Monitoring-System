import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateCompanyProfileDto, SupplierDto } from './dto/create-system.dto';

import { UpdateSystemDto } from './dto/update-system.dto';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}
}
