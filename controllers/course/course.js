import Course from "../../models/course/course.js";
import User from "../../models/user/user.js";
import ApiError from "../../middleware/errors/customError.js";
import CourseSection from "../../models/course/course-section.js";
export const createNewCourse = async (req, res, next) => {
   if(!req.isInstructor) return next(new ApiError("You are not authorized to create a course", 403));
  const NewCourse = new Course({ ...req.body  , instructorID: req.userId });
  try {
    const course = await NewCourse.save();
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};
export const getCourseById = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if(!course) return next(new ApiError("Course not found", 404));
    const courseSections = await CourseSection.find({courseID: courseId});
    course.courseSections = courseSections;
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};
export const updateCourse = async (req, res, next) => {
  if(!req.isInstructor) return next(new ApiError("You are not authorized to update a course", 403));
  if(req.userId !== req.body.instructorID) return next(new ApiError("You are not authorized to update this course", 403));
  const { courseId } = req.params;
  try {
    const course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    res.status(200).json(course);
  }
  catch (error) {
    next(error);
  }
};
export const deleteCourse = async (req, res, next) => {
  if(!req.isInstructor) return next(new ApiError("You are not authorized to update a course", 403));
  if(req.userId !== req.body.instructorID) return next(new ApiError("You are not authorized to update this course", 403));
  const { courseId } = req.params;
  try {
    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
