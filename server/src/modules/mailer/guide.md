# Email Service Integration Guide

## Smart Fishpond Monitoring System - Email Alerts

This guide shows how to integrate the `MailerService` into your Smart Fishpond monitoring system to send automated alerts when critical water quality events occur.

---

## Table of Contents

1. [Setup](#setup)
2. [Basic Usage](#basic-usage)
3. [Critical Water Temperature Alert](#critical-water-temperature-alert)
4. [Other Water Quality Alerts](#other-water-quality-alerts)
5. [Advanced Examples](#advanced-examples)

---

## Setup

### 1. Import MailerModule in your Fishpond Module

```typescript
// fishpond.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishpondService } from './fishpond.service';
import { FishpondController } from './fishpond.controller';
import { WaterQuality } from './entities/water-quality.entity';
import { MailerModule } from '../mailer/mailer.module'; // Import MailerModule

@Module({
  imports: [
    TypeOrmModule.forFeature([WaterQuality]),
    MailerModule, // Add this
  ],
  controllers: [FishpondController],
  providers: [FishpondService],
})
export class FishpondModule {}
```

### 2. Inject MailerService in your Service

```typescript
// fishpond.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class FishpondService {
  constructor(
    private readonly mailerService: MailerService,
    // ... other dependencies
  ) {}
}
```

---

## Basic Usage

### Simple Email Example

```typescript
await this.mailerService.sendEmail({
  recipient: 'admin@fishfarm.com',
  subject: 'Test Alert',
  body: '<h1>This is a test email</h1>',
  priority: 'NORMAL',
});
```

---

## Critical Water Temperature Alert

### Scenario: Automated System Alert

When your IoT sensors detect critical water temperature, the system automatically sends an email alert to the farm manager.

### Implementation

```typescript
// fishpond.service.ts

/**
 * Monitor water temperature and send alert if critical
 */
async checkWaterTemperature(
  pondId: string,
  temperature: number,
  userEmail: string,
): Promise<void> {
  const CRITICAL_TEMP_HIGH = 32; // Celsius
  const CRITICAL_TEMP_LOW = 20;  // Celsius
  
  // Check if temperature is critical
  if (temperature > CRITICAL_TEMP_HIGH || temperature < CRITICAL_TEMP_LOW) {
    await this.sendCriticalTemperatureAlert(
      pondId,
      temperature,
      userEmail,
    );
  }
}

/**
 * Send critical water temperature alert email
 */
async sendCriticalTemperatureAlert(
  pondId: string,
  temperature: number,
  userEmail: string,
): Promise<void> {
  const status = temperature > 32 ? 'TOO HIGH' : 'TOO LOW';
  const dangerLevel = temperature > 35 || temperature < 18 ? 'CRITICAL' : 'WARNING';
  
  const subject = `🚨 ${dangerLevel}: Critical Water Temperature in Pond ${pondId}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">⚠️ Critical Alert</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Smart Fishpond Monitoring System</p>
      </div>
      
      <!-- Alert Content -->
      <div style="background: #ffffff; padding: 30px; border: 2px solid #e74c3c; border-top: none;">
        <h2 style="color: #e74c3c; margin-top: 0;">Water Temperature ${status}</h2>
        
        <div style="background: #fff5f5; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Pond ID:</strong> ${pondId}
          </p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
            <strong>Current Temperature:</strong> 
            <span style="font-size: 24px; color: #e74c3c; font-weight: bold;">${temperature}°C</span>
          </p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
            <strong>Safe Range:</strong> 20°C - 32°C
          </p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
            <strong>Detected at:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
        
        <!-- Recommended Actions -->
        <h3 style="color: #333; margin-top: 25px;">🔧 Recommended Actions:</h3>
        <ul style="color: #666; line-height: 1.8;">
          ${temperature > 32 
            ? `
            <li>Activate aeration system immediately</li>
            <li>Increase water circulation</li>
            <li>Add cool water if available</li>
            <li>Provide shade coverage</li>
            <li>Reduce feeding temporarily</li>
            `
            : `
            <li>Check heater system</li>
            <li>Cover pond to retain heat</li>
            <li>Reduce water flow if too cold</li>
            <li>Monitor fish behavior closely</li>
            `
          }
        </ul>
        
        <!-- Impact Warning -->
        <div style="background: #fff9e6; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ Impact:</strong> Prolonged exposure to temperature outside safe range can cause:
          </p>
          <ul style="margin: 10px 0 0 0; color: #856404;">
            <li>Reduced fish appetite</li>
            <li>Stress and disease susceptibility</li>
            <li>Decreased oxygen levels</li>
            <li>Potential fish mortality</li>
          </ul>
        </div>
        
        <!-- Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-app.com/ponds/${pondId}" 
             style="display: inline-block; padding: 15px 40px; background-color: #3498db; 
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Pond Dashboard
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; 
                  text-align: center; border-top: 1px solid #dee2e6;">
        <p style="margin: 0; color: #6c757d; font-size: 12px;">
          This is an automated alert from Smart Fishpond Monitoring System
        </p>
        <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
          Please do not reply to this email
        </p>
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'HIGH',
  });
  
  console.log(`Critical temperature alert sent to ${userEmail} for Pond ${pondId}`);
}
```

### Usage in IoT Event Handler

```typescript
// When receiving data from IoT sensors
async handleSensorData(sensorData: any): Promise<void> {
  const { pondId, temperature, userId } = sensorData;
  
  // Get user email
  const user = await this.userRepository.findOne({ where: { id: userId } });
  
  if (user) {
    // Check temperature and send alert if needed
    await this.checkWaterTemperature(pondId, temperature, user.email);
  }
}
```

---

## Other Water Quality Alerts

### 1. Low Dissolved Oxygen Alert

```typescript
async sendLowOxygenAlert(
  pondId: string,
  oxygenLevel: number,
  userEmail: string,
): Promise<void> {
  const subject = `🚨 URGENT: Low Dissolved Oxygen in Pond ${pondId}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #e74c3c; color: white; padding: 20px; text-align: center;">
        <h1>⚠️ Low Oxygen Alert</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Critical Oxygen Levels Detected</h2>
        <p><strong>Pond ID:</strong> ${pondId}</p>
        <p><strong>Current DO Level:</strong> <span style="font-size: 24px; color: #e74c3c;">${oxygenLevel} mg/L</span></p>
        <p><strong>Safe Range:</strong> 5-8 mg/L</p>
        
        <h3>Immediate Actions Required:</h3>
        <ul>
          <li>Turn on all aerators immediately</li>
          <li>Stop feeding temporarily</li>
          <li>Check for dead fish or debris</li>
          <li>Consider emergency water exchange</li>
        </ul>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <strong>⏰ Time Sensitive:</strong> Fish can die within 1-2 hours if oxygen remains low!
        </div>
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'HIGH',
  });
}
```

### 2. Abnormal pH Level Alert

```typescript
async sendPHAlert(
  pondId: string,
  phLevel: number,
  userEmail: string,
): Promise<void> {
  const status = phLevel > 8.5 ? 'TOO HIGH (Alkaline)' : 'TOO LOW (Acidic)';
  const subject = `📊 pH Level Alert: Pond ${pondId}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #3498db; color: white; padding: 20px;">
        <h1>pH Level Alert</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>pH Level ${status}</h2>
        <p><strong>Current pH:</strong> ${phLevel}</p>
        <p><strong>Optimal Range:</strong> 6.5 - 8.5</p>
        
        <h3>Recommended Actions:</h3>
        ${phLevel > 8.5 
          ? '<ul><li>Add pH reducer or vinegar</li><li>Increase water circulation</li></ul>'
          : '<ul><li>Add lime or baking soda</li><li>Check for acidic runoff</li></ul>'
        }
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'NORMAL',
  });
}
```

### 3. Turbidity/Water Clarity Alert

```typescript
async sendTurbidityAlert(
  pondId: string,
  turbidity: number,
  userEmail: string,
): Promise<void> {
  const subject = `💧 Water Clarity Alert: Pond ${pondId}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #95a5a6; color: white; padding: 20px;">
        <h1>Water Turbidity Alert</h1>
      </div>
      <div style="padding: 30px;">
        <p><strong>Turbidity Level:</strong> ${turbidity} NTU</p>
        <p><strong>Optimal Range:</strong> < 25 NTU</p>
        
        <h3>Actions:</h3>
        <ul>
          <li>Check filtration system</li>
          <li>Reduce feeding if overfeeding</li>
          <li>Consider water change</li>
          <li>Check for algae bloom</li>
        </ul>
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'NORMAL',
  });
}
```

---

## Advanced Examples

### Multi-Parameter Alert (Combined Issues)

```typescript
async sendMultiParameterAlert(
  pondId: string,
  parameters: {
    temperature: number;
    oxygen: number;
    ph: number;
  },
  userEmail: string,
): Promise<void> {
  const subject = `🚨 CRITICAL: Multiple Water Quality Issues - Pond ${pondId}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #c0392b; color: white; padding: 30px; text-align: center;">
        <h1>⚠️ CRITICAL ALERT</h1>
        <p>Multiple Water Quality Parameters Out of Range</p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2>Pond ${pondId} - Emergency Attention Required</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Parameter</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Current</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Safe Range</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Status</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">Temperature</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${parameters.temperature}°C</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">20-32°C</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">
              ${parameters.temperature > 32 || parameters.temperature < 20 
                ? '<span style="color: #e74c3c;">⚠️ CRITICAL</span>' 
                : '<span style="color: #27ae60;">✓ OK</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">Dissolved Oxygen</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${parameters.oxygen} mg/L</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">5-8 mg/L</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">
              ${parameters.oxygen < 5 
                ? '<span style="color: #e74c3c;">⚠️ CRITICAL</span>' 
                : '<span style="color: #27ae60;">✓ OK</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">pH Level</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${parameters.ph}</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">6.5-8.5</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">
              ${parameters.ph < 6.5 || parameters.ph > 8.5 
                ? '<span style="color: #e74c3c;">⚠️ WARNING</span>' 
                : '<span style="color: #27ae60;">✓ OK</span>'}
            </td>
          </tr>
        </table>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">🚨 EMERGENCY PROTOCOL</h3>
          <ol style="color: #856404;">
            <li>Activate all aeration systems immediately</li>
            <li>Perform emergency water quality test</li>
            <li>Prepare for partial water exchange</li>
            <li>Monitor fish behavior closely</li>
            <li>Contact aquaculture specialist if needed</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-app.com/emergency/${pondId}" 
             style="display: inline-block; padding: 15px 30px; background-color: #e74c3c; 
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            🚨 EMERGENCY DASHBOARD
          </a>
        </div>
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'HIGH',
  });
}
```

### Daily Water Quality Report

```typescript
async sendDailyReport(
  pondId: string,
  dailyData: any[],
  userEmail: string,
): Promise<void> {
  const subject = `📊 Daily Water Quality Report - Pond ${pondId}`;
  
  const avgTemp = dailyData.reduce((sum, d) => sum + d.temperature, 0) / dailyData.length;
  const avgDO = dailyData.reduce((sum, d) => sum + d.oxygen, 0) / dailyData.length;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #27ae60; color: white; padding: 20px;">
        <h1>📊 Daily Water Quality Report</h1>
        <p>Pond ${pondId} - ${new Date().toLocaleDateString()}</p>
      </div>
      <div style="padding: 30px;">
        <h2>24-Hour Summary</h2>
        <p><strong>Average Temperature:</strong> ${avgTemp.toFixed(1)}°C</p>
        <p><strong>Average Dissolved Oxygen:</strong> ${avgDO.toFixed(1)} mg/L</p>
        <p><strong>Total Readings:</strong> ${dailyData.length}</p>
        
        <h3>Status: All Parameters Normal ✓</h3>
        <p>Your pond water quality has been stable throughout the day.</p>
      </div>
    </div>
  `;

  await this.mailerService.sendEmail({
    recipient: userEmail,
    subject,
    body,
    priority: 'LOW',
  });
}
```

---

## Best Practices

1. **Always use try-catch blocks**
   ```typescript
   try {
     await this.mailerService.sendEmail({...});
   } catch (error) {
     console.error('Failed to send alert email:', error);
     // Log to database or monitoring system
   }
   ```

2. **Don't block critical operations**
   ```typescript
   // Send email asynchronously without waiting
   this.mailerService.sendEmail({...}).catch(err => 
     console.error('Email error:', err)
   );
   ```

3. **Rate limiting for frequent alerts**
   ```typescript
   // Only send if last alert was > 30 minutes ago
   const lastAlertTime = await this.getLastAlertTime(pondId);
   if (Date.now() - lastAlertTime > 30 * 60 * 1000) {
     await this.mailerService.sendEmail({...});
   }
   ```

4. **Test emails in development**
   ```typescript
   // Use test email in development
   const recipient = process.env.NODE_ENV === 'production' 
     ? user.email 
     : 'test@yourdomain.com';
   ```

---

## Testing

```bash
# Test critical temperature alert
curl -X POST http://localhost:3000/fishpond/test-alert \
  -H "Content-Type: application/json" \
  -d '{
    "pondId": "POND-001",
    "temperature": 35,
    "userEmail": "admin@fishfarm.com"
  }'
```

---

## Troubleshooting

**Email not sending?**
- Check `.env` file has correct `EMAIL_USER` and `EMAIL_PASS`
- Verify Gmail App Password is generated (not regular password)
- Check email logs: `GET /mailer/logs/failed`
- Verify connection: `GET /mailer/verify`

**Getting authentication errors?**
- Enable "Less secure app access" or use App Password
- Check if 2FA is enabled (requires App Password)

---

## Summary

The `sendEmail` function is perfect for automated monitoring systems because:

✅ Sends HTML-formatted emails with custom styling  
✅ Supports priority levels (HIGH, NORMAL, LOW)  
✅ Automatically logs all emails to database  
✅ Handles errors gracefully  
✅ Works asynchronously (non-blocking)  
✅ Easy integration with IoT sensor data

Use it to keep your fish farm managers informed about critical water quality events in real-time! 🐟💧