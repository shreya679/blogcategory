export class Blogcategory {
    id: number;
    businessid: number;
    title: string;
    urltitle: string;
    srno: number;
    
  
    constructor(blogcategory) {
        this.id = blogcategory.id || 0;
        this.businessid = blogcategory.businessid || 0;
        this.title = blogcategory.title || "";
        this.urltitle = blogcategory.urltitle || "";
        this.srno = blogcategory.srno || 0;
        
    }
  }