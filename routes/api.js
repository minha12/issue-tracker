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
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
