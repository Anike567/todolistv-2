const express = require('express');


const bodyparser = require('body-parser');


const mongoose = require('mongoose');


const date = require(__dirname + "/date.js");


const app = express();

const _ = require("lodash");


app.use(express.static("public"))


app.set('view engine', 'ejs');


app.use(bodyparser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://admin-aniket:Test123@cluster0.bikic.mongodb.net/todolistDB");


const itemSchema = {
    name: String
};


const Item = mongoose.model("item", itemSchema);


const listSchema = {
    name: String,
    items: [itemSchema]
};



const List = mongoose.model("List", listSchema);

app.get('/', (req, res) => {


    var day = date();

    Item.find(function (err, data) {


        if (err) {
            console.log(err);
        }


        else {
            res.render('index', { day: "Today", list: data });
        }


    });



});
app.get("/:customListName", function (req, res) {


    const customListName = _.capitalize(req.params.customListName);


    List.findOne({ name: customListName }, function (err, _list) {

        if (!err) {
            if (_list) {
                // console.log("exits");
                res.render('index', { day: customListName, list: _list.items })
            }


            else {
                // console.log("not exists");
                const list = new List({
                    name: customListName,
                    items: []
                });
                list.save();
                List.findOne({ name: customListName }, function (err, foundList) {
                    if (!err) {
                        res.render('index', { day: customListName, list: list.items });
                    }
                });
            }


        }


        else {
            console.log(err);
        }
    })


});


app.post("/", function (req, res) {



    const listName = req.body.list;
    const newItem = new Item({
        name: req.body.nam
    });



    if (listName === "Today") {
        newItem.save();

        res.redirect("/");
    }



    else {


        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }



});



app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox;

    const listName = req.body.listName

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                // console.log("item deleted succesfully");
                res.redirect("/");
            }
        });
    }



    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
})

let port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}
app.listen(port, function(){


    console.log("server has started");

    
});