import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql'; // Added import for registerEnumType
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import {
  GenericListInput,
  RangeInput,
} from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputLocation extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  locationIds: string[];
}
