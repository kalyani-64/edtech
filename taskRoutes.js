const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const user = req.user;
    let tasks;

    if (user.role === "student") {
      tasks = await Task.find({ userId: user._id });
    } else {
      const students = await User.find({ teacherId: user._id }).select("_id");
      const studentIds = students.map((s) => s._id);

      tasks = await Task.find({
        $or: [
          { userId: user._id },
          { userId: { $in: studentIds } }
        ]
      });
    }

    res.json({ success: true, tasks });
  } catch (err) { next(err); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const task = await Task.create({
      userId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate
    });

    res.json({ success: true, task });
  } catch (err) { next(err); }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString())
      return res.json({ success: false, message: "Not allowed" });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, updated });
  } catch (err) { next(err); }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString())
      return res.json({ success: false, message: "Not allowed" });

    await task.deleteOne();

    res.json({ success: true, message: "Task deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
