// import React, { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { dbApp1 } from "../firebase/firebaseConfig"; // Correctly importing Firestore
// import SkillSelector from "./skillselector";
// const AddUser = () => {
//   const [name, setName] = useState("");
//   const [skills, setSkills] = useState("");
//   const defaultFormData = {
//     skills:[]}
//   const [formData, setFormData] = useState(defaultFormData);
//   const addUser = async (e) => {
//     e.preventDefault();
//     // Split the skills into an array and sort them
//     const skillArray = skills.split(",").map(skill => skill.trim()).sort();
//     const skillSetKey = skillArray.join(",");
//     const userDoc = {
//       name,
//       skills: skillArray,
//       skillSetKey,
//     };
//     try {
//       // Adding document to Firestore, Firestore auto-generates the document ID
//       const docRef = await addDoc(collection(dbApp1, "users"), userDoc);
//       console.log("User added with ID:", docRef.id);
//       alert("User added successfully!");
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Error adding user. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>userside data</h2>
//       <form onSubmit={addUser}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Skills (comma-separated)"
//           value={skills}
//           onChange={(e) => setSkills(e.target.value)}
//         />
//            {/* <div>
//                           <SkillSelector
//                             label="Skills"
//                             selectedSkills={formData.skills}
//                             onSkillSelect={(skills) =>
//                               setFormData((prev) => ({ ...prev, skills }))
//                             }
//                           />{" "}
//                         </div> */}
//         <button type="submit">Add User</button>
//       </form>
//     </div>
//   );
// };

// export default AddUser;
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { dbApp1 } from "../firebase/firebaseConfig"; // Correctly importing Firestore
import SkillSelector from "./skillselector";

const AddUser = () => {
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({
    skills: [], // Initial state for skills
  });

  const addUser = async (e) => {
    e.preventDefault();
    // If skills are selected, sort and create a key for the skill set
    const skillArray = formData.skills.map((skill) => skill.trim()).sort();
    const skillSetKey = skillArray.join(",");

    const userDoc = {
      name,
      skills: skillArray,
      skillSetKey,
    };

    try {
      // Adding document to Firestore, Firestore auto-generates the document ID
      const docRef = await addDoc(collection(dbApp1, "users"), userDoc);
      console.log("User added with ID:", docRef.id);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
    <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">Add User</h2>

    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={addUser}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Add User
        </button>
      </form>
    </div>
  </div>);
};

export default AddUser;
