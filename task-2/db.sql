CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    admission_year INT
);

CREATE TABLE Disciplines (
    discipline_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    credits INT,
    hours INT
);

CREATE TABLE Student_Disciplines (
    student_id INT,
    discipline_id INT,
    group_number INT,
    PRIMARY KEY (student_id, discipline_id), 
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_id) REFERENCES Disciplines(discipline_id) ON DELETE CASCADE
);


SELECT 
    s.full_name, 
    s.email
FROM 
    Students s
JOIN 
    Student_Disciplines sd ON s.student_id = sd.student_id
JOIN 
    Disciplines d ON sd.discipline_id = d.discipline_id
WHERE 
    d.name = 'Програмування' 
    AND sd.group_number = 5;