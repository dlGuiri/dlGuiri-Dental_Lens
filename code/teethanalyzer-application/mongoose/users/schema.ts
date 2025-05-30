import { Schema, InferSchemaType } from "mongoose";

// IMPORT the ScanRecord model just for type-checking/ref linking
// Only import the schema here if needed for virtuals (not in this case)
export const UserSchema = new Schema(
  {
    oauthProvider: {
      type: String,
      required: true,
      enum: ["google", "github", "facebook", "custom"],
    },
    oauthId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    teeth_status: {
      type: String,
      required: false,
    },
    scanRecords: [
      {
        type: Schema.Types.ObjectId,
        ref: "ScanRecord", // Mongoose will use this string to find the model
      },
    ],
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof UserSchema>;
