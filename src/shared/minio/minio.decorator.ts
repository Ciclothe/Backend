import { SetMetadata } from '@nestjs/common';

export const Minio = (...args: string[]) => SetMetadata('minio', args);
