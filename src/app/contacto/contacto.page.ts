import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com'; // Importar la librería EmailJS

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.contactForm.valid) {
      const { nombre, correo, mensaje } = this.contactForm.value;

      // Enviar correo con EmailJS
      emailjs.send(
        'service_02dsfqf',   // ID del servicio de EmailJS
        'template_0r4t1co',   // ID de la plantilla de EmailJS
        {
          nombre: nombre,
          correo: correo,
          mensaje: mensaje
        },
        'JqjhqHptQkf20XHJS'        // Tu ID de usuario de EmailJS
      )
      .then(response => {
        console.log('Correo enviado exitosamente', response);
        alert('Mensaje enviado exitosamente');
      })
      .catch(err => {
        console.error('Error al enviar correo', err);
        alert('Hubo un problema al enviar el mensaje');
      });
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
}
