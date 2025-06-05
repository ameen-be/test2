import mongoose from "mongoose"

const StageSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
  date: String,
  feedbackRounds: Number,
  maxFeedbackRounds: Number,
  feedbackDeadline: String,
})

const CommentSchema = new mongoose.Schema({
  id: Number,
  user: String,
  text: String,
  date: String,
})

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  clientEmail: { type: String, required: true },
  startDate: String,
  currentStage: Number,
  stages: [StageSchema],
  comments: [CommentSchema],
  isLate: Boolean,
  lateReason: String,
})

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema)