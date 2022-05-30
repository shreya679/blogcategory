const database = require("../Database");
var fs = require("fs");

class BusinessBlog {

    id = 0;
    businessid = 0;
    categoryid = 0;
    title = "";
    urltitle = "";
    createdon = "";
    author = "";
    picpath = "";
    body = "";
    status = "";
    query = "";

    db = new database.Database();

    constructor() {
        this.id = 0;
        this.businessid = 0;
        this.categoryid = 0;
        this.title = "";
        this.urltitle = "";
        this.createdon = "";
        this.author = "";
        this.picpath = "";
        this.body = "";
        this.status = "";
        this.query = "";
      }

      save = () => {

        if (this.imagecode != "") {
            let base64image = this.imagecode.replace(/^data:image\/jpeg;base64,/, "");
            base64image = base64image.replace(/^data:image\/png;base64,/, "");
            this.picpath = "businessblogs/" + Math.random().toString(36).substring(2, 7) + ".png";
            fs.writeFile("public/" + this.picpath, base64image, 'base64', function (err) {
                console.log("Error image saving-" + err);
            });
        }
        if (this.id == 0) {
          this.query = "INSERT INTO business_blogs(businessid, categoryid, title, urltitle, createdon, author, picpath, body, status) ";
          this.query += "VALUES(" + this.businessid + ", " + this.categoryid +  ", '" + this.title +  "', '" + this.urltitle +  "', '" + this.createdon +  "', '" + this.author +  "', '" + this.picpath +  "', '" + this.body +  "', 'inactive') ";
        }
        else
        {
          this.query = "UPDATE business_blogs SET businessid = " + this.businessid + ", ";
          this.query += "categoryid = " + this.categoryid + ", ";
          this.query += "title ='" + this.title + "', ";
          this.query += "urltitle ='" + this.urltitle + "', ";
          this.query += "createdon = '" + this.createdon + "', ";
          this.query += "author = '" + this.author + "', ";
          if(this.picpath != "")
                this.query += "picpath = '" + this.picpath + "', ";
          this.query += "body = '" + this.body + "' ";
          this.query += "WHERE id =" + this.id;
        }
        return new Promise((resolve, reject) => {
            this.db.query(this.query, (err, result) => {
                this.db.close();
                if (err) {
                    return reject(err)
                };
                resolve(result);
            });
        });
    }

    list = () => {
        this.query = "SELECT * FROM business_blogs WHERE businessid = " + this.businessid + " ";
        if(this.categoryid)
            this.query += "AND categoryid = " + this.categoryid + " ";
        this.query += "ORDER BY id";
        return new Promise((resolve, reject) => {
          this.db.query(this.query, (err, result) => {
            this.db.close();
            if (err) reject(err);
            resolve(result);
          });
        });
      };

      get=()=>{
        this.query = "SELECT * FROM business_blogs WHERE id = " + this.id;
        return new Promise((resolve, reject)=>{
            this.db.query(this.query, (err, result)=>{
                this.db.close();
                if(err)
                    return reject(err);                
                resolve(result);
            });
        });          
    }

    changestatus=()=>{
      this.query = "UPDATE business_blogs SET status = '" + this.status + "' WHERE id = " + this.id;
      return new Promise((resolve, reject)=>{
          this.db.query(this.query, (err, result)=>{
              this.db.close();
              if(err)
                  return reject(err);                
              resolve(result);
          });
      });          
  }
 
    delete=()=>{
        this.query = "SELECT * FROM business_blogs WHERE id = " + this.id;
        return new Promise((resolve, reject) => {
            this.db.query(this.query, (err, result) => {
            this.picpath = result[0].picpath;
            this.query = "DELETE FROM business_blogs WHERE id = " + this.id;        
              this.db.query(this.query, (err, result) => {
                if (err) {
                  this.db.close();        
                  reject(err);
                }
                fs.unlink("public/" + this.picpath, (err)=>{
                  this.db.close();
                  resolve(result);
                });
              });
            });
        });
    };
}

module.exports = {
    BusinessBlog: BusinessBlog
};