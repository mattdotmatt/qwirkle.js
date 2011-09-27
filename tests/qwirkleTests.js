// qwirkleTests.js

var vows = require('vows'),assert =require('assert'),Qwirkle=require('../qwirkle');

var bag = Qwirkle.Bag;

vows.describe('Bag Contents').addBatch({
    'When starting the game': 
        { 
            topic: new(bag),

        'the bag should contain 108 tiles': function (bag) {
            assert.equal (bag.length, 108);
        }
        /*,
        
        'split into 6 groups of 18': function (bag) {
            assert.equal (bag.stars.length, 6);
            assert.equal (bag.cross.length, 6);
        }
        */
        
    }
}).run(); // Run it    
