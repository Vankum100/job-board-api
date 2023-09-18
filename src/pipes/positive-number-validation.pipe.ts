import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveNumberValidationPipe implements PipeTransform<number> {
  transform(value: number): number {
    if (isNaN(value) || value <= 0) {
      throw new BadRequestException('Invalid positive number');
    }
    return value;
  }
}
