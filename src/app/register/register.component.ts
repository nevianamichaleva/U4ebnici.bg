import { database } from 'firebase';
import { UserService } from './../shared/model/users.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AuthService } from "../auth/services/auth.service";
var firebase = require('firebase');
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    myForm: FormGroup;
    myDBForm: FormGroup;
    error = false;
    errorMessage = '';
    constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {}

    onSignup() {
      this.authService.signupUser(this.myForm.value);
      //let userUID = firebase.auth().currentUser.uid;
      this.userService.createNewUser(this.myDBForm.value);
      
    }
 
    ngOnInit(): any {
        this.myForm = this.fb.group({
            email: ['', Validators.compose([
                Validators.required,
                this.isEmail
            ])],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.compose([
                Validators.required,
                this.isEqualPassword.bind(this)
            ])],
        });
        this.myDBForm = this.fb.group({
            name: '',
            city: '',
            phone: '',
            skype: '',
            dbemail: ''
        }); 
    }

    isEmail(control: FormControl): {[s: string]: boolean} {
        if (!control.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            return {noEmail: true};
        }
    }

    isEqualPassword(control: FormControl): {[s: string]: boolean} {
        if (!this.myForm) {
            return {passwordsNotMatch: true};
        }

        if (control.value !== this.myForm.controls['password'].value) {
            return {passwordsNotMatch: true};
        }
    }
}
