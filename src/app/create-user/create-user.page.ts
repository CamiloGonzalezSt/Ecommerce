import { Component, OnInit  } from '@angular/core';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateUserPage implements OnInit {

  birthdateForm!: FormGroup;
  months: Array<{ value: number, name: string }> = [];
  days: Array<number> = [];
  years: Array<number> = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
    this.populateSelectOptions();
  }

  initializeForm() {
    this.birthdateForm = this.fb.group({
      month: [null, Validators.required],
      day: [null, Validators.required],
      year: [null, Validators.required],
    });
  }

  populateSelectOptions() {
    // Llenar meses
    this.months = [
      { value: 1, name: 'Enero' },
      { value: 2, name: 'Febrero' },
      { value: 3, name: 'Marzo' },
      { value: 4, name: 'Abril' },
      { value: 5, name: 'Mayo' },
      { value: 6, name: 'Junio' },
      { value: 7, name: 'Julio' },
      { value: 8, name: 'Agosto' },
      { value: 9, name: 'Septiembre' },
      { value: 10, name: 'Octubre' },
      { value: 11, name: 'Noviembre' },
      { value: 12, name: 'Diciembre' }
    ];

    // Llenar días
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Llenar años (de 1900 a 2024, puedes ajustar según lo necesites)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  }

  onSubmit() {
    if (this.birthdateForm.valid) {
      const birthdate = this.birthdateForm.value;
      console.log('Fecha de Nacimiento:', birthdate);
      // Aquí puedes manejar la fecha de nacimiento como lo necesites
    }
  }

}
