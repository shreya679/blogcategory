import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Blogcategory } from "../../../blogcategory.model";
import { BlogcategoryService } from "../../../blogcategory.service";
import { ApiService } from 'src/app/igap/service/api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  selector: "app-form-dialog",
  // templateUrl: "./form-dialog.component.html",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  blogcategoryForm: FormGroup;
  blogcategory: Blogcategory;
  // cities:any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public blogcategoryService: BlogcategoryService,
    private api:ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    
    let formdata = {id:0}
    this.api.post("business/blogcategory/list", formdata).subscribe((result:any)=>{      
      console.log(result.data);
      // this.cities = result.data.data;
    });
    
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.blogcategory.name;
      this.blogcategory = data.blogcategory;
    } else {
      this.dialogTitle = "New Blogcategory";
      this.blogcategory = new Blogcategory({});
    }
    this.blogcategoryForm = this.createContactForm();

  }

  formControl = new FormControl("", [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.blogcategory.id],
      businessid: [this.blogcategory.businessid],
      title: [this.blogcategory.title],
      urititle: [this.blogcategory.urltitle],
      srno: [this.blogcategory.srno]
    });
  }

  submit(formdata:Blogcategory) {
    this.blogcategoryService.save(formdata).subscribe((result:any)=>{
      if(result.data.status == "success")
      {
        this.showNotification(
          "snackbar-success",
          "Successful",
          "bottom",
          "center"
        );
        this.dialogRef.close();
      }
      else{
        this.showNotification(
          "snackbar-error",
          "Failed - " + result.data.message,
          "bottom",
          "center"
        );
      }
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }  

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}