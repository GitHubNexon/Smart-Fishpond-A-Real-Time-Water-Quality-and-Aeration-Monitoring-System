import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { HealthService } from "./health.service";
import { CreateHealthDto } from "./dto/create-health.dto";
import { UpdateHealthDto } from "./dto/update-health.dto";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.checkHealth();
  }
}
