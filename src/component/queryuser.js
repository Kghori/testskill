

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { dbApp1, dbApp2 } from "../firebase/firebaseConfig"; // Correct Firestore import
import SkillSelector from "./skillselector"; // Assuming this selects skills by id

const QueryUsers = () => {
  const [formData, setFormData] = useState({
    skills: [], // Initialize empty array for selected skills' ids
  });
  const [users, setUsers] = useState([]);    // To store matching users
  const [error, setError] = useState("");    // To store error messages
  const [loading, setLoading] = useState(false);  // For loading state
  const [skillNames, setSkillNames] = useState({}); // Store skill names by ID

  // Fetch skill names by IDs when selected skills change
  useEffect(() => {
    const fetchSkillNames = async () => {
      const names = {};
      for (const skillId of formData.skills) {
        const skillName = await getSkillNameById(skillId);
        names[skillId] = skillName;
      }
      setSkillNames(names);
    };

    if (formData.skills?.length > 0) {
      fetchSkillNames();
    }
  }, [formData.skills]);

  // Fetch skill name by ID from Firestore
  const getSkillNameById = async (id) => {
    try {
      const skillDocRef = doc(dbApp2, "skills", id);
      const skillDoc = await getDoc(skillDocRef);
      if (skillDoc.exists()) {
        return skillDoc.data()?.name || skillDoc.data()?.name;
      } else {
        return "Unnamed";
      }
    } catch (error) {
      console.error("Error fetching skill name by id:", error);
      return "Unnamed";
    }
  };

  // Query users based on selected skills
  const queryUsers = async (e) => {
    e.preventDefault();

    if (formData.skills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    setUsers([]);
    setError("");
    setLoading(true);

    try {
      const usersCollection = collection(dbApp1, "users");

      const userResults = new Set(); // To store unique users
      const skillCounts = new Map(); // To track the number of matched skills for each user

      // Query users for each selected skill and track matches
      for (const skillId of formData.skills) {
        const skillQuery = query(usersCollection, where("skills", "array-contains", skillId));
        const querySnapshot = await getDocs(skillQuery);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userId = doc.id;

          // Track how many skills this user has matched
          if (!skillCounts.has(userId)) {
            skillCounts.set(userId, 0);
          }
          skillCounts.set(userId, skillCounts.get(userId) + 1);

          userResults.add({
            id: userId,
            name: userData.name,
            skills: userData.skills,
          });
        });
      }

      // Filter users who match the required number of skills
      const filteredUsers = [...userResults].filter((user) => {
        // Only return users who match at least the number of selected skills
        return skillCounts.get(user.id) === formData.skills.length;
      });

      // If no matching users are found
      if (filteredUsers.length === 0) {
        setError("No users found with the provided skills.");
      } else {
        setUsers(filteredUsers);
      }
    } catch (error) {
      setError("Error querying users. Please try again later.");
      console.error("Error querying users:", error);
    } finally {
      setLoading(false);  // Stop loading after query completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Admin Panel</h2>
      <form onSubmit={queryUsers} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <SkillSelector
            label="Skills"
            selectedSkills={formData.skills} // Pass selected skills (ids) to SkillSelector
            onSkillSelect={(skills) =>
              setFormData((prev) => ({ ...prev, skills })) // Update selected skills in formData
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300"
        >
          {loading ? "Loading..." : "Query Users"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {users.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-500 mt-2">
                Skills:{" "}
                {user.skills
  .map((skillId) => skillNames[skillId] || "Unnamed") // Map skillId to skillName, fallback to "Unnamed"
  .filter((skill) => skill !== "") // Remove empty or undefined skills
  .join(", ")} 

              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No users to display</p>
      )}
    </div>
  );
};

export default QueryUsers;
