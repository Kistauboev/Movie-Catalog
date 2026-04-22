import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  email = "";
  isRegisterMode = false;
  errorMessage = "";
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  // Event 1: Handle login
  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.authService.setUserAndToken(response.user, response.access_token);
        this.router.navigate(["/movies"]);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = "Invalid username or password";
        this.loading = false;
      },
    );
  }

  // Event 2: Handle register
  onRegister(): void {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          this.errorMessage = "";
          // Auto-login after registration
          this.onLogin();
        },
        (error) => {
          this.errorMessage = "Registration failed. Please check your details.";
          this.loading = false;
        },
      );
  }

  // Event 3: Toggle register mode
  toggleRegisterMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = "";
    this.username = "";
    this.email = "";
    this.password = "";
  }

  // Event 4: Submit form on Enter key
  onSubmit(): void {
    if (this.isRegisterMode) {
      this.onRegister();
    } else {
      this.onLogin();
    }
  }
}
