import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ROLE } from '../../shared/enum/enumes';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required,]
    });
  }


  roleBasedUser(role: string) {
    switch (role) {
      case ROLE.ADMIN:
        this.router.navigate(["/admin/dashboard"]);
        break;
      case ROLE.USER:
        this.router.navigate(["/user/tickets"])
        break;
      default:
        break
    }
  }



  submit() {

    if (this.loginForm.invalid) return;

    this.loading = true;
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        // this.snackBar.open("Login Success","", {
        //   duration:2000
        // });
        this.roleBasedUser(response.data.user.role)

        // this.router.navigate(['/admin/dashboard']).then(ok => console.log('Nav success:', ok));
        // console.log(response)
      },
      error: (err) => {

        this.loading = false;

        let msg = 'Login failed';

        if (err.error?.errors) {
          if (typeof err.error.errors === 'string') {
            // Case 2: string
            msg = err.error.errors;
          } else if (typeof err.error.errors === 'object') {
            // Case 1: object with arrays
            const firstKey = Object.keys(err.error.errors)[0];
            if (firstKey && Array.isArray(err.error.errors[firstKey])) {
              msg = err.error.errors[firstKey][0];
            }
          }
        } else if (err.error?.message) {
          msg = err.error.message;
        }

      }
    })
  }
  

}
