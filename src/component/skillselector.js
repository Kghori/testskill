import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { dbApp2 } from "../firebase/firebaseConfig"; // Ensure correct Firestore import

const SkillSelector = ({ label, selectedSkills, onSkillSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // Manage dropdown visibility
  const [searchTerm, setSearchTerm] = useState(""); // Manage search term
  const [skills, setSkills] = useState([]); // Store fetched skills
  const [loading, setLoading] = useState(false); // Handle loading state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // For debouncing
  const [skillNames, setSkillNames] = useState({}); // Store skill names by ID

  // Function to fetch skill names for all selected skills
  useEffect(() => {
    const fetchSkillNames = async () => {
      const names = {};
      for (const skillId of selectedSkills) {
        const skillName = await getSkillNameById(skillId);
        names[skillId] = skillName;
      }
      setSkillNames(names);
    };

    if (selectedSkills?.length > 0) {
      fetchSkillNames();
    }
  }, [selectedSkills]);

  // Fetch skill name by ID from Firestore
  const getSkillNameById = async (id) => {
    try {
      const skillDocRef = doc(dbApp2, "skills", id);
      const skillDoc = await getDoc(skillDocRef);
      if (skillDoc.exists()) {
        return skillDoc.data()?.name || "Unnamed";
      } else {
        return "Unnamed";
      }
    } catch (error) {
      console.error("Error fetching skill name by id:", error);
      return "Unnamed";
    }
  };

  // Fetch initial skills (10 skills max)
  const fetchInitialSkills = useCallback(async () => {
    setLoading(true);
    try {
      const skillsRef = collection(dbApp2, "skills");
      const initialQuery = query(skillsRef, limit(10));
      const querySnapshot = await getDocs(initialQuery);

      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed",
      }));

      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching initial skills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch filtered skills based on the search term
  const fetchFilteredSkills = useCallback(async () => {
    if (!debouncedSearchTerm) {
      fetchInitialSkills();
      return;
    }

    setLoading(true);
    try {
      const skillsRef = collection(dbApp2, "skills");
      const normalizedSearchTerm = debouncedSearchTerm.replace(/\s+/g, "").toLowerCase();
      const searchQuery = query(
        skillsRef,
        where("nameSearch", ">=", normalizedSearchTerm),
        where("nameSearch", "<", normalizedSearchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(searchQuery);
      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed",
      }));
      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching filtered skills:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, fetchInitialSkills]);

  // Debounce logic for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch filtered skills when debounced search term changes
  useEffect(() => {
    fetchFilteredSkills();
  }, [debouncedSearchTerm, fetchFilteredSkills]);

  // Handle skill selection
  const handleSkillSelect = async (id) => {
    if (id && !selectedSkills?.includes(id)) {
      onSkillSelect([...selectedSkills, id]);
    }
    setIsOpen(false);
  };

  // Handle skill removal
  const handleSkillRemove = (skillId) => {
    onSkillSelect(selectedSkills.filter((skill) => skill !== skillId));
  };

  return (
    <div className="flex-1">
      <label htmlFor="skills" className="block mb-1 text-gray-900">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills?.map((skillId, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
            {skillNames[skillId] ? skillNames[skillId] : "Loading..."}
            <button
              onClick={() => handleSkillRemove(skillId)}
              className="ml-2 text-blue-700 hover:text-blue-900"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div
        className="h-10 border flex items-center rounded px-4 w-full bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Skills
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-56 bg-white border rounded-md shadow-lg z-10">
          <ul className="h-auto overflow-y-auto">
            <li className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a Skill..."
                className="h-10 w-full border rounded px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </li>
            {loading ? (
              <li className="p-2 text-gray-500">Loading...</li>
            ) : skills.length > 0 ? (
              skills.map((skill, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSkillSelect(skill?.id)}
                >
                  {skill.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No skills found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(SkillSelector);
