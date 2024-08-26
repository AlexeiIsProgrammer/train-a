import { FormGroup, FormArray, FormControl } from '@angular/forms';

export type SegmentFormGroup = FormGroup<{
    time: FormArray<FormControl<string>>;
    price: FormGroup<Record<string, FormControl<number>>>;
}>;
