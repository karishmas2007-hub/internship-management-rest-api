
# Internship Management REST API

A RESTful API built using Node.js, Express.js, and SQLite to manage internship records with persistent database storage.

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- PowerShell for API testing

## Features

- Create new internship records
- Retrieve all internships
- Retrieve an internship by ID
- Update existing internships
- Delete internships
- Search internships by title
- Filter by domain and work mode
- Pagination support
- Input validation
- Duplicate ID prevention
- Persistent SQLite database storage

## Project Structure

```text
internship-api/
│
├── server.js
├── database.js
├── seed.js
├── internships.db
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

1. Clone the repository.

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

2. Open the project folder.

```bash
cd internship-api
```

3. Install dependencies.

```bash
npm install
```

4. Start the server.

```bash
node server.js
```

The API runs at:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/internships | Get all internships |
| GET | /api/internships/:id | Get internship by ID |
| POST | /api/internships | Create internship |
| PUT | /api/internships/:id | Update internship |
| DELETE | /api/internships/:id | Delete internship |

## Search, Filters and Pagination

Search by title:

```text
/api/internships?search=Frontend
```

Filter by domain:

```text
/api/internships?domain=Cyber%20Security
```

Filter by work mode:

```text
/api/internships?mode=Remote
```

Pagination:

```text
/api/internships?page=1&limit=2
```

## Sample Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "INT-101",
      "title": "Frontend Intern",
      "domain": "Full Stack Development",
      "mode": "Remote",
      "location": "India",
      "skills": ["HTML", "CSS", "JavaScript"],
      "openings": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 2,
    "totalRecords": 5,
    "totalPages": 3
  }
}
```

## Database

SQLite is used for persistent storage. Internship records are stored in `internships.db`.

To insert the sample internship records, run:

```bash
node seed.js
```

## Validation

The API validates required fields, internship modes, skills, and opening counts. It also prevents duplicate internship IDs.

## Author

Developed as part of a Full Stack Web Development Internship project.
