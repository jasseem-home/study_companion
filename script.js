// Import necessary Firebase modules
import { ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { database } from './firebase-config.js'; // Assuming this is your firebase config file

document.addEventListener("DOMContentLoaded", () => {
  const courseTableBody = document.getElementById("courseTableBody");
  const courseNameInput = document.getElementById("courseNameInput");
  const courseProgressInput = document.getElementById("courseProgressInput");
  const addCourseBtn = document.getElementById("addCourseBtn");

  // Function to retrieve and render all courses from Firebase Realtime Database
  function renderCourses() {
    const coursesRef = ref(database, 'courses/'); // Reference to the courses node in Firebase DB

    get(coursesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const courses = snapshot.val();  // Get courses data from Firebase
        console.log("Courses data: ", courses);

        courseTableBody.innerHTML = "";  // Clear existing table rows
        Object.keys(courses).forEach((key) => {
          const course = courses[key];
          const row = `
            <tr data-key="${key}">
              <td contenteditable="true" class="course-name">${course.name}</td>
              <td contenteditable="true" class="course-progress">${course.progress}%</td>
              <td>
                <button class="edit-btn" onclick="toggleEditMode('${key}')">Edit</button>
                <button class="delete-btn" onclick="deleteCourse('${key}')">Delete</button>
              </td>
            </tr>
          `;
          courseTableBody.innerHTML += row;  // Add row for each course
        });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  // Add course to Firebase
  addCourseBtn.addEventListener("click", () => {
    const courseName = courseNameInput.value.trim();
    const courseProgress = courseProgressInput.value.trim();

    // Validate inputs (only for new courses)
    if (courseName && courseProgress >= 0 && courseProgress <= 100) {
      const courseRef = ref(database, 'courses/' + Date.now()); // Create a unique key for the new course
      set(courseRef, {
        name: courseName,
        progress: courseProgress,
      }).then(() => {
        console.log("Course added successfully!");
        renderCourses();  // Refresh the courses table

        // Clear input fields after adding the course
        courseNameInput.value = '';
        courseProgressInput.value = '';
      }).catch((error) => {
        console.error("Error adding course:", error);
      });
    } else {
      alert("Please enter valid course name and progress (0-100).");
    }
  });

  // Toggle Edit mode to allow updating the course details
  window.toggleEditMode = (key) => {
    const row = document.querySelector(`tr[data-key="${key}"]`);
    const courseNameCell = row.querySelector('.course-name');
    const courseProgressCell = row.querySelector('.course-progress');
    const editButton = row.querySelector('.edit-btn');

    if (editButton.innerText === "Edit") {
      // Switch to edit mode
      courseNameCell.contentEditable = true;
      courseProgressCell.contentEditable = true;
      editButton.innerText = "Save";
    } else {
      // No validation during edit
      const updatedCourseName = courseNameCell.innerText.trim();
      const updatedCourseProgress = courseProgressCell.innerText.trim();

      const courseRef = ref(database, 'courses/' + key);
      update(courseRef, {
        name: updatedCourseName,
        progress: updatedCourseProgress,
      }).then(() => {
        console.log("Course updated successfully!");
        renderCourses();  // Refresh the courses table
      }).catch((error) => {
        console.error("Error updating course:", error);
      });

      // Switch back to view mode
      courseNameCell.contentEditable = false;
      courseProgressCell.contentEditable = false;
      editButton.innerText = "Edit";
    }
  };

  // Delete course
  window.deleteCourse = (key) => {
    const courseRef = ref(database, 'courses/' + key);
    remove(courseRef).then(() => {
      console.log("Course deleted successfully!");
      renderCourses();  // Refresh the courses table
    }).catch((error) => {
      console.error("Error deleting course:", error);
    });
  };

  // Initial render of courses when the page is loaded
  renderCourses();
});
