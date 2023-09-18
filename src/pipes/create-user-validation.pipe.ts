import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const validationErrors = this.buildError(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    return value;
  }

  private buildError(errors: any[]) {
    const result = {};
    errors.forEach((error) => {
      const key = error.property;
      Object.entries(error.constraints).forEach(([, constraintValue]) => {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(`${constraintValue}`);
      });
    });
    return result;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
