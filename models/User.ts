import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser, UserRole, UserStatus } from '@/types/index';

interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['viewer', 'analyst', 'admin'],
      default: 'viewer',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) return
  if (this.passwordHash && this.passwordHash.startsWith('$2')) return
  this.passwordHash = await bcryptjs.hash(this.passwordHash, 12)
});

// Method to compare password
userSchema.methods.comparePassword = async function (plainPassword: string): Promise<boolean> {
  return bcryptjs.compare(plainPassword, this.passwordHash);
};

const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User;
