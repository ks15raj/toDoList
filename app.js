const express=require('express')
const ejs=require('ejs')
const mongoose = require('mongoose');
const _ = require('lodash');
app=express()

app.set('view engine',"ejs")
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

mongoose.connect(
'mongodb://localhost:27017/toDoList'
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const listSchema={
    name:String
}
const Item = mongoose.model('Item',listSchema)

const item1= new Item({
    name:"Welcome to your toDo List."
})
const item2 = new Item({
    name:"Hit the + button to add new item."
})
const item3 = new Item({
    name:"<-- Hit this to delete item."
})
const defaultit=[item1,item2,item3]

const itemSchema={
    name:String,
    items: [listSchema]
}
const List = mongoose.model('List',itemSchema)
let day= 'Today'

app.get("/",(req,res)=>{
   
   Item.find({},function(err,foundItems){
       if(foundItems.length==0){
        Item.insertMany(defaultit,function(err){
            if(err){
                console.log(err)
            }else{
                console.log('Succesfully Added');
            }
        })
        res.redirect('/')
       }else{
    res.render("index",{newa:day,itemss:foundItems})
       }
   })
   
})
app.post('/delete', (req, res) => {
const check = req.body.checkbox;
const listName= _.capitalize(req.body.listName);
if(listName===day) {
    Item.findByIdAndRemove(check,function(err){
        if(!err){ 
            res.redirect('/')  }
     })
    
}else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:check}}},function(err,result){
        if(!err){
            res.redirect('/'+listName)
        }
    })
}

});

app.get('/:custom',function(req,res) {
    const customName=req.params.custom

List.findOne({name:customName},function(err,result) {
if(!err){
    if(!result){
        const list = new List({
            name:customName,
            items:defaultit
        })
        list.save()
        res.redirect('/'+ customName)
    }else{
        res.render("index",{newa:result.name,itemss:result.items})
    }
}    
})

   
})




app.post('/',function(req,res){
  let itemName= req.body.newItem
  let buttonvalue = req.body.list
const item = new Item({
    name:itemName
})
if(buttonvalue===day){
    item.save();
    res.redirect('/')
}else{
    List.findOne({name:buttonvalue},function(err,result){
        result.items.push(item)
        result.save()
        res.redirect('/'+buttonvalue)
    })
}
})

app.listen(3000,()=>
{
console.log("Server is up and running");
})