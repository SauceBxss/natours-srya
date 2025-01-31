const mongoose = require("mongoose");
const {Schema} = mongoose
const slugify = require("slugify");

const toursSchema = new Schema({
  name: {
    type: String,
    required: [true, "tour name is a required field"],
    unique: true,
    minLength: [4, "tour name must have a minimum of 4 characters"],
    maxLength: [30, "name must have a maximum of 30 characters"],
  },
  urlSlug: String,
  rating: {
    required: true,
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "tour price is a required field"],
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function (valOfDiscountPrice) {
        return valOfDiscountPrice < this.price;
      },
      message: "Discount price {VALUE} must be less than the original price",
    },
  },
  description: {
    type: String,
    required: [true, "tour description is required"],
    trim: true,
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    trim: true,
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "->'{VALUE}'<- must be either easy, medium or difficult",
    },
  },
  summary: {
    type: String,
    required: [true, "tour summary is a required field"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: {
    type: [Date],
    required: true,
  },
  noOfGroups: {
    type: Number,
    required: true,
  },
  imageCover: {
    type: String,
    required: [true, "tour must contain cover image"],
  },
  images: [String],
  duration: {
    type: Number,
    default: Date.now(),
  },
  ratingsAverage: {
    type: Number,
    required: false,
    default: 4.5,
    min: [1, "rating must be at least 1.0 "],
    max: [10, "rating must be under 10.0 "],
  },
  ratingsCount: {
    type: Number,
    required: false,
  },
  VIPtours: {
    type: String,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// toursSchema.index({ name: 1 }, { unique: true });

toursSchema.virtual("durationInWeeks").get(function () {
  const weeks = this.duration / 7;
  const weekString = weeks === 1 ? "week" : "weeks";
  return `${weeks} ${weekString}`;
});

toursSchema.pre("save", function () {
  this.urlSlug = slugify(this.name, { replacement: "-", lower: true });
});

toursSchema.pre(/^find/, function (next) {
  this.find({ VIPtours: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (resp, next) {
  console.log(`it took ${Date.now() - this.start} millisecs`);
  next();
});


const Tour = mongoose.model("Tour", toursSchema);
// Tour.createIndexes();
module.exports = Tour;
