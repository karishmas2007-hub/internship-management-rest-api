
const express = require("express");
const db = require("./database");

const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Internship API is running!"
    });
});

// Get all internships with pagination and filters
app.get("/api/internships", (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const { search, domain, mode } = req.query;

    let conditions = [];
    let params = [];

    if (search) {
        conditions.push("title LIKE ?");
        params.push(`%${search}%`);
    }

    if (domain) {
        conditions.push("domain = ?");
        params.push(domain);
    }

    if (mode) {
        conditions.push("mode = ?");
        params.push(mode);
    }

    const whereClause = conditions.length
        ? "WHERE " + conditions.join(" AND ")
        : "";

    const countSql = `
        SELECT COUNT(*) AS total
        FROM internships
        ${whereClause}
    `;

    db.get(countSql, params, (err, countResult) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Failed to count internships"
            });
        }

        const total = countResult.total;

        const sql = `
            SELECT * FROM internships
            ${whereClause}
            LIMIT ? OFFSET ?
        `;

        db.all(sql, [...params, limit, offset], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to fetch internships"
                });
            }

            const internships = rows.map((row) => ({
                ...row,
                skills: JSON.parse(row.skills)
            }));

            res.status(200).json({
                status: "success",
                data: internships,
                pagination: {
                    currentPage: page,
                    limit: limit,
                    totalRecords: total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        });
    });
});

// Get internship by ID
app.get("/api/internships/:id", (req, res) => {
    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to fetch internship"
                });
            }

            if (!row) {
                return res.status(404).json({
                    status: "error",
                    message: "Internship not found"
                });
            }

            res.status(200).json({
                status: "success",
                data: {
                    ...row,
                    skills: JSON.parse(row.skills)
                }
            });
        }
    );
});

// Create internship
app.post("/api/internships", (req, res) => {
    const { id, title, domain, mode, location, skills, openings } = req.body;

    if (
        typeof id !== "string" || !id.trim() ||
        typeof title !== "string" || !title.trim() ||
        typeof domain !== "string" || !domain.trim() ||
        typeof mode !== "string" ||
        typeof location !== "string" || !location.trim() ||
        !Array.isArray(skills) || skills.length === 0 ||
        !skills.every(skill => typeof skill === "string" && skill.trim()) ||
        !Number.isInteger(openings) || openings <= 0
    ) {
        return res.status(400).json({
            status: "error",
            message: "Please provide valid internship details"
        });
    }

    if (!["Remote", "Hybrid", "On-site"].includes(mode)) {
        return res.status(400).json({
            status: "error",
            message: "Mode must be Remote, Hybrid, or On-site"
        });
    }

    const sql = `
        INSERT INTO internships
        (id, title, domain, mode, location, skills, openings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        id.trim(),
        title.trim(),
        domain.trim(),
        mode,
        location.trim(),
        JSON.stringify(skills.map(skill => skill.trim())),
        openings
    ], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(409).json({
                    status: "error",
                    message: "Internship ID already exists"
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Failed to create internship"
            });
        }

        res.status(201).json({
            status: "success",
            message: "Internship created successfully",
            data: {
                id: id.trim(),
                title: title.trim(),
                domain: domain.trim(),
                mode,
                location: location.trim(),
                skills: skills.map(skill => skill.trim()),
                openings
            }
        });
    });
});

// Update internship
app.put("/api/internships/:id", (req, res) => {
    const { title, domain, mode, location, skills, openings } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof domain !== "string" || !domain.trim() ||
        typeof mode !== "string" ||
        typeof location !== "string" || !location.trim() ||
        !Array.isArray(skills) || skills.length === 0 ||
        !skills.every(skill => typeof skill === "string" && skill.trim()) ||
        !Number.isInteger(openings) || openings <= 0
    ) {
        return res.status(400).json({
            status: "error",
            message: "Please provide valid internship details"
        });
    }

    if (!["Remote", "Hybrid", "On-site"].includes(mode)) {
        return res.status(400).json({
            status: "error",
            message: "Mode must be Remote, Hybrid, or On-site"
        });
    }

    const sql = `
        UPDATE internships
        SET title = ?, domain = ?, mode = ?,
            location = ?, skills = ?, openings = ?
        WHERE id = ?
    `;

    db.run(sql, [
        title.trim(),
        domain.trim(),
        mode,
        location.trim(),
        JSON.stringify(skills.map(skill => skill.trim())),
        openings,
        req.params.id
    ], function (err) {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Failed to update internship"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                status: "error",
                message: "Internship not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Internship updated successfully",
            data: {
                id: req.params.id,
                title: title.trim(),
                domain: domain.trim(),
                mode,
                location: location.trim(),
                skills: skills.map(skill => skill.trim()),
                openings
            }
        });
    });
});

// Delete internship
app.delete("/api/internships/:id", (req, res) => {
    db.run(
        "DELETE FROM internships WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to delete internship"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Internship not found"
                });
            }

            res.status(200).json({
                status: "success",
                message: "Internship deleted successfully"
            });
        }
    );
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
