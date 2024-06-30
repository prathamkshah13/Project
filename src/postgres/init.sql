-- Creating the Roles table
CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleName VARCHAR(10) NOT NULL CHECK (RoleName IN ('Student', 'Admin', 'Instructor', 'TA'))
);

-- Creating the Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    RoleID INT NOT NULL,
    VerificationCode VARCHAR(255),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Creating the Courses table
CREATE TABLE Courses (
    CourseID SERIAL PRIMARY KEY,
    Term INT NOT NULL,
    StartDate TIMESTAMP(3) NOT NULL,
    EndDate TIMESTAMP(3) NOT NULL,
    AccessCode VARCHAR(36) UNIQUE
);

-- Creating the CourseInstructors table
CREATE TABLE CourseInstructors (
    CourseInstructorID SERIAL PRIMARY KEY,
    CourseID INT NOT NULL,
    UserID INT NOT NULL,
    Role VARCHAR(10) NOT NULL CHECK (Role IN ('Instructor', 'TA')),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Creating the Enrollments table
CREATE TABLE Enrollments (
    EnrollmentID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    CourseID INT NOT NULL,
    EnrollmentDate TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Creating the Assignments table
CREATE TABLE Assignments (
    AssignmentID SERIAL PRIMARY KEY,
    CourseID INT NOT NULL,
    AssignmentName VARCHAR(100) NOT NULL,
    AssignmentDescription TEXT,
    SubmissionType VARCHAR(50) NOT NULL CHECK (SubmissionType IN ('file', 'link')),
    AnswerKey VARCHAR(255), 
    Rubric VARCHAR(255),  
    Prompt TEXT,
    MaxScore INT,
    AverageScore FLOAT,
    StartDate TIMESTAMP(3) NOT NULL,
    EndDate TIMESTAMP(3) NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Creating the Submissions table
CREATE TABLE Submissions (
    SubmissionID SERIAL PRIMARY KEY,
    AssignmentID INT NOT NULL,
    UserID INT NOT NULL,
    SubmissionDate TIMESTAMP(3) NOT NULL,
    ContentType VARCHAR(50) NOT NULL CHECK (ContentType IN ('html', 'css', 'js', 'link')),
    ContentLink VARCHAR(255),
    Content TEXT,
    Grade FLOAT,
    Feedback TEXT,
    FOREIGN KEY (AssignmentID) REFERENCES Assignments(AssignmentID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Creating the Announcements table
CREATE TABLE Announcements (
    AnnouncementID SERIAL PRIMARY KEY,
    CourseID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Content TEXT NOT NULL,
    DatePosted TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Inserting roles into the Roles table
INSERT INTO Roles (RoleName) VALUES ('Student');
INSERT INTO Roles (RoleName) VALUES ('Admin');
INSERT INTO Roles (RoleName) VALUES ('Instructor');
INSERT INTO Roles (RoleName) VALUES ('TA');


INSERT INTO Courses (Term, StartDate, EndDate) 
VALUES (1, '2024-06-01 09:00:00', '2024-12-15 17:00:00');


INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleID)
VALUES ('Default', 'Instructor', 'default_instructor@example.com', '$2b$10$fMbnqtpNG3vc8qBdLXUstu3xbRNI8bKxv8f0DswC1i0BA/UveDWw.', 3);


INSERT INTO Courses (Term, StartDate, EndDate, AccessCode)
VALUES (1, '2022-01-01 00:00:00', '2022-12-31 23:59:59', 'default_access_code');

INSERT INTO CourseInstructors (CourseID, UserID, Role)
VALUES (1, 1, 'Instructor');
