/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.DATABASE, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(async function (req, res){
      const project = req.params.project;
      const query = { ...req.query };
      
      // Convert _id to ObjectId if present
      if (query._id) {
        try {
          query._id = new ObjectId(query._id);
        } catch (err) {
          return res.status(400).json({ error: 'Invalid issue ID format' });
        }
      }

      // Fix: Convert open string to boolean
      if (query.open !== undefined) {
        query.open = query.open === 'true';
      }

      try {
        await client.connect();
        const collection = client.db("issue_tracker").collection(project);
        const docs = await collection.find(query).toArray();
        res.json(docs);
      } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error accessing database' });
      }
    })

    .post(async function (req, res){
      const project = req.params.project;
      const issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      };

      if(!issue.issue_title || !issue.issue_text || !issue.created_by) {
        return res.send('issue_title, issue_text and created_by are all required!');
      }

      try {
        await client.connect();
        const collection = client.db("issue_tracker").collection(project);
        const result = await collection.insertOne(issue);
        res.json(issue);
      } catch (err) {
        console.error('Error inserting issue:', err);
        res.status(500).json({ error: 'Could not insert issue' });
      }
    })

    .put(async function (req, res){
      const project = req.params.project;
      const id = req.body._id;
      const updates = {
        issue_title: req.body.issue_title || '',
        issue_text: req.body.issue_text || '',
        created_by: req.body.created_by || '',
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
      };

      Object.keys(updates).forEach(key => updates[key] === '' && delete updates[key]);

      if(Object.keys(updates).length === 0) {
        return res.send('No updated field sent');
      }

      updates.updated_on = new Date();
      updates.open = req.body.open === 'false' ? false : true;

      try {
        await client.connect();
        const collection = client.db("issue_tracker").collection(project);
        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updates },
          { returnDocument: 'after' }
        );
        
        // MongoDB 6.x returns the modified document directly
        if (result) {
          res.send('Successfully updated');
        } else {
          res.send('Could not update ' + id);
        }
      } catch (err) {
        console.error('Error updating:', err);
        res.send('Could not update ' + id);
      }
    })

    .delete(async function (req, res){
      const project = req.params.project;
      const id = req.body._id;

      if(!id) {
        return res.send('Input an ID to delete');
      }

      try {
        await client.connect();
        const collection = client.db("issue_tracker").collection(project);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if(result.deletedCount === 0) {
          res.send('Could not delete ' + id);
        } else {
          res.send('Deleted ' + id);
        }
      } catch (err) {
        console.error('Error deleting:', err);
        res.send('Could not delete ' + id);
      }
    });
};
