var express = require("express");
var bodyparser = require("body-parser");
var jsonparser = bodyparser.json();
const router = express.Router();
var BusinessBlog = require("../../models/business/BusinessBlog");

router.post("/save", async (req, res) => {
    let body = req.body;
    let businessblog = new BusinessBlog.BusinessBlog();
    businessblog.id = body.data.id;
    businessblog.businessid = body.data.businessid;
    businessblog.categoryid = body.data.categoryid;
    businessblog.title = body.data.title;
    businessblog.urltitle = body.data.urltitle;
    businessblog.createdon = body.data.createdon;
    businessblog.author = body.data.author;
    businessblog.picpath = body.data.picpath;
    businessblog.body = body.data.body;
    businessblog.status = body.data.status;

    businessblog.save().then(result =>{
        let data = 
        {
            "data":{
                "status":"success",
                "data":result
            }
        }
        res.end(JSON.stringify(data));
    },
    
    err =>{
      console.log("err")
      
        let data = {
            "data":{
                "status":"fail"
            }
        };
        res.end(JSON.stringify(data))
    }
    );
});

router.post("/list", async (req, res) => {
    let body = req.body;
    let businessblog = new BusinessBlog.BusinessBlog();            
    businessblog.businessid = body.data.businessid;
    businessblog.categoryid = body.data.categoryid;
    businessblog.list().then(result =>{
    let data = 
        {
            "data":{
                "status":"success",
                "data":result
            }
        }
        res.end(JSON.stringify(data));
    },
    err =>{
        let data = {
            "data":{
                "status":"fail"
            }
        };
        res.end(JSON.stringify(data))
    }
    );
});


router.post("/changestatus", async (req, res) => {
  let body = req.body;
  let businessblog = new BusinessBlog.BusinessBlog();            
  businessblog.id = body.data.id;
  businessblog.status = body.data.status;
  businessblog.changestatus().then(result =>{
  let data = 
      {
          "data":{
              "status":"success",
              "data":result
          }
      }
      res.end(JSON.stringify(data));
  },
  err =>{
      let data = {
          "data":{
              "status":"fail"
          }
      };
      res.end(JSON.stringify(data))
  }
  );
});

router.post("/get", async (req, res) => {
    let body = req.body;
    let businessblog = new BusinessBlog.BusinessBlog();
    businessblog.id = body.data.id;
    businessblog.get().then(
      (result) => {
        let data = {
          data: {
            status: "success",
            data: result,
          },
        }
        res.end(JSON.stringify(data));
      },
      (err) => {
        let data = {
          data: {
            status: "fail",
          },
        };
        res.end(JSON.stringify(data));
      }
    );
  });

  router.post("/delete", async (req, res) => {
    let body = req.body;
    let businessblog = new BusinessBlog.BusinessBlog();
    businessblog.id = body.data.id;
    businessblog.delete().then(
      (result) => {
        let data = {
          data: {
            status: "success",
            data: result,
          },
        };
        res.end(JSON.stringify(data));
      },
      (err) => {
        let data = {
          data: {
            status: "fail",
          },
        };
        res.end(JSON.stringify(data));
      }
    );
  });
module.exports = router;