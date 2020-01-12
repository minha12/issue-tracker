/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    /*
    2. I can POST /api/issues/{projectname} with form data containing 
    required issue_title, issue_text, created_by, and optional 
    assigned_to and status_text.
    3. The object saved (and returned) will include all of those fields 
    (blank for optional no input) and also include created_on(date/time), 
    updated_on(date/time), open(boolean, true for open, false for closed), 
    and _id.
    */
    .post(function (req, res){
      var project = req.params.project;
      console.log('Project: ' + project)
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      }
      if(!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send('issue_title, issue_text and created_by are required!')
      } else {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if(err) console.log('Data based error: ' + err)
          else {
            console.log('Successfully connected to MongoDB')
            db.collection(project).insertOne(issue, (err, doc) => {
              if(err) console.log('Error while inserting issue: ' + err)
              console.log(issue)
              res.json(issue)
            })
          }
        })
      }
    })
  
    /*
    I can PUT /api/issues/{projectname} with a _id and any fields in the object 
    with a value to object said object. Returned will be 'successfully updated' 
    or 'could not update '+_id. This should always update updated_on. If no fields 
    are sent return 'no updated field sent'.
    */
    .put(function (req, res){
      var project = req.params.project;
      console.log('Project: ' + project)
      var id = req.body._id
      var updates = {
        issue_title: req.body.issue_title || '',
        issue_text: req.body.issue_text || '',
        created_by: req.body.created_by || '',
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
      }
      for(let prop in updates) {
        if(updates[prop] === '') {
          delete updates[prop]
        }
      }
      if(Object.keys(updates).length === 0) {
        console.log('No updated field sent')
        res.send('No updated field sent')
      } else {
        updates.update_on = new Date()
        updates.open = req.body.open
      }
    
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
