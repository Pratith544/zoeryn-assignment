import mongoose, { Schema, Document, Types } from 'mongoose';
import { IFinancialRecord } from '@/types/index';

interface IFinancialRecordDocument extends Omit<IFinancialRecord, '_id' | 'createdBy'>, Document {
  createdBy: Types.ObjectId;
}

const financialRecordSchema = new Schema<IFinancialRecordDocument>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be a positive number'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function (value: Date) {
          const oneDayInFuture = new Date();
          oneDayInFuture.setDate(oneDayInFuture.getDate() + 1);
          return value <= oneDayInFuture;
        },
        message: 'Date cannot be more than 1 day in the future',
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'CreatedBy is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Create indexes for performance
financialRecordSchema.index({ date: 1 });
financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ isDeleted: 1 });

const FinancialRecord =
  mongoose.models.FinancialRecord ||
  mongoose.model<IFinancialRecordDocument>('FinancialRecord', financialRecordSchema);

export default FinancialRecord;
