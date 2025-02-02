const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Load Blogs
const BLOGS_FILE = "./data/blogs.json";

app.get("/blogs", (req, res) => {
  fs.readFile(BLOGS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load blogs" });
    }
    res.json(JSON.parse(data));
  });
});

// Add New Blog Post
app.post("/add-blog", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required" });
  }

  fs.readFile(BLOGS_FILE, "utf8", (err, data) => {
    let blogs = err ? [] : JSON.parse(data);
    const newBlog = {
      id: blogs.length + 1,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
    };

    blogs.unshift(newBlog);

    fs.writeFile(BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ error: "Failed to save blog" });
      res
        .status(201)
        .json({ message: "Blog added successfully!", blog: newBlog });
    });
  });
});

// Contact Form Email API
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "madhupsinghal321@gmail.com",
      pass: "zcby xcsa vzut amdf",
    },
  });

  let mailOptions = {
    from: email,
    to: "your-email@gmail.com",
    subject: "Contact Form Submission from ${name}",
    text: `Name: ${req.body.name}
Email: ${req.body.email}
Message: ${req.body.message}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ error: "Failed to send email" });
    res.status(200).json({ message: "Email sent successfully!" });
  });
});

// Start Server
app.listen(PORT, () =>
  console.log("Server running at http://localhost:${PORT}")
);
