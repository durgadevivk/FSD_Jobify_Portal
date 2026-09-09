const Job = require("../models/job");
const Application =require('../models/application');
const jobController = {
  getAllJobs: async (req, res) => {
    try {
      //get page,limit,search,location,jobType,experienceLevel from request.query
      const {
        page = 1,
        limit = 10,
        search,
        location,
        jobType,
        experienceLevel,
      } = req.query;
      //prepare the query
      const query = {
        isActive: true,
      };
      //if search is provided,add it to the query object
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { skills: { $in: [new RegExp(search, "i")] } },
        ];
      }
      //if location is provided add it to the query object
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
      //if jobtype is provided ass to the query object
      if (jobType) {
        query.jobType = jobType;
      }
      //if experienceLevel is provided ass to the query object
      if (experienceLevel) {
        query.experienceLevel = experienceLevel;
      }
      //get jobs from db using the query object and pagination
      const jobs = await Job.find(query)
        .populate("company", "name logo location industry")
        .populate("postedBy", "name")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      //get the total count of jobs ffrom db
      const total = await Job.countDocuments(query);
      //retutn responseeith the jobs,totalpages,currentpage and totaljobs
      return res.status(200).json({
        jobs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalJobs: total,
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
  getJobById: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findById(id)
        .populate("company", "name logo location industry website description")
        .populate("postedBy", "name");
      if (!job) {
        return res.status(404).json({ message: "job not found" });
      }
      return res.status(200).json({ job });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },

  createJob: async (req, res) => {
    try {
      const {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experienceLevel,
        skills,
        applicationDeadLine,
      } = req.body;
      const newJob = new Job({
        title,
        description,
        requirements: requirements || [],
        salary,
        location,
        jobType,
        experienceLevel,
        skills: skills || [],
        applicationDeadLine,
        postedBy: req.userId,
        company: req.user.assignedCompany,
      });
      const savedJob = await newJob.save();
      const populatedJob = await Job.findById(savedJob._id)
        .populate("company", "name logo location industry ")
        .populate("postedBy", "name");
      return res.status(200).json({
        message: "created job",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
  updateJob: async (req, res) => {
    try {
       const { id } = req.params;
       const updates=req.body;
       const updatedJob=await Job.findByIdAndUpdate(id,updates,{new:true})
                               .populate("company", "name logo location industry ")
                                .populate("postedBy", "name");
        if(!updatedJob){
            return res.status(404).json({
        message: "job not found",
        })
    }
        return res.status(200).json({
        message: "job updated",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
  deleteJob: async (req, res) => {
    try {
      const { id } = req.params;
       const deletedJobs=await Job.findByIdAndDelete(id);
       if(!deletedJobs){
         return res.status(404).json({
        message: "job not deleted",
        })
       }
        return res.status(200).json({
        message: "job deleted",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
  getRecruiterJobs: async (req, res) => {
    try {
        const jobs=await Job.find({postedBy:req.userId})
                            .populate("company", "name logo location industry ")
                            .populate("postedBy", "name")
                            .sort({createdAt:-1});
        return res.status(200).json({
        message: "get recruiter jobs",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
  getJobApplications: async (req, res) => {
    try {
         const { id } = req.params;
         const job=await Job.findOne({_id:id,postedBy:req.userId});
         if(!job){return res.status(404).json({
        message: "job not found or u r not authorized to see applications",
      });}
      const applications =await Application.find({job:id})
                            .populate('applicant','name email resume phone profilePicture bio skills experience location')
                            .populate('job', 'title')
                            .sort({appliedAt:-1});
      return res.status(200).json({applications});
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  },
};

module.exports = jobController;
