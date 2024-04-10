import { application } from 'express'
import { catchAsyncErrors } from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js'
import { Job } from '../model/job.model.js'
import cloudinary from 'cloudinary'
import { Application } from '../model/application.model.js'

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user
  console.log('role', role)

  if (role === 'Employer') {
    return next(
      new ErrorHandler('Employer not allowed to access this resource.', 400)
    )
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Resume File Required!...', 400))
  }

  const { resume } = req.files
  console.log('resume', req.files)

  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler('Invalid file type. Please upload a PNG file.', 400)
    )
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  )

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      'Cloudinary Error:',
      cloudinaryResponse.error || 'Unknown Cloudinary error'
    )
    return next(new ErrorHandler('Failed to upload Resume to Cloudinary', 500))
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body

  console.log(name, email, coverLetter, phone, address, jobId)

  const applicantID = {
    user: req.user._id,
    role: 'Job Seeker'
  }
  if (!jobId) {
    return next(new ErrorHandler('Job not found!', 404))
  }
  const jobDetails = await Job.findById(jobId)
  if (!jobDetails) {
    return next(new ErrorHandler('Job not found!', 404))
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: 'Employer'
  }
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler('Please fill all fields.', 400))
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  })
  res.status(200).json({
    success: true,
    message: 'Application Submitted!',
    application
  })
})

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user
    if (role === 'Job Seeker') {
      return next(
        new ErrorHandler('Job Seeker not allowed to access this resource.', 400)
      )
    }
    const { _id } = req.user

    console.log('userId', _id)

    const applications = await Application.find({ 'employerID.user': _id })
    console.log('application', application)

    res.status(200).json({
      success: true,
      applications
    })
  }
)

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user
    if (role === 'Employer') {
      return next(
        new ErrorHandler('Employer not allowed to access this resource.', 400)
      )
    }
    const { _id } = req.user
    console.log('userId', _id)

    const applications = await Application.find({ 'applicantID.user': _id })
    res.status(200).json({
      success: true,
      applications
    })
  }
)

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user
    if (role === 'Employer') {
      return next(
        new ErrorHandler('Employer not allowed to access this resource.', 400)
      )
    }
    const { id } = req.params
    const application = await Application.findById(id)
    if (!application) {
      return next(new ErrorHandler('Application not found!', 404))
    }
    await application.deleteOne()
    res.status(200).json({
      success: true,
      message: 'Application Deleted!'
    })
  }
)
