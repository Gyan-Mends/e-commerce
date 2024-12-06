import { Schema } from "mongoose";
import mongoose from "~/mongoose.server";
import { SalesInterface } from "~/interfaces/interface";

const SalesSchema = new mongoose.Schema({
  products: [{
    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
      },
    quantity:{
        type:Number,
        required:true
    },
    costPrice: {
      type: Number,
    }
  }],
  attendant: {
    type: Schema.Types.ObjectId,
    ref: "registration",
    required: true
  },
  totalAmount: {
    type: String,
    required: true
  },
  amountPaid: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

let Sales: mongoose.Model<SalesInterface>;

try {
  Sales = mongoose.model<SalesInterface>("sales");
} catch (error) {
  Sales = mongoose.model<SalesInterface>("sales", SalesSchema);
}

export default Sales;
