'use strict';
var readLineSync=require('readline-sync');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const username="cs5220stu27";
const password="11NPrWnIGQyf";
const dbUri=`mongodb://${username}:${password}@ecst-csproj2.calstatela.edu:6317/?authSource=${username}&authMechanism=SCRAM-SHA-1`;
//open connection and find 'users'
async function open(){
    try {
       var client=await MongoClient.connect(dbUri);
        var db=client.db(username);
        var collection=db.collection('users'); 
      var users=await collection.find().toArray();
      client.close();
    } catch (error) {
        console.log(error);
    }
    var arr=[];
    console.log('Main Menu\n');
    var disA=1;
    var disB=0;
    users.forEach(user => {
        arr.push(user.firstName);
        console.log(disA+++') '+arr[disB++]); 
    });
    console.log("X) Exit\nPlease enter your choice: ");
    var index=readLineSync.keyIn(null,{cancel:'EXIT',guide:false,limit:['$<1-9>','X'],limitMessage:'Invalid INPUT'} );
    if(index=='x'||index==-1){
       try {
           return null;
       } catch (error) {
           console.log(error);
       }
    }
    else{
        console.log("value of index before="+index);
        index--;
        console.log("value of index after="+index);
        return middleWare(index,users[index]);
    }
}
//middleware function
async function middleWare(index,userName){
    console.log('\nUser - '+userName.firstName);
    var options=['List the articles authored by the user',
    'Change first name','Change last name'
    ,'Change email'];
    let i=0;
    let j=0;
    options.forEach(u => {
        console.log(++i+') '+options[j++]); 
    });
    console.log("B) Back to Main Menu\nPlease enter your choice: ");
    var index1=readLineSync.keyIn(null,{limit:['$<1-4>','B'],limitMessage:'Invalid Input',cancel:'Back to Main Menu',guide:false});
    if(index1==-1||index1=='b'){
       return open();
    }
    else{
        index1--;
        ld(index,index1,userName);
    }
}
// LIST, Update details
async function ld(index,userIndex,userName){
    try {
        var client=await MongoClient.connect(dbUri);
        var db=client.db(username);
        var collection_users=db.collection('users');
        var collection_articles=db.collection('articles');
        var collection=await collection_articles.find({'author':userName._id}).toArray();
     } catch (error) {
         console.log(error);
     }
    switch(userIndex)
    {
        case 0:
           console.log('\nTitle :'+collection[0].title+'\nText :'+collection[0].text+'\n');
           client.close();
           middleWare(index,userName);
        break;
        case 1:
            const updateFirstName=readLineSync.question("Enter the First Name:\n");
            try{
                collection_users.updateOne({'_id':userName._id},{$set:{'firstName':updateFirstName}});
                userName=await collection_users.find().toArray();
                }
            catch(err){console.log(err);};
            console.log(userName[index].firstName+' '+userName[index].lastName+' first Name has changed');
            client.close();
            middleWare(index,userName[index]);
            break;
        case 2:
                const updateLastName=readLineSync.question("Enter the Last Name:\n",{limitMessage:'Invalid input'});
                try{
                    collection_users.updateOne({'_id':userName._id},{$set:{'lastName':updateLastName}});
                    userName=await collection_users.find().toArray();
                    }
                catch(err){console.log(err);};
                console.log(userName[index].firstName+' '+userName[index].lastName+' last Name has changed');
                client.close();
             middleWare(index,userName[index]);
            break;
        case 3:
                const updateEmail=readLineSync.questionEMail("Enter the new Email:\n");
                try{
                    collection_users.updateOne({'_id':userName._id},{$set:{'email':updateEmail}});
                    userName=await collection_users.find().toArray();
                    console.log(userName[index].firstName+' '+userName[index].lastName+' email has changed');
                    }
                catch(err){console.log(err);};
                client.close();
                middleWare(index,userName[index]);
            break;
    }}
open();

