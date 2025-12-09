import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
} from '../enums/employee.enum';

/**
 * Validator to check if probationPeriodEnd is provided when employmentType is Probation
 */
@ValidatorConstraint({ name: 'isProbationPeriodValid', async: false })
export class IsProbationPeriodValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentType === EmploymentTypeEnum.PROBATION) {
      return !!object.probationPeriodEnd;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'probationPeriodEnd is required when employmentType is Probation';
  }
}

export function IsProbationPeriodValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProbationPeriodValidConstraint,
    });
  };
}

/**
 * Validator to check if contract dates are provided when employmentType is Contract
 */
@ValidatorConstraint({ name: 'isContractDatesValid', async: false })
export class IsContractDatesValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentType === EmploymentTypeEnum.CONTRACT) {
      return !!object.contractStartDate && !!object.contractEndDate;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'contractStartDate and contractEndDate are required when employmentType is Contract';
  }
}

export function IsContractDatesValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsContractDatesValidConstraint,
    });
  };
}

/**
 * Validator to check if dateRegularized is provided when employmentType is Regular
 */
@ValidatorConstraint({ name: 'isRegularizationDateValid', async: false })
export class IsRegularizationDateValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentType === EmploymentTypeEnum.REGULAR) {
      return !!object.dateRegularized;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'dateRegularized is required when employmentType is Regular';
  }
}

export function IsRegularizationDateValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRegularizationDateValidConstraint,
    });
  };
}

/**
 * Validator to check if contract end date is after start date
 */
@ValidatorConstraint({ name: 'isContractEndDateAfterStartDate', async: false })
export class IsContractEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.contractStartDate && object.contractEndDate) {
      const startDate = new Date(object.contractStartDate);
      const endDate = new Date(object.contractEndDate);
      return endDate > startDate;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'contractEndDate must be after contractStartDate';
  }
}

export function IsContractEndDateAfterStartDate(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsContractEndDateAfterStartDateConstraint,
    });
  };
}

/**
 * Validator to check if resignedDate is provided when employmentStatus is RESIGNED
 */
@ValidatorConstraint({ name: 'isResignedDateValid', async: false })
export class IsResignedDateValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentStatus === EmploymentStatusEnum.RESIGNED) {
      return !!object.resignedDate;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'resignedDate is required when employmentStatus is RESIGNED';
  }
}

export function IsResignedDateValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsResignedDateValidConstraint,
    });
  };
}

/**
 * Validator to check if terminatedDate and terminationReason are provided when employmentStatus is TERMINATED
 */
@ValidatorConstraint({ name: 'isTerminatedDateValid', async: false })
export class IsTerminatedDateValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentStatus === EmploymentStatusEnum.TERMINATED) {
      // Both terminatedDate and terminationReason must be provided
      return !!object.terminatedDate && !!object.terminationReason;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as any;

    if (!object.terminatedDate && !object.terminationReason) {
      return 'terminatedDate and terminationReason are required when employmentStatus is TERMINATED';
    }
    if (!object.terminatedDate) {
      return 'terminatedDate is required when employmentStatus is TERMINATED';
    }
    if (!object.terminationReason) {
      return 'terminationReason is required when employmentStatus is TERMINATED. Must be either "for_cause" or "without_cause"';
    }

    return 'terminatedDate and terminationReason are required when employmentStatus is TERMINATED';
  }
}

export function IsTerminatedDateValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTerminatedDateValidConstraint,
    });
  };
}

/**
 * Validator to check if retiredDate is provided when employmentStatus is RETIRED
 */
@ValidatorConstraint({ name: 'isRetiredDateValid', async: false })
export class IsRetiredDateValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.employmentStatus === EmploymentStatusEnum.RETIRED) {
      return !!object.retiredDate;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'retiredDate is required when employmentStatus is RETIRED';
  }
}

export function IsRetiredDateValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRetiredDateValidConstraint,
    });
  };
}
