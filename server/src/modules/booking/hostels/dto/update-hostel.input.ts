import { CreateHostelInput } from './create-hostel.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateHostelInput extends PartialType(CreateHostelInput) {
  @Field(() => ID)
  _id: string;
}
