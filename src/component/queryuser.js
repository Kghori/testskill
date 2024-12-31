import React, { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc, where } from "firebase/firestore";
import { dbApp1, dbApp2 } from "../firebase/firebaseConfig";
import SkillSelector from "./skillselector";

const QueryUsers = () => {
  const [formData, setFormData] = useState({
    skills: [],
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [skillNames, setSkillNames] = useState({});

  // Fetch skill names for all skills in Firestore when users are queried
  const fetchAllSkillNames = async () => {
    try {
      const skillsCollection = collection(dbApp2, "skills");
      const querySnapshot = await getDocs(skillsCollection);
      const names = {};
      querySnapshot.forEach((doc) => {
        names[doc.id] = doc.data().name || "Unnamed";
      });
      setSkillNames(names);
    } catch (error) {
      console.error("Error fetching all skill names:", error);
    }
  };

  useEffect(() => {
    fetchAllSkillNames();
  }, []);

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

      // Fetch users with at least one matching skill
      const skillQuery = query(
        usersCollection,
        where("skills", "array-contains-any", formData.skills) // Matches at least one skill
      );
      const querySnapshot = await getDocs(skillQuery);

      const matchedUsers = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userSkills = new Set(userData.skills); // Convert user's skills to a set

        // Check if the user's skills include all the selected skills
        const hasAllSkills = formData.skills.every((skill) => userSkills.has(skill));
        if (hasAllSkills) {
          matchedUsers.push({
            id: doc.id,
            name: userData.name,
            skills: userData.skills,
          });
        }
      });

      if (matchedUsers.length === 0) {
        setError("No users found with the provided skills.");
      } else {
        setUsers(matchedUsers);
      }
    } catch (error) {
      setError("Error querying users. Please try again later.");
      console.error("Error querying users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Admin Panel</h2>
      <form onSubmit={queryUsers} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <SkillSelector
            label="Skills"
            selectedSkills={formData.skills}
            onSkillSelect={(skills) =>
              setFormData((prev) => ({ ...prev, skills }))
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
                  .map((skillId) => skillNames[skillId] || "Unnamed")
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
