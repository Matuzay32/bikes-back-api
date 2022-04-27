import { Type } from 'class-transformer';
import { IsOptional, isPositive } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsOptional()
  // @IsPositive()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  // @IsPositive()
  offset: number;
}
