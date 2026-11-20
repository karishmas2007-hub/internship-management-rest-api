const db = require("./database");

const internships = [
    {
        id: "INT-101",
        title: "Frontend Intern",
        domain: "Full Stack Development",
        mode: "Remote",
        location: "India",
        skills: ["HTML", "CSS", "JavaScript"],
        openings: 3
    },
    {
        id: "INT-102",
        title: "API Engineering Intern",
        domain: "Full Stack Development",
        mode: "Hybrid",
        location: "Pune",
        skills: ["Node.js", "SQL", "Testing"],
        openings: 2
    },
    {
        id: "INT-103",
        title: "UI/UX Intern",
        domain: "UI/UX",
        mode: "Remote",
        location: "India",
        skills: ["Figma", "Research", "Accessibility"],
        openings: 1
    },
    {
        id: "INT-104",
        title: "Data Analyst Intern",
        domain: "Data Analytics",
        mode: "On-site",
        location: "Bengaluru",
        skills: ["Excel", "SQL", "Data visualisation"],
        openings: 2
    },
    {
        id: "INT-105",
        title: "Security Operations Intern",
        domain: "Cyber Security",
        mode: "Remote",
        location: "India",
        skills: ["Linux", "Logs", "Networking"],
        openings: 1
    }
];

const sql = `
    INSERT OR REPLACE INTO internships
    (id, title, domain, mode, location, skills, openings)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.serialize(() => {
    internships.forEach((internship) => {
        db.run(sql, [
            internship.id,
            internship.title,
            internship.domain,
            internship.mode,
            internship.location,
            JSON.stringify(internship.skills),
            internship.openings
        ]);
    });
});

db.close(() => {
    console.log("5 internship records added successfully!");
});