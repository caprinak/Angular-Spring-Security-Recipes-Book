import { MeasurementUnit } from './enums/measurement-unit.enum';

export class Ingredient {
  constructor(
    public name: string, 
    public amount: number, 
    public unitOfMeasurement: MeasurementUnit 
  ) {}
}
