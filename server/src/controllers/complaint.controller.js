// src/controllers/complaint.controller.js

import { generateComplaintId } from "../utils/generateComplaintId.js";
import { uploadToCloudinary } from "../services/upload.service.js";
import { categorizeComplaint } from "../services/ai/categorize.service.js";
import { getRoutedDepartment } from "../services/routing.service.js";
import Complaint from "../models/Complaint.model.js";
import { User } from "../models/User.model.js";
import * as dotenv from "dotenv";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { sendComplaintMail, sendStatusUpdateMail } from "../utils/sendMail.js";

dotenv.config();

export const submitComplaint = async (req, res) => {
  const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const startedAt = Date.now();
  const logStep = (step, details = {}) => console.log(
    `[complaint:${requestId}] ${new Date().toISOString()} ${step}`,
    Object.keys(details).length ? details : "",
  );

  try {
    const { rawText, pnrNumber } = req.body;
    const files = req.files;

    logStep("submission started", { userId: req.user?.userId, hasText: Boolean(rawText?.trim()), fileCount: files?.length ?? 0, hasPnr: Boolean(pnrNumber) });

    // ── Validation ─────────────────────────────────────────────────────────
    if ((!files || files.length === 0) && !rawText) {
      logStep("validation failed: no text or files");
      return errorResponse(
        res,
        "Please provide an image, video, audio or text",
        400,
      );
    }

    // ── 1. Upload files to Cloudinary ──────────────────────────────────────
    let mediaFiles = [];
    let firstImageUrl = null;

    if (files && files.length > 0) {
      logStep("file upload started", { fileCount: files.length });
      for (const [index, file] of files.entries()) {
        logStep("uploading file", { file: index + 1, mimeType: file.mimetype, sizeBytes: file.size });
        try {
          const uploaded = await uploadToCloudinary(file.buffer, file.mimetype);
          mediaFiles.push(uploaded);
          logStep("file uploaded", { file: index + 1, type: uploaded.type });
          if (!firstImageUrl && uploaded.type === "image") firstImageUrl = uploaded.url;
        } catch (error) {
          logStep("file upload failed", { file: index + 1, message: error.message });
          throw error;
        }
      }
    }
    logStep("file upload stage complete", { uploadedCount: mediaFiles.length, hasImage: Boolean(firstImageUrl) });

    // ── 2. AI — Categorize + Urgency (single call) ─────────────────────────
    let category = "Other";
    let urgency = "Low";
    let confidence = 0.5;
    let description = rawText || "";
    let aiModel = process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free";

    if (firstImageUrl) {
      logStep("AI categorization started", { input: "image and text" });
      const aiResult = await categorizeComplaint(firstImageUrl, rawText || "");
      category = aiResult.category;
      urgency = aiResult.urgency;
      confidence = aiResult.confidence;
      description = aiResult.description;
      aiModel = aiResult.model || aiModel;
    } else if (rawText) {
      logStep("AI categorization started", { input: "text" });
      const aiResult = await categorizeComplaint(null, rawText);
      category = aiResult.category;
      urgency = aiResult.urgency;
      confidence = aiResult.confidence;
      description = aiResult.description;
      aiModel = aiResult.model || aiModel;
    }

    logStep("AI categorization complete", { category, urgency, confidence });

    // ── 3. Smart Department Routing ────────────────────────────────────────
    const departmentId = await getRoutedDepartment(category);

    logStep("department routing complete", { departmentId: String(departmentId) });

    // ── 4. Generate Unique Complaint ID ────────────────────────────────────
    const complaintId = generateComplaintId();
    logStep("complaint ID generated", { complaintId });

    // ── 5. Save to MongoDB ─────────────────────────────────────────────────
    const newComplaint = await Complaint.create({
      complaintId,
      submittedBy: req.user.userId,
      mediaFiles,
      department: departmentId,
      rawText: rawText || "",
      pnrNumber: pnrNumber || null,
      category,
      urgency,
      status: "Pending",
      timeline: [
        {
          status: "Pending",
          note: "Complaint registered successfully",
          updatedBy: req.user.userId,
          updatedAt: new Date(),
        },
      ],
      aiMetadata: {
        model: aiModel,
        confidence,
        description,
        processedAt: new Date(),
      },
    });
    logStep("complaint saved", { complaintId: newComplaint.complaintId });

    const user = await User.findById(req.user.userId).select("firstName email");
    logStep("submitter loaded", { found: Boolean(user) });

    await newComplaint.populate("department", "name");
    logStep("department details loaded");

    sendComplaintMail({
      to: user.email,
      name: user.firstName,
      complaintId: newComplaint.complaintId,
      pnrNumber: newComplaint.pnrNumber,
      category: newComplaint.category,
      urgency: newComplaint.urgency,
      department: newComplaint.department?.name ?? "Railways",
      status: newComplaint.status,
      createdAt: newComplaint.createdAt,
    });
    logStep("confirmation email queued");
    // ── 6. Response ────────────────────────────────────────────────────────
    const responsePayload = {
      success: true,
      message: "Complaint registered successfully",
      data: {
        complaintId: newComplaint.complaintId,
        category: newComplaint.category,
        urgency: newComplaint.urgency,
        department: departmentId,
        status: newComplaint.status,
        mediaCount: mediaFiles.length,
      },
    };

    logStep("response sent", { statusCode: 201, complaintId: newComplaint.complaintId, durationMs: Date.now() - startedAt });

    return res.status(201).json(responsePayload);
  } catch (error) {
    logStep("submission failed", { message: error.message, durationMs: Date.now() - startedAt });
    console.error(`[complaint:${requestId}] stack`, error.stack);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Get My Complaints (Passenger) ──────────────────────────────────────────────
export const getMyComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;

    const filter = { submittedBy: req.user.userId };
    if (status && typeof status === "string") filter.status = status;
    if (category && typeof category === "string") filter.category = category;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const complaints = await Complaint.find(filter)
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      message: "Complaints fetched successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Get Single Complaint (Passenger) ───────────────────────────────────────────
export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ complaintId })
      .populate("department", "name description")
      .populate("submittedBy", "firstName lastName email");

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint fetched successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// ── Get Department Complaints (Department Employee / Admin) ────────────────────
export const getDepartmentComplaints = async (req, res) => {
  try {
    if (req.user.role !== "department_employee" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only department employees and admins can view these complaints."
      });
    }

    const { status, urgency, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (req.user.role === "department_employee") {
      if (!req.user.department) {
        return res.status(400).json({
          success: false,
          message: "User is not assigned to any department"
        });
      }
      filter.department = req.user.department;
    }

    if (status && typeof status === "string") filter.status = status;
    if (urgency && typeof urgency === "string") filter.urgency = urgency;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const complaints = await Complaint.find(filter)
      .populate("department", "name description")
      .populate("submittedBy", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      message: "Department complaints fetched successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Get department complaints error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Update Complaint Status (Department Employee / Admin) ────────────────────
export const updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== "department_employee" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only department employees and admins can update complaints."
      });
    }

    const { complaintId } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const complaint = await Complaint.findOne({ complaintId })
      .populate("submittedBy", "firstName email")
      .populate("department", "name");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    // Check if the department employee belongs to the same department as the complaint
    if (req.user.role === "department_employee") {
      if (!req.user.department || complaint.department._id.toString() !== req.user.department.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only update complaints assigned to your department."
        });
      }
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user.userId,
      updatedAt: new Date(),
    });

    await complaint.save();

    // Send email notification to user
    if (complaint.submittedBy && complaint.submittedBy.email) {
      sendStatusUpdateMail({
        to: complaint.submittedBy.email,
        name: complaint.submittedBy.firstName,
        complaintId: complaint.complaintId,
        pnrNumber: complaint.pnrNumber,
        category: complaint.category,
        urgency: complaint.urgency,
        createdAt: complaint.createdAt,
        status,
        note: note || "",
        department: complaint.department?.name || "Railways",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Get All Complaints (Admin) ────────────────────────────────────────────────
export const getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view all complaints."
      });
    }

    const { status, urgency, category, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && typeof status === "string") filter.status = status;
    if (urgency && typeof urgency === "string") filter.urgency = urgency;
    if (category && typeof category === "string") filter.category = category;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const complaints = await Complaint.find(filter)
      .populate("department", "name description")
      .populate("submittedBy", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      message: "All complaints fetched successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Get My Complaint Statistics (Passenger) ────────────────────────────────────
export const getMyComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      { $match: { submittedBy: req.user.userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedStats = {
      Pending: 0,
      InProgress: 0,
      Resolved: 0,
      Rejected: 0,
      Total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.Total += stat.count;
    });

    return res.status(200).json({
      success: true,
      message: "Complaint statistics fetched successfully",
      data: formattedStats,
    });
  } catch (error) {
    console.error("Get complaint stats error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};

// ── Get Admin Dashboard Statistics (Admin) ────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view these statistics."
      });
    }

    const complaintStats = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedComplaintStats = {
      Pending: 0,
      InProgress: 0,
      Resolved: 0,
      Rejected: 0,
      Total: 0
    };

    complaintStats.forEach(stat => {
      formattedComplaintStats[stat._id] = stat.count;
      formattedComplaintStats.Total += stat.count;
    });

    const userStats = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const formattedUserStats = {
      passenger: 0,
      department_employee: 0,
      admin: 0,
      Total: 0
    };

    userStats.forEach(stat => {
      formattedUserStats[stat._id] = stat.count;
      formattedUserStats.Total += stat.count;
    });

    const data = {
      complaints: formattedComplaintStats,
      users: formattedUserStats
    };

    return res.status(200).json({
      success: true,
      message: "Admin statistics fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get admin stats error:", error.message);
    return errorResponse(res, "Something went wrong", 500);
  }
};
