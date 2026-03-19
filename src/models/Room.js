import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  inviteCode: {
    type: String,
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);