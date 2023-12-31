const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarschipAvailable: {
        type: Boolean,
        default: false

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    //creating relationship
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    //creating relationship with users
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false
    }
})


// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' }
        }
      }
    ]);
  
    const averageCost = obj[0]
      ? Math.ceil(obj[0].averageCost / 10) * 10
      : undefined;
    try {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageCost,
      });
    } catch (err) {
      console.log(err);
    }
  };


//Call getaverage coset after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp)
})

//Call getaverage coset before remove
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp) 
})

module.exports = mongoose.model('Course', CourseSchema)