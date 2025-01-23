import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

export const ValidationPipe = new NestValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  skipMissingProperties: false,
  stopAtFirstError: true,
  transform: true, 
  exceptionFactory: (errors) => {
    const firstError = errors[0];
    const property = firstError.property;
    const constraints = Object.values(firstError.constraints).join(', ');
    return new Error(`Validation failed for ${property}: ${constraints}`);
  },
});
