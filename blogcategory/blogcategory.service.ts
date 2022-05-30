import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Blogcategory } from "./blogcategory.model";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ApiService } from "src/app/igap/service/api.service";
@Injectable()
export class BlogcategoryService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Blogcategory[]> = new BehaviorSubject<Blogcategory[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private api:ApiService) {
    super();
  }

  get data(): Blogcategory[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  list(): void {
    let formdata = {data:{}}
    this.api.post("business/blogcategory/list", formdata).subscribe((result:any)=>{
      if(result.data.status == "success"){
        this.isTblLoading = false;
        this.dataChange.next(result.data.data);
      }
      else{
        this.isTblLoading = false;
      }
    });
  }

  save(blogcategory: Blogcategory) {
    return this.api.post("business/blogcategory/save", blogcategory);
  }
  
  delete(id: number): void {
    this.api.post("business/blogcategory/delete", {id:id}).subscribe((result:any) => {
      if(result.data.status == "success")
        return true;
      else
        return false;
    });
  }
}