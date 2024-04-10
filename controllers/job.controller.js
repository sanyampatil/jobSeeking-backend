import { application } from 'express'
import { catchAsyncErrors } from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js'
import Job from '../model/job.model.js'

//get all jobs

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false })
  res.status(200).json({
    success: true,
    jobs
  })
})

//postJob

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user
  if (role === 'Job Seeker') {
    return next(
      new ErrorHandler('Job Seeker not allowed to access this resource.', 400)
    )
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo
  } = req.body

  console.log(
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary.salaryFrom.salaryTo
  )

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler('Please provide full job details.', 400))
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        'Please either provide fixed salary or ranged salary.',
        400
      )
    )
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler('Cannot Enter Fixed and Ranged Salary together.', 400)
    )
  }
  const postedBy = req.user._id
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy
  })
  res.status(200).json({
    success: true,
    message: 'Job Posted Successfully!',
    job
  })
})

//get my jobs

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user
  if (role === 'Job Seeker') {
    return next(
      new ErrorHandler('Job Seeker not allowed to access this resource.', 400)
    )
  }
  const myJobs = await Job.find({ postedBy: req.user._id })

  console.log('myjob', myJobs)

  res.status(200).json({
    success: true,
    myJobs
  })
})

//update job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user

  if (role === 'Job Seeker') {
    return next(
      new ErrorHandler('Job Seeker not allowed to access this resource.', 400)
    )
  }
  const { id } = req.params
  console.log('id', id)

  let job = await Job.findById(id)
  console.log('job', job)

  if (!job) {
    return next(new ErrorHandler('OOPS! Job not found.', 404))
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
    message: 'Job Updated!'
  })
})

//deletejob by emp

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user
  if (role === 'Job Seeker') {
    return next(
      new ErrorHandler('Job Seeker not allowed to access this resource.', 400)
    )
  }
  const { id } = req.params
  const job = await Job.findById(id)
  if (!job) {
    return next(new ErrorHandler('OOPS! Job not found.', 404))
  }
  await job.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Job Deleted!'
  })
})

//get single job

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params
  console.log('id', id)

  try {
    const job = await Job.findById(id)
    if (!job) {
      return next(new ErrorHandler('Job not found.', 404))
    }
    res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404))
  }
})
