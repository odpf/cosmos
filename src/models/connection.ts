import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConnectionDocument extends Document {
  urn: string;
  name: string;
  type: string;
  credentials: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConnectionModel extends Model<IConnectionDocument> {
  list(): Promise<Array<IConnectionDocument>>;
  findByUrn(urn: string): Promise<IConnectionDocument>;
}

const ConnectionSchema = new Schema<IConnectionDocument, IConnectionModel>(
  {
    urn: {
      type: String,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      required: 'name is required'
    },
    type: {
      type: String,
      trim: true,
      required: 'type is required'
    },
    credentials: {
      type: String,
      trim: true,
      required: 'credentials is required'
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

ConnectionSchema.statics.list = function list() {
  return this.find({}, { _id: 0 }).lean().exec();
};

ConnectionSchema.statics.findByUrn = function findByUrn(urn) {
  return this.findOne({ urn }, { _id: 0 }).lean().exec();
};

export default mongoose.model<IConnectionDocument, IConnectionModel>(
  'Connection',
  ConnectionSchema
);