import { Schema, model } from 'mongoose';
const teamSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
}, { timestamps: true });
const Team = model('Team', teamSchema);
export default Team;
