import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public user = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  };

  constructor(private userService: UserService, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  formSubmit() {
    if (this.user.username == '' || this.user.username == null) {
      this.snack.open('El nombre de usuario es requerido', 'Aceptar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.userService.añadirUsuario(this.user).subscribe(
      () => {
        Swal.fire('Usuario guardado', 'Usuario registrado con éxito en el sistema', 'success');
      }, (error) => {
        const mensaje = error?.error?.mensaje || 'Ha ocurrido un error en el sistema';
        this.snack.open(mensaje, 'Aceptar', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

}