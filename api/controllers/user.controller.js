import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getdetails = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "You can only access data from your own account!")
    );
  try {
    const validUser = await User.findById(req.user.id);
    res.json({ status: "success", data: validUser });
  } catch (err) {
    next(errorHandler(err));
  }
};
