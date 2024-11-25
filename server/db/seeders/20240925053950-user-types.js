'use strict';

module.exports = {
  up: (models, mongoose) => {
    
      return models.user_types.insertMany([
        {
          _id : "66f41c79384f7819814abf15",
          user_type : "admin"
        },
        {
          _id : "66f420a7384f7819814abf1a",
          user_type : 'employee'
        }
       
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
   
    return models.user_types.deleteMany({
      _id: {
        $in: [
          "66f41c79384f7819814abf15",
          "66f420a7384f7819814abf1a"
        ]
      }
    }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};
